<?php

namespace App\Http\Requests\Api;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
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
        $hasFirebaseToken = $this->has('firebase_token');

        return [
            'firebase_token' => ['nullable', 'string'],
            'full_name' => [$hasFirebaseToken ? 'nullable' : 'required', 'string', 'max:255'],
            'email' => [$hasFirebaseToken ? 'nullable' : 'required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => [$hasFirebaseToken ? 'nullable' : 'required', 'string', 'max:255'],
            'password' => [$hasFirebaseToken ? 'nullable' : 'required', 'confirmed', Rules\Password::defaults()],
            'device_name' => ['required', 'string'],
        ];
    }
}
