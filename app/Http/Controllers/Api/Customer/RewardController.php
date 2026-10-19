<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\RewardSetting;
use App\Models\RewardTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RewardController extends Controller
{
    /**
     * Get the authenticated customer's rewards profile, balance, and recent ledger.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $customer = $user->customer;

        if (! $customer) {
            $customer = Customer::create([
                'user_id' => $user->id,
                'reward_points' => 1250,
                'wallet_balance' => 45.00,
                'membership_tier' => 'Gold Member',
            ]);
        }

        $settings = RewardSetting::allSettings();

        $transactions = $customer->rewardTransactions()
            ->take(20)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'reward_points' => $customer->reward_points,
                'wallet_balance' => (float) $customer->wallet_balance,
                'membership_tier' => $customer->membership_tier,
                'referral_code' => $customer->referral_code,
                'referrals_count' => $customer->referrals()->count(),
                'settings' => [
                    'points_redemption_rate' => (int) ($settings['points_redemption_rate'] ?? 100),
                    'referrer_bonus' => (float) ($settings['referrer_bonus'] ?? 20.00),
                    'referee_discount' => (float) ($settings['referee_discount'] ?? 20.00),
                    'points_per_dollar' => (int) ($settings['points_per_dollar'] ?? 10),
                ],
                'transactions' => $transactions,
            ],
        ]);
    }

    /**
     * Redeem reward points for wallet credits.
     */
    public function redeem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'points' => 'required|integer|min:100',
        ]);

        $user = $request->user();
        $customer = $user->customer;

        if (! $customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer account not found.',
            ], 404);
        }

        $pointsToRedeem = (int) $validated['points'];

        if ($customer->reward_points < $pointsToRedeem) {
            return response()->json([
                'status' => 'error',
                'message' => "Insufficient points. You only have {$customer->reward_points} points.",
            ], 422);
        }

        $settings = RewardSetting::allSettings();
        $rate = max(1, (int) ($settings['points_redemption_rate'] ?? 100)); // points per $1
        $creditAmount = round($pointsToRedeem / $rate, 2);

        return DB::transaction(function () use ($customer, $pointsToRedeem, $creditAmount) {
            $customer->decrement('reward_points', $pointsToRedeem);
            $customer->increment('wallet_balance', $creditAmount);
            $customer->refresh();

            $transaction = RewardTransaction::create([
                'customer_id' => $customer->id,
                'type' => 'points_redeemed',
                'points' => -$pointsToRedeem,
                'amount' => $creditAmount,
                'description' => "Redeemed {$pointsToRedeem} points for \${$creditAmount} wallet credit",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Successfully redeemed {$pointsToRedeem} points for \${$creditAmount} wallet credit!",
                'data' => [
                    'reward_points' => $customer->reward_points,
                    'wallet_balance' => (float) $customer->wallet_balance,
                    'membership_tier' => $customer->membership_tier,
                    'transaction' => $transaction,
                ],
            ]);
        });
    }

    /**
     * Apply a friend's referral code.
     */
    public function applyReferral(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'referral_code' => 'required|string',
        ]);

        $user = $request->user();
        $customer = $user->customer;

        if (! $customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer account not found.',
            ], 404);
        }

        if ($customer->referred_by_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already applied a referral code.',
            ], 422);
        }

        $code = strtoupper(trim($validated['referral_code']));

        if ($customer->referral_code === $code) {
            return response()->json([
                'status' => 'error',
                'message' => 'You cannot use your own referral code.',
            ], 422);
        }

        $referrer = Customer::where('referral_code', $code)->first();

        if (! $referrer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Referral code not found.',
            ], 404);
        }

        $settings = RewardSetting::allSettings();
        $refereeDiscount = (float) ($settings['referee_discount'] ?? 20.00);
        $referrerBonus = (float) ($settings['referrer_bonus'] ?? 20.00);

        return DB::transaction(function () use ($customer, $referrer, $refereeDiscount, $referrerBonus) {
            $customer->update(['referred_by_id' => $referrer->id]);

            // Give referee discount/credit
            $customer->increment('wallet_balance', $refereeDiscount);
            RewardTransaction::create([
                'customer_id' => $customer->id,
                'type' => 'wallet_credit',
                'points' => 0,
                'amount' => $refereeDiscount,
                'description' => "Welcome bonus for referral code from {$referrer->user->name}",
            ]);

            // Give referrer credit
            $referrer->increment('wallet_balance', $referrerBonus);
            RewardTransaction::create([
                'customer_id' => $referrer->id,
                'type' => 'referral_bonus',
                'points' => 0,
                'amount' => $referrerBonus,
                'description' => "Referral bonus for inviting {$customer->user->name}",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Referral applied! \${$refereeDiscount} credit has been added to your wallet.",
                'data' => [
                    'wallet_balance' => (float) $customer->fresh()->wallet_balance,
                ],
            ]);
        });
    }
}
