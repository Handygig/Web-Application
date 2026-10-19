<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderPayoutAccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $last4 = substr($this->account_number ?? '', -4);

        return [
            'id' => $this->id,
            'bank_name' => $this->bank_name,
            'branch_name' => $this->branch_name,
            'account_holder_name' => $this->account_holder_name,
            'account_number' => $this->account_number,
            'account_number_masked' => $last4 ? '•••• '.$last4 : null,
            'display_title' => $this->bank_name.($last4 ? ' •••• '.$last4 : ''),
            'routing_number' => $this->routing_number,
            'swift_code' => $this->swift_code,
            'is_default' => (bool) $this->is_default,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
