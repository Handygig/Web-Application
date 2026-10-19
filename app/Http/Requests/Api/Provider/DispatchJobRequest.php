<?php

namespace App\Http\Requests\Api\Provider;

use Illuminate\Foundation\Http\FormRequest;

class DispatchJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('provider_id') && $this->has('providerId')) {
            $this->merge(['provider_id' => $this->input('providerId')]);
        }
    }

    public function rules(): array
    {
        return [
            'provider_id' => 'required|exists:providers,id',
            'scheduled_time' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
