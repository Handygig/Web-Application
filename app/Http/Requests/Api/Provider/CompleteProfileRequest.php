<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class CompleteProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'providerType' => 'required|string|in:individual,company',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $this->user()->id,
            'regNumber' => 'nullable|string|max:255',
            'taxId' => 'nullable|string|max:255',
            'addressLine1' => 'required|string|max:255',
            'addressLine2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postalCode' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'nicFront' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'nicBack' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'brCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'services' => 'nullable|array',
            'services.*' => 'exists:service_categories,id',
        ];
    }
}
