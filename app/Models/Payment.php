<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['assignment_id', 'customer_id', 'card_id', 'amount', 'platform_fee', 'provider_amount', 'payment_method', 'payment_status', 'payment_date'])]
class Payment extends Model
{
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'platform_fee' => 'decimal:2',
            'provider_amount' => 'decimal:2',
            'payment_date' => 'datetime',
        ];
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(JobAssignment::class, 'assignment_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(CustomerCard::class, 'card_id');
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
