---
name: Character Generator
description: Generate transparent character expression and pose assets from PSD files.
---

# Character Generator Skill

This skill allows you to generate character asset PNGs (with transparency) from Tachie (Standee) PSD files based on defined configurations for expressions and poses.

## Prerequisites

- **Python 3.x**
- **psd-tools**: `pip install psd-tools`
- **Pillow**: `pip install Pillow` (usually installed with psd-tools)

## Usage

1. **Configure Characters**
    - Edit `scripts/generate-expressions.py` to define your character configurations.
    - `psd`: Path to the source PSD file.
    - `groups`: Mapping of logical parts (eye, mouth, arm) to PSD layer group names.
    - `poses`: Definitions of arm/body states for different poses.
    - `emotions`: Definitions of eye/eyebrow states for different emotions.

2. **Run Generation**

    ```bash
    python .agents/skills/character-generator/scripts/generate-expressions.py
    ```

    or copy the script to your project root's `scripts` folder and run from there.

3. **Output**
    - Images are generated in `public/images/{character}/{pose}/{emotion}_{state}.png`.

## Script Details

- The script uses `psd-tools` to manipulate layer visibility.
- It performs a **manual** composition of visible layers to ensure RGBA transparency is preserved (standard `psd.composite()` often flattens to opaque RGB).
- Supports subdirectories for poses.
