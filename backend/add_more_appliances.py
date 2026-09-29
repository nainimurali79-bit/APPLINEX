import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applinex.settings')
django.setup()

from apps.appliances.models import Category, Appliance

def add_comprehensive_appliances():
    print("[INFO] Adding new RentoMojo-style Appliance Categories and Products...")

    # 1. New Categories
    new_categories = [
        {
            'name': 'Laptops & WFH Tech',
            'slug': 'laptops-wfh',
            'icon_name': 'Laptop',
            'description': 'High-performance workstations, Apple MacBooks, 4K monitors & ergonomic home office setups.',
            'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Appliance Combos & Packages',
            'slug': 'appliance-combos',
            'icon_name': 'Package',
            'description': 'Curated all-in-one home appliance bundles for 1BHK, 2BHK, and summer cooling at discounted rates.',
            'image_url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Soundbars & Home Audio',
            'slug': 'soundbars-audio',
            'icon_name': 'Volume2',
            'description': 'Immersive Dolby Atmos soundbars, wireless subwoofers, and premium home theater audio systems.',
            'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Small Kitchen Appliances',
            'slug': 'small-kitchen',
            'icon_name': 'Coffee',
            'description': 'Digital air fryers, induction cooktops, espresso machines, and multi-cookers for smart kitchens.',
            'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80'
        }
    ]

    for cat_data in new_categories:
        cat_obj, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if not created:
            for k, v in cat_data.items():
                setattr(cat_obj, k, v)
            cat_obj.save()
        print(f"  [CATEGORY] {'Created' if created else 'Updated'} {cat_obj.name}")

    # Fetch all categories
    cat_map = {c.slug: c for c in Category.objects.all()}

    # 2. Appliances Dataset
    new_appliances = [
        # --- LAPTOPS & WFH TECH ---
        {
            'appliance_code': 'AP-WFH-01',
            'name': 'Apple MacBook Pro 14" M3 Chip (16GB Unified Memory, 512GB SSD)',
            'category': cat_map['laptops-wfh'],
            'subcategory': 'Laptops',
            'appliance_type': 'Apple Silicon M3 Pro',
            'brand': 'Apple',
            'model_number': 'MRX33HN/A',
            'monthly_price': 3499.00,
            'security_deposit': 3000.00,
            'status': 'available',
            'rating': 4.95,
            'reviews_count': 64,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '14.2 Inch Liquid Retina XDR',
            'energy_rating': '22 Hours Battery Life',
            'dimensions': '31.26 x 22.12 x 1.55 cm',
            'power_consumption': '70W USB-C Fast Charging',
            'warranty_period': 'AppleCare+ Coverage with Free Replacement',
            'features': [
                'Apple M3 chip with 8-core CPU and 10-core GPU',
                '14.2-inch Liquid Retina XDR display with ProMotion 120Hz',
                '16GB unified memory for seamless multitasking & video editing',
                '1080p FaceTime HD camera with studio-quality three-mic array',
                'Six-speaker sound system with Spatial Audio'
            ],
            'specifications': {
                'Processor': 'Apple M3 8-Core',
                'RAM': '16GB Unified',
                'Storage': '512GB NVMe SSD',
                'Display': 'Liquid Retina XDR (3024 x 1964)',
                'Weight': '1.55 kg'
            },
            'description': 'Supercharged by Apple M3 architecture. Incredible power efficiency, extraordinary dynamic range display, and all-day battery life for developers, creators, and professionals.'
        },
        {
            'appliance_code': 'AP-WFH-02',
            'name': 'Lenovo ThinkPad X1 Carbon Gen 11 (Intel Core i7 13th Gen, 16GB, 1TB SSD)',
            'category': cat_map['laptops-wfh'],
            'subcategory': 'Enterprise Laptops',
            'appliance_type': 'Ultralight Business Laptop',
            'brand': 'Lenovo',
            'model_number': '21HM001QIG',
            'monthly_price': 2799.00,
            'security_deposit': 2500.00,
            'status': 'available',
            'rating': 4.88,
            'reviews_count': 49,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '14.0 Inch WUXGA IPS (1920x1200)',
            'energy_rating': 'Evo Certified (15h Battery)',
            'dimensions': '315.6 x 222.5 x 15.36 mm',
            'power_consumption': '65W RapidCharge AC Adapter',
            'warranty_period': 'Premier Onsite Support & Accidental Damage Protection',
            'features': [
                '13th Gen Intel Core i7-1355U vPro Enterprise Processor',
                'Carbon fiber chassis weighing only 1.12 kg',
                'Legendary spill-resistant ThinkPad keyboard with TrackPoint',
                'FHD + IR webcam with privacy shutter & human presence detection',
                'Dual Thunderbolt 4 and Wi-Fi 6E connectivity'
            ],
            'specifications': {
                'Processor': 'Intel Core i7-1355U',
                'Memory': '16GB LPDDR5 6400MHz',
                'Storage': '1TB M.2 PCIe 4.0 NVMe SSD',
                'Security': 'dTPM 2.0 + Fingerprint Reader',
                'Weight': '1.12 kg'
            },
            'description': 'The gold standard in business computing. Ultra-lightweight carbon fiber build, military-spec durability, and unmatched keyboard comfort.'
        },
        {
            'appliance_code': 'AP-WFH-03',
            'name': 'Dell UltraSharp 27" 4K UHD USB-C Hub Monitor (IPS Black, HDR400)',
            'category': cat_map['laptops-wfh'],
            'subcategory': 'Monitors & Displays',
            'appliance_type': '4K Color-Accurate Hub Display',
            'brand': 'Dell',
            'model_number': 'U2723QE',
            'monthly_price': 1199.00,
            'security_deposit': 1000.00,
            'status': 'available',
            'rating': 4.92,
            'reviews_count': 38,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '27.0 Inch 4K UHD (3840 x 2160)',
            'energy_rating': 'Energy Star Certified',
            'dimensions': '611.4 x 385.2 x 185.0 mm',
            'power_consumption': '90W Power Delivery over USB-C',
            'warranty_period': 'Premium Panel Exchange & Free Replacement',
            'features': [
                'IPS Black technology with 2000:1 contrast ratio',
                '98% DCI-P3 wide color gamut with factory calibration',
                'Single-cable USB-C connectivity with 90W laptop charging',
                'Built-in RJ45 Ethernet, KVM switch, and multiple USB-A/C ports',
                'Fully ergonomic stand (Height, Tilt, Swivel, Pivot)'
            ],
            'specifications': {
                'Resolution': '3840 x 2160 @ 60Hz',
                'Aspect Ratio': '16:9',
                'Brightness': '400 cd/m²',
                'Color Support': '1.07 Billion Colors',
                'Ports': 'USB-C (90W PD), DisplayPort 1.4, HDMI 2.0, RJ45'
            },
            'description': 'Elevate your productivity with Dell UltraSharp 4K. Experience exceptional color depth, 90W single-cable laptop power delivery, and built-in networking.'
        },

        # --- APPLIANCE COMBOS & ROOM PACKAGES ---
        {
            'appliance_code': 'AP-CMB-01',
            'name': '1BHK Complete Appliance Essential Pack (Fridge + Washer + 43" Smart TV)',
            'category': cat_map['appliance-combos'],
            'subcategory': 'Home Packages',
            'appliance_type': 'All-in-One Home Bundle',
            'brand': 'ApplineX Curated Bundle',
            'model_number': 'APX-1BHK-PKG',
            'monthly_price': 2499.00,
            'security_deposit': 2000.00,
            'status': 'available',
            'rating': 4.96,
            'reviews_count': 112,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '3 Essential Home Appliances (Complete Setup)',
            'energy_rating': '5 Star Certified Bundle',
            'dimensions': 'Full Household Setup Suite',
            'power_consumption': 'Optimized Eco-Inverter System',
            'warranty_period': '100% Free Maintenance & Relocation on Entire Combo',
            'features': [
                'Includes 190L Single Door 5-Star Refrigerator (Samsung/Whirlpool)',
                'Includes 6.5 Kg Fully Automatic Top Load Washing Machine (LG/Samsung)',
                'Includes 43" Full HD Smart LED TV with Android TV & Netflix',
                'Free doorstep delivery, multi-appliance plumbing & electrical setup',
                'Save over ₹800/month compared to individual rental items'
            ],
            'specifications': {
                'Items Included': 'Refrigerator (190L), Washing Machine (6.5kg), Smart TV (43")',
                'Installation': 'Free Dual-Technician Installation included',
                'Maintenance': 'Priority 4-hour breakdown support',
                'Relocation': '1 Free relocation per year'
            },
            'description': 'The ultimate hassle-free move-in solution. Get your entire 1BHK fully furnished with essential premium appliances under a single convenient monthly subscription.'
        },
        {
            'appliance_code': 'AP-CMB-02',
            'name': 'Summer Cooling Chill Combo (1.5 Ton Inverter AC + 240L Frost Free Fridge)',
            'category': cat_map['appliance-combos'],
            'subcategory': 'Seasonal Packages',
            'appliance_type': 'Inverter Cooling Combo',
            'brand': 'ApplineX Curated Bundle',
            'model_number': 'APX-CHILL-PKG',
            'monthly_price': 2999.00,
            'security_deposit': 2200.00,
            'status': 'available',
            'rating': 4.91,
            'reviews_count': 84,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '1.5 Ton AC + 240 Litres Double Door Fridge',
            'energy_rating': 'Dual 5 Star Inverter Bundle',
            'dimensions': 'Room AC + Kitchen Fridge',
            'power_consumption': 'Inverter Energy Saving Dual Unit',
            'warranty_period': 'Free Pre-Summer Servicing & Comprehensive AMC',
            'features': [
                'Daikin / Voltas 1.5 Ton 5-Star Inverter Split AC',
                'Samsung / LG 240L Double Door Frost Free Refrigerator',
                'Free standard AC installation with 3m copper piping included',
                'Stabilizer-free operation on both appliances',
                'Instant seasonal cooling protection'
            ],
            'specifications': {
                'AC Specs': '1.5 Ton 5 Star Split Dual Inverter (Copper Condenser)',
                'Fridge Specs': '240 Litre Double Door Frost Free Multi-Airflow',
                'Installation': 'Free standard AC mounting & piping',
                'Savings': 'Save 22% on combined monthly rental rate'
            },
            'description': 'Beat the Indian summer heat with our most popular seasonal bundle. Includes heavy-duty 1.5 Ton Inverter Split AC and high-capacity Double Door Refrigerator.'
        },
        {
            'appliance_code': 'AP-CMB-03',
            'name': 'Work From Home Pro Suite (MacBook / ThinkPad + 27" 4K Monitor + Mesh Chair)',
            'category': cat_map['appliance-combos'],
            'subcategory': 'Workstation Packages',
            'appliance_type': 'Professional Home Office',
            'brand': 'ApplineX Curated Bundle',
            'model_number': 'APX-WFH-SUITE',
            'monthly_price': 4199.00,
            'security_deposit': 3500.00,
            'status': 'available',
            'rating': 4.94,
            'reviews_count': 76,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': 'Complete Ergonomic Home Office Setup',
            'energy_rating': 'High Efficiency WFH Hardware',
            'dimensions': 'Desk Suite Setup',
            'power_consumption': 'Low Power Consuming Electronics',
            'warranty_period': 'Next-Business-Day Laptop Swap & Support',
            'features': [
                'Choice of Apple MacBook Air M2 (16GB) or Lenovo ThinkPad i7',
                'Dell / LG 27" 4K UHD IPS USB-C Color-Accurate Monitor',
                'High-back ergonomic lumbar mesh office chair',
                'Single-cable workstation dock connectivity',
                'Surge protector power strip included'
            ],
            'specifications': {
                'Laptop': '16GB RAM / 512GB SSD Fast Performance',
                'Monitor': '27-inch 4K UHD with 90W Power Delivery',
                'Seating': 'Ergonomic 3D Armrest Synchro-Tilt Chair',
                'Support': 'Priority IT hardware replacement guarantee'
            },
            'description': 'Designed for remote engineers, designers, and entrepreneurs. High-performance computing paired with a razor-sharp 4K display and orthopedic posture seating.'
        },

        # --- SOUNDBARS & HOME AUDIO ---
        {
            'appliance_code': 'AP-AUD-01',
            'name': 'Sony HT-S40R 600W 5.1ch Real Surround Soundbar with Wireless Rear Speakers',
            'category': cat_map['soundbars-audio'],
            'subcategory': '5.1 Soundbars',
            'appliance_type': 'Real 5.1ch Dolby Digital Cinema',
            'brand': 'Sony',
            'model_number': 'HT-S40R',
            'monthly_price': 899.00,
            'security_deposit': 800.00,
            'status': 'available',
            'rating': 4.87,
            'reviews_count': 45,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '600 Watts Total Power Output',
            'energy_rating': 'Eco Standby Mode (<0.5W)',
            'dimensions': 'Soundbar: 900 x 52 x 74.5 mm, Subwoofer: 192 x 387 x 366 mm',
            'power_consumption': '600W Peak Power',
            'warranty_period': 'Comprehensive Audio Replacement Guarantee',
            'features': [
                '600W total power output with 5.1 separate audio channels',
                'Wireless rear speakers for clean cable-free room aesthetics',
                'Dolby Digital technology for high quality dramatic sound',
                'HDMI ARC, Optical, and Bluetooth 5.0 wireless streaming',
                'Cinema, Music, Voice, and Night sound equalizer modes'
            ],
            'specifications': {
                'Total Power': '600 Watts',
                'Audio Channels': '5.1 Surround',
                'Connectivity': 'HDMI ARC, Optical In, Bluetooth, USB',
                'Subwoofer': 'Dedicated 180mm Bass Reflex Subwoofer'
            },
            'description': 'Transform your living room into an authentic movie theatre. Experience true 5.1 channel surround audio with dedicated rear speakers and pulse-pounding bass.'
        },
        {
            'appliance_code': 'AP-AUD-02',
            'name': 'JBL Bar 500 Pro 590W Dolby Atmos Soundbar with 10" Wireless Subwoofer',
            'category': cat_map['soundbars-audio'],
            'subcategory': 'Dolby Atmos Soundbars',
            'appliance_type': 'MultiBeam & Dolby Atmos 3D Audio',
            'brand': 'JBL',
            'model_number': 'JBLBAR500PROBLKEP',
            'monthly_price': 1149.00,
            'security_deposit': 1000.00,
            'status': 'available',
            'rating': 4.93,
            'reviews_count': 58,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '590 Watts Total Output Power',
            'energy_rating': 'Energy Efficient Standby',
            'dimensions': 'Bar: 1017 x 56 x 103.5 mm, Sub: 305 x 440.4 x 305 mm',
            'power_consumption': '590W Max Output',
            'warranty_period': 'Free Replacement & Audio Tuning Support',
            'features': [
                'Dolby Atmos 3D sound with MultiBeam acoustic surround',
                'Thrilling 10-inch down-firing wireless subwoofer for room-shaking bass',
                'PureVoice dialogue enhancement technology for crystal clear speech',
                'Built-in Wi-Fi with AirPlay, Alexa Multi-Room Music, and Chromecast',
                'Easy sound calibration adapts acoustics to your specific room shape'
            ],
            'specifications': {
                'Power': '590 Watts Peak',
                'Subwoofer Transducer': '10 Inch Down-Firing Driver',
                'Wi-Fi': 'Dual-Band 2.4GHz / 5GHz',
                'HDMI': 'eARC with 4K Dolby Vision Pass-Through'
            },
            'description': 'Bring 3D cinema sound to life with JBL Bar 500. MultiBeam technology creates an expansive soundstage without cluttering your home with extra surround wires.'
        },

        # --- SMALL KITCHEN APPLIANCES ---
        {
            'appliance_code': 'AP-KIT-01',
            'name': 'Philips Digital XXL Air Fryer 7.2L with Rapid Air Technology & Wi-Fi',
            'category': cat_map['small-kitchen'],
            'subcategory': 'Air Fryers',
            'appliance_type': 'Connected XXL Airfryer',
            'brand': 'Philips',
            'model_number': 'HD9285/90',
            'monthly_price': 499.00,
            'security_deposit': 500.00,
            'status': 'available',
            'rating': 4.89,
            'reviews_count': 62,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '7.2 Litres (1.4 kg Fries / Whole Chicken)',
            'energy_rating': 'A+ Energy Efficiency (up to 70% energy savings)',
            'dimensions': '403 x 315 x 307 mm',
            'power_consumption': '2000 Watts Rapid Heating',
            'warranty_period': 'Instant Unit Swap Warranty',
            'features': [
                'Rapid Air technology fries with up to 90% less oil',
                'NutriU recipe app integration with remote phone monitoring',
                '16-in-1 cooking functions: Fry, bake, grill, roast, dehydrate, reheat',
                'QuickClean basket with non-stick coating & dishwasher-safe parts',
                'Keep Warm mode maintains food temperature for 30 minutes'
            ],
            'specifications': {
                'Basket Capacity': '7.2 L (XXL Family Size)',
                'Temperature Range': '40°C - 200°C',
                'Preset Programs': '8 One-Touch Digital Presets',
                'Weight': '6.25 kg'
            },
            'description': 'Crispy outside, tender inside with 90% less fat. Cook healthy gourmet meals for the entire family effortlessly with smart app-connected cooking.'
        },
        {
            'appliance_code': 'AP-KIT-02',
            'name': 'Morphy Richards Europa Espresso & Cappuccino Coffee Maker (15-Bar Pump)',
            'category': cat_map['small-kitchen'],
            'subcategory': 'Coffee Machines',
            'appliance_type': '15-Bar High Pressure Espresso Barista',
            'brand': 'Morphy Richards',
            'model_number': 'Europa Drip & Espresso',
            'monthly_price': 399.00,
            'security_deposit': 400.00,
            'status': 'available',
            'rating': 4.79,
            'reviews_count': 39,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '4-Cup Carafe (800 ml Water Tank)',
            'energy_rating': 'Energy Saving Auto-Off',
            'dimensions': '320 x 260 x 340 mm',
            'power_consumption': '800 Watts',
            'warranty_period': 'Complete Servicing & Descaling Kit Included',
            'features': [
                'Makes authentic Espresso, rich Cappuccino, and smooth Café Lattes',
                'Milk frothing nozzle for dense, creamy barista-style foam',
                'Heat-resistant glass carafe with calibrated cup markings',
                'Removable drip tray for easy cleaning and maintenance',
                'Overheat and pressure safety release valves'
            ],
            'specifications': {
                'Pump Pressure': '15 Bar High Pressure',
                'Coffee Type': 'Ground Coffee / Espresso Grind',
                'Body Material': 'Brushed Stainless Steel & ABS',
                'Frother Type': 'Steam Jet Wand'
            },
            'description': 'Start your mornings with freshly brewed barista coffee at home. Create rich espressos and silky lattes with the high-pressure steam frother.'
        },
        {
            'appliance_code': 'AP-KIT-03',
            'name': 'Prestige Deluxe 2000W Smart Induction Cooktop with Indian Menu Presets',
            'category': cat_map['small-kitchen'],
            'subcategory': 'Induction Stoves',
            'appliance_type': 'Electromagnetic Induction Cooktop',
            'brand': 'Prestige',
            'model_number': 'PIC 20.0',
            'monthly_price': 249.00,
            'security_deposit': 300.00,
            'status': 'available',
            'rating': 4.75,
            'reviews_count': 53,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': 'Heavy-Duty Microcrystal Glass Top',
            'energy_rating': 'Eco Flame-Free Induction (93% Thermal Efficiency)',
            'dimensions': '380 x 300 x 60 mm',
            'power_consumption': '2000 Watts Max',
            'warranty_period': 'Free Replacement Guarantee',
            'features': [
                'Full crystal glass surface with feather-touch controls',
                'Pre-programmed Indian menu options (Roti, Dosa, Curry, Idli, Milk Boiled)',
                'Dual heat sensors prevent dry burning and overheating',
                'Automatic voltage regulator handles Indian grid fluctuations',
                'Child lock safety function'
            ],
            'specifications': {
                'Power': '2000 Watts',
                'Voltage Range': '130V - 270V Automatic Regulation',
                'Control Type': 'Touch Panel with LED Display',
                'Weight': '2.1 kg'
            },
            'description': 'Safe, flame-free, and rapid cooking. Features customized Indian recipe presets and intelligent power management for fast everyday meals.'
        },

        # --- ADDITIONAL REFRIGERATORS & WASHING MACHINES ---
        {
            'appliance_code': 'AP-REF-05',
            'name': 'Whirlpool 190L 4 Star Single Door Refrigerator (Direct Cool Inverter)',
            'category': cat_map['refrigerators'],
            'subcategory': 'Single Door',
            'appliance_type': 'Direct Cool Single Door',
            'brand': 'Whirlpool',
            'model_number': '205 WDE CLS 4S',
            'monthly_price': 699.00,
            'security_deposit': 800.00,
            'status': 'available',
            'rating': 4.78,
            'reviews_count': 91,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '190 Litres (Ideal for Singles & Couples)',
            'energy_rating': '4 Star Direct Cool',
            'dimensions': '535 x 615 x 1180 mm',
            'power_consumption': '132 kWh/year',
            'warranty_period': '10 Years Compressor Warranty + Free Annual Servicing',
            'features': [
                'Up to 9 hours of cooling retention during power outages',
                'Laminar Airflow ensures uniform chilling across shelves',
                'Large vegetable crisper with HoneyComb moisture lock',
                'Toughened glass shelves and pedestal drawer storage',
                'Stabilizer-free operation from 130V to 300V'
            ],
            'specifications': {
                'Gross Volume': '190 L',
                'Defrosting Type': 'Direct Cool Quick Defrost',
                'Color': 'Wine Bloom Floral Finish',
                'Refrigerant': 'R600a'
            },
            'description': 'Compact, ultra-economical, and dependable. Perfect for compact city apartments, single professionals, and student homes.'
        },
        {
            'appliance_code': 'AP-WM-05',
            'name': 'Samsung 7.0 Kg Fully Automatic Top Load Washing Machine with Wobble Tech',
            'category': cat_map['washing-machines'],
            'subcategory': 'Top Load',
            'appliance_type': 'Top Load Inverter Pulsator',
            'brand': 'Samsung',
            'model_number': 'WA70BG4441YY',
            'monthly_price': 799.00,
            'security_deposit': 800.00,
            'status': 'available',
            'rating': 4.83,
            'reviews_count': 74,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '7.0 Kg (Ideal for 3-4 members)',
            'energy_rating': '5 Star Energy Certified',
            'dimensions': '540 x 568 x 988 mm',
            'power_consumption': '0.082 kWh/cycle',
            'warranty_period': '10 Years DIT Motor Warranty + Free Maintenance',
            'features': [
                'Wobble Technology prevents clothes from tangling and twisting',
                'Magic Filter effectively collects lint and fluff from laundry',
                'Diamond Drum with soft curl design protects delicate fabrics',
                'Eco Tub Clean cleans drum without harsh chemicals',
                'Rear control panel with intuitive LED display'
            ],
            'specifications': {
                'Capacity': '7.0 Kg',
                'Spin Speed': '680 RPM',
                'Wash Cycles': 'Normal, Quick Wash, Delicates, Bedding, Jeans, Eco Tub Clean',
                'Tub Material': 'Stainless Steel'
            },
            'description': 'Gentle on fabrics, tough on stains. Wobble pulsators generate dynamic 3D water currents to thoroughly wash clothes while stopping fabric tangle damage.'
        }
    ]

    added_count = 0
    updated_count = 0

    for app_data in new_appliances:
        code = app_data['appliance_code']
        app_obj, created = Appliance.objects.get_or_create(
            appliance_code=code,
            defaults=app_data
        )
        if not created:
            for k, v in app_data.items():
                setattr(app_obj, k, v)
            app_obj.save()
            updated_count += 1
            print(f"  [APPLIANCE] Updated {app_obj.name} ({code})")
        else:
            added_count += 1
            print(f"  [APPLIANCE] Added {app_obj.name} ({code})")

    print(f"\n[SUMMARY] Total Categories: {Category.objects.count()}")
    print(f"[SUMMARY] Total Appliances: {Appliance.objects.count()}")
    print(f"[SUCCESS] Added: {added_count}, Updated: {updated_count}")

if __name__ == '__main__':
    add_comprehensive_appliances()
