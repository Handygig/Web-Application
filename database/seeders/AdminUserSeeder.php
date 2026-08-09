<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@handygig.com'],
            [
                'role' => 'admin',
                'full_name' => 'System Administrator',
                'phone' => '1234567890',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $admin->assignRole('admin');

        Admin::firstOrCreate([
            'user_id' => $admin->id,
        ]);

        // Company
        $companyUser = User::firstOrCreate(
            ['email' => 'company@handygig.com'],
            [
                'role' => 'company',
                'full_name' => 'GigCo Services LLC',
                'phone' => '0987654321',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $companyUser->assignRole('company');

        Company::firstOrCreate(
            ['user_id' => $companyUser->id],
            [
                'company_name' => 'GigCo Services LLC',
                'registration_no' => 'REG-123456789',
                'address' => '123 Business Road, Corporate Suite 500',
                'approval_status' => 'approved',
            ]
        );
    }
}
