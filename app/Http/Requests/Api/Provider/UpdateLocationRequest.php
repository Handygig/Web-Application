<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('service_radius') && $this->has('serviceRadius')) {
            $this->merge(['service_radius' => $this->input('serviceRadius')]);
        }
    }

    public function rules(): array
    {
        return [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'service_radius' => 'nullable|numeric|min:1|max:500',
        ];
    }
}
