<?php

namespace App\Http\Requests\Company;

use App\Rules\SriLankanPhone;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('company');
    }

    public function rules(): array
    {
        return [
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', new SriLankanPhone],
            'specialization' => ['required', 'string', 'max:255'],
            'hourlyRate' => ['nullable', 'numeric'],
            'status' => ['required', 'string', 'in:available,on_shift_job,on_break,off_duty,inactive'],
        ];
    }
}
