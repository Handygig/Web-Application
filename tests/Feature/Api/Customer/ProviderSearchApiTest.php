<?php

namespace Tests\Feature\Api\Customer;

use App\Models\Customer;
use App\Models\Provider;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProviderSearchApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $customerUser;
    protected Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        $this->customerUser = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Customer',
            'email' => 'customer@example.com',
            'phone' => '+15555550001',
            'status' => 'active',
        ]);
        $this->customerUser->assignRole('customer');
        $this->customer = Customer::create(['user_id' => $this->customerUser->id]);
    }

    public function test_can_search_providers_by_service_and_location(): void
    {
        $plumbing = ServiceCategory::create([
            'service_name' => 'Plumbing',
            'description' => 'Plumbing and pipe repairs',
            'is_active' => true,
        ]);

        $service = Service::create([
            'service_category_id' => $plumbing->id,
            'name' => 'Pipe Leak Repair',
            'description' => 'Fix leaking pipes',
            'is_active' => true,
        ]);

        $providerUser = User::create([
            'role' => 'provider',
            'full_name' => 'Alex Rivera',
            'email' => 'alex@example.com',
            'phone' => '+15552000001',
            'status' => 'active',
        ]);
        $providerUser->assignRole('provider');

        $provider = Provider::create([
            'user_id' => $providerUser->id,
            'provider_type' => 'individual',
            'bio' => 'Expert plumber with 10 years experience',
            'approval_status' => 'approved',
            'availability' => 'available',
            'latitude' => 6.9271,
            'longitude' => 79.8612,
            'city' => 'Colombo',
            'address_line1' => '742 Galle Road',
            'service_radius' => 30,
        ]);
        $provider->serviceCategories()->attach($plumbing->id);

        // Search public endpoint
        $response = $this->getJson('/api/providers/search?service=Plumbing&latitude=6.9271&longitude=79.8612');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'service_type',
                        'services',
                        'rating',
                        'price',
                        'distance',
                        'latitude',
                        'longitude',
                        'is_available',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'name' => 'Alex Rivera',
                'service_type' => 'Plumbing',
            ]);

        // Search authenticated customer endpoint
        $authResponse = $this->actingAs($this->customerUser, 'sanctum')
            ->getJson('/api/customer/providers/search?service=Pipe&latitude=6.9271&longitude=79.8612');

        $authResponse->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Alex Rivera',
            ]);
    }
}
