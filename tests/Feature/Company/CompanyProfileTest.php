<?php

namespace Tests\Feature\Company;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CompanyProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_company_user_can_access_company_profile_page(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create();
        $user->assignRole('company');

        $response = $this->actingAs($user)->get(route('company.profile.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Company/Profile/Index'));
    }

    public function test_company_user_can_update_company_profile(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create();
        $user->assignRole('company');

        $response = $this->actingAs($user)->put(route('company.profile.update'), [
            'companyName' => 'Apex Repair Solutions',
            'email' => 'info@apexsolutions.com',
            'phone' => '+94 11 234 5678',
            'registrationNumber' => 'REG-9900',
            'website' => 'https://apexsolutions.com',
            'category' => 'Electrical Services',
            'description' => 'Updated business description',
            'address' => '500 Galle Road',
            'city' => 'Colombo',
            'province' => 'Western',
            'postalCode' => '00500',
            'country' => 'Sri Lanka',
        ]);

        $response->assertRedirect();
        $user->refresh();

        $this->assertSame('Apex Repair Solutions', $user->name);
        $this->assertSame('info@apexsolutions.com', $user->email);
    }

    public function test_company_user_can_update_password_with_valid_current_password(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!'),
        ]);
        $user->assignRole('company');

        $response = $this->actingAs($user)->put(route('company.profile.password'), [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertRedirect();
        $user->refresh();

        $this->assertTrue(Hash::check('NewPassword123!', $user->password));
    }

    public function test_company_user_cannot_update_password_with_invalid_current_password(): void
    {
        Role::create(['name' => 'company']);

        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!'),
        ]);
        $user->assignRole('company');

        $response = $this->actingAs($user)->put(route('company.profile.password'), [
            'current_password' => 'WrongPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertSessionHasErrors('current_password');
        $user->refresh();

        $this->assertTrue(Hash::check('OldPassword123!', $user->password));
    }
}
