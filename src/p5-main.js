import {
  PALETTE_IDS,
  initFactory as initPaletteFactory,
  createPalette,
} from './palette.js';

import {
  initFactory as initEmitterFactory,
  spawnEmitter,
  updateEmitters,
  drawEmitters,
  getSpawnTime,
  SPAWN_DELAY
} from './emitter.js';

import {
  initFactory as initParticleFactory,
  spawnParticle,
  updateParticles,
  drawParticles
} from './particle.js';

//
// consts
//
const BW = 1600;
const BH = 900;
const BOUNDS = {
  w: BW,
  h: BH,
  diag: Math.sqrt(BW*BW, BH*BH)
};


export default function (p5) {
  //
  // vars
  //
  let g2;  // 2D buffer
  let g3;  // 3D buffer
  let debug = false;
  let palette;

  initPaletteFactory(p5);
  initParticleFactory(p5, BOUNDS);
  initEmitterFactory(p5, BOUNDS);

  createPalette(PALETTE_IDS.BASALT_CANYON, BOUNDS).then(loadedPalette => {
    palette = loadedPalette
  });


  /**
   * Attach p5 setup() method to p5 instance
   */
  p5.setup = () => {
    p5.createCanvas(BOUNDS.w, BOUNDS.h);

    g3 = p5.createGraphics(BOUNDS.w, BOUNDS.h, p5.WEBGL);
    g3.colorMode(p5.RGB, 255, 255, 255, 1);
    
    // Set depth buffer clear depth
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth
    // g3.drawingContext.clearDepth(1);
    
    // monkeying around
    // g3.blendMode(DARKEST);
    // g3.setAttributes('depth', false);
    // g3.setAttributes('alpha', true);
    
    g2 = p5.createGraphics(BOUNDS.w, BOUNDS.h, p5.WEBGL);
    g2.colorMode(p5.RGB, 255, 255, 255, 1);
  };

  /**
   * Attach p5 draw() method to p5 instance
   */
  p5.draw = () => {
    g3.push()
    g3.translate(-BOUNDS.w/2, -BOUNDS.h/2);
    g2.push()
    g2.translate(-BOUNDS.w/2, -BOUNDS.h/2);

    // updateEnv();
    updateObjects();
    palette
      ? render()
      : renderLoading();

    g3.pop();
    g2.pop();
  };

  /**
   * Attach p5 keyPressed() method to p5 instance
   */
  p5.keyPressed = () => {
    //
  }

  /**
   * Attach p5 mouseClicked() method to p5 instance
   */
  p5.mouseClicked = () => {
    spawnEmitter(getMouseLoc(p5), palette);
  }

  /*
  function updateEnv() {
    updateLight(g3);
  }

  function updateLight(g3) {
    g3.ambientLight(250, 250, 250);
    g3.directionalLight(
      250, 250, 250,
      0, 0, -1
    );
  }
  */

  function getMouseLoc(p5) {
    return p5.createVector(p5.mouseX, p5.mouseY, 0);
  }

  function updateObjects() {
    updateEmitters(spawnParticle);
    updateParticles();
  }

  function testPalette() {
    const color = palette.getColorAtMouse(p5.mouseX, p5.mouseY);
    g3.rectMode(p5.CENTER);
    g3.noStroke();
    g3.fill(color);
    g3.rect(p5.mouseX, p5.mouseY, 60, 60);
  }

  function render() {
    p5.background(180, 170, 160);
    
    // particle trails
    g3.noStroke();
    g3.fill(230, 0.01);
    g3.rect(0, 0, BOUNDS.w, BOUNDS.h);
    // Depth buffer is supposed to be cleared on every update()
    // https://github.com/processing/p5.js/blob/main/src/webgl/p5.RendererGL.js#L583
    // ...but perhaps update() is not called on renderer that is not
    // the main context (createGraphics vs createCanvas(GL)).
    // clear() only clears color buffer
    // https://github.com/processing/p5.js/blob/main/src/webgl/p5.RendererGL.js#L595
    // ...so manually clear only the depth buffer.
    g3._renderer.GL.clear(g3._renderer.GL.DEPTH_BUFFER_BIT);
    g2.clear();

    // testPalette();
    
    drawParticles(g3);
    drawEmitters(g2);
    
    p5.image(g3, 0, 0);
    
    if (debug) p5.image(g2, 0, 0);
  }

  function renderLoading() {
    p5.background(180, 170, 160);
    g3.noStroke();
    g3.fill(0);
    g3.textSize(30);
    g3.textAlign(p5.CENTER, p5.CENTER);
    g3.text('Loading palettes...', BOUNDS.w / 2, BOUNDS.h / 2);
    p5.image(g3, 0, 0);
  }
};
