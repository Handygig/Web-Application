<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreEmployeeRequest;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Company\CompanyEmployeeResource;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $companyId = $user && $user->company ? $user->company->id : null;

        $employees = Provider::with(['user', 'serviceCategories'])
            ->when($companyId, fn ($q) => $q->where('company_id', $companyId))
            ->whereHas('user', fn ($q) => $q->where('status', '!=', 'inactive'))
            ->get();

        return Inertia::render('Company/Employee/Index', [
            'technicians' => $employees,
        ]);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();
        $user = auth()->user();

        if ($user && $user->company) {
            $validated['company_id'] = $user->company->id;
        }

        $employee = Provider::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Employee registered successfully.'),
                'data' => $employee,
            ], 201);
        }

        return redirect()->back()->with('success', __('Employee registered successfully.'));
    }

    public function destroy(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $employee = Provider::with('user')->find($id);

        if ($employee) {
            if ($employee->user) {
                $employee->user->update(['status' => 'inactive']);
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Employee removed successfully.'),
            ]);
        }

        return redirect()->back()->with('success', __('Employee removed successfully.'));
    }
}
