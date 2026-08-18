<?php

namespace Tests\Feature\Company;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_company_payments(): void
    {
        $response = $this->get(route('company.payments.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_company_user_can_access_company_payments(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create();
        $user->assignRole('company');

        $response = $this->actingAs($user)->get(route('company.payments.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Company/Payment/Index')
        );
    }
}
