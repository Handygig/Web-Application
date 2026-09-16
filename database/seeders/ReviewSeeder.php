<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Provider;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::first();
        $provider = Provider::first();

        if (! $customer || ! $provider) {
            return;
        }

        Review::create([
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'rating' => 5,
            'comment' => 'Outstanding work and very quick completion!',
        ]);
    }
}
