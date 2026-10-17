<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable(['job_request_id', 'provider_id', 'bidder_id', 'bidder_type', 'quoted_price', 'estimated_duration', 'message', 'status'])]
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

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function assignment(): HasOne
    {
        return $this->hasOne(JobAssignment::class);
    }

    public function getBidderUserAttribute(): ?User
    {
        if ($this->bidder instanceof Provider || $this->bidder instanceof Company) {
            return $this->bidder->user;
        }

        return $this->provider?->user;
    }

    public function getBidderNameAttribute(): string
    {
        if ($this->bidder instanceof Company) {
            return $this->bidder->company_name ?? 'Service Agency';
        }

        return $this->bidder_user?->full_name ?? 'Service Professional';
    }

    public function getBidderRatingAttribute(): ?float
    {
        $provider = $this->bidder instanceof Provider ? $this->bidder : $this->provider;

        if ($provider) {
            if ($provider->relationLoaded('reviews')) {
                return $provider->reviews->isNotEmpty() ? round((float) $provider->reviews->avg('rating'), 1) : null;
            }

            return $provider->reviews()->exists() ? round((float) $provider->reviews()->avg('rating'), 1) : null;
        }

        return null;
    }
}
