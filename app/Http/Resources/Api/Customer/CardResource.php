<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
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
            'card_type' => $this->card_type,
            'masked_card_number' => $this->masked_card_number,
            'expiry_date' => $this->expiry_date,
            'card_holder_name' => $this->card_holder_name,
            'billing_address' => $this->billing_address,
            'is_default' => (bool) $this->is_default,
            'is_frozen' => (bool) $this->is_frozen,
        ];
    }
}
