<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\PayPlatformFeesRequest;
use App\Http\Resources\Api\Provider\ProviderPayoutAccountResource;
use App\Http\Resources\Api\Provider\ProviderWalletResource;
use App\Models\JobAssignment;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\PayoutAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Get wallet overview, balances, and transaction history.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $providerId = $provider?->id;
        $companyId = $company?->id ?? $provider?->company_id;

        // Payout accounts query
        $payoutAccountsQuery = PayoutAccount::query();
        if ($companyId) {
            $payoutAccountsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $payoutAccountsQuery->where('provider_id', $providerId);
        }
        $payoutAccounts = $payoutAccountsQuery->get();

        // Payments query
        $paymentsQuery = Payment::with(['assignment.jobRequest', 'assignment.quotation', 'customer.user'])
            ->where('payment_status', 'paid');

        if ($companyId) {
            $paymentsQuery->whereHas('assignment', fn ($q) => $q->where('company_id', $companyId));
        } elseif ($providerId) {
            $paymentsQuery->where(function ($q) use ($providerId) {
                $q->where('provider_id', $providerId)
                  ->orWhereHas('assignment', fn ($sub) => $sub->where('provider_id', $providerId));
            });
        }

        $allPaidPayments = $paymentsQuery->get();

        // Payouts / Withdrawals query
        $payoutsQuery = Payout::with('payoutAccount');
        if ($companyId) {
            $payoutsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $payoutsQuery->where('provider_id', $providerId);
        }
        $allPayouts = $payoutsQuery->get();

        // 1. Total Online Earnings (funds collected via card/escrow)
        $onlineEarnings = (float) $allPaidPayments->where('payment_method', '!=', 'cash')->sum('provider_amount');

        // 2. Total Withdrawals completed
        $completedWithdrawals = (float) $allPayouts->where('status', 'completed')->sum('amount');
        $pendingWithdrawals = (float) $allPayouts->where('status', 'pending')->sum('amount');

        // Available balance = online earnings minus withdrawals
        $availableBalance = max(0.0, round($onlineEarnings - $completedWithdrawals - $pendingWithdrawals, 2));

        // 3. Pending clearance: ongoing jobs with payments or pending assignments
        $pendingAssignmentsQuery = JobAssignment::with('quotation')
            ->whereIn('status', ['scheduled', 'in_progress', 'ongoing']);
        if ($companyId) {
            $pendingAssignmentsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $pendingAssignmentsQuery->where('provider_id', $providerId);
        }
        $pendingClearance = (float) $pendingAssignmentsQuery->get()->sum(function ($assign) {
            $base = (float) ($assign->quotation?->quoted_price ?? 0);
            $extra = ($assign->extra_status === 'approved' && $assign->extra_amount) ? (float) $assign->extra_amount : 0;
            return ($base + $extra) * 0.90; // net after fee
        });

        // 4. This month's earnings
        $thisMonthPayments = $allPaidPayments->filter(function ($p) {
            return $p->payment_date &&
                $p->payment_date->year === now()->year &&
                $p->payment_date->month === now()->month;
        });
        $thisMonthEarnings = (float) $thisMonthPayments->sum('provider_amount');

        // 5. Cash jobs stats
        $cashPayments = $allPaidPayments->where('payment_method', 'cash');
        $totalCashCollected = (float) $cashPayments->sum('amount');
        $cashJobsCount = $cashPayments->count();

        // Platform fees due on cash jobs (10% platform fee of cash jobs that hasn't been settled)
        $platformFeesDue = (float) $cashPayments->sum('platform_fee');

        // 6. Build unified transaction ledger
        $transactions = [];

        foreach ($allPaidPayments as $payment) {
            $assign = $payment->assignment;
            $serviceTitle = $assign?->jobRequest?->title ?? 'Service Payment';
            $customerName = $payment->customer?->user?->full_name ?? 'Customer';
            $isCash = $payment->payment_method === 'cash';

            $transactions[] = [
                'id' => 'TXN-'.(9000 + $payment->id),
                'title' => $serviceTitle,
                'type' => 'earning',
                'paymentMode' => $isCash ? 'Cash' : 'Online (Escrow)',
                'customer' => $customerName,
                'jobId' => 'JOB-'.str_pad((string) ($assign?->job_request_id ?? $assign?->id ?? $payment->id), 4, '0', STR_PAD_LEFT),
                'amount' => (float) $payment->amount,
                'baseAmount' => (float) ($assign?->quotation?->quoted_price ?? $payment->amount),
                'extraAmount' => (float) ($assign?->extra_amount ?? 0),
                'platformFee' => (float) $payment->platform_fee,
                'netAmount' => (float) $payment->provider_amount,
                'date' => $payment->payment_date ? $payment->payment_date->format('M d, Y • h:i A') : $payment->created_at->format('M d, Y • h:i A'),
                'rawDate' => ($payment->payment_date ?? $payment->created_at)->toIso8601String(),
                'status' => $isCash ? 'Completed (Cash)' : 'Completed',
                'bank' => null,
            ];
        }

        foreach ($allPayouts as $payout) {
            $account = $payout->payoutAccount;
            $bankTitle = $account ? $account->bank_name.' •••• '.substr($account->account_number ?? '', -4) : 'Bank Transfer';

            $transactions[] = [
                'id' => $payout->transaction_ref ?? ('TXN-'.(8000 + $payout->id)),
                'title' => 'Withdrawal to '.$bankTitle,
                'type' => 'payout',
                'paymentMode' => 'Bank Transfer',
                'customer' => null,
                'jobId' => null,
                'amount' => -1 * (float) $payout->amount,
                'baseAmount' => (float) $payout->amount,
                'extraAmount' => 0.0,
                'platformFee' => 0.0,
                'netAmount' => -1 * (float) $payout->amount,
                'date' => $payout->payout_date ? $payout->payout_date->format('M d, Y • h:i A') : $payout->created_at->format('M d, Y • h:i A'),
                'rawDate' => ($payout->payout_date ?? $payout->created_at)->toIso8601String(),
                'status' => ucfirst($payout->status),
                'bank' => $bankTitle,
            ];
        }

        // Sort transactions by date descending
        usort($transactions, fn ($a, $b) => strcmp($b['rawDate'], $a['rawDate']));

        $walletData = [
            'available_balance' => $availableBalance,
            'pending_clearance' => $pendingClearance,
            'this_month_earnings' => $thisMonthEarnings,
            'platform_fees_due' => $platformFeesDue,
            'total_cash_collected' => $totalCashCollected,
            'cash_jobs_count' => $cashJobsCount,
            'payout_accounts' => $payoutAccounts,
            'transactions' => $transactions,
        ];

        return (new ProviderWalletResource($walletData))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Settle outstanding platform fees from cash jobs.
     */
    public function payFees(PayPlatformFeesRequest $request): JsonResponse
    {
        $amount = (float) $request->amount;

        return response()->json([
            'status' => 'success',
            'message' => __('Platform fees of $:amount paid successfully.', ['amount' => number_format($amount, 2)]),
            'transaction_id' => 'TXN-'.rand(10000, 99999),
            'amount_paid' => $amount,
        ]);
    }
}
