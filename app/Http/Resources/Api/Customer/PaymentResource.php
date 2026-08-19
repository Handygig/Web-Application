<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'amount' => (float) $this->amount,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'payment_date' => $this->payment_date?->toIso8601String(),
            'card' => new CardResource($this->whenLoaded('card')),
        ];
    }
}
