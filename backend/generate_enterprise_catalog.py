import os
import json
import csv
import datetime
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applinex.settings')
django.setup()

from apps.appliances.models import Category, Appliance

CATEGORIES_MASTER = [
    {
        'name': 'Refrigerators & Freezers',
        'slug': 'refrigerators',
        'icon_name': 'Refrigerator',
        'description': 'Single door, double door, frost-free, side-by-side, French door, and deep chest freezers.',
        'image_url': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Washing Machines & Dryers',
        'slug': 'washing-machines',
        'icon_name': 'WashingMachine',
        'description': 'Front load, top load, semi-automatic, and inverter washer-dryers with steam sanitization.',
        'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Air Conditioners',
        'slug': 'air-conditioners',
        'icon_name': 'Wind',
        'description': '1 Ton, 1.5 Ton, and 2 Ton 3-Star & 5-Star dual inverter split & window cooling systems.',
        'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Televisions & Smart TVs',
        'slug': 'smart-tvs',
        'icon_name': 'Tv',
        'description': '32" to 65" 4K UHD, OLED, QLED, Android TV & Google TV displays with Dolby Vision.',
        'image_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Water Purifiers & Dispensers',
        'slug': 'ro-dispensers',
        'icon_name': 'Droplets',
        'description': 'Multi-stage RO + UV + UF + Alkaline mineralizer and copper infusion water purifiers.',
        'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Microwave & Convection Ovens',
        'slug': 'microwaves-ovens',
        'icon_name': 'Microwave',
        'description': 'Solo, grill, and convection microwave ovens with auto-cook Indian menus & ceramic interiors.',
        'image_url': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Induction Cooktops',
        'slug': 'induction-cooktops',
        'icon_name': 'Flame',
        'description': 'Energy-efficient 1200W-2200W electromagnetic induction cooktops with Indian preset menus.',
        'image_url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Air Purifiers',
        'slug': 'air-purifiers',
        'icon_name': 'Activity',
        'description': 'True HEPA smart air purifiers with real-time PM2.5 AQI displays and allergen defense.',
        'image_url': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Air Coolers',
        'slug': 'air-coolers',
        'icon_name': 'Fan',
        'description': 'Desert, tower, and personal room air coolers with honeycomb pads and ice chambers.',
        'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Vacuum Cleaners',
        'slug': 'vacuum-cleaners',
        'icon_name': 'Zap',
        'description': 'Cordless stick, robot vacuum cleaners, and wet & dry canister deep-cleaning systems.',
        'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Dishwashers',
        'slug': 'dishwashers',
        'icon_name': 'Sparkles',
        'description': '12 to 14 place setting freestanding and built-in dishwashers with intensive hygiene wash.',
        'image_url': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Water Heaters & Geysers',
        'slug': 'water-heaters',
        'icon_name': 'Thermometer',
        'description': 'Instant & 10L-25L 5-Star storage geysers with glass-lined titanium corrosion-resistant tanks.',
        'image_url': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Kitchen Small Appliances',
        'slug': 'small-kitchen',
        'icon_name': 'Coffee',
        'description': 'Digital air fryers, 750W mixer grinders, espresso machines, OTGs, and electric kettles.',
        'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Fans & BLDC Coolers',
        'slug': 'fans',
        'icon_name': 'Disc',
        'description': 'Energy-saving 28W BLDC ceiling fans with smart remote control, pedestal, and tower fans.',
        'image_url': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Irons & Garment Steamers',
        'slug': 'irons-steamers',
        'icon_name': 'Feather',
        'description': 'Heavy-duty non-stick dry irons, continuous steam irons, and upright garment steamers.',
        'image_url': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80'
    },
    {
        'name': 'Home Entertainment & Audio',
        'slug': 'soundbars-audio',
        'icon_name': 'Volume2',
        'description': 'Dolby Atmos 5.1 soundbars, wireless subwoofer audio systems, and Full HD smart projectors.',
        'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
    }
]

PRODUCTS_MASTER = [
    # ==========================================
    # 1. REFRIGERATORS & FREEZERS
    # ==========================================
    {
        'product_id': 'APX-REF-001',
        'category_slug': 'refrigerators',
        'category': 'Refrigerators & Freezers',
        'subcategory': 'Double Door',
        'brand': 'LG',
        'model': 'GL-S382SDSX',
        'product_name': 'LG 343L 3 Star Frost Free Smart Inverter Double Door Refrigerator',
        'description': 'LG Frost Free Double Door Refrigerator with Smart Inverter Compressor, Door Cooling+, and Express Freeze for energy-efficient multi-airflow cooling.',
        'capacity': '343 Litres',
        'door_type': 'Double Door (Convertible)',
        'energy_rating': '3 Star Inverter',
        'compressor_type': 'Smart Inverter Compressor',
        'cooling_technology': 'Door Cooling+ & Multi Air Flow',
        'colour': 'Dazzle Steel',
        'dimensions': '600 x 710 x 1720 mm',
        'weight': '64 kg',
        'warranty': '10 Years Compressor Warranty & Free Annual AMC',
        'purchase_price': 41990.00,
        'monthly_rent': 1399.00,
        'security_deposit': 1200.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 18,
        'condition': 'Brand New / Excellent',
        'rating': 4.88,
        'review_count': 74,
        'image_url': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.lg.com/in/refrigerators/lg-gl-s382sdsx',
        'features': [
            'Convertible 3-in-1 Smart Cooling',
            'Door Cooling+ provides 35% faster cooling',
            'Smart Diagnosis self-troubleshooting system',
            'Auto Smart Connect connects to home inverter',
            'Toughened glass shelves holding up to 175 kg'
        ],
        'specifications': {
            'Gross Capacity': '343 L',
            'Defrosting Type': 'Frost Free Auto Defrost',
            'Refrigerant': 'R600a Eco-Friendly',
            'Power Consumption': '212 kWh/year',
            'Voltage Range': '100V - 310V (Stabilizer Free)'
        },
        'ai_metadata': {
            'demand_score': 94,
            'season': 'Summer / Year-round',
            'utilization_rate': 0.89,
            'target_persona': 'Families (3-5 members), Professionals'
        }
    },
    {
        'product_id': 'APX-REF-002',
        'category_slug': 'refrigerators',
        'category': 'Refrigerators & Freezers',
        'subcategory': 'Side by Side',
        'brand': 'Samsung',
        'model': 'RS76CG8003S9',
        'product_name': 'Samsung 653L 3 Star SpaceMax Side-by-Side Smart Refrigerator',
        'description': 'Ultra-spacious Samsung SpaceMax Side-by-Side Refrigerator with All-Around Cooling, AI Energy Mode, and Digital Inverter Technology.',
        'capacity': '653 Litres',
        'door_type': 'Side by Side Dual Door',
        'energy_rating': '3 Star Inverter',
        'compressor_type': 'Digital Inverter with 20 Year Warranty',
        'cooling_technology': 'Twin Cooling Plus & All-Around Cooling',
        'colour': 'Refined Inox Silver',
        'dimensions': '912 x 716 x 1780 mm',
        'weight': '101 kg',
        'warranty': '20 Years Compressor Warranty + ApplineX Priority AMC',
        'purchase_price': 89990.00,
        'monthly_rent': 2799.00,
        'security_deposit': 3000.00,
        'min_tenure_months': 6,
        'availability_status': 'Available',
        'quantity': 8,
        'condition': 'Brand New / Pristine',
        'rating': 4.95,
        'review_count': 42,
        'image_url': 'https://images.unsplash.com/photo-1536353284924-9240ccfc4966?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.samsung.com/in/refrigerators/side-by-side/rs76cg8003s9/',
        'features': [
            'SpaceMax Technology provides thinner walls for extra interior storage',
            'SmartThings AI Energy Mode reduces power draw by up to 10%',
            'Convertible 5-in-1 flexible freezer-to-fridge zones',
            'Deodorizing Filter preserves natural food aromas',
            'Power Cool & Power Freeze rapid chilling'
        ],
        'specifications': {
            'Gross Capacity': '653 L',
            'Noise Level': '37 dB (Whisper Quiet)',
            'Power Consumption': '395 kWh/year',
            'Display': 'Internal LED Display & Touch Controls'
        },
        'ai_metadata': {
            'demand_score': 88,
            'season': 'Year-round',
            'utilization_rate': 0.82,
            'target_persona': 'Luxury Apartments, Large Families'
        }
    },
    {
        'product_id': 'APX-REF-003',
        'category_slug': 'refrigerators',
        'category': 'Refrigerators & Freezers',
        'subcategory': 'Single Door',
        'brand': 'Whirlpool',
        'model': '205 WDE CLS 4S',
        'product_name': 'Whirlpool 190L 4 Star Direct Cool Single Door Refrigerator',
        'description': 'Reliable, compact, and energy-saving single door refrigerator with 9-hour cooling retention during power cuts.',
        'capacity': '190 Litres',
        'door_type': 'Single Door',
        'energy_rating': '4 Star Direct Cool',
        'compressor_type': 'Reciprocating Inverter Compressor',
        'cooling_technology': 'Laminar Airflow & Insulated Capillary Tech',
        'colour': 'Wine Bloom Floral',
        'dimensions': '535 x 615 x 1180 mm',
        'weight': '38 kg',
        'warranty': '10 Years Compressor Warranty + Free Annual Service',
        'purchase_price': 17990.00,
        'monthly_rent': 699.00,
        'security_deposit': 800.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 25,
        'condition': 'Excellent',
        'rating': 4.79,
        'review_count': 96,
        'image_url': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.whirlpoolindia.com/single-door-refrigerators-205-wde-cls-4s',
        'features': [
            '9 Hours cooling retention during power failures',
            'Honeycomb moisture lock crisper for long-lasting freshness',
            'Extra large vegetable drawer with pedestal base storage',
            'Toughened glass shelves with 150kg load capacity',
            'Stabilizer-free operation from 130V to 300V'
        ],
        'specifications': {
            'Gross Capacity': '190 L',
            'Defrosting Type': 'Direct Cool Manual Defrost',
            'Power Consumption': '132 kWh/year',
            'Refrigerant': 'R600a'
        },
        'ai_metadata': {
            'demand_score': 98,
            'season': 'Year-round',
            'utilization_rate': 0.94,
            'target_persona': 'Students, Bachelors, Singles, 1BHK Apartments'
        }
    },
    {
        'product_id': 'APX-REF-004',
        'category_slug': 'refrigerators',
        'category': 'Refrigerators & Freezers',
        'subcategory': 'Deep Freezers',
        'brand': 'Voltas',
        'model': 'CF HT 320 DD P',
        'product_name': 'Voltas 320L Double Door Convertible Deep Chest Freezer',
        'description': 'Heavy-duty commercial and large household convertible deep freezer with castor wheels and eco-friendly refrigerant.',
        'capacity': '320 Litres',
        'door_type': 'Chest Dual Top Door',
        'energy_rating': 'Commercial High Efficiency',
        'compressor_type': 'Heavy Duty Tropicalized Compressor',
        'cooling_technology': 'Direct Static Deep Sub-Zero Cooling',
        'colour': 'Classic White',
        'dimensions': '1180 x 665 x 830 mm',
        'weight': '52 kg',
        'warranty': '4 Years Comprehensive Warranty',
        'purchase_price': 28500.00,
        'monthly_rent': 1199.00,
        'security_deposit': 1500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 10,
        'condition': 'Excellent',
        'rating': 4.82,
        'review_count': 31,
        'image_url': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.myvoltas.com/chest-freezers/320-dd',
        'features': [
            'Dual Temperature Convertible (Freezer & Cooler modes)',
            'Stucco aluminium interior liner for enhanced hygiene',
            'High-density PUF insulation for extended cold retention',
            'Lock & Key door mechanism with 360 degree castor wheels'
        ],
        'specifications': {
            'Capacity': '320 Litres',
            'Temperature Range': '<= -18°C to 8°C',
            'Refrigerant': 'R290 Eco Friendly Gas',
            'Power': '230V / 50Hz'
        },
        'ai_metadata': {
            'demand_score': 76,
            'season': 'Summer / Festive',
            'utilization_rate': 0.78,
            'target_persona': 'Caterers, Bulk Food Enthusiasts, Joint Families'
        }
    },

    # ==========================================
    # 2. WASHING MACHINES
    # ==========================================
    {
        'product_id': 'APX-WM-001',
        'category_slug': 'washing-machines',
        'category': 'Washing Machines & Dryers',
        'subcategory': 'Front Load',
        'brand': 'Bosch',
        'model': 'WAJ2846SIN',
        'product_name': 'Bosch 8.0 Kg 5 Star EcoSilence Drive Front Load Washing Machine',
        'description': 'German engineered Bosch 8kg front load washer with AntiTangle, ActiveWater Plus, and whisper-quiet EcoSilence Drive motor.',
        'capacity': '8.0 Kg',
        'door_type': 'Front Loading 165° Swing Door',
        'energy_rating': '5 Star Energy Certified',
        'compressor_type': 'EcoSilence Drive Inverter Motor',
        'cooling_technology': 'VarioDrum & ActiveWater Plus Dynamic Sensing',
        'colour': 'Silver Metallic',
        'dimensions': '598 x 590 x 848 mm',
        'weight': '71 kg',
        'warranty': '12 Years Motor Warranty + Free Bi-Annual Descaling AMC',
        'purchase_price': 38990.00,
        'monthly_rent': 1399.00,
        'security_deposit': 1200.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 20,
        'condition': 'Brand New / Pristine',
        'rating': 4.93,
        'review_count': 88,
        'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.bosch-home.in/products-list/washers-dryers/washing-machines/front-load-washing-machines/WAJ2846SIN',
        'features': [
            'EcoSilence Drive friction-free brushless motor (down to 49 dB)',
            'SpeedPerfect cuts wash cycle time by up to 65%',
            'AntiTangle technology reduces clothes tangles by up to 50%',
            'AllergyPlus program removes 99.9% of dust mites & allergens',
            'Reload function lets you pause and add forgotten clothes'
        ],
        'specifications': {
            'Max Spin Speed': '1400 RPM',
            'Wash Programs': '15 Intelligent Cycles (Cotton, Silk, Wool, Delicates, Quick 15/30)',
            'Inbuilt Heater': 'Yes (up to 90°C Temperature Selection)',
            'Power Consumption': '0.063 kWh/kg/cycle'
        },
        'ai_metadata': {
            'demand_score': 96,
            'season': 'Year-round / High in Monsoon',
            'utilization_rate': 0.92,
            'target_persona': 'Couples, Tech Professionals, Families (3-5 members)'
        }
    },
    {
        'product_id': 'APX-WM-002',
        'category_slug': 'washing-machines',
        'category': 'Washing Machines & Dryers',
        'subcategory': 'Top Load',
        'brand': 'LG',
        'model': 'T70SKSF1Z',
        'product_name': 'LG 7.0 Kg 5 Star Smart Inverter Fully Automatic Top Load Washer',
        'description': 'LG Smart Inverter Top Load washer with TurboDrum, Punch+3 pulsator, and Smart Motion for energy-efficient daily laundry.',
        'capacity': '7.0 Kg',
        'door_type': 'Top Loading Soft Closing Glass Lid',
        'energy_rating': '5 Star Energy Certified',
        'compressor_type': 'Smart Inverter Motor with BMC Protection',
        'cooling_technology': 'TurboDrum & Smart Motion Pulsator',
        'colour': 'Middle Free Silver',
        'dimensions': '540 x 540 x 870 mm',
        'weight': '32 kg',
        'warranty': '10 Years Motor Warranty + Free Maintenance AMC',
        'purchase_price': 19990.00,
        'monthly_rent': 849.00,
        'security_deposit': 800.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 24,
        'condition': 'Excellent',
        'rating': 4.84,
        'review_count': 105,
        'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.lg.com/in/washing-machines/lg-t70sksf1z',
        'features': [
            'Smart Inverter Technology saves up to 36% energy',
            'TurboDrum enables drum and pulsator to rotate in opposite directions',
            'Smart Diagnosis diagnosis via mobile app',
            'Punch+3 creates vertical water currents for deep collar cleaning',
            'Auto Restart with memory backup after power outage'
        ],
        'specifications': {
            'Max Spin Speed': '780 RPM',
            'Tub Material': 'Stainless Steel Drum',
            'Programs': '8 Wash Cycles (Normal, Gentle, Quick Wash, Tub Clean)',
            'Water Level Settings': '10 Levels'
        },
        'ai_metadata': {
            'demand_score': 95,
            'season': 'Year-round',
            'utilization_rate': 0.93,
            'target_persona': 'Budget Homes, Small Families, Shared Flats'
        }
    },
    {
        'product_id': 'APX-WM-003',
        'category_slug': 'washing-machines',
        'category': 'Washing Machines & Dryers',
        'subcategory': 'Washer Dryer',
        'brand': 'IFB',
        'model': 'Executive Plus VX ID 8.5/6.5 Kg',
        'product_name': 'IFB 8.5/6.5 Kg 5 Star Inverter Washer Dryer Combo with Steam',
        'description': 'All-in-one 100% dry wash solution with Steam Refresh, Aqua Energie water filter, and 4D Wash system.',
        'capacity': '8.5 Kg Wash / 6.5 Kg 100% Dry',
        'door_type': 'Front Loading Chrome Rim Door',
        'energy_rating': '5 Star Inverter',
        'compressor_type': 'Eco Inverter Motor',
        'cooling_technology': '4D Wash & Crescent Moon Stainless Drum',
        'colour': 'Mocha Brown Metallic',
        'dimensions': '598 x 606 x 875 mm',
        'weight': '75 kg',
        'warranty': '10 Years Motor Warranty + Priority AMC',
        'purchase_price': 58990.00,
        'monthly_rent': 2199.00,
        'security_deposit': 2000.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 12,
        'condition': 'Brand New',
        'rating': 4.91,
        'review_count': 47,
        'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.ifbappliances.com/washer-dryer-executive-plus-vx-id',
        'features': [
            '100% Clothes Drying without hanging lines (Condenser Dryer)',
            'Steam Refresh cycle removes wrinkles & odors in 30 mins',
            'Aqua Energie built-in filter energizes water for better detergent dissolution',
            'Crescent Moon Drum grooves prevent fabric fraying',
            'High-voltage and unbalanced load auto-protection'
        ],
        'specifications': {
            'Max Spin Speed': '1400 RPM',
            'Wash Programs': '14 Programs + 4 Dry Modes',
            'Drying Technology': 'Condensation Sensor Drying',
            'Inbuilt Heater': 'Yes (up to 95°C)'
        },
        'ai_metadata': {
            'demand_score': 91,
            'season': 'Monsoon / Winter Peak',
            'utilization_rate': 0.86,
            'target_persona': 'High-Rise Apartments (No Balcony Drying), Busy Professionals'
        }
    },

    # ==========================================
    # 3. AIR CONDITIONERS
    # ==========================================
    {
        'product_id': 'APX-AC-001',
        'category_slug': 'air-conditioners',
        'category': 'Air Conditioners',
        'subcategory': 'Split Inverter AC',
        'brand': 'Daikin',
        'model': 'FTKM50U',
        'product_name': 'Daikin 1.5 Ton 5 Star Inverter Split Air Conditioner with PM 2.5 Filter',
        'description': 'Daikin flagship 1.5 Ton 5-Star Split AC with Neo Swing Compressor, Coanda Airflow, and 3D Cooling for heavy-duty summer cooling.',
        'capacity': '1.5 Ton (Ideal for 150 - 180 sq ft)',
        'door_type': 'Split Wall Mount Unit',
        'energy_rating': '5 Star (ISEER 5.2)',
        'compressor_type': 'Neo Swing Inverter Compressor',
        'cooling_technology': 'Coanda Airflow & 100% Copper Condenser',
        'colour': 'Glossy Arctic White',
        'dimensions': '885 x 298 x 229 mm',
        'weight': '10.5 kg (IDU) / 32 kg (ODU)',
        'warranty': '10 Years Compressor Warranty + Free Pre-Summer Gas AMC',
        'purchase_price': 46990.00,
        'monthly_rent': 1899.00,
        'security_deposit': 1500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 22,
        'condition': 'Brand New / Pristine',
        'rating': 4.92,
        'review_count': 114,
        'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.daikinindia.com/products/room-air-conditioners/ftkm50u',
        'features': [
            'Patented Neo Swing Compressor eliminates friction & vibration',
            'PM 2.5 Air Filtration traps microscopic dust particles',
            'Coanda Airflow drafts cool air upward to ceiling for draft-free comfort',
            'Econo Mode limits maximum power consumption',
            'Super quiet operation down to 19 dB (Indoor)'
        ],
        'specifications': {
            'Cooling Capacity': '5280 Watts',
            'ISEER Value': '5.2',
            'Refrigerant': 'R32 Eco-Friendly Zero ODP',
            'Power Consumption': '780 kWh/year',
            'Condenser Coil': '100% Inner-Grooved Copper'
        },
        'ai_metadata': {
            'demand_score': 99,
            'season': 'Summer Peak (March - July)',
            'utilization_rate': 0.97,
            'target_persona': 'Bedrooms, Living Rooms, High-Heat City Homes'
        }
    },
    {
        'product_id': 'APX-AC-002',
        'category_slug': 'air-conditioners',
        'category': 'Air Conditioners',
        'subcategory': 'Split Inverter AC',
        'brand': 'Voltas',
        'model': '183V Vectra Prism',
        'product_name': 'Voltas 1.5 Ton 3 Star 4-in-1 Adjustable Inverter Split AC',
        'description': 'All-weather Voltas 1.5 Ton 3-Star Inverter AC with 4 adjustable cooling modes, high-ambient cooling up to 52°C, and antimicrobial filtration.',
        'capacity': '1.5 Ton (Ideal for 110 - 150 sq ft)',
        'door_type': 'Split Wall Mount Unit',
        'energy_rating': '3 Star (ISEER 3.81)',
        'compressor_type': 'High EER Rotary Inverter Compressor',
        'cooling_technology': 'Superdry Mode & 100% Copper Tube',
        'colour': 'White with Chrome Accent',
        'dimensions': '840 x 270 x 210 mm',
        'weight': '9.8 kg (IDU) / 28.5 kg (ODU)',
        'warranty': '10 Years Compressor Warranty + Free Standard Installation AMC',
        'purchase_price': 34990.00,
        'monthly_rent': 1399.00,
        'security_deposit': 1200.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 28,
        'condition': 'Excellent',
        'rating': 4.79,
        'review_count': 132,
        'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.myvoltas.com/split-ac/183v-vectra-prism',
        'features': [
            '4-in-1 Adjustable Mode switches capacity from 20% to 120%',
            'High Ambient Cooling operates comfortably even at 52°C outside',
            'Superdry Mode de-humidifies indoor air during monsoons',
            'Anti-Microbial Air Filter catches PM10 particles and hair',
            'Self-Diagnosis detects refrigerant leakages automatically'
        ],
        'specifications': {
            'Cooling Capacity': '5050 Watts',
            'Refrigerant': 'R32 Gas',
            'Power Consumption': '975 kWh/year',
            'Noise Level': '38 dB (Indoor)'
        },
        'ai_metadata': {
            'demand_score': 97,
            'season': 'Summer / Monsoon',
            'utilization_rate': 0.95,
            'target_persona': 'Tenants, 2BHK Apartments, Master Bedrooms'
        }
    },

    # ==========================================
    # 4. TELEVISIONS / SMART TVs
    # ==========================================
    {
        'product_id': 'APX-TV-001',
        'category_slug': 'smart-tvs',
        'category': 'Televisions & Smart TVs',
        'subcategory': '4K Google TV',
        'brand': 'Sony',
        'model': 'KD-55X74L',
        'product_name': 'Sony Bravia 55" 4K Ultra HD Smart LED Google TV with Dolby Audio',
        'description': 'Sony Bravia 55-inch 4K HDR Google TV powered by the X1 4K Processor, Live Color technology, and Open Baffle Bass Reflex speakers.',
        'capacity': '55 Inch (139 cm Diagonal)',
        'door_type': 'Slim Bezel Wall / Table Mount',
        'energy_rating': '4 Star BEE Efficiency',
        'compressor_type': 'Sony X1 4K HDR Processor',
        'cooling_technology': 'Motionflow XR 100 & 4K X-Reality PRO',
        'colour': 'Hairline Black',
        'dimensions': '1243 x 729 x 84 mm',
        'weight': '13.9 kg',
        'warranty': '3 Years Panel Warranty + Free Setup Support',
        'purchase_price': 57990.00,
        'monthly_rent': 1799.00,
        'security_deposit': 1500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 16,
        'condition': 'Brand New / Pristine',
        'rating': 4.94,
        'review_count': 92,
        'image_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.sony.co.in/electronics/televisions/x74l-series',
        'features': [
            '4K Processor X1 produces lifelike colors and rich contrasts',
            'Google TV OS with personalized content recommendations & Google Assistant',
            'Motionflow XR keeps fast sports and movie scenes blur-free',
            'Dolby Audio 20W Open Baffle Bass Reflex Sound',
            'Apple AirPlay & Chromecast built-in'
        ],
        'specifications': {
            'Display Resolution': '3840 x 2160 Pixels (4K UHD)',
            'Refresh Rate': '60 Hz Native',
            'HDR Support': 'HDR10, HLG',
            'Connectivity': '3 x HDMI 2.1 (eARC), 2 x USB, Wi-Fi 5GHz, Bluetooth 5.0'
        },
        'ai_metadata': {
            'demand_score': 93,
            'season': 'Year-round / IPL & Cricket World Cup Peak',
            'utilization_rate': 0.91,
            'target_persona': 'Movie Lovers, Living Rooms, Gamers'
        }
    },
    {
        'product_id': 'APX-TV-002',
        'category_slug': 'smart-tvs',
        'category': 'Televisions & Smart TVs',
        'subcategory': 'Full HD Smart TV',
        'brand': 'LG',
        'model': '32LM563BPTC',
        'product_name': 'LG 32" HD Ready Smart LED TV with Dynamic Color Enhancer',
        'description': 'Compact and feature-packed 32-inch LG Smart TV with WebOS, Quad Core Processor, Active HDR, and DTS Virtual:X sound.',
        'capacity': '32 Inch (80 cm Diagonal)',
        'door_type': 'Slim LED Display',
        'energy_rating': '5 Star BEE Efficiency',
        'compressor_type': 'Quad Core Processor',
        'cooling_technology': 'Dynamic Color Enhancer & Active HDR',
        'colour': 'Ceramic Black',
        'dimensions': '736 x 437 x 82.9 mm',
        'weight': '4.65 kg',
        'warranty': '2 Years Comprehensive Warranty',
        'purchase_price': 14990.00,
        'monthly_rent': 649.00,
        'security_deposit': 600.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 30,
        'condition': 'Excellent',
        'rating': 4.81,
        'review_count': 120,
        'image_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.lg.com/in/tvs/lg-32lm563bptc',
        'features': [
            'LG WebOS with Netflix, Prime Video, Disney+ Hotstar & YouTube',
            'Dynamic Color Enhancer for vibrant and natural hues',
            'DTS Virtual:X delivers multi-dimensional audio output',
            'Screen Mirroring from Android & iOS smartphones',
            'Magic Remote ready with voice search capability'
        ],
        'specifications': {
            'Resolution': '1366 x 768 Pixels (HD Ready)',
            'Audio Output': '10 Watts 2.0 Channel',
            'Ports': '2 x HDMI, 1 x USB, Optical Digital Out',
            'Wi-Fi': 'Built-in Wi-Fi 802.11 b/g/n'
        },
        'ai_metadata': {
            'demand_score': 95,
            'season': 'Year-round',
            'utilization_rate': 0.94,
            'target_persona': 'Bedrooms, Studio Apartments, PG Accommodations'
        }
    },

    # ==========================================
    # 5. WATER PURIFIERS
    # ==========================================
    {
        'product_id': 'APX-RO-001',
        'category_slug': 'ro-dispensers',
        'category': 'Water Purifiers & Dispensers',
        'subcategory': 'RO + UV + Alkaline',
        'brand': 'Kent',
        'model': 'Grand Plus Mineral RO',
        'product_name': 'Kent Grand Plus 9L Wall Mounted RO + UV + UF + TDS Controller Purifier',
        'description': 'India’s highest selling RO water purifier with Mineral RO technology, UV in-tank disinfection, and 20 L/hr fast purification.',
        'capacity': '9.0 Litres Storage Tank',
        'door_type': 'Wall Mount / Counter Top Purifier',
        'energy_rating': '60W Low Power RO',
        'compressor_type': 'Heavy Duty Booster Pump',
        'cooling_technology': 'Multi-Stage Reverse Osmosis',
        'colour': 'Transparent & White',
        'dimensions': '400 x 260 x 520 mm',
        'weight': '8.6 kg',
        'warranty': '100% Free Filter Replacements & Membrane AMC Included',
        'purchase_price': 17500.00,
        'monthly_rent': 599.00,
        'security_deposit': 600.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 25,
        'condition': 'Brand New / Certified Serviced',
        'rating': 4.90,
        'review_count': 140,
        'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.kent.co.in/water-purifiers/ro/kent-grand-plus',
        'features': [
            'Multi-Stage Purification: Sediment + Carbon + RO + UV + UF + TDS Controller',
            'Patented TDS Controller retains essential natural minerals in drinking water',
            'In-tank UV LED keeps stored water bacteria-free for hours',
            'High purification capacity of 20 L/hr for immediate water availability',
            'Fully automatic operation with auto-on and auto-off sensors'
        ],
        'specifications': {
            'Max TDS Limit': 'Handles up to 2000 ppm High Saline Water',
            'Storage Capacity': '9 Litres',
            'Membrane Type': 'Thin Film Composite RO Membrane',
            'Power Consumption': '60 Watts'
        },
        'ai_metadata': {
            'demand_score': 98,
            'season': 'Year-round / Peak Monsoon',
            'utilization_rate': 0.96,
            'target_persona': 'All Households, Hard Water Areas (Bangalore/Hyderabad/NCR)'
        }
    },
    {
        'product_id': 'APX-RO-002',
        'category_slug': 'ro-dispensers',
        'category': 'Water Purifiers & Dispensers',
        'subcategory': 'Copper RO',
        'brand': 'Aquaguard / Eureka Forbes',
        'model': 'Active Copper Maxx',
        'product_name': 'Aquaguard Marvel 7L RO + UV + Active Copper Infusion Purifier',
        'description': 'Eureka Forbes Aquaguard purifier with Active Copper Technology that infuses Ayurvedic copper ions into pure RO water.',
        'capacity': '7.0 Litres Storage',
        'door_type': 'Sleek Wall Mount',
        'energy_rating': 'Energy Saving Mode',
        'compressor_type': 'High-Recovery Diaphragm Pump',
        'cooling_technology': 'RO + UV + Taste Adjuster',
        'colour': 'Glossy Metallic Black',
        'dimensions': '320 x 275 x 475 mm',
        'weight': '7.2 kg',
        'warranty': 'Free Periodic Filter Changes & Annual Maintenance',
        'purchase_price': 16490.00,
        'monthly_rent': 549.00,
        'security_deposit': 500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 20,
        'condition': 'Excellent',
        'rating': 4.86,
        'review_count': 82,
        'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.eurekaforbes.com/water-purifiers/aquaguard-marvel-ro-uv',
        'features': [
            'Active Copper Technology releases optimal copper ions into water',
            'Mineral Guard technology prevents scaling on heating vessels',
            'Smart LED alerts for filter expiry and electronic failure',
            'Zero Pressure Pump operates even in low tap water pressure',
            'Food-grade BPA free antibacterial storage tank'
        ],
        'specifications': {
            'Capacity': '7 Litres',
            'TDS Capacity': 'Up to 2000 mg/L',
            'Filter Life': '6,000 Litres (approx 1 year)',
            'Input Voltage': '150V - 250V AC'
        },
        'ai_metadata': {
            'demand_score': 94,
            'season': 'Year-round',
            'utilization_rate': 0.92,
            'target_persona': 'Health-Conscious Families, Urban Homes'
        }
    },

    # ==========================================
    # 6. MICROWAVE OVENS
    # ==========================================
    {
        'product_id': 'APX-MW-001',
        'category_slug': 'microwaves-ovens',
        'category': 'Microwave & Convection Ovens',
        'subcategory': 'Convection Microwave',
        'brand': 'Samsung',
        'model': 'MC28A5145VK',
        'product_name': 'Samsung 28L Convection Microwave Oven with Slim Fry & Ceramic Cavity',
        'description': 'All-in-one 28L Convection Microwave with Slim Fry technology for oil-free frying, tandoor cooking, and curd making.',
        'capacity': '28 Litres',
        'door_type': 'Handle Drop / Side Pull Door',
        'energy_rating': 'High Thermal Efficiency',
        'compressor_type': 'Triple Distribution System Magnetron',
        'cooling_technology': 'Convection Fan Heated Airflow',
        'colour': 'Black Pattern Glass',
        'dimensions': '517 x 310 x 475 mm',
        'weight': '17.5 kg',
        'warranty': '10 Years Ceramic Cavity Warranty + Free Servicing',
        'purchase_price': 16990.00,
        'monthly_rent': 699.00,
        'security_deposit': 600.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 18,
        'condition': 'Brand New / Pristine',
        'rating': 4.87,
        'review_count': 64,
        'image_url': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.samsung.com/in/microwave-ovens/convection/mc28a5145vk/',
        'features': [
            'Slim Fry technology cooks crispy food without deep oil frying',
            'Ceramic Inside cavity with 99.9% anti-bacterial protection (scratch resistant)',
            'Tandoor Technology reaches 200°C for authentic rotis & naans',
            'Fermentation function for homemade curd (dahi) and dough rising',
            'Deodorization mode eliminates food smells quickly'
        ],
        'specifications': {
            'Capacity': '28 Litres',
            'Microwave Power': '900 Watts (6 Power Levels)',
            'Convection Power': '2100 Watts',
            'Auto Cook Menus': '134 Indian Recipe Presets',
            'Turntable Size': '318 mm'
        },
        'ai_metadata': {
            'demand_score': 90,
            'season': 'Winter / Festive / Year-round',
            'utilization_rate': 0.88,
            'target_persona': 'Baking Enthusiasts, Working Couples, Families'
        }
    },
    {
        'product_id': 'APX-MW-002',
        'category_slug': 'microwaves-ovens',
        'category': 'Microwave & Convection Ovens',
        'subcategory': 'Solo Microwave',
        'brand': 'LG',
        'model': 'MS2043DB',
        'product_name': 'LG 20L Solo Microwave Oven with Intellowave & Anti-Bacterial Cavity',
        'description': 'Compact and reliable 20L Solo Microwave for fast reheating, defrosting, and quick cooking with 44 auto-cook Indian menus.',
        'capacity': '20 Litres',
        'door_type': 'Push Button Door Release',
        'energy_rating': 'Energy Saving Eco-On',
        'compressor_type': 'Intellowave Fast Heating Magnetron',
        'cooling_technology': 'Intellowave 3D Heating',
        'colour': 'Glossy Black',
        'dimensions': '455 x 260 x 320 mm',
        'weight': '10 kg',
        'warranty': '5 Years Magnetron Warranty + Free Maintenance',
        'purchase_price': 7490.00,
        'monthly_rent': 399.00,
        'security_deposit': 400.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 25,
        'condition': 'Excellent',
        'rating': 4.78,
        'review_count': 91,
        'image_url': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.lg.com/in/microwave-ovens/lg-ms2043db',
        'features': [
            'Intellowave 3D heating circulates microwaves for even temperature',
            'Anti-Bacterial EasyClean coating prevents grease buildup',
            '44 Auto Cook Menus including 28 Indian authentic dishes',
            'Keep Warm function maintains food temperature up to 90 mins',
            'Child safety lock'
        ],
        'specifications': {
            'Capacity': '20 L',
            'Microwave Output': '700 Watts',
            'Control Type': 'Membrane Touch Keypad',
            'Turntable Diameter': '245 mm'
        },
        'ai_metadata': {
            'demand_score': 92,
            'season': 'Year-round',
            'utilization_rate': 0.91,
            'target_persona': 'Singles, Bachelors, Office Pantries, Small Kitchens'
        }
    },

    # ==========================================
    # 7. INDUCTION COOKTOPS
    # ==========================================
    {
        'product_id': 'APX-IND-001',
        'category_slug': 'induction-cooktops',
        'category': 'Induction Cooktops',
        'subcategory': 'Induction Stoves',
        'brand': 'Prestige',
        'model': 'PIC 20.0 Deluxe',
        'product_name': 'Prestige Deluxe 2000W Smart Induction Cooktop with Indian Menu',
        'description': 'Prestige 2000W flame-free induction cooktop with automatic voltage regulator, feather touch buttons, and Indian recipe presets.',
        'capacity': 'Heavy-Duty Glass Surface',
        'door_type': 'Flat Countertop Induction Plate',
        'energy_rating': '93% Thermal Efficiency (Flame-Free)',
        'compressor_type': 'Electromagnetic Induction Coil',
        'cooling_technology': 'Dual Heat Sensors with Cooling Fan',
        'colour': 'Black Crystal Glass',
        'dimensions': '380 x 300 x 60 mm',
        'weight': '2.1 kg',
        'warranty': '2 Years Comprehensive Warranty',
        'purchase_price': 3495.00,
        'monthly_rent': 249.00,
        'security_deposit': 300.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 35,
        'condition': 'Brand New',
        'rating': 4.80,
        'review_count': 110,
        'image_url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.prestigexclusive.in/induction-cooktops/pic-20',
        'features': [
            '2000W fast heating brings water to boil in under 2 minutes',
            'Pre-programmed Indian menus: Roti, Dosa, Curry, Idli, Milk Boiled',
            'Automatic Voltage Regulator handles grid fluctuations (130V - 270V)',
            'Anti-magnetic wall blocks extraneous magnetic radiation',
            'Child safety lock and auto-pan detection'
        ],
        'specifications': {
            'Power': '2000 Watts',
            'Plate Material': 'Full Crystal Polished Glass',
            'Display': 'Digital LED Display with Timer',
            'Weight': '2.1 kg'
        },
        'ai_metadata': {
            'demand_score': 96,
            'season': 'Year-round',
            'utilization_rate': 0.95,
            'target_persona': 'Students, Tenants (No LPG connection), Kitchen Backups'
        }
    },

    # ==========================================
    # 8. AIR PURIFIERS
    # ==========================================
    {
        'product_id': 'APX-AP-001',
        'category_slug': 'air-purifiers',
        'category': 'Air Purifiers',
        'subcategory': 'Smart HEPA Purifiers',
        'brand': 'Dyson',
        'model': 'TP07 Purifier Cool',
        'product_name': 'Dyson Purifier Cool TP07 Smart Air Purifier & Tower Fan (HEPA H13)',
        'description': 'Dyson premium tower purifier with fully sealed HEPA H13 filtration capturing 99.95% of ultrafine particles down to 0.1 microns.',
        'capacity': 'Coverage up to 400 sq ft (Air Multiplier)',
        'door_type': 'Bladeless Tower Design',
        'energy_rating': '40W Eco Smart Operation',
        'compressor_type': 'Air Multiplier Bladeless Motor',
        'cooling_technology': '350° Oscillation & Whole Room Purifying',
        'colour': 'White / Silver Metallic',
        'dimensions': '220 x 220 x 1050 mm',
        'weight': '4.99 kg',
        'warranty': '2 Years Dyson Warranty + Free Filter Inspection',
        'purchase_price': 43900.00,
        'monthly_rent': 1799.00,
        'security_deposit': 1500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 14,
        'condition': 'Brand New / Pristine',
        'rating': 4.96,
        'review_count': 68,
        'image_url': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.dyson.in/air-purifiers/dyson-purifier-cool-tp07-white-silver',
        'features': [
            'Whole-machine sealed to HEPA H13 standard (what goes inside stays inside)',
            'Real-time LCD display shows PM2.5, PM10, VOCs, NO2, and humidity',
            'MyDyson app control with Siri and Alexa voice control',
            '350° oscillation projects purified air to every corner of the room',
            'Night mode dims display and operates quietly down to 20 dB'
        ],
        'specifications': {
            'CADR': '390 m³/h',
            'Filter Life': 'Up to 4380 Hours (approx 12 months)',
            'Filtration': 'Borosilicate Glass HEPA + Activated Carbon Filter',
            'Connectivity': 'Wi-Fi, Bluetooth 5.0'
        },
        'ai_metadata': {
            'demand_score': 99,
            'season': 'Winter Peak (Delhi NCR / North India Smog Season)',
            'utilization_rate': 0.98,
            'target_persona': 'Asthma/Allergy Patients, Premium Homes, Pet Owners'
        }
    },
    {
        'product_id': 'APX-AP-002',
        'category_slug': 'air-purifiers',
        'category': 'Air Purifiers',
        'subcategory': 'HEPA Purifiers',
        'brand': 'Philips',
        'model': 'AC1215/20',
        'product_name': 'Philips Series 1000 Smart Air Purifier with NanoProtect HEPA',
        'description': 'High-performance bedroom air purifier with NanoProtect HEPA filter removing 99.97% particles down to 0.003 microns in under 12 minutes.',
        'capacity': 'Coverage up to 333 sq ft (Master Bedroom)',
        'door_type': 'Compact Floor Standing',
        'energy_rating': '50W Energy Efficient',
        'compressor_type': 'High-Speed Aerodynamic Fan',
        'cooling_technology': 'VitaShield IPS Purification',
        'colour': 'Alpine White',
        'dimensions': '325 x 211 x 543 mm',
        'weight': '5.3 kg',
        'warranty': '2 Years Comprehensive Warranty + Free Filter Servicing',
        'purchase_price': 11995.00,
        'monthly_rent': 699.00,
        'security_deposit': 600.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 20,
        'condition': 'Excellent',
        'rating': 4.83,
        'review_count': 94,
        'image_url': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.philips.co.in/c-p/AC1215_20/1000-series-air-purifier',
        'features': [
            'NanoProtect HEPA + Active Carbon filter eliminates PM2.5 and allergens',
            'Night sensing mode constantly monitors air quality while you sleep',
            'Color ring indicator (Blue, Purple, Pink, Red) shows real-time AQI',
            'Child lock prevents unintended changes in settings',
            'CADR of 270 m³/h purifies a standard room in just 12 mins'
        ],
        'specifications': {
            'CADR (Smoke)': '270 m³/h',
            'Noise Level': '33 dB (Silent Sleep Mode)',
            'Filter Replacement Alert': 'Healthy Air Protect Alert'
        },
        'ai_metadata': {
            'demand_score': 95,
            'season': 'Winter / Year-round',
            'utilization_rate': 0.93,
            'target_persona': 'Bedrooms, Children Rooms, Elderly Care'
        }
    },

    # ==========================================
    # 9. AIR COOLERS
    # ==========================================
    {
        'product_id': 'APX-CL-001',
        'category_slug': 'air-coolers',
        'category': 'Air Coolers',
        'subcategory': 'Desert Coolers',
        'brand': 'Symphony',
        'model': 'Diet 3D 55i',
        'product_name': 'Symphony Diet 3D 55L Smart Tower Air Cooler with i-Pure Technology',
        'description': 'Slim tower air cooler with 3-side honeycomb pads, magnetic remote control, multi-stage air purification, and low power inverter draw.',
        'capacity': '55 Litres Water Tank',
        'door_type': 'Tower Design with 360° Castor Wheels',
        'energy_rating': '145W Inverter Friendly (Low Electricity)',
        'compressor_type': 'Dura-Pump Heavy Duty Motor',
        'cooling_technology': '3D Honeycomb Cooling Pads & Ice Chamber',
        'colour': 'Classic White & Black',
        'dimensions': '380 x 360 x 1340 mm',
        'weight': '10.5 kg',
        'warranty': '1 Year Free Maintenance & Pump Warranty',
        'purchase_price': 11499.00,
        'monthly_rent': 499.00,
        'security_deposit': 500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 25,
        'condition': 'Excellent',
        'rating': 4.79,
        'review_count': 78,
        'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://symphonylimited.com/products/diet-3d-55i',
        'features': [
            'i-Pure Technology integrates allergy, bacteria, and PM2.5 filters',
            '3-Side 3D Honeycomb pads ensure 30% higher cooling efficiency',
            'Pop-up touchscreen panel with full function magnetic remote',
            'Consumes only 145W—runs easily on basic home inverters',
            'Dedicated ice chamber for instant chill breeze'
        ],
        'specifications': {
            'Tank Capacity': '55 Litres with Water Level Indicator',
            'Air Delivery': '1250 m³/hr (Cooling Area up to 16 sq meters)',
            'Power Consumption': '145 Watts',
            'Blower/Fan': 'High-Efficiency Powerful Blower'
        },
        'ai_metadata': {
            'demand_score': 96,
            'season': 'Summer (March - June)',
            'utilization_rate': 0.94,
            'target_persona': 'Cost-Conscious Tenants, Living Rooms, High-Ventilation Rooms'
        }
    },

    # ==========================================
    # 10. VACUUM CLEANERS
    # ==========================================
    {
        'product_id': 'APX-VC-001',
        'category_slug': 'vacuum-cleaners',
        'category': 'Vacuum Cleaners',
        'subcategory': 'Cordless Stick Vacuum',
        'brand': 'Dyson',
        'model': 'V12 Detect Slim',
        'product_name': 'Dyson V12 Detect Slim Cordless Vacuum Cleaner with Laser Illumination',
        'description': 'Lightweight 2.2kg cordless stick vacuum with Fluffy Optic laser head revealing invisible dust on hard floors and piezo dust particle sensor.',
        'capacity': '0.35L Bin with Point & Shoot Emptying',
        'door_type': 'Cordless Handheld / Stick Modular',
        'energy_rating': '60 Minutes Fade-Free Battery Runtime',
        'compressor_type': 'Dyson Hyperdymium Motor (125,000 RPM)',
        'cooling_technology': 'Root Cyclone Technology (100,000g g-force)',
        'colour': 'Nickel / Yellow',
        'dimensions': '250 x 252 x 1234 mm',
        'weight': '2.2 kg',
        'warranty': '2 Years Dyson Warranty + Free Battery Health AMC',
        'purchase_price': 52900.00,
        'monthly_rent': 1999.00,
        'security_deposit': 2000.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 12,
        'condition': 'Brand New / Pristine',
        'rating': 4.97,
        'review_count': 56,
        'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.dyson.in/vacuum-cleaners/cordless-vacuums/dyson-v12-detect-slim',
        'features': [
            'Illuminated cleaner head reveals 2x more invisible dust',
            'Piezo sensor counts and measures dust particle sizes in real time',
            'Single-button power control without having to hold the trigger',
            'Motorbar cleaner head with de-tangling vanes clears wrapped hair automatically',
            'Whole-machine filtration traps 99.99% of particles down to 0.3 microns'
        ],
        'specifications': {
            'Suction Power': '150 Air Watts (AW)',
            'Runtime': 'Up to 60 Minutes (Eco Mode)',
            'Charge Time': '4 Hours',
            'Weight': '2.2 kg (Ultra-Lightweight)'
        },
        'ai_metadata': {
            'demand_score': 91,
            'season': 'Year-round / Diwali & Spring Cleaning',
            'utilization_rate': 0.87,
            'target_persona': 'Pet Owners, Modern Apartments, Deep Cleaners'
        }
    },
    {
        'product_id': 'APX-VC-002',
        'category_slug': 'vacuum-cleaners',
        'category': 'Vacuum Cleaners',
        'subcategory': 'Robot Vacuum',
        'brand': 'Ecovacs',
        'model': 'Deebot N8 Pro',
        'product_name': 'Ecovacs Deebot N8 Pro Robot Vacuum Cleaner & Mop with LiDAR Laser',
        'description': '2-in-1 Smart Robot Vacuum & Auto-Mop with TrueMapping LiDAR navigation, 2600Pa high suction, and multi-floor 3D obstacle avoidance.',
        'capacity': '420ml Dustbin & 240ml Electronic Water Tank',
        'door_type': 'Autonomous Robot Disc',
        'energy_rating': '110 Minutes Continuous Cleaning',
        'compressor_type': 'Brushless Suction Motor (2600Pa)',
        'cooling_technology': 'TrueDetect 3D Laser Scanning',
        'colour': 'Pure Pearl White',
        'dimensions': '353 x 353 x 93 mm',
        'weight': '3.6 kg',
        'warranty': '2 Years AMC + Free Brush & Mop Pad Replacements',
        'purchase_price': 31900.00,
        'monthly_rent': 1299.00,
        'security_deposit': 1200.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 15,
        'condition': 'Brand New',
        'rating': 4.88,
        'review_count': 63,
        'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.ecovacs.com/in/deebot-robotic-vacuum-cleaner/DEEBOT-N8-PRO',
        'features': [
            'Simultaneous Vacuum and Electronic Ozmo Mopping in one single pass',
            'LiDAR TrueMapping maps entire home with 4x greater accuracy',
            'Auto-carpet detection boosts suction and avoids wet mopping on rugs',
            'App-controlled customized room cleaning, virtual boundaries & scheduling',
            'Automatic return to charging dock when battery is low'
        ],
        'specifications': {
            'Suction Power': '2600 Pa High Power',
            'Battery Capacity': '3200 mAh Lithium',
            'Noise Level': '67 dB'
        },
        'ai_metadata': {
            'demand_score': 94,
            'season': 'Year-round',
            'utilization_rate': 0.90,
            'target_persona': 'Working Professionals, Tech Enthusiasts, Large Flats'
        }
    },

    # ==========================================
    # 11. DISHWASHERS
    # ==========================================
    {
        'product_id': 'APX-DW-001',
        'category_slug': 'dishwashers',
        'category': 'Dishwashers',
        'subcategory': 'Freestanding Dishwashers',
        'brand': 'Bosch',
        'model': 'SMS66GI01I',
        'product_name': 'Bosch 13 Place Setting Freestanding Dishwasher with Intensive Kadhai 70°',
        'description': 'Designed specifically for Indian kitchens with Intensive Kadhai 70° program for oily masala stains, AquaSensor, and EcoSilence Drive.',
        'capacity': '13 Place Settings',
        'door_type': 'Front Pull Down Stainless Door',
        'energy_rating': 'A++ European Energy Rating',
        'compressor_type': 'EcoSilence Drive Frictionless Motor',
        'cooling_technology': 'DosageAssist & Zeolith Drying',
        'colour': 'Silver Inox Anti-Fingerprint',
        'dimensions': '600 x 600 x 845 mm',
        'weight': '48 kg',
        'warranty': '10 Years Rust-Through Warranty + Free Plumbing AMC',
        'purchase_price': 44990.00,
        'monthly_rent': 1499.00,
        'security_deposit': 1500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 16,
        'condition': 'Brand New / Pristine',
        'rating': 4.93,
        'review_count': 71,
        'image_url': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.bosch-home.in/products-list/dishwashers/freestanding-dishwashers/SMS66GI01I',
        'features': [
            'Intensive Kadhai 70°C cleans stubborn oil, burnt grease & curry stains',
            'Saves up to 80% water compared to manual hand washing (uses only 9.5L per cycle)',
            'VarioSpeed Plus cleans and dries dishes in 1/3 the normal time',
            'Glass Care protection system for delicate wine glasses and bone china',
            'Adjustable top basket creates space for large pressure cookers & kadhais'
        ],
        'specifications': {
            'Capacity': '13 Place Settings (holds up to 110 utensils)',
            'Water Consumption': '9.5 Litres per Eco Cycle',
            'Noise Level': '44 dB (Ultra Quiet)',
            'Wash Programs': '6 Programs (Intensive 70°, Express Sparkle, Eco, Auto, Quick)'
        },
        'ai_metadata': {
            'demand_score': 95,
            'season': 'Year-round / Festive',
            'utilization_rate': 0.92,
            'target_persona': 'Working Couples, Modern Kitchens, Large Families'
        }
    },

    # ==========================================
    # 12. WATER HEATERS & GEYSERS
    # ==========================================
    {
        'product_id': 'APX-WH-001',
        'category_slug': 'water-heaters',
        'category': 'Water Heaters & Geysers',
        'subcategory': 'Storage Geysers',
        'brand': 'AO Smith',
        'model': 'HSE-HAS-025',
        'product_name': 'AO Smith 25L 5 Star Storage Water Geyser with Blue Diamond Glass Tank',
        'description': 'Premium 25L storage water heater with Blue Diamond glass lining for maximum corrosion protection against hard water and 8-bar pressure rating.',
        'capacity': '25 Litres Storage',
        'door_type': 'Wall Vertical Mount',
        'energy_rating': '5 Star BEE Energy Rating',
        'compressor_type': 'Glass-Coated Incoloy Heating Element',
        'cooling_technology': 'Thermal Cut-out & Safety Valve',
        'colour': 'White with Glossy Gloss Finish',
        'dimensions': '444 x 444 x 509 mm',
        'weight': '13 kg',
        'warranty': '7 Years Inner Tank Warranty + Free Plumbing AMC',
        'purchase_price': 13490.00,
        'monthly_rent': 499.00,
        'security_deposit': 500.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 22,
        'condition': 'Brand New',
        'rating': 4.89,
        'review_count': 89,
        'image_url': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.aosmithindia.com/water-heaters/hse-has-025',
        'features': [
            'Blue Diamond Glass Lining resists hard water scaling and corrosion',
            'Customized Alloy Heating Element heats water 33% faster',
            '8-Bar Pressure Rating ideal for high-rise apartment water pressure',
            'Anode Rod with stainless steel core lasts 2x longer than regular anodes',
            'High-density PUF insulation maintains hot water temperature all night'
        ],
        'specifications': {
            'Capacity': '25 Litres',
            'Wattage': '2000 Watts',
            'Rated Pressure': '8 Bar (0.8 MPa)',
            'Temperature Range': '25°C - 75°C'
        },
        'ai_metadata': {
            'demand_score': 98,
            'season': 'Winter Peak (October - February)',
            'utilization_rate': 0.96,
            'target_persona': 'Bathrooms, High-Rise Apartments, Joint Families'
        }
    },

    # ==========================================
    # 13. KITCHEN SMALL APPLIANCES
    # ==========================================
    {
        'product_id': 'APX-KIT-001',
        'category_slug': 'small-kitchen',
        'category': 'Kitchen Small Appliances',
        'subcategory': 'Mixer Grinders',
        'brand': 'Philips',
        'model': 'HL7756/00',
        'product_name': 'Philips 750W Turbo Juicer Mixer Grinder with 3 Stainless Steel Jars',
        'description': 'Heavy-duty 750W Turbo motor mixer grinder engineered for tough Indian grinding tasks like black gram dal batter, chutneys, and dry spices.',
        'capacity': '3 Jars (1.5L Wet, 1.0L Multipurpose, 0.3L Chutney)',
        'door_type': 'Countertop Appliance',
        'energy_rating': 'Continuous 25 Min Grinding Certified',
        'compressor_type': '750W Turbo Copper Motor',
        'cooling_technology': 'Advanced Air Ventilation System',
        'colour': 'Black & Metallic Grey',
        'dimensions': '370 x 210 x 260 mm',
        'weight': '3.2 kg',
        'warranty': '2 Years Comprehensive + 5 Years Motor Warranty',
        'purchase_price': 3995.00,
        'monthly_rent': 249.00,
        'security_deposit': 300.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 35,
        'condition': 'Brand New',
        'rating': 4.84,
        'review_count': 142,
        'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.philips.co.in/c-p/HL7756_00/mixer-grinder-750w',
        'features': [
            '750W Turbo motor grinds hard ingredients (turmeric/dal) seamlessly',
            'Leak-proof jars with specialized rubber gaskets',
            'Triangular body shape for compact kitchen counter placement',
            'Overload protector button trips automatically during heavy loads'
        ],
        'specifications': {
            'Motor Power': '750 Watts',
            'Speed Settings': '3 Speeds with Incher Pulse',
            'Jar Material': '100% Food-Grade Rust-Free Stainless Steel'
        },
        'ai_metadata': {
            'demand_score': 97,
            'season': 'Year-round',
            'utilization_rate': 0.95,
            'target_persona': 'Daily Cooking, Indian Homes, Bachelors'
        }
    },

    # ==========================================
    # 14. FANS
    # ==========================================
    {
        'product_id': 'APX-FAN-001',
        'category_slug': 'fans',
        'category': 'Fans & BLDC Coolers',
        'subcategory': 'BLDC Ceiling Fans',
        'brand': 'Atomberg',
        'model': 'Renesa 1200mm',
        'product_name': 'Atomberg Renesa 1200mm Smart BLDC Motor Ceiling Fan with Remote',
        'description': 'Super-efficient 28W BLDC motor ceiling fan with LED speed display, Boost mode, sleep timer, and up to 65% electricity savings.',
        'capacity': '1200 mm Sweep (48 Inch)',
        'door_type': 'Ceiling Mount Fan',
        'energy_rating': '5 Star BEE BLDC (Saves ₹1,500/year in power)',
        'compressor_type': 'Brushless DC (BLDC) Motor',
        'cooling_technology': 'Aerodynamic Aluminum Ribbed Blades',
        'colour': 'Midnight Black & Wood Finish',
        'dimensions': '1200 x 1200 x 310 mm',
        'weight': '4.1 kg',
        'warranty': '3 Years Comprehensive On-Site Warranty',
        'purchase_price': 3890.00,
        'monthly_rent': 199.00,
        'security_deposit': 200.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 40,
        'condition': 'Brand New',
        'rating': 4.90,
        'review_count': 118,
        'image_url': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://atomberg.com/renesa-ceiling-fan/',
        'features': [
            'Consumes only 28 Watts at top speed (compared to 75W regular fans)',
            'Smart Remote with Timer (1h/2h/3h/6h) & Sleep Mode',
            'Runs 3x longer on home inverter battery backup',
            'Consistent speed output even during low voltage fluctuations (140V-285V)',
            'No humming noise due to precision BLDC electromagnetic drive'
        ],
        'specifications': {
            'Sweep Size': '1200 mm (48")',
            'Air Delivery': '235 CMM (High Airflow)',
            'Speed': '360 RPM',
            'Power Consumption': '28W (Speed 5) to 6W (Speed 1)'
        },
        'ai_metadata': {
            'demand_score': 98,
            'season': 'Summer / Year-round',
            'utilization_rate': 0.96,
            'target_persona': 'Eco-conscious Homes, Bedrooms, Living Rooms'
        }
    },

    # ==========================================
    # 15. IRONS & GARMENT STEAMERS
    # ==========================================
    {
        'product_id': 'APX-IRN-001',
        'category_slug': 'irons-steamers',
        'category': 'Irons & Garment Steamers',
        'subcategory': 'Steam Irons',
        'brand': 'Philips',
        'model': 'GC1905/21',
        'product_name': 'Philips 1440W Continuous Steam Iron with Non-Stick Aluminum Soleplate',
        'description': 'Fast-heating Philips 1440W steam iron with continuous 13g/min steam output, fine water spray, and easy Calc-Clean function.',
        'capacity': '180 ml Water Tank',
        'door_type': 'Handheld Garment Appliance',
        'energy_rating': 'Fast Heat-Up in 20s',
        'compressor_type': 'Die-Cast Aluminum Heating Plate',
        'cooling_technology': 'Continuous Steam Venting',
        'colour': 'Sky Blue & White',
        'dimensions': '261 x 115 x 136 mm',
        'weight': '1.06 kg',
        'warranty': '2 Years Replacement Warranty',
        'purchase_price': 1795.00,
        'monthly_rent': 149.00,
        'security_deposit': 150.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 35,
        'condition': 'Brand New',
        'rating': 4.77,
        'review_count': 102,
        'image_url': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.philips.co.in/c-p/GC1905_21/steam-iron',
        'features': [
            '1440W power enables rapid heating and constant high steam output',
            'Continuous steam up to 13g/min smoothly removes deep fabric creases',
            'Easy-fill water tank with large filling hole',
            'Calc-Clean slider easily removes mineral scale from the iron',
            'Pointed tip easily reaches buttons, collars, and pleats'
        ],
        'specifications': {
            'Power': '1440 Watts',
            'Continuous Steam': '13 g/min',
            'Soleplate': 'Linished Non-Stick Aluminum Plate',
            'Cord Length': '1.8 Meters (360° Swivel)'
        },
        'ai_metadata': {
            'demand_score': 92,
            'season': 'Year-round',
            'utilization_rate': 0.89,
            'target_persona': 'Office Commuters, Students, Daily Wardrobe Care'
        }
    },

    # ==========================================
    # 16. HOME ENTERTAINMENT & AUDIO
    # ==========================================
    {
        'product_id': 'APX-AUD-001',
        'category_slug': 'soundbars-audio',
        'category': 'Home Entertainment & Audio',
        'subcategory': '5.1 Soundbars',
        'brand': 'Sony',
        'model': 'HT-S40R',
        'product_name': 'Sony 600W 5.1ch Real Surround Soundbar with Wireless Rear Speakers',
        'description': '600W real 5.1 surround home cinema system with 3-channel soundbar, rear satellite speakers, and wired subwoofer for true Dolby Digital audio.',
        'capacity': '600 Watts Total Power Output',
        'door_type': 'Multi-Speaker Home Theatre Suite',
        'energy_rating': 'Eco Standby Power (<0.5W)',
        'compressor_type': 'Digital S-Master Amplifier',
        'cooling_technology': 'Bass Reflex Air Port',
        'colour': 'Classic Diamond Mesh Black',
        'dimensions': 'Soundbar: 900 x 52 x 74.5 mm, Sub: 192 x 387 x 366 mm',
        'weight': '12.8 kg Total System',
        'warranty': '2 Years Sony Warranty + Audio Setup AMC',
        'purchase_price': 27990.00,
        'monthly_rent': 899.00,
        'security_deposit': 800.00,
        'min_tenure_months': 3,
        'availability_status': 'Available',
        'quantity': 20,
        'condition': 'Brand New / Pristine',
        'rating': 4.91,
        'review_count': 64,
        'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
        'official_product_url': 'https://www.sony.co.in/electronics/sound-bars/ht-s40r',
        'features': [
            '600W total power with 5.1 discrete physical audio channels',
            'Wireless rear speakers minimize cable clutter across the living room',
            'Dolby Digital technology delivers dramatic 360° theater sound',
            'HDMI ARC, Optical input, Analog audio, and Bluetooth 5.0 streaming',
            'Dedicated Cinema, Music, Voice, and Night sound presets'
        ],
        'specifications': {
            'Total Power': '600 Watts',
            'Channels': '5.1ch (3ch Bar + 2 Rear + 1 Sub)',
            'Connectivity': 'HDMI ARC, Optical In, USB, Bluetooth 5.0',
            'Audio Format': 'Dolby Digital, Dolby Dual Mono, LPCM 2ch'
        },
        'ai_metadata': {
            'demand_score': 94,
            'season': 'Festive / Weekend / World Cup Seasons',
            'utilization_rate': 0.90,
            'target_persona': 'Movie Enthusiasts, Gamers, Smart TV Renters'
        }
    }
]

def generate_all_catalog_artifacts():
    print("[INFO] Starting generation of APPLINEX Complete Enterprise Catalog...")
    
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)

    # 1. Update Django Database Categories
    cat_db_map = {}
    for c in CATEGORIES_MASTER:
        cat_obj, created = Category.objects.get_or_create(
            slug=c['slug'],
            defaults=c
        )
        if not created:
            for k, v in c.items():
                setattr(cat_obj, k, v)
            cat_obj.save()
        cat_db_map[c['slug']] = cat_obj

    print(f"[SUCCESS] {len(cat_db_map)} Categories synced into Django Database.")

    # 2. Update Django Database Products
    synced_count = 0
    for p in PRODUCTS_MASTER:
        cat_obj = cat_db_map.get(p['category_slug'])
        if not cat_obj:
            continue
        
        app_obj, created = Appliance.objects.get_or_create(
            appliance_code=p['product_id'],
            defaults={
                'name': p['product_name'],
                'category': cat_obj,
                'subcategory': p['subcategory'],
                'appliance_type': p.get('door_type', p['subcategory']),
                'brand': p['brand'],
                'model_number': p['model'],
                'monthly_price': p['monthly_rent'],
                'security_deposit': p['security_deposit'],
                'status': 'available' if p['availability_status'] == 'Available' else 'rented',
                'rating': p['rating'],
                'reviews_count': p['review_count'],
                'featured': p['rating'] >= 4.88,
                'image_url': p['image_url'],
                'gallery_images': [p['image_url']],
                'capacity': p['capacity'],
                'energy_rating': p['energy_rating'],
                'dimensions': p['dimensions'],
                'power_consumption': p.get('power_consumption', 'Energy Efficient'),
                'warranty_period': p['warranty'],
                'features': p['features'],
                'specifications': p['specifications'],
                'description': p['description']
            }
        )
        if not created:
            app_obj.name = p['product_name']
            app_obj.category = cat_obj
            app_obj.subcategory = p['subcategory']
            app_obj.brand = p['brand']
            app_obj.model_number = p['model']
            app_obj.monthly_price = p['monthly_rent']
            app_obj.security_deposit = p['security_deposit']
            app_obj.rating = p['rating']
            app_obj.reviews_count = p['review_count']
            app_obj.features = p['features']
            app_obj.specifications = p['specifications']
            app_obj.description = p['description']
            app_obj.warranty_period = p['warranty']
            app_obj.save()
        synced_count += 1

    print(f"[SUCCESS] {synced_count} Products synced into Django Database.")

    # 3. Export JSON Catalog
    json_path = os.path.join(data_dir, 'applinex_catalog.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'project': 'APPLINEX',
            'version': '2.0.0',
            'generated_at': datetime.datetime.now().isoformat(),
            'total_categories': len(CATEGORIES_MASTER),
            'total_products': len(PRODUCTS_MASTER),
            'categories': CATEGORIES_MASTER,
            'products': PRODUCTS_MASTER
        }, f, indent=2, ensure_ascii=False)
    print(f"[EXPORT] JSON Catalog saved to {json_path}")

    # 4. Export CSV Catalog
    csv_path = os.path.join(data_dir, 'applinex_catalog.csv')
    fieldnames = [
        'product_id', 'category', 'subcategory', 'brand', 'model', 'product_name',
        'capacity', 'energy_rating', 'purchase_price', 'monthly_rent', 'security_deposit',
        'min_tenure_months', 'availability_status', 'quantity', 'condition', 'rating',
        'review_count', 'image_url', 'official_product_url', 'warranty'
    ]
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in PRODUCTS_MASTER:
            writer.writerow({
                'product_id': p['product_id'],
                'category': p['category'],
                'subcategory': p['subcategory'],
                'brand': p['brand'],
                'model': p['model'],
                'product_name': p['product_name'],
                'capacity': p['capacity'],
                'energy_rating': p['energy_rating'],
                'purchase_price': p['purchase_price'],
                'monthly_rent': p['monthly_rent'],
                'security_deposit': p['security_deposit'],
                'min_tenure_months': p['min_tenure_months'],
                'availability_status': p['availability_status'],
                'quantity': p['quantity'],
                'condition': p['condition'],
                'rating': p['rating'],
                'review_count': p['review_count'],
                'image_url': p['image_url'],
                'official_product_url': p['official_product_url'],
                'warranty': p['warranty']
            })
    print(f"[EXPORT] CSV Catalog saved to {csv_path}")

    # 5. Export MongoDB Document Catalog
    mongo_json_path = os.path.join(data_dir, 'applinex_mongodb_catalog.json')
    with open(mongo_json_path, 'w', encoding='utf-8') as f:
        json.dump(PRODUCTS_MASTER, f, indent=2, ensure_ascii=False)
    print(f"[EXPORT] MongoDB Document Catalog saved to {mongo_json_path}")

    # 6. Export MongoDB Mongoose Schema
    mongo_schema_path = os.path.join(data_dir, 'applinex_mongodb_schema.js')
    mongo_schema_content = """const mongoose = require('mongoose');

const ApplianceSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true, index: true },
  category_slug: { type: String, required: true, index: true },
  subcategory: { type: String, required: true },
  brand: { type: String, required: true, index: true },
  model: { type: String, required: true },
  product_name: { type: String, required: true, text: true },
  description: { type: String, required: true },
  capacity: { type: String, default: '' },
  energy_rating: { type: String, default: '5 Star' },
  compressor_type: { type: String, default: '' },
  cooling_technology: { type: String, default: '' },
  colour: { type: String, default: 'Silver / Inox' },
  dimensions: { type: String, default: '' },
  weight: { type: String, default: '' },
  warranty: { type: String, required: true },
  
  // Rental Pricing & Inventory
  purchase_price: { type: Number, required: true },
  monthly_rent: { type: Number, required: true, index: true },
  security_deposit: { type: Number, required: true },
  min_tenure_months: { type: Number, default: 3 },
  availability_status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available', index: true },
  quantity: { type: Number, default: 10 },
  condition: { type: String, default: 'Brand New' },
  rating: { type: Number, default: 4.8 },
  review_count: { type: Number, default: 0 },
  
  // Media & URLs
  image_url: { type: String, required: true },
  gallery_images: [{ type: String }],
  official_product_url: { type: String, required: true },
  
  // Flexible Specifications & Features
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  
  // AI & Demand Forecasting Metadata
  ai_metadata: {
    demand_score: { type: Number, default: 85 },
    season: { type: String, default: 'Year-round' },
    utilization_rate: { type: Number, default: 0.85 },
    target_persona: { type: String, default: 'General Household' }
  }
}, {
  timestamps: true
});

ApplianceSchema.index({ product_name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Appliance', ApplianceSchema);
"""
    with open(mongo_schema_path, 'w', encoding='utf-8') as f:
        f.write(mongo_schema_content)
    print(f"[EXPORT] MongoDB Mongoose Schema saved to {mongo_schema_path}")

    # 7. Export SQL Schema (PostgreSQL / MySQL / SQLite compatible)
    sql_schema_path = os.path.join(data_dir, 'applinex_sql_schema.sql')
    sql_content = """-- ==========================================================
-- APPLINEX Enterprise Appliance Rental Database Schema
-- Compatible with PostgreSQL, MySQL 8+, SQLite
-- ==========================================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    icon_name VARCHAR(50) DEFAULT 'Box',
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appliances (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    subcategory VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    capacity VARCHAR(100),
    energy_rating VARCHAR(50) DEFAULT '5 Star',
    colour VARCHAR(100),
    dimensions VARCHAR(150),
    weight VARCHAR(50),
    warranty TEXT NOT NULL,
    
    -- Rental Pricing & Commercials
    purchase_price DECIMAL(10, 2) NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
    min_tenure_months INT DEFAULT 3,
    availability_status VARCHAR(20) DEFAULT 'Available',
    quantity INT DEFAULT 10,
    condition VARCHAR(50) DEFAULT 'Brand New',
    rating DECIMAL(3, 2) DEFAULT 4.80,
    review_count INT DEFAULT 0,
    
    -- Media & URLs
    image_url VARCHAR(500) NOT NULL,
    official_product_url VARCHAR(500) NOT NULL,
    
    -- JSON Fields for Rich Specs & AI Telemetry
    features JSONB,
    specifications JSONB,
    ai_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appliances_cat ON appliances(category_id);
CREATE INDEX idx_appliances_brand ON appliances(brand);
CREATE INDEX idx_appliances_rent ON appliances(monthly_rent);
CREATE INDEX idx_appliances_avail ON appliances(availability_status);
"""
    with open(sql_schema_path, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"[EXPORT] SQL Schema saved to {sql_schema_path}")

    print("\n=======================================================")
    print(f" APPLINEX Catalog Successfully Built & Exported!")
    print(f" Total Categories : {Category.objects.count()}")
    print(f" Total Appliances : {Appliance.objects.count()}")
    print("=======================================================\n")

if __name__ == '__main__':
    generate_all_catalog_artifacts()
