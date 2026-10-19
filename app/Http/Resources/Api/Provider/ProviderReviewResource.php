<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $customer = $this->customer;
        $customerUser = $customer?->user;
        $assignment = $this->assignment;
        $service = $assignment?->jobRequest?->serviceCategory?->name ?? 'Service';

        return [
            'id' => $this->id,
            'assignment_id' => $this->assignment_id,
            'customer_name' => $customerUser?->full_name ?? 'Customer',
            'customer_image' => $customerUser?->profile_image ? asset('storage/'.$customerUser->profile_image) : null,
            'service' => $service,
            'rating' => (int) $this->rating,
            'rating_formatted' => number_format($this->rating, 1).' ★',
            'comment' => $this->comment,
            'created_at' => $this->created_at?->toIso8601String(),
            'formatted_date' => $this->created_at?->format('M d, Y'),
        ];
    }
}
