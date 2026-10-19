<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\ExclusiveOffer;
use App\Models\RewardSetting;
use App\Models\RewardTransaction;
use Illuminate\Database\Seeder;

class RewardAndOfferSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Reward Settings
        $settings = [
            'points_per_dollar' => '10',
            'points_redemption_rate' => '100', // 100 points = $1.00 wallet credit
            'referrer_bonus' => '20.00',       // $20 wallet credit for referrer
            'referee_discount' => '20.00',     // $20 off for first service
            'welcome_bonus_points' => '250',
            'silver_points_threshold' => '500',
            'gold_points_threshold' => '1000',
            'platinum_points_threshold' => '2500',
        ];

        foreach ($settings as $key => $value) {
            RewardSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'description' => ucwords(str_replace('_', ' ', $key))]
            );
        }

        // 2. Seed Exclusive Offers
        $offers = [
            [
                'title' => 'Spring Deep Cleaning',
                'description' => 'Complete home sanitization with eco-safe solutions',
                'badge' => 'EXCLUSIVE OFFER',
                'code' => 'CLEAN30',
                'discount_type' => 'percentage',
                'discount_value' => 30.00,
                'discount_text' => '30% OFF',
                'min_spend' => 50.00,
                'max_discount_amount' => 100.00,
                'gradient_start' => '#3D4127',
                'gradient_end' => '#636B2F',
                'accent_color' => '#D4DE95',
                'icon_name' => 'auto_awesome_rounded',
                'is_active' => true,
                'terms' => 'Valid on all comprehensive home deep cleaning services.',
            ],
            [
                'title' => 'Lawn & Garden Care',
                'description' => 'Book 2 garden trimming sessions & get free soil analysis',
                'badge' => 'SEASONAL SPECIAL',
                'code' => 'GARDENFREE',
                'discount_type' => 'fixed',
                'discount_value' => 25.00,
                'discount_text' => 'FREE SOIL TEST',
                'min_spend' => 40.00,
                'gradient_start' => '#636B2F',
                'gradient_end' => '#BAC095',
                'accent_color' => '#D4DE95',
                'icon_name' => 'yard_rounded',
                'is_active' => true,
                'terms' => 'Applies automatically to qualifying landscaping bookings.',
            ],
            [
                'title' => 'HVAC & Plumbing Check',
                'description' => 'Certified inspection for air filters and water pipes',
                'badge' => 'MAINTENANCE PACK',
                'code' => 'SECURE50',
                'discount_type' => 'fixed',
                'discount_value' => 50.00,
                'discount_text' => '$50 CASHBACK',
                'min_spend' => 120.00,
                'gradient_start' => '#1F2414',
                'gradient_end' => '#3D4127',
                'accent_color' => '#D4DE95',
                'icon_name' => 'shield_rounded',
                'is_active' => true,
                'terms' => 'Cashback credited to in-app wallet upon booking completion.',
            ],
        ];

        foreach ($offers as $offerData) {
            ExclusiveOffer::updateOrCreate(
                ['code' => $offerData['code']],
                $offerData
            );
        }

        // 3. Update existing customers with valid referral code and transactions
        $customers = Customer::all();
        $isFirst = true;

        foreach ($customers as $customer) {
            $referralCode = $isFirst ? 'HANDY2026' : Customer::generateUniqueReferralCode();
            $customer->update([
                'referral_code' => $customer->referral_code ?: $referralCode,
                'reward_points' => $customer->reward_points ?: 1250,
                'wallet_balance' => $customer->wallet_balance > 0 ? $customer->wallet_balance : 45.00,
                'membership_tier' => $customer->membership_tier ?: 'Gold Member',
            ]);

            // Ensure customer has sample transactions
            if ($customer->rewardTransactions()->count() === 0) {
                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => 'points_earned',
                    'points' => 250,
                    'amount' => 0.00,
                    'description' => 'Welcome registration bonus',
                ]);

                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => 'points_earned',
                    'points' => 1000,
                    'amount' => 0.00,
                    'description' => 'Points for completed HVAC Service #1042',
                ]);

                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => 'referral_bonus',
                    'points' => 0,
                    'amount' => 20.00,
                    'description' => 'Referral credit: Alex invited friend',
                ]);

                RewardTransaction::create([
                    'customer_id' => $customer->id,
                    'type' => 'wallet_credit',
                    'points' => 0,
                    'amount' => 25.00,
                    'description' => 'Promotional wallet credit deposit',
                ]);
            }

            $isFirst = false;
        }
    }
}
