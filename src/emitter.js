let p5 = null;

let emitters = [];

class Emitter {
  loc;
  palette;
  rot;
  rotSpd;
  count;
  next;
  longevity;

  /**
   * @param {p5.Vector} loc - Particle location
   * @param {Palette} palette - Palette object used to define colors in mark train
   */
  constructor(loc, palette) {
    this.loc = loc;
    this.palette = palette;
    this.rot = 2 * Math.PI * Math.random();
    this.rotSpd = 0.05;
    this.count = 0;
    this.next = getSpawnTime();

    // TODO: vary this per particle, based on distance to nearest emitter
    // instead of per emitter
    this.longevity = 3 + 1.5 * Math.random();
    // this.longevity = 1;
  }

  update(spawnParticle) {
    if (this.count++ > this.next) {
      this.count = 0;
      this.next = getSpawnTime();
      this.rot += this.rotSpd;
      return spawnParticle({
        loc: this.loc,
        rot: this.rot,
        longevity: this.longevity,
        palette: this.palette
     });
    }
  }

  draw(g) {
    g.rectMode(p5.RADIUS);
    g.stroke(20, 200, 50);
    g.noFill();
    g.translate(this.loc.x, this.loc.y);
    g.rotateZ(this.rot);
    g.rect(0, 0, 50, 20);
  }
}

/**
 * Init before creating instances
 */
export function initFactory(_p5) {
  p5 = _p5;
}


/**
 * Create emitter
 */
export function spawnEmitter(loc, palette) {
  emitters.push(new Emitter(loc, palette));
}

/**
 * Update all existing emitters and
 * create new emitters if queued
 */
export function updateEmitters(spawnParticle) {
  for (let i=emitters.length-1; i>=0; i--) {
    const e = emitters[i];
    e.update(spawnParticle);
  };
}

export function drawEmitters(g) {
  emitters.forEach(e => e.draw(g));
}

export const SPAWN_DELAY = {min: 4, max: 8};
export function getSpawnTime() {
  return Math.round(p5.random(SPAWN_DELAY.min, SPAWN_DELAY.max));
}
