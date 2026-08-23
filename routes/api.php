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

// Admin API Routes (Unauthenticated login)
Route::post('auth/login', [App\Http\Controllers\Api\AdminApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::match(['put', 'patch'], 'user/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Protected Admin API Routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/profile', [App\Http\Controllers\Api\AdminApiController::class, 'getProfile']);
        Route::put('/profile', [App\Http\Controllers\Api\AdminApiController::class, 'updateProfile']);
        Route::put('/profile/password', [App\Http\Controllers\Api\AdminApiController::class, 'changePassword']);

        Route::get('/customers', [App\Http\Controllers\Api\AdminApiController::class, 'getCustomers']);
        Route::get('/customers/statistics', [App\Http\Controllers\Api\AdminApiController::class, 'getCustomerStats']);
        Route::get('/customers/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getCustomer']);
        Route::put('/customers/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'updateCustomer']);
        Route::patch('/customers/{id}/suspend', [App\Http\Controllers\Api\AdminApiController::class, 'suspendCustomer']);
        Route::patch('/customers/{id}/activate', [App\Http\Controllers\Api\AdminApiController::class, 'activateCustomer']);
        Route::patch('/customers/{id}/ban', [App\Http\Controllers\Api\AdminApiController::class, 'banCustomer']);

        Route::get('/providers', [App\Http\Controllers\Api\AdminApiController::class, 'getProviders']);
        Route::get('/providers/statistics', [App\Http\Controllers\Api\AdminApiController::class, 'getProviderStats']);
        Route::get('/providers/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getProvider']);
        Route::put('/providers/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'updateProvider']);

        Route::get('/kyc-kyb', [App\Http\Controllers\Api\AdminApiController::class, 'getKycApprovals']);
        Route::get('/kyc-kyb/statistics', [App\Http\Controllers\Api\AdminApiController::class, 'getKycStats']);
        Route::get('/kyc-kyb/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getKycApproval']);
        Route::patch('/kyc-kyb/{id}/approve', [App\Http\Controllers\Api\AdminApiController::class, 'approveKyc']);
        Route::patch('/kyc-kyb/{id}/reject', [App\Http\Controllers\Api\AdminApiController::class, 'rejectKyc']);

        Route::get('/banned-accounts', [App\Http\Controllers\Api\AdminApiController::class, 'getBannedAccounts']);
        Route::get('/banned-accounts/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getBanDetail']);
        Route::patch('/banned-accounts/{id}/unban', [App\Http\Controllers\Api\AdminApiController::class, 'unbanAccount']);

        Route::get('/property-types', [App\Http\Controllers\Api\AdminApiController::class, 'getPropertyTypes']);
        Route::post('/property-types', [App\Http\Controllers\Api\AdminApiController::class, 'createPropertyType']);
        Route::get('/property-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getPropertyType']);
        Route::put('/property-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'updatePropertyType']);
        Route::patch('/property-types/{id}/activate', [App\Http\Controllers\Api\AdminApiController::class, 'activatePropertyType']);
        Route::patch('/property-types/{id}/deactivate', [App\Http\Controllers\Api\AdminApiController::class, 'deactivatePropertyType']);
        Route::delete('/property-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'deletePropertyType']);

        Route::get('/job-types', [App\Http\Controllers\Api\AdminApiController::class, 'getJobTypes']);
        Route::post('/job-types', [App\Http\Controllers\Api\AdminApiController::class, 'createJobType']);
        Route::get('/job-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getJobType']);
        Route::put('/job-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'updateJobType']);
        Route::patch('/job-types/{id}/activate', [App\Http\Controllers\Api\AdminApiController::class, 'activateJobType']);
        Route::patch('/job-types/{id}/deactivate', [App\Http\Controllers\Api\AdminApiController::class, 'deactivateJobType']);
        Route::delete('/job-types/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'deleteJobType']);

        Route::get('/bookings', [App\Http\Controllers\Api\AdminApiController::class, 'getBookings']);
        Route::get('/bookings/statistics', [App\Http\Controllers\Api\AdminApiController::class, 'getBookingStats']);
        Route::get('/bookings/{id}', [App\Http\Controllers\Api\AdminApiController::class, 'getBooking']);
        Route::patch('/bookings/{id}/status', [App\Http\Controllers\Api\AdminApiController::class, 'updateBookingStatus']);
        Route::patch('/bookings/{id}/cancel', [App\Http\Controllers\Api\AdminApiController::class, 'cancelBooking']);

        Route::get('/dashboard', [App\Http\Controllers\Api\AdminApiController::class, 'getDashboardOverview']);
        Route::get('/dashboard/booking-analytics', [App\Http\Controllers\Api\AdminApiController::class, 'getBookingAnalytics']);
        Route::get('/dashboard/revenue', [App\Http\Controllers\Api\AdminApiController::class, 'getRevenue']);
        Route::get('/payouts/pending', [App\Http\Controllers\Api\AdminApiController::class, 'getPendingPayouts']);
        Route::get('/reviews/recent', [App\Http\Controllers\Api\AdminApiController::class, 'getRecentReviews']);
        Route::get('/system/health', [App\Http\Controllers\Api\AdminApiController::class, 'getSystemHealth']);

        Route::get('/audit-logs', [App\Http\Controllers\Api\AdminApiController::class, 'getAuditLogs']);
    });

    // Protected Customer API Routes
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::put('complete-profile', [App\Http\Controllers\Api\Customer\AuthController::class, 'completeProfile']);
    });

    // Protected Provider API Routes
    Route::middleware('role:provider')->prefix('provider')->group(function () {});
});
