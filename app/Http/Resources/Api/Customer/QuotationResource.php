<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotationResource extends JsonResource
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
            'quoted_price' => (float) $this->quoted_price,
            'estimated_duration' => $this->estimated_duration,
            'message' => $this->message,
            'status' => $this->status,
            'provider' => [
                'id' => $this->bidder_id ?? $this->provider_id,
                'name' => $this->bidder_name,
                'rating' => $this->bidder_rating,
                'profile_image' => $this->bidder_user?->profile_image
                    ? asset('storage/'.$this->bidder_user->profile_image)
                    : null,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
