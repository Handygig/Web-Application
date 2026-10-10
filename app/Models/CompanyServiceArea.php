<?php

namespace App\Models;

use App\Traits\HasServiceArea;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['company_id', 'service_category_id', 'name', 'latitude', 'longitude', 'service_radius'])]
class CompanyServiceArea extends Model
{
    use HasServiceArea;

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class);
    }
}
