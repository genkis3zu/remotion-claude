from psd_tools import PSDImage
import os

ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"

FILES = [
    r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd",
    r"四国めたん立ち絵素材2.1\四国めたん立ち絵素材2.1.psd"
]

def print_structure(layer, indent=0):
    print("  " * indent + f"- {layer.name} (visible={layer.visible}, kind={layer.kind})")
    if hasattr(layer, '__iter__'):
        for sub in layer:
            print_structure(sub, indent + 1)

def main():
    for f in FILES:
        path = os.path.join(ASSETS_DIR, f)
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue
            
        print(f"\nScanning: {f}")
        psd = PSDImage.open(path)
        print_structure(psd)

if __name__ == "__main__":
    main()
