<?php

namespace Tests\Feature\Api\Customer;

use App\Models\Customer;
use App\Models\CustomerCard;
use App\Models\Dispute;
use App\Models\JobAssignment;
use App\Models\JobRequest;
use App\Models\Property;
use App\Models\Provider;
use App\Models\Quotation;
use App\Models\Review;
use App\Models\ServiceCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerMobileApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        // Create Customer User
        $this->user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+15555551234',
            'status' => 'active',
        ]);
        $this->user->assignRole('customer');
        $this->customer = Customer::create(['user_id' => $this->user->id]);
    }

    public function test_can_list_service_categories(): void
    {
        ServiceCategory::create([
            'service_name' => 'Plumbing',
            'description' => 'Leak repairs and piping',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/customer/service-categories');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Plumbing',
            ]);
    }

    public function test_can_manage_properties(): void
    {
        // 1. Create property
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/customer/properties', [
                'label' => 'Home',
                'address_line' => '123 Main St',
                'city' => 'Metropolis',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'is_default' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.label', 'Home')
            ->assertJsonPath('data.is_default', true);

        $propertyId = $response->json('data.id');

        // 2. List properties
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/customer/properties');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // 3. Update property
        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/customer/properties/{$propertyId}", [
                'label' => 'Work',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.label', 'Work');

        // 4. Delete property
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/customer/properties/{$propertyId}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('properties', ['id' => $propertyId]);
    }

    public function test_can_manage_job_requests(): void
    {
        $property = Property::create([
            'customer_id' => $this->customer->id,
            'label' => 'Home',
            'address_line' => '123 Main St',
            'city' => 'Metropolis',
        ]);

        $category = ServiceCategory::create([
            'service_name' => 'HVAC',
            'is_active' => true,
        ]);

        // 1. Create job request
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/customer/job-requests', [
                'property_id' => $property->id,
                'service_category_id' => $category->id,
                'description' => 'Fix heater issues',
                'preferred_date' => now()->addDays(2)->toIso8601String(),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.description', 'Fix heater issues')
            ->assertJsonPath('data.status', 'pending');

        $requestId = $response->json('data.id');

        // 2. List job requests
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/customer/job-requests');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // 3. Show specific job request
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/customer/job-requests/{$requestId}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $requestId);

        // 4. Cancel job request
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/customer/job-requests/{$requestId}/cancel");

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_requests', [
            'id' => $requestId,
            'status' => 'cancelled',
        ]);
    }

    public function test_can_view_and_accept_quotations(): void
    {
        $property = Property::create([
            'customer_id' => $this->customer->id,
            'label' => 'Home',
            'address_line' => '123 Main St',
            'city' => 'Metropolis',
        ]);

        $category = ServiceCategory::create([
            'service_name' => 'HVAC',
            'is_active' => true,
        ]);

        $jobRequest = JobRequest::create([
            'customer_id' => $this->customer->id,
            'property_id' => $property->id,
            'service_category_id' => $category->id,
            'description' => 'A/C tune-up',
            'preferred_date' => now()->addDays(1),
            'status' => 'pending',
        ]);

        // Create provider user
        $providerUser = User::create([
            'role' => 'provider',
            'full_name' => 'John Service',
            'email' => 'john.service@example.com',
            'phone' => '+15555559876',
            'status' => 'active',
        ]);
        $providerUser->assignRole('provider');
        $provider = Provider::create([
            'user_id' => $providerUser->id,
            'provider_type' => 'individual',
            'approval_status' => 'approved',
        ]);

        // Create Quotation
        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'provider_id' => $provider->id,
            'quoted_price' => 150.00,
            'estimated_duration' => '2 hours',
            'message' => 'I can do this tomorrow.',
            'status' => 'pending',
        ]);

        // 1. List quotations for the job request
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/customer/job-requests/{$jobRequest->id}/quotations");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.quoted_price', 150);

        // 2. Accept quotation
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/customer/quotations/{$quotation->id}/accept");

        $response->assertStatus(200);

        $this->assertDatabaseHas('quotations', [
            'id' => $quotation->id,
            'status' => 'accepted',
        ]);

        $this->assertDatabaseHas('job_requests', [
            'id' => $jobRequest->id,
            'status' => 'assigned',
        ]);

        $this->assertDatabaseHas('job_assignments', [
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $quotation->id,
            'provider_id' => $provider->id,
            'status' => 'scheduled',
        ]);
    }

    public function test_can_manage_payment_cards(): void
    {
        // 1. Store payment card
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/customer/cards', [
                'card_type' => 'Visa',
                'masked_card_number' => '**** **** **** 1234',
                'expiry_date' => '12/28',
                'card_holder_name' => 'Jane Doe',
                'billing_address' => '123 Main St',
                'is_default' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.card_type', 'Visa')
            ->assertJsonPath('data.is_default', true);

        $cardId = $response->json('data.id');

        // 2. List saved cards
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/customer/cards');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // 3. Delete card
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/customer/cards/{$cardId}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('customer_cards', ['id' => $cardId]);
    }

    public function test_can_pay_for_assignment(): void
    {
        $property = Property::create([
            'customer_id' => $this->customer->id,
            'label' => 'Home',
            'address_line' => '123 Main St',
            'city' => 'Metropolis',
        ]);

        $category = ServiceCategory::create([
            'service_name' => 'HVAC',
            'is_active' => true,
        ]);

        $jobRequest = JobRequest::create([
            'customer_id' => $this->customer->id,
            'property_id' => $property->id,
            'service_category_id' => $category->id,
            'description' => 'A/C tune-up',
            'preferred_date' => now()->addDays(1),
            'status' => 'assigned',
        ]);

        $providerUser = User::create([
            'role' => 'provider',
            'full_name' => 'John Service',
            'email' => 'john.service@example.com',
            'phone' => '+15555559876',
            'status' => 'active',
        ]);
        $providerUser->assignRole('provider');
        $provider = Provider::create([
            'user_id' => $providerUser->id,
            'provider_type' => 'individual',
            'approval_status' => 'approved',
        ]);

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'provider_id' => $provider->id,
            'quoted_price' => 200.00,
            'estimated_duration' => '2 hours',
            'status' => 'accepted',
        ]);

        $assignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $quotation->id,
            'provider_id' => $provider->id,
            'status' => 'scheduled',
        ]);

        $card = CustomerCard::create([
            'customer_id' => $this->customer->id,
            'card_type' => 'Mastercard',
            'masked_card_number' => '**** **** **** 5678',
            'expiry_date' => '11/27',
            'card_holder_name' => 'Jane Doe',
            'is_default' => true,
        ]);

        // Pay for assignment
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/customer/job-assignments/{$assignment->id}/pay", [
                'card_id' => $card->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.amount', 200)
            ->assertJsonPath('data.payment_status', 'paid');

        $this->assertDatabaseHas('payments', [
            'assignment_id' => $assignment->id,
            'customer_id' => $this->customer->id,
            'card_id' => $card->id,
            'amount' => 200.00,
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseHas('job_assignments', [
            'id' => $assignment->id,
            'status' => 'completed',
        ]);
    }

    public function test_can_review_completed_assignment(): void
    {
        $property = Property::create([
            'customer_id' => $this->customer->id,
            'label' => 'Home',
            'address_line' => '123 Main St',
            'city' => 'Metropolis',
        ]);

        $category = ServiceCategory::create([
            'service_name' => 'HVAC',
            'is_active' => true,
        ]);

        $jobRequest = JobRequest::create([
            'customer_id' => $this->customer->id,
            'property_id' => $property->id,
            'service_category_id' => $category->id,
            'description' => 'A/C tune-up',
            'preferred_date' => now()->addDays(1),
            'status' => 'completed',
        ]);

        $providerUser = User::create([
            'role' => 'provider',
            'full_name' => 'John Service',
            'email' => 'john.service@example.com',
            'phone' => '+15555559876',
            'status' => 'active',
        ]);
        $providerUser->assignRole('provider');
        $provider = Provider::create([
            'user_id' => $providerUser->id,
            'provider_type' => 'individual',
            'approval_status' => 'approved',
        ]);

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'provider_id' => $provider->id,
            'quoted_price' => 100.00,
            'estimated_duration' => '1 hour',
            'status' => 'accepted',
        ]);

        $assignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $quotation->id,
            'provider_id' => $provider->id,
            'status' => 'completed',
        ]);

        // Submit review
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/customer/job-assignments/{$assignment->id}/reviews", [
                'rating' => 5,
                'comment' => 'Excellent repair work!',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.comment', 'Excellent repair work!');

        $this->assertDatabaseHas('reviews', [
            'assignment_id' => $assignment->id,
            'customer_id' => $this->customer->id,
            'provider_id' => $provider->id,
            'rating' => 5,
        ]);

        // Verify provider average rating updated
        $this->assertEquals(5.0, round((float) $provider->reviews()->avg('rating'), 1));
    }

    public function test_can_dispute_assignment(): void
    {
        $property = Property::create([
            'customer_id' => $this->customer->id,
            'label' => 'Home',
            'address_line' => '123 Main St',
            'city' => 'Metropolis',
        ]);

        $category = ServiceCategory::create([
            'service_name' => 'HVAC',
            'is_active' => true,
        ]);

        $jobRequest = JobRequest::create([
            'customer_id' => $this->customer->id,
            'property_id' => $property->id,
            'service_category_id' => $category->id,
            'description' => 'A/C tune-up',
            'preferred_date' => now()->addDays(1),
            'status' => 'completed',
        ]);

        $providerUser = User::create([
            'role' => 'provider',
            'full_name' => 'John Service',
            'email' => 'john.service@example.com',
            'phone' => '+15555559876',
            'status' => 'active',
        ]);
        $providerUser->assignRole('provider');
        $provider = Provider::create([
            'user_id' => $providerUser->id,
            'provider_type' => 'individual',
            'approval_status' => 'approved',
        ]);

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'provider_id' => $provider->id,
            'quoted_price' => 100.00,
            'estimated_duration' => '1 hour',
            'status' => 'accepted',
        ]);

        $assignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $quotation->id,
            'provider_id' => $provider->id,
            'status' => 'completed',
        ]);

        // Lodge dispute
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/customer/job-assignments/{$assignment->id}/disputes", [
                'reason' => 'Technician did not fix the cooling issue fully.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.reason', 'Technician did not fix the cooling issue fully.')
            ->assertJsonPath('data.status', 'open');

        $this->assertDatabaseHas('disputes', [
            'assignment_id' => $assignment->id,
            'customer_id' => $this->customer->id,
            'provider_id' => $provider->id,
            'status' => 'open',
        ]);
    }
}
