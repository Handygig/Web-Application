<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RewardTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'type',
        'points',
        'amount',
        'description',
        'reference_id',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'amount' => 'float',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
