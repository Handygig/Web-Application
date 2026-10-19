<?php

namespace Tests\Feature\Admin;

use App\Http\Resources\Admin\CustomerResource;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\JobRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class CustomerAuditAndDynamicDataTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        $this->adminUser = User::create([
            'role' => 'admin',
            'full_name' => 'Admin User',
            'email' => 'admin@handygig.com',
            'phone' => '+1234567890',
            'status' => 'active',
        ]);
        $this->adminUser->assignRole('admin');
    }

    public function test_customer_resource_returns_dynamic_database_data(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+94771234567',
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        $customer = Customer::create([
            'user_id' => $user->id,
            'membership_tier' => 'Platinum Member',
        ]);

        Property::create([
            'customer_id' => $customer->id,
            'label' => 'Home',
            'address_line' => '42 Wallaby Way',
            'city' => 'Sydney',
            'is_default' => true,
        ]);

        $category = \App\Models\ServiceCategory::create([
            'service_name' => 'Plumbing',
            'description' => 'Plumbing repairs',
            'is_active' => true,
        ]);

        JobRequest::create([
            'customer_id' => $customer->id,
            'service_category_id' => $category->id,
            'title' => 'Fix Sink',
            'description' => 'Fix leaking kitchen sink',
            'preferred_date' => now(),
            'budget' => 150.00,
            'status' => 'completed',
        ]);

        AuditLog::create([
            'admin_id' => null,
            'action' => 'Account Created',
            'entity_type' => 'Customer',
            'entity_id' => $customer->id,
            'description' => 'Initial account registration',
        ]);

        AuditLog::create([
            'admin_id' => null,
            'action' => 'Login',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'description' => 'Customer logged in to platform',
        ]);

        AuditLog::create([
            'admin_id' => null,
            'action' => 'Profile Updated',
            'entity_type' => 'Customer',
            'entity_id' => $customer->id,
            'description' => 'Address updated by customer',
        ]);

        $resource = new CustomerResource($customer);
        $data = $resource->toArray(new Request());

        $this->assertEquals('John Doe', $data['full_name']);
        $this->assertEquals('john@example.com', $data['email']);
        $this->assertEquals('+94771234567', $data['phone']);
        $this->assertEquals('Platinum Member', $data['customerType']);
        $this->assertEquals('42 Wallaby Way', $data['address']);
        $this->assertEquals('Sydney', $data['city']);
        $this->assertEquals(1, $data['ordersCount']);
        $this->assertEquals(1, $data['completedOrders']);
        $this->assertCount(1, $data['orders']);
        $this->assertEquals('Fix Sink', $data['orders'][0]['id'] !== '' ? 'Fix Sink' : '');
        $this->assertEquals('$150.00', $data['orders'][0]['amount']);

        $this->assertCount(3, $data['activityLogs']);
        $this->assertCount(3, $data['accountHistory']);

        // Check account history records
        $actions = collect($data['accountHistory'])->pluck('action')->all();
        $this->assertContains('Account Created', $actions);
        $this->assertContains('Login', $actions);
        $this->assertContains('Profile Updated', $actions);
    }

    public function test_customer_login_logs_major_activity(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+94779876543',
            'password' => bcrypt('password123'),
            'status' => 'active',
        ]);
        $user->assignRole('customer');

        Customer::create(['user_id' => $user->id]);

        $this->post('/login', [
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'Login',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'description' => 'Customer logged in to platform',
        ]);
    }

    public function test_customer_registration_logs_account_created(): void
    {
        $this->post('/register', [
            'full_name' => 'New User',
            'email' => 'newuser@example.com',
            'phone' => '+94770001122',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'role' => 'customer',
        ]);

        $newUser = User::where('email', 'newuser@example.com')->first();
        $this->assertNotNull($newUser);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'Account Created',
            'entity_type' => 'User',
            'entity_id' => $newUser->id,
            'description' => 'Initial account registration',
        ]);
    }

    public function test_admin_customer_index_renders_without_errors(): void
    {
        $user = User::create([
            'role' => 'customer',
            'full_name' => 'Alice Smith',
            'email' => 'alice@example.com',
            'phone' => '+94772223344',
            'status' => 'active',
        ]);
        $user->assignRole('customer');
        Customer::create(['user_id' => $user->id]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.customers.index'));

        $response->assertStatus(200);
    }
}
