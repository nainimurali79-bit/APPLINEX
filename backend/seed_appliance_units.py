import os
import random
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applinex.settings')
django.setup()

from apps.appliances.models import Appliance, ApplianceUnit

CITIES = ['Bangalore', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune', 'Chennai']
CONDITIONS = ['brand_new', 'pristine', 'good']

def seed_units():
    print("[INFO] Seeding Physical Inventory Units (ApplianceUnit) with unique serial numbers...")
    
    total_units_created = 0
    
    for app in Appliance.objects.all():
        # Create 3-6 physical units for each catalog appliance
        existing = app.units.count()
        if existing >= 3:
            continue
            
        units_to_create = 4 - existing
        for i in range(units_to_create):
            city = random.choice(CITIES)
            cond = random.choice(CONDITIONS)
            hub_num = random.randint(1, 4)
            sn_code = f"SN-{app.brand[:3].upper()}-{app.appliance_code.replace('APX-', '').replace('AP-', '')}-{random.randint(10000, 99999)}"
            
            unit = ApplianceUnit.objects.create(
                appliance=app,
                serial_number=sn_code,
                status='available',
                condition=cond,
                city=city,
                warehouse_location=f"{city} Fulfillment Hub {hub_num}",
                qr_code_id=f"QR-{sn_code}",
            )
            total_units_created += 1
            
    print(f"[SUCCESS] Created {total_units_created} physical inventory units. Total inventory units in DB: {ApplianceUnit.objects.count()}")

if __name__ == '__main__':
    seed_units()
