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
use App\Http\Controllers\Company\BookingController;
use Illuminate\Support\Facades\Route;

// Shared/General Firebase Auth Route
Route::post('auth/firebase-login', [AuthController::class, 'firebaseLogin']);

// Customer Auth Routes
Route::post('customer/register', [CustomerAuthController::class, 'register']);
Route::post('customer/login', [CustomerAuthController::class, 'login']);

// Provider Auth Routes
Route::post('provider/register', [ProviderAuthController::class, 'register']);
Route::post('provider/login', [ProviderAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::put('user/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

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
    Route::middleware('role:provider')->prefix('provider')->group(function () {
        Route::post('complete-profile', [ProviderAuthController::class, 'completeProfile']);
        Route::put('complete-profile', [ProviderAuthController::class, 'completeProfile']);
    });

    // Protected Company API Routes
    Route::middleware('role:company')->prefix('company')->group(function () {
        Route::delete('bookings/{id}', [BookingController::class, 'destroy']);
    });
});
