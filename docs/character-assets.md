# Character Assets System

This project uses a layered approach to generate character assets from PSD files. This allows for dynamic expression changes and lip-syncing.

## Supported Characters

- **Zundamon** (`zundamon`)
- **Shikoku Metan** (`metan`)
- **Kasukabe Tsumugi** (`tsumugi`)

## Asset Structure

Character images are constructed from multiple layers defined in text files (e.g., `tsumugi_structure.txt`). These layers typically include:

1. **Body/Base**: The main body of the character.
2. **Arms**: Left and right arms with various poses (e.g., pointing, peace sign).
3. **Face/Expressions**:
    - **Eyebrows**: Angry, Sad, Happy, etc.
    - **Eyes**: Open, Closed, Surprised, etc.
    - **Mouth**: Various shapes for lip-sync (A, I, U, E, O, etc.).
4. **Accessories/Effects**: Cheek blushes, tears, sweat, etc.

## Generation Pipeline

We use Python scripts to parse PSD files and extract/combine layers into usable transparent PNGs.

### Key Scripts

- `scripts/generate-expressions.py`: Main script to generate expression variations.
- `scripts/extract_tsumugi.py` / `scripts/dump_tsumugi.py`: Tools specifically for handling Tsumugi's layer structure.
- `scripts/check_transparency.py`: Verifies that generated assets have correct alpha channels (transparent backgrounds).

### Output

Generated assets are stored in `public/characters/{character_id}/`.
Each character folder contains subfolders for different states (e.g., `normal`, `happy`, `sad`) or individual parts depending on the rendering strategy.

## Adding New Poses/Expressions

1. Update the structure definition file (e.g., `tsumugi_structure.txt`) to include the new layer name from the PSD.
2. Run the generation script (e.g., `python scripts/generate-expressions.py`).
3. Verify the output in `public/characters/`.
