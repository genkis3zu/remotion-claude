import os
from PIL import Image

z_path = r"public\images\zundamon\normal_close.png"
t_path = r"public\images\tsumugi\normal_close.png"

def check(path):
    if not os.path.exists(path):
        print(f"{path} not found")
        return
    img = Image.open(path)
    print(f"--- {path} ---")
    print(f"Format: {img.format}")
    print(f"Mode: {img.mode}")
    print(f"Size: {img.size}")
    if img.mode == "RGBA":
        # Check corner pixel for alpha
        print(f"TopLeft: {img.getpixel((0,0))}")
    elif img.mode == "RGB":
        print(f"TopLeft: {img.getpixel((0,0))}")

check(z_path)
check(t_path)
