<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProviderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $category = $request->input('category');
        $location = $request->input('location');

        $query = Provider::with(['user', 'serviceCategories', 'company']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                })
                    ->orWhereHas('serviceCategories', function ($sq) use ($search) {
                        $sq->where('service_name', 'like', "%{$search}%");
                    })
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhere('provider_type', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->whereHas('user', function ($uq) use ($status) {
                $uq->where('status', strtolower($status));
            });
        }

        if ($category && $category !== 'all') {
            $query->whereHas('serviceCategories', function ($sq) use ($category) {
                $sq->where('service_name', $category);
            });
        }

        $providers = $query->latest()->paginate(10)->withQueryString();

        $categories = ServiceCategory::where('is_active', true)->pluck('service_name')->toArray();

        return Inertia::render('Admin/Provider/Index', [
            'providers' => $providers,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'category' => $category ?? 'all',
                'location' => $location ?? 'all',
            ],
        ]);
    }

    public function kyc(Request $request): Response
    {
        $providers = Provider::with(['user', 'serviceCategories', 'company'])->latest()->get();

        return Inertia::render('Admin/Provider/Kyc', [
            'dbProviders' => $providers,
        ]);
    }

    public function banned(Request $request): Response
    {
        $bannedUsers = User::where('status', 'banned')->latest()->get();

        return Inertia::render('Admin/Provider/Banned', [
            'bannedUsers' => $bannedUsers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'service_category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('Password@123'),
                'role' => 'provider',
                'status' => $validated['status'],
            ]);

            $provider = Provider::create([
                'user_id' => $user->id,
                'provider_type' => 'individual',
                'bio' => $validated['bio'] ?? null,
                'approval_status' => 'approved',
            ]);

            if (! empty($validated['service_category'])) {
                $category = ServiceCategory::firstOrCreate(
                    ['service_name' => $validated['service_category']],
                    ['is_active' => true]
                );
                $provider->serviceCategories()->sync([$category->id]);
            }
        });

        return redirect()->back()->with('success', 'Provider created successfully.');
    }

    public function update(Request $request, Provider $provider): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$provider->user_id,
            'phone' => 'nullable|string|max:50',
            'service_category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        DB::transaction(function () use ($provider, $validated) {
            $provider->user->update([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'status' => $validated['status'],
            ]);

            $provider->update([
                'bio' => $validated['bio'] ?? $provider->bio,
            ]);

            if (! empty($validated['service_category'])) {
                $category = ServiceCategory::firstOrCreate(
                    ['service_name' => $validated['service_category']],
                    ['is_active' => true]
                );
                $provider->serviceCategories()->sync([$category->id]);
            }
        });

        return redirect()->back()->with('success', 'Provider updated successfully.');
    }

    public function destroy(Provider $provider): RedirectResponse
    {
        try {
            DB::transaction(function () use ($provider) {
                if (method_exists($provider, 'serviceCategories')) {
                    $provider->serviceCategories()->detach();
                }

                $user = $provider->user;

                // Delete child relationships to avoid foreign key violations
                DB::table('provider_services')->where('provider_id', $provider->id)->delete();
                DB::table('job_assignments')->where('provider_id', $provider->id)->delete();
                DB::table('quotations')->where('provider_id', $provider->id)->delete();
                DB::table('payout_accounts')->where('provider_id', $provider->id)->delete();
                DB::table('payouts')->where('provider_id', $provider->id)->delete();
                DB::table('kyc_verifications')->where('provider_id', $provider->id)->delete();
                DB::table('reviews')->where('provider_id', $provider->id)->delete();
                DB::table('disputes')->where('provider_id', $provider->id)->delete();
                DB::table('payments')->where('provider_id', $provider->id)->delete();

                if ($user) {
                    DB::table('banned_accounts')->where('user_id', $user->id)->delete();
                    DB::table('audit_logs')->where('user_id', $user->id)->delete();
                }

                $provider->delete();
                if ($user) {
                    $user->delete();
                }
            });

            return redirect()->route('admin.providers.index')->with('success', 'Provider deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.providers.index')->with('error', 'Unable to delete provider: '.$e->getMessage());
        }
    }

    public function toggleActive(Provider $provider): RedirectResponse
    {
        if ($provider->user) {
            $newStatus = $provider->user->status === 'active' ? 'inactive' : 'active';
            $provider->user->update(['status' => $newStatus]);
        }

        return redirect()->back()->with('success', 'Provider status updated.');
    }
}
