<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceCategoryRequest;
use App\Http\Requests\Admin\UpdateServiceCategoryRequest;
use App\Http\Resources\Admin\ServiceCategoryResource;
use App\Models\AuditLog;
use App\Models\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = ServiceCategory::withCount(['services', 'jobRequests', 'providers']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('service_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $isActive = strtolower($status) === 'active';
            $query->where('is_active', $isActive);
        }

        $categories = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/ServiceCategory/Index', [
            'serviceCategories' => ServiceCategoryResource::collection($categories),
            'stats' => [
                'total' => ServiceCategory::count(),
                'active' => ServiceCategory::where('is_active', true)->count(),
                'inactive' => ServiceCategory::where('is_active', false)->count(),
            ],
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function store(StoreServiceCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        if (! isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('service-categories', 'public');
        }

        $category = ServiceCategory::create($validated);

        AuditLog::log(
            auth()->id(),
            'Service category created',
            'ServiceCategory',
            $category->id,
            "Created service category: {$category->service_name}"
        );

        return redirect()->back()->with('success', __('Service category created successfully.'));
    }

    public function update(UpdateServiceCategoryRequest $request, ServiceCategory $serviceCategory): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($serviceCategory->image) {
                Storage::disk('public')->delete($serviceCategory->image);
            }
            $validated['image'] = $request->file('image')->store('service-categories', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($serviceCategory->image) {
                Storage::disk('public')->delete($serviceCategory->image);
            }
            $validated['image'] = null;
        }

        $serviceCategory->update($validated);

        AuditLog::log(
            auth()->id(),
            'Service category updated',
            'ServiceCategory',
            $serviceCategory->id,
            "Updated service category: {$serviceCategory->service_name}"
        );

        return redirect()->back()->with('success', __('Service category updated successfully.'));
    }

    public function toggleActive(ServiceCategory $serviceCategory): RedirectResponse
    {
        $newStatus = ! $serviceCategory->is_active;
        $serviceCategory->update(['is_active' => $newStatus]);

        $statusStr = $newStatus ? 'activated' : 'deactivated';

        AuditLog::log(
            auth()->id(),
            "Service category {$statusStr}",
            'ServiceCategory',
            $serviceCategory->id,
            "Service category '{$serviceCategory->service_name}' status toggled to {$statusStr}."
        );

        return redirect()->back()->with('success', __('Service category status toggled successfully.'));
    }

    public function destroy(ServiceCategory $serviceCategory): RedirectResponse
    {
        if ($serviceCategory->jobRequests()->count() > 0) {
            return redirect()->back()->with('error', __('Cannot delete category because existing booking requests are associated with it.'));
        }

        $name = $serviceCategory->service_name;
        $id = $serviceCategory->id;

        if ($serviceCategory->image) {
            Storage::disk('public')->delete($serviceCategory->image);
        }

        $serviceCategory->providers()->detach();
        $serviceCategory->companyServiceAreas()->delete();
        $serviceCategory->services()->delete();
        $serviceCategory->delete();

        AuditLog::log(
            auth()->id(),
            'Service category deleted',
            'ServiceCategory',
            $id,
            "Deleted service category: {$name}"
        );

        return redirect()->back()->with('success', __('Service category deleted successfully.'));
    }
}
