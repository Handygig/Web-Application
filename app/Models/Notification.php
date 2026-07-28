<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['recipient_user_id', 'title', 'message', 'type', 'is_read', 'related_id', 'related_type'])]
class Notification extends Model
{
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }
}
