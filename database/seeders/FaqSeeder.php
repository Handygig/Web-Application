<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'How do I book a home maintenance service?',
                'answer' => 'Navigate to the Home or Search tab, select your required service (e.g. Plumbing, AC Repair), pick a convenient date & time slot, choose your property, and confirm payment.',
                'category' => 'Booking',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Can I cancel or reschedule my booking?',
                'answer' => 'Yes! Go to the Jobs tab, select your upcoming booking, and tap "Reschedule" or "Cancel Booking". Cancellations made 2 hours prior are 100% free of charge.',
                'category' => 'Booking',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'What if the technician doesn\'t arrive on time?',
                'answer' => 'All service providers are GPS tracked in real-time. If there is a delay over 15 minutes, our 24/7 support team automatically reaches out and provides a $10 service credit voucher.',
                'category' => 'Service & Safety',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Are service technicians verified and insured?',
                'answer' => 'Absolutely. Every professional undergoes background screening, identity verification, and carries comprehensive service liability coverage.',
                'category' => 'Safety & Verification',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'How do payments and service guarantees work?',
                'answer' => 'Payments are processed securely via encrypted card transactions or wallet balance. We hold funds in escrow until the service is completed to your satisfaction, backed by our 100% Happiness Guarantee.',
                'category' => 'Payments',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'question' => 'Can I request emergency or same-day repairs?',
                'answer' => 'Yes, our 24/7 emergency dispatch line is available for urgent electrical, plumbing, or lockouts. Dispatch times average between 30 to 45 minutes.',
                'category' => 'Emergency',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $data) {
            Faq::updateOrCreate(
                ['question' => $data['question']],
                $data
            );
        }
    }
}
