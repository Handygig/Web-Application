<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        $customer = $this->route('customer');

        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$customer->user_id,
            'phone' => 'nullable|string|max:50',
            'status' => 'required|string|in:active,inactive,banned',
        ];
    }
}
