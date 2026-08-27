<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $custUser = $this->customer->user ?? null;

        $acceptedQuotation = $this->relationLoaded('quotations')
            ? $this->quotations->where('status', 'accepted')->first()
            : null;
        $provider = $acceptedQuotation->provider ?? ($this->relationLoaded('quotations') && $this->quotations->first() ? $this->quotations->first()->provider : null);
        $provUser = $provider->user ?? null;

        return [
            'id' => 'BK-'.(100000 + $this->id),
            'realId' => $this->id,
            'propertyName' => $this->title ?? ($this->serviceCategory->service_name ?? 'Job Request'),
            'category' => $this->serviceCategory->service_name ?? 'Services',
            'location' => $this->location ?? 'Colombo, Sri Lanka',
            'customerName' => $custUser->full_name ?? 'Customer User',
            'customerEmail' => $custUser->email ?? '',
            'customerPhone' => $custUser->phone ?? '',
            'customerId' => 'CUST-'.(1000 + ($this->customer_id ?? 0)),
            'providerName' => $provUser->full_name ?? 'Not Assigned',
            'providerBusiness' => $provider->company->business_name ?? ($provUser->full_name ?? 'Not Assigned'),
            'providerEmail' => $provUser->email ?? '',
            'providerPhone' => $provUser->phone ?? '',
            'providerId' => $provider ? 'PRV-'.(1000 + $provider->id) : '',
            'bookingDate' => $this->preferred_date ? Carbon::parse($this->preferred_date)->format('M d, Y') : '',
            'timeSlot' => 'Flexible',
            'amount' => 'Flexible',
            'rawAmount' => 0,
            'status' => $this->status ? ucfirst(strtolower($this->status)) : 'Pending',
            'createdDate' => $this->created_at ? $this->created_at->toDateTimeString() : '',
            'history' => $this->history ?? [],
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'property' => $this->whenLoaded('property'),
            'serviceCategory' => $this->whenLoaded('serviceCategory'),
            'quotations' => $this->whenLoaded('quotations'),
            'created_at' => $this->created_at,
        ];
    }
}
