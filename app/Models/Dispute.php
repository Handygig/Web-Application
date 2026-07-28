<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['assignment_id', 'customer_id', 'provider_id', 'resolved_by_admin_id', 'reason', 'status', 'resolution_notes', 'resolved_at'])]
class Dispute extends Model
{
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
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

    public function resolvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'resolved_by_admin_id');
    }
}
