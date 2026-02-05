#!/usr/bin/env python3
"""
Generate Character Expressions and Poses from PSD (Transparent Fix)
"""

from psd_tools import PSDImage
from PIL import Image
import os
import sys

ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
OUTPUT_DIR = r"D:\Dev\remotion-claude\public\images"

CONFIG = {
    "zundamon": {
        "psd": r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd",
        "groups": {
            "eye": "!目",
            "eyebrow": "!眉",
            "mouth": "!口",
            "arm_r": "!右腕",
            "arm_l": "!左腕"
        },
        "poses": {
            "normal": {
                "arm_r": "*基本",
                "arm_l": "*基本"
            },
            "pointing": {
                "arm_r": "*指差し上", 
                "arm_l": "*基本"
            },
            "confident": {
                "arm_r": "*腰",
                "arm_l": "*腰"
            },
            "hands_up": {
                "arm_r": "*手を挙げる",
                "arm_l": "*手を挙げる"
            }
        },
        "emotions": {
            "normal": {
                "eye": "*基本目",
                "eyebrow": "*基本眉",
            },
            "happy": {
                "eye": "*にっこり",
                "eyebrow": "*基本眉",
            },
            "sad": {
                "eye": "*基本目",
                "eyebrow": "*困り眉",
            },
            "angry": {
                "eye": "*ジト目",
                "eyebrow": "*怒り眉",
            },
            "surprised": {
                "eye": "*〇〇",
                "eyebrow": "*基本眉",
            },
            "thinking": {
                "eye": "*基本目↑",
                "eyebrow": "*基本眉",
            },
        },
        "mouths": {
            "open": ["*わあー", "*お", "*いー", "*あ"],
            "close": ["*ほほえみ", "*む", "*ふ"],
        }
    },
    "metan": {
        "psd": r"四国めたん立ち絵素材2.1\四国めたん立ち絵素材2.1.psd",
        "groups": {
            "eye": "!目",
            "eyebrow": "!眉",
            "mouth": "!口",
            "arm_r": "!右腕",
            "arm_l": "!左腕"
        },
        "poses": {
            "normal": {
                "arm_r": "*普通",
                "arm_l": "*普通"
            },
            "pointing": {
                "arm_r": "*指差す",
                "arm_l": "*普通"
            },
            "thinking": {
                "arm_r": "*普通",
                "arm_l": "*口元に指"
            },
            "holding": {
                "arm_r": "*普通",
                "arm_l": "*抱える"
            }
        },
        "emotions": {
            "normal": {
                "eye": "*目セット",
                "eyebrow": "*太眉ごきげん",
            },
            "happy": {
                "eye": "*><",
                "eyebrow": "*太眉ごきげん",
            },
            "sad": {
                "eye": "*目セット",
                "eyebrow": "*太眉こまり",
            },
            "angry": {
                "eye": "*目セット",
                "eyebrow": "*太眉おこ",
            },
            "surprised": {
                "eye": "*目セット", 
                "eyebrow": "*太眉ごきげん",
            },
            "thinking": {
                "eye": "*見上げ",
                "eyebrow": "*太眉ごきげん",
            },
        },
         "mouths": {
            "open": ["*わあー", "*お", "*いー", "*あ"],
            "close": ["*ほほえみ", "*む", "*ふ"],
        }
    },
    "tsumugi": {
        "psd": r"春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd",
        "groups": {
            "eye": "!目",
            "eyebrow": "!まゆ",
            "mouth": "!口",
            "arm_r": "!右腕",
            "arm_l": "!左腕"
        },
        "poses": {
            "normal": {
                "arm_r": "*基本",
                "arm_l": "*基本"
            },
            "pointing": {
                "arm_r": "*ゆびさし",
                "arm_l": "*基本"
            },
            "peace": {
                "arm_r": "*ピース",
                "arm_l": "*ピース"
            }
        },
        "emotions": {
            "normal": {
                "eye": "*基本目セット",
                "eyebrow": "*普通眉",
            },
            "happy": {
                "eye": "*にっこり",
                "eyebrow": "*ごきげん眉",
            },
            "sad": {
                "eye": "*基本目セット", # or *上向き? No.
                "eyebrow": "*困り眉",
            },
            "angry": {
                "eye": "*基本目セット",
                "eyebrow": "*おこ眉",
            },
            "surprised": {
                "eye": "*〇〇",
                "eyebrow": "*普通眉",
            },
            "thinking": {
                "eye": "*上向き",
                "eyebrow": "*普通眉",
            },
        },
        "mouths": {
            "open": ["*わあーい", "*わあ", "*おあー", "*お"],
            "close": ["*ほほえみ", "*む", "*むん"],
        }
    }
}

def set_visible_recursive(layer, config_groups, target_config):
    is_controlled_group = False
    controlled_type = None
    
    for c_type, c_name in config_groups.items():
        if layer.name == c_name:
            is_controlled_group = True
            controlled_type = c_type
            break
            
    if is_controlled_group:
        layer.visible = True
        target_name = target_config.get(controlled_type)
        
        if hasattr(layer, '__iter__'):
            found = False
            for child in layer:
                if isinstance(target_name, str):
                    if child.name == target_name:
                        child.visible = True
                        found = True
                    else:
                        child.visible = False
                elif isinstance(target_name, list):
                    if not target_name:
                        child.visible = False
                    elif child.name in target_name:
                        pass # Should be handled by logic
            
            # Warn if target not found (except if it was None/empty)
        return

    if hasattr(layer, '__iter__'):
        for child in layer:
            set_visible_recursive(child, config_groups, target_config)

def composite_manual(group, canvas):
    """
    Manually composite visible layers onto an RGBA canvas.
    This ensures transparency is preserved.
    """
    if not hasattr(group, '__iter__'):
        return
        
    for layer in group:
        if layer.visible:
            if layer.is_group():
                composite_manual(layer, canvas)
            else:
                try:
                    # topil() returns the image of the layer
                    img = layer.topil()
                    if img:
                        # Convert to RGBA if not already
                        if img.mode != 'RGBA':
                            img = img.convert('RGBA')
                        
                        # Apply layer opacity if needed (psd-tools handles this in topil usually? No, topil is raw)
                        # Actually layer.composite() handles blend modes and opacity better, but it might be slow or opaque?
                        # layer.composite() returns the result of compositing THAT layer. 
                        # If it's a pixel layer, composite() == topil() usually but with adjustments.
                        # Let's stick to topil() + simple alpha paste for speed/simplicity as we don't have complex blend modes here.
                        # Wait, standard Tachie usually has Normal blend mode.
                        
                        # Paste using alpha channel as mask
                        canvas.paste(img, (layer.left, layer.top), img)
                except Exception as e:
                    # Ignore empty layers or errors
                    pass

def find_available_layer(layer_group, candidates):
    if not hasattr(layer_group, '__iter__'):
        return None
    existing_names = [l.name for l in layer_group]
    for c in candidates:
        if c in existing_names:
            return c
    if len(existing_names) > 0:
        return existing_names[0]
    return None

def get_layer_by_name(root, name):
    if root.name == name:
        return root
    if hasattr(root, '__iter__'):
        for child in root:
            res = get_layer_by_name(child, name)
            if res: return res
    return None

def apply_state(psd, char_config, pose_settings, emotion_settings, mouth_candidates):
    groups_map = char_config["groups"]
    
    mouth_group = get_layer_by_name(psd, groups_map["mouth"])
    if not mouth_group:
        print(f"    ERROR: Mouth group '{groups_map['mouth']}' not found in PSD")
        target_mouth = None
    else:
        target_mouth = find_available_layer(mouth_group, mouth_candidates)
    
    target_config = {
        **pose_settings,
        **emotion_settings,
        "mouth": target_mouth
    }
    
    set_visible_recursive(psd, groups_map, target_config)
    
    return target_mouth

def generate(char_id, config):
    psd_path = os.path.join(ASSETS_DIR, config["psd"])
    if not os.path.exists(psd_path):
        print(f"PSD not found: {psd_path}")
        return

    print(f"Loading {char_id} from {os.path.basename(psd_path)}...")
    psd = PSDImage.open(psd_path)
    
    for pose_name, pose_settings in config["poses"].items():
        print(f"  Generating Pose: {pose_name}")
        out_dir = os.path.join(OUTPUT_DIR, char_id, pose_name)
        os.makedirs(out_dir, exist_ok=True)
        
        for emotion_name, emotion_settings in config["emotions"].items():
            for state in ["open", "close"]:
                mouth_candidates = config["mouths"][state]
                used_mouth = apply_state(psd, config, pose_settings, emotion_settings, mouth_candidates)
                
                # Manual Composite for Transparency
                image = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))
                composite_manual(psd, image)
                
                filename = f"{emotion_name}_{state}.png"
                if emotion_name == "normal":
                     filename = f"mouth_{state}.png"

                save_path = os.path.join(out_dir, filename)
                image.save(save_path)

def main():
    print("Starting Expression & Pose Generation (Transparent)...")
    
    for char_id, cfg in CONFIG.items():
        try:
            generate(char_id, cfg)
        except Exception as e:
            print(f"Failed to generate {char_id}: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
