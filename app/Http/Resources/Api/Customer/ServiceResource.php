<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->name,
            'name' => $this->name,
            'category_id' => $this->service_category_id,
            'category' => $this->category?->service_name ?? '',
            'description' => $this->description,
            'image_url' => $this->image_url,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
