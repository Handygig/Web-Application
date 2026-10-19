<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class CompleteProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('providerType') && $this->has('provider_type')) {
            $mergeData['providerType'] = $this->input('provider_type');
        }
        if (! $this->has('firstName') && $this->has('first_name')) {
            $mergeData['firstName'] = $this->input('first_name');
        }
        if (! $this->has('lastName') && $this->has('last_name')) {
            $mergeData['lastName'] = $this->input('last_name');
        }
        if (! $this->has('regNumber') && $this->has('reg_number')) {
            $mergeData['regNumber'] = $this->input('reg_number');
        }
        if (! $this->has('taxId') && $this->has('tax_id')) {
            $mergeData['taxId'] = $this->input('tax_id');
        }
        if (! $this->has('addressLine1') && $this->has('address_line1')) {
            $mergeData['addressLine1'] = $this->input('address_line1');
        }
        if (! $this->has('addressLine2') && $this->has('address_line2')) {
            $mergeData['addressLine2'] = $this->input('address_line2');
        }
        if (! $this->has('postalCode') && $this->has('postal_code')) {
            $mergeData['postalCode'] = $this->input('postal_code');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }

        if (! $this->hasFile('nicFront') && $this->hasFile('nic_front')) {
            $this->files->set('nicFront', $this->file('nic_front'));
        }
        if (! $this->hasFile('nicBack') && $this->hasFile('nic_back')) {
            $this->files->set('nicBack', $this->file('nic_back'));
        }
        if (! $this->hasFile('brCertificate') && $this->hasFile('br_certificate')) {
            $this->files->set('brCertificate', $this->file('br_certificate'));
        }
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
