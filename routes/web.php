<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BannedAccountController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\JobTypeController as AdminJobTypeController;
use App\Http\Controllers\Admin\KycController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\PropertyTypeController as AdminPropertyTypeController;
use App\Http\Controllers\Admin\ProviderController as AdminProviderController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Company\BookingController as CompanyBookingController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboardController;
use App\Http\Controllers\Company\EmployeeController as CompanyEmployeeController;
use App\Http\Controllers\Company\PaymentController as CompanyPaymentController;
use App\Http\Controllers\Company\ProfileController as CompanyProfileController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [ResetPasswordController::class, 'store'])->name('password.store');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user && $user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('company.dashboard');
    })->name('dashboard');

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Providers
        Route::get('providers', [AdminProviderController::class, 'index'])->name('providers.index');
        Route::get('providers/kyc', [KycController::class, 'index'])->name('providers.kyc');
        Route::get('providers/kyc/{kycVerification}', [KycController::class, 'show'])->name('providers.kyc.show');
        Route::patch('providers/kyc/{kycVerification}/approve', [KycController::class, 'approve'])->name('providers.kyc.approve');
        Route::patch('providers/kyc/{kycVerification}/reject', [KycController::class, 'reject'])->name('providers.kyc.reject');

        Route::get('providers/banned', [BannedAccountController::class, 'index'])->name('providers.banned');
        Route::get('providers/banned/{bannedAccount}', [BannedAccountController::class, 'show'])->name('providers.banned.show');
        Route::patch('providers/banned/{bannedAccount}/unban', [BannedAccountController::class, 'unban'])->name('providers.banned.unban');

        Route::get('providers/create', [AdminProviderController::class, 'create'])->name('providers.create');
        Route::post('providers', [AdminProviderController::class, 'store'])->name('providers.store');
        Route::get('providers/{provider}', [AdminProviderController::class, 'show'])->name('providers.show');
        Route::get('providers/{provider}/edit', [AdminProviderController::class, 'edit'])->name('providers.edit');
        Route::put('providers/{provider}', [AdminProviderController::class, 'update'])->name('providers.update');
        Route::delete('providers/{provider}', [AdminProviderController::class, 'destroy'])->name('providers.destroy');
        Route::put('providers/{provider}/toggle-active', [AdminProviderController::class, 'toggleActive'])->name('providers.toggle-active');

        // Customers
        Route::get('customers', [AdminCustomerController::class, 'index'])->name('customers.index');
        Route::get('customers/create', [AdminCustomerController::class, 'create'])->name('customers.create');
        Route::post('customers', [AdminCustomerController::class, 'store'])->name('customers.store');
        Route::get('customers/{customer}', [AdminCustomerController::class, 'show'])->name('customers.show');
        Route::get('customers/{customer}/edit', [AdminCustomerController::class, 'edit'])->name('customers.edit');
        Route::put('customers/{customer}', [AdminCustomerController::class, 'update'])->name('customers.update');
        Route::patch('customers/{customer}/suspend', [AdminCustomerController::class, 'suspend'])->name('customers.suspend');
        Route::patch('customers/{customer}/activate', [AdminCustomerController::class, 'activate'])->name('customers.activate');
        Route::patch('customers/{customer}/ban', [AdminCustomerController::class, 'ban'])->name('customers.ban');
        Route::delete('customers/{customer}', [AdminCustomerController::class, 'destroy'])->name('customers.destroy');
        Route::put('customers/{customer}/toggle-active', [AdminCustomerController::class, 'toggleActive'])->name('customers.toggle-active');

        // Property Types
        Route::get('property-types', [AdminPropertyTypeController::class, 'index'])->name('property-types.index');
        Route::get('property-types/create', [AdminPropertyTypeController::class, 'create'])->name('property-types.create');
        Route::post('property-types', [AdminPropertyTypeController::class, 'store'])->name('property-types.store');
        Route::get('property-types/{propertyType}/edit', [AdminPropertyTypeController::class, 'edit'])->name('property-types.edit');
        Route::put('property-types/{propertyType}', [AdminPropertyTypeController::class, 'update'])->name('property-types.update');
        Route::delete('property-types/{propertyType}', [AdminPropertyTypeController::class, 'destroy'])->name('property-types.destroy');
        Route::put('property-types/{propertyType}/toggle-active', [AdminPropertyTypeController::class, 'toggleActive'])->name('property-types.toggle-active');

        // Job Types
        Route::get('job-types', [AdminJobTypeController::class, 'index'])->name('job-types.index');
        Route::get('job-types/create', [AdminJobTypeController::class, 'create'])->name('job-types.create');
        Route::post('job-types', [AdminJobTypeController::class, 'store'])->name('job-types.store');
        Route::get('job-types/{jobType}/edit', [AdminJobTypeController::class, 'edit'])->name('job-types.edit');
        Route::put('job-types/{jobType}', [AdminJobTypeController::class, 'update'])->name('job-types.update');
        Route::delete('job-types/{jobType}', [AdminJobTypeController::class, 'destroy'])->name('job-types.destroy');
        Route::put('job-types/{jobType}/toggle-active', [AdminJobTypeController::class, 'toggleActive'])->name('job-types.toggle-active');

        // Bookings
        Route::get('bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
        Route::get('bookings/create', [AdminBookingController::class, 'create'])->name('bookings.create');
        Route::post('bookings', [AdminBookingController::class, 'store'])->name('bookings.store');
        Route::get('bookings/{booking}', [AdminBookingController::class, 'show'])->name('bookings.show');
        Route::get('bookings/{booking}/edit', [AdminBookingController::class, 'edit'])->name('bookings.edit');
        Route::put('bookings/{booking}', [AdminBookingController::class, 'update'])->name('bookings.update');
        Route::patch('bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.update-status');
        Route::patch('bookings/{booking}/cancel', [AdminBookingController::class, 'cancel'])->name('bookings.cancel');
        Route::delete('bookings/{booking}', [AdminBookingController::class, 'destroy'])->name('bookings.destroy');
        Route::put('bookings/{booking}/toggle-active', [AdminBookingController::class, 'toggleActive'])->name('bookings.toggle-active');

        // Profile
        Route::get('profile', [AdminProfileController::class, 'index'])->name('profile.index');
        Route::put('profile', [AdminProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');
        Route::post('profile/avatar', [AdminProfileController::class, 'updateAvatar'])->name('profile.avatar');

        // Audit Logs
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    });

    // Company Routes
    Route::middleware('role:company')->prefix('company')->name('company.')->group(function () {
        Route::get('dashboard', [CompanyDashboardController::class, 'index'])->name('dashboard');

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');

        // Employees
        Route::get('employees', [CompanyEmployeeController::class, 'index'])->name('employees.index');
        Route::get('employees/create', [CompanyEmployeeController::class, 'create'])->name('employees.create');
        Route::post('employees', [CompanyEmployeeController::class, 'store'])->name('employees.store');
        Route::get('employees/{employee}', [CompanyEmployeeController::class, 'show'])->name('employees.show');
        Route::get('employees/{employee}/edit', [CompanyEmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('employees/{employee}', [CompanyEmployeeController::class, 'update'])->name('company.employees.update');
        Route::delete('employees/{employee}', [CompanyEmployeeController::class, 'destroy'])->name('employees.destroy');
        Route::put('employees/{employee}/toggle-active', [CompanyEmployeeController::class, 'toggleActive'])->name('employees.toggle-active');

        // Bookings
        Route::get('bookings', [CompanyBookingController::class, 'index'])->name('bookings.index');
        Route::get('bookings/create', [CompanyBookingController::class, 'create'])->name('bookings.create');
        Route::post('bookings', [CompanyBookingController::class, 'store'])->name('bookings.store');
        Route::get('bookings/{booking}', [CompanyBookingController::class, 'show'])->name('bookings.show');
        Route::get('bookings/{booking}/edit', [CompanyBookingController::class, 'edit'])->name('bookings.edit');
        Route::put('bookings/{booking}', [CompanyBookingController::class, 'update'])->name('bookings.update');
        Route::delete('bookings/{booking}', [CompanyBookingController::class, 'destroy'])->name('bookings.destroy');
        Route::delete('/api/company/bookings/{id}', [CompanyBookingController::class, 'destroy']);
        Route::put('bookings/{booking}/toggle-active', [CompanyBookingController::class, 'toggleActive'])->name('bookings.toggle-active');

        // Payments
        Route::get('payments', [CompanyPaymentController::class, 'index'])->name('payments.index');
        Route::get('payments/create', [CompanyPaymentController::class, 'create'])->name('payments.create');
        Route::post('payments', [CompanyPaymentController::class, 'store'])->name('payments.store');
        Route::post('payments/{id}/reverse', [CompanyPaymentController::class, 'reverse'])->name('payments.reverse');
        Route::get('payments/{payment}', [CompanyPaymentController::class, 'show'])->name('payments.show');
        Route::get('payments/{payment}/edit', [CompanyPaymentController::class, 'edit'])->name('payments.edit');
        Route::put('payments/{payment}', [CompanyPaymentController::class, 'update'])->name('payments.update');
        Route::delete('payments/{payment}', [CompanyPaymentController::class, 'destroy'])->name('payments.destroy');
        Route::put('payments/{payment}/toggle-active', [CompanyPaymentController::class, 'toggleActive'])->name('payments.toggle-active');

        // Profile
        Route::get('profile', [CompanyProfileController::class, 'index'])->name('profile.index');
        Route::put('profile', [CompanyProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [CompanyProfileController::class, 'updatePassword'])->name('profile.password');
        Route::post('profile/upload-logo', [CompanyProfileController::class, 'uploadLogo'])->name('profile.upload-logo');
    });

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('verify-email', [EmailVerificationController::class, 'prompt'])->name('verification.notice');

    Route::middleware('throttle:6,1')->group(function () {
        Route::get('verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware('signed')
            ->name('verification.verify');

        Route::post('email/verification-notification', [EmailVerificationController::class, 'store'])
            ->name('verification.send');
    });
});
