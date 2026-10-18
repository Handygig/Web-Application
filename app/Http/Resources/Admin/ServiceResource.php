<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => sprintf('SRV-%03d', $this->id),
            'name' => $this->name,
            'service_category_id' => $this->service_category_id,
            'category_name' => $this->category?->service_name ?? 'Unassigned',
            'description' => $this->description ?? '',
            'base_price' => $this->base_price !== null ? (float) $this->base_price : null,
            'formatted_price' => $this->base_price !== null ? 'From $'.number_format((float) $this->base_price, 2) : 'Flexible',
            'image' => $this->image,
            'image_url' => $this->image_url,
            'is_active' => (bool) $this->is_active,
            'status' => $this->is_active ? 'Active' : 'Inactive',
            'createdDate' => $this->created_at ? $this->created_at->format('M d, Y') : '',
            'created_at' => $this->created_at,
        ];
    }
}
