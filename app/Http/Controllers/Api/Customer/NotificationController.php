<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get user notifications with optional filter and auto-seeding if empty.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Auto-seed welcoming contextual notifications if the customer has 0 notifications
        if (Notification::where('recipient_user_id', $userId)->count() === 0) {
            $this->seedInitialCustomerNotifications($userId);
        }

        $query = Notification::where('recipient_user_id', $userId);

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->boolean('unread_only')) {
            $query->where('is_read', false);
        }

        $notifications = $query->orderBy('created_at', 'desc')->get();
        $unreadCount = Notification::where('recipient_user_id', $userId)->where('is_read', false)->count();

        return response()->json([
            'status' => 'success',
            'data' => $notifications,
            'unread_count' => $unreadCount,
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
                'message' => 'Unauthorized access to this notification.',
            ], 403);
        }

        $notification->update(['is_read' => true]);

        $unreadCount = Notification::where('recipient_user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read.',
            'data' => $notification,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark all notifications for the authenticated customer as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        Notification::where('recipient_user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications marked as read.',
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
                'message' => 'Unauthorized access to this notification.',
            ], 403);
        }

        $notification->delete();

        $unreadCount = Notification::where('recipient_user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification deleted successfully.',
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Helper to seed realistic initial notifications for a customer.
     */
    protected function seedInitialCustomerNotifications(int $userId): void
    {
        $samples = [
            [
                'recipient_user_id' => $userId,
                'title' => 'Welcome to HandyGig! 👋',
                'message' => 'Your account is fully verified. Discover certified top professionals for all your home services.',
                'type' => 'system',
                'is_read' => false,
                'created_at' => now()->subMinutes(15),
                'updated_at' => now()->subMinutes(15),
            ],
            [
                'recipient_user_id' => $userId,
                'title' => 'Welcome Bonus Credited ⭐',
                'message' => 'You earned 200 HandyPoints welcome reward! Check your Rewards & Wallet to redeem.',
                'type' => 'reward',
                'is_read' => false,
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ],
            [
                'recipient_user_id' => $userId,
                'title' => 'Exclusive Discount Available 🏷️',
                'message' => 'Use code SECURE50 to get 50% OFF your next plumbing or HVAC safety check.',
                'type' => 'offer',
                'is_read' => false,
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ],
            [
                'recipient_user_id' => $userId,
                'title' => 'Primary Residence Configured 🏡',
                'message' => 'Your primary property address is ready for rapid one-tap service bookings.',
                'type' => 'account',
                'is_read' => true,
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
        ];

        Notification::insert($samples);
    }
}
