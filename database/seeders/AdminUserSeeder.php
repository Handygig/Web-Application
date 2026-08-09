<?php

namespace Database\Seeders;

use App\Models\Admin;
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
    }
}
