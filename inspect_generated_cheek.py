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

# Find pixels with alpha between 10 and 200 (semi transparent)
alpha = data[:,:,3]
mask = (alpha > 50) & (alpha < 200)

if mask.any():
    pixels = data[mask]
    avg = pixels.mean(axis=0)
    print(f"Average Semi-Transparent Pixel: {avg}")
    
    # Check specific sample
    y, x = np.where(mask)
    cy, cx = y[0], x[0]
    px = data[cy, cx]
    print(f"Sample at {cx},{cy}: {px}")
    
    # Calculate unmultiplied
    a_norm = px[3] / 255.0
    if a_norm > 0:
        unmul = px[:3] / a_norm
        print(f"Unmultiplied: {unmul}")

else:
    print("No semi-transparent pixels found.")
