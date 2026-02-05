from psd_tools import PSDImage
import os

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
output_dir = r"d:\Dev\remotion-claude\public\images\tsumugi"

print(f"Loading PSD: {psd_path}")
psd = PSDImage.open(psd_path)

def find_layer(group, name):
    for layer in group:
        if layer.name == name:
            return layer
        if layer.is_group():
            found = find_layer(layer, name)
            if found:
                return found
    return None

def set_visible(layer, visible):
    layer.visible = visible

# Basic Setup (Ensure base parts are visible)
# Note: This depends on the specific PSD structure. 
# Based on inspection:
# Need to ensure body, arms, hair, eyes are visible.
# And ensure other variants (other eyes, brows) are hidden.

# Helper to exclusive show in group
def exclusive_show(group, layer_name):
    # Find the target layer first to ensure it exists
    target = None
    for layer in group:
        if layer.name == layer_name:
            target = layer
            break
    
    if target:
        for layer in group:
            layer.visible = (layer == target)
    else:
        print(f"Warning: Layer {layer_name} not found in group {group.name}")

# Traverse and setup base state
# Top level layers
# *体 -> Visible
# !サイドテール:flipx -> Visible
# !サイドテール -> Visible
# !右腕 -> *基本 (Exclusive)
# !左腕 -> *基本 (Exclusive)
# !もみあげ -> Visible
# !ほっぺ -> *基本 (Exclusive)
# !目 -> *基本目セット (Exclusive) -> *白目基本 (Vis) & !黒目 -> *基本 (Exclusive)
# !まゆ -> *普通眉 (Exclusive)
# !口 -> (Variable)

# Let's interact with top level layers by name
layers = {l.name: l for l in psd}

# Ensure static parts are visible
if "体" in layers: layers["体"].visible = True
if "サイドテール:flipx" in layers: layers["サイドテール:flipx"].visible = True 
if "サイドテール" in layers: layers["サイドテール"].visible = True
if "もみあげ" in layers: layers["もみあげ"].visible = True

# Arms
if "右腕" in layers: exclusive_show(layers["右腕"], "基本")
if "左腕" in layers: exclusive_show(layers["左腕"], "基本")

# Face Parts
if "ほっぺ" in layers: exclusive_show(layers["ほっぺ"], "基本")
if "まゆ" in layers: exclusive_show(layers["まゆ"], "普通眉")

# Eyes
if "目" in layers: 
    eye_group = layers["目"]
    exclusive_show(eye_group, "基本目セット")
    # Dig deeper into Basic Eye Set
    basic_eye_set = find_layer(eye_group, "基本目セット")
    if basic_eye_set:
        # Ensure whitelist visible? Or assume structure
        # Structure: *白目基本, *白目見開き, !黒目
        for l in basic_eye_set:
            if l.name == "白目基本": l.visible = True
            if l.name == "白目見開き": l.visible = False
            if l.name == "黒目": 
                 l.visible = True
                 exclusive_show(l, "基本")

# Mouth Processing
mouth_group = layers.get("口")

def save_state(mouth_name, filename):
    print(f"Generating {filename} with mouth {mouth_name}...")
    if mouth_group:
        exclusive_show(mouth_group, mouth_name)
    
    image = psd.composite()
    image.save(os.path.join(output_dir, filename))
    print(f"Saved {filename}")

# Generate Mouth Close (using "む" or "ほほえみ")
save_state("ほほえみ", "mouth_close.png")

# Generate Mouth Open (using "わあ" or "あ")
save_state("わあ", "mouth_open.png")

print("Done.")
