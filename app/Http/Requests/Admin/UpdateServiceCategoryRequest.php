<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        $category = $this->route('serviceCategory');
        $id = $category instanceof \App\Models\ServiceCategory ? $category->id : $category;

        return [
            'service_name' => 'required|string|max:255|unique:service_categories,service_name,'.($id ?? 'NULL'),
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
