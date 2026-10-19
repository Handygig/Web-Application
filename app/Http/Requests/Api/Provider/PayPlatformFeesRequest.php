<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class PayPlatformFeesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.5',
            'payment_method' => 'nullable|string|max:50',
            'transaction_ref' => 'nullable|string|max:100',
        ];
    }
}
