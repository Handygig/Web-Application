<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\JobRequest;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\Provider;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $grossRevenue = (float) Payment::sum('amount');
        $platformFees = (float) Payment::sum('platform_fee');
        $pendingPayoutsAmount = (float) Payout::where('status', 'pending')->sum('amount');
        $pendingPayoutsCount = Payout::where('status', 'pending')->count();

        $totalProviders = Provider::count();
        $totalCustomers = Customer::count();
        $activeBookings = JobRequest::where('status', 'in_progress')->count();

        $stats = [
            'grossRevenue' => $grossRevenue,
            'platformFees' => $platformFees,
            'pendingPayoutsAmount' => $pendingPayoutsAmount,
            'pendingPayoutsCount' => $pendingPayoutsCount,
            'totalProviders' => $totalProviders,
            'totalCustomers' => $totalCustomers,
            'activeBookings' => $activeBookings,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
