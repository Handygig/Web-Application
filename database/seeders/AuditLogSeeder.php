<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::where('role', 'admin')->first();

        if ($adminUser) {
            AuditLog::log($adminUser->id, 'System seeded', 'System', 1, 'Development seed data created');
        }
    }
}
