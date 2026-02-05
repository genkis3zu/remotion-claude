// SVG Path Data for Bubble Masks
// Coordinates are normalized (0..1) relative to the bounding box.

// Zundamon (Green Bubble) - Standard Safe Zone (Top 0.15, Bottom 0.82)
const ZUNDAMON_PATH = `
    M 0.12 0.20 
    Q 0.12 0.15 0.20 0.15 
    H 0.80 
    Q 0.88 0.15 0.88 0.20 
    V 0.75 
    Q 0.88 0.82 0.80 0.82 
    H 0.20 
    Q 0.12 0.82 0.12 0.75 
    Z
`.replace(/\s+/g, ' ').trim();

// Metan (Pink Bubble) - Taller Zone (Top 0.13, Bottom 0.84)
const METAN_PATH = `
    M 0.12 0.20 
    Q 0.12 0.13 0.20 0.13 
    H 0.80 
    Q 0.88 0.13 0.88 0.20 
    V 0.75 
    Q 0.88 0.84 0.80 0.84 
    H 0.20 
    Q 0.12 0.84 0.12 0.75 
    Z
`.replace(/\s+/g, ' ').trim();

// Tsumugi (Yellow Bubble) - Taller Zone (Top 0.13, Bottom 0.84)
const TSUMUGI_PATH = `
    M 0.12 0.20 
    Q 0.12 0.13 0.20 0.13 
    H 0.80 
    Q 0.88 0.13 0.88 0.20 
    V 0.75 
    Q 0.88 0.84 0.80 0.84 
    H 0.20 
    Q 0.12 0.84 0.12 0.75 
    Z
`.replace(/\s+/g, ' ').trim();

// Add specific character paths here as needed
export const BUBBLE_PATHS: Record<string, string> = {
    default: ZUNDAMON_PATH,
    zundamon: ZUNDAMON_PATH,
    metan: METAN_PATH,
    tsumugi: TSUMUGI_PATH
};
