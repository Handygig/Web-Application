<?php

namespace App\Http\Resources\Company;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyBookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $custUser = $this->customer->user ?? null;

        return [
            'id' => 'BK-'.(100000 + $this->id),
            'realId' => $this->id,
            'title' => $this->title ?? 'Job Request',
            'category' => $this->serviceCategory->service_name ?? 'Services',
            'customerName' => $custUser->full_name ?? 'Customer User',
            'customerEmail' => $custUser->email ?? '',
            'customerPhone' => $custUser->phone ?? '',
            'status' => $this->status ? ucfirst(strtolower($this->status)) : 'Pending',
            'budget' => $this->budget ?? 0,
            'preferredDate' => $this->preferred_date ? Carbon::parse($this->preferred_date)->format('M d, Y') : '',
            'created_at' => $this->created_at,
        ];
    }
}
