<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Company/Dashboard', [
            'stats' => [
                'totalRevenue' => 32450.00,
                'totalCustomers' => 142,
                'totalEmployees' => 16,
                'activeBookings' => 8,
                'pendingPayoutsAmount' => 2150.00,
                'pendingRequestsCount' => 3,
                'completionRate' => 98.4,
            ],
        ]);
    }
}
