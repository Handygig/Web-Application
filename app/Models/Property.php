<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['customer_id', 'label', 'address_line', 'city', 'latitude', 'longitude', 'is_default'])]
class Property extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function jobRequests(): HasMany
    {
        return $this->hasMany(JobRequest::class);
    }
}
