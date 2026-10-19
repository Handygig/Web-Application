<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\CompleteProfileRequest;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\User;
use App\Services\FirebaseTokenVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected FirebaseTokenVerifier $tokenVerifier
    ) {}

    /**
     * Authenticate customer app user and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if ($request->filled('firebase_token')) {
            $payload = $this->tokenVerifier->verify($request->firebase_token);
            $firebaseUid = $payload['sub'];
            $phone = $payload['phone_number'] ?? $payload['phone'] ?? null;
            $email = $payload['email'] ?? null;

            $user = User::where('firebase_uid', $firebaseUid)->first();

            if (! $user && $phone) {
                $user = User::where('phone', $phone)->first();
                if ($user) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                }
            }

            if (! $user && $email) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                }
            }

            if (! $user) {
                throw ValidationException::withMessages([
                    'firebase_token' => [__('User not found. Please register first.')],
                ]);
            }
        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => [__('Login Failed')],
                ]);
            }
        }

        if (! $user->hasRole('customer')) {
            return response()->json([
                'message' => __('Access denied. This endpoint is for customers only.'),
            ], 403);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        AuditLog::log(
            null,
            'Login',
            'User',
            $user->id,
            'Customer logged in to platform'
        );

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
            'is_new_user' => false,
            'is_profile_complete' => $user->is_profile_complete,
        ]);
    }

    /**
     * Register customer app user and return token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $isNewUser = false;

        if ($request->filled('firebase_token')) {
            $payload = $this->tokenVerifier->verify($request->firebase_token);
            $firebaseUid = $payload['sub'];
            $phone = $payload['phone_number'] ?? $payload['phone'] ?? $request->phone;
            $email = $payload['email'] ?? $request->email;

            if (! $phone) {
                throw ValidationException::withMessages([
                    'firebase_token' => [__('Phone number is missing from the Firebase token.')],
                ]);
            }

            $user = User::where('firebase_uid', $firebaseUid)->first();

            if (! $user) {
                $user = User::where('phone', $phone)->first();

                if ($user) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                } else {
                    $isNewUser = true;
                    // Provide a default placeholder email if not in token or request
                    $finalEmail = $email ?? ($phone.'@placeholder.com');

                    $user = User::create([
                        'role' => 'customer',
                        'full_name' => $payload['name'] ?? $request->full_name ?? ('User '.substr($phone, -4)),
                        'email' => $finalEmail,
                        'phone' => $phone,
                        'password' => null,
                        'firebase_uid' => $firebaseUid,
                        'status' => 'active',
                    ]);
                }
            }

            if (! $user->hasRole('customer')) {
                $user->assignRole('customer');
            }

            if (! $user->customer()->exists()) {
                Customer::create([
                    'user_id' => $user->id,
                ]);
            }
        } else {
            $user = User::where('phone', $request->phone)->first();
            if ($user) {
                $user->update([
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);
            } else {
                $isNewUser = true;
                $user = User::create([
                    'role' => 'customer',
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'status' => 'active',
                ]);
            }

            if (! $user->hasRole('customer')) {
                $user->assignRole('customer');
            }

            if (! $user->customer()->exists()) {
                Customer::create([
                    'user_id' => $user->id,
                ]);
            }
        }

        if ($isNewUser) {
            AuditLog::log(
                null,
                'Account Created',
                'User',
                $user->id,
                'Initial account registration'
            );
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
            'is_new_user' => $isNewUser,
            'is_profile_complete' => $user->is_profile_complete,
        ], 201);
    }

    /**
     * Complete the customer profile.
     */
    public function completeProfile(CompleteProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        // Update User fields
        $user->full_name = $request->input('full_name');
        $user->email = $request->input('email');

        if ($request->hasFile('profile_image')) {
            // Delete old image if it exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $path = $request->file('profile_image')->store('profile-images', 'public');
            $user->profile_image = $path;
        }

        $user->save();

        // Update Customer gender field
        $customer = $user->customer;
        if (! $customer) {
            $customer = Customer::create(['user_id' => $user->id]);
        }
        $customer->gender = $request->input('gender');
        $customer->save();

        AuditLog::log(
            null,
            'Profile Updated',
            'User',
            $user->id,
            'Customer profile completed'
        );

        return response()->json([
            'status' => 'success',
            'user' => new UserResource($user),
        ]);
    }
}
