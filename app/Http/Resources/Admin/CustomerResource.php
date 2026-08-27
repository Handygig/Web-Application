<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'properties' => $this->whenLoaded('properties'),
            'jobRequests' => $this->whenLoaded('jobRequests'),
            'created_at' => $this->created_at,
        ];
    }
}
