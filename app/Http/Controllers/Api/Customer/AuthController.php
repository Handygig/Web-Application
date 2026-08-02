<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Customer;
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
     * Authenticate customer app user and return token.
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

        if (! $user->hasRole('customer')) {
            return response()->json([
                'message' => __('Access denied. This endpoint is for customers only.'),
            ], 403);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Register customer app user and return token.
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
                        'role' => 'customer',
                        'full_name' => $payload['name'] ?? $request->full_name ?? 'Customer',
                        'email' => $email,
                        'phone' => $payload['phone_number'] ?? $request->phone ?? '',
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
            $user = User::create([
                'role' => 'customer',
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            $user->assignRole('customer');

            Customer::create([
                'user_id' => $user->id,
            ]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }
}
