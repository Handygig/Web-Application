<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display a listing of FAQs.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $category = $request->input('category', 'all');

        $query = Faq::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $isActive = strtolower($status) === 'active';
            $query->where('is_active', $isActive);
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        $faqs = $query->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        $allCategories = Faq::distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('Admin/Faq/Index', [
            'faqs' => $faqs,
            'stats' => [
                'total' => Faq::count(),
                'active' => Faq::where('is_active', true)->count(),
                'inactive' => Faq::where('is_active', false)->count(),
                'categories' => $allCategories->count(),
            ],
            'categories' => $allCategories,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'category' => $category ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created FAQ in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (! isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if (! isset($validated['order']) || $validated['order'] === null) {
            $maxOrder = Faq::max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $faq = Faq::create($validated);

        AuditLog::log(
            auth()->id(),
            'FAQ created',
            'Faq',
            $faq->id,
            "Created FAQ: {$faq->question} (Category: {$faq->category})"
        );

        return redirect()->back()->with('success', __('FAQ created successfully.'));
    }

    /**
     * Update the specified FAQ in storage.
     */
    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (! isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if (! isset($validated['order']) || $validated['order'] === null) {
            $validated['order'] = $faq->order;
        }

        $faq->update($validated);

        AuditLog::log(
            auth()->id(),
            'FAQ updated',
            'Faq',
            $faq->id,
            "Updated FAQ #{$faq->id}: {$faq->question}"
        );

        return redirect()->back()->with('success', __('FAQ updated successfully.'));
    }

    /**
     * Remove the specified FAQ from storage.
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        $faqId = $faq->id;
        $faqQuestion = $faq->question;

        $faq->delete();

        AuditLog::log(
            auth()->id(),
            'FAQ deleted',
            'Faq',
            $faqId,
            "Deleted FAQ #{$faqId}: {$faqQuestion}"
        );

        return redirect()->back()->with('success', __('FAQ deleted successfully.'));
    }

    /**
     * Toggle the active status of the FAQ.
     */
    public function toggleActive(Faq $faq): RedirectResponse
    {
        $faq->is_active = ! $faq->is_active;
        $faq->save();

        $statusStr = $faq->is_active ? 'activated' : 'deactivated';

        AuditLog::log(
            auth()->id(),
            "FAQ {$statusStr}",
            'Faq',
            $faq->id,
            "FAQ #{$faq->id} was {$statusStr}"
        );

        return redirect()->back()->with('success', __("FAQ {$statusStr} successfully."));
    }
}
