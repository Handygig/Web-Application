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

        $quotations = $jobRequest->quotations()->with('bidder')->get();

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

            $providerId = $quotation->provider_id ?? ($quotation->bidder instanceof \App\Models\Provider ? $quotation->bidder_id : null);
            $companyId = $quotation->provider?->company_id ?? ($quotation->bidder instanceof \App\Models\Company ? $quotation->bidder_id : $quotation->bidder?->company_id);

            // Create JobAssignment
            JobAssignment::create([
                'job_request_id' => $jobRequest->id,
                'quotation_id' => $quotation->id,
                'provider_id' => $providerId,
                'company_id' => $companyId,
                'assigned_at' => now(),
                'status' => 'scheduled',
            ]);
        });

        return response()->json(['message' => __('Quotation accepted and job assigned successfully')]);
    }

    /**
     * Simulate a quotation from an available provider for dev/testing.
     */
    public function simulateQuotation(Request $request, JobRequest $jobRequest): JsonResponse
    {
        $customer = $request->user()->customer;
        if ($jobRequest->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobRequest->status === 'assigned' || $jobRequest->assignment()->exists()) {
            return response()->json(['message' => __('This job request is already assigned.')], 422);
        }

        // Avoid duplicate quotes from the same provider if possible
        $existingBidderIds = $jobRequest->quotations()
            ->where('bidder_type', \App\Models\Provider::class)
            ->pluck('bidder_id');

        $provider = \App\Models\Provider::whereHas('serviceCategories', function ($q) use ($jobRequest) {
            $q->where('service_categories.id', $jobRequest->service_category_id);
        })->whereNotIn('id', $existingBidderIds)->first()
            ?? \App\Models\Provider::whereNotIn('id', $existingBidderIds)->first()
            ?? \App\Models\Provider::first();

        if (! $provider) {
            return response()->json(['message' => __('No providers available to simulate quotation.')], 404);
        }

        $prices = [2500.00, 3200.00, 3800.00, 4500.00, 5200.00, 6000.00];
        $durations = ['1-2 hours', '2 hours', '2-3 hours', 'Half day (4h)'];
        $messages = [
            'Hello! I am nearby and available with all required tools and equipment.',
            'Experienced professional in this service category. Ready to start as requested.',
            'I can complete this job quickly and ensure 100% satisfaction. Quality guaranteed.',
            'Specialist in this field with top reviews. Looking forward to assisting you.',
        ];

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'bidder_id' => $provider->id,
            'bidder_type' => \App\Models\Provider::class,
            'quoted_price' => $prices[array_rand($prices)],
            'estimated_duration' => $durations[array_rand($durations)],
            'message' => $messages[array_rand($messages)],
            'status' => 'pending',
        ]);

        $quotation->load(['bidder', 'jobRequest']);

        return (new QuotationResource($quotation))
            ->response()
            ->setStatusCode(201);
    }
}
