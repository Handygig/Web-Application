<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePropertyTypeRequest;
use App\Http\Requests\Admin\UpdatePropertyTypeRequest;
use App\Http\Resources\Admin\PropertyTypeResource;
use App\Models\AuditLog;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = PropertyType::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status && $status !== 'all') {
            $query->where('status', strtoupper($status));
        }

        $propertyTypes = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/PropertyType/Index', [
            'propertyTypes' => PropertyTypeResource::collection($propertyTypes),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(PropertyType $propertyType): Response
    {
        return Inertia::render('Admin/PropertyType/Show', [
            'propertyType' => new PropertyTypeResource($propertyType),
        ]);
    }

    public function store(StorePropertyTypeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $propertyType = PropertyType::create($validated);

        AuditLog::log(
            auth()->id(),
            'Property type created',
            'PropertyType',
            $propertyType->id,
            "Created property type: {$propertyType->name}"
        );

        return redirect()->back()->with('success', __('Property type created successfully.'));
    }

    public function update(UpdatePropertyTypeRequest $request, PropertyType $propertyType): RedirectResponse
    {
        $validated = $request->validated();

        $propertyType->update($validated);

        AuditLog::log(
            auth()->id(),
            'Property type updated',
            'PropertyType',
            $propertyType->id,
            "Updated property type: {$propertyType->name}"
        );

        return redirect()->back()->with('success', __('Property type updated successfully.'));
    }

    public function toggleActive(PropertyType $propertyType): RedirectResponse
    {
        $newStatus = $propertyType->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $propertyType->update(['status' => $newStatus]);

        return redirect()->back()->with('success', __('Property type status toggled successfully.'));
    }

    public function destroy(PropertyType $propertyType): RedirectResponse
    {
        $isUsed = Property::where('property_type_id', $propertyType->id)->exists();

        if ($isUsed) {
            return redirect()->back()->withErrors([
                'error' => __('Property type is currently being used by existing properties. Consider deactivating it instead.'),
            ]);
        }

        $name = $propertyType->name;
        $id = $propertyType->id;
        $propertyType->delete();

        AuditLog::log(
            auth()->id(),
            'Property type deleted',
            'PropertyType',
            $id,
            "Deleted property type: {$name}"
        );

        return redirect()->back()->with('success', __('Property type deleted successfully.'));
    }
}
