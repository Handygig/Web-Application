<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : $this->user;
        $statusVal = $user->status ?? 'active';

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'provider_type' => $this->provider_type,
            'bio' => $this->bio ?? 'Registered service provider.',
            'approval_status' => $this->approval_status,
            'full_name' => $user->full_name ?? 'Provider User',
            'email' => $user->email ?? '',
            'phone' => $user->phone ?? '',
            'service' => $this->serviceCategories->first()?->service_name ?? 'General Service',
            'location' => $this->company->city ?? 'New York, NY',
            'status' => $statusVal === 'active' ? 'Active' : 'Inactive',
            'joined' => $this->created_at ? $this->created_at->format('M d, Y') : 'Jan 2025',
            'user' => new UserResource($this->whenLoaded('user')),
            'serviceCategories' => $this->whenLoaded('serviceCategories'),
            'company' => $this->whenLoaded('company'),
            'kycVerifications' => $this->whenLoaded('kycVerifications'),
            'created_at' => $this->created_at,
        ];
    }
}
