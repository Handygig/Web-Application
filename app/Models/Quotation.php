<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable(['job_request_id', 'bidder_id', 'bidder_type', 'quoted_price', 'estimated_duration', 'message', 'status'])]
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

    public function bidder(): MorphTo
    {
        return $this->morphTo();
    }

    public function assignment(): HasOne
    {
        return $this->hasOne(JobAssignment::class);
    }
}
