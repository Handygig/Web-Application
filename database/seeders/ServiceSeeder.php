<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $servicesByCategory = [
            'Plumbing' => [
                [
                    'name' => 'Pipe Leak Detection & Repair',
                    'description' => 'Locate and repair leaking copper, PVC, and PEX pipes behind walls, under sinks, or under floors.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Drain Cleaning & Unclogging',
                    'description' => 'Clear stubborn blockages in sink, shower, and toilet drains using motorized augers and hydro-jetting.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Water Heater Repair & Installation',
                    'description' => 'Diagnose, service, and install tankless or storage water heaters with safety valve checks.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Faucet, Tap & Sink Replacement',
                    'description' => 'Install or repair modern kitchen and bathroom faucets, mixer taps, and undermount sinks.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Toilet Repair & Dual-Flush Installation',
                    'description' => 'Fix running toilets, replace faulty fill valves, and install modern water-saving dual-flush systems.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Water Tank & Sump Pump Maintenance',
                    'description' => 'Sanitize overhead water storage tanks, check automatic ball valves, and service sump pumps.',
                    'is_active' => true,
                ],
            ],
            'Electrical' => [
                [
                    'name' => 'Electrical Fault Finding & Wiring Repair',
                    'description' => 'Troubleshoot flickering lights, tripping breakers, short circuits, and damaged home electrical wiring.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Circuit Breaker & Panel Upgrade',
                    'description' => 'Upgrade outdated fuse boxes and breaker panels to modern RCBO/MCB units for safety compliance.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Ceiling Fan & Light Fixture Setup',
                    'description' => 'Install recessed LED downlights, chandeliers, pendant lamps, dimmers, and ceiling fans.',
                    'is_active' => true,
                ],
                [
                    'name' => 'EV Charger Installation',
                    'description' => 'Professional Level 2 electric vehicle charger installation for home garages and parking areas.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Switch & Power Socket Replacement',
                    'description' => 'Replace worn-out wall outlets, install GFCI/USB sockets, and setup smart wall switches.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Solar & Backup Inverter Maintenance',
                    'description' => 'Inspect inverter wiring, battery electrolyte health, and solar panel connectivity.',
                    'is_active' => true,
                ],
            ],
            'Cleaning' => [
                [
                    'name' => 'Deep House Cleaning',
                    'description' => 'Comprehensive room-by-room scrub down, dusting, sanitization, floor scrubbing, and detail work.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Carpet & Rug Steam Cleaning',
                    'description' => 'Deep hot-water extraction to remove stubborn stains, dirt, and allergens from carpets and rugs.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Sofa & Upholstery Care',
                    'description' => 'Steam cleaning, fabric stain removal, and deodorizing of fabric sofas, cushions, and mattresses.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Window & Glass Washing',
                    'description' => 'Streak-free cleaning of residential interior and exterior glass windows, mirrors, and sliding doors.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Move-in / Move-out Cleaning',
                    'description' => 'Thorough turnover cleaning designed for rental lease endings and real estate property readiness.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Kitchen & Stove Hood Degreasing',
                    'description' => 'Heavy-duty degreasing and deep cleaning of exhaust hoods, ovens, stovetops, and backsplashes.',
                    'is_active' => true,
                ],
            ],
            'Painting' => [
                [
                    'name' => 'Interior Wall & Ceiling Painting',
                    'description' => 'Professional edge cutting and smooth double-coat wall and ceiling paint application with premium finish.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Exterior Weatherproof House Painting',
                    'description' => 'Durable weather-resistant painting for exterior facades, boundary walls, eaves, and trim.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Drywall Patching & Surface Preparation',
                    'description' => 'Repair cracks, dents, and water damage on drywall and plaster before applying fresh paint.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Wood Staining & Protective Varnish',
                    'description' => 'Refinish wooden doors, windowsills, furniture, and decks with high-grade protective sealant.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Waterproofing & Anti-Damp Coating',
                    'description' => 'Apply moisture barrier membranes and anti-fungal sealants to bathroom walls and exterior surfaces.',
                    'is_active' => true,
                ],
            ],
            'Gardening' => [
                [
                    'name' => 'Lawn Mowing & Precision Edging',
                    'description' => 'Regular turf grass cutting, border edging, and yard waste collection and bagging.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Tree Pruning & Hedge Trimming',
                    'description' => 'Shape ornamental hedges, remove dangerous tree deadwood, and trim overgrown bushes.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Weed Control & Lawn Fertilization',
                    'description' => 'Apply seasonal organic fertilizer, aerate compacted lawn soil, and treat persistent weed growth.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Garden Design & Planting',
                    'description' => 'Design flower beds, plant seasonal shrubs and ornamental trees with fresh nutrient mulch.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Sprinkler & Drip Irrigation Setup',
                    'description' => 'Install, repair, and timer-program automatic lawn sprinklers and garden drip irrigation lines.',
                    'is_active' => true,
                ],
            ],
            'Appliances' => [
                [
                    'name' => 'Refrigerator & Freezer Repair',
                    'description' => 'Fix cooling problems, ice maker failure, faulty compressors, defrost timers, and door seals.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Washing Machine & Dryer Service',
                    'description' => 'Resolve spin cycle issues, water drainage blocks, abnormal drum noises, and heating element faults.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Dishwasher Installation & Repair',
                    'description' => 'Fix leaking door seals, clogged spray arms, faulty water inlet valves, and drainage pumps.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Microwave & Kitchen Oven Repair',
                    'description' => 'Repair heating elements, magnetrons, door interlocks, digital touchpads, and thermostats.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Gas & Electric Stove Cooktop Repair',
                    'description' => 'Fix burner ignition problems, replace gas valves, and repair electric induction glass tops.',
                    'is_active' => true,
                ],
            ],
            'HVAC' => [
                [
                    'name' => 'AC Routine Servicing & Filter Cleaning',
                    'description' => 'Chemical wash of indoor coils, high-pressure blower filter wash, and drain pipe unclogging.',
                    'is_active' => true,
                ],
                [
                    'name' => 'AC Gas Leak Detection & Recharge',
                    'description' => 'Locate refrigerant leaks, pressure test copper lines, and recharge R410A / R32 refrigerant gas.',
                    'is_active' => true,
                ],
                [
                    'name' => 'AC Split Unit Installation & Relocation',
                    'description' => 'Mount indoor wall units and outdoor condenser units, connect piping, and commission airflow.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Smart Thermostat Installation',
                    'description' => 'Install and calibrate smart WiFi thermostats (Nest, Ecobee, Honeywell) with HVAC system.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Air Duct Cleaning & Deodorizing',
                    'description' => 'Vacuum and sanitize HVAC air distribution ducts to eliminate dust, mold, and odors.',
                    'is_active' => true,
                ],
            ],
            'Security' => [
                [
                    'name' => 'CCTV Security Camera System Setup',
                    'description' => 'Install 4K IP and analog security cameras with DVR/NVR configuration and mobile app live streaming.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Smart Lock & Video Doorbell Installation',
                    'description' => 'Mount and configure biometric smart locks, keypad door locks, and high-definition video doorbells.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Intrusion & Burglar Alarm Setup',
                    'description' => 'Install door/window contact sensors, wireless PIR motion detectors, and siren alarms.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Security Sensor & Floodlight Setup',
                    'description' => 'Install outdoor motion-activated LED floodlights and perimeter warning sensor lights.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Video Intercom System Installation',
                    'description' => 'Install 2-way audio/video gate intercoms and magnetic electronic door strike controllers.',
                    'is_active' => true,
                ],
            ],
            'Carpentry' => [
                [
                    'name' => 'Custom Shelving & Cabinet Construction',
                    'description' => 'Build custom floating wooden shelves, pantry storage units, and under-stair cabinetry.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Door Hanging & Lock Fitting',
                    'description' => 'Plane internal/external doors, fit brass hinges, install mortise locks, and fix sticking frames.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Furniture Assembly & Restoration',
                    'description' => 'Precision flat-pack furniture assembly and structural reinforcement of wooden furniture.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Wooden Deck & Railing Repair',
                    'description' => 'Replace rotted timber deck planks, re-fasten loose banisters, and sand down railings.',
                    'is_active' => true,
                ],
            ],
            'Pest Control' => [
                [
                    'name' => 'General Pest Spray & Extermination',
                    'description' => 'Targeted residual spray for ants, cockroaches, spiders, and silverfish across internal areas.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Termite Inspection & Barrier Treatment',
                    'description' => 'Comprehensive inspection for subterranean termites and pressurized barrier soil treatment.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Rodent & Rat Control',
                    'description' => 'Strategic placement of tamper-resistant bait stations and sealing of structural rodent entry points.',
                    'is_active' => true,
                ],
                [
                    'name' => 'Mosquito & Vector Fogging',
                    'description' => 'Thermal outdoor fogging and biological larvicide application for drains and garden perimeters.',
                    'is_active' => true,
                ],
            ],
        ];

        foreach ($servicesByCategory as $categoryName => $services) {
            $category = ServiceCategory::where('service_name', $categoryName)->first();

            if (! $category) {
                continue;
            }

            foreach ($services as $serviceData) {
                Service::updateOrCreate(
                    [
                        'service_category_id' => $category->id,
                        'name' => $serviceData['name'],
                    ],
                    [
                        'description' => $serviceData['description'],
                        'is_active' => $serviceData['is_active'],
                    ]
                );
            }
        }
    }
}
