<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Customer\ServiceCategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of active service categories.
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = ServiceCategory::where('is_active', true)->get();

        return ServiceCategoryResource::collection($categories);
    }
}
