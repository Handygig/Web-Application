<?php

namespace Database\Seeders;

use App\Models\PropertyType;
use Illuminate\Database\Seeder;

class PropertyTypeSeeder extends Seeder
{
    public function run(): void
    {
        PropertyType::firstOrCreate(
            ['name' => 'Residential Apartment'],
            ['description' => 'Standard residential apartment units', 'status' => 'ACTIVE']
        );

        PropertyType::firstOrCreate(
            ['name' => 'Commercial Office'],
            ['description' => 'Commercial office spaces', 'status' => 'ACTIVE']
        );

        PropertyType::firstOrCreate(
            ['name' => 'Industrial Warehouse'],
            ['description' => 'Storage and logistics facilities', 'status' => 'ACTIVE']
        );
    }
}
