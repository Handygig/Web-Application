<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable(['user_id', 'company_name', 'registration_no', 'address', 'approval_status'])]
class Company extends Model
{
    /**
     * The owner of the company
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The staff members of the company
     */
    public function staff(): HasMany
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function providers(): HasMany
    {
        return $this->hasMany(Provider::class);
    }

    public function serviceAreas(): HasMany
    {
        return $this->hasMany(CompanyServiceArea::class);
    }

    public function quotations(): MorphMany
    {
        return $this->morphMany(Quotation::class, 'bidder');
    }

    public function jobAssignments(): HasMany
    {
        return $this->hasMany(JobAssignment::class);
    }

    public function payoutAccounts(): HasMany
    {
        return $this->hasMany(PayoutAccount::class);
    }

    public function serviceCategories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(ServiceCategory::class, 'company_services');
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    public function defaultPayoutAccount(): ?PayoutAccount
    {
        return $this->payoutAccounts()->where('is_default', true)->first()
            ?? $this->payoutAccounts()->first();
    }
}
