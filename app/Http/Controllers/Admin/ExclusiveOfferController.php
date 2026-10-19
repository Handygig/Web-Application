<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ExclusiveOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExclusiveOfferController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = ExclusiveOffer::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $isActive = strtolower($status) === 'active';
            $query->where('is_active', $isActive);
        }

        $offers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/ExclusiveOffer/Index', [
            'offers' => $offers,
            'stats' => [
                'total' => ExclusiveOffer::count(),
                'active' => ExclusiveOffer::where('is_active', true)->count(),
                'inactive' => ExclusiveOffer::where('is_active', false)->count(),
                'total_claims' => (int) ExclusiveOffer::sum('usage_count'),
            ],
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:exclusive_offers,code',
            'description' => 'nullable|string',
            'badge' => 'required|string|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'discount_text' => 'required|string|max:50',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'gradient_start' => 'nullable|string|max:20',
            'gradient_end' => 'nullable|string|max:20',
            'accent_color' => 'nullable|string|max:20',
            'icon_name' => 'nullable|string|max:50',
            'terms' => 'nullable|string',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        if (! isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $offer = ExclusiveOffer::create($validated);

        AuditLog::log(
            auth()->id(),
            'Exclusive offer created',
            'ExclusiveOffer',
            $offer->id,
            "Created offer: {$offer->title} ({$offer->code})"
        );

        return redirect()->back()->with('success', __('Offer created successfully.'));
    }

    public function update(Request $request, ExclusiveOffer $exclusiveOffer): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:50', Rule::unique('exclusive_offers', 'code')->ignore($exclusiveOffer->id)],
            'description' => 'nullable|string',
            'badge' => 'required|string|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'discount_text' => 'required|string|max:50',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'gradient_start' => 'nullable|string|max:20',
            'gradient_end' => 'nullable|string|max:20',
            'accent_color' => 'nullable|string|max:20',
            'icon_name' => 'nullable|string|max:50',
            'terms' => 'nullable|string',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $exclusiveOffer->update($validated);

        AuditLog::log(
            auth()->id(),
            'Exclusive offer updated',
            'ExclusiveOffer',
            $exclusiveOffer->id,
            "Updated offer: {$exclusiveOffer->title} ({$exclusiveOffer->code})"
        );

        return redirect()->back()->with('success', __('Offer updated successfully.'));
    }

    public function toggleActive(ExclusiveOffer $exclusiveOffer): RedirectResponse
    {
        $exclusiveOffer->is_active = ! $exclusiveOffer->is_active;
        $exclusiveOffer->save();

        $state = $exclusiveOffer->is_active ? 'activated' : 'deactivated';

        AuditLog::log(
            auth()->id(),
            "Exclusive offer {$state}",
            'ExclusiveOffer',
            $exclusiveOffer->id,
            "{$state} offer: {$exclusiveOffer->title}"
        );

        return redirect()->back()->with('success', __("Offer {$state} successfully."));
    }

    public function destroy(ExclusiveOffer $exclusiveOffer): RedirectResponse
    {
        $title = $exclusiveOffer->title;
        $exclusiveOffer->delete();

        AuditLog::log(
            auth()->id(),
            'Exclusive offer deleted',
            'ExclusiveOffer',
            $exclusiveOffer->id,
            "Deleted offer: {$title}"
        );

        return redirect()->back()->with('success', __('Offer deleted successfully.'));
    }
}
