<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\UpdateLocationRequest;
use App\Http\Requests\Api\Provider\UpdateProfileRequest;
use App\Http\Resources\Api\Provider\ProviderProfileResource;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Get authenticated provider profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;

        if (! $provider) {
            $provider = Provider::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'provider_type' => 'individual',
                    'approval_status' => 'pending',
                    'availability' => 'available',
                ]
            );
        }

        $provider->load(['user', 'serviceCategories', 'company', 'reviews']);

        return response()->json([
            'status' => 'success',
            'data' => new ProviderProfileResource($provider),
            'provider' => new ProviderProfileResource($provider),
        ]);
    }

    /**
     * Update authenticated provider profile.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;

        if (! $provider) {
            $provider = Provider::create([
                'user_id' => $user->id,
                'provider_type' => 'individual',
                'approval_status' => 'pending',
                'availability' => 'available',
            ]);
        }

        // Update User info
        if ($request->filled('first_name') || $request->filled('last_name')) {
            $firstName = $request->input('first_name', explode(' ', $user->full_name ?? '')[0] ?? '');
            $lastName = $request->input('last_name', explode(' ', $user->full_name ?? '', 2)[1] ?? '');
            $user->full_name = trim($firstName.' '.$lastName);
        }
        if ($request->filled('email')) {
            $user->email = $request->input('email');
        }
        if ($request->filled('phone')) {
            $user->phone = $request->input('phone');
        }
        if ($request->hasFile('profile_image')) {
            $user->profile_image = $request->file('profile_image')->store('profile-images', 'public');
        }
        $user->save();

        // Update Provider fields
        $fields = [
            'bio',
            'availability',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'postal_code',
            'country',
            'latitude',
            'longitude',
            'service_radius',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                $provider->{$field} = $request->input($field);
            }
        }

        $provider->save();

        // Sync services if provided
        if ($request->has('services') && is_array($request->input('services'))) {
            $provider->serviceCategories()->sync($request->input('services'));
        }

        $provider->load(['user', 'serviceCategories', 'company', 'reviews']);

        return response()->json([
            'status' => 'success',
            'message' => __('Profile updated successfully'),
            'data' => new ProviderProfileResource($provider),
            'provider' => new ProviderProfileResource($provider),
        ]);
    }

    /**
     * Toggle online/offline status.
     */
    public function toggleAvailability(Request $request): JsonResponse
    {
        $provider = $request->user()->provider;

        if (! $provider) {
            return response()->json(['message' => __('Provider profile not found')], 404);
        }

        if ($request->has('is_online')) {
            $isOnline = $request->boolean('is_online');
            $provider->availability = $isOnline ? 'available' : 'unavailable';
        } elseif ($request->has('availability')) {
            $provider->availability = $request->input('availability');
        } else {
            $provider->availability = ($provider->availability === 'available') ? 'unavailable' : 'available';
        }

        $provider->save();

        $isAvailable = $provider->availability === 'available';

        return response()->json([
            'status' => 'success',
            'message' => $isAvailable ? __('You are now online') : __('You are now offline'),
            'availability' => $provider->availability,
            'is_online' => $isAvailable,
        ]);
    }

    /**
     * Update current live location.
     */
    public function updateLocation(UpdateLocationRequest $request): JsonResponse
    {
        $provider = $request->user()->provider;

        if (! $provider) {
            return response()->json(['message' => __('Provider profile not found')], 404);
        }

        $provider->latitude = $request->latitude;
        $provider->longitude = $request->longitude;

        if ($request->filled('service_radius')) {
            $provider->service_radius = $request->service_radius;
        }

        $provider->save();

        return response()->json([
            'status' => 'success',
            'message' => __('Location updated successfully'),
            'latitude' => (float) $provider->latitude,
            'longitude' => (float) $provider->longitude,
            'service_radius' => (float) $provider->service_radius,
        ]);
    }
}
