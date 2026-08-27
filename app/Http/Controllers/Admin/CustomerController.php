<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BanCustomerRequest;
use App\Http\Requests\Admin\StoreCustomerRequest;
use App\Http\Requests\Admin\UpdateCustomerRequest;
use App\Http\Resources\Admin\CustomerResource;
use App\Models\AuditLog;
use App\Models\BannedAccount;
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
            'suspended' => User::where('role', 'customer')->where('status', 'suspended')->count(),
            'new' => User::where('role', 'customer')->where('created_at', '>=', now()->startOfMonth())->count(),
            'banned' => User::where('role', 'customer')->where('status', 'banned')->count(),
        ];

        return Inertia::render('Admin/Customer/Index', [
            'dbCustomers' => CustomerResource::collection($customers),
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function show(Customer $customer): Response
    {
        $customerModel = Customer::with(['user', 'properties', 'jobRequests'])->findOrFail($customer->id);

        return Inertia::render('Admin/Customer/Show', [
            'customer' => new CustomerResource($customerModel),
        ]);
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

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

            AuditLog::log(
                auth()->id(),
                'Customer created',
                'Customer',
                $user->id,
                "Created customer: {$user->full_name}"
            );
        });

        return redirect()->back()->with('success', __('Customer created successfully.'));
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validated();

        if ($customer->user) {
            $customer->user->update([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'status' => $validated['status'],
            ]);
        }

        AuditLog::log(
            auth()->id(),
            'Customer updated',
            'Customer',
            $customer->id,
            "Updated customer: {$customer->user->full_name}"
        );

        return redirect()->back()->with('success', __('Customer updated successfully.'));
    }

    public function suspend(Customer $customer): RedirectResponse
    {
        if ($customer->user) {
            $customer->user->update(['status' => 'suspended']);
            AuditLog::log(
                auth()->id(),
                'Customer suspended',
                'Customer',
                $customer->id,
                "Suspended customer #{$customer->id}"
            );
        }

        return redirect()->back()->with('success', __('Customer suspended successfully.'));
    }

    public function activate(Customer $customer): RedirectResponse
    {
        if ($customer->user) {
            $customer->user->update(['status' => 'active']);
            AuditLog::log(
                auth()->id(),
                'Customer activated',
                'Customer',
                $customer->id,
                "Activated customer #{$customer->id}"
            );
        }

        return redirect()->back()->with('success', __('Customer activated successfully.'));
    }

    public function ban(BanCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validated();

        if ($customer->user) {
            $customer->user->update(['status' => 'banned']);

            BannedAccount::create([
                'user_id' => $customer->user_id,
                'account_type' => 'CUSTOMER',
                'ban_type' => $validated['ban_type'] ?? 'PERMANENT',
                'reason' => $validated['reason'],
                'banned_by' => auth()->id(),
                'banned_at' => now(),
                'status' => 'ACTIVE',
            ]);

            AuditLog::log(
                auth()->id(),
                'Customer banned',
                'Customer',
                $customer->id,
                "Banned customer #{$customer->id}. Reason: {$validated['reason']}"
            );
        }

        return redirect()->back()->with('success', __('Customer banned successfully.'));
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        try {
            DB::transaction(function () use ($customer) {
                $user = $customer->user;

                // Delete child relationships to avoid foreign key violations
                DB::table('customer_cards')->where('customer_id', $customer->id)->delete();
                DB::table('disputes')->where('customer_id', $customer->id)->delete();
                DB::table('reviews')->where('customer_id', $customer->id)->delete();
                DB::table('payments')->where('customer_id', $customer->id)->delete();
                DB::table('job_requests')->where('customer_id', $customer->id)->delete();
                DB::table('properties')->where('customer_id', $customer->id)->delete();

                if ($user) {
                    DB::table('banned_accounts')->where('user_id', $user->id)->delete();
                    DB::table('audit_logs')->where('user_id', $user->id)->delete();
                }

                $customer->delete();
                if ($user) {
                    $user->delete();
                }
            });

            AuditLog::log(
                auth()->id(),
                'Customer deleted',
                'Customer',
                $customer->id,
                "Deleted customer #{$customer->id}"
            );

            return redirect()->route('admin.customers.index')->with('success', __('Customer deleted successfully.'));
        } catch (\Exception $e) {
            return redirect()->route('admin.customers.index')->with('error', __('Unable to delete customer: :message', ['message' => $e->getMessage()]));
        }
    }
}
