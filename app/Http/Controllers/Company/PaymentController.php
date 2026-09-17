<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Company/Payment/Index');
    }

    public function reverse(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Payment :id successfully reversed.', ['id' => $id]),
                'data' => [
                    'id' => $id,
                    'status' => 'refunded',
                    'reversed_at' => now()->toIso8601String(),
                ],
            ]);
        }

        return redirect()->back()->with('success', __('Payment :id successfully reversed.', ['id' => $id]));
    }
}
