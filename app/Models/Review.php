<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['assignment_id', 'customer_id', 'provider_id', 'rating', 'comment'])]
class Review extends Model
{
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
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

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
