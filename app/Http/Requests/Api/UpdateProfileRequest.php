<?php

namespace App\Http\Requests\Api;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->missing('full_name') && $this->filled('name')) {
            $this->merge(['full_name' => $this->input('name')]);
        }

        if ($this->missing('phone') && $this->filled('phone_number')) {
            $this->merge(['phone' => $this->input('phone_number')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:25'],
            'gender' => ['sometimes', 'nullable', 'string', Rule::in(['male', 'female', 'other'])],
            'profile_image' => ['sometimes', 'nullable', 'image', 'max:5120'],
        ];
    }
}
