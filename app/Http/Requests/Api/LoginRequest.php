<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required_without:firebase_token', 'nullable', 'email'],
            'password' => ['required_without:firebase_token', 'nullable', 'string'],
            'firebase_token' => ['required_without:password', 'nullable', 'string'],
            'device_name' => ['required', 'string'],
        ];
    }
}
