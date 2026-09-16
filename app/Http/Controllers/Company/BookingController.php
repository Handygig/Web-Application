<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\CompanyBookingResource;
use App\Models\JobRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $query = JobRequest::with(['customer.user', 'serviceCategory']);

        if ($user && $user->company) {
            $query->where('company_id', $user->company->id);
        }

        $bookings = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Company/Booking/Index', [
            'bookings' => CompanyBookingResource::collection($bookings),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $user = auth()->user();
        $booking = JobRequest::find($id);

        if ($booking) {
            if (isset($booking->company_id) && $user->company && $booking->company_id !== $user->company->id) {
                if ($request->wantsJson() || $request->is('api/*')) {
                    return response()->json([
                        'success' => false,
                        'message' => __('Unauthorized to delete this booking.'),
                    ], 403);
                }

                return redirect()->back()->withErrors([
                    'message' => __('Unauthorized to delete this booking.'),
                ]);
            }

            $booking->delete();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => __('Booking deleted successfully'),
            ], 200);
        }

        return redirect()->back()->with('success', __('Booking deleted successfully'));
    }
}
