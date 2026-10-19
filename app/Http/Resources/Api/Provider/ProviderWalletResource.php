<?php

namespace App\Http\Resources\Api\Provider;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderWalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'available_balance' => (float) ($this['available_balance'] ?? 0.0),
            'pending_clearance' => (float) ($this['pending_clearance'] ?? 0.0),
            'this_month_earnings' => (float) ($this['this_month_earnings'] ?? 0.0),
            'platform_fees_due' => (float) ($this['platform_fees_due'] ?? 0.0),
            'total_cash_collected' => (float) ($this['total_cash_collected'] ?? 0.0),
            'cash_jobs_count' => (int) ($this['cash_jobs_count'] ?? 0),
            'payout_accounts' => ProviderPayoutAccountResource::collection($this['payout_accounts'] ?? []),
            'transactions' => $this['transactions'] ?? [],
        ];
    }
}
