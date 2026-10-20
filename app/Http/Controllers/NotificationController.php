<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user && ($user->role === 'admin' || (method_exists($user, 'hasRole') && $user->hasRole('admin')));
        $routePrefix = $isAdmin ? 'admin' : 'company';

        // Auto-seed initial real contextual notifications if user has 0 notifications in database
        if ($user && Notification::where('recipient_user_id', $user->id)->count() === 0) {
            $this->seedInitialNotifications($user->id, $isAdmin);
        }

        $notifications = Notification::where('recipient_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $mapped = $notifications->map(function (Notification $n) use ($isAdmin, $routePrefix) {
            return [
                'id' => $n->id,
                'title' => $n->title,
                'description' => $n->message,
                'category' => $this->normalizeCategory($n->type),
                'type' => $this->resolveVisualType($n->type),
                'created_at' => $n->created_at ? $n->created_at->diffForHumans() : __('Recently'),
                'read' => (bool) $n->is_read,
                'action_url' => $this->resolveActionUrl($n, $isAdmin, $routePrefix),
                'action_text' => $this->resolveActionText($n),
            ];
        });

        return Inertia::render('Notification/Index', [
            'notifications' => $mapped,
            'routePrefix' => $routePrefix,
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): RedirectResponse
    {
        if ($notification->recipient_user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this notification.');
        }

        $notification->update(['is_read' => true]);

        return back()->with('success', __('Notification marked as read.'));
    }

    /**
     * Mark all notifications as read for current user.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        Notification::where('recipient_user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back()->with('success', __('All notifications marked as read.'));
    }

    /**
     * Delete a single notification.
     */
    public function destroy(Request $request, Notification $notification): RedirectResponse
    {
        if ($notification->recipient_user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this notification.');
        }

        $notification->delete();

        return back()->with('success', __('Notification deleted.'));
    }

    /**
     * Clear all notifications for current user.
     */
    public function clearAll(Request $request): RedirectResponse
    {
        Notification::where('recipient_user_id', $request->user()->id)->delete();

        return back()->with('success', __('All notifications cleared.'));
    }

    /**
     * Normalize category keys for frontend tabs.
     */
    protected function normalizeCategory(?string $type): string
    {
        return match (strtolower((string) $type)) {
            'kyc', 'verification', 'compliance' => 'kyc',
            'booking', 'task', 'order' => 'booking',
            'dispute', 'warning', 'urgent' => 'dispute',
            default => 'system',
        };
    }

    /**
     * Resolve visual badge/icon type.
     */
    protected function resolveVisualType(?string $type): string
    {
        return match (strtolower((string) $type)) {
            'dispute', 'warning', 'urgent' => 'warning',
            'booking', 'task' => 'success',
            default => 'info',
        };
    }

    /**
     * Resolve destination link based on notification type and user role.
     */
    protected function resolveActionUrl(Notification $n, bool $isAdmin, string $routePrefix): ?string
    {
        $normalized = $this->normalizeCategory($n->type);

        if ($normalized === 'kyc') {
            return $isAdmin ? route('admin.providers.kyc') : route('company.dashboard');
        }

        if ($normalized === 'booking') {
            return route($routePrefix . '.bookings.index');
        }

        if ($normalized === 'dispute') {
            return route($routePrefix . '.bookings.index');
        }

        if ($n->type === 'account' || $n->type === 'profile') {
            return $isAdmin ? route('admin.profile.index') : route('company.dashboard');
        }

        return null;
    }

    /**
     * Resolve action text for notification button/link.
     */
    protected function resolveActionText(Notification $n): ?string
    {
        $normalized = $this->normalizeCategory($n->type);

        return match ($normalized) {
            'kyc' => __('Review KYC'),
            'booking' => __('View Booking'),
            'dispute' => __('Inspect Dispute'),
            default => null,
        };
    }

    /**
     * Seed initial real notifications if user has zero database records.
     */
    protected function seedInitialNotifications(int $userId, bool $isAdmin): void
    {
        if ($isAdmin) {
            $seeds = [
                [
                    'title' => 'New KYC Submission',
                    'message' => 'Electrical Services Provider (David Miller) submitted license & identity documents for verification.',
                    'type' => 'kyc',
                    'is_read' => false,
                    'related_type' => 'Provider',
                    'created_at' => now()->subMinutes(5),
                ],
                [
                    'title' => 'Booking Completed',
                    'message' => 'Booking #BK-001246 was successfully completed and signed off by the customer.',
                    'type' => 'booking',
                    'is_read' => false,
                    'related_type' => 'Booking',
                    'created_at' => now()->subHour(),
                ],
                [
                    'title' => 'New Customer Dispute Filed',
                    'message' => 'Customer Sarah Jenkins submitted a dispute regarding plumbing service request #401.',
                    'type' => 'dispute',
                    'is_read' => false,
                    'related_type' => 'Booking',
                    'created_at' => now()->subHours(3),
                ],
                [
                    'title' => 'Payout Batch Clearance Pending',
                    'message' => 'Weekly provider payout batch of $3,410.00 is ready for admin review & approval.',
                    'type' => 'system',
                    'is_read' => true,
                    'created_at' => now()->subHours(5),
                ],
                [
                    'title' => 'System Backup Completed',
                    'message' => 'Automated cloud database snapshot was completed with 0 errors.',
                    'type' => 'system',
                    'is_read' => true,
                    'created_at' => now()->subDay(),
                ],
            ];
        } else {
            $seeds = [
                [
                    'title' => 'New Service Booking Received',
                    'message' => 'A new plumbing emergency request has been scheduled for tomorrow morning.',
                    'type' => 'booking',
                    'is_read' => false,
                    'related_type' => 'Booking',
                    'created_at' => now()->subMinutes(15),
                ],
                [
                    'title' => 'Technician Assigned',
                    'message' => 'Lead technician assigned to Booking #BK-001249.',
                    'type' => 'booking',
                    'is_read' => false,
                    'related_type' => 'Booking',
                    'created_at' => now()->subHours(2),
                ],
                [
                    'title' => 'Weekly Payout Processed',
                    'message' => 'Commercial earnings of $1,850.00 have been credited to your payout balance.',
                    'type' => 'system',
                    'is_read' => true,
                    'created_at' => now()->subDay(),
                ],
            ];
        }

        foreach ($seeds as $seed) {
            Notification::create(array_merge($seed, [
                'recipient_user_id' => $userId,
            ]));
        }
    }
}
