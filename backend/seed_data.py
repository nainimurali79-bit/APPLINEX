import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applinex.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.appliances.models import Category, Appliance
from apps.rentals.models import Rental
from apps.payments.models import Payment
from apps.reviews.models import Review
from apps.maintenance.models import MaintenanceLog, ReturnRecord
from apps.support.models import SupportTicket, Complaint

User = get_user_model()

def seed_database():
    print("[INFO] Starting APPLINEX Database Seeding...")

    # 1. Create Users
    # Customer
    customer, _ = User.objects.get_or_create(
        email='customer@applinex.com',
        defaults={
            'username': 'customer',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'customer',
            'phone': '+91 98765 43210',
            'address': 'Flat 402, Silicon Heights, 100 Feet Rd, Indiranagar',
            'city': 'Bangalore',
            'postal_code': '560038',
            'profile_image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }
    )
    customer.set_password('Customer@123')
    customer.save()

    # Additional Customers
    priya, _ = User.objects.get_or_create(
        email='priya.s@applinex.com',
        defaults={
            'username': 'priyas',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'role': 'customer',
            'phone': '+91 98111 22334',
            'address': 'Plot 12, Green Park Avenue, Koramangala',
            'city': 'Bangalore',
            'postal_code': '560034',
            'profile_image': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        }
    )
    priya.set_password('Customer@123')
    priya.save()

    # Admin
    admin_user, _ = User.objects.get_or_create(
        email='admin@applinex.com',
        defaults={
            'username': 'admin',
            'first_name': 'System',
            'last_name': 'Administrator',
            'role': 'admin',
            'phone': '+91 90000 00001',
            'address': 'APPLINEX HQ, Tech Park Block 4',
            'city': 'Bangalore',
            'postal_code': '560100',
            'is_staff': True,
            'is_superuser': True,
            'profile_image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        }
    )
    admin_user.set_password('Admin@123')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()

    # Support Staff
    support_user, _ = User.objects.get_or_create(
        email='support@applinex.com',
        defaults={
            'username': 'support',
            'first_name': 'Support',
            'last_name': 'Desk',
            'role': 'support',
            'phone': '+91 90000 00002',
            'address': 'APPLINEX Customer Support Operations Center',
            'city': 'Bangalore',
            'postal_code': '560100',
            'is_staff': True,
            'profile_image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        }
    )
    support_user.set_password('Support@123')
    support_user.save()

    print("[SUCCESS] Users seeded successfully.")

    # 2. Categories
    categories_data = [
        {
            'name': 'Refrigerators',
            'slug': 'refrigerators',
            'icon_name': 'Refrigerator',
            'description': 'Energy-efficient double door, single door, and smart inverter refrigerators.',
            'image_url': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Washing Machines',
            'slug': 'washing-machines',
            'icon_name': 'WashingMachine',
            'description': 'Front load & top load fully automatic washers with steam wash & smart care.',
            'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Air Conditioners',
            'slug': 'air-conditioners',
            'icon_name': 'Wind',
            'description': 'High-performance split inverter & dual inverter cooling systems with air purification.',
            'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Microwaves & Ovens',
            'slug': 'microwaves-ovens',
            'icon_name': 'Microwave',
            'description': 'Smart convection and grill microwave ovens for effortless cooking and baking.',
            'image_url': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Dishwashers',
            'slug': 'dishwashers',
            'icon_name': 'Sparkles',
            'description': 'Hygienic 14-place settings automatic dishwashers with eco-silence drive.',
            'image_url': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Air Purifiers',
            'slug': 'air-purifiers',
            'icon_name': 'Activity',
            'description': 'True HEPA smart air purifiers with real-time PM2.5 monitoring and allergen defense.',
            'image_url': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'RO & Water Purifiers',
            'slug': 'ro-dispensers',
            'icon_name': 'Droplets',
            'description': 'Multi-stage RO + UV + Mineralizer purifiers ensuring pure alkaline drinking water.',
            'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Smart Televisions',
            'slug': 'smart-tvs',
            'icon_name': 'Tv',
            'description': 'Ultra HD 4K Smart QLED displays with Dolby Vision & Atmos immersive audio.',
            'image_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=80'
        },
    ]

    cat_map = {}
    for cat_info in categories_data:
        cat_obj, _ = Category.objects.get_or_create(
            slug=cat_info['slug'],
            defaults=cat_info
        )
        cat_map[cat_info['slug']] = cat_obj

    print("[SUCCESS] Categories seeded.")

    # 3. Appliances
    appliances_data = [
        {
            'appliance_code': 'AP-9301',
            'name': 'Premium Smart Double Door Refrigerator 340L',
            'category': cat_map['refrigerators'],
            'subcategory': 'Double Door',
            'appliance_type': 'Frost Free Inverter',
            'brand': 'Samsung',
            'model_number': 'RT34T4513S8',
            'monthly_price': 1499.00,
            'security_deposit': 1000.00,
            'status': 'rented',
            'rating': 4.85,
            'reviews_count': 38,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '340 Litres',
            'energy_rating': '5 Star Inverter',
            'dimensions': '600 x 672 x 1715 mm',
            'power_consumption': '178 kWh/year',
            'warranty_period': '10 Years Compressor Warranty & Free Annual Service',
            'features': [
                'Twin Cooling Plus with 5 conversion modes',
                'Digital Inverter Compressor with 50% energy savings',
                'Smart Connect Inverter for uninterrupted power',
                'Deodorizing Filter keeps food fresh longer',
                'Toughened Glass Shelves holding up to 175 kg'
            ],
            'specifications': {
                'Gross Capacity': '340 L',
                'Cooling Technology': 'Multi Air Flow 360',
                'Door Finish': 'Refined Inox Metallic',
                'Refrigerant': 'R600a Eco-Friendly',
                'Net Weight': '58 kg'
            },
            'description': 'Elevate your kitchen with the Samsung 340L Twin Cooling Inverter Refrigerator. Featuring customizable cooling zones, ultra-quiet operation, and advanced humidity control for extended vegetable freshness.'
        },
        {
            'appliance_code': 'AP-9302',
            'name': 'Front Load AI Direct Drive Washing Machine 8kg',
            'category': cat_map['washing-machines'],
            'subcategory': 'Front Load',
            'appliance_type': 'AI Direct Drive Inverter',
            'brand': 'LG',
            'model_number': 'FHT1408ZWL',
            'monthly_price': 1299.00,
            'security_deposit': 1000.00,
            'status': 'available',
            'rating': 4.90,
            'reviews_count': 52,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [
                'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
            ],
            'capacity': '8.0 Kg',
            'energy_rating': '5 Star Energy Certified',
            'dimensions': '600 x 560 x 850 mm',
            'power_consumption': '0.065 kWh/cycle',
            'warranty_period': '10 Years Motor Warranty + Free Maintenance',
            'features': [
                'AI DD intelligent fabric sensor with 18% fabric protection',
                'Steam Allergy Care removing 99.9% dust mites',
                'TurboWash 59 min fast wash cycle',
                'Wi-Fi SmartThinQ control via mobile app',
                'Full Stainless Steel lifter & drum'
            ],
            'specifications': {
                'Max Spin Speed': '1400 RPM',
                'Programs': '14 Wash Programs',
                'Noise Level': '52 dB (Ultra Quiet)',
                'Motor Type': 'Direct Drive Inverter'
            },
            'description': 'The LG 8kg AI DD Front Load Washer brings smart fabric sensing technology to your home. Automatically selects optimal washing motion for superior fabric care and deep allergen sanitation.'
        },
        {
            'appliance_code': 'AP-9303',
            'name': '1.5 Ton 5 Star Split Inverter Air Conditioner',
            'category': cat_map['air-conditioners'],
            'subcategory': 'Split AC',
            'appliance_type': 'Dual Inverter PM 2.5 Filter',
            'brand': 'Daikin',
            'model_number': 'FTKM50U',
            'monthly_price': 1899.00,
            'security_deposit': 1500.00,
            'status': 'available',
            'rating': 4.80,
            'reviews_count': 41,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '1.5 Ton (Ideal for 150-180 sq ft)',
            'energy_rating': '5 Star (ISEER 5.2)',
            'dimensions': '885 x 298 x 229 mm',
            'power_consumption': '780 kWh/year',
            'warranty_period': 'Comprehensive Free Seasonal Servicing Included',
            'features': [
                'Neo Swing Inverter Compressor with copper condenser',
                'PM 2.5 air purification filter built-in',
                'Coanda Airflow for draft-free uniform cooling',
                'Econo Mode for maximum electricity savings',
                'Quiet Operation down to 19 dB'
            ],
            'specifications': {
                'Cooling Capacity': '5280 Watts',
                'Refrigerant': 'R32 Green Gas',
                'Condenser Coil': '100% Grooved Copper',
                'Power Supply': '230V / 50Hz'
            },
            'description': 'Enjoy whisper-quiet cooling and pure air with Daikin’s flagship 1.5 Ton 5-Star Split AC. Engineered for heavy-duty summer cooling with supreme energy efficiency.'
        },
        {
            'appliance_code': 'AP-9304',
            'name': 'Smart Convection Microwave Oven 28L',
            'category': cat_map['microwaves-ovens'],
            'subcategory': 'Convection',
            'appliance_type': 'Grill & Bake Touch',
            'brand': 'IFB',
            'model_number': '28BCS1',
            'monthly_price': 799.00,
            'security_deposit': 500.00,
            'status': 'available',
            'rating': 4.75,
            'reviews_count': 29,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '28 Litres',
            'energy_rating': '4 Star High Efficiency',
            'dimensions': '513 x 310 x 440 mm',
            'power_consumption': '900W Microwave / 1400W Grill',
            'warranty_period': 'Full Replacement Warranty on Magnetron',
            'features': [
                '101 Auto-Cook gourmet menu presets',
                'Multi-Stage Cooking & Oil-Free Air Fry mode',
                'Disinfect and Steam Clean function',
                'Stainless Steel Cavity for even heat distribution',
                'Child Lock security feature'
            ],
            'specifications': {
                'Cavity': 'Stainless Steel',
                'Control Type': 'Feather Touch Membrane',
                'Turntable Diameter': '315 mm'
            },
            'description': 'Bake, grill, reheat, and crisp with precision using IFB’s 28L Convection Microwave. Includes specialized presets for healthy oil-free cooking.'
        },
        {
            'appliance_code': 'AP-9305',
            'name': '14 Place Settings Hygienic Smart Dishwasher',
            'category': cat_map['dishwashers'],
            'subcategory': 'Built-in / Freestanding',
            'appliance_type': 'EcoSilence Drive',
            'brand': 'Bosch',
            'model_number': 'SMS66GI01I',
            'monthly_price': 1599.00,
            'security_deposit': 1000.00,
            'status': 'available',
            'rating': 4.88,
            'reviews_count': 22,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '14 Place Settings',
            'energy_rating': 'A+++ European Energy Rating',
            'dimensions': '600 x 600 x 845 mm',
            'power_consumption': '0.92 kWh/cycle (9.5L water)',
            'warranty_period': '100% Hassle-Free Maintenance Support',
            'features': [
                'Intensive Kadhai 70 deg program for oily Indian cookware',
                'EcoSilence Drive brushless motor',
                'VarioSpeed Plus cleans up to 66% faster',
                'AquaSensor detects dirt level for optimal water use',
                'DosageAssist dissolves detergent tablets completely'
            ],
            'specifications': {
                'Wash Programs': '6 Wash Programs',
                'Noise Level': '44 dB',
                'Water Consumption': '9.5 Litres per wash'
            },
            'description': 'Designed specifically for Indian cookware, the Bosch 14-Place Dishwasher effortlessly dissolves tough masala and oil stains with 70C hot water hygiene.'
        },
        {
            'appliance_code': 'AP-9306',
            'name': 'Smart HEPA Air Purifier Pro with Real-Time AQI',
            'category': cat_map['air-purifiers'],
            'subcategory': 'True HEPA',
            'appliance_type': 'IoT Smart Sensor',
            'brand': 'Dyson',
            'model_number': 'PureCool-TP04',
            'monthly_price': 999.00,
            'security_deposit': 600.00,
            'status': 'available',
            'rating': 4.92,
            'reviews_count': 34,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': 'Covers rooms up to 450 sq ft',
            'energy_rating': '5 Star Ultra Low Power',
            'dimensions': '223 x 223 x 1054 mm',
            'power_consumption': '40W Peak',
            'warranty_period': 'Free Filter Replacement & Sensor Calibrations',
            'features': [
                'Sealed HEPA H13 filter capturing 99.95% particles down to 0.1 microns',
                'Activated Carbon filter absorbs gases, odors, and VOCs',
                'Air Multiplier technology projects 290 litres of purified air/sec',
                'Real-time LCD display showing PM2.5, PM10, VOC, NO2',
                'App and voice assistant compatible'
            ],
            'specifications': {
                'CADR': '360 m3/h',
                'Oscillation': '350 Degrees',
                'Filtration': 'HEPA H13 + Carbon'
            },
            'description': 'Breathe clean, pollutant-free air at home. Captures ultra-fine particulate matter, smog, bacteria, and allergens with continuous air quality monitoring.'
        },
        {
            'appliance_code': 'AP-9307',
            'name': 'Advanced RO + UV + UF Alkaline Water Purifier 8L',
            'category': cat_map['ro-dispensers'],
            'subcategory': 'RO Purifier',
            'appliance_type': 'Multi-Stage Alkaline TDS Controller',
            'brand': 'Kent',
            'model_number': 'GrandPlus-Alk',
            'monthly_price': 649.00,
            'security_deposit': 500.00,
            'status': 'available',
            'rating': 4.70,
            'reviews_count': 45,
            'featured': False,
            'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '8.0 Litres Storage',
            'energy_rating': '5 Star Zero Water Wastage',
            'dimensions': '400 x 260 x 520 mm',
            'power_consumption': '60W',
            'warranty_period': 'Includes Free Filter Changes & Quarterly Membrane Service',
            'features': [
                'Multi-Stage RO + UV + UF + Alkaline TDS Controller',
                'Retains essential minerals with TDS Control valve',
                'Alkaline filter maintains pH balance between 8.0 - 9.5',
                'High purification capacity of 20 L/hr',
                'UV LED in storage tank maintains sterility'
            ],
            'specifications': {
                'Storage Tank': 'Food Grade Polypropylene 8L',
                'Purification Rate': '20 L/hr',
                'Inlet Water TDS': 'Up to 2000 ppm'
            },
            'description': 'Ensure 100% pure, healthy alkaline drinking water for your family. Delivers mineral-rich water with automated quarterly maintenance and filter replacements.'
        },
        {
            'appliance_code': 'AP-9308',
            'name': '55 Inch 4K Ultra HD Smart QLED Television',
            'category': cat_map['smart-tvs'],
            'subcategory': 'QLED 4K',
            'appliance_type': 'Google TV Dolby Vision',
            'brand': 'Sony',
            'model_number': 'Bravia-XR55',
            'monthly_price': 1999.00,
            'security_deposit': 1500.00,
            'status': 'available',
            'rating': 4.95,
            'reviews_count': 64,
            'featured': True,
            'image_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
            'gallery_images': [],
            'capacity': '55 Inch Diagonal',
            'energy_rating': '5 Star Smart Display',
            'dimensions': '1233 x 711 x 72 mm',
            'power_consumption': '135W',
            'warranty_period': 'Complete Onsite Support and Replacement Guarantee',
            'features': [
                'Cognitive Processor XR delivers revolutionary real-world contrast',
                'Full Array LED with XR Triluminos Pro for 1 Billion Colors',
                'Acoustic Multi-Audio speakers with Dolby Atmos',
                'Google TV with voice remote and hands-free search',
                '120Hz Refresh Rate with HDMI 2.1 for 4K 120fps gaming'
            ],
            'specifications': {
                'Resolution': '3840 x 2160 Pixels (4K)',
                'Audio Output': '30W 2.2 Channel',
                'Ports': '4 HDMI, 2 USB, Optical Out, Bluetooth 5.0'
            },
            'description': 'Immerse in true cinematic visuals with Sony Bravia 55 Inch 4K QLED. Features cutting-edge Cognitive Processor XR and surround acoustic audio.'
        },
    ]

    for app_data in appliances_data:
        Appliance.objects.update_or_create(
            appliance_code=app_data['appliance_code'],
            defaults=app_data
        )

    print("[SUCCESS] Appliances seeded.")

    # 4. Rentals & Payments
    ref_appliance = Appliance.objects.get(appliance_code='AP-9301')
    
    # Active Rental for John Doe matching reference image (RN-2024-000123)
    start_d = datetime.date.today() - datetime.timedelta(days=15)
    end_d = start_d + datetime.timedelta(days=30)
    
    rental_1, _ = Rental.objects.update_or_create(
        rental_id='RN-2024-000123',
        defaults={
            'customer': customer,
            'appliance': ref_appliance,
            'duration_months': 1,
            'start_date': start_d,
            'end_date': end_d,
            'monthly_rate': 1499.00,
            'discount_percent': 0.00,
            'subtotal': 1499.00,
            'delivery_fee': 199.00,
            'security_deposit': 1000.00,
            'total_amount': 2698.00,
            'delivery_address': customer.address,
            'delivery_phone': customer.phone,
            'delivery_city': customer.city,
            'status': 'active',
            'timeline_events': [
                {
                    'status': 'Booking Requested',
                    'timestamp': (start_d - datetime.timedelta(days=2)).strftime('%d %b %Y, 09:30 AM'),
                    'description': 'Booking requested for 1 Month.'
                },
                {
                    'status': 'Booking Approved',
                    'timestamp': (start_d - datetime.timedelta(days=1)).strftime('%d %b %Y, 11:00 AM'),
                    'description': 'Booking verified and approved by APPLINEX operations team.'
                },
                {
                    'status': 'Payment Completed',
                    'timestamp': (start_d - datetime.timedelta(days=1)).strftime('%d %b %Y, 11:05 AM'),
                    'description': 'Payment of 2,698 received via Credit Card. Ref: TXN-APX-0801'
                },
                {
                    'status': 'Rental Active',
                    'timestamp': start_d.strftime('%d %b %Y, 02:00 PM'),
                    'description': 'Appliance delivered, tested, and operational.'
                }
            ],
            'notes': 'Preferred delivery slot: Morning 10-12 PM'
        }
    )

    # Payment for Rental 1
    Payment.objects.update_or_create(
        payment_id='PMT-2024-0801',
        defaults={
            'rental': rental_1,
            'customer': customer,
            'amount': 2698.00,
            'payment_method': 'card',
            'status': 'successful',
            'transaction_reference': 'TXN-APX-0801',
        }
    )

    # Additional Historical Rentals for analytics
    washer_app = Appliance.objects.get(appliance_code='AP-9302')
    rental_2, _ = Rental.objects.update_or_create(
        rental_id='RN-2024-000124',
        defaults={
            'customer': priya,
            'appliance': washer_app,
            'duration_months': 6,
            'start_date': datetime.date.today() - datetime.timedelta(days=60),
            'end_date': datetime.date.today() + datetime.timedelta(days=120),
            'monthly_rate': 1169.10,
            'discount_percent': 10.00,
            'subtotal': 7014.60,
            'delivery_fee': 0.00,
            'security_deposit': 1000.00,
            'total_amount': 8014.60,
            'delivery_address': priya.address,
            'delivery_phone': priya.phone,
            'delivery_city': priya.city,
            'status': 'active',
            'timeline_events': [
                {
                    'status': 'Booking Requested',
                    'timestamp': '12 Jun 2024, 10:00 AM',
                    'description': 'Booking requested for 6 Months (10% Tier Discount Applied).'
                },
                {
                    'status': 'Booking Approved',
                    'timestamp': '12 Jun 2024, 11:30 AM',
                    'description': 'Verified by operations.'
                },
                {
                    'status': 'Payment Completed',
                    'timestamp': '12 Jun 2024, 11:45 AM',
                    'description': 'Payment of 8,014.60 received via UPI.'
                },
                {
                    'status': 'Rental Active',
                    'timestamp': '13 Jun 2024, 03:00 PM',
                    'description': 'Delivered and installed.'
                }
            ]
        }
    )

    Payment.objects.update_or_create(
        payment_id='PMT-2024-0802',
        defaults={
            'rental': rental_2,
            'customer': priya,
            'amount': 8014.60,
            'payment_method': 'upi',
            'status': 'successful',
            'transaction_reference': 'TXN-APX-0802',
        }
    )

    print("[SUCCESS] Rentals & Payments seeded.")

    # 5. Reviews
    Review.objects.update_or_create(
        customer=customer,
        appliance=ref_appliance,
        defaults={
            'rental': rental_1,
            'rating': 5,
            'review_text': 'Great product! Working perfectly. Cooling is super fast and silent.',
            'status': 'approved'
        }
    )

    Review.objects.update_or_create(
        customer=priya,
        appliance=washer_app,
        defaults={
            'rental': rental_2,
            'rating': 5,
            'review_text': 'Average service was turned into great service by the helpful technician. Very satisfied with the washing quality.',
            'status': 'pending'
        }
    )

    print("[SUCCESS] Reviews seeded.")

    # 6. Support Tickets
    SupportTicket.objects.update_or_create(
        ticket_id='TKT-2024-001',
        defaults={
            'customer': customer,
            'appliance': washer_app,
            'subject': 'Washing Machine not working',
            'description': 'Machine shows error E4 during spin cycle. Need a technician visit.',
            'priority': 'high',
            'status': 'open',
            'staff_notes': 'Assigned to field technician for morning visit.'
        }
    )

    SupportTicket.objects.update_or_create(
        ticket_id='TKT-2024-002',
        defaults={
            'customer': priya,
            'subject': 'AC cooling issue',
            'description': 'AC cooling seems lower than normal in afternoon heat.',
            'priority': 'medium',
            'status': 'in_progress',
            'staff_notes': 'Technician scheduled for gas level check tomorrow.'
        }
    )

    SupportTicket.objects.update_or_create(
        ticket_id='TKT-2024-003',
        defaults={
            'customer': customer,
            'subject': 'Appliance voice link setup',
            'description': 'Need help pairing smart refrigerator with Google Home app.',
            'priority': 'low',
            'status': 'resolved',
            'staff_notes': 'Assisted customer over call with Wi-Fi reset procedure.'
        }
    )

    # 7. Complaints
    Complaint.objects.update_or_create(
        complaint_id='CMP-2024-001',
        defaults={
            'customer': customer,
            'issue': 'Product damage on carton box',
            'description': 'Outer carton box had minor tear upon delivery. Appliance inside was inspected and undamaged.',
            'status': 'open',
            'resolution': 'Logged with logistics dispatch.'
        }
    )

    Complaint.objects.update_or_create(
        complaint_id='CMP-2024-002',
        defaults={
            'customer': priya,
            'issue': 'Late delivery slot',
            'description': 'Delivery van was delayed by 1 hour due to traffic congestion.',
            'status': 'in_progress',
            'resolution': 'Issued delivery fee waiver coupon code.'
        }
    )

    Complaint.objects.update_or_create(
        complaint_id='CMP-2024-003',
        defaults={
            'customer': customer,
            'issue': 'Oily product packaging',
            'description': 'Protection plastic tape residue left on handle.',
            'status': 'resolved',
            'resolution': 'Technician cleaned with industrial safe polish.'
        }
    )

    # 8. Maintenance Logs
    ac_appliance = Appliance.objects.get(appliance_code='AP-9303')
    MaintenanceLog.objects.update_or_create(
        log_id='MNT-2024-001',
        defaults={
            'appliance': ac_appliance,
            'service_date': datetime.date.today() - datetime.timedelta(days=10),
            'condition': 'excellent',
            'status': 'completed',
            'technician_name': 'Ramesh Kumar (APPLINEX Senior Tech)',
            'cost': 450.00,
            'description': 'Full deep foam coil cleaning and pressure check.',
            'resolution_notes': 'All parameters normal, cooling test passed at 16 deg C.'
        }
    )

    print("[SUCCESS] All APPLINEX seed data successfully generated!")

if __name__ == '__main__':
    seed_database()


if __name__ == '__main__':
    seed_database()
