<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Customer::with('user');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->whereHas('user', function ($q) use ($status) {
                $q->where('status', strtolower($status));
            });
        }

        $customers = $query->latest()->paginate(10)->withQueryString();

        $stats = [
            'total' => User::where('role', 'customer')->count(),
            'active' => User::where('role', 'customer')->where('status', 'active')->count(),
            'inactive' => User::where('role', 'customer')->where('status', 'inactive')->count(),
            'new' => User::where('role', 'customer')->where('created_at', '>=', now()->startOfMonth())->count(),
            'banned' => User::where('role', 'customer')->where('status', 'banned')->count(),
        ];

        return Inertia::render('Admin/Customer/Index', [
            'dbCustomers' => $customers,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(int $customer): Response
    {
        return Inertia::render('Admin/Customer/Show', compact('customer'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|string|in:active,inactive,suspended,banned',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('Password@123'),
                'role' => 'customer',
                'status' => $validated['status'],
            ]);

            Customer::create([
                'user_id' => $user->id,
            ]);
        });

        return redirect()->back()->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$customer->user_id,
            'phone' => 'nullable|string|max:50',
            'status' => 'required|string|in:active,inactive,suspended,banned',
        ]);

        if ($customer->user) {
            $customer->user->update([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'status' => $validated['status'],
            ]);
        }

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        DB::transaction(function () use ($customer) {
            $user = $customer->user;
            $customer->delete();
            if ($user) {
                $user->delete();
            }
        });

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }
}
