<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            AdminUserSeeder::class,
            PropertyTypeSeeder::class,
            ServiceCategorySeeder::class,
            CustomerSeeder::class,
            ProviderSeeder::class,
            JobRequestSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
