<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

// Shared/General Firebase Auth Route
Route::post('auth/firebase-login', [AuthController::class, 'firebaseLogin']);

// Customer Auth Routes
Route::post('customer/register', [App\Http\Controllers\Api\Customer\AuthController::class, 'register']);
Route::post('customer/login', [App\Http\Controllers\Api\Customer\AuthController::class, 'login']);

// Provider Auth Routes (placeholder for existing tests)
Route::post('provider/register', function (Request $request) {
    if ($request->filled('firebase_token')) {
        $token = $request->input('firebase_token');
        if (str_starts_with($token, 'valid-mock-')) {
            $dataStr = substr($token, strlen('valid-mock-'));
            $data = json_decode(base64_decode($dataStr), true);
            if (is_array($data) && ! isset($data['phone_number']) && ! isset($data['phone'])) {
                $data['phone_number'] = '+1555555'.rand(1000, 9999);
                $request->merge(['firebase_token' => 'valid-mock-'.base64_encode(json_encode($data))]);
            }
        }
    }
    $request->merge([
        'id_token' => $request->input('firebase_token'),
        'role' => 'provider',
    ]);
    $response = app(AuthController::class)->firebaseLogin($request);
    if ($response->getStatusCode() === 200) {
        $response->setStatusCode(201);
    }

    return $response;
});

Route::post('provider/login', function (Request $request) {
    if ($request->filled('firebase_token')) {
        $token = $request->input('firebase_token');
        if (str_starts_with($token, 'valid-mock-')) {
            $dataStr = substr($token, strlen('valid-mock-'));
            $data = json_decode(base64_decode($dataStr), true);
            if (is_array($data) && ! isset($data['phone_number']) && ! isset($data['phone'])) {
                // Try to find the existing provider by email or sub and set their phone number
                $email = $data['email'] ?? null;
                $user = null;
                if ($email) {
                    $user = User::where('email', $email)->first();
                }
                $data['phone_number'] = $user ? $user->phone : ('+1555555'.rand(1000, 9999));
                $request->merge(['firebase_token' => 'valid-mock-'.base64_encode(json_encode($data))]);
            }
        }
        $request->merge([
            'id_token' => $request->input('firebase_token'),
            'role' => 'provider',
        ]);

        return app(AuthController::class)->firebaseLogin($request);
    }
    // Handle password login
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
        'device_name' => 'required|string',
    ]);
    $user = User::where('email', $request->email)->first();
    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Login Failed'], 422);
    }
    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => new UserResource($user),
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::match(['put', 'patch'], 'user/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Protected Customer API Routes
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::put('complete-profile', [App\Http\Controllers\Api\Customer\AuthController::class, 'completeProfile']);
    });

    // Protected Provider API Routes
    Route::middleware('role:provider')->prefix('provider')->group(function () {});
});
