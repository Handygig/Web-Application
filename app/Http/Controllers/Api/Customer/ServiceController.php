<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Customer\ServiceResource;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceController extends Controller
{
    /**
     * Display a listing of active services.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Service::with('category')->where('is_active', true);

        if ($request->filled('category_id')) {
            $query->where('service_category_id', $request->input('category_id'));
        }

        if ($request->filled('category')) {
            $catName = $request->input('category');
            $query->whereHas('category', function ($cq) use ($catName) {
                $cq->where('service_name', $catName);
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return ServiceResource::collection($query->get());
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service): ServiceResource
    {
        $service->load('category');

        return new ServiceResource($service);
    }

    /**
     * Display services for a specific category.
     */
    public function byCategory(ServiceCategory $serviceCategory): AnonymousResourceCollection
    {
        $services = $serviceCategory->services()
            ->where('is_active', true)
            ->with('category')
            ->get();

        return ServiceResource::collection($services);
    }
}
