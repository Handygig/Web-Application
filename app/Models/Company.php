<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'company_name', 'registration_no', 'address', 'approval_status'])]
class Company extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function providers(): HasMany
    {
        return $this->hasMany(Provider::class);
    }

    public function jobAssignments(): HasMany
    {
        return $this->hasMany(JobAssignment::class);
    }

    public function payoutAccounts(): HasMany
    {
        return $this->hasMany(PayoutAccount::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
