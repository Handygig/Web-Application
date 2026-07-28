<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['job_request_id', 'quotation_id', 'provider_id', 'company_id', 'assigned_at', 'start_date', 'end_date', 'status'])]
class JobAssignment extends Model
{
    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }

    public function jobRequest(): BelongsTo
    {
        return $this->belongsTo(JobRequest::class);
    }

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class, 'assignment_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'assignment_id');
    }

    public function disputes(): HasMany
    {
        return $this->hasMany(Dispute::class, 'assignment_id');
    }
}
