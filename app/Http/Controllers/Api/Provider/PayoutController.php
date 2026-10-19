<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\StorePayoutRequest;
use App\Http\Resources\Api\Provider\ProviderPayoutResource;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\PayoutAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PayoutController extends Controller
{
    /**
     * Display a listing of payouts / withdrawals.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $query = Payout::with('payoutAccount');

        if ($company) {
            $query->where('company_id', $company->id);
        } elseif ($provider) {
            $query->where('provider_id', $provider->id);
        }

        $payouts = $query->latest()->get();

        return ProviderPayoutResource::collection($payouts);
    }

    /**
     * Request a new withdrawal to bank account.
     */
    public function store(StorePayoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $providerId = $provider?->id;
        $companyId = $company?->id ?? $provider?->company_id;

        // Resolve payout account
        $account = null;
        if ($request->filled('payout_account_id')) {
            $account = PayoutAccount::where('id', $request->payout_account_id)
                ->where(function ($q) use ($providerId, $companyId) {
                    if ($companyId) {
                        $q->where('company_id', $companyId);
                    } elseif ($providerId) {
                        $q->where('provider_id', $providerId);
                    }
                })->first();
        } else {
            $account = $company
                ? $company->defaultPayoutAccount()
                : ($provider ? $provider->defaultPayoutAccount() : null);
        }

        if (! $account) {
            return response()->json([
                'message' => __('Please link a valid payout bank account before requesting a withdrawal.'),
            ], 422);
        }

        $amount = (float) $request->amount;

        // Calculate available balance to verify funds
        $paymentsQuery = Payment::where('payment_status', 'paid')
            ->where('payment_method', '!=', 'cash');

        if ($companyId) {
            $paymentsQuery->whereHas('assignment', fn ($q) => $q->where('company_id', $companyId));
        } elseif ($providerId) {
            $paymentsQuery->where(function ($q) use ($providerId) {
                $q->where('provider_id', $providerId)
                  ->orWhereHas('assignment', fn ($sub) => $sub->where('provider_id', $providerId));
            });
        }

        $onlineEarnings = (float) $paymentsQuery->sum('provider_amount');

        $payoutsQuery = Payout::query();
        if ($companyId) {
            $payoutsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $payoutsQuery->where('provider_id', $providerId);
        }
        $existingWithdrawals = (float) $payoutsQuery->whereIn('status', ['completed', 'pending'])->sum('amount');

        $availableBalance = max(0.0, round($onlineEarnings - $existingWithdrawals, 2));

        if ($amount > $availableBalance) {
            return response()->json([
                'message' => __('Insufficient available balance. You have $:balance available.', [
                    'balance' => number_format($availableBalance, 2),
                ]),
            ], 422);
        }

        $payout = Payout::create([
            'provider_id' => $companyId ? null : $providerId,
            'company_id' => $companyId,
            'payout_account_id' => $account->id,
            'amount' => $amount,
            'status' => 'pending',
            'payout_date' => now(),
            'transaction_ref' => 'TXN-'.rand(8000, 9999),
        ]);

        $payout->load('payoutAccount');

        return (new ProviderPayoutResource($payout))
            ->response()
            ->setStatusCode(201);
    }
}
