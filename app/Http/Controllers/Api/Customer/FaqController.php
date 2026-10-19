<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * List active FAQs for mobile application.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faq::active();

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        $faqs = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $faqs,
        ]);
    }

    /**
     * Get unique categories with FAQ counts.
     */
    public function categories(): JsonResponse
    {
        $categories = Faq::where('is_active', true)
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }
}
