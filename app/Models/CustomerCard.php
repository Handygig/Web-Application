<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['customer_id', 'card_type', 'masked_card_number', 'expiry_date', 'card_holder_name', 'billing_address', 'is_default', 'is_frozen'])]
class CustomerCard extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'is_frozen' => 'boolean',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'card_id');
    }
}
