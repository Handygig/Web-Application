<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'verification_type',
        'status',
        'documents',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'rejection_reason',
        'verification_history',
    ];

    protected $casts = [
        'documents' => 'array',
        'verification_history' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
