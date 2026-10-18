<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\Admin\ServiceResource;
use App\Models\AuditLog;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $categoryId = $request->input('category_id');

        $query = Service::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($cq) use ($search) {
                        $cq->where('service_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($categoryId && $categoryId !== 'all') {
            $query->where('service_category_id', $categoryId);
        }

        if ($status && $status !== 'all') {
            $isActive = strtolower($status) === 'active';
            $query->where('is_active', $isActive);
        }

        $services = $query->latest()->paginate(10)->withQueryString();
        $categories = ServiceCategory::where('is_active', true)->orderBy('service_name')->get(['id', 'service_name']);

        return Inertia::render('Admin/Service/Index', [
            'services' => ServiceResource::collection($services),
            'categories' => $categories,
            'stats' => [
                'total' => Service::count(),
                'active' => Service::where('is_active', true)->count(),
                'inactive' => Service::where('is_active', false)->count(),
            ],
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'category_id' => $categoryId ?? 'all',
            ],
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        if (! isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        $service = Service::create($validated);

        AuditLog::log(
            auth()->id(),
            'Service created',
            'Service',
            $service->id,
            "Created service: {$service->name}"
        );

        return redirect()->back()->with('success', __('Service created successfully.'));
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = null;
        }

        $service->update($validated);

        AuditLog::log(
            auth()->id(),
            'Service updated',
            'Service',
            $service->id,
            "Updated service: {$service->name}"
        );

        return redirect()->back()->with('success', __('Service updated successfully.'));
    }

    public function toggleActive(Service $service): RedirectResponse
    {
        $newStatus = ! $service->is_active;
        $service->update(['is_active' => $newStatus]);

        $statusStr = $newStatus ? 'activated' : 'deactivated';

        AuditLog::log(
            auth()->id(),
            "Service {$statusStr}",
            'Service',
            $service->id,
            "Service '{$service->name}' status toggled to {$statusStr}."
        );

        return redirect()->back()->with('success', __('Service status toggled successfully.'));
    }

    public function destroy(Service $service): RedirectResponse
    {
        $name = $service->name;
        $id = $service->id;

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        AuditLog::log(
            auth()->id(),
            'Service deleted',
            'Service',
            $id,
            "Deleted service: {$name}"
        );

        return redirect()->back()->with('success', __('Service deleted successfully.'));
    }
}
