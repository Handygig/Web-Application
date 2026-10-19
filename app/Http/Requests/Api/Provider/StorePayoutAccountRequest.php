<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class StorePayoutAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('bank_name') && $this->has('bankName')) {
            $mergeData['bank_name'] = $this->input('bankName');
        }
        if (! $this->has('branch_name') && $this->has('branchName')) {
            $mergeData['branch_name'] = $this->input('branchName');
        }
        if (! $this->has('account_holder_name') && $this->has('accountHolderName')) {
            $mergeData['account_holder_name'] = $this->input('accountHolderName');
        }
        if (! $this->has('account_number') && $this->has('accountNumber')) {
            $mergeData['account_number'] = $this->input('accountNumber');
        }
        if (! $this->has('routing_number') && $this->has('routingNumber')) {
            $mergeData['routing_number'] = $this->input('routingNumber');
        }
        if (! $this->has('swift_code') && $this->has('swiftCode')) {
            $mergeData['swift_code'] = $this->input('swiftCode');
        }
        if (! $this->has('is_default') && $this->has('isDefault')) {
            $mergeData['is_default'] = $this->input('isDefault');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'bank_name' => 'required|string|max:255',
            'branch_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:100',
            'routing_number' => 'nullable|string|max:100',
            'swift_code' => 'nullable|string|max:100',
            'is_default' => 'nullable|boolean',
        ];
    }
}
