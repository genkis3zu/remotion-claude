import os
from PIL import Image
import numpy as np

img_path = r"d:\Dev\remotion-claude\public\images\tsumugi\normal_close.png"
if not os.path.exists(img_path):
    print("Image not found")
    exit()

img = Image.open(img_path)
print(f"Mode: {img.mode}")
data = np.array(img)

# Check center pixel (Body)
h, w = data.shape[:2]
cy, cx = h//2, w//2
print(f"Center Pixel ({cx}, {cy}): {data[cy, cx]}")

# Check for Peach Color (Cheek)
# Target approx (254, 205, 189)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Loose match
mask = (r > 200) & (g > 180) & (g < 220) & (b > 160) & (b < 200) & (a == 255)
if mask.any():
    print("Found Opaque Peach Pixels (Cheek Candidate)!")
    y, x = np.where(mask)
    # Get average of these
    pixels = data[mask]
    avg = pixels.mean(axis=0)
    print(f"Average Peach Pixel: {avg}")
else:
    print("No Opaque Peach Pixels found.")

# Check for Dark Brown pixels?
# (66, 53, 49)
mask_brown = (r < 100) & (g < 100) & (b < 100) & (mask == False) & (a == 255) # Opaque Brown
# Note: Hair might be brown?
# But cheeks shouldn't be.
