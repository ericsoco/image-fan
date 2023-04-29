const PALETTE_BASE_PATH = 'src/static/palettes/'
export const PALETTE_IDS = {
  BASALT_CANYON: 'BASALT_CANYON',
  COLORFUL_WINTER: 'COLORFUL_WINTER',
  MARS: 'MARS',
  PURPLE_GLOOM: 'PURPLE_GLOOM',
  WAVE_FROTH: 'WAVE_FROTH',
  WIND_AND_FROST: 'WIND_AND_FROST',
  WINTER_GRASS: 'WINTER_GRASS'
};
const PALETTE_PATHS = {
  [PALETTE_IDS.WINTER_GRASS]: 'northlandscapes-germany-abstract-views-of-winter-07.jpg',
  [PALETTE_IDS.WIND_AND_FROST]: 'northlandscapes-iceland-shaped-by-wind-and-frost-06.jpg',
  [PALETTE_IDS.MARS]: 'northlandscapes-mars-2139-02.jpg',
  [PALETTE_IDS.PURPLE_GLOOM]: 'northlandscapes-iceland-prelude-to-the-end-of-everything-01.jpg',
  [PALETTE_IDS.WAVE_FROTH]: 'northlandscapes-iceland-sunset-waves-03.jpg',
  [PALETTE_IDS.COLORFUL_WINTER]: 'northlandscapes-iceland-a-colorful-flow-signs-of-winter-03.jpg',
  [PALETTE_IDS.BASALT_CANYON]: 'northlandscapes-iceland-basalt-14.jpg'
};

let p5 = null;
let sourceImages = {};
let palettes = {};

/**
 * Init before creating instances
 */
export function initFactory(_p5) {
  p5 = _p5;
}


/**
 * Create palette
 * @param {string} id - Palette ID (from PALETTE_IDS)
 * @param {w: number, h: number} bounds - Sketch bounds
 */
export async function createPalette(id, bounds) {
  const paletteId = id || getRandomPaletteId();
  console.log(`Creating palette ${paletteId}`);
  return new Promise((resolve, reject) => {
    p5.loadImage(PALETTE_BASE_PATH + PALETTE_PATHS[paletteId], image => {
      image.loadPixels();
      sourceImages[paletteId] = image;

      // public interface for palette instances
      const palette = {
        width: image.width,
        height: image.height,
        getColor: (u, v) => getColor(image, u, v),
        getScreenColor: (x, y) => getScreenColor(image, bounds, x, y),
        getScaledColor: (coords) => getScaledColor(image, bounds, coords)
      };

      palettes[paletteId] = palette;
      resolve(palette);
    });
  });
}

function getRandomPaletteId() {
  const vals = Object.values(PALETTE_IDS);
  return vals[Math.floor(Math.random() * vals.length)];
}

/**
 * Get color from palette at (u,v) coords
 */
function getColor(paletteSource, u, v) {
  const startIndex = (v * paletteSource.width + u) * 4;
  return [
    paletteSource.pixels[startIndex],
    paletteSource.pixels[startIndex + 1],
    paletteSource.pixels[startIndex + 2],
    paletteSource.pixels[startIndex + 3]
  ];
}

/**
 * Get color from palette at screen (x,y) coords
 */
function getScreenColor(paletteSource, bounds, screenX, screenY) {
  return getColor(
    paletteSource,
    screenXToPalette(paletteSource, bounds, screenX),
    screenYToPalette(paletteSource, bounds, screenY)
  );
}

/**
 * Get color from palette at location specified by
 * either a palette (u/v) or screen (x/y) coordinate.
 * If both are supplied for a given axis (u + x / v + y),
 * will prefer palette coordinates. 
 * If a coord is absent, throws.
 */
function getScaledColor(paletteSource, bounds, {u, v, x, y}) {
  const uu = isNaN(u) ? screenXToPalette(paletteSource, bounds, x) : u;
  const vv = isNaN(v) ? screenYToPalette(paletteSource, bounds, y) : v;
  if (isNaN(uu)) throw new Error('No u / x coordinate supplied');
  if (isNaN(vv)) throw new Error('No v / y coordinate supplied');
  return getColor(paletteSource, uu, vv);
}

function screenXToPalette(paletteSource, bounds, x) {
  return Math.round(x / bounds.w * paletteSource.width);
}

function screenYToPalette(paletteSource, bounds, y) {
  Math.round(y / bounds.h * paletteSource.height);
}
