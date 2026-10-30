<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'service_name' => 'Cleaning',
                'description' => 'Full house deep cleaning, sanitization, floor scrubbing, and carpet care.',
                'icon' => 'cleaning',
                'is_active' => true,
            ],
            [
                'service_name' => 'Plumbing',
                'description' => 'Leak repairs, pipe installations, drain unclogging, and bathroom fixtures.',
                'icon' => 'plumbing',
                'is_active' => true,
            ],
            [
                'service_name' => 'Electrical',
                'description' => 'Wiring safety check, circuit breaker repairs, switchboards, and fixture setups.',
                'icon' => 'electrical',
                'is_active' => true,
            ],
            [
                'service_name' => 'Painting',
                'description' => 'Interior and exterior wall painting, drywall patching, and protective coating.',
                'icon' => 'painting',
                'is_active' => true,
            ],
            [
                'service_name' => 'Gardening',
                'description' => 'Lawn mowing, hedge trimming, weed removal, soil testing, and garden care.',
                'icon' => 'gardening',
                'is_active' => true,
            ],
            [
                'service_name' => 'Appliances',
                'description' => 'Diagnostic and repairs for washing machines, refrigerators, ovens, and dryers.',
                'icon' => 'appliances',
                'is_active' => true,
            ],
            [
                'service_name' => 'HVAC',
                'description' => 'Air conditioning maintenance, refrigerant refills, filter cleaning, and duct care.',
                'icon' => 'hvac',
                'is_active' => true,
            ],
            [
                'service_name' => 'Security',
                'description' => 'CCTV camera installation, smart lock setup, intrusion alarms, and monitoring.',
                'icon' => 'security',
                'is_active' => true,
            ],
            [
                'service_name' => 'Carpentry',
                'description' => 'Custom woodworking, furniture repairs, cabinetry, door hanging, and trim installation.',
                'icon' => 'carpentry',
                'is_active' => true,
            ],
            [
                'service_name' => 'Pest Control',
                'description' => 'Termite inspection, rodent eradication, insect fogging, and preventive pest treatments.',
                'icon' => 'pest-control',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $cat) {
            ServiceCategory::updateOrCreate(
                ['service_name' => $cat['service_name']],
                $cat
            );
        }
    }
}
