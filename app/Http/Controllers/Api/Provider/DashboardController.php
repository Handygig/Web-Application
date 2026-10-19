<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Provider\ProviderJobRequestResource;
use App\Models\JobAssignment;
use App\Models\JobRequest;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get provider dashboard statistics and live overview.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $providerId = $provider?->id;
        $companyId = $company?->id ?? $provider?->company_id;

        // Today's earnings
        $todayQuery = Payment::where('payment_status', 'paid')
            ->whereDate('payment_date', today());

        if ($companyId) {
            $todayQuery->whereHas('assignment', fn ($q) => $q->where('company_id', $companyId));
        } elseif ($providerId) {
            $todayQuery->where(function ($q) use ($providerId) {
                $q->where('provider_id', $providerId)
                  ->orWhereHas('assignment', fn ($sub) => $sub->where('provider_id', $providerId));
            });
        }

        $todayEarnings = (float) $todayQuery->sum('provider_amount');

        // This Month's earnings
        $monthQuery = Payment::where('payment_status', 'paid')
            ->whereYear('payment_date', now()->year)
            ->whereMonth('payment_date', now()->month);

        if ($companyId) {
            $monthQuery->whereHas('assignment', fn ($q) => $q->where('company_id', $companyId));
        } elseif ($providerId) {
            $monthQuery->where(function ($q) use ($providerId) {
                $q->where('provider_id', $providerId)
                  ->orWhereHas('assignment', fn ($sub) => $sub->where('provider_id', $providerId));
            });
        }

        $monthEarnings = (float) $monthQuery->sum('provider_amount');

        // Completed Jobs count
        $completedJobsQuery = JobAssignment::where('status', 'completed');
        if ($companyId && ! $providerId) {
            $completedJobsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $completedJobsQuery->where('provider_id', $providerId);
        }
        $completedJobsCount = $completedJobsQuery->count();

        // Active (Ongoing) Jobs count
        $ongoingJobsQuery = JobAssignment::whereIn('status', ['scheduled', 'in_progress', 'ongoing']);
        if ($companyId && ! $providerId) {
            $ongoingJobsQuery->where('company_id', $companyId);
        } elseif ($providerId) {
            $ongoingJobsQuery->where('provider_id', $providerId);
        }
        $activeJobsCount = $ongoingJobsQuery->count();

        // Pending Quotes (Pending Approval)
        $pendingQuotesQuery = Quotation::where('status', 'pending');
        if ($companyId && ! $providerId) {
            $pendingQuotesQuery->where('bidder_type', \App\Models\Company::class)->where('bidder_id', $companyId);
        } elseif ($providerId) {
            $pendingQuotesQuery->where(function ($q) use ($providerId) {
                $q->where('bidder_type', \App\Models\Provider::class)->where('bidder_id', $providerId);
            });
        }
        $pendingQuotesCount = $pendingQuotesQuery->count();

        // Unread Notifications count
        $unreadAlertsCount = Notification::where('recipient_user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // Live Radar Requests: Open job requests matching services
        $serviceCategoryIds = $provider
            ? $provider->serviceCategories()->pluck('service_categories.id')->toArray()
            : ($company ? $company->serviceCategories()->pluck('service_categories.id')->toArray() : []);

        $radarQuery = JobRequest::with(['customer.user', 'property', 'serviceCategory'])
            ->whereIn('status', ['pending', 'open'])
            ->whereDoesntHave('assignment');

        if (! empty($serviceCategoryIds)) {
            $radarQuery->whereIn('service_category_id', $serviceCategoryIds);
        }

        if ($provider) {
            // Exclude requests already bid on by this provider
            $radarQuery->whereDoesntHave('quotations', function ($q) use ($provider) {
                $q->where('bidder_type', \App\Models\Provider::class)
                  ->where('bidder_id', $provider->id);
            });
        }

        $nearbyRequests = $radarQuery->latest()->take(10)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'today_earnings' => $todayEarnings,
                'this_month_earnings' => $monthEarnings,
                'completed_jobs_count' => $completedJobsCount,
                'active_jobs_count' => $activeJobsCount,
                'pending_quotes_count' => $pendingQuotesCount,
                'unread_alerts_count' => $unreadAlertsCount,
                'is_online' => ($provider?->availability ?? 'available') === 'available',
                'nearby_job_requests' => ProviderJobRequestResource::collection($nearbyRequests),
            ],
        ]);
    }
}
