<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannedAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'account_type',
        'ban_type',
        'reason',
        'notes',
        'banned_by',
        'banned_at',
        'expires_at',
        'status',
        'unbanned_by',
        'unbanned_at',
        'moderation_history',
    ];

    protected $casts = [
        'moderation_history' => 'array',
        'banned_at' => 'datetime',
        'expires_at' => 'datetime',
        'unbanned_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function banner()
    {
        return $this->belongsTo(User::class, 'banned_by');
    }

    public function unbanner()
    {
        return $this->belongsTo(User::class, 'unbanned_by');
    }
}
