from PIL import Image
import os
import sys

# Check a pose file
FILES = [
    r"public\images\zundamon\pointing\mouth_open.png",
    r"public\images\metan\holding\happy_open.png",
    r"public\images\tsumugi\peace\happy_open.png"
]

def check_transparency(path):
    full_path = os.path.join(os.getcwd(), path)
    if not os.path.exists(full_path):
        print(f"File not found: {path}")
        return
        
    img = Image.open(full_path)
    print(f"Checking {path}: Mode={img.mode}")
    
    if img.mode != 'RGBA':
        print("  WARNING: Not RGBA")
        return

    # Check center or random point just to be sure it's not empty? 
    # Or checking 0,0 is fine for background transparency.
    pixel = img.getpixel((0, 0))
    if pixel[3] == 0:
        print("  ✅ Top-left corner is transparent")
    else:
        print(f"  ⚠️ Top-left corner is NOT transparent: {pixel}")

if __name__ == "__main__":
    for f in FILES:
        check_transparency(f)
