<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderPayoutResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $account = $this->payoutAccount;
        $bankTitle = $account ? $account->bank_name.' •••• '.substr($account->account_number ?? '', -4) : 'Bank Transfer';

        return [
            'id' => $this->id,
            'reference_id' => $this->transaction_ref ?? ('TXN-'.(8800 + $this->id)),
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'payout_date' => $this->payout_date?->toIso8601String(),
            'transaction_ref' => $this->transaction_ref,
            'bank' => $bankTitle,
            'payout_account' => $account ? new ProviderPayoutAccountResource($account) : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
