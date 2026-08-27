<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KycVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'provider_id' => $this->provider_id,
            'verification_type' => $this->verification_type,
            'status' => $this->status,
            'document_front' => $this->document_front,
            'document_back' => $this->document_back,
            'selfie_image' => $this->selfie_image,
            'business_license' => $this->business_license,
            'tax_document' => $this->tax_document,
            'reviewed_by' => $this->reviewed_by,
            'reviewed_at' => $this->reviewed_at,
            'rejection_reason' => $this->rejection_reason,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'created_at' => $this->created_at,
        ];
    }
}
