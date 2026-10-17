<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Customer;
use App\Models\Provider;
use App\Models\User;
use App\Services\FirebaseTokenVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected FirebaseTokenVerifier $tokenVerifier
    ) {}

    /**
     * Authenticate or register a user using a Firebase ID token.
     */
    public function firebaseLogin(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => 'required|string',
            'device_name' => 'required|string',
            'role' => 'sometimes|string|in:customer,provider',
        ]);

        try {
            $payload = $this->tokenVerifier->verify($request->id_token);

            $phone = $payload['phone_number'] ?? $payload['phone'] ?? null;
            $firebaseUid = $payload['sub'] ?? null;
            $email = $payload['email'] ?? null;

            if (! $phone) {
                return response()->json(['error' => 'Phone number missing from Firebase Token.'], 422);
            }

            $role = $request->input('role', 'customer');

            $user = User::where('phone', $phone)->first();
            if (! $user && $email) {
                $user = User::where('email', $email)->first();
            }

            if (! $user) {
                $email = $payload['email'] ?? ($phone.'@placeholder.com');

                $user = User::create([
                    'role' => $role,
                    'full_name' => $payload['name'] ?? 'User '.($phone ? substr($phone, -4) : rand(1000, 9999)),
                    'email' => $email,
                    'phone' => $phone ?? '',
                    'firebase_uid' => $firebaseUid,
                    'status' => 'active',
                ]);
            } else {
                if (empty($user->firebase_uid) && $firebaseUid) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                }
                $role = $user->role;
            }

            if (! $user->hasRole($role)) {
                $user->assignRole($role);
            }

            if ($role === 'customer' && ! $user->customer()->exists()) {
                Customer::create([
                    'user_id' => $user->id,
                ]);
            } elseif ($role === 'provider' && ! $user->provider()->exists()) {
                Provider::create([
                    'user_id' => $user->id,
                    'provider_type' => 'individual',
                    'approval_status' => 'pending',
                ]);
            }

            $token = $user->createToken($request->device_name)->plainTextToken;

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'phone_number' => $user->phone,
                    'name' => $user->name,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Invalid or expired Firebase ID token.'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed. Please try again.'], 500);
        }
    }

    /**
     * Retrieve the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json(new UserResource($user));
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($request->filled('full_name')) {
            $user->full_name = $request->input('full_name');
        }

        if ($request->filled('email')) {
            $user->email = $request->input('email');
        }

        if ($request->filled('phone')) {
            $user->phone = $request->input('phone');
        }

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $user->profile_image = $request->file('profile_image')->store('profile-images', 'public');
        }

        $user->save();

        if ($request->filled('gender')) {
            $customer = $user->customer;
            if (! $customer) {
                $customer = Customer::create(['user_id' => $user->id]);
            }
            $customer->gender = $request->input('gender');
            $customer->save();
        }

        return response()->json([
            'status' => 'success',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Log out the user by revoking the current personal access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully from this device.',
        ]);
    }
}
