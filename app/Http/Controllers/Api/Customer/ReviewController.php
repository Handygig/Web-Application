<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreReviewRequest;
use App\Http\Resources\Api\Customer\ReviewResource;
use App\Models\JobAssignment;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Submit a review for a completed assignment.
     */
    public function store(StoreReviewRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobAssignment->status !== 'completed') {
            return response()->json(['message' => __('Can only review completed job assignments')], 422);
        }

        if ($jobAssignment->reviews()->where('customer_id', $customer->id)->exists()) {
            return response()->json(['message' => __('You have already reviewed this assignment')], 422);
        }

        $review = DB::transaction(function () use ($request, $jobAssignment, $customer) {
            return Review::create([
                'assignment_id' => $jobAssignment->id,
                'customer_id' => $customer->id,
                'provider_id' => $jobAssignment->provider_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
        });

        return (new ReviewResource($review))
            ->response()
            ->setStatusCode(201);
    }
}
