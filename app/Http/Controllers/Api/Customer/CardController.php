<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreCardRequest;
use App\Http\Resources\Api\Customer\CardResource;
use App\Models\CustomerCard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CardController extends Controller
{
    /**
     * Display a listing of saved payment cards.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $customer = $request->user()->customer;
        $cards = $customer ? $customer->cards : collect();

        return CardResource::collection($cards);
    }

    /**
     * Store a newly created card.
     */
    public function store(StoreCardRequest $request): JsonResponse
    {
        $customer = $request->user()->customer;

        $data = $request->validated();
        $isDefault = (bool) ($data['is_default'] ?? false);

        if ($isDefault && $customer) {
            $customer->cards()->update(['is_default' => false]);
        }

        // If it's the customer's first card, force default to true
        if ($customer && $customer->cards()->count() === 0) {
            $data['is_default'] = true;
        }

        $card = $customer->cards()->create($data);

        return (new CardResource($card))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Remove the specified card.
     */
    public function destroy(Request $request, CustomerCard $card): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($card->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $wasDefault = $card->is_default;
        $card->delete();

        if ($wasDefault && $customer) {
            $nextCard = $customer->cards()->first();
            if ($nextCard) {
                $nextCard->update(['is_default' => true]);
            }
        }

        return response()->json(['message' => __('Card removed successfully')]);
    }

    /**
     * Set the specified card as the default card.
     */
    public function setDefault(Request $request, CustomerCard $card): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($card->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $customer->cards()->where('id', '!=', $card->id)->update(['is_default' => false]);
        $card->update(['is_default' => true]);

        return (new CardResource($card->fresh()))
            ->additional(['message' => __('Primary card updated successfully')])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Toggle or set the freeze status of the specified card.
     */
    public function toggleFreeze(Request $request, CustomerCard $card): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($card->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $isFrozen = $request->has('is_frozen')
            ? $request->boolean('is_frozen')
            : ! $card->is_frozen;

        $card->update(['is_frozen' => $isFrozen]);

        $message = $isFrozen ? __('Card frozen successfully') : __('Card unfrozen successfully');

        return (new CardResource($card->fresh()))
            ->additional(['message' => $message])
            ->response()
            ->setStatusCode(200);
    }
}
