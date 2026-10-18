<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        $this->adminUser = User::create([
            'role' => 'admin',
            'full_name' => 'Super Administrator',
            'email' => 'admin@handygig.com',
            'phone' => '+94770000000',
            'status' => 'active',
            'password' => Hash::make('CurrentPassword123!'),
        ]);
        $this->adminUser->assignRole('admin');
    }

    public function test_admin_can_view_profile_page(): void
    {
        AuditLog::log($this->adminUser->id, 'Login', 'User', $this->adminUser->id, 'Logged in to dashboard');

        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.profile.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Profile/Index')
            ->has('user.data')
            ->where('user.data.email', 'admin@handygig.com')
            ->where('user.data.full_name', 'Super Administrator')
            ->has('recentActivities')
        );
    }

    public function test_admin_can_update_profile_information(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.profile.update'), [
                'full_name' => 'Updated Admin Name',
                'email' => 'updated_admin@handygig.com',
                'phone' => '+94771112233',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->adminUser->refresh();
        $this->assertEquals('Updated Admin Name', $this->adminUser->full_name);
        $this->assertEquals('updated_admin@handygig.com', $this->adminUser->email);
        $this->assertEquals('+94771112233', $this->adminUser->phone);

        $this->assertDatabaseHas('audit_logs', [
            'admin_id' => $this->adminUser->id,
            'action' => 'Profile updated',
        ]);
    }

    public function test_admin_can_update_password(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.profile.password'), [
                'current_password' => 'CurrentPassword123!',
                'new_password' => 'NewSecretPassword456!',
                'new_password_confirmation' => 'NewSecretPassword456!',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->adminUser->refresh();
        $this->assertTrue(Hash::check('NewSecretPassword456!', $this->adminUser->password));

        $this->assertDatabaseHas('audit_logs', [
            'admin_id' => $this->adminUser->id,
            'action' => 'Password updated',
        ]);
    }

    public function test_admin_cannot_update_password_with_incorrect_current_password(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.profile.password'), [
                'current_password' => 'WrongPassword!',
                'new_password' => 'NewSecretPassword456!',
                'new_password_confirmation' => 'NewSecretPassword456!',
            ]);

        $response->assertSessionHasErrors('current_password');
    }

    public function test_admin_can_upload_and_destroy_avatar(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.profile.avatar'), [
                'avatar' => $file,
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->adminUser->refresh();
        $this->assertNotNull($this->adminUser->profile_image);
        Storage::disk('public')->assertExists($this->adminUser->profile_image);

        // Delete avatar
        $deleteResponse = $this->actingAs($this->adminUser)
            ->delete(route('admin.profile.avatar.destroy'));

        $deleteResponse->assertSessionHasNoErrors();
        $deleteResponse->assertRedirect();

        $this->adminUser->refresh();
        $this->assertNull($this->adminUser->profile_image);
    }
}
