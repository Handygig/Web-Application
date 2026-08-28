<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        $propertyType = $this->route('propertyType');

        return [
            'name' => 'required|string|max:255|unique:property_types,name,'.$propertyType->id,
            'description' => 'nullable|string',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ];
    }
}
