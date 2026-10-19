<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderJobAssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $jobRequest = $this->jobRequest;
        $customer = $jobRequest?->customer;
        $customerUser = $customer?->user;
        $property = $jobRequest?->property;
        $serviceCategory = $jobRequest?->serviceCategory;
        $quotation = $this->quotation;
        $payment = $this->payment;
        $review = $this->reviews()->latest()->first();

        // Calculate approximate distance if provider coordinates exist
        $distance = 'Nearby';
        $provider = $request->user()?->provider ?? $this->provider;
        if ($provider && $provider->latitude && $provider->longitude && $property && $property->latitude && $property->longitude) {
            $distKm = $provider->distanceTo((float) $property->latitude, (float) $property->longitude);
            $distance = round($distKm, 1).' km away';
        }

        $address = $property
            ? trim(($property->address_line ?? $property->address ?? '').', '.($property->city ?? ''))
            : 'Customer Location';

        $city = $property?->city ?? 'Colombo';

        // Map status to app stage (ongoing, finished, etc.)
        $statusStr = $this->status;
        $appCategory = in_array($statusStr, ['completed', 'finished']) ? 'finished' : 'ongoing';

        $completionDateStr = null;
        if ($this->end_date) {
            $completionDateStr = $this->end_date->format('M d, Y • h:i A');
        }

        $requestedTimeStr = 'Flexible';
        if ($this->start_date) {
            $requestedTimeStr = 'Started on '.$this->start_date->format('M d • h:i A');
        } elseif ($jobRequest?->preferred_date) {
            $requestedTimeStr = $jobRequest->preferred_date->format('M d, Y • h:i A');
        }

        $baseAmount = (float) ($quotation?->quoted_price ?? $jobRequest?->budget ?? 0.0);
        $extraAmount = $this->extra_amount ? (float) $this->extra_amount : 0.0;
        $isExtraApproved = $this->extra_status === 'approved';
        $totalEffective = $baseAmount + ($isExtraApproved ? $extraAmount : 0.0);

        return [
            'id' => $this->id,
            'job_assignment_id' => $this->id,
            'job_request_id' => $this->job_request_id,
            'job_number' => 'JOB-'.str_pad((string) ($this->job_request_id ?? $this->id), 4, '0', STR_PAD_LEFT),
            'provider_id' => $this->provider_id,
            'company_id' => $this->company_id,
            'serviceTitle' => $jobRequest?->title ?? ($serviceCategory?->name ?? 'Service Assignment'),
            'category' => $serviceCategory?->name ?? 'General',
            'customerName' => $customerUser?->full_name ?? 'Customer',
            'customerPhone' => $customerUser?->phone ?? '+94 77 000 0000',
            'customerRating' => 5.0,
            'customerReviewsCount' => 24,
            'address' => $address,
            'city' => $city,
            'latitude' => $property?->latitude ? (float) $property->latitude : null,
            'longitude' => $property?->longitude ? (float) $property->longitude : null,
            'distance' => $distance,
            'requestedTime' => $requestedTimeStr,
            'description' => $jobRequest?->description ?? '',
            'estimatedBudget' => $jobRequest?->budget ? (float) $jobRequest->budget : null,
            'quotedAmount' => $baseAmount > 0 ? $baseAmount : null,
            'quoted_amount' => $baseAmount > 0 ? $baseAmount : null,
            'quoteNotes' => $quotation?->message,
            'status' => $this->status,
            'app_category' => $appCategory,
            'assigned_at' => $this->assigned_at?->toIso8601String(),
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'completionDate' => $completionDateStr,
            'extraAmount' => $extraAmount > 0 ? $extraAmount : null,
            'extra_amount' => $extraAmount > 0 ? $extraAmount : null,
            'extraReason' => $this->extra_reason,
            'extra_reason' => $this->extra_reason,
            'extraStatus' => $this->extra_status ?? 'none',
            'extra_status' => $this->extra_status ?? 'none',
            'total_effective_price' => $totalEffective,
            'finalRating' => $review ? (float) $review->rating : null,
            'clientFeedback' => $review?->comment,
            'payment' => $payment ? [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'platform_fee' => (float) $payment->platform_fee,
                'provider_amount' => (float) $payment->provider_amount,
                'payment_method' => $payment->payment_method,
                'payment_status' => $payment->payment_status,
                'payment_date' => $payment->payment_date?->toIso8601String(),
            ] : null,
            'assigned_provider' => $this->provider ? [
                'id' => $this->provider->id,
                'name' => $this->provider->user?->full_name,
                'phone' => $this->provider->user?->phone,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
