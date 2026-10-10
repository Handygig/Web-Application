<?php

namespace App\Http\Requests\Company;

use App\Rules\SriLankanPhone;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('company');
    }

    public function rules(): array
    {
        return [
            'companyName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', new SriLankanPhone],
            'website' => ['nullable', 'url'],
            'category' => ['required', 'string', 'max:255'],
        ];
    }
}
