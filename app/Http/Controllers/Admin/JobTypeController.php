<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobTypeRequest;
use App\Http\Requests\Admin\UpdateJobTypeRequest;
use App\Http\Resources\Admin\JobTypeResource;
use App\Models\AuditLog;
use App\Models\JobType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = JobType::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status && $status !== 'all') {
            $query->where('status', strtoupper($status));
        }

        $jobTypes = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/JobType/Index', [
            'jobTypes' => JobTypeResource::collection($jobTypes),
            'stats' => [
                'total' => JobType::count(),
                'active' => JobType::where('status', 'ACTIVE')->count(),
                'inactive' => JobType::where('status', 'INACTIVE')->count(),
            ],
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(JobType $jobType): Response
    {
        return Inertia::render('Admin/JobType/Show', [
            'jobType' => new JobTypeResource($jobType),
        ]);
    }

    public function store(StoreJobTypeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $jobType = JobType::create($validated);

        AuditLog::log(
            auth()->id(),
            'Job type created',
            'JobType',
            $jobType->id,
            "Created job type: {$jobType->name}"
        );

        return redirect()->back()->with('success', __('Job type created successfully.'));
    }

    public function update(UpdateJobTypeRequest $request, JobType $jobType): RedirectResponse
    {
        $validated = $request->validated();

        $jobType->update($validated);

        AuditLog::log(
            auth()->id(),
            'Job type updated',
            'JobType',
            $jobType->id,
            "Updated job type: {$jobType->name}"
        );

        return redirect()->back()->with('success', __('Job type updated successfully.'));
    }

    public function toggleActive(JobType $jobType): RedirectResponse
    {
        $newStatus = $jobType->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $jobType->update(['status' => $newStatus]);

        return redirect()->back()->with('success', __('Job type status toggled successfully.'));
    }

    public function destroy(JobType $jobType): RedirectResponse
    {
        $name = $jobType->name;
        $id = $jobType->id;
        $jobType->delete();

        AuditLog::log(
            auth()->id(),
            'Job type deleted',
            'JobType',
            $id,
            "Deleted job type: {$name}"
        );

        return redirect()->back()->with('success', __('Job type deleted successfully.'));
    }
}
