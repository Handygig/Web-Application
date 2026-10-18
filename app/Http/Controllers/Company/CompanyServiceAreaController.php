<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\CompanyServiceArea;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyServiceAreaController extends Controller
{
    public function index(Request $request)
    {
        $companyId = $request->user()->company->id;

        $serviceAreas = CompanyServiceArea::with('serviceCategory')
            ->where('company_id', $companyId)
            ->latest()
            ->get();

        $serviceCategories = ServiceCategory::where('is_active', true)->get(['id', 'service_name']);

        return Inertia::render('Company/ServiceAreas/Index', [
            'serviceAreas' => $serviceAreas,
            'serviceCategories' => $serviceCategories,
            'googleMapsApiKey' => env('VITE_GOOGLE_MAPS_API_KEY'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'name' => 'nullable|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'service_radius' => 'required|integer|min:1|max:500',
        ]);

        $companyId = $request->user()->company->id;

        CompanyServiceArea::create([
            'company_id' => $companyId,
            'service_category_id' => $request->service_category_id,
            'name' => $request->name,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'service_radius' => $request->service_radius,
        ]);

        return redirect()->back()->with('success', 'Service area added successfully.');
    }

    public function destroy(Request $request, CompanyServiceArea $serviceArea)
    {
        $companyId = $request->user()->company->id;

        if ($serviceArea->company_id !== $companyId) {
            abort(403);
        }

        $serviceArea->delete();

        return redirect()->back()->with('success', 'Service area deleted successfully.');
    }
}
