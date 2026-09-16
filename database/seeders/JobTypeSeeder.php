<?php

namespace Database\Seeders;

use App\Models\JobType;
use Illuminate\Database\Seeder;

class JobTypeSeeder extends Seeder
{
    public function run(): void
    {
        JobType::firstOrCreate(
            ['name' => 'Plumbing Repair'],
            ['description' => 'Pipe repair and fixture replacement', 'status' => 'ACTIVE']
        );

        JobType::firstOrCreate(
            ['name' => 'Electrical Inspection'],
            ['description' => 'Wiring safety check and setup', 'status' => 'ACTIVE']
        );

        JobType::firstOrCreate(
            ['name' => 'HVAC Maintenance'],
            ['description' => 'AC unit servicing and duct cleaning', 'status' => 'ACTIVE']
        );
    }
}
