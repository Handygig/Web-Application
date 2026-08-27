<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        $provider = $this->route('provider');

        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$provider->user_id,
            'phone' => 'nullable|string|max:50',
            'service_category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ];
    }
}
