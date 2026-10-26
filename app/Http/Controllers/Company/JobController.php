<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\JobAssignment;
use App\Models\JobRequest;
use App\Models\Provider;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    /**
     * Display ongoing jobs on a full-page interactive map.
     */
    public function search(Request $request): Response
    {
        $user = auth()->user();
        $companyId = $user?->company?->id;

        $ongoingJobs = JobRequest::with([
            'customer.user',
            'serviceCategory',
            'property',
            'assignment.provider.user',
        ])
            ->where(function ($q) use ($companyId) {
                $q->whereIn('status', ['pending', 'new', 'in_progress', 'ongoing', 'assigned', 'active'])
                    ->orWhereHas('assignment', function ($sub) use ($companyId) {
                        $sub->whereIn('status', ['pending', 'in_progress', 'assigned']);
                        if ($companyId) {
                            $sub->where('company_id', $companyId);
                        }
                    });
            })
            ->latest()
            ->get();

        $serviceCategories = ServiceCategory::where('is_active', true)
            ->orderBy('service_name')
            ->get(['id', 'service_name', 'icon']);

        $isOnline = true;
        if ($user && $user->provider) {
            $isOnline = $user->provider->availability === 'available';
        }

        return Inertia::render('Company/Job/Search', [
            'ongoingJobs' => $ongoingJobs,
            'serviceCategories' => $serviceCategories,
            'googleMapsApiKey' => env('VITE_GOOGLE_MAPS_API_KEY'),
            'initialOnlineStatus' => $isOnline,
            'filters' => [
                'search' => $request->query('search', ''),
                'category_id' => $request->query('category_id', ''),
                'status' => $request->query('status', ''),
            ],
        ]);
    }

    /**
     * Toggle company / provider online availability status.
     */
    public function toggleOnline(Request $request): JsonResponse|RedirectResponse
    {
        $user = auth()->user();
        $isOnline = $request->boolean('is_online', true);

        if ($user && $user->provider) {
            $user->provider->update([
                'availability' => $isOnline ? 'available' : 'unavailable',
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_online' => $isOnline,
                'message' => $isOnline ? __('You are now online') : __('You are now offline'),
            ]);
        }

        return redirect()->back()->with('success', $isOnline ? __('You are now online') : __('You are now offline'));
    }

    /**
     * Display a listing of job assignments for the company and technicians.
     */
    public function assignments(Request $request): Response
    {
        $user = auth()->user();
        $companyId = $user?->company?->id;

        $query = JobAssignment::with([
            'jobRequest.customer.user',
            'jobRequest.serviceCategory',
            'jobRequest.property',
            'provider.user',
        ]);

        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('technician_id')) {
            $query->where('provider_id', $request->query('technician_id'));
        }

        $assignments = $query->latest('assigned_at')->paginate(15)->withQueryString();

        $technicians = Provider::with('user')
            ->when($companyId, fn ($q) => $q->where('company_id', $companyId))
            ->whereHas('user', fn ($q) => $q->where('status', '!=', 'inactive'))
            ->get();

        return Inertia::render('Company/Job/Assignments', [
            'assignments' => $assignments,
            'technicians' => $technicians,
            'filters' => [
                'status' => $request->query('status', ''),
                'technician_id' => $request->query('technician_id', ''),
            ],
        ]);
    }

    /**
     * Assign or reassign a technician to a job assignment.
     */
    public function assignTechnician(Request $request, JobAssignment $assignment): JsonResponse|RedirectResponse
    {
        $user = auth()->user();
        $companyId = $user?->company?->id;

        if ($companyId && $assignment->company_id && $assignment->company_id !== $companyId) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'provider_id' => ['nullable', 'exists:providers,id'],
        ]);

        $assignment->update([
            'provider_id' => $validated['provider_id'] ?: null,
            'assigned_at' => $validated['provider_id'] ? now() : null,
            'status' => $validated['provider_id'] ? 'assigned' : 'pending',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Technician assigned successfully.'),
                'assignment' => $assignment->load(['provider.user', 'jobRequest']),
            ]);
        }

        return redirect()->back()->with('success', __('Technician assigned successfully.'));
    }
}
