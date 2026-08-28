<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BanCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string',
            'ban_type' => 'nullable|string|in:TEMPORARY,PERMANENT',
        ];
    }
}
