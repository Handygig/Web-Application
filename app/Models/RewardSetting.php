<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class RewardSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description',
    ];

    /**
     * Retrieve a setting value by key with fallback default.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("reward_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set or update a setting value by key.
     */
    public static function set(string $key, mixed $value, ?string $description = null): static
    {
        Cache::forget("reward_setting_{$key}");

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => (string) $value,
                'description' => $description ?? $key,
            ]
        );
    }

    /**
     * Get all settings as an associative array.
     */
    public static function allSettings(): array
    {
        $defaults = [
            'points_per_dollar' => '10',
            'points_redemption_rate' => '100', // 100 points = $1.00 credit
            'referrer_bonus' => '20.00',       // $20 credit for inviter
            'referee_discount' => '20.00',     // $20 off for friend
            'welcome_bonus_points' => '250',
            'silver_points_threshold' => '500',
            'gold_points_threshold' => '1000',
            'platinum_points_threshold' => '2500',
        ];

        $stored = static::pluck('value', 'key')->toArray();

        return array_merge($defaults, $stored);
    }
}
