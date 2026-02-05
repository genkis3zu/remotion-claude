from PIL import Image
import os
import sys

# Check a few generated files
FILES = [
    r"public\images\zundamon\normal\mouth_open.png",
    r"public\images\zundamon\normal\mouth_close.png"
]

def check_transparency(path):
    full_path = os.path.join(os.getcwd(), path)
    if not os.path.exists(full_path):
        print(f"File not found: {path} (Generation might still be running)")
        return
        
    img = Image.open(full_path)
    print(f"Checking {path}: Mode={img.mode}")
    
    if img.mode != 'RGBA':
        print("  WARNING: Not RGBA")
        return

    # Check corners for transparency
    corners = [
        (0, 0),
        (img.width - 1, 0),
        (0, img.height - 1),
        (img.width - 1, img.height - 1)
    ]
    
    transparent_corners = 0
    for x, y in corners:
        pixel = img.getpixel((x, y))
        # pixel is (R, G, B, A)
        if pixel[3] == 0:
            transparent_corners += 1
        else:
            print(f"  Corner ({x}, {y}) is NOT transparent: {pixel}")
            
    if transparent_corners == 4:
        print("  ✅ Corners are transparent")
    else:
        print(f"  ⚠️ Only {transparent_corners}/4 corners are transparent")

if __name__ == "__main__":
    for f in FILES:
        check_transparency(f)
