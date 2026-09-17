<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\JobRequest;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class JobRequestSeeder extends Seeder
{
    public function run(): void
    {
        $customersList = Customer::all();
        $propResidential = PropertyType::where('name', 'Residential Apartment')->first();
        $plumbingCat = ServiceCategory::where('service_name', 'Plumbing')->first();

        if ($customersList->isEmpty() || ! $propResidential || ! $plumbingCat) {
            return;
        }

        $prop = Property::firstOrCreate([
            'customer_id' => $customersList[0]->id,
            'label' => 'Main Residence',
        ], [
            'property_type_id' => $propResidential->id,
            'address_line' => '456 Elm St',
            'city' => 'Metropolis',
        ]);

        for ($b = 1; $b <= 15; $b++) {
            $statusStr = match ($b % 4) {
                0 => 'pending',
                1 => 'confirmed',
                2 => 'in_progress',
                3 => 'completed',
            };

            JobRequest::create([
                'customer_id' => $customersList[$b % count($customersList)]->id,
                'property_id' => $prop->id,
                'service_category_id' => $plumbingCat->id,
                'title' => "Booking Request #{$b}",
                'description' => "Service maintenance request #{$b}",
                'budget' => 150.00 * $b,
                'status' => $statusStr,
                'preferred_date' => now()->addDays($b),
            ]);
        }
    }
}
