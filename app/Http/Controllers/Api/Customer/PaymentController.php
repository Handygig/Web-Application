<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StorePaymentRequest;
use App\Http\Resources\Api\Customer\PaymentResource;
use App\Models\JobAssignment;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Pay for a specific job assignment.
     */
    public function pay(StorePaymentRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobAssignment->payment()->where('payment_status', 'paid')->exists()) {
            return response()->json(['message' => __('This assignment is already paid')], 422);
        }

        $card = $customer->cards()->where('id', $request->card_id)->first();
        if (! $card) {
            return response()->json(['message' => __('Payment card not found')], 404);
        }

        if ($card->is_frozen) {
            return response()->json(['message' => __('This card is frozen and cannot be used for payment')], 422);
        }

        $amount = (float) ($jobAssignment->quotation?->quoted_price ?? 0);
        if ($amount <= 0) {
            return response()->json(['message' => __('Cannot determine payment amount for this assignment')], 422);
        }

        $platformFee = round($amount * 0.10, 2);
        $providerAmount = round($amount - $platformFee, 2);

        $payment = DB::transaction(function () use ($jobAssignment, $customer, $card, $amount, $platformFee, $providerAmount) {
            $payment = Payment::create([
                'assignment_id' => $jobAssignment->id,
                'customer_id' => $customer->id,
                'card_id' => $card->id,
                'amount' => $amount,
                'platform_fee' => $platformFee,
                'provider_amount' => $providerAmount,
                'payment_method' => 'card',
                'payment_status' => 'paid',
                'payment_date' => now(),
            ]);

            $jobAssignment->update(['status' => 'completed']);
            $jobAssignment->jobRequest->update(['status' => 'completed']);

            return $payment;
        });

        $payment->load('card');

        return (new PaymentResource($payment))
            ->response()
            ->setStatusCode(201);
    }
}
