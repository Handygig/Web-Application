<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'property_id' => $this->property_id,
            'service_category_id' => $this->service_category_id,
            'title' => $this->title,
            'description' => $this->description,
            'preferred_date' => $this->preferred_date,
            'status' => $this->status,
            'history' => $this->history,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'property' => $this->whenLoaded('property'),
            'serviceCategory' => $this->whenLoaded('serviceCategory'),
            'quotations' => $this->whenLoaded('quotations'),
            'created_at' => $this->created_at,
        ];
    }
}
