<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectKycRequest;
use App\Http\Resources\Admin\KycVerificationResource;
use App\Models\AuditLog;
use App\Models\KycVerification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $type = $request->input('type');

        $query = KycVerification::with(['provider.user', 'provider.company', 'reviewer']);

        if ($search) {
            $query->whereHas('provider.user', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', strtoupper($status));
        }

        if ($type && $type !== 'all') {
            $query->where('verification_type', strtoupper($type));
        }

        $verifications = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Provider/Kyc', [
            'verifications' => KycVerificationResource::collection($verifications),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'type' => $type ?? 'all',
            ],
        ]);
    }

    public function show(KycVerification $kycVerification): Response
    {
        $verification = KycVerification::with(['provider.user', 'provider.company', 'reviewer'])->findOrFail($kycVerification->id);

        return Inertia::render('Admin/Provider/KycShow', [
            'verification' => new KycVerificationResource($verification),
        ]);
    }

    public function approve(KycVerification $kycVerification): RedirectResponse
    {
        $kycVerification->update([
            'status' => 'APPROVED',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        if ($kycVerification->provider) {
            $kycVerification->provider->update(['approval_status' => 'approved']);
        }

        AuditLog::log(
            auth()->id(),
            'Provider approved',
            'KycVerification',
            $kycVerification->id,
            "Approved KYC/KYB for provider #{$kycVerification->provider_id}"
        );

        return redirect()->back()->with('success', __('Verification approved successfully.'));
    }

    public function reject(RejectKycRequest $request, KycVerification $kycVerification): RedirectResponse
    {
        $validated = $request->validated();

        $kycVerification->update([
            'status' => 'REJECTED',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'rejection_reason' => $validated['reason'],
        ]);

        if ($kycVerification->provider) {
            $kycVerification->provider->update(['approval_status' => 'rejected']);
        }

        AuditLog::log(
            auth()->id(),
            'Provider rejected',
            'KycVerification',
            $kycVerification->id,
            "Rejected KYC/KYB for provider #{$kycVerification->provider_id}. Reason: {$validated['reason']}"
        );

        return redirect()->back()->with('success', __('Verification rejected.'));
    }
}
