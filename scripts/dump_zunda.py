from psd_tools import PSDImage
import os
import sys

# Force UTF-8 for stdout if needed, but writing to file is safer
sys.stdout.reconfigure(encoding='utf-8')

ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
TARGET_FILE = r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd"
OUTPUT_TXT = r"zundamon_structure.txt"

def print_structure(layer, f, indent=0):
    line = "  " * indent + f"- {layer.name}\n"
    f.write(line)
    if hasattr(layer, '__iter__'):
        for sub in layer:
            print_structure(sub, f, indent + 1)

def main():
    path = os.path.join(ASSETS_DIR, TARGET_FILE)
    print(f"Reading {path}...")
    psd = PSDImage.open(path)
    
    with open(OUTPUT_TXT, 'w', encoding='utf-8') as f:
        print_structure(psd, f)
    print(f"Dumped to {OUTPUT_TXT}")

if __name__ == "__main__":
    main()
