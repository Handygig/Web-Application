<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'description',
        'image',
        'icon',
        'is_active',
    ];

    protected $appends = [
        'name',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getNameAttribute(): string
    {
        return $this->service_name ?? '';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/'.$this->image) : null;
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function providers(): BelongsToMany
    {
        return $this->belongsToMany(Provider::class, 'provider_services');
    }

    public function jobRequests(): HasMany
    {
        return $this->hasMany(JobRequest::class);
    }

    public function companyServiceAreas(): HasMany
    {
        return $this->hasMany(CompanyServiceArea::class);
    }
}
