<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderSearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->user;
        $rating = $this->reviews()->exists()
            ? round((float) $this->reviews()->avg('rating'), 1)
            : 5.0;
        $reviewsCount = $this->reviews()->count();

        // Primary service category name
        $primaryCategory = $this->serviceCategories->first()?->name ?? 'General Handyman';
        $categoriesList = $this->serviceCategories->map(fn ($cat) => $cat->name)->values()->all();

        // Calculate distance if target coordinates were provided
        $distanceKm = null;
        if (isset($this->distance_km)) {
            $distanceKm = round((float) $this->distance_km, 1);
        } elseif ($request->filled('latitude') && $request->filled('longitude') && $this->latitude && $this->longitude) {
            $distanceKm = round($this->distanceTo((float) $request->input('latitude'), (float) $request->input('longitude')), 1);
        }

        $distanceDisplay = $distanceKm !== null ? "{$distanceKm} km away" : 'Nearby';

        // Hourly rate / price display
        $rate = 45;
        if (isset($this->hourly_rate) && $this->hourly_rate > 0) {
            $rate = (float) $this->hourly_rate;
        }

        $address = $this->address_line1 ?? $this->city ?? 'Service Area';
        $locationArea = $this->city ?? ($this->address_line1 ? explode(',', $this->address_line1)[0] : 'Local Area');

        return [
            'id' => (string) $this->id,
            'user_id' => $this->user_id,
            'name' => $this->provider_type === 'company' && $this->company
                ? $this->company->company_name
                : ($user?->full_name ?? 'Service Provider'),
            'provider_type' => $this->provider_type ?? 'individual',
            'service_type' => $primaryCategory,
            'services' => $categoriesList,
            'rating' => (string) $rating,
            'rating_num' => (float) $rating,
            'reviews_count' => $reviewsCount,
            'price' => '$' . (int)$rate . '/hr',
            'hourly_rate' => (float) $rate,
            'distance' => $distanceDisplay,
            'distance_km' => $distanceKm,
            'address' => $address,
            'location_area' => $locationArea,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'is_available' => ($this->availability ?? 'available') === 'available',
            'profile_image' => $user?->profile_image ? asset('storage/' . $user->profile_image) : null,
            'bio' => $this->bio ?? '',
            'phone' => $user?->phone,
        ];
    }
}
