<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        ServiceCategory::firstOrCreate(
            ['service_name' => 'Plumbing'],
            ['is_active' => true]
        );

        ServiceCategory::firstOrCreate(
            ['service_name' => 'Electrical'],
            ['is_active' => true]
        );
    }
}
