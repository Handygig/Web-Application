<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyDashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'totalRevenue' => $this['totalRevenue'] ?? 0,
            'totalCustomers' => $this['totalCustomers'] ?? 0,
            'totalEmployees' => $this['totalEmployees'] ?? 0,
            'activeBookings' => $this['activeBookings'] ?? 0,
            'pendingPayoutsAmount' => $this['pendingPayoutsAmount'] ?? 0,
            'pendingRequestsCount' => $this['pendingRequestsCount'] ?? 0,
            'completionRate' => $this['completionRate'] ?? 0,
        ];
    }
}
