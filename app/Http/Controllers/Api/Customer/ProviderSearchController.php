<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Customer\ProviderSearchResultResource;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProviderSearchController extends Controller
{
    /**
     * Search and load providers around a location and/or by service.
     */
    public function search(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $lat = $request->filled('latitude') ? (float) $request->input('latitude') : null;
        $lng = $request->filled('longitude') ? (float) $request->input('longitude') : null;
        $radius = (float) $request->input('radius', 50); // radius in kilometers, default 50km
        $serviceQuery = $request->input('service') ?? $request->input('query');
        $categoryId = $request->input('category_id');
        $locationQuery = $request->input('location');

        $query = Provider::with(['user', 'serviceCategories.services', 'company', 'reviews']);

        // Only approved providers (unless in dev mode where none are approved)
        if (Provider::where('approval_status', 'approved')->exists()) {
            $query->where('approval_status', 'approved');
        }

        // Filter by category ID if provided
        if ($categoryId && $categoryId !== 'All' && is_numeric($categoryId)) {
            $query->whereHas('serviceCategories', function ($cq) use ($categoryId) {
                $cq->where('service_categories.id', $categoryId);
            });
        }

        // Filter by service name or query if provided
        if (!empty($serviceQuery) && strtolower($serviceQuery) !== 'all') {
            $query->where(function ($q) use ($serviceQuery) {
                $q->whereHas('serviceCategories', function ($cq) use ($serviceQuery) {
                    $cq->where('service_name', 'like', "%{$serviceQuery}%")
                       ->orWhereHas('services', function ($sq) use ($serviceQuery) {
                           $sq->where('name', 'like', "%{$serviceQuery}%");
                       });
                })
                ->orWhereHas('user', function ($uq) use ($serviceQuery) {
                    $uq->where('full_name', 'like', "%{$serviceQuery}%");
                })
                ->orWhere('bio', 'like', "%{$serviceQuery}%");
            });
        }

        // Filter by text location (e.g. city or address) if provided and no coordinates
        if (!empty($locationQuery) && ($lat === null || $lng === null)) {
            $query->where(function ($q) use ($locationQuery) {
                $q->where('city', 'like', "%{$locationQuery}%")
                  ->orWhere('address_line1', 'like', "%{$locationQuery}%")
                  ->orWhere('address_line2', 'like', "%{$locationQuery}%")
                  ->orWhere('state', 'like', "%{$locationQuery}%");
            });
        }

        // Location / Distance filtering with Haversine formula
        $hasCoords = Provider::whereNotNull('latitude')->whereNotNull('longitude')->exists();
        if ($lat !== null && $lng !== null && $hasCoords) {
            $haversine = "(6371 * acos(LEAST(1.0, GREATEST(-1.0,
                cos(radians(?)) *
                cos(radians(latitude)) *
                cos(radians(longitude) - radians(?)) +
                sin(radians(?)) *
                sin(radians(latitude))
            ))))";

            $query->whereNotNull('latitude')->whereNotNull('longitude');
            $query->selectRaw("providers.*, {$haversine} as distance_km", [$lat, $lng, $lat]);

            // If providers exist within the radius, filter by radius; otherwise order by distance
            $countInRadius = (clone $query)->whereRaw("{$haversine} <= ?", [$lat, $lng, $lat, $radius])->count();
            if ($countInRadius > 0) {
                $query->whereRaw("{$haversine} <= ?", [$lat, $lng, $lat, $radius]);
            }

            $query->orderBy('distance_km', 'asc');
        } else {
            $query->latest();
        }

        $providers = $query->limit(50)->get();

        return ProviderSearchResultResource::collection($providers);
    }
}
