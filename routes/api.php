<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Customer\AuthController as CustomerAuthController;
use App\Http\Controllers\Api\Customer\CardController;
use App\Http\Controllers\Api\Customer\DisputeController;
use App\Http\Controllers\Api\Customer\JobAssignmentController;
use App\Http\Controllers\Api\Customer\JobRequestController;
use App\Http\Controllers\Api\Customer\PaymentController;
use App\Http\Controllers\Api\Customer\PropertyController;
use App\Http\Controllers\Api\Customer\QuotationController;
use App\Http\Controllers\Api\Customer\ReviewController;
use App\Http\Controllers\Api\Customer\ServiceCategoryController;
use App\Http\Controllers\Api\Provider\AuthController as ProviderAuthController;
use Illuminate\Support\Facades\Route;

// Shared/General Firebase Auth Route
Route::post('auth/firebase-login', [AuthController::class, 'firebaseLogin']);

// Customer Auth Routes
Route::post('customer/register', [CustomerAuthController::class, 'register']);
Route::post('customer/login', [CustomerAuthController::class, 'login']);

// Provider Auth Routes
Route::post('provider/register', [ProviderAuthController::class, 'register']);
Route::post('provider/login', [ProviderAuthController::class, 'login']);

// Admin API Routes (Unauthenticated login)
Route::post('auth/login', [App\Http\Controllers\Api\AdminApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::put('user/profile', [AuthController::class, 'updateProfile']);
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
        Route::put('complete-profile', [CustomerAuthController::class, 'completeProfile']);

        // Service Categories
        Route::get('service-categories', [ServiceCategoryController::class, 'index']);

        // Properties
        Route::get('properties', [PropertyController::class, 'index']);
        Route::post('properties', [PropertyController::class, 'store']);
        Route::get('properties/{property}', [PropertyController::class, 'show']);
        Route::put('properties/{property}', [PropertyController::class, 'update']);
        Route::delete('properties/{property}', [PropertyController::class, 'destroy']);

        // Job Requests
        Route::get('job-requests', [JobRequestController::class, 'index']);
        Route::post('job-requests', [JobRequestController::class, 'store']);
        Route::get('job-requests/{jobRequest}', [JobRequestController::class, 'show']);
        Route::post('job-requests/{jobRequest}/cancel', [JobRequestController::class, 'cancel']);

        // Quotations
        Route::get('job-requests/{jobRequest}/quotations', [QuotationController::class, 'index']);
        Route::post('quotations/{quotation}/accept', [QuotationController::class, 'accept']);

        // Job Assignments
        Route::get('job-assignments', [JobAssignmentController::class, 'index']);
        Route::get('job-assignments/{jobAssignment}', [JobAssignmentController::class, 'show']);

        // Cards
        Route::get('cards', [CardController::class, 'index']);
        Route::post('cards', [CardController::class, 'store']);
        Route::delete('cards/{card}', [CardController::class, 'destroy']);

        // Payments
        Route::post('job-assignments/{jobAssignment}/pay', [PaymentController::class, 'pay']);

        // Reviews
        Route::post('job-assignments/{jobAssignment}/reviews', [ReviewController::class, 'store']);

        // Disputes
        Route::post('job-assignments/{jobAssignment}/disputes', [DisputeController::class, 'store']);
    });

    // Protected Provider API Routes
    Route::middleware('role:provider')->prefix('provider')->group(function () {});
});
