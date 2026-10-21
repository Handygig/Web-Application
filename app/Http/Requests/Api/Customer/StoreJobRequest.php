<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
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
        if (! $this->has('payment_method') || empty($this->payment_method)) {
            $this->merge(['payment_method' => 'card']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'property_id' => ['required', 'exists:properties,id'],
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['required', 'string'],
            'preferred_date' => ['required', 'date', 'after:now'],
            'payment_method' => ['nullable', 'string', 'in:card,cash'],
            'card_id' => ['nullable', 'exists:customer_cards,id'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $customer = $this->user()?->customer;
            if ($customer && $this->input('property_id')) {
                $ownsProperty = $customer->properties()->where('id', $this->input('property_id'))->exists();
                if (! $ownsProperty) {
                    $validator->errors()->add('property_id', __('The selected property does not belong to your account.'));
                }
            }

            if ($this->input('payment_method') === 'card' && $this->input('card_id')) {
                if ($customer) {
                    $card = $customer->cards()->where('id', $this->input('card_id'))->first();
                    if (! $card) {
                        $validator->errors()->add('card_id', __('The selected payment card does not belong to your account.'));
                    } elseif ($card->is_frozen) {
                        $validator->errors()->add('card_id', __('The selected payment card is currently frozen.'));
                    }
                }
            }
        });
    }
}
