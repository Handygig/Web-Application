<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\Provider;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::first();
        $provider = Provider::first();

        if (! $customer || ! $provider) {
            return;
        }

        Payment::create([
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'amount' => 48250.00,
            'platform_fee' => 7237.50,
            'provider_amount' => 41012.50,
            'payment_method' => 'card',
            'payment_status' => 'completed',
        ]);

        Payout::create([
            'provider_id' => $provider->id,
            'amount' => 3410.00,
            'status' => 'pending',
        ]);
    }
}
