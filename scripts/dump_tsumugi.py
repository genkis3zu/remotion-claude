from psd_tools import PSDImage
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
TARGET_FILE = r"春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
OUTPUT_TXT = r"tsumugi_structure.txt"

def print_structure(layer, f, indent=0):
    line = "  " * indent + f"- {layer.name}\n"
    f.write(line)
    if hasattr(layer, '__iter__'):
        for sub in layer:
            print_structure(sub, f, indent + 1)

def main():
    path = os.path.join(ASSETS_DIR, TARGET_FILE)
    print(f"Reading {path}...")
    try:
        psd = PSDImage.open(path)
        with open(OUTPUT_TXT, 'w', encoding='utf-8') as f:
            print_structure(psd, f)
        print(f"Dumped to {OUTPUT_TXT}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
