
import json
import os

INPUT_PATH = "src/data/full_script.json"
OUTPUT_PATH = "src/data/image_prompts.json"

def main():
    if not os.path.exists(INPUT_PATH):
        print("File not found")
        return

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        chapters = json.load(f)

    prompts = []
    
    count = 0
    for ch_idx, ch in enumerate(chapters):
        for item_idx, item in enumerate(ch["items"]):
            # Background
            if "backgroundPrompt" in item:
                filename = f"bg_{ch_idx}_{item_idx}.png"
                prompts.append({
                    "type": "background",
                    "prompt": item["backgroundPrompt"],
                    "filename": filename,
                    "path": f"public/assets/bg/{filename}"
                })
            # Insert Image
            if "insertImagePrompt" in item:
                filename = f"insert_{ch_idx}_{item_idx}.png"
                prompts.append({
                    "type": "insert",
                    "prompt": item["insertImagePrompt"],
                    "filename": filename,
                    "path": f"public/assets/inserts/{filename}"
                })

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(prompts)} prompts to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
