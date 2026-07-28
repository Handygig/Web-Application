<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['payment_id', 'provider_id', 'company_id', 'payout_account_id', 'amount', 'status', 'payout_date', 'transaction_ref'])]
class Payout extends Model
{
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payout_date' => 'datetime',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function payoutAccount(): BelongsTo
    {
        return $this->belongsTo(PayoutAccount::class);
    }
}
