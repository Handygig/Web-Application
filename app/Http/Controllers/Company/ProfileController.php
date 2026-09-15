<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\UpdateCompanyProfileRequest;
use App\Http\Resources\Company\CompanyProfileResource;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user()->load('company');
        $company = $user->company ?? Company::firstOrCreate(
            ['user_id' => $user->id],
            ['company_name' => $user->full_name ?? 'Company Services LLC']
        );

        return Inertia::render('Company/Profile/Index', [
            'profile' => new CompanyProfileResource($company),
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = auth()->user();

        $user->update([
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        $company = Company::firstOrCreate(['user_id' => $user->id]);
        $company->update([
            'company_name' => $validated['company_name'],
            'registration_no' => $validated['registration_no'] ?? $company->registration_no,
            'address' => $validated['address'] ?? $company->address,
        ]);

        return redirect()->back()->with('success', __('Company profile updated successfully.'));
    }
}
