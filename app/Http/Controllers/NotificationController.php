<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = [
            [
                'id' => 1,
                'title' => 'New KYC Submission',
                'description' => 'Electrical Services Provider (David Miller) submitted license & identity documents for verification.',
                'category' => 'kyc',
                'type' => 'info',
                'created_at' => '5 minutes ago',
                'read' => false,
                'action_url' => route('admin.providers.kyc'),
                'action_text' => 'Review KYC',
            ],
            [
                'id' => 2,
                'title' => 'Booking Completed',
                'description' => 'Booking #BK-001246 was successfully completed and signed off by the customer.',
                'category' => 'booking',
                'type' => 'success',
                'created_at' => '1 hour ago',
                'read' => false,
                'action_url' => route('admin.bookings.index'),
                'action_text' => 'View Booking',
            ],
            [
                'id' => 3,
                'title' => 'New Customer Dispute Filed',
                'description' => 'Customer Sarah Jenkins submitted a dispute regarding plumbing service request #401.',
                'category' => 'dispute',
                'type' => 'warning',
                'created_at' => '3 hours ago',
                'read' => false,
                'action_url' => route('admin.bookings.index'),
                'action_text' => 'Inspect Dispute',
            ],
            [
                'id' => 4,
                'title' => 'Payout Batch Clearance Pending',
                'description' => 'Weekly provider payout batch of $3,410.00 is ready for admin review & approval.',
                'category' => 'system',
                'type' => 'primary',
                'created_at' => '5 hours ago',
                'read' => true,
                'action_url' => route('admin.dashboard'),
                'action_text' => 'Check Payouts',
            ],
            [
                'id' => 5,
                'title' => 'System Backup Completed',
                'description' => 'Automated cloud database snapshot was completed with 0 errors.',
                'category' => 'system',
                'type' => 'info',
                'created_at' => '1 day ago',
                'read' => true,
                'action_url' => null,
                'action_text' => null,
            ],
        ];

        return Inertia::render('Notification/Index', [
            'notifications' => $notifications,
        ]);
    }
}
