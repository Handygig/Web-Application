<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\JobRequest;
use App\Models\KycVerification;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBackendTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
    }

    public function test_admin_login_api(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->adminUser->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_get_customers_and_banning(): void
    {
        $customerUser = User::factory()->create(['role' => 'customer']);
        $customer = Customer::create(['user_id' => $customerUser->id]);

        $this->actingAs($this->adminUser);

        $response = $this->getJson('/api/admin/customers');
        $response->assertStatus(200)->assertJsonPath('success', true);

        $banResponse = $this->patchJson("/api/admin/customers/{$customer->id}/ban", [
            'reason' => 'Fraudulent activity',
        ]);
        $banResponse->assertStatus(200)->assertJsonPath('success', true);

        $this->assertEquals('banned', $customerUser->fresh()->status);
    }

    public function test_kyc_approval_and_rejection(): void
    {
        $providerUser = User::factory()->create(['role' => 'provider']);
        $provider = Provider::create(['user_id' => $providerUser->id, 'approval_status' => 'pending']);

        $kyc = KycVerification::create([
            'provider_id' => $provider->id,
            'verification_type' => 'KYC',
            'status' => 'PENDING',
        ]);

        $this->actingAs($this->adminUser);

        $rejectResponse = $this->patchJson("/api/admin/kyc-kyb/{$kyc->id}/reject", [
            'reason' => 'Illegible photo ID',
        ]);
        $rejectResponse->assertStatus(200)->assertJsonPath('success', true);
        $this->assertEquals('REJECTED', $kyc->fresh()->status);
        $this->assertEquals('rejected', $provider->fresh()->approval_status);

        $approveResponse = $this->patchJson("/api/admin/kyc-kyb/{$kyc->id}/approve");
        $approveResponse->assertStatus(200)->assertJsonPath('success', true);
        $this->assertEquals('APPROVED', $kyc->fresh()->status);
        $this->assertEquals('approved', $provider->fresh()->approval_status);
    }

    public function test_property_and_job_types_crud(): void
    {
        $this->actingAs($this->adminUser);

        $jobTypeResponse = $this->postJson('/api/admin/job-types', [
            'name' => 'Roofing Maintenance',
            'description' => 'Fix leaking roofs',
            'status' => 'ACTIVE',
        ]);
        $jobTypeResponse->assertStatus(201);

        $dupResponse = $this->postJson('/api/admin/job-types', [
            'name' => 'Roofing Maintenance',
            'status' => 'ACTIVE',
        ]);
        $dupResponse->assertStatus(422);

        $propTypeResponse = $this->postJson('/api/admin/property-types', [
            'name' => 'Penthouse',
            'status' => 'ACTIVE',
        ]);
        $propTypeResponse->assertStatus(201);
    }

    public function test_booking_status_rules(): void
    {
        $this->actingAs($this->adminUser);

        $booking = JobRequest::create([
            'title' => 'Test Repair',
            'status' => 'cancelled',
        ]);

        $response = $this->patchJson("/api/admin/bookings/{$booking->id}/status", [
            'status' => 'completed',
        ]);

        $response->assertStatus(400);
    }
}
