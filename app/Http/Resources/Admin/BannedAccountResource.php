<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannedAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'account_type' => $this->account_type,
            'ban_type' => $this->ban_type,
            'reason' => $this->reason,
            'banned_by' => $this->banned_by,
            'banned_at' => $this->banned_at,
            'unbanned_by' => $this->unbanned_by,
            'unbanned_at' => $this->unbanned_at,
            'status' => $this->status,
            'user' => new UserResource($this->whenLoaded('user')),
            'banner' => new UserResource($this->whenLoaded('banner')),
            'unbanner' => new UserResource($this->whenLoaded('unbanner')),
            'created_at' => $this->created_at,
        ];
    }
}
