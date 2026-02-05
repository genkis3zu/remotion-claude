from psd_tools import PSDImage
import numpy as np
from PIL import Image

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)

def find_layer(group, name):
    for layer in group:
        if layer.name == name:
            return layer
        if layer.is_group():
             found = find_layer(layer, name)
             if found: return found
    return None

cheek_group = find_layer(psd, "!ほっぺ")
basic_cheek = find_layer(cheek_group, "*基本")

print(f"Extracting {basic_cheek.name}...")
# Get image of just this layer
img = basic_cheek.composite() # This composites the layer in isolation
print(f"Mode: {img.mode}")

# Get data
data = np.array(img)
# Find non-transparent pixels
alpha = data[:,:,3]
mask = alpha > 0
if mask.any():
    pixels = data[mask]
    avg_color = pixels.mean(axis=0)
    print(f"Average Color (RGBA): {avg_color}")
    
    # Grab a sample pixel
    y, x = np.where(mask)
    cy, cx = y[0], x[0]
    print(f"Sample Pixel at {cx},{cy}: {data[cy, cx]}")
else:
    print("Layer is fully transparent!")

# Save for visual inspection check (optional, but command line won't see it)
img.save("debug_cheek.png")
