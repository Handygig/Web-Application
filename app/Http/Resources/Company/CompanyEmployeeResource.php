<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyEmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->user ?? null;

        return [
            'id' => $this->id,
            'name' => $user->full_name ?? 'Technician',
            'email' => $user->email ?? '',
            'phone' => $user->phone ?? '',
            'status' => $user->status ?? 'active',
            'approvalStatus' => $this->approval_status ?? 'approved',
            'providerType' => $this->provider_type ?? 'employee',
        ];
    }
}
