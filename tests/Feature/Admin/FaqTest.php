<?php

namespace Tests\Feature\Admin;

use App\Models\Faq;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqTest extends TestCase
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

    public function test_admin_can_view_faqs_index(): void
    {
        Faq::create([
            'question' => 'How to book?',
            'answer' => 'Follow the home screen flow.',
            'category' => 'Booking',
            'order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.faqs.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_create_faq(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.faqs.store'), [
                'question' => 'What is the refund policy?',
                'answer' => 'Full refund within 2 hours of booking cancellation.',
                'category' => 'Payments',
                'order' => 2,
                'is_active' => true,
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('faqs', [
            'question' => 'What is the refund policy?',
            'category' => 'Payments',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_faq(): void
    {
        $faq = Faq::create([
            'question' => 'Old question?',
            'answer' => 'Old answer.',
            'category' => 'General',
            'order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.faqs.update', $faq->id), [
                'question' => 'Updated question?',
                'answer' => 'Updated answer with more detail.',
                'category' => 'Booking',
                'order' => 5,
                'is_active' => true,
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('faqs', [
            'id' => $faq->id,
            'question' => 'Updated question?',
            'category' => 'Booking',
            'order' => 5,
        ]);
    }

    public function test_admin_can_toggle_faq_active_status(): void
    {
        $faq = Faq::create([
            'question' => 'Toggle test?',
            'answer' => 'Testing toggle.',
            'category' => 'General',
            'order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.faqs.toggle-active', $faq->id));

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('faqs', [
            'id' => $faq->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_delete_faq(): void
    {
        $faq = Faq::create([
            'question' => 'To be deleted?',
            'answer' => 'Will be removed.',
            'category' => 'General',
            'order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.faqs.destroy', $faq->id));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('faqs', [
            'id' => $faq->id,
        ]);
    }
}
