<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasServiceArea
{
    /**
     * Scope a query to only include models whose service area covers the given coordinates.
     * Uses the Haversine formula to calculate the great-circle distance.
     * Earth radius in kilometers is approx 6371.
     *
     * @param  float  $latitude  The target latitude (e.g. job property)
     * @param  float  $longitude  The target longitude (e.g. job property)
     */
    public function scopeCoversLocation(Builder $query, float $latitude, float $longitude): Builder
    {
        $haversine = '(6371 * acos(cos(radians(?))
                        * cos(radians(latitude))
                        * cos(radians(longitude) - radians(?))
                        + sin(radians(?))
                        * sin(radians(latitude))))';

        return $query->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereRaw("{$haversine} <= service_radius", [$latitude, $longitude, $latitude]);
    }
}
