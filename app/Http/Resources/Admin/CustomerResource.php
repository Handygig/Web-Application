<?php

namespace App\Http\Resources\Admin;

use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : $this->user;
        $statusVal = $user->status ?? 'active';
        $createdAt = $user?->created_at ?? $this->created_at;

        $properties = $this->relationLoaded('properties') ? $this->properties : $this->properties;
        $property = $properties->firstWhere('is_default', true) ?? $properties->first();

        $jobRequests = $this->relationLoaded('jobRequests') ? $this->jobRequests : $this->jobRequests()->latest()->get();
        $payments = $this->relationLoaded('payments') ? $this->payments : $this->payments;
        $auditLogs = $this->getAuditLogs($user);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'customerId' => 'CUST-' . (1000 + $this->id),
            'full_name' => $user->full_name ?? '—',
            'email' => $user->email ?? '—',
            'phone' => $user->phone ?? '—',
            'status' => ucfirst(strtolower($statusVal)),
            'customerType' => $this->membership_tier ?? 'Individual',
            'address' => $property?->address_line ?? '—',
            'city' => $property?->city ?? '—',
            'country' => $property ? 'Sri Lanka' : '—',
            'accountAge' => $this->formatAccountAge($createdAt),
            'joined' => $createdAt ? Carbon::parse($createdAt)->format('M d, Y') : '—',
            'lastActive' => $this->formatHumanTime($auditLogs->first()?->created_at ?? $user?->updated_at ?? $this->updated_at),
            'ordersCount' => $jobRequests->count(),
            'totalSpent' => $this->calculateTotalSpent($jobRequests, $payments),
            'completedOrders' => $jobRequests->where('status', 'completed')->count(),
            'orders' => $this->formatOrders($jobRequests),
            'activityLogs' => $this->formatActivityLogs($auditLogs),
            'accountHistory' => $this->formatAccountHistory($auditLogs, $user),
            'user_data' => new UserResource($this->whenLoaded('user')),
            'properties' => $this->whenLoaded('properties'),
            'jobRequests' => $this->whenLoaded('jobRequests'),
            'created_at' => $this->created_at,
        ];
    }

    private function getAuditLogs($user)
    {
        if ($this->relationLoaded('customAuditLogs')) {
            return $this->customAuditLogs;
        }

        return AuditLog::with('admin')
            ->where(function ($q) use ($user) {
                $q->where(fn($sq) => $sq->where('entity_type', 'Customer')->where('entity_id', $this->id));
                if ($user?->id) {
                    $q->orWhere(fn($sq) => $sq->where('entity_type', 'User')->where('entity_id', $user->id));
                }
            })
            ->latest()
            ->get();
    }

    private function formatAccountAge(?Carbon $createdAt): string
    {
        if (! $createdAt) return '—';

        $diffDays = (int) $createdAt->diffInDays(now());
        if ($diffDays < 1) return 'Today';
        if ($diffDays < 30) return $diffDays . ' ' . Str::plural('day', $diffDays);
        if ($diffDays < 365) return max(1, (int) $createdAt->diffInMonths(now())) . ' ' . Str::plural('mo', (int) $createdAt->diffInMonths(now()));

        return round($diffDays / 365.25, 1) . ' yrs';
    }

    private function calculateTotalSpent($jobRequests, $payments): string
    {
        $paid = (float) ($payments ? $payments->where('payment_status', 'completed')->sum('amount') : 0);
        $assigned = (float) $jobRequests->where('status', 'completed')->sum(fn($j) => $j->assignment?->total_effective_price ?? 0);

        return number_format(max($paid, $assigned), 2);
    }

    private function formatOrders($jobRequests): array
    {
        return $jobRequests->map(function ($job) {
            $assignment = $job->assignment;
            $quotation = $job->quotations?->firstWhere('status', 'accepted') ?? $job->quotations?->first();
            $provider = $assignment?->provider ?? $quotation?->provider;

            $providerName = $assignment?->company?->business_name
                ?? $quotation?->provider?->company?->business_name
                ?? $provider?->user?->full_name
                ?? 'Not Assigned';

            $amount = match (true) {
                ($assignment?->total_effective_price ?? 0) > 0 => '$' . number_format($assignment->total_effective_price, 2),
                ((float) ($quotation?->quoted_price ?? 0)) > 0 => '$' . number_format((float) $quotation->quoted_price, 2),
                ((float) ($job->budget ?? 0)) > 0 => '$' . number_format((float) $job->budget, 2),
                default => '—',
            };

            $date = ($job->preferred_date ?? $job->created_at);

            return [
                'id' => 'ORD-' . (1000 + $job->id),
                'date' => $date ? Carbon::parse($date)->format('M d, Y') : '—',
                'provider' => $providerName,
                'amount' => $amount,
                'status' => ucfirst(strtolower($job->status ?? 'Pending')),
            ];
        })->values()->all();
    }

    private function formatActivityLogs($auditLogs): array
    {
        return $auditLogs->map(fn($log) => [
            'id' => $log->id,
            'time' => $this->formatHumanTime($log->created_at),
            'title' => $log->description ?: $log->action,
            'action' => $log->action,
        ])->values()->all();
    }

    private function formatAccountHistory($auditLogs, $user): array
    {
        return $auditLogs->map(fn($log) => [
            'id' => $log->id,
            'date' => $log->created_at ? $log->created_at->format('M d, Y') : '—',
            'action' => $log->action,
            'description' => $log->description ?? '',
            'admin' => $log->admin_id && $log->admin_id !== $user?->id
                ? ($log->admin?->full_name ?? 'Admin')
                : ($log->action === 'Account Created' && ! $log->admin_id ? 'System' : '—'),
        ])->values()->all();
    }

    private function formatHumanTime(?Carbon $date): string
    {
        if (! $date) return '—';
        if ($date->isToday()) return 'Today, ' . $date->format('h:i A');
        if ($date->isYesterday()) return 'Yesterday, ' . $date->format('h:i A');
        return $date->format('M d, Y');
    }
}
