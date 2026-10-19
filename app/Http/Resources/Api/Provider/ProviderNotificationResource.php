<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderNotificationResource extends JsonResource
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
            'title' => $this->title,
            'body' => $this->message,
            'message' => $this->message,
            'type' => $this->type,
            'category' => match ($this->type) {
                'job_request', 'job' => 'Job Inquiries',
                'quotation' => 'Quotations',
                'wallet', 'payout', 'payment' => 'Finance & Wallet',
                'review' => 'Ratings & Reviews',
                default => 'Security & Compliance',
            },
            'is_read' => (bool) $this->is_read,
            'isUnread' => ! $this->is_read,
            'related_id' => $this->related_id,
            'related_type' => $this->related_type,
            'time' => $this->created_at?->diffForHumans(),
            'fullTime' => $this->created_at?->format('M d, Y • h:i A'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
