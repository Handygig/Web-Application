<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['job_request_id', 'provider_id', 'quoted_price', 'estimated_duration', 'message', 'status'])]
class Quotation extends Model
{
    protected function casts(): array
    {
        return [
            'quoted_price' => 'decimal:2',
        ];
    }

    public function jobRequest(): BelongsTo
    {
        return $this->belongsTo(JobRequest::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function assignment(): HasOne
    {
        return $this->hasOne(JobAssignment::class);
    }
}
