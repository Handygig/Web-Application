<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class RequestExtraChargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('extra_amount') && $this->has('extraAmount')) {
            $mergeData['extra_amount'] = $this->input('extraAmount');
        }
        if (! $this->has('extra_amount') && $this->has('amount')) {
            $mergeData['extra_amount'] = $this->input('amount');
        }
        if (! $this->has('extra_reason') && $this->has('extraReason')) {
            $mergeData['extra_reason'] = $this->input('extraReason');
        }
        if (! $this->has('extra_reason') && $this->has('reason')) {
            $mergeData['extra_reason'] = $this->input('reason');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'extra_amount' => 'required|numeric|min:0.01',
            'extra_reason' => 'required|string|max:1000',
        ];
    }
}
