<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code ?? sprintf('PT-%03d', $this->id),
            'name' => $this->name,
            'description' => $this->description ?? '',
            'icon' => $this->icon ?? 'Apartment',
            'properties_count' => $this->properties_count ?? 0,
            'status' => $this->status ? ucfirst(strtolower($this->status)) : 'Active',
            'created_at' => $this->created_at ? $this->created_at->format('M d, Y') : '',
            'updated_at' => $this->updated_at ? $this->updated_at->format('M d, Y') : '',
        ];
    }
}
