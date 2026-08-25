<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\AuditLog;
use App\Models\BannedAccount;
use App\Models\Customer;
use App\Models\JobRequest;
use App\Models\JobType;
use App\Models\KycVerification;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Provider;
use App\Models\Review;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        $providerRole = Role::firstOrCreate(['name' => 'provider', 'guard_name' => 'web']);
        $companyRole = Role::firstOrCreate(['name' => 'company', 'guard_name' => 'web']);

        // 2. Admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'full_name' => 'System Admin',
                'phone' => '+15550000000',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $adminUser->assignRole('admin');
        Admin::firstOrCreate(['user_id' => $adminUser->id], [
            'address' => '123 Admin Way',
            'city' => 'Metro',
            'province' => 'Central',
            'postal_code' => '10001',
            'country' => 'United States',
        ]);

        // 3. Property Types
        $propResidential = PropertyType::firstOrCreate(['name' => 'Residential Apartment'], ['description' => 'Standard residential apartment units', 'status' => 'ACTIVE']);
        $propCommercial = PropertyType::firstOrCreate(['name' => 'Commercial Office'], ['description' => 'Commercial office spaces', 'status' => 'ACTIVE']);
        PropertyType::firstOrCreate(['name' => 'Industrial Warehouse'], ['description' => 'Storage and logistics facilities', 'status' => 'ACTIVE']);

        // 4. Job Types
        JobType::firstOrCreate(['name' => 'Plumbing Repair'], ['description' => 'Pipe repair and fixture replacement', 'status' => 'ACTIVE']);
        JobType::firstOrCreate(['name' => 'Electrical Inspection'], ['description' => 'Wiring safety check and setup', 'status' => 'ACTIVE']);
        JobType::firstOrCreate(['name' => 'HVAC Maintenance'], ['description' => 'AC unit servicing and duct cleaning', 'status' => 'ACTIVE']);

        // 5. Service Categories
        $plumbingCat = ServiceCategory::firstOrCreate(['service_name' => 'Plumbing'], ['is_active' => true]);
        $electricalCat = ServiceCategory::firstOrCreate(['service_name' => 'Electrical'], ['is_active' => true]);

        // 6. Seed 10 Customers
        $customersList = [];
        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "customer{$i}@example.com"],
                [
                    'full_name' => "Customer User {$i}",
                    'phone' => "+1555100000{$i}",
                    'password' => Hash::make('password'),
                    'role' => 'customer',
                    'status' => $i === 9 ? 'suspended' : ($i === 10 ? 'banned' : 'active'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('customer');
            $customerObj = Customer::firstOrCreate(['user_id' => $user->id]);
            $customersList[] = $customerObj;

            if ($i === 10) {
                BannedAccount::create([
                    'user_id' => $user->id,
                    'account_type' => 'CUSTOMER',
                    'ban_type' => 'PERMANENT',
                    'reason' => 'Violation of terms of service',
                    'banned_by' => $adminUser->id,
                    'banned_at' => now()->subDays(2),
                    'status' => 'ACTIVE',
                ]);
            }
        }

        // 7. Seed 24 Providers
        $providersList = [];
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
                'approval_status' => $i <= 20 ? 'approved' : ($i == 21 ? 'pending' : 'rejected'),
            ]);
            $providerObj->serviceCategories()->sync([$i % 2 === 0 ? $plumbingCat->id : $electricalCat->id]);
            $providersList[] = $providerObj;

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
                    'reviewed_by' => $i === 22 ? $adminUser->id : null,
                    'rejection_reason' => $i === 22 ? 'Document expired or illegible photo ID' : null,
                ]);
            }
        }

        // 8. Properties & Job Requests (Bookings)
        $prop = Property::firstOrCreate([
            'customer_id' => $customersList[0]->id,
            'label' => 'Main Residence',
        ], [
            'property_type_id' => $propResidential->id,
            'address_line' => '456 Elm St',
            'city' => 'Metropolis',
        ]);

        for ($b = 1; $b <= 15; $b++) {
            $statusStr = match ($b % 4) {
                0 => 'pending',
                1 => 'confirmed',
                2 => 'in_progress',
                3 => 'completed',
            };

            JobRequest::create([
                'customer_id' => $customersList[$b % count($customersList)]->id,
                'property_id' => $prop->id,
                'service_category_id' => $plumbingCat->id,
                'title' => "Booking Request #{$b}",
                'description' => "Service maintenance request #{$b}",
                'budget' => 150.00 * $b,
                'status' => $statusStr,
                'preferred_date' => now()->addDays($b),
            ]);
        }

        // 9. Payments & Payouts
        Payment::create([
            'customer_id' => $customersList[0]->id,
            'provider_id' => $providersList[0]->id,
            'amount' => 48250.00,
            'platform_fee' => 7237.50,
            'provider_amount' => 41012.50,
            'payment_method' => 'card',
            'payment_status' => 'completed',
        ]);

        Payout::create([
            'provider_id' => $providersList[0]->id,
            'amount' => 3410.00,
            'status' => 'pending',
        ]);

        // 10. Reviews
        Review::create([
            'customer_id' => $customersList[0]->id,
            'provider_id' => $providersList[0]->id,
            'rating' => 5,
            'comment' => 'Outstanding work and very quick completion!',
        ]);

        // 11. Initial Audit Log
        AuditLog::log($adminUser->id, 'System seeded', 'System', 1, 'Development seed data created');
    }
}
