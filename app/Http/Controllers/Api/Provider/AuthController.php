<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Provider;
use App\Models\User;
use App\Services\FirebaseTokenVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected FirebaseTokenVerifier $tokenVerifier
    ) {}

    /**
     * Authenticate provider app user and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if ($request->filled('firebase_token')) {
            $payload = $this->tokenVerifier->verify($request->firebase_token);
            $firebaseUid = $payload['sub'];
            $email = $payload['email'] ?? null;

            $user = User::where('firebase_uid', $firebaseUid)->first();

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

        if (! $user->hasRole('provider') && ! $user->hasRole('company')) {
            return response()->json([
                'message' => __('Access denied. This endpoint is for providers and companies only.'),
            ], 403);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Register provider app user and return token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        if ($request->filled('firebase_token')) {
            $payload = $this->tokenVerifier->verify($request->firebase_token);
            $firebaseUid = $payload['sub'];
            $email = $payload['email'] ?? $request->email;

            if (! $email) {
                throw ValidationException::withMessages([
                    'firebase_token' => [__('Email address is missing from the Firebase token.')],
                ]);
            }

            $user = User::where('firebase_uid', $firebaseUid)->first();

            if (! $user) {
                $user = User::where('email', $email)->first();

                if ($user) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                } else {
                    $user = User::create([
                        'role' => 'provider',
                        'full_name' => $payload['name'] ?? $request->full_name ?? 'Provider',
                        'email' => $email,
                        'phone' => $payload['phone_number'] ?? $request->phone ?? '',
                        'password' => null,
                        'firebase_uid' => $firebaseUid,
                        'status' => 'active',
                    ]);
                }
            }

            if (! $user->hasRole('provider')) {
                $user->assignRole('provider');
            }

            if (! $user->provider()->exists()) {
                Provider::create([
                    'user_id' => $user->id,
                    'provider_type' => 'individual',
                    'approval_status' => 'pending',
                ]);
            }
        } else {
            $user = User::create([
                'role' => 'provider',
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            $user->assignRole('provider');

            Provider::create([
                'user_id' => $user->id,
                'provider_type' => 'individual',
                'approval_status' => 'pending',
            ]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }
}
