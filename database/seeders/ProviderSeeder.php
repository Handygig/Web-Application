<?php

namespace Database\Seeders;

use App\Models\KycVerification;
use App\Models\Provider;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::where('role', 'admin')->first();
        $plumbingCat = ServiceCategory::where('service_name', 'Plumbing')->first();
        $electricalCat = ServiceCategory::where('service_name', 'Electrical')->first();

        for ($i = 1; $i <= 24; $i++) {
            $user = User::firstOrCreate(
                ['email' => "provider{$i}@example.com"],
                [
                    'full_name' => "Provider Technician {$i}",
                    'phone' => "+1555200000{$i}",
                    'password' => Hash::make('password'),
                    'role' => 'provider',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('provider');

            $providerObj = Provider::firstOrCreate(['user_id' => $user->id], [
                'provider_type' => 'individual',
                'bio' => "Experienced handyman #{$i}",
                'approval_status' => $i <= 20 ? 'approved' : ($i === 21 ? 'pending' : 'rejected'),
            ]);

            if ($plumbingCat && $electricalCat) {
                $providerObj->serviceCategories()->sync([$i % 2 === 0 ? $plumbingCat->id : $electricalCat->id]);
            }

            if ($i >= 21) {
                KycVerification::create([
                    'provider_id' => $providerObj->id,
                    'verification_type' => $i === 21 ? 'KYC' : 'KYB',
                    'status' => $i === 21 ? 'PENDING' : 'REJECTED',
                    'documents' => [
                        [
                            'documentId' => "DOC-{$i}",
                            'documentName' => 'Government ID / License',
                            'documentType' => 'ID_CARD',
                            'fileName' => "id_card_{$i}.pdf",
                            'fileUrl' => "/storage/docs/id_card_{$i}.pdf",
                            'fileType' => 'application/pdf',
                            'fileSize' => 102400,
                            'uploadedAt' => now()->toDateTimeString(),
                            'status' => 'SUBMITTED',
                        ],
                    ],
                    'submitted_at' => now()->subDays(3),
                    'reviewed_at' => $i === 22 ? now()->subDay() : null,
                    'reviewed_by' => ($i === 22 && $adminUser) ? $adminUser->id : null,
                    'rejection_reason' => $i === 22 ? 'Document expired or illegible photo ID' : null,
                ]);
            }
        }
    }
}
