<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Company\UpdateCompanyProfileRequest;
use App\Http\Resources\Company\CompanyProfileResource;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    public function update(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'companyName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'registrationNumber' => 'nullable|string|max:100',
            'website' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postalCode' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'avatarUrl' => 'nullable|string',
        ]);

        $user = $request->user();
        if ($user) {
            $user->update([
                'name' => $validated['companyName'],
                'email' => $validated['email'],
                'full_name' => $validated['companyName'],
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Company profile updated successfully.'),
                'data' => $validated,
            ]);
        }

        return redirect()->back()->with('success', __('Company profile updated successfully.'));
    }

    public function updatePassword(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\\\|,.<>\/?]/',
                'confirmed',
            ],
        ]);

        $user = $request->user();

        if (! $user || ! Hash::check($request->current_password, $user->password)) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => __('The provided current password does not match our records.'),
                    'errors' => [
                        'current_password' => [__('The provided current password does not match our records.')],
                    ],
                ], 422);
            }

            return redirect()->back()->withErrors([
                'current_password' => __('The provided current password does not match our records.'),
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Password updated successfully.'),
            ]);
        }

        return redirect()->back()->with('success', __('Password updated successfully.'));
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('company-logos', 'public');
            $url = asset('storage/'.$path);

            return response()->json([
                'success' => true,
                'message' => __('Company logo uploaded successfully.'),
                'url' => $url,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => __('No image file provided.'),
        ], 422);
    }
}
