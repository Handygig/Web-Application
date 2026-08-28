<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:property_types,name',
            'description' => 'nullable|string',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ];
    }
}
