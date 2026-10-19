<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Provider\ProviderNotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications for the provider.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Auto-seed welcoming notifications if provider has 0 notifications
        if (Notification::where('recipient_user_id', $userId)->count() === 0) {
            $this->seedInitialProviderNotifications($userId);
        }

        $query = Notification::where('recipient_user_id', $userId);

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $categoryType = match ($request->category) {
                'Job Inquiries' => ['job_request', 'job'],
                'Quotations' => ['quotation'],
                'Finance & Wallet' => ['wallet', 'payout', 'payment'],
                'Ratings & Reviews' => ['review'],
                'Security & Compliance' => ['system', 'verification', 'compliance'],
                default => null,
            };

            if ($categoryType) {
                $query->whereIn('type', $categoryType);
            }
        }

        if ($request->boolean('unread_only')) {
            $query->where('is_read', false);
        }

        $notifications = $query->latest()->get();
        $unreadCount = Notification::where('recipient_user_id', $userId)->where('is_read', false)->count();

        return response()->json([
            'status' => 'success',
            'unread_count' => $unreadCount,
            'data' => ProviderNotificationResource::collection($notifications),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->recipient_user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => __('Unauthorized access to this notification.'),
            ], 403);
        }

        $notification->update(['is_read' => true]);

        $unreadCount = Notification::where('recipient_user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'status' => 'success',
            'message' => __('Notification marked as read.'),
            'unread_count' => $unreadCount,
            'notification' => new ProviderNotificationResource($notification),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('recipient_user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => __('All notifications marked as read.'),
            'unread_count' => 0,
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->recipient_user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => __('Unauthorized access to this notification.'),
            ], 403);
        }

        $notification->delete();

        return response()->json([
            'status' => 'success',
            'message' => __('Notification deleted successfully.'),
        ]);
    }

    protected function seedInitialProviderNotifications(int $userId): void
    {
        $seeds = [
            [
                'title' => 'Welcome to Provider Network',
                'message' => 'Your account is active. Complete your verification documents to receive nearby service requests.',
                'type' => 'compliance',
                'is_read' => false,
            ],
            [
                'title' => 'Set Up Payout Account',
                'message' => 'Link your commercial bank account under Wallet to receive weekly direct deposit payouts.',
                'type' => 'wallet',
                'is_read' => false,
            ],
        ];

        foreach ($seeds as $seed) {
            Notification::create(array_merge($seed, [
                'recipient_user_id' => $userId,
            ]));
        }
    }
}
