const PALETTE_BASE_PATH = 'src/static/palettes/'
export const PALETTE_IDS = {
  BASALT_CANYON: 'BASALT_CANYON'
}
const PALETTE_PATHS = {
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
 */
export async function createPalette(paletteId, bounds) {
  return new Promise((resolve, reject) => {
    p5.loadImage(PALETTE_BASE_PATH + PALETTE_PATHS[paletteId], image => {
      image.loadPixels();
      sourceImages[paletteId] = image;

      // public interface for palette instances
      const palette = {
        width: image.width,
        height: image.height,
        getColor: (u, v) => getColor(image, u, v),
        getColorAtMouse: (x, y) => getColorAtMouse(image, bounds, x, y)
      };

      palettes[paletteId] = palette;
      resolve(palette);
      // TODO: handle error and reject()
    });
  });
}

function getColor(paletteSource, u, v) {
  const startIndex = (v * paletteSource.width + u) * 4;
  return [
    paletteSource.pixels[startIndex],
    paletteSource.pixels[startIndex + 1],
    paletteSource.pixels[startIndex + 2],
    paletteSource.pixels[startIndex + 3]
  ];
}

function getColorAtMouse(paletteSource, bounds, mouseX, mouseY) {
  return getColor(
    paletteSource,
    Math.round(mouseX / bounds.w * paletteSource.width),
    Math.round(mouseY / bounds.h * paletteSource.height)
  );
}
