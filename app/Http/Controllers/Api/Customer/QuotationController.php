<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Customer\QuotationResource;
use App\Models\JobAssignment;
use App\Models\JobRequest;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    /**
     * Display a listing of quotations for a job request.
     */
    public function index(Request $request, JobRequest $jobRequest): AnonymousResourceCollection|JsonResponse
    {
        $customer = $request->user()->customer;
        if ($jobRequest->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $quotations = $jobRequest->quotations()->with('provider.user')->get();

        return QuotationResource::collection($quotations);
    }

    /**
     * Accept a quotation and assign the job.
     */
    public function accept(Request $request, Quotation $quotation): JsonResponse
    {
        $customer = $request->user()->customer;
        $jobRequest = $quotation->jobRequest;

        if ($jobRequest->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobRequest->status === 'assigned' || $jobRequest->assignment()->exists()) {
            return response()->json(['message' => __('This job request has already been assigned')], 422);
        }

        if ($quotation->status === 'accepted') {
            return response()->json(['message' => __('This quotation has already been accepted')], 422);
        }

        DB::transaction(function () use ($jobRequest, $quotation) {
            // Update quotation status
            $quotation->update(['status' => 'accepted']);
            // Reject other quotations for this request
            $jobRequest->quotations()->where('id', '!=', $quotation->id)->update(['status' => 'rejected']);

            // Update JobRequest status
            $jobRequest->update(['status' => 'assigned']);

            // Create JobAssignment
            JobAssignment::create([
                'job_request_id' => $jobRequest->id,
                'quotation_id' => $quotation->id,
                'provider_id' => $quotation->provider_id,
                'company_id' => $quotation->provider?->company_id,
                'assigned_at' => now(),
                'status' => 'scheduled',
            ]);
        });

        return response()->json(['message' => __('Quotation accepted and job assigned successfully')]);
    }
}
