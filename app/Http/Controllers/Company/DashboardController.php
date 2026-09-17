<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\CompanyDashboardStatsResource;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $statsData = [
            'totalRevenue' => 32450.00,
            'totalCustomers' => 142,
            'totalEmployees' => 16,
            'activeBookings' => 8,
            'pendingPayoutsAmount' => 2150.00,
            'pendingRequestsCount' => 3,
            'completionRate' => 98.4,
        ];

        return Inertia::render('Company/Dashboard', [
            'stats' => new CompanyDashboardStatsResource($statsData),
        ]);
    }
}
