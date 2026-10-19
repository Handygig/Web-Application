<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class StorePayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('payout_account_id') && $this->has('payoutAccountId')) {
            $this->merge(['payout_account_id' => $this->input('payoutAccountId')]);
        }
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:1',
            'payout_account_id' => 'nullable|exists:payout_accounts,id',
        ];
    }
}
