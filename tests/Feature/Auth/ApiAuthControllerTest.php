<?php

namespace Tests\Feature\Auth;

use App\Models\Customer;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthControllerTest extends TestCase
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

    public function test_user_can_login_and_register_via_firebase_token(): void
    {
        $payload = [
            'sub' => 'firebase-uid-111',
            'phone_number' => '+15555550199',
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/auth/firebase-login', [
            'id_token' => $token,
            'device_name' => 'iPhone 15 Pro',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'phone_number' => '+15555550199',
                    'name' => 'Jane Doe',
                ],
            ])
            ->assertJsonStructure(['status', 'token', 'user' => ['id', 'phone_number', 'name']]);

        $this->assertDatabaseHas('users', [
            'phone' => '+15555550199',
            'firebase_uid' => 'firebase-uid-111',
            'role' => 'customer',
        ]);

        $user = User::where('phone', '+15555550199')->first();
        $this->assertTrue($user->hasRole('customer'));
        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_register_as_provider_via_firebase_token(): void
    {
        $payload = [
            'sub' => 'firebase-uid-222',
            'phone_number' => '+15555550299',
            'name' => 'Provider Joe',
            'email' => 'provider.joe@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/auth/firebase-login', [
            'id_token' => $token,
            'device_name' => 'Android Device',
            'role' => 'provider',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'phone_number' => '+15555550299',
                    'name' => 'Provider Joe',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'phone' => '+15555550299',
            'firebase_uid' => 'firebase-uid-222',
            'role' => 'provider',
        ]);

        $user = User::where('phone', '+15555550299')->first();
        $this->assertTrue($user->hasRole('provider'));
        $this->assertDatabaseHas('providers', [
            'user_id' => $user->id,
            'provider_type' => 'individual',
            'approval_status' => 'pending',
        ]);
    }

    public function test_existing_user_can_login_via_firebase_token(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555550199',
            'firebase_uid' => 'firebase-uid-111',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $payload = [
            'sub' => 'firebase-uid-111',
            'phone_number' => '+15555550199',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/auth/firebase-login', [
            'id_token' => $token,
            'device_name' => 'iPhone 15 Pro',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'phone_number' => '+15555550199',
                    'name' => 'Jane Doe',
                ],
            ]);
    }

    public function test_login_fails_if_phone_number_missing_from_token(): void
    {
        $payload = [
            'sub' => 'firebase-uid-111',
            'email' => 'jane.doe@example.com',
        ];
        $token = $this->generateMockToken($payload);

        $response = $this->postJson('/api/auth/firebase-login', [
            'id_token' => $token,
            'device_name' => 'iPhone 15 Pro',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'error' => 'Phone number missing from Firebase Token.',
            ]);
    }

    public function test_login_fails_with_invalid_or_expired_token(): void
    {
        $response = $this->postJson('/api/auth/firebase-login', [
            'id_token' => 'invalid-token-format',
            'device_name' => 'iPhone 15 Pro',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Invalid or expired Firebase ID token.',
            ]);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/user/profile');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'full_name' => 'Jane Doe',
                'phone' => '+15555550199',
                'email' => 'jane.doe@example.com',
            ])
            ->assertJsonStructure(['id', 'full_name', 'phone', 'email', 'role', 'status']);
    }

    public function test_unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/user/profile');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/user/profile', [
            'full_name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'full_name' => 'Jane Smith',
                    'phone' => '+15555550199',
                    'email' => 'jane.smith@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'full_name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
        ]);
    }

    public function test_authenticated_customer_can_update_profile_with_gender(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');
        Customer::create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/user/profile', [
            'full_name' => 'Jane Williams',
            'email' => 'jane.williams@example.com',
            'phone' => '+15555550200',
            'gender' => 'female',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'full_name' => 'Jane Williams',
                    'email' => 'jane.williams@example.com',
                    'phone' => '+15555550200',
                    'gender' => 'female',
                ],
            ]);

        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
            'gender' => 'female',
        ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $token = $user->createToken('TestDevice')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Logged out successfully from this device.',
            ]);

        $this->assertCount(0, $user->tokens);
    }
}
