<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\Provider\CompleteProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Provider;
use App\Models\User;
use App\Models\KycVerification;
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
            'is_profile_complete' => $user->is_profile_complete,
        ]);
    }

    /**
     * Register provider app user and return token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $isNewUser = false;

        if ($request->filled('firebase_token')) {
            $payload = $this->tokenVerifier->verify($request->firebase_token);
            $firebaseUid = $payload['sub'];
            $email = $payload['email'] ?? $request->email;
            $phone = $payload['phone_number'] ?? $payload['phone'] ?? $request->phone;

            if (! $email && ! $phone) {
                throw ValidationException::withMessages([
                    'firebase_token' => [__('Email or phone number is missing from the Firebase token.')],
                ]);
            }

            $user = User::where('firebase_uid', $firebaseUid)->first();

            if (! $user) {
                if ($email) {
                    $user = User::where('email', $email)->first();
                } elseif ($phone) {
                    $user = User::where('phone', $phone)->first();
                }

                if ($user) {
                    $user->update(['firebase_uid' => $firebaseUid]);
                } else {
                    $isNewUser = true;
                    $user = User::create([
                        'role' => 'provider',
                        'full_name' => $payload['name'] ?? $request->full_name ?? 'Provider',
                        'email' => $email ?? ($phone . '@placeholder.com'),
                        'phone' => $phone ?? '',
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
            $user = User::where('email', $request->email)->first();
            if ($user) {
                $user->update([
                    'full_name' => $request->full_name,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                ]);
            } else {
                $isNewUser = true;
                $user = User::create([
                    'role' => 'provider',
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'status' => 'active',
                ]);
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
     * Complete the provider profile.
     */
    public function completeProfile(CompleteProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        // Update User fields
        $user->full_name = trim($request->input('firstName') . ' ' . $request->input('lastName'));
        $user->email = $request->input('email');
        $user->save();

        // Update Provider fields
        $provider = $user->provider;
        if (! $provider) {
            $provider = Provider::create([
                'user_id' => $user->id,
                'provider_type' => $request->input('providerType', 'individual'),
                'approval_status' => 'pending',
            ]);
        }

        $provider->provider_type = $request->input('providerType', 'individual');
        $provider->reg_number = $request->input('regNumber');
        $provider->tax_id = $request->input('taxId');
        $provider->address_line1 = $request->input('addressLine1');
        $provider->address_line2 = $request->input('addressLine2');
        $provider->city = $request->input('city');
        $provider->state = $request->input('state');
        $provider->postal_code = $request->input('postalCode');
        $provider->country = $request->input('country');
        
        $provider->save();

        // Sync Services
        if ($request->has('services') && is_array($request->input('services'))) {
            $provider->serviceCategories()->sync($request->input('services'));
        }

        // Handle Documents Upload (KYC)
        $documents = [];
        
        if ($request->hasFile('nicFront')) {
            $documents['nicFront'] = $request->file('nicFront')->store('kyc-documents', 'public');
        }
        if ($request->hasFile('nicBack')) {
            $documents['nicBack'] = $request->file('nicBack')->store('kyc-documents', 'public');
        }
        if ($request->hasFile('brCertificate')) {
            $documents['brCertificate'] = $request->file('brCertificate')->store('kyc-documents', 'public');
        }

        if (!empty($documents)) {
            $kycVerification = $provider->kycVerifications()->where('status', 'PENDING')->first();
            
            if (!$kycVerification) {
                $kycVerification = new KycVerification([
                    'provider_id' => $provider->id,
                    'verification_type' => 'KYC',
                    'status' => 'PENDING',
                ]);
            }

            $existingDocuments = $kycVerification->documents ?? [];
            $kycVerification->documents = array_merge($existingDocuments, $documents);
            $kycVerification->submitted_at = now();
            $kycVerification->save();
        }

        return response()->json([
            'status' => 'success',
            'user' => new UserResource($user),
        ]);
    }
}
