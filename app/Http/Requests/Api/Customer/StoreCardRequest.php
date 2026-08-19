<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'card_type' => ['required', 'string', 'max:255'],
            'masked_card_number' => ['required', 'string', 'max:255'],
            'expiry_date' => ['required', 'string', 'regex:/^(0[1-9]|1[0-2])\/?([0-9]{2})$/'], // MM/YY
            'card_holder_name' => ['required', 'string', 'max:255'],
            'billing_address' => ['nullable', 'string'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }
}
