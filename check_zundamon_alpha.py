import os
from PIL import Image
from psd_tools import PSDImage

z_path = r"d:\Dev\remotion-claude\public\images\zundamon\normal_close.png"
psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"

def check(path):
    if not os.path.exists(path):
        print(f"{path} not found")
        return
    img = Image.open(path)
    print(f"--- {path} ---")
    print(f"Format: {img.format}")
    print(f"Mode: {img.mode}")
    if img.mode == "RGBA":
        print(f"TopLeft: {img.getpixel((0,0))}")

check(z_path)

print(f"Loading {psd_path}...")
psd = PSDImage.open(psd_path)
print(f"PSD Channels: {psd.channels}")
print(f"PSD Color Mode: {psd.color_mode}")
# Try compositing a small part or check default composite
comp = psd.composite()
print(f"Composite Mode: {comp.mode}")
