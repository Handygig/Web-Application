<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreEmployeeRequest;
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
        $query = Provider::with('user');

        if ($user && $user->company) {
            $query->where('company_id', $user->company->id);
        }

        $employees = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Company/Employee/Index', [
            'employees' => CompanyEmployeeResource::collection($employees),
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $company = auth()->user()->company;

        DB::transaction(function () use ($validated, $company) {
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('Password@123'),
                'role' => 'provider',
                'status' => $validated['status'],
            ]);

            $user->assignRole('provider');

            Provider::create([
                'user_id' => $user->id,
                'company_id' => $company?->id,
                'provider_type' => 'employee',
                'approval_status' => 'approved',
            ]);
        });

        return redirect()->back()->with('success', __('Employee added successfully.'));
    }
}
