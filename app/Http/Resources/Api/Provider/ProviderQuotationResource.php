<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderQuotationResource extends JsonResource
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
            'job_request_id' => $this->job_request_id,
            'bidder_type' => $this->bidder_type,
            'bidder_id' => $this->bidder_id,
            'bidder_name' => $this->bidder_name,
            'quoted_price' => (float) $this->quoted_price,
            'quotedAmount' => (float) $this->quoted_price,
            'estimated_duration' => $this->estimated_duration,
            'message' => $this->message,
            'quoteNotes' => $this->message,
            'status' => $this->status,
            'job_request' => $this->whenLoaded('jobRequest', fn () => new ProviderJobRequestResource($this->jobRequest)),
            'assignment' => $this->whenLoaded('assignment', fn () => [
                'id' => $this->assignment?->id,
                'status' => $this->assignment?->status,
                'assigned_at' => $this->assignment?->assigned_at?->toIso8601String(),
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
