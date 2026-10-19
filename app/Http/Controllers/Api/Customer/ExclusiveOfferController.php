<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\ExclusiveOffer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExclusiveOfferController extends Controller
{
    /**
     * List active and valid exclusive offers.
     */
    public function index(): JsonResponse
    {
        $offers = ExclusiveOffer::active()
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $offers,
        ]);
    }

    /**
     * Show a single exclusive offer.
     */
    public function show(ExclusiveOffer $offer): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $offer,
        ]);
    }

    /**
     * Claim / apply an offer code.
     */
    public function claim(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $offer = ExclusiveOffer::active()
            ->where('code', strtoupper(trim($validated['code'])))
            ->first();

        if (! $offer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired offer code.',
            ], 404);
        }

        // Increment usage count
        $offer->increment('usage_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Offer claimed successfully!',
            'data' => $offer,
        ]);
    }
}
