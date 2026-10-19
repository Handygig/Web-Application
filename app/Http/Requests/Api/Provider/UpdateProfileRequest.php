<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('first_name') && $this->has('firstName')) {
            $mergeData['first_name'] = $this->input('firstName');
        }
        if (! $this->has('last_name') && $this->has('lastName')) {
            $mergeData['last_name'] = $this->input('lastName');
        }
        if (! $this->has('address_line1') && $this->has('addressLine1')) {
            $mergeData['address_line1'] = $this->input('addressLine1');
        }
        if (! $this->has('address_line2') && $this->has('addressLine2')) {
            $mergeData['address_line2'] = $this->input('addressLine2');
        }
        if (! $this->has('postal_code') && $this->has('postalCode')) {
            $mergeData['postal_code'] = $this->input('postalCode');
        }
        if (! $this->has('service_radius') && $this->has('serviceRadius')) {
            $mergeData['service_radius'] = $this->input('serviceRadius');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,'.$this->user()->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
            'availability' => 'nullable|string|in:available,unavailable',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'service_radius' => 'nullable|numeric|min:1|max:500',
            'profile_image' => 'nullable|file|image|max:5120',
            'services' => 'nullable|array',
            'services.*' => 'exists:service_categories,id',
        ];
    }
}
