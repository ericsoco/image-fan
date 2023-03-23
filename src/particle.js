const PARTICLE_LIFESPAN = {min: 50, max: 80};
const PARTICLE_SPEED = {min: 1, max: 3};
const PARTICLE_WIDTH = {min: 4, max: 6};
const PARTICLE_HEIGHT = {min: 6, max: 16};

let p5 = null;
let particles = [];

class Particle {
  static particleCount = 0;

  lifespan;
  loc;
  spd;
  size;
  id;

  constructor({loc, rot, longevity, palette}) {
    this.lifespan = p5.random(PARTICLE_LIFESPAN.min, PARTICLE_LIFESPAN.max) * longevity;
    this.loc = loc.copy();
    this.spd = p5.createVector(0, p5.random(PARTICLE_SPEED.min, PARTICLE_SPEED.max))
      .rotate(rot);
    this.size = {
      w: p5.random(PARTICLE_WIDTH.min, PARTICLE_WIDTH.max),
      h: p5.random(PARTICLE_HEIGHT.min, PARTICLE_HEIGHT.max)
    };
    this.id = Particle.particleCount++;

    this.palette = createPalette(this.loc, palette, this.lifespan);
  }

  update() {
    this.loc.add(this.spd);
    this.lifespan--;
  }

  draw(g) {
    //
    // TODO NEXT: make fans of images similar to
    // https://www.thisiscolossal.com/2023/03/lyndi-sales-paper-sculptures/
    // by stepping through a palette of images like
    // https://www.northlandscapes.com/portfolio/iceland-basalt
    // create palette by taking 1px wide slice thru image and
    // step through each pixel color from top to bottom
    // could use algo as video mirror as well,
    // by isolating palette of each person and drawing fans of color
    // wherever they stand, with closeness to camera 
    // determining length of fan rays
    //


    const color = this.palette[Math.floor(this.lifespan)] || this.palette[0];

    g.push();
    g.translate(this.loc.x, this.loc.y);
    // point in direction of travel
    g.rotateZ(this.spd.heading());
    
    g.rectMode(p5.RADIUS);
    g.fill(color);
    g.noStroke();
    
    g.rect(0, 0, this.size.w, this.size.h);
      
    g.pop();
  }
}

/**
 * Init before creating instances
 */
export function initFactory(_p5, bounds) {
  p5 = _p5;
}

/**
 * Spawn particle at location
 */
export function spawnParticle(params) {
  particles.push(new Particle(params));
}

/**
 * Update all particles
 */
export function updateParticles() {
  for (let i=particles.length-1; i>=0; i--) {
    const p = particles[i];
    p.update();

    // remove old particles
    if (p.lifespan <= 0) particles.splice(i, 1);
  };
}

export function drawParticles(g) {
  particles.forEach(p => p.draw(g));
}

/**
 * Map a palette object to a list of colors to be used
 * over the lifespan of the particle.
 */
function createPalette(loc, palette, lifespan) {
  // pull colors from a single column of pixels at the mouse X location
  // (scaled to the width of the palette source image).
  // the entire column is always used, so only particles with the
  // maximum lifespan will use the entire column of pixel colors.

  //
  // TODO: the longevity scalar makes everything more complicated...
  // do we want to map to a maximum length of PARTICLE_LIFESPAN.max * max longevity?
  // do we want to make every strip use the entire palette?
  // do we want to stop the palette somewhere else?
  // need to experiment; passed lifespan in here for this.
  //

  //
  // also TODO: the palette isn't filling up correctly,
  // there are a bunch of undefined entries.
  // seems my math is off...
  //

  //
  // and finally also TODO: want to smooth out color curve so the changes
  // from step to step are not as abrupt.
  // essentially want to lerp from step to step.
  //
  const maxLifespan = Math.floor(lifespan);
  const particlePalette = [];
  for (let v=maxLifespan-1; v>=0; v--) {
    const paletteY = Math.floor(v * palette.height / maxLifespan);
    particlePalette.push(palette.getColorAtMouse(loc.x, paletteY))
  }
  return particlePalette;
}
