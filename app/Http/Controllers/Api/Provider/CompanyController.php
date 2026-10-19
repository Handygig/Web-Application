<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Provider\StoreEmployeeRequest;
use App\Http\Resources\Api\Provider\ProviderProfileResource;
use App\Models\Company;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CompanyController extends Controller
{
    /**
     * List all providers / staff belonging to the company.
     */
    public function employees(Request $request): JsonResponse
    {
        $user = $request->user();
        $company = $user->company ?? $user->employer;

        if (! $company) {
            return response()->json([
                'message' => __('Only company accounts can access employee lists.'),
            ], 403);
        }

        $providers = Provider::with(['user', 'serviceCategories'])
            ->where('company_id', $company->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'company' => [
                'id' => $company->id,
                'name' => $company->company_name,
                'registration_no' => $company->registration_no,
            ],
            'employees' => ProviderProfileResource::collection($providers),
        ]);
    }

    /**
     * Add a new employee / fulfillment provider to the company.
     */
    public function storeEmployee(StoreEmployeeRequest $request): JsonResponse
    {
        $user = $request->user();
        $company = $user->company ?? $user->employer;

        if (! $company) {
            return response()->json([
                'message' => __('Only company accounts can add company employees.'),
            ], 403);
        }

        $employeeProvider = DB::transaction(function () use ($request, $company) {
            // 1. Create User associated with company
            $newUser = User::create([
                'company_id' => $company->id,
                'role' => 'provider',
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            $newUser->assignRole('provider');

            // 2. Create Provider record linked to company
            $newProvider = Provider::create([
                'user_id' => $newUser->id,
                'company_id' => $company->id,
                'provider_type' => 'company',
                'approval_status' => 'approved',
                'availability' => 'available',
            ]);

            // 3. Attach services
            if ($request->has('services') && is_array($request->services)) {
                $newProvider->serviceCategories()->sync($request->services);
            }

            return $newProvider;
        });

        $employeeProvider->load(['user', 'serviceCategories', 'company']);

        return (new ProviderProfileResource($employeeProvider))
            ->response()
            ->setStatusCode(201);
    }
}
