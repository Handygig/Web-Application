<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code ?? sprintf('JT-%03d', $this->id),
            'name' => $this->name,
            'description' => $this->description ?? '',
            'status' => $this->status ? ucfirst(strtolower($this->status)) : 'Active',
            'createdDate' => $this->created_at ? $this->created_at->format('M d, Y') : '',
            'created_at' => $this->created_at,
        ];
    }
}
