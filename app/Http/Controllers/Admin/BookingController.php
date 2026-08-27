<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBookingStatusRequest;
use App\Http\Resources\Admin\BookingResource;
use App\Models\AuditLog;
use App\Models\JobRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = JobRequest::with(['customer.user', 'property', 'serviceCategory', 'quotations.provider.user']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('customer.user', function ($uq) use ($search) {
                        $uq->where('full_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', strtolower($status));
        }

        $bookings = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Booking/Index', [
            'bookings' => BookingResource::collection($bookings),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(JobRequest $booking): Response
    {
        $bookingModel = JobRequest::with(['customer.user', 'property', 'serviceCategory'])->findOrFail($booking->id);

        return Inertia::render('Admin/Booking/Show', [
            'booking' => new BookingResource($bookingModel),
        ]);
    }

    public function updateStatus(UpdateBookingStatusRequest $request, JobRequest $booking): RedirectResponse
    {
        $validated = $request->validated();

        $newStatus = strtolower($validated['status']);
        $currentStatus = strtolower($booking->status);

        if ($currentStatus === 'cancelled' && $newStatus === 'completed') {
            return redirect()->back()->withErrors([
                'status' => __('Cancelled bookings cannot be directly changed to completed.'),
            ]);
        }

        $history = $booking->history ?? [];
        $history[] = [
            'from' => $currentStatus,
            'to' => $newStatus,
            'updated_by' => auth()->id(),
            'timestamp' => now()->toDateTimeString(),
        ];

        $booking->update([
            'status' => $newStatus,
            'history' => $history,
        ]);

        AuditLog::log(
            auth()->id(),
            'Booking status changed',
            'JobRequest',
            $booking->id,
            "Changed booking status from {$currentStatus} to {$newStatus}"
        );

        return redirect()->back()->with('success', __('Booking status updated successfully.'));
    }

    public function cancel(JobRequest $booking): RedirectResponse
    {
        $history = $booking->history ?? [];
        $history[] = [
            'from' => $booking->status,
            'to' => 'cancelled',
            'updated_by' => auth()->id(),
            'timestamp' => now()->toDateTimeString(),
        ];

        $booking->update([
            'status' => 'cancelled',
            'history' => $history,
        ]);

        AuditLog::log(
            auth()->id(),
            'Booking cancelled',
            'JobRequest',
            $booking->id,
            "Cancelled booking #{$booking->id}"
        );

        return redirect()->back()->with('success', __('Booking cancelled successfully.'));
    }
}
