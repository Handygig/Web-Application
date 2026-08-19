<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Customer\JobAssignmentResource;
use App\Models\JobAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobAssignmentController extends Controller
{
    /**
     * Display a listing of job assignments.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $customer = $request->user()->customer;

        $assignments = JobAssignment::with(['jobRequest.property', 'jobRequest.serviceCategory', 'provider.user'])
            ->whereHas('jobRequest', function ($query) use ($customer) {
                $query->where('customer_id', $customer?->id);
            })
            ->latest()
            ->get();

        return JobAssignmentResource::collection($assignments);
    }

    /**
     * Display the specified job assignment.
     */
    public function show(Request $request, JobAssignment $jobAssignment): JobAssignmentResource|JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $jobAssignment->load(['jobRequest.property', 'jobRequest.serviceCategory', 'provider.user', 'payment']);

        return new JobAssignmentResource($jobAssignment);
    }
}
