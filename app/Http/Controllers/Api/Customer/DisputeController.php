<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreDisputeRequest;
use App\Http\Resources\Api\Customer\DisputeResource;
use App\Models\Dispute;
use App\Models\JobAssignment;
use Illuminate\Http\JsonResponse;

class DisputeController extends Controller
{
    /**
     * Store a dispute for a specific job assignment.
     */
    public function store(StoreDisputeRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobAssignment->disputes()->where('customer_id', $customer->id)->where('status', 'open')->exists()) {
            return response()->json(['message' => __('An active dispute is already open for this assignment')], 422);
        }

        $dispute = Dispute::create([
            'assignment_id' => $jobAssignment->id,
            'customer_id' => $customer->id,
            'provider_id' => $jobAssignment->provider_id,
            'reason' => $request->reason,
            'status' => 'open',
        ]);

        return (new DisputeResource($dispute))
            ->response()
            ->setStatusCode(201);
    }
}
