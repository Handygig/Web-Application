<?php

namespace App\Http\Requests\Company;

use App\Rules\SriLankanPhone;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('company');
    }

    public function rules(): array
    {
        return [
            'serviceTitle' => ['required', 'string', 'max:255'],
            'customerName' => ['required', 'string', 'max:255'],
            'customerPhone' => ['required', 'string', new SriLankanPhone],
            'customerEmail' => ['required', 'string', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'scheduledDate' => ['required', 'date'],
            'scheduledTime' => ['required', 'string'],
        ];
    }
}
