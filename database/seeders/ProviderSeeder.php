<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyServiceArea;
use App\Models\Customer;
use App\Models\KycVerification;
use App\Models\Provider;
use App\Models\Review;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::where('role', 'admin')->first();
        $customers = Customer::all();

        $providersData = [
            [
                'email' => 'provider1@example.com',
                'full_name' => 'Samantha Silva',
                'phone' => '+15552000001',
                'provider_type' => 'individual',
                'categories' => ['Plumbing'],
                'bio' => 'Licensed master plumber with 12+ years experience in leak detection, water heaters, and pipe re-routing.',
                'city' => 'Colombo',
                'address_line1' => '124 Galle Road, Kollupitiya',
                'address_line2' => 'Colombo 03',
                'state' => 'Western Province',
                'postal_code' => '00300',
                'country' => 'LK',
                'latitude' => 6.8986,
                'longitude' => 79.8542,
                'service_radius' => 35,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider2@example.com',
                'full_name' => 'Aruna Fernando',
                'phone' => '+15552000002',
                'provider_type' => 'individual',
                'categories' => ['Electrical'],
                'bio' => 'Certified electrician specializing in panel upgrades, smart lighting, fault finding, and residential rewiring.',
                'city' => 'Colombo',
                'address_line1' => '45 Horton Place, Cinnamon Gardens',
                'address_line2' => 'Colombo 07',
                'state' => 'Western Province',
                'postal_code' => '00700',
                'country' => 'LK',
                'latitude' => 6.9064,
                'longitude' => 79.8690,
                'service_radius' => 40,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider3@example.com',
                'full_name' => 'Niluka Perera',
                'phone' => '+15552000003',
                'provider_type' => 'individual',
                'categories' => ['Cleaning'],
                'bio' => 'Professional residential deep cleaner with 7 years of experience in sanitization, steam cleaning, and post-renovation detailing.',
                'city' => 'Rajagiriya',
                'address_line1' => '88 Kotte Road',
                'address_line2' => 'Suite B',
                'state' => 'Western Province',
                'postal_code' => '10107',
                'country' => 'LK',
                'latitude' => 6.9092,
                'longitude' => 79.8967,
                'service_radius' => 30,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider4@example.com',
                'full_name' => 'David Gunasekara',
                'phone' => '+15552000004',
                'provider_type' => 'individual',
                'categories' => ['Painting'],
                'bio' => 'Expert painter with a passion for precision interior cutting, weatherproof exterior painting, and drywall restoration.',
                'city' => 'Dehiwala',
                'address_line1' => '210 Hill Street',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10350',
                'country' => 'LK',
                'latitude' => 6.8511,
                'longitude' => 79.8659,
                'service_radius' => 30,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider5@example.com',
                'full_name' => 'Kamal Wickramasinghe',
                'phone' => '+15552000005',
                'provider_type' => 'individual',
                'categories' => ['Carpentry'],
                'bio' => 'Custom woodworking, door hanging, cabinet making, and timber deck repair craftsman with 15 years experience.',
                'city' => 'Battaramulla',
                'address_line1' => '15 Pannipitiya Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10120',
                'country' => 'LK',
                'latitude' => 6.8992,
                'longitude' => 79.9192,
                'service_radius' => 35,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider6@example.com',
                'full_name' => 'Roshan Jayasuriya',
                'phone' => '+15552000006',
                'provider_type' => 'individual',
                'categories' => ['HVAC'],
                'bio' => 'HVAC technician specialized in inverter AC servicing, gas charging, leak detection, and compressor repairs.',
                'city' => 'Nugegoda',
                'address_line1' => '78 High Level Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10250',
                'country' => 'LK',
                'latitude' => 6.8649,
                'longitude' => 79.8997,
                'service_radius' => 30,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider7@example.com',
                'full_name' => 'Priyanka Senanayake',
                'phone' => '+15552000007',
                'provider_type' => 'individual',
                'categories' => ['Appliances'],
                'bio' => 'Major household appliance specialist: washing machines, refrigerators, microwave ovens, and electric cooktops.',
                'city' => 'Mount Lavinia',
                'address_line1' => '33 Templers Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10370',
                'country' => 'LK',
                'latitude' => 6.8344,
                'longitude' => 79.8654,
                'service_radius' => 25,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider8@example.com',
                'full_name' => 'Chaminda Bandara',
                'phone' => '+15552000008',
                'provider_type' => 'individual',
                'categories' => ['Gardening'],
                'bio' => 'Professional horticulturalist and landscaper offering turf maintenance, hedge pruning, weed control, and garden design.',
                'city' => 'Maharagama',
                'address_line1' => '52 Old Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10280',
                'country' => 'LK',
                'latitude' => 6.8480,
                'longitude' => 79.9267,
                'service_radius' => 30,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider9@example.com',
                'full_name' => 'Suresh De Silva',
                'phone' => '+15552000009',
                'provider_type' => 'individual',
                'categories' => ['Security'],
                'bio' => 'Smart security technician certified in IP CCTV installation, biometric locks, video doorbells, and perimeter alarms.',
                'city' => 'Kaduwela',
                'address_line1' => '14 Nawagamuwa Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10640',
                'country' => 'LK',
                'latitude' => 6.9333,
                'longitude' => 79.9833,
                'service_radius' => 35,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider10@example.com',
                'full_name' => 'Ranjith Alwis',
                'phone' => '+15552000010',
                'provider_type' => 'individual',
                'categories' => ['Pest Control'],
                'bio' => 'Certified pest control professional providing safe, eco-conscious termite treatments, rodent barriers, and general fumigation.',
                'city' => 'Kottawa',
                'address_line1' => '99 Station Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10230',
                'country' => 'LK',
                'latitude' => 6.8415,
                'longitude' => 79.9654,
                'service_radius' => 40,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider11@example.com',
                'full_name' => 'Nuwan Pradeep',
                'phone' => '+15552000011',
                'provider_type' => 'individual',
                'categories' => ['Plumbing', 'Electrical', 'Carpentry'],
                'bio' => 'Multi-skilled handyman experienced in home repairs, fixture replacements, drywall patching, and emergency fixes.',
                'city' => 'Moratuwa',
                'address_line1' => '64 Rawathawatta Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10400',
                'country' => 'LK',
                'latitude' => 6.7730,
                'longitude' => 79.8816,
                'service_radius' => 30,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider12@example.com',
                'full_name' => 'Dilshan Rathnayake',
                'phone' => '+15552000012',
                'provider_type' => 'individual',
                'categories' => ['Plumbing'],
                'bio' => 'Rapid response plumbing specialist for drain blockages, burst pipes, and bathroom renovations.',
                'city' => 'Negombo',
                'address_line1' => '18 Colombo Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '11500',
                'country' => 'LK',
                'latitude' => 7.2088,
                'longitude' => 79.8358,
                'service_radius' => 35,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider13@example.com',
                'full_name' => 'Mahesh Abeysekara',
                'phone' => '+15552000013',
                'provider_type' => 'individual',
                'categories' => ['Electrical'],
                'bio' => 'Senior electrical contractor specializing in smart home integration, solar backup systems, and EV chargers.',
                'city' => 'Kandy',
                'address_line1' => '32 Peradeniya Road',
                'address_line2' => null,
                'state' => 'Central Province',
                'postal_code' => '20000',
                'country' => 'LK',
                'latitude' => 7.2906,
                'longitude' => 80.6337,
                'service_radius' => 40,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider14@example.com',
                'full_name' => 'Anoma Weerasinghe',
                'phone' => '+15552000014',
                'provider_type' => 'individual',
                'categories' => ['Cleaning'],
                'bio' => 'Specialized in deep clean, sofa steam sanitization, and green non-toxic cleaning techniques for homes and offices.',
                'city' => 'Kelaniya',
                'address_line1' => '104 Biyagama Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '11600',
                'country' => 'LK',
                'latitude' => 6.9538,
                'longitude' => 79.9189,
                'service_radius' => 25,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider15@example.com',
                'full_name' => 'Kasun Mendis',
                'phone' => '+15552000015',
                'provider_type' => 'company',
                'company_name' => 'AquaFlow Plumbing Solutions',
                'registration_no' => 'PV-102934',
                'categories' => ['Plumbing'],
                'bio' => 'Premier residential and commercial plumbing agency with a fleet of 8 emergency service vehicles.',
                'city' => 'Colombo',
                'address_line1' => '120 Baseline Road, Dematagoda',
                'address_line2' => 'AquaFlow HQ',
                'state' => 'Western Province',
                'postal_code' => '00900',
                'country' => 'LK',
                'latitude' => 6.9319,
                'longitude' => 79.8781,
                'service_radius' => 50,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider16@example.com',
                'full_name' => 'Lasantha Peiris',
                'phone' => '+15552000016',
                'provider_type' => 'company',
                'company_name' => 'VoltPro Electrical & Power',
                'registration_no' => 'PV-983411',
                'categories' => ['Electrical'],
                'bio' => 'Fully licensed electrical engineering firm offering residential wiring, solar power, and 24/7 emergency repair dispatch.',
                'city' => 'Colombo',
                'address_line1' => '45 Havelock Road',
                'address_line2' => 'Tower Level 2',
                'state' => 'Western Province',
                'postal_code' => '00500',
                'country' => 'LK',
                'latitude' => 6.8833,
                'longitude' => 79.8650,
                'service_radius' => 50,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider17@example.com',
                'full_name' => 'Hashan Dias',
                'phone' => '+15552000017',
                'provider_type' => 'company',
                'company_name' => 'CleanNest Facility Management',
                'registration_no' => 'PV-562189',
                'categories' => ['Cleaning', 'Painting'],
                'bio' => 'Corporate and residential cleaning agency specializing in deep sanitization, window washing, and turnover painting.',
                'city' => 'Colombo',
                'address_line1' => '88 Duplication Road, Kollupitiya',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '00300',
                'country' => 'LK',
                'latitude' => 6.9015,
                'longitude' => 79.8552,
                'service_radius' => 45,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider18@example.com',
                'full_name' => 'Suraj Jayawardena',
                'phone' => '+15552000018',
                'provider_type' => 'company',
                'company_name' => 'GreenThumb Landscaping Co.',
                'registration_no' => 'PV-774120',
                'categories' => ['Gardening'],
                'bio' => 'Full-service landscaping and garden maintenance company with dedicated crews for regular lawn care and irrigation.',
                'city' => 'Rajagiriya',
                'address_line1' => '142 Buthgamuwa Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '10107',
                'country' => 'LK',
                'latitude' => 6.9150,
                'longitude' => 79.9050,
                'service_radius' => 45,
                'availability' => 'available',
                'approval_status' => 'approved',
            ],
            [
                'email' => 'provider19@example.com',
                'full_name' => 'Dhanushka Jayatilleke',
                'phone' => '+15552000019',
                'provider_type' => 'individual',
                'categories' => ['HVAC'],
                'bio' => 'Experienced AC mechanic pending document verification review.',
                'city' => 'Colombo',
                'address_line1' => '22 Baseline Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '00900',
                'country' => 'LK',
                'latitude' => 6.9200,
                'longitude' => 79.8750,
                'service_radius' => 30,
                'availability' => 'offline',
                'approval_status' => 'pending',
            ],
            [
                'email' => 'provider20@example.com',
                'full_name' => 'Prasanna Jayamaha',
                'phone' => '+15552000020',
                'provider_type' => 'individual',
                'categories' => ['Security'],
                'bio' => 'Independent alarm fitter with incomplete documentation.',
                'city' => 'Colombo',
                'address_line1' => '5 Maradana Road',
                'address_line2' => null,
                'state' => 'Western Province',
                'postal_code' => '01000',
                'country' => 'LK',
                'latitude' => 6.9250,
                'longitude' => 79.8650,
                'service_radius' => 20,
                'availability' => 'offline',
                'approval_status' => 'rejected',
            ],
        ];

        $reviewPool = [
            ['rating' => 5, 'comment' => 'Arrived promptly and resolved the issue within an hour. Excellent workmanship!'],
            ['rating' => 5, 'comment' => 'Very professional and tidy. Left the work area spotless. Highly recommended.'],
            ['rating' => 4, 'comment' => 'Great communication and solid repair work. Would definitely hire again.'],
            ['rating' => 5, 'comment' => 'Diagnosed an elusive fault that other technicians missed. Extremely knowledgeable.'],
            ['rating' => 5, 'comment' => 'Punctual, friendly, and transparent with quotations. Top quality service.'],
        ];

        foreach ($providersData as $index => $data) {
            $userRole = $data['provider_type'] === 'company' ? 'company' : 'provider';

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'full_name' => $data['full_name'],
                    'phone' => $data['phone'],
                    'password' => Hash::make('password'),
                    'role' => $userRole,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$userRole]);

            $companyId = null;
            if ($data['provider_type'] === 'company' && ! empty($data['company_name'])) {
                $company = Company::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'company_name' => $data['company_name'],
                        'registration_no' => $data['registration_no'] ?? ('PV-'.(100000 + $index)),
                        'address' => $data['address_line1'].', '.$data['city'],
                        'approval_status' => $data['approval_status'],
                    ]
                );
                $companyId = $company->id;
                $user->update(['company_id' => $companyId]);
            }

            $provider = Provider::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_id' => $companyId,
                    'provider_type' => $data['provider_type'],
                    'bio' => $data['bio'],
                    'approval_status' => $data['approval_status'],
                    'availability' => $data['availability'],
                    'latitude' => $data['latitude'],
                    'longitude' => $data['longitude'],
                    'service_radius' => $data['service_radius'],
                    'address_line1' => $data['address_line1'],
                    'address_line2' => $data['address_line2'],
                    'city' => $data['city'],
                    'state' => $data['state'],
                    'postal_code' => $data['postal_code'],
                    'country' => $data['country'],
                ]
            );

            // Sync service categories
            $categoryIds = ServiceCategory::whereIn('service_name', $data['categories'])->pluck('id')->all();
            if (! empty($categoryIds)) {
                $provider->serviceCategories()->sync($categoryIds);
                if ($companyId) {
                    foreach ($categoryIds as $catId) {
                        CompanyServiceArea::updateOrCreate(
                            [
                                'company_id' => $companyId,
                                'service_category_id' => $catId,
                            ],
                            [
                                'name' => $data['company_name'].' Area',
                                'latitude' => $data['latitude'],
                                'longitude' => $data['longitude'],
                                'service_radius' => $data['service_radius'],
                            ]
                        );
                    }
                }
            }

            // Seed reviews for approved providers
            if ($data['approval_status'] === 'approved' && $customers->isNotEmpty()) {
                $reviewsCount = $provider->reviews()->count();
                if ($reviewsCount === 0) {
                    $selectedReviews = array_slice($reviewPool, ($index % 3), 2);
                    foreach ($selectedReviews as $rIndex => $revData) {
                        $customer = $customers[($index + $rIndex) % $customers->count()];
                        Review::create([
                            'customer_id' => $customer->id,
                            'provider_id' => $provider->id,
                            'rating' => $revData['rating'],
                            'comment' => $revData['comment'],
                        ]);
                    }
                }
            }

            // KYC Verifications
            $existingKyc = KycVerification::where('provider_id', $provider->id)->first();
            if (! $existingKyc) {
                $kycStatus = match ($data['approval_status']) {
                    'approved' => 'APPROVED',
                    'rejected' => 'REJECTED',
                    default => 'PENDING',
                };

                KycVerification::create([
                    'provider_id' => $provider->id,
                    'verification_type' => $data['provider_type'] === 'company' ? 'KYB' : 'KYC',
                    'status' => $kycStatus,
                    'documents' => [
                        [
                            'documentId' => 'DOC-'.($index + 1),
                            'documentName' => $data['provider_type'] === 'company' ? 'Business Registration Certificate' : 'National ID / Driving License',
                            'documentType' => $data['provider_type'] === 'company' ? 'BUSINESS_REG' : 'ID_CARD',
                            'fileName' => 'verification_doc_'.($index + 1).'.pdf',
                            'fileUrl' => '/storage/docs/doc_'.($index + 1).'.pdf',
                            'fileType' => 'application/pdf',
                            'fileSize' => 150000,
                            'uploadedAt' => now()->subDays(5)->toDateTimeString(),
                            'status' => $kycStatus,
                        ],
                    ],
                    'submitted_at' => now()->subDays(5),
                    'reviewed_at' => $data['approval_status'] !== 'pending' ? now()->subDay() : null,
                    'reviewed_by' => ($data['approval_status'] !== 'pending' && $adminUser) ? $adminUser->id : null,
                    'rejection_reason' => $data['approval_status'] === 'rejected' ? 'Submitted ID document image is blurry and registration details do not match' : null,
                ]);
            }
        }
    }
}
