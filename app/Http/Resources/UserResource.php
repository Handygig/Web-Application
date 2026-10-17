<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
            'profile_image' => $this->profile_image ? asset('storage/'.$this->profile_image) : null,
            'is_profile_complete' => $this->is_profile_complete,
            'gender' => $this->customer?->gender,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
