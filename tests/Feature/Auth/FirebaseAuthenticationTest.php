<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class FirebaseAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(RoleAndPermissionSeeder::class);

        // Enable mock mode for Firebase verification
        config(['firebase.mock' => true]);
        config(['firebase.project_id' => 'test-firebase-project']);
    }

    /**
     * Helper to generate a valid mock token payload.
     */
    protected function generateMockToken(array $payload): string
    {
        return 'valid-mock-'.base64_encode(json_encode($payload));
    }

    public function test_customer_can_register_via_firebase_token(): void
    {
        $payload = [
            'sub' => 'firebase-cust-123',
            'email' => 'new-customer@example.com',
            'name' => 'New Customer User',
            'phone_number' => '1234567890',
        ];

        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/customer/register', [
            'firebase_token' => $token,
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user']);

        $this->assertDatabaseHas('users', [
            'email' => 'new-customer@example.com',
            'firebase_uid' => 'firebase-cust-123',
            'role' => 'customer',
        ]);

        $user = User::where('email', 'new-customer@example.com')->first();
        $this->assertTrue($user->hasRole('customer'));
        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
        ]);
    }

    public function test_customer_can_login_via_firebase_token(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Existing Customer',
            'email' => 'existing-cust@example.com',
            'phone' => '0987654321',
            'firebase_uid' => 'firebase-cust-999',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $payload = [
            'sub' => 'firebase-cust-999',
            'email' => 'existing-cust@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/customer/login', [
            'firebase_token' => $token,
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_customer_login_fails_if_user_not_registered(): void
    {
        $payload = [
            'sub' => 'firebase-unregistered-uid',
            'email' => 'unregistered-cust@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/customer/login', [
            'firebase_token' => $token,
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['firebase_token']);
    }

    public function test_provider_can_register_via_firebase_token(): void
    {
        $payload = [
            'sub' => 'firebase-prov-123',
            'email' => 'new-provider@example.com',
            'name' => 'New Provider User',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/provider/register', [
            'firebase_token' => $token,
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user']);

        $this->assertDatabaseHas('users', [
            'email' => 'new-provider@example.com',
            'firebase_uid' => 'firebase-prov-123',
            'role' => 'provider',
        ]);

        $user = User::where('email', 'new-provider@example.com')->first();
        $this->assertTrue($user->hasRole('provider'));
        $this->assertDatabaseHas('providers', [
            'user_id' => $user->id,
            'provider_type' => 'individual',
        ]);
    }

    public function test_provider_can_login_via_firebase_token(): void
    {
        $user = User::create([
            'role' => 'provider',
            'full_name' => 'Existing Provider',
            'email' => 'existing-prov@example.com',
            'phone' => '0987654321',
            'firebase_uid' => 'firebase-prov-999',
            'status' => 'active',
        ]);
        $user->assignRole('provider');

        $payload = [
            'sub' => 'firebase-prov-999',
            'email' => 'existing-prov@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/provider/login', [
            'firebase_token' => $token,
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_company_can_login_via_password_on_provider_endpoint(): void
    {
        $user = User::create([
            'role' => 'company',
            'full_name' => 'Test Company User',
            'email' => 'company@example.com',
            'phone' => '1112223333',
            'password' => Hash::make('company-secret'),
            'status' => 'active',
        ]);
        $user->assignRole('company');

        $response = $this->postJson('/api/provider/login', [
            'email' => 'company@example.com',
            'password' => 'company-secret',
            'device_name' => 'CompanyWeb',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_company_can_login_via_firebase_token_on_provider_endpoint(): void
    {
        $user = User::create([
            'role' => 'company',
            'full_name' => 'Test Company User',
            'email' => 'company@example.com',
            'phone' => '1112223333',
            'status' => 'active',
        ]);
        $user->assignRole('company');

        $payload = [
            'sub' => 'firebase-comp-456',
            'email' => 'company@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/provider/login', [
            'firebase_token' => $token,
            'device_name' => 'CompanyDevice',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);

        // Assert firebase_uid was linked
        $this->assertDatabaseHas('users', [
            'email' => 'company@example.com',
            'firebase_uid' => 'firebase-comp-456',
        ]);
    }

    public function test_invalid_firebase_token_fails_validation(): void
    {
        $response = $this->postJson('/api/customer/login', [
            'firebase_token' => 'invalid-token-format',
            'device_name' => 'TestDevice',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['firebase_token']);
    }
}
