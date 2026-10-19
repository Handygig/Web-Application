<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\StoreQuotationRequest;
use App\Http\Requests\Api\Provider\UpdateQuotationRequest;
use App\Http\Resources\Api\Provider\ProviderQuotationResource;
use App\Models\Company;
use App\Models\JobRequest;
use App\Models\Notification;
use App\Models\Provider;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuotationController extends Controller
{
    /**
     * Display a listing of quotations submitted by the provider/company.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $query = Quotation::with(['jobRequest.customer.user', 'jobRequest.property', 'jobRequest.serviceCategory', 'assignment']);

        if ($company) {
            $query->where('bidder_type', Company::class)->where('bidder_id', $company->id);
        } elseif ($provider) {
            $query->where('bidder_type', Provider::class)->where('bidder_id', $provider->id);
        }

        // Status filter (e.g. pending, accepted, rejected)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $quotations = $query->latest()->get();

        return ProviderQuotationResource::collection($quotations);
    }

    /**
     * Store a newly created quotation (Submit Quote).
     */
    public function store(StoreQuotationRequest $request, JobRequest $jobRequest): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        // Verify job request availability
        if (in_array($jobRequest->status, ['assigned', 'completed', 'cancelled']) || $jobRequest->assignment()->exists()) {
            return response()->json([
                'message' => __('This job request is no longer available for bidding.'),
            ], 422);
        }

        // Polymorphic bidder determination
        if ($company) {
            $bidderType = Company::class;
            $bidderId = $company->id;
            $bidderName = $company->company_name ?? $user->full_name;
        } elseif ($provider && $provider->company_id === null) {
            $bidderType = Provider::class;
            $bidderId = $provider->id;
            $bidderName = $user->full_name;
        } else {
            return response()->json([
                'message' => __('Company staff cannot submit independent quotes. Bids must be submitted by the company.'),
            ], 403);
        }

        // Check if already quoted
        $existingQuote = Quotation::where('job_request_id', $jobRequest->id)
            ->where('bidder_type', $bidderType)
            ->where('bidder_id', $bidderId)
            ->first();

        if ($existingQuote) {
            return response()->json([
                'message' => __('You have already submitted a quotation for this job request.'),
                'quotation' => new ProviderQuotationResource($existingQuote),
            ], 422);
        }

        $quotation = Quotation::create([
            'job_request_id' => $jobRequest->id,
            'bidder_type' => $bidderType,
            'bidder_id' => $bidderId,
            'quoted_price' => $request->quoted_price,
            'estimated_duration' => $request->input('estimated_duration', '1 day'),
            'message' => $request->message,
            'status' => 'pending',
        ]);

        // Send Notification to Customer
        $customerUser = $jobRequest->customer?->user;
        if ($customerUser) {
            Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('New Quotation Received!'),
                'message' => __(':name submitted a quotation of $:price for your :service request.', [
                    'name' => $bidderName,
                    'price' => number_format((float) $request->quoted_price, 2),
                    'service' => $jobRequest->serviceCategory?->name ?? 'service',
                ]),
                'type' => 'quotation',
                'related_id' => $quotation->id,
                'related_type' => Quotation::class,
                'is_read' => false,
            ]);
        }

        $quotation->load(['jobRequest.customer.user', 'jobRequest.property', 'jobRequest.serviceCategory']);

        return (new ProviderQuotationResource($quotation))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified quotation.
     */
    public function show(Request $request, Quotation $quotation): ProviderQuotationResource|JsonResponse
    {
        $this->authorizeQuotationAccess($request, $quotation);

        $quotation->load(['jobRequest.customer.user', 'jobRequest.property', 'jobRequest.serviceCategory', 'assignment']);

        return new ProviderQuotationResource($quotation);
    }

    /**
     * Update the specified quotation (if still pending).
     */
    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        $this->authorizeQuotationAccess($request, $quotation);

        if ($quotation->status !== 'pending') {
            return response()->json([
                'message' => __('Only pending quotations can be modified.'),
            ], 422);
        }

        $quotation->update($request->only(['quoted_price', 'estimated_duration', 'message']));

        $quotation->load(['jobRequest.customer.user', 'jobRequest.property', 'jobRequest.serviceCategory']);

        return response()->json([
            'status' => 'success',
            'message' => __('Quotation updated successfully.'),
            'data' => new ProviderQuotationResource($quotation),
        ]);
    }

    /**
     * Withdraw / delete the quotation.
     */
    public function destroy(Request $request, Quotation $quotation): JsonResponse
    {
        $this->authorizeQuotationAccess($request, $quotation);

        if ($quotation->status === 'accepted') {
            return response()->json([
                'message' => __('Cannot withdraw an accepted quotation with an active job assignment.'),
            ], 422);
        }

        $quotation->delete();

        return response()->json([
            'status' => 'success',
            'message' => __('Quotation withdrawn successfully.'),
        ]);
    }

    protected function authorizeQuotationAccess(Request $request, Quotation $quotation): void
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $isOwner = false;
        if ($provider && $quotation->bidder_type === Provider::class && $quotation->bidder_id === $provider->id) {
            $isOwner = true;
        } elseif ($company && $quotation->bidder_type === Company::class && $quotation->bidder_id === $company->id) {
            $isOwner = true;
        }

        if (! $isOwner) {
            abort(403, __('Unauthorized access to this quotation.'));
        }
    }
}
