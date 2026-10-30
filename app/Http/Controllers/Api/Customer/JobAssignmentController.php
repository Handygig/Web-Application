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

        $assignments = JobAssignment::with(['jobRequest.property', 'jobRequest.serviceCategory', 'provider.user', 'payment', 'quotation'])
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

        $jobAssignment->load(['jobRequest.property', 'jobRequest.serviceCategory', 'provider.user', 'payment', 'quotation']);

        return new JobAssignmentResource($jobAssignment);
    }

    /**
     * Approve provider's requested extra charge.
     */
    public function approveExtra(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobAssignment->extra_status !== 'pending') {
            return response()->json(['message' => __('No pending extra quotation found.')], 422);
        }

        $jobAssignment->update(['extra_status' => 'approved']);

        // Notify provider
        $providerUser = $jobAssignment->provider?->user;
        if ($providerUser) {
            \App\Models\Notification::create([
                'recipient_user_id' => $providerUser->id,
                'title' => __('Extra Quotation Approved!'),
                'message' => __('The customer approved your extra quotation of $:amount.', [
                    'amount' => number_format((float) $jobAssignment->extra_amount, 2),
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => __('Extra charge approved successfully.'),
            'extra_status' => 'approved',
            'extra_amount' => (float) $jobAssignment->extra_amount,
        ]);
    }

    /**
     * Reject provider's requested extra charge.
     */
    public function rejectExtra(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        if ($jobAssignment->extra_status !== 'pending') {
            return response()->json(['message' => __('No pending extra quotation found.')], 422);
        }

        $jobAssignment->update(['extra_status' => 'rejected']);

        // Notify provider
        $providerUser = $jobAssignment->provider?->user;
        if ($providerUser) {
            \App\Models\Notification::create([
                'recipient_user_id' => $providerUser->id,
                'title' => __('Extra Quotation Declined'),
                'message' => __('The customer declined your extra quotation request.'),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => __('Extra charge declined.'),
            'extra_status' => 'rejected',
        ]);
    }

    /**
     * Simulate provider starting the job for dev/testing.
     */
    public function simulateStartJob(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $jobAssignment->update([
            'status' => 'in_progress',
            'start_date' => $jobAssignment->start_date ?? now(),
        ]);

        $jobAssignment->jobRequest?->update([
            'status' => 'assigned',
        ]);

        // Send notification to customer
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        $providerName = $jobAssignment->provider?->user?->full_name ?? ($jobAssignment->company?->name ?? 'Your service provider');
        if ($customerUser) {
            \App\Models\Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Job Started! 🛠️'),
                'message' => __(':provider has arrived and started work on your :service job.', [
                    'provider' => $providerName,
                    'service' => $jobAssignment->jobRequest?->serviceCategory?->name ?? 'service',
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'provider.user',
            'payment',
            'quotation',
        ]);

        return (new JobAssignmentResource($jobAssignment))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Simulate an updated/extra quotation request from the assigned provider for dev/testing.
     */
    public function simulateExtraQuote(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $extraAmount = $request->filled('extra_amount')
            ? (float) $request->input('extra_amount')
            : 2500.00;
        $extraReason = $request->filled('extra_reason')
            ? (string) $request->input('extra_reason')
            : 'Additional materials and extra pipe fittings required';

        $jobAssignment->update([
            'extra_amount' => $extraAmount,
            'extra_reason' => $extraReason,
            'extra_status' => 'pending',
        ]);

        // Send notification to customer
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        $providerName = $jobAssignment->provider?->user?->full_name ?? ($jobAssignment->company?->name ?? 'Your service provider');
        if ($customerUser) {
            \App\Models\Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Updated Quotation Received 📋'),
                'message' => __(':provider sent an updated quotation of LKR :amount for ":reason". Please review and approve.', [
                    'provider' => $providerName,
                    'amount' => number_format((float) $extraAmount, 2),
                    'reason' => $extraReason,
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'provider.user',
            'payment',
            'quotation',
        ]);

        return (new JobAssignmentResource($jobAssignment))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Simulate provider completing the job for dev/testing.
     */
    public function simulateCompleteJob(Request $request, JobAssignment $jobAssignment): JsonResponse
    {
        $customer = $request->user()->customer;

        if ($jobAssignment->jobRequest?->customer_id !== $customer?->id) {
            return response()->json(['message' => __('Unauthorized')], 403);
        }

        $jobAssignment->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $jobAssignment->jobRequest?->update([
            'status' => 'completed',
        ]);

        // Send notification to customer
        $customerUser = $jobAssignment->jobRequest?->customer?->user;
        $providerName = $jobAssignment->provider?->user?->full_name ?? ($jobAssignment->company?->name ?? 'Your service provider');
        if ($customerUser) {
            \App\Models\Notification::create([
                'recipient_user_id' => $customerUser->id,
                'title' => __('Job Completed! 🎉'),
                'message' => __(':provider has finished your :service job. Please rate your experience.', [
                    'provider' => $providerName,
                    'service' => $jobAssignment->jobRequest?->serviceCategory?->name ?? 'service',
                ]),
                'type' => 'job',
                'related_id' => $jobAssignment->id,
                'related_type' => JobAssignment::class,
                'is_read' => false,
            ]);
        }

        $jobAssignment->load([
            'jobRequest.property',
            'jobRequest.serviceCategory',
            'provider.user',
            'payment',
            'quotation',
        ]);

        return (new JobAssignmentResource($jobAssignment))
            ->response()
            ->setStatusCode(200);
    }
}
