<?php

namespace Tests\Feature\Api\Customer;

use App\Models\Faq;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $customerUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        $this->customerUser = User::create([
            'role' => 'customer',
            'full_name' => 'Alice Customer',
            'email' => 'alice@example.com',
            'phone' => '+15555554321',
            'status' => 'active',
        ]);
        $this->customerUser->assignRole('customer');

        Faq::create([
            'question' => 'How to cancel?',
            'answer' => 'Go to jobs tab and click cancel.',
            'category' => 'Booking',
            'order' => 1,
            'is_active' => true,
        ]);

        Faq::create([
            'question' => 'Payment methods?',
            'answer' => 'We accept credit/debit cards.',
            'category' => 'Payments',
            'order' => 2,
            'is_active' => true,
        ]);

        Faq::create([
            'question' => 'Inactive secret question?',
            'answer' => 'Should not appear.',
            'category' => 'Hidden',
            'order' => 99,
            'is_active' => false,
        ]);
    }

    public function test_public_can_fetch_active_faqs(): void
    {
        $response = $this->getJson('/api/faqs');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonCount(2, 'data')
            ->assertJsonMissing(['question' => 'Inactive secret question?']);
    }

    public function test_customer_can_filter_faqs_by_category(): void
    {
        $response = $this->actingAs($this->customerUser, 'sanctum')
            ->getJson('/api/customer/faqs?category=Booking');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['question' => 'How to cancel?'])
            ->assertJsonMissing(['question' => 'Payment methods?']);
    }

    public function test_can_search_faqs(): void
    {
        $response = $this->getJson('/api/faqs?search=credit');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['question' => 'Payment methods?']);
    }

    public function test_can_fetch_faq_categories(): void
    {
        $response = $this->getJson('/api/faqs/categories');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);
    }
}
