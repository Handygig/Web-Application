<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class CompleteJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('payment_method') && $this->has('paymentMethod')) {
            $mergeData['payment_method'] = $this->input('paymentMethod');
        }
        if (! $this->has('cash_collected') && $this->has('cashCollected')) {
            $mergeData['cash_collected'] = $this->input('cashCollected');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'payment_method' => 'nullable|string|in:cash,card,online',
            'cash_collected' => 'nullable|numeric|min:0',
            'completion_notes' => 'nullable|string|max:1000',
        ];
    }
}
