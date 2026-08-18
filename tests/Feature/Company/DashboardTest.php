<?php

namespace Tests\Feature\Company;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_company_dashboard(): void
    {
        $response = $this->get(route('company.dashboard'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_company_user_can_access_company_dashboard(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create();
        $user->assignRole('company');

        $response = $this->actingAs($user)->get(route('company.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Company/Dashboard')
            ->has('stats')
        );
    }
}
