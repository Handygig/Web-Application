<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\RewardSetting;
use App\Models\RewardTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $customerQuery = Customer::with(['user', 'referrer.user'])
            ->withCount('referrals');

        if ($search) {
            $customerQuery->where(function ($q) use ($search) {
                $q->where('referral_code', 'like', "%{$search}%")
                    ->orWhere('membership_tier', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('full_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $customers = $customerQuery->orderByDesc('reward_points')
            ->paginate(10)
            ->withQueryString();

        $transactions = RewardTransaction::with('customer.user')
            ->latest()
            ->paginate(15, ['*'], 'tx_page')
            ->withQueryString();

        $settings = RewardSetting::allSettings();

        $stats = [
            'total_points_distributed' => (int) RewardTransaction::where('points', '>', 0)->sum('points'),
            'total_wallet_balance' => (float) Customer::sum('wallet_balance'),
            'total_referrals' => Customer::whereNotNull('referred_by_id')->count(),
            'total_points_redeemed' => (int) abs(RewardTransaction::where('type', 'points_redeemed')->sum('points')),
        ];

        return Inertia::render('Admin/Reward/Index', [
            'settings' => $settings,
            'customers' => $customers,
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'points_per_dollar' => 'required|integer|min:1',
            'points_redemption_rate' => 'required|integer|min:1',
            'referrer_bonus' => 'required|numeric|min:0',
            'referee_discount' => 'required|numeric|min:0',
            'welcome_bonus_points' => 'required|integer|min:0',
            'silver_points_threshold' => 'required|integer|min:0',
            'gold_points_threshold' => 'required|integer|min:0',
            'platinum_points_threshold' => 'required|integer|min:0',
        ]);

        foreach ($validated as $key => $value) {
            RewardSetting::set($key, $value);
        }

        AuditLog::log(
            auth()->id(),
            'Reward settings updated',
            'RewardSetting',
            null,
            'Updated global rewards and referral configuration',
            $validated
        );

        return redirect()->back()->with('success', __('Reward settings updated successfully.'));
    }

    public function adjustCustomerBalance(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'adjustment_type' => 'required|in:points,wallet',
            'operation' => 'required|in:add,deduct',
            'amount' => 'required|numeric|min:1',
            'reason' => 'required|string|max:255',
        ]);

        $amount = (float) $validated['amount'];
        $operation = $validated['operation'];
        $type = $validated['adjustment_type'];
        $reason = $validated['reason'];

        DB::transaction(function () use ($customer, $amount, $operation, $type, $reason) {
            if ($type === 'points') {
                $points = (int) $amount;
                if ($operation === 'deduct') {
                    $points = -abs($points);
                    $newTotal = max(0, $customer->reward_points + $points);
                    $customer->reward_points = $newTotal;
                } else {
                    $customer->reward_points += $points;
                }
                $customer->save();

                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => $operation === 'add' ? 'points_earned' : 'points_redeemed',
                    'points' => $points,
                    'amount' => 0.00,
                    'description' => "Admin adjustment ({$operation}): {$reason}",
                ]);
            } else {
                $money = $amount;
                if ($operation === 'deduct') {
                    $money = -abs($money);
                    $newTotal = max(0, (float) $customer->wallet_balance + $money);
                    $customer->wallet_balance = $newTotal;
                } else {
                    $customer->wallet_balance += $money;
                }
                $customer->save();

                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => $operation === 'add' ? 'wallet_credit' : 'wallet_debit',
                    'points' => 0,
                    'amount' => $money,
                    'description' => "Admin adjustment ({$operation}): {$reason}",
                ]);
            }
        });

        AuditLog::log(
            auth()->id(),
            'Customer balance adjusted',
            'Customer',
            $customer->id,
            "Adjusted {$type} for {$customer->user->name}: {$operation} {$amount}. Reason: {$reason}"
        );

        return redirect()->back()->with('success', __('Customer balance updated successfully.'));
    }
}
