<?php

namespace Database\Seeders;

use App\Models\BannedAccount;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::where('role', 'admin')->first();

        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "customer{$i}@example.com"],
                [
                    'full_name' => "Customer User {$i}",
                    'phone' => "+1555100000{$i}",
                    'password' => Hash::make('password'),
                    'role' => 'customer',
                    'status' => $i === 9 ? 'suspended' : ($i === 10 ? 'banned' : 'active'),
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('customer');
            Customer::firstOrCreate(['user_id' => $user->id]);

            if ($i === 10 && $adminUser) {
                BannedAccount::create([
                    'user_id' => $user->id,
                    'account_type' => 'CUSTOMER',
                    'ban_type' => 'PERMANENT',
                    'reason' => 'Violation of terms of service',
                    'banned_by' => $adminUser->id,
                    'banned_at' => now()->subDays(2),
                    'status' => 'ACTIVE',
                ]);
            }
        }
    }
}
