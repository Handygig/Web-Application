<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExclusiveOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'badge',
        'code',
        'discount_type',
        'discount_value',
        'discount_text',
        'min_spend',
        'max_discount_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'usage_count',
        'is_active',
        'gradient_start',
        'gradient_end',
        'accent_color',
        'icon_name',
        'terms',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'float',
            'min_spend' => 'float',
            'max_discount_amount' => 'float',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'is_active' => 'boolean',
            'usage_limit' => 'integer',
            'usage_count' => 'integer',
        ];
    }

    /**
     * Scope a query to only include active and currently valid offers.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                    ->orWhereColumn('usage_count', '<', 'usage_limit');
            });
    }
}
