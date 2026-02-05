from psd_tools import PSDImage
import os
import numpy as np
from PIL import Image

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
output_dir = r"d:\Dev\remotion-claude\public\images\tsumugi"

print(f"Loading PSD: {psd_path}")
psd = PSDImage.open(psd_path)

def set_visible(layer, visible):
    layer.visible = visible

def exclusive_show(group, layer_name):
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

def show_in_nested_group(psd, path_list):
    """
    path_list: ["Group1", "Group2", "LayerName"]
    Traverses and exclusively shows the path.
    """
    current_group = psd
    for name in path_list[:-1]: # Go through groups
        found = False
        for layer in current_group:
            if layer.name == name and layer.is_group():
                current_group = layer
                layer.visible = True
                found = True
                break
        if not found:
            print(f"Group {name} not found")
            return

    target_name = path_list[-1]
    exclusive_show(current_group, target_name)


# Map parts to layers
# Emotions: normal, happy, angry, sad, surprised, thinking
# States: close, open

EMOTION_MAP = {
    "normal": {
        "brows": "*普通眉",
        "eyes_setup": ["!目", "*基本目セット", "!黒目", "*基本"],
        "eyes_base": ["!目", "*基本目セット", "*白目基本"],
        "mouth_close": "*む",
        "mouth_open": "*わあ"
    },
    "happy": {
        "brows": "*ごきげん眉",
        "eyes_setup": ["!目", "*にっこり"],
        "mouth_close": "*ほほえみ",
        "mouth_open": "*わあーい"
    },
    "angry": {
        "brows": "*おこ眉",
        "eyes_setup": ["!目", "*上向き"],
        "mouth_close": "*むん",
        "mouth_open": "*いー"
    },
    "sad": {
        "brows": "*困り眉",
        "eyes_setup": ["!目", "*基本目セット", "!黒目", "*基本"],
        "eyes_base": ["!目", "*基本目セット", "*白目基本"],
        "mouth_close": "*む",
        "mouth_open": "*お"
    },
    "surprised": {
        "brows": "*普通眉",
        "eyes_setup": ["!目", "*基本目セット", "*白目見開き"],
        "eyes_base": ["!目", "*基本目セット", "*白目見開き"],
        "mouth_close": "*お",
        "mouth_open": "*わあ"
    },
    "thinking": {
        "brows": "*困り眉",
        "eyes_setup": ["!目", "*基本目セット", "!黒目", "*目逸らし"],
        "eyes_base": ["!目", "*基本目セット", "*白目基本"],
        "mouth_close": "*む",
        "mouth_open": "*えあー"
    }
}

# Layers cache
layers = {l.name: l for l in psd}
mouth_group = layers.get("!口")
brow_group = layers.get("!まゆ")
eye_group = layers.get("!目")
cheek_group = layers.get("!ほっぺ")
r_arm = layers.get("!右腕")
l_arm = layers.get("!左腕")

# setup base
if "*体" in layers: layers["*体"].visible = True
if "!サイドテール:flipx" in layers: layers["!サイドテール:flipx"].visible = True 
if "!サイドテール" in layers: layers["!サイドテール"].visible = True
if "!もみあげ" in layers: layers["!もみあげ"].visible = True
if cheek_group: exclusive_show(cheek_group, "*基本")
if r_arm: exclusive_show(r_arm, "*基本")
if l_arm: exclusive_show(l_arm, "*基本")

def configure_eyes(config):
    # Reset Eye Group First?
    # Hide all top level eyes first
    for l in eye_group: 
        l.visible = False

    if "eyes_setup" in config:
        # If it's a list, it's a path
        path = config["eyes_setup"]
        if path[1] == "*基本目セット":
             basic_set = None
             for l in eye_group: 
                 if l.name == "*基本目セット": 
                     l.visible = True
                     basic_set = l
                     break
             
             # Inside Basic set: "*白目基本", "*白目見開き", "!黒目"
             # Reset internal visibility
             for l in basic_set: l.visible = False

             # Set Base White
             base_white = config["eyes_base"][-1]
             
             for l in basic_set:
                 if l.name == base_white: l.visible = True
                 if l.name == "!黒目": l.visible = True # Iris group always visible if using basic set?

             # Set Iris
             iris_name = path[-1]
             if path[-2] == "!黒目":
                 # Find Iris group
                 iris_group = None
                 for l in basic_set:
                     if l.name == "!黒目": iris_group = l
                 exclusive_show(iris_group, iris_name)
             else:
                 # Case for "白目見開き" only?
                 pass

        else:
            # Simple top level eye (e.g. にっこり)
            target_name = path[1]
            exclusive_show(eye_group, target_name)



# Run all
emotions = ["normal", "happy", "angry", "sad", "surprised", "thinking"]
states = ["close", "open"]

# Define Poses
poses = {
    "root": { # "Normal" pose in root dir
        "dir": "",
        "r_arm": "*基本",
        "l_arm": "*基本"
    },
    "pointing": {
        "dir": "pointing",
        "r_arm": "*ゆびさし",
        "l_arm": "*基本"
    },
    "peace": {
        "dir": "peace",
        "r_arm": "*ピース", # Assuming Right Arm Peace
        "l_arm": "*基本"
    },
    "normal": {
        "dir": "normal",
        "r_arm": "*基本",
        "l_arm": "*基本"
    }
}

for pose_name, pose_config in poses.items():
    print(f"--- Generating Pose: {pose_name} ---")
    
    # Set Arms
    if r_arm: exclusive_show(r_arm, pose_config["r_arm"])
    if l_arm: exclusive_show(l_arm, pose_config["l_arm"])
    
    # Determine Output directory
    target_dir = os.path.join(output_dir, pose_config["dir"])
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    for emo in emotions:
        for st in states:
            # Need to pass target_dir to generate
            # But generate() uses global output_dir. 
            # Let's Refactor generate() to accept dir.
            
            print(f"Generating {emo} {st} in {target_dir}...")
            config = EMOTION_MAP[emo]
            
            # Set Brows
            exclusive_show(brow_group, config["brows"])
            
            # Set Eyes
            configure_eyes(config)
        
            # Set Mouth
            # mouth_name = config[f"mouth_{state}"]
            # Use 'st' loop var!
            mouth_name = config[f"mouth_{st}"]
            exclusive_show(mouth_group, mouth_name)
        
            # Composite using numpy for RGBA
            data = psd.numpy()
            
            # Normalize and Un-multiply
            if data.dtype != np.uint8:
                if data.shape[0] == 4: 
                     data = np.transpose(data, (1, 2, 0))
                
                data = np.clip(data, 0.0, 1.0)
                
                alpha = data[..., 3]
                rgb = data[..., :3]
                
                mask = alpha > 0
                rgb[mask] /= alpha[mask, np.newaxis]
                
                rgb = np.clip(rgb, 0.0, 1.0)
                data[..., :3] = rgb
                data = (data * 255).astype(np.uint8)
            
            image = Image.fromarray(data, 'RGBA')
            
            filename = f"{emo}_{st}.png"
            image.save(os.path.join(target_dir, filename))
