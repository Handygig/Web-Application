<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('admin') || $this->user()->role === 'admin');
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'current_password' => $this->current_password ?? $this->currentPassword,
            'new_password' => $this->new_password ?? $this->newPassword,
            'new_password_confirmation' => $this->new_password_confirmation ?? $this->confirmPassword ?? $this->confirm_password,
        ]);
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', Password::defaults(), 'confirmed'],
        ];
    }
}
