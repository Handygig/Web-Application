<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyTypeController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/PropertyType/Index');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->back()->with('success', 'Property type created successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        return redirect()->back()->with('success', 'Property type updated successfully.');
    }

    public function toggleActive(int $id): RedirectResponse
    {
        return redirect()->back()->with('success', 'Property type status toggled successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        return redirect()->back()->with('success', 'Property type deleted successfully.');
    }
}
