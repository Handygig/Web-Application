<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreJobRequest;
use App\Http\Resources\Api\Customer\JobRequestResource;
use App\Models\JobRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobRequestController extends Controller
{
    /**
     * Display a listing of customer's job requests.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $customer = $request->user()->customer;
        $jobRequests = JobRequest::with(['property', 'serviceCategory'])
            ->where('customer_id', $customer?->id)
            ->latest()
            ->get();

        return JobRequestResource::collection($jobRequests);
    }

    /**
     * Store a newly created job request.
     */
    public function store(StoreJobRequest $request): JsonResponse
    {
        $customer = $request->user()->customer;

        $data = $request->validated();
        $data['status'] = 'pending';

        $jobRequest = $customer->jobRequests()->create($data);
        $jobRequest->load(['property', 'serviceCategory']);

        return (new JobRequestResource($jobRequest))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified job request.
     */
    public function show(Request $request, JobRequest $jobRequest): JobRequestResource|JsonResponse
    {
        $customer = $request->user()->customer;
        if ($jobRequest->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $jobRequest->load(['property', 'serviceCategory', 'quotations.provider.user', 'assignment.provider.user']);

        return new JobRequestResource($jobRequest);
    }

    /**
     * Cancel the specified job request.
     */
    public function cancel(Request $request, JobRequest $jobRequest): JsonResponse
    {
        $customer = $request->user()->customer;
        if ($jobRequest->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobRequest->status === 'cancelled') {
            return response()->json(['message' => __('Job request is already cancelled')], 422);
        }

        if ($jobRequest->assignment()->exists()) {
            return response()->json(['message' => __('Cannot cancel a job request that has already been assigned')], 422);
        }

        $jobRequest->update(['status' => 'cancelled']);

        return response()->json(['message' => __('Job request cancelled successfully')]);
    }
}
