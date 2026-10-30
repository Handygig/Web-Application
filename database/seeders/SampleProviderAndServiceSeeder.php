<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SampleProviderAndServiceSeeder extends Seeder
{
    /**
     * Run the database seeds for sample providers and service types.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            ServiceCategorySeeder::class,
            ServiceSeeder::class,
            CustomerSeeder::class,
            ProviderSeeder::class,
        ]);
    }
}
