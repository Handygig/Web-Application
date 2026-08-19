<?php

namespace Tests\Feature\Auth;

use App\Models\Customer;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CustomerCompleteProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleAndPermissionSeeder::class);
        Storage::fake('public');
    }

    public function test_customer_can_complete_profile(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Initial Name',
            'email' => 'phone@placeholder.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');
        Customer::create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->image('profile.jpg');

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/customer/complete-profile', [
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'gender' => 'male',
            'profile_image' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'full_name' => 'John Doe',
                    'email' => 'john.doe@example.com',
                    'is_profile_complete' => true,
                    'gender' => 'male',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);

        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
            'gender' => 'male',
        ]);

        $user->refresh();
        $this->assertNotNull($user->profile_image);
        Storage::disk('public')->assertExists($user->profile_image);
    }

    public function test_cannot_complete_profile_without_required_fields(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Initial Name',
            'email' => 'phone@placeholder.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/customer/complete-profile', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['full_name', 'email', 'gender']);
    }

    public function test_cannot_complete_profile_with_duplicate_email(): void
    {
        // Existing user with email
        User::create([
            'role' => 'customer',
            'full_name' => 'Other User',
            'email' => 'john.doe@example.com',
            'phone' => '+15555550200',
            'status' => 'active',
        ]);

        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Initial Name',
            'email' => 'phone@placeholder.com',
            'phone' => '+15555550199',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/customer/complete-profile', [
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'gender' => 'male',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
