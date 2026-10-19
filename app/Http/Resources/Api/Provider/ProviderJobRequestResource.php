<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderJobRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $customer = $this->customer;
        $customerUser = $customer?->user;
        $property = $this->property;
        $serviceCategory = $this->serviceCategory;

        $customerRating = 5.0;
        $customerReviewsCount = 12;

        // Calculate approximate distance if provider coordinates exist
        $distance = 'Nearby';
        $provider = $request->user()?->provider;
        if ($provider && $provider->latitude && $provider->longitude && $property && $property->latitude && $property->longitude) {
            $distKm = $provider->distanceTo((float) $property->latitude, (float) $property->longitude);
            $distance = round($distKm, 1).' km away';
        }

        $address = $property
            ? trim(($property->address_line ?? $property->address ?? '').', '.($property->city ?? ''))
            : 'Customer Location';

        $city = $property?->city ?? 'Colombo';

        $hasQuoted = false;
        if ($provider) {
            $hasQuoted = $this->quotations()
                ->where('bidder_type', get_class($provider))
                ->where('bidder_id', $provider->id)
                ->exists();
        }

        return [
            'id' => $this->id,
            'job_number' => 'JOB-'.str_pad((string) $this->id, 4, '0', STR_PAD_LEFT),
            'title' => $this->title ?? ($serviceCategory?->name ?? 'Service Request'),
            'serviceTitle' => $this->title ?? ($serviceCategory?->name ?? 'Service Request'),
            'service' => $this->title ?? ($serviceCategory?->name ?? 'Service Request'),
            'category' => $serviceCategory?->name ?? 'General',
            'category_id' => $this->service_category_id,
            'customer_id' => $this->customer_id,
            'customer' => $customerUser?->full_name ?? 'Customer',
            'customerName' => $customerUser?->full_name ?? 'Customer',
            'customerPhone' => $customerUser?->phone ?? '',
            'customer_phone' => $customerUser?->phone ?? '',
            'customerRating' => $customerRating,
            'customer_rating' => $customerRating,
            'customerReviewsCount' => $customerReviewsCount,
            'customer_reviews_count' => $customerReviewsCount,
            'address' => $address,
            'city' => $city,
            'latitude' => $property?->latitude ? (float) $property->latitude : null,
            'longitude' => $property?->longitude ? (float) $property->longitude : null,
            'distance' => $distance,
            'requestedTime' => $this->preferred_date ? $this->preferred_date->format('M d, Y • h:i A') : 'Flexible',
            'preferred_date' => $this->preferred_date?->toIso8601String(),
            'description' => $this->description,
            'estimatedBudget' => $this->budget ? (float) $this->budget : null,
            'estimated_budget' => $this->budget ? (float) $this->budget : null,
            'price' => $this->budget ? (float) $this->budget : null,
            'status' => $this->status,
            'has_quoted' => $hasQuoted,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
