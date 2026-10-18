<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'service_name' => 'required|string|max:255|unique:service_categories,service_name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'is_active' => 'nullable|boolean',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('status')) {
            $statusVal = $this->input('status');
            $this->merge([
                'is_active' => strtoupper((string) $statusVal) === 'ACTIVE' || $statusVal === true || $statusVal === 1 || $statusVal === '1',
            ]);
        }
    }
}
