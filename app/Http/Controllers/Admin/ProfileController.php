<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAvatarRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\Admin;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user()->load('admin');

        return Inertia::render('Admin/Profile/Index', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $validated = $request->validated();

        $user->update([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $admin = Admin::firstOrCreate(['user_id' => $user->id]);
        $admin->update([
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'country' => $validated['country'] ?? null,
        ]);

        AuditLog::log(
            auth()->id(),
            'Profile updated',
            'User',
            $user->id,
            'Updated profile details'
        );

        return redirect()->back()->with('success', __('Profile updated successfully.'));
    }

    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        AuditLog::log(
            auth()->id(),
            'Password updated',
            'User',
            auth()->id(),
            'Changed account password'
        );

        return redirect()->back()->with('success', __('Password updated successfully.'));
    }

    public function updateAvatar(UpdateAvatarRequest $request): RedirectResponse
    {
        $request->validated();

        $user = auth()->user();

        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('avatar')->store('profile-images', 'public');

        $user->update([
            'profile_image' => $path,
        ]);

        AuditLog::log(
            auth()->id(),
            'Profile image updated',
            'User',
            $user->id,
            'Uploaded new avatar'
        );

        return redirect()->back()->with('success', __('Profile image updated successfully.'));
    }
}
