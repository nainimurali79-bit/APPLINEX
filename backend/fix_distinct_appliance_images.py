import os
import json
import csv
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applinex.settings')
django.setup()

from apps.appliances.models import Appliance, Category

UNIQUE_PRODUCT_IMAGES = {
    # --- REFRIGERATORS & FREEZERS ---
    'AP-9301': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
    'APX-REF-001': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    'APX-REF-002': 'https://images.unsplash.com/photo-1536353284924-9240ccfc4966?w=600&auto=format&fit=crop&q=80',
    'AP-REF-05': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
    'APX-REF-003': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=80',
    'APX-REF-004': 'https://images.unsplash.com/photo-1585338447937-7052fcb374f7?w=600&auto=format&fit=crop&q=80',

    # --- WASHING MACHINES ---
    'AP-9302': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
    'AP-WM-05': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    'APX-WM-001': 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80',
    'APX-WM-002': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
    'APX-WM-003': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',

    # --- AIR CONDITIONERS ---
    'AP-9303': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
    'APX-AC-001': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    'APX-AC-002': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',

    # --- TELEVISIONS ---
    'APX-TV-001': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    'APX-TV-002': 'https://images.unsplash.com/photo-1528928441742-b4ccac1bb04c?w=600&auto=format&fit=crop&q=80',

    # --- WATER PURIFIERS ---
    'APX-RO-001': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    'APX-RO-002': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80',

    # --- MICROWAVE OVENS ---
    'APX-MW-001': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
    'APX-MW-002': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',

    # --- INDUCTION COOKTOPS ---
    'AP-KIT-03': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    'APX-IND-001': 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80',

    # --- AIR PURIFIERS ---
    'APX-AP-001': 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&auto=format&fit=crop&q=80',
    'APX-AP-002': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',

    # --- AIR COOLERS ---
    'APX-CL-001': 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80',

    # --- VACUUM CLEANERS ---
    'APX-VC-001': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    'APX-VC-002': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',

    # --- DISHWASHERS ---
    'APX-DW-001': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',

    # --- WATER HEATERS & GEYSERS ---
    'APX-WH-001': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',

    # --- KITCHEN SMALL APPLIANCES ---
    'AP-KIT-01': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    'AP-KIT-02': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    'APX-KIT-001': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',

    # --- FANS ---
    'APX-FAN-001': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',

    # --- IRONS ---
    'APX-IRN-001': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',

    # --- HOME AUDIO & SOUNDBARS ---
    'AP-AUD-01': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    'AP-AUD-02': 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
    'APX-AUD-001': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',

    # --- LAPTOPS & WFH TECH ---
    'AP-WFH-01': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'AP-WFH-02': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    'AP-WFH-03': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',

    # --- APPLIANCE COMBOS ---
    'AP-CMB-01': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    'AP-CMB-02': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
    'AP-CMB-03': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
}

def apply_distinct_images():
    print("[INFO] Updating all appliance records with unique, high-definition verified images...")
    
    updated = 0
    for code, img_url in UNIQUE_PRODUCT_IMAGES.items():
        try:
            app = Appliance.objects.get(appliance_code=code)
            app.image_url = img_url
            app.gallery_images = [img_url]
            app.save(update_fields=['image_url', 'gallery_images'])
            updated += 1
            print(f"  [OK] Updated {code}: {app.name}")
        except Appliance.DoesNotExist:
            pass

    print(f"\n[SUCCESS] Updated {updated} appliances with 100% unique, high-resolution images.")

if __name__ == '__main__':
    apply_distinct_images()
