<?php

namespace App\Http\Resources\Api\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
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
            'name' => $this->service_name,
            'service_name' => $this->service_name,
            'description' => $this->description,
            'image' => $this->image,
            'image_url' => $this->image_url,
            'is_active' => (bool) $this->is_active,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
