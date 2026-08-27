<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'provider_type' => $this->provider_type,
            'bio' => $this->bio,
            'approval_status' => $this->approval_status,
            'user' => new UserResource($this->whenLoaded('user')),
            'serviceCategories' => $this->whenLoaded('serviceCategories'),
            'company' => $this->whenLoaded('company'),
            'kycVerifications' => $this->whenLoaded('kycVerifications'),
            'created_at' => $this->created_at,
        ];
    }
}
