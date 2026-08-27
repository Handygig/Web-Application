<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
            'jobTypes' => $jobTypes,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(JobType $jobType): Response
    {
        return Inertia::render('Admin/JobType/Show', [
            'jobType' => $jobType,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_types,name',
            'description' => 'nullable|string',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ]);

        $jobType = JobType::create($validated);

        AuditLog::log(auth()->id(), 'Job type created', 'JobType', $jobType->id, "Created job type: {$jobType->name}");

        return redirect()->back()->with('success', 'Job type created successfully.');
    }

    public function update(Request $request, JobType $jobType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_types,name,'.$jobType->id,
            'description' => 'nullable|string',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ]);

        $jobType->update($validated);

        AuditLog::log(auth()->id(), 'Job type updated', 'JobType', $jobType->id, "Updated job type: {$jobType->name}");

        return redirect()->back()->with('success', 'Job type updated successfully.');
    }

    public function toggleActive(JobType $jobType): RedirectResponse
    {
        $newStatus = $jobType->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $jobType->update(['status' => $newStatus]);

        return redirect()->back()->with('success', 'Job type status toggled successfully.');
    }

    public function destroy(JobType $jobType): RedirectResponse
    {
        $name = $jobType->name;
        $id = $jobType->id;
        $jobType->delete();

        AuditLog::log(auth()->id(), 'Job type deleted', 'JobType', $id, "Deleted job type: {$name}");

        return redirect()->back()->with('success', 'Job type deleted successfully.');
    }
}
