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
use App\Http\Controllers\Api\Customer\ExclusiveOfferController as CustomerExclusiveOfferController;
use App\Http\Controllers\Api\Customer\FaqController as CustomerFaqController;
use App\Http\Controllers\Api\Customer\NotificationController as CustomerNotificationController;
use App\Http\Controllers\Api\Customer\RewardController as CustomerRewardController;
use App\Http\Controllers\Api\Customer\ProviderSearchController;
use App\Http\Controllers\Api\Customer\ServiceCategoryController;
use App\Http\Controllers\Api\Customer\ServiceController as CustomerServiceController;
use App\Http\Controllers\Api\Provider\AuthController as ProviderAuthController;
use App\Http\Controllers\Api\Provider\CompanyController as ProviderCompanyController;
use App\Http\Controllers\Api\Provider\DashboardController as ProviderDashboardController;
use App\Http\Controllers\Api\Provider\JobAssignmentController as ProviderJobAssignmentController;
use App\Http\Controllers\Api\Provider\JobRequestController as ProviderJobRequestController;
use App\Http\Controllers\Api\Provider\NotificationController as ProviderNotificationController;
use App\Http\Controllers\Api\Provider\PayoutAccountController as ProviderPayoutAccountController;
use App\Http\Controllers\Api\Provider\PayoutController as ProviderPayoutController;
use App\Http\Controllers\Api\Provider\ProfileController as ProviderProfileController;
use App\Http\Controllers\Api\Provider\QuotationController as ProviderQuotationController;
use App\Http\Controllers\Api\Provider\ReviewController as ProviderReviewController;
use App\Http\Controllers\Api\Provider\WalletController as ProviderWalletController;
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

// Public Service Catalog Endpoints
Route::get('service-categories', [ServiceCategoryController::class, 'index']);
Route::get('service-categories/{serviceCategory}/services', [CustomerServiceController::class, 'byCategory']);
Route::get('services', [CustomerServiceController::class, 'index']);
Route::get('services/{service}', [CustomerServiceController::class, 'show']);
Route::get('exclusive-offers', [CustomerExclusiveOfferController::class, 'index']);
Route::get('faqs', [CustomerFaqController::class, 'index']);
Route::get('faqs/categories', [CustomerFaqController::class, 'categories']);
Route::get('providers/search', [ProviderSearchController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::put('user/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Protected Customer API Routes
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::put('complete-profile', [CustomerAuthController::class, 'completeProfile']);

        // Providers Search & Locator
        Route::get('providers/search', [ProviderSearchController::class, 'search']);

        // Service Categories & Services
        Route::get('service-categories', [ServiceCategoryController::class, 'index']);
        Route::get('service-categories/{serviceCategory}/services', [CustomerServiceController::class, 'byCategory']);
        Route::get('services', [CustomerServiceController::class, 'index']);
        Route::get('services/{service}', [CustomerServiceController::class, 'show']);

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
        Route::post('job-assignments/{jobAssignment}/extra-charge/approve', [JobAssignmentController::class, 'approveExtra']);
        Route::post('job-assignments/{jobAssignment}/extra-charge/reject', [JobAssignmentController::class, 'rejectExtra']);

        // Cards
        Route::get('cards', [CardController::class, 'index']);
        Route::post('cards', [CardController::class, 'store']);
        Route::post('cards/{card}/default', [CardController::class, 'setDefault']);
        Route::put('cards/{card}/default', [CardController::class, 'setDefault']);
        Route::post('cards/{card}/freeze', [CardController::class, 'toggleFreeze']);
        Route::put('cards/{card}/freeze', [CardController::class, 'toggleFreeze']);
        Route::delete('cards/{card}', [CardController::class, 'destroy']);

        // Payments
        Route::post('job-assignments/{jobAssignment}/pay', [PaymentController::class, 'pay']);

        // Reviews
        Route::post('job-assignments/{jobAssignment}/reviews', [ReviewController::class, 'store']);

        // Disputes
        Route::post('job-assignments/{jobAssignment}/disputes', [DisputeController::class, 'store']);

        // Exclusive Offers
        Route::get('exclusive-offers', [CustomerExclusiveOfferController::class, 'index']);
        Route::post('exclusive-offers/claim', [CustomerExclusiveOfferController::class, 'claim']);

        // FAQs
        Route::get('faqs', [CustomerFaqController::class, 'index']);
        Route::get('faqs/categories', [CustomerFaqController::class, 'categories']);

        // Rewards & Wallet
        Route::get('rewards', [CustomerRewardController::class, 'index']);
        Route::post('rewards/redeem', [CustomerRewardController::class, 'redeem']);
        Route::post('referral/apply', [CustomerRewardController::class, 'applyReferral']);

        // Notifications & Alerts
        Route::get('notifications', [CustomerNotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [CustomerNotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [CustomerNotificationController::class, 'markAllAsRead']);
        Route::delete('notifications/{notification}', [CustomerNotificationController::class, 'destroy']);
    });

    // Protected Provider API Routes
    Route::middleware('role:provider|company')->prefix('provider')->group(function () {
        // Profile & Onboarding
        Route::post('complete-profile', [ProviderAuthController::class, 'completeProfile']);
        Route::put('complete-profile', [ProviderAuthController::class, 'completeProfile']);
        Route::get('profile', [ProviderProfileController::class, 'show']);
        Route::put('profile', [ProviderProfileController::class, 'update']);
        Route::post('status', [ProviderProfileController::class, 'toggleAvailability']);
        Route::post('location', [ProviderProfileController::class, 'updateLocation']);
        Route::post('kyc', [ProviderProfileController::class, 'uploadKyc']);

        // Dashboard Overview
        Route::get('dashboard', [ProviderDashboardController::class, 'index']);

        // Live Radar & Job Requests (To Quote)
        Route::get('radar', [ProviderJobRequestController::class, 'index']);
        Route::get('job-requests', [ProviderJobRequestController::class, 'index']);
        Route::get('job-requests/{jobRequest}', [ProviderJobRequestController::class, 'show']);

        // Quotations (Bidding / Pending Approval)
        Route::get('quotations', [ProviderQuotationController::class, 'index']);
        Route::post('job-requests/{jobRequest}/quotations', [ProviderQuotationController::class, 'store']);
        Route::get('quotations/{quotation}', [ProviderQuotationController::class, 'show']);
        Route::put('quotations/{quotation}', [ProviderQuotationController::class, 'update']);
        Route::delete('quotations/{quotation}', [ProviderQuotationController::class, 'destroy']);

        // Job Assignments (Ongoing & Finished)
        Route::get('jobs', [ProviderJobAssignmentController::class, 'index']);
        Route::get('jobs/{jobAssignment}', [ProviderJobAssignmentController::class, 'show']);
        Route::post('jobs/{jobAssignment}/start', [ProviderJobAssignmentController::class, 'start']);
        Route::post('jobs/{jobAssignment}/extra-charge', [ProviderJobAssignmentController::class, 'requestExtra']);
        Route::post('jobs/{jobAssignment}/complete', [ProviderJobAssignmentController::class, 'complete']);
        Route::post('jobs/{jobAssignment}/dispatch', [ProviderJobAssignmentController::class, 'dispatchJob']);

        // Company Employees / Dispatching Pool
        Route::get('company/employees', [ProviderCompanyController::class, 'employees']);
        Route::post('company/employees', [ProviderCompanyController::class, 'storeEmployee']);

        // Wallet & Financials
        Route::get('wallet', [ProviderWalletController::class, 'index']);
        Route::post('wallet/pay-fees', [ProviderWalletController::class, 'payFees']);

        // Payout Accounts (Bank accounts)
        Route::get('payout-accounts', [ProviderPayoutAccountController::class, 'index']);
        Route::post('payout-accounts', [ProviderPayoutAccountController::class, 'store']);
        Route::put('payout-accounts/{payoutAccount}/default', [ProviderPayoutAccountController::class, 'setDefault']);
        Route::delete('payout-accounts/{payoutAccount}', [ProviderPayoutAccountController::class, 'destroy']);

        // Withdrawals / Payouts
        Route::get('payouts', [ProviderPayoutController::class, 'index']);
        Route::post('payouts', [ProviderPayoutController::class, 'store']);

        // Reviews & Ratings
        Route::get('reviews', [ProviderReviewController::class, 'index']);

        // Notifications & Alerts
        Route::get('notifications', [ProviderNotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [ProviderNotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [ProviderNotificationController::class, 'markAllAsRead']);
        Route::delete('notifications/{notification}', [ProviderNotificationController::class, 'destroy']);
    });

    // Protected Company API Routes
    Route::middleware('role:company')->prefix('company')->group(function () {
        Route::delete('bookings/{id}', [BookingController::class, 'destroy']);
    });
});
