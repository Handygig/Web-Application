<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('admin') || $this->user()->role === 'admin');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('fullName') && ! $this->has('full_name')) {
            $this->merge(['full_name' => $this->fullName]);
        }
    }

    public function rules(): array
    {
        $user = $this->user();

        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:50',
        ];
    }
}
