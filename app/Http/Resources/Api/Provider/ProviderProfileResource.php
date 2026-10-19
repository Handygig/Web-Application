<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->user;
        $names = explode(' ', $user?->full_name ?? '', 2);
        $firstName = $names[0] ?? '';
        $lastName = $names[1] ?? '';

        $latestKyc = $this->kycVerifications()->latest()->first();

        $rating = $this->reviews()->exists()
            ? round((float) $this->reviews()->avg('rating'), 1)
            : 5.0;

        $reviewsCount = $this->reviews()->count();
        $completedJobsCount = $this->jobAssignments()->where('status', 'completed')->count();

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company_id' => $this->company_id,
            'company_name' => $this->company?->company_name,
            'provider_type' => $this->provider_type ?? 'individual',
            'first_name' => $firstName,
            'last_name' => $lastName,
            'full_name' => $user?->full_name,
            'email' => $user?->email,
            'phone' => $user?->phone,
            'phone_number' => $user?->phone,
            'firebase_uid' => $user?->firebase_uid,
            'profile_image' => $user?->profile_image ? asset('storage/'.$user->profile_image) : null,
            'profile_image_url' => $user?->profile_image ? asset('storage/'.$user->profile_image) : null,
            'bio' => $this->bio,
            'availability' => $this->availability ?? 'available',
            'is_online' => ($this->availability ?? 'available') === 'available',
            'approval_status' => $this->approval_status ?? 'pending',
            'reg_number' => $this->reg_number,
            'tax_id' => $this->tax_id,
            'address_line1' => $this->address_line1,
            'address_line2' => $this->address_line2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'service_radius' => $this->service_radius ? (float) $this->service_radius : 25.0,
            'services' => $this->serviceCategories->pluck('id')->map(fn ($id) => (string) $id)->values()->all(),
            'service_categories' => $this->serviceCategories->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
            ])->values()->all(),
            'kyc' => [
                'status' => $latestKyc?->status ?? 'PENDING',
                'documents' => $latestKyc?->documents ?? [],
                'rejection_reason' => $latestKyc?->rejection_reason,
                'verified_at' => $latestKyc?->verified_at?->toIso8601String(),
            ],
            'rating' => $rating,
            'reviews_count' => $reviewsCount,
            'completed_jobs_count' => $completedJobsCount,
            'is_profile_complete' => $user?->is_profile_complete ?? false,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
