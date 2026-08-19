<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobAssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'assigned_at' => $this->assigned_at?->toIso8601String(),
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'provider' => [
                'id' => $this->provider_id,
                'name' => $this->provider?->user?->full_name,
                'phone' => $this->provider?->user?->phone,
                'profile_image' => $this->provider?->user?->profile_image ? asset('storage/'.$this->provider->user->profile_image) : null,
            ],
            'company' => $this->company_id ? [
                'id' => $this->company_id,
                'name' => $this->company?->user?->full_name,
            ] : null,
            'job_request' => new JobRequestResource($this->whenLoaded('jobRequest')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
