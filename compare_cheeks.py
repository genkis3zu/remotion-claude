import os
import numpy as np
from PIL import Image

dir_path = r"d:\Dev\remotion-claude\public\images\tsumugi"
angry_c = os.path.join(dir_path, "angry_close.png")
angry_o = os.path.join(dir_path, "angry_open.png")

def get_cheek_color(path):
    if not os.path.exists(path):
        print(f"Missing: {path}")
        return None
    
    img = Image.open(path)
    data = np.array(img)
    # Approx cheek area? 
    # Based on previous inspection: Center Pixel (541, 910), Cheek found.
    # Let's verify a known cheek region.
    # Previous script found peach pixels.
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    mask = (r > 200) & (g > 180) & (g < 220) & (b > 160) & (b < 200) & (a == 255)
    
    if mask.any():
        avg = data[mask].mean(axis=0)
        return avg
    return None

c_color = get_cheek_color(angry_c)
o_color = get_cheek_color(angry_o)

print(f"Angry Close Cheek: {c_color}")
print(f"Angry Open Cheek: {o_color}")

# Check if pointing dir exists
pointing_dir = os.path.join(dir_path, "pointing")
if os.path.exists(pointing_dir):
    print(f"Pointing dir exists: {pointing_dir}")
    # Check a file in there
    files = os.listdir(pointing_dir)
    print(f"Files in pointing: {files}")
    if files:
        p_color = get_cheek_color(os.path.join(pointing_dir, files[0]))
        print(f"Pointing Cheek: {p_color}")
else:
    print("Pointing dir does NOT exist")
