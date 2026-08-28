<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BannedAccountResource;
use App\Models\AuditLog;
use App\Models\BannedAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannedAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $accountType = $request->input('accountType');
        $banType = $request->input('banType');

        $query = BannedAccount::with(['user', 'banner', 'unbanner']);

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($accountType && $accountType !== 'all') {
            $query->where('account_type', strtoupper($accountType));
        }

        if ($banType && $banType !== 'all') {
            $query->where('ban_type', strtoupper($banType));
        }

        $bannedAccounts = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Provider/Banned', [
            'bannedAccounts' => BannedAccountResource::collection($bannedAccounts),
            'filters' => [
                'search' => $search ?? '',
                'accountType' => $accountType ?? 'all',
                'banType' => $banType ?? 'all',
            ],
        ]);
    }

    public function show(BannedAccount $bannedAccount): Response
    {
        $ban = BannedAccount::with('user')->findOrFail($bannedAccount->id);

        return Inertia::render('Admin/Provider/BannedShow', [
            'ban' => new BannedAccountResource($ban),
        ]);
    }

    public function unban(BannedAccount $bannedAccount): RedirectResponse
    {
        $bannedAccount->update([
            'status' => 'UNBANNED',
            'unbanned_by' => auth()->id(),
            'unbanned_at' => now(),
        ]);

        if ($bannedAccount->user) {
            $bannedAccount->user->update(['status' => 'active']);
        }

        AuditLog::log(
            auth()->id(),
            'Customer unbanned',
            'BannedAccount',
            $bannedAccount->id,
            "Unbanned user #{$bannedAccount->user_id}"
        );

        return redirect()->back()->with('success', __('Account unbanned successfully.'));
    }
}
