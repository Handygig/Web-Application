<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Provider\ProviderReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of provider reviews and rating statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = $user->provider;
        $company = $user->company ?? $user->employer;

        $query = Review::with(['customer.user', 'assignment.jobRequest.serviceCategory']);

        if ($company && ! $provider) {
            $query->whereHas('assignment', fn ($q) => $q->where('company_id', $company->id));
        } elseif ($provider) {
            $query->where('provider_id', $provider->id);
        }

        $reviews = $query->latest()->get();

        $averageRating = $reviews->isNotEmpty() ? round((float) $reviews->avg('rating'), 1) : 5.0;
        $totalReviews = $reviews->count();

        $ratingDistribution = [
            '5' => $reviews->where('rating', 5)->count(),
            '4' => $reviews->where('rating', 4)->count(),
            '3' => $reviews->where('rating', 3)->count(),
            '2' => $reviews->where('rating', 2)->count(),
            '1' => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'status' => 'success',
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
            'rating_distribution' => $ratingDistribution,
            'data' => ProviderReviewResource::collection($reviews),
        ]);
    }
}
