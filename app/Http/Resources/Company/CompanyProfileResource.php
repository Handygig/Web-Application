<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'fullName' => $this->user->full_name ?? '',
            'email' => $this->user->email ?? '',
            'phone' => $this->user->phone ?? '',
            'companyName' => $this->company_name ?? '',
            'registrationNo' => $this->registration_no ?? '',
            'address' => $this->address ?? '',
            'approvalStatus' => $this->approval_status ?? 'approved',
        ];
    }
}
