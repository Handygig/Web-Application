<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['company_id', 'role', 'full_name', 'email', 'phone', 'password', 'firebase_uid', 'status', 'profile_image'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->full_name,
            set: fn ($value) => ['full_name' => $value],
        );
    }

    /**
     * Determine whether the user has completed their profile.
     * A profile is complete when full_name and email are present.
     */
    protected function isProfileComplete(): Attribute
    {
        return Attribute::make(
            get: fn () => ! empty($this->full_name) && ! empty($this->email) && ! str_ends_with($this->email, '@placeholder.com'),
        );
    }

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }

    public function admin(): HasOne
    {
        return $this->hasOne(Admin::class);
    }

    /**
     * The company this user owns (if applicable)
     */
    public function company(): HasOne
    {
        return $this->hasOne(Company::class);
    }

    /**
     * The company this user belongs to as staff (if applicable)
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function provider(): HasOne
    {
        return $this->hasOne(Provider::class);
    }

    public function customNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'recipient_user_id');
    }
}
