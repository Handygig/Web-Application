<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobRequestResource extends JsonResource
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
            'description' => $this->description,
            'preferred_date' => $this->preferred_date?->toIso8601String(),
            'status' => $this->status,
            'payment_method' => $this->payment_method ?? 'card',
            'card_id' => $this->card_id,
            'card' => $this->card ? new CardResource($this->card) : null,
            'property' => new PropertyResource($this->whenLoaded('property')),
            'service_category' => new ServiceCategoryResource($this->whenLoaded('serviceCategory')),
            'quotations' => QuotationResource::collection($this->whenLoaded('quotations')),
            'assignment' => new JobAssignmentResource($this->whenLoaded('assignment')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
