<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Provider\ProviderJobRequestResource;
use App\Models\JobRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobRequestController extends Controller
{
    /**
     * Display a listing of available job requests (Radar / To Quote).
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company;

        // Architecture Plan: Company-affiliated providers are completely excluded from direct broadcast bidding
        if ($provider && $provider->company_id !== null) {
            return ProviderJobRequestResource::collection(collect());
        }

        $serviceCategoryIds = [];
        if ($provider && $provider->company_id === null) {
            // Independent provider
            $serviceCategoryIds = $provider->serviceCategories()->pluck('service_categories.id')->toArray();
        } elseif ($company) {
            // Company
            if (\Illuminate\Support\Facades\Schema::hasTable('company_services')) {
                $serviceCategoryIds = $company->serviceCategories()->pluck('service_categories.id')->toArray();
            }
            if (empty($serviceCategoryIds)) {
                // Fallback to services of company providers
                $serviceCategoryIds = $company->providers()
                    ->with('serviceCategories')
                    ->get()
                    ->flatMap(fn ($p) => $p->serviceCategories->pluck('id'))
                    ->unique()
                    ->toArray();
            }
        }

        $query = JobRequest::with(['customer.user', 'property', 'serviceCategory'])
            ->whereIn('status', ['pending', 'open'])
            ->whereDoesntHave('assignment');

        // Filter by offered service categories if provider/company has specified services
        if (! empty($serviceCategoryIds)) {
            $query->whereIn('service_category_id', $serviceCategoryIds);
        }

        // Category filter from request
        if ($request->filled('category_id')) {
            $query->where('service_category_id', $request->category_id);
        }

        // Exclude requests already quoted by this entity
        if ($provider && $provider->company_id === null) {
            $query->whereDoesntHave('quotations', function ($q) use ($provider) {
                $q->where('bidder_type', \App\Models\Provider::class)
                  ->where('bidder_id', $provider->id);
            });
        } elseif ($company) {
            $query->whereDoesntHave('quotations', function ($q) use ($company) {
                $q->where('bidder_type', \App\Models\Company::class)
                  ->where('bidder_id', $company->id);
            });
        }

        // Search by keyword
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $jobRequests = $query->latest()->get();

        // Location & Radius Filtering (Radar)
        $lat = $request->input('lat') ?? $provider?->latitude;
        $lng = $request->input('lng') ?? $provider?->longitude;
        $radiusKm = $request->input('radius') ?? $provider?->service_radius ?? 30.0;

        if ($lat && $lng) {
            $jobRequests = $jobRequests->filter(function ($jobRequest) use ($lat, $lng, $radiusKm) {
                $prop = $jobRequest->property;
                if (! $prop || ! $prop->latitude || ! $prop->longitude) {
                    return true; // Keep requests without geo-coords
                }

                // Haversine formula calculation
                $earthRadius = 6371; // km
                $dLat = deg2rad($prop->latitude - $lat);
                $dLon = deg2rad($prop->longitude - $lng);
                $a = sin($dLat / 2) * sin($dLat / 2) +
                    cos(deg2rad($lat)) * cos(deg2rad($prop->latitude)) *
                    sin($dLon / 2) * sin($dLon / 2);
                $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                $distance = $earthRadius * $c;

                return $distance <= (float) $radiusKm;
            })->values();
        }

        return ProviderJobRequestResource::collection($jobRequests);
    }

    /**
     * Display the specified job request details.
     */
    public function show(Request $request, JobRequest $jobRequest): ProviderJobRequestResource
    {
        $jobRequest->load(['customer.user', 'property', 'serviceCategory', 'quotations']);

        return new ProviderJobRequestResource($jobRequest);
    }
}
