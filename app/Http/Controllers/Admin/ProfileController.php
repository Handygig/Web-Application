<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAvatarRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Resources\Admin\UserResource;
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
        $user = auth()->user();

        $recentActivities = AuditLog::where('admin_id', $user->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'title' => $log->description ?: $log->action,
                    'time' => $log->created_at ? $log->created_at->diffForHumans() : '',
                    'formatted_time' => $log->created_at ? $log->created_at->format('M d, Y h:i A') : '',
                ];
            });

        return Inertia::render('Admin/Profile/Index', [
            'user' => new UserResource($user),
            'recentActivities' => $recentActivities,
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

        AuditLog::log(
            auth()->id(),
            'Profile updated',
            'User',
            $user->id,
            'Updated personal profile details'
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

    public function destroyAvatar(): RedirectResponse
    {
        $user = auth()->user();

        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
            $user->update([
                'profile_image' => null,
            ]);

            AuditLog::log(
                auth()->id(),
                'Profile image removed',
                'User',
                $user->id,
                'Removed avatar'
            );
        }

        return redirect()->back()->with('success', __('Profile photo removed successfully.'));
    }
}
