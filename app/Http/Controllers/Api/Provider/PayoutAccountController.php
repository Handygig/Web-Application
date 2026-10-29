<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\StorePayoutAccountRequest;
use App\Http\Resources\Api\Provider\ProviderPayoutAccountResource;
use App\Models\PayoutAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PayoutAccountController extends Controller
{
    /**
     * Display a listing of provider/company payout accounts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $query = PayoutAccount::query();

        if ($company) {
            $query->where('company_id', $company->id);
        } elseif ($provider) {
            $query->where('provider_id', $provider->id);
        }

        $accounts = $query->latest()->get();

        return ProviderPayoutAccountResource::collection($accounts);
    }

    /**
     * Store a newly created payout account.
     */
    public function store(StorePayoutAccountRequest $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $providerId = $provider?->id;
        $companyId = $company?->id;

        $isDefault = $request->boolean('is_default');

        // If setting as default or if this is the first account, set as default
        $existingCount = PayoutAccount::where(function ($q) use ($providerId, $companyId) {
            if ($companyId) {
                $q->where('company_id', $companyId);
            } elseif ($providerId) {
                $q->where('provider_id', $providerId);
            }
        })->count();

        if ($existingCount === 0) {
            $isDefault = true;
        } elseif ($isDefault) {
            PayoutAccount::where(function ($q) use ($providerId, $companyId) {
                if ($companyId) {
                    $q->where('company_id', $companyId);
                } elseif ($providerId) {
                    $q->where('provider_id', $providerId);
                }
            })->update(['is_default' => false]);
        }

        $account = PayoutAccount::create([
            'provider_id' => $companyId ? null : $providerId,
            'company_id' => $companyId,
            'bank_name' => $request->bank_name,
            'branch_name' => $request->branch_name,
            'account_holder_name' => $request->account_holder_name,
            'account_number' => $request->account_number,
            'routing_number' => $request->routing_number,
            'swift_code' => $request->swift_code,
            'is_default' => $isDefault,
        ]);

        return (new ProviderPayoutAccountResource($account))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified payout account.
     */
    public function update(StorePayoutAccountRequest $request, PayoutAccount $payoutAccount): JsonResponse
    {
        $this->authorizeAccountAccess($request, $payoutAccount);

        $payoutAccount->update([
            'bank_name' => $request->bank_name,
            'branch_name' => $request->branch_name,
            'account_holder_name' => $request->account_holder_name,
            'account_number' => $request->account_number,
            'routing_number' => $request->routing_number,
            'swift_code' => $request->swift_code,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('Payout account updated successfully.'),
            'data' => new ProviderPayoutAccountResource($payoutAccount),
        ]);
    }

    /**
     * Set a payout account as default.
     */
    public function setDefault(Request $request, PayoutAccount $payoutAccount): JsonResponse
    {
        $this->authorizeAccountAccess($request, $payoutAccount);

        $providerId = $payoutAccount->provider_id;
        $companyId = $payoutAccount->company_id;

        PayoutAccount::where(function ($q) use ($providerId, $companyId) {
            if ($companyId) {
                $q->where('company_id', $companyId);
            } elseif ($providerId) {
                $q->where('provider_id', $providerId);
            }
        })->update(['is_default' => false]);

        $payoutAccount->update(['is_default' => true]);

        return response()->json([
            'status' => 'success',
            'message' => __('Payout account set as default successfully.'),
            'data' => new ProviderPayoutAccountResource($payoutAccount),
        ]);
    }

    /**
     * Remove the specified payout account.
     */
    public function destroy(Request $request, PayoutAccount $payoutAccount): JsonResponse
    {
        $this->authorizeAccountAccess($request, $payoutAccount);

        $payoutAccount->delete();

        return response()->json([
            'status' => 'success',
            'message' => __('Payout account removed successfully.'),
        ]);
    }

    protected function authorizeAccountAccess(Request $request, PayoutAccount $payoutAccount): void
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $hasAccess = false;
        if ($provider && $payoutAccount->provider_id === $provider->id) {
            $hasAccess = true;
        } elseif ($company && $payoutAccount->company_id === $company->id) {
            $hasAccess = true;
        }

        if (! $hasAccess) {
            abort(403, __('Unauthorized access to this payout account.'));
        }
    }
}
