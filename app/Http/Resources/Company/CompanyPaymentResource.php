<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount ?? 0,
            'platformFee' => $this->platform_fee ?? 0,
            'providerAmount' => $this->provider_amount ?? 0,
            'paymentMethod' => $this->payment_method ?? 'card',
            'status' => $this->payment_status ?? 'completed',
            'createdAt' => $this->created_at ? $this->created_at->format('M d, Y') : '',
        ];
    }
}
