<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : $this->user;
        $statusVal = $user->status ?? 'active';

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'customerId' => 'CUST-'.(1000 + $this->id),
            'full_name' => $user->full_name ?? $this->full_name ?? 'Customer User',
            'email' => $user->email ?? $this->email ?? '',
            'phone' => $user->phone ?? $this->phone ?? '',
            'status' => ucfirst(strtolower($statusVal)),
            'customerType' => 'Individual',
            'joined' => $this->created_at ? Carbon::parse($this->created_at)->format('M d, Y') : 'Jan 2025',
            'lastActive' => 'Recent',
            'ordersCount' => 12,
            'totalSpent' => '1,100.00',
            'completedOrders' => 11,
            'user_data' => new UserResource($this->whenLoaded('user')),
            'properties' => $this->whenLoaded('properties'),
            'jobRequests' => $this->whenLoaded('jobRequests'),
            'created_at' => $this->created_at,
        ];
    }
}
