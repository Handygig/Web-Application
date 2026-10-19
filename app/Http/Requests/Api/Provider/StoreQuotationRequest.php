<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $mergeData = [];
        if (! $this->has('quoted_price') && $this->has('quotedAmount')) {
            $mergeData['quoted_price'] = $this->input('quotedAmount');
        }
        if (! $this->has('quoted_price') && $this->has('amount')) {
            $mergeData['quoted_price'] = $this->input('amount');
        }
        if (! $this->has('message') && $this->has('quoteNotes')) {
            $mergeData['message'] = $this->input('quoteNotes');
        }
        if (! $this->has('message') && $this->has('notes')) {
            $mergeData['message'] = $this->input('notes');
        }
        if (! $this->has('estimated_duration') && $this->has('estimatedDuration')) {
            $mergeData['estimated_duration'] = $this->input('estimatedDuration');
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'quoted_price' => 'required|numeric|min:1',
            'estimated_duration' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:1000',
        ];
    }
}
