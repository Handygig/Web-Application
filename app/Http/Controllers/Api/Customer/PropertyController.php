<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StorePropertyRequest;
use App\Http\Requests\Api\Customer\UpdatePropertyRequest;
use App\Http\Resources\Api\Customer\PropertyResource;
use App\Models\AuditLog;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $customer = $request->user()->customer;
        $properties = $customer ? $customer->properties : collect();

        return PropertyResource::collection($properties);
    }

    /**
     * Store a newly created property.
     */
    public function store(StorePropertyRequest $request): JsonResponse
    {
        $customer = $request->user()->customer;

        $data = $request->validated();
        $isDefault = (bool) ($data['is_default'] ?? false);

        if ($isDefault && $customer) {
            $customer->properties()->update(['is_default' => false]);
        }

        // If it's the customer's first property, force default to true
        if ($customer && $customer->properties()->count() === 0) {
            $data['is_default'] = true;
        }

        $property = $customer->properties()->create($data);

        AuditLog::log(
            null,
            'Profile Updated',
            'Customer',
            $customer->id,
            'Address updated by customer'
        );

        return (new PropertyResource($property))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified property.
     */
    public function show(Request $request, Property $property): PropertyResource|JsonResponse
    {
        $customer = $request->user()->customer;
        if ($property->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        return new PropertyResource($property);
    }

    /**
     * Update the specified property.
     */
    public function update(UpdatePropertyRequest $request, Property $property): PropertyResource|JsonResponse
    {
        $customer = $request->user()->customer;
        if ($property->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $data = $request->validated();
        $isDefault = (bool) ($data['is_default'] ?? false);

        if ($isDefault) {
            $customer->properties()->update(['is_default' => false]);
        }

        $property->update($data);

        AuditLog::log(
            null,
            'Profile Updated',
            'Customer',
            $customer->id,
            'Address updated by customer'
        );

        return new PropertyResource($property);
    }

    /**
     * Remove the specified property.
     */
    public function destroy(Request $request, Property $property): JsonResponse
    {
        $customer = $request->user()->customer;
        if ($property->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $wasDefault = $property->is_default;
        $property->delete();

        if ($wasDefault && $customer) {
            $nextProperty = $customer->properties()->first();
            if ($nextProperty) {
                $nextProperty->update(['is_default' => true]);
            }
        }

        return response()->json(['message' => __('Property deleted successfully')]);
    }
}
