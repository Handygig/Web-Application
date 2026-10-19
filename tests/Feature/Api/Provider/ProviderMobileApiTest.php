<?php

namespace Tests\Feature\Api\Provider;

use App\Models\Company;
use App\Models\Customer;
use App\Models\JobAssignment;
use App\Models\JobRequest;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\PayoutAccount;
use App\Models\Property;
use App\Models\Provider;
use App\Models\Quotation;
use App\Models\Review;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProviderMobileApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $providerUser;
    protected Provider $provider;
    protected ServiceCategory $plumbingCategory;
    protected ServiceCategory $electricalCategory;

    protected function setUp(): void
    {
        parent::setUp();

        Role::findOrCreate('provider', 'web');
        Role::findOrCreate('customer', 'web');
        Role::findOrCreate('company', 'web');

        $this->plumbingCategory = ServiceCategory::create([
            'service_name' => 'Plumbing',
            'is_active' => true,
        ]);

        $this->electricalCategory = ServiceCategory::create([
            'service_name' => 'Electrical',
            'is_active' => true,
        ]);

        $this->providerUser = User::create([
            'full_name' => 'Alex Perera',
            'email' => 'alex@provider.com',
            'phone' => '+94771234567',
            'password' => bcrypt('password123'),
            'role' => 'provider',
            'status' => 'active',
        ]);
        $this->providerUser->assignRole('provider');

        $this->provider = Provider::create([
            'user_id' => $this->providerUser->id,
            'provider_type' => 'individual',
            'approval_status' => 'approved',
            'availability' => 'available',
            'latitude' => 6.9271,
            'longitude' => 79.8612,
            'service_radius' => 25,
            'city' => 'Colombo',
        ]);
        $this->provider->serviceCategories()->attach($this->plumbingCategory->id);
    }

    public function test_can_view_and_update_profile(): void
    {
        Sanctum::actingAs($this->providerUser);

        $response = $this->getJson('/api/provider/profile');
        $response->assertStatus(200)
            ->assertJsonPath('data.full_name', 'Alex Perera')
            ->assertJsonPath('data.availability', 'available');

        $updateResponse = $this->putJson('/api/provider/profile', [
            'first_name' => 'Alexander',
            'last_name' => 'Perera',
            'bio' => 'Certified Master Plumber with 10 years experience.',
            'city' => 'Colombo 03',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.full_name', 'Alexander Perera')
            ->assertJsonPath('data.bio', 'Certified Master Plumber with 10 years experience.')
            ->assertJsonPath('data.city', 'Colombo 03');
    }

    public function test_can_toggle_availability_and_update_location(): void
    {
        Sanctum::actingAs($this->providerUser);

        // Toggle availability
        $statusResponse = $this->postJson('/api/provider/status', ['is_online' => false]);
        $statusResponse->assertStatus(200)
            ->assertJsonPath('is_online', false)
            ->assertJsonPath('availability', 'unavailable');

        // Update location
        $locResponse = $this->postJson('/api/provider/location', [
            'latitude' => 6.9150,
            'longitude' => 79.8580,
            'service_radius' => 35.0,
        ]);
        $locResponse->assertStatus(200)
            ->assertJsonPath('service_radius', 35);
    }

    public function test_radar_returns_matching_broadcast_job_requests_and_excludes_company_providers(): void
    {
        // 1. Create a customer and open job requests
        $customerUser = User::create([
            'full_name' => 'Sarah Jenkins',
            'email' => 'sarah@test.com',
            'phone' => '+94779821450',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $customer = Customer::create(['user_id' => $customerUser->id]);

        $property = Property::create([
            'customer_id' => $customer->id,
            'label' => 'Home',
            'address_line' => 'No 18, Galle Road, Kollupitiya',
            'city' => 'Colombo',
            'latitude' => 6.9200,
            'longitude' => 79.8550,
        ]);

        // Request 1: Matching plumbing category
        $plumbingJob = JobRequest::create([
            'customer_id' => $customer->id,
            'property_id' => $property->id,
            'service_category_id' => $this->plumbingCategory->id,
            'title' => 'Emergency Pipe Leak Repair',
            'description' => 'Main pipeline burst under sink.',
            'preferred_date' => now()->addHours(2),
            'budget' => 65.00,
            'status' => 'pending',
        ]);

        // Request 2: Electrical category (provider does not offer)
        $electricalJob = JobRequest::create([
            'customer_id' => $customer->id,
            'property_id' => $property->id,
            'service_category_id' => $this->electricalCategory->id,
            'title' => 'Switchboard Repair',
            'description' => 'Tripping circuit breaker.',
            'preferred_date' => now()->addDay(),
            'budget' => 50.00,
            'status' => 'pending',
        ]);

        // As Independent Provider: should see plumbing job only
        Sanctum::actingAs($this->providerUser);

        $response = $this->getJson('/api/provider/radar');
        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertCount(1, $data);
        $this->assertEquals($plumbingJob->id, $data[0]['id']);

        // Check details endpoint
        $showResponse = $this->getJson("/api/provider/job-requests/{$plumbingJob->id}");
        $showResponse->assertStatus(200)
            ->assertJsonPath('data.title', 'Emergency Pipe Leak Repair');

        // Verify architecture rule: Company-affiliated providers are excluded from direct broadcast radar
        $companyUser = User::create([
            'full_name' => 'Agency Boss',
            'email' => 'boss@agency.com',
            'phone' => '+94779888888',
            'role' => 'company',
            'status' => 'active',
        ]);
        $company = Company::create([
            'user_id' => $companyUser->id,
            'company_name' => 'Apex Agency',
            'registration_no' => 'REG-101',
            'address' => 'Colombo 03',
            'approval_status' => 'approved',
        ]);

        $companyStaffUser = User::create([
            'full_name' => 'Company Tech 1',
            'email' => 'tech1@agency.com',
            'phone' => '+94779888889',
            'company_id' => $company->id,
            'role' => 'provider',
            'status' => 'active',
        ]);
        $companyStaffUser->assignRole('provider');

        $companyProvider = Provider::create([
            'user_id' => $companyStaffUser->id,
            'company_id' => $company->id,
            'provider_type' => 'company',
            'approval_status' => 'approved',
        ]);
        $companyProvider->serviceCategories()->attach($this->plumbingCategory->id);

        Sanctum::actingAs($companyStaffUser);
        $staffRadarResponse = $this->getJson('/api/provider/radar');
        $staffRadarResponse->assertStatus(200);
        $this->assertCount(0, $staffRadarResponse->json('data'));
    }

    public function test_polymorphic_bidding_flow(): void
    {
        $customerUser = User::create([
            'full_name' => 'David Miller',
            'email' => 'david@test.com',
            'phone' => '+94779888877',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $customer = Customer::create(['user_id' => $customerUser->id]);

        $jobRequest = JobRequest::create([
            'customer_id' => $customer->id,
            'service_category_id' => $this->plumbingCategory->id,
            'title' => 'AC Compressor Fix',
            'description' => 'Fix compressor vibration',
            'preferred_date' => now()->addDays(2),
            'budget' => 85.00,
            'status' => 'pending',
        ]);

        // Independent provider submits quotation
        Sanctum::actingAs($this->providerUser);

        $quoteResponse = $this->postJson("/api/provider/job-requests/{$jobRequest->id}/quotations", [
            'quoted_price' => 90.00,
            'estimated_duration' => '3 hours',
            'message' => 'Includes parts and 30-day warranty.',
        ]);

        $quoteResponse->assertStatus(201)
            ->assertJsonPath('data.quoted_price', 90)
            ->assertJsonPath('data.bidder_type', Provider::class)
            ->assertJsonPath('data.bidder_id', $this->provider->id)
            ->assertJsonPath('data.status', 'pending');

        $quoteId = $quoteResponse->json('data.id');

        // Customer receives notification
        $this->assertDatabaseHas('notifications', [
            'recipient_user_id' => $customerUser->id,
            'type' => 'quotation',
        ]);

        // Provider can view their quotations
        $listResponse = $this->getJson('/api/provider/quotations');
        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // Provider can update quotation
        $updateResponse = $this->putJson("/api/provider/quotations/{$quoteId}", [
            'quoted_price' => 85.00,
            'message' => 'Updated price with discount.',
        ]);
        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.quoted_price', 85);
    }

    public function test_job_assignment_lifecycle_ongoing_extra_charge_and_completion(): void
    {
        $customerUser = User::create([
            'full_name' => 'Sarah Jenkins',
            'email' => 'sarah2@test.com',
            'phone' => '+94779821450',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $customer = Customer::create(['user_id' => $customerUser->id]);
        $customerUser->assignRole('customer');

        $property = Property::create([
            'customer_id' => $customer->id,
            'label' => 'Villa',
            'address_line' => '45 Alfred House Gardens',
            'city' => 'Colombo 03',
        ]);

        $jobRequest = JobRequest::create([
            'customer_id' => $customer->id,
            'property_id' => $property->id,
            'service_category_id' => $this->plumbingCategory->id,
            'title' => 'Bathroom Plumbing',
            'description' => 'Fix leaky pipes',
            'preferred_date' => now()->addHours(3),
            'budget' => 80.00,
            'status' => 'assigned',
        ]);

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'bidder_type' => Provider::class,
            'bidder_id' => $this->provider->id,
            'quoted_price' => 80.00,
            'estimated_duration' => '2 hours',
            'message' => 'Available today',
            'status' => 'accepted',
        ]);

        $assignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $quotation->id,
            'provider_id' => $this->provider->id,
            'assigned_at' => now(),
            'status' => 'scheduled',
        ]);

        Sanctum::actingAs($this->providerUser);

        // 1. Provider views ongoing jobs
        $jobsResponse = $this->getJson('/api/provider/jobs?stage=ongoing');
        $jobsResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $assignment->id);

        // 2. Provider starts the job
        $startResponse = $this->postJson("/api/provider/jobs/{$assignment->id}/start");
        $startResponse->assertStatus(200)
            ->assertJsonPath('data.status', 'in_progress');

        $this->assertDatabaseHas('notifications', [
            'recipient_user_id' => $customerUser->id,
            'type' => 'job',
        ]);

        // 3. Provider requests extra charge
        $extraResponse = $this->postJson("/api/provider/jobs/{$assignment->id}/extra-charge", [
            'extra_amount' => 25.00,
            'extra_reason' => 'Replacement brass sensor valve',
        ]);
        $extraResponse->assertStatus(200)
            ->assertJsonPath('data.extra_amount', 25)
            ->assertJsonPath('data.extra_status', 'pending');

        // 4. Customer approves extra charge
        Sanctum::actingAs($customerUser);
        $approveResponse = $this->postJson("/api/customer/job-assignments/{$assignment->id}/extra-charge/approve");
        $approveResponse->assertStatus(200)
            ->assertJsonPath('extra_status', 'approved');

        // 5. Provider completes job with cash payment collected
        Sanctum::actingAs($this->providerUser);
        $completeResponse = $this->postJson("/api/provider/jobs/{$assignment->id}/complete", [
            'payment_method' => 'cash',
            'cash_collected' => 105.00, // 80 base + 25 extra
        ]);
        $completeResponse->assertStatus(200)
            ->assertJsonPath('data.status', 'completed');

        // Check payment record created
        $this->assertDatabaseHas('payments', [
            'assignment_id' => $assignment->id,
            'amount' => 105.00,
            'platform_fee' => 10.50,
            'provider_amount' => 94.50,
            'payment_method' => 'cash',
            'payment_status' => 'paid',
        ]);
    }

    public function test_company_two_step_dispatching_and_staff_management(): void
    {
        // 1. Company Setup
        $companyOwner = User::create([
            'full_name' => 'Agency Director',
            'email' => 'director@agency.com',
            'phone' => '+94779888811',
            'role' => 'company',
            'status' => 'active',
        ]);
        $companyOwner->assignRole('company');

        $company = Company::create([
            'user_id' => $companyOwner->id,
            'company_name' => 'Apex Pro Services',
            'registration_no' => 'PV-99120',
            'address' => 'Colombo 07',
            'approval_status' => 'approved',
        ]);

        // 2. Company adds an employee provider
        Sanctum::actingAs($companyOwner);
        $employeeResponse = $this->postJson('/api/provider/company/employees', [
            'full_name' => 'Field Technician Joe',
            'email' => 'joe@agency.com',
            'phone' => '+94770011223',
            'password' => 'secret123',
            'services' => [$this->plumbingCategory->id],
        ]);

        $employeeResponse->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Field Technician Joe');

        $techProviderId = $employeeResponse->json('data.id');

        // 3. Customer assigns a job to the company (provider_id is initially null)
        $customerUser = User::create([
            'full_name' => 'Client Robert',
            'email' => 'robert@test.com',
            'phone' => '+94779888822',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $customer = Customer::create(['user_id' => $customerUser->id]);

        $jobRequest = JobRequest::create([
            'customer_id' => $customer->id,
            'service_category_id' => $this->plumbingCategory->id,
            'title' => 'Commercial AC Servicing',
            'description' => 'Annual HVAC contract',
            'preferred_date' => now()->addDay(),
            'status' => 'assigned',
        ]);

        $companyQuote = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'bidder_type' => Company::class,
            'bidder_id' => $company->id,
            'quoted_price' => 300.00,
            'estimated_duration' => '1 day',
            'status' => 'accepted',
        ]);

        $jobAssignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => $companyQuote->id,
            'company_id' => $company->id,
            'provider_id' => null, // Initially null per architecture plan
            'assigned_at' => now(),
            'status' => 'scheduled',
        ]);

        // 4. Company dispatches the job to Technician Joe
        $dispatchResponse = $this->postJson("/api/provider/jobs/{$jobAssignment->id}/dispatch", [
            'provider_id' => $techProviderId,
        ]);

        $dispatchResponse->assertStatus(200)
            ->assertJsonPath('data.provider_id', $techProviderId);

        $this->assertEquals($techProviderId, $jobAssignment->fresh()->provider_id);
    }

    public function test_wallet_financials_payout_accounts_and_withdrawals(): void
    {
        Sanctum::actingAs($this->providerUser);

        // 1. Link a bank account
        $accountResponse = $this->postJson('/api/provider/payout-accounts', [
            'bank_name' => 'Commercial Bank',
            'branch_name' => 'Kollupitiya',
            'account_holder_name' => 'Alex Perera',
            'account_number' => '8004124291',
            'is_default' => true,
        ]);

        $accountResponse->assertStatus(201)
            ->assertJsonPath('data.bank_name', 'Commercial Bank')
            ->assertJsonPath('data.is_default', true);

        $accountId = $accountResponse->json('data.id');

        // Create an online paid payment for provider
        $customerUser = User::create([
            'full_name' => 'Payment Customer',
            'email' => 'paycustomer@test.com',
            'phone' => '+94779888833',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $customer = Customer::create(['user_id' => $customerUser->id]);

        $jobRequest = JobRequest::create([
            'customer_id' => $customer->id,
            'service_category_id' => $this->plumbingCategory->id,
            'title' => 'Completed Online Job',
            'description' => 'Done',
            'preferred_date' => now(),
            'status' => 'completed',
        ]);

        $assignment = JobAssignment::create([
            'job_request_id' => $jobRequest->id,
            'quotation_id' => Quotation::create([
                'job_request_id' => $jobRequest->id,
                'bidder_type' => Provider::class,
                'bidder_id' => $this->provider->id,
                'quoted_price' => 200.00,
                'estimated_duration' => '1 day',
                'status' => 'accepted',
            ])->id,
            'provider_id' => $this->provider->id,
            'status' => 'completed',
        ]);

        Payment::create([
            'assignment_id' => $assignment->id,
            'customer_id' => $customer->id,
            'provider_id' => $this->provider->id,
            'amount' => 200.00,
            'platform_fee' => 20.00,
            'provider_amount' => 180.00,
            'payment_method' => 'card',
            'payment_status' => 'paid',
            'payment_date' => now(),
        ]);

        // Check wallet overview
        $walletResponse = $this->getJson('/api/provider/wallet');
        $walletResponse->assertStatus(200)
            ->assertJsonPath('data.available_balance', 180)
            ->assertJsonPath('data.this_month_earnings', 180);

        // 2. Request a withdrawal
        $payoutResponse = $this->postJson('/api/provider/payouts', [
            'amount' => 100.00,
            'payout_account_id' => $accountId,
        ]);

        $payoutResponse->assertStatus(201)
            ->assertJsonPath('data.amount', 100)
            ->assertJsonPath('data.status', 'pending');

        // Check wallet balance after withdrawal request
        $walletResponse2 = $this->getJson('/api/provider/wallet');
        $walletResponse2->assertStatus(200)
            ->assertJsonPath('data.available_balance', 80);
    }

    public function test_notifications_and_reviews(): void
    {
        Sanctum::actingAs($this->providerUser);

        // Notifications index (seeds welcome notifications if empty)
        $notifResponse = $this->getJson('/api/provider/notifications');
        $notifResponse->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $notifications = $notifResponse->json('data');
        $this->assertNotEmpty($notifications);

        $firstId = $notifications[0]['id'];

        // Mark as read
        $readResponse = $this->patchJson("/api/provider/notifications/{$firstId}/read");
        $readResponse->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // Mark all as read
        $allReadResponse = $this->postJson('/api/provider/notifications/mark-all-read');
        $allReadResponse->assertStatus(200)
            ->assertJsonPath('unread_count', 0);

        // Reviews index
        $reviewResponse = $this->getJson('/api/provider/reviews');
        $reviewResponse->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('average_rating', 5);
    }
}
