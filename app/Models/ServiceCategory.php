<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['service_name', 'description', 'is_active'])]
class ServiceCategory extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function providers(): BelongsToMany
    {
        return $this->belongsToMany(Provider::class, 'provider_services');
    }

    public function jobRequests(): HasMany
    {
        return $this->hasMany(JobRequest::class);
    }
}
