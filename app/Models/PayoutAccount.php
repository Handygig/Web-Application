<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['provider_id', 'company_id', 'bank_name', 'branch_name', 'account_holder_name', 'account_number', 'routing_number', 'swift_code', 'is_default'])]
class PayoutAccount extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
