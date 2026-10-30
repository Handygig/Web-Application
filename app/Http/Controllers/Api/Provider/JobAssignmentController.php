<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\CompleteJobRequest;
use App\Http\Requests\Api\Provider\DispatchJobRequest;
use App\Http\Requests\Api\Provider\RequestExtraChargeRequest;
use App\Http\Resources\Api\Provider\ProviderJobAssignmentResource;
use App\Models\JobAssignment;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class JobAssignmentController extends Controller
{
    /**
     * Display a listing of job assignments (Jobs screen).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $query = JobAssignment::with([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
            'provider.user',
        ]);

        if ($company && ! $provider) {
            // Company owner / manager: view company assignments
            $query->where('company_id', $company->id);
        } elseif ($provider) {
            // Provider: view assigned jobs (or company jobs if dispatcher)
            $query->where(function ($q) use ($provider, $company) {
                $q->where('provider_id', $provider->id);
                if ($company && $provider->company_id === $company->id) {
                    $q->orWhere('company_id', $company->id);
                }
            });
        }

        // Filter by stage / status
        $stage = $request->input('stage') ?? $request->input('status');
        if ($stage === 'ongoing' || $stage === 'active') {
            $query->whereIn('status', ['scheduled', 'in_progress', 'ongoing']);
        } elseif ($stage === 'finished' || $stage === 'completed') {
            $query->where('status', 'completed');
        } elseif ($stage && $stage !== 'all') {
            $query->where('status', $stage);
        }

        $assignments = $query->latest('assigned_at')->get();

        return ProviderJobAssignmentResource::collection($assignments);
    }

    /**
     * Display the specified job assignment details.
     */
    public function show(Request $request, JobAssignment $jobAssignment): ProviderJobAssignmentResource|JsonResponse
    {
        $this->authorizeAssignmentAccess($request, $jobAssignment);

        $jobAssignment->load([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
            'provider.user',
        ]);

        return new ProviderJobAssignmentResource($jobAssignment);
    }

    /**
     * Start the job assignment (advance stage to Ongoing / in_progress).
     */
    public function start(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $this->authorizeAssignmentAccess($request, $jobAssignment);

        if ($jobAssignment->status === 'completed') {
            return response()->json([
                'message' => __('Cannot start a job that is already completed.'),
            ], 422);
        }

        $jobAssignment->update([
            'status' => 'in_progress',
            'start_date' => $jobAssignment->start_date ?? now(),
        ]);

        // Notify customer
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        if ($customerUser) {
            Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Job Started!'),
                'message' => __('The technician has arrived on-site and started work on your :service job.', [
                    'service' => $jobAssignment->jobRequest?->serviceCategory?->name ?? 'service',
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('Job started successfully.'),
            'data' => new ProviderJobAssignmentResource($jobAssignment),
        ]);
    }

    /**
     * Request an extra quotation / charge during ongoing work.
     */
    public function requestExtra(RequestExtraChargeRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $this->authorizeAssignmentAccess($request, $jobAssignment);

        if ($jobAssignment->status === 'completed') {
            return response()->json([
                'message' => __('Cannot request extra charges on a completed job.'),
            ], 422);
        }

        $jobAssignment->update([
            'extra_amount' => $request->extra_amount,
            'extra_reason' => $request->extra_reason,
            'extra_status' => 'pending',
        ]);

        // Send Notification to Customer requesting approval
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        if ($customerUser) {
            Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Extra Quotation Requested'),
                'message' => __('Your provider requested an extra LKR :amount for ":reason". Please review and approve.', [
                    'amount' => number_format((float) $request->extra_amount, 2),
                    'reason' => $request->extra_reason,
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('Extra quotation request sent to customer for approval.'),
            'data' => new ProviderJobAssignmentResource($jobAssignment),
        ]);
    }

    /**
     * Mark job completed (Finished stage).
     */
    public function complete(CompleteJobRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $this->authorizeAssignmentAccess($request, $jobAssignment);

        if ($jobAssignment->status === 'completed') {
            return response()->json([
                'message' => __('This job is already marked as completed.'),
            ], 422);
        }

        DB::transaction(function () use ($request, $jobAssignment) {
            $jobAssignment->update([
                'status' => 'completed',
                'end_date' => now(),
            ]);

            $jobAssignment->jobRequest?->update([
                'status' => 'completed',
            ]);

            // Handle cash collection if payment method is cash or cash collected amount given
            $paymentMethod = $request->input('payment_method');
            $cashCollected = $request->input('cash_collected');

            if ($paymentMethod === 'cash' || ($cashCollected !== null && (float) $cashCollected > 0)) {
                $baseAmount = (float) ($jobAssignment->quotation?->quoted_price ?? 0);
                $extraAmount = ($jobAssignment->extra_status === 'approved' && $jobAssignment->extra_amount)
                    ? (float) $jobAssignment->extra_amount
                    : 0;

                $totalAmount = $cashCollected !== null ? (float) $cashCollected : ($baseAmount + $extraAmount);
                $platformFee = round($totalAmount * 0.10, 2);
                $providerAmount = round($totalAmount - $platformFee, 2);

                $existingPayment = $jobAssignment->payment;
                if (! $existingPayment) {
                    Payment::create([
                        'assignment_id' => $jobAssignment->id,
                        'customer_id' => $jobAssignment->jobRequest->customer_id,
                        'provider_id' => $jobAssignment->provider_id,
                        'amount' => $totalAmount,
                        'platform_fee' => $platformFee,
                        'provider_amount' => $providerAmount,
                        'payment_method' => 'cash',
                        'payment_status' => 'paid',
                        'payment_date' => now(),
                    ]);
                } else {
                    $existingPayment->update([
                        'payment_status' => 'paid',
                        'payment_date' => now(),
                    ]);
                }
            }
        });

        // Notify customer
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        if ($customerUser) {
            Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Job Completed!'),
                'message' => __('Your service for :service has been successfully completed. Please rate your experience.', [
                    'service' => $jobAssignment->jobRequest?->serviceCategory?->name ?? 'service',
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('Job completed successfully!'),
            'data' => new ProviderJobAssignmentResource($jobAssignment),
        ]);
    }

    /**
     * Dispatching: Two-Step Job Assignment (for Companies).
     */
    public function dispatchJob(DispatchJobRequest $request, JobAssignment $jobAssignment): JsonResponse
    {
        $user = $request->user();
        $company = $user->company ?? $user->employer;

        if (! $company || $jobAssignment->company_id !== $company->id) {
            return response()->json([
                'message' => __('Unauthorized. Only the company that owns this assignment can dispatch providers.'),
            ], 403);
        }

        $dispatchedProvider = Provider::where('id', $request->provider_id)
            ->where('company_id', $company->id)
            ->first();

        if (! $dispatchedProvider) {
            return response()->json([
                'message' => __('The selected provider does not belong to your company.'),
            ], 422);
        }

        $jobAssignment->update([
            'provider_id' => $dispatchedProvider->id,
            'scheduled_time' => $request->scheduled_time ?? $jobAssignment->scheduled_time,
        ]);

        // Notify dispatched provider
        $providerUser = $dispatchedProvider->user;
        if ($providerUser) {
            Notification::create([
                'recipient_user_id' => $providerUser->id,
                'title' => __('New Job Dispatched!'),
                'message' => __('You have been assigned to :service at :address.', [
                    'service' => $jobAssignment->jobRequest?->serviceCategory?->name ?? 'service',
                    'address' => $jobAssignment->jobRequest?->property?->city ?? 'client location',
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.customer.user',
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'quotation',
            'payment',
            'reviews',
            'provider.user',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('Job dispatched to :name successfully.', [
                'name' => $providerUser?->full_name ?? 'Provider',
            ]),
            'data' => new ProviderJobAssignmentResource($jobAssignment),
        ]);
    }

    protected function authorizeAssignmentAccess(Request $request, JobAssignment $jobAssignment): void
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $hasAccess = false;
        if ($provider && $jobAssignment->provider_id === $provider->id) {
            $hasAccess = true;
        } elseif ($company && $jobAssignment->company_id === $company->id) {
            $hasAccess = true;
        }

        if (! $hasAccess) {
            abort(403, __('Unauthorized access to this job assignment.'));
        }
    }
}
