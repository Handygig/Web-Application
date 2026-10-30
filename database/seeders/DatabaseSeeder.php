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
            ServiceCategorySeeder::class,
            ServiceSeeder::class,
            CustomerSeeder::class,
            ProviderSeeder::class,
            JobRequestSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
            AuditLogSeeder::class,
            RewardAndOfferSeeder::class,
            FaqSeeder::class,
        ]);
    }
}
