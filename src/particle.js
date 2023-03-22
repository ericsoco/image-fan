const PARTICLE_LIFESPAN = {min: 50, max: 80};
const PARTICLE_SPEED = {min: 1, max: 3};
const PARTICLE_WIDTH = {min: 4, max: 6};
const PARTICLE_HEIGHT = {min: 6, max: 16};

let p5 = null;
let particles = [];

class Particle {
  static particleCount = 0;

  age;
  loc;
  spd;
  size;
  id;

  constructor(loc, rot) {
    this.age = p5.random(PARTICLE_LIFESPAN.min, PARTICLE_LIFESPAN.max)
    this.loc = loc.copy();
    this.spd = p5.createVector(0, p5.random(PARTICLE_SPEED.min, PARTICLE_SPEED.max))
      .rotate(rot);
    this.size = {
      w: p5.random(PARTICLE_WIDTH.min, PARTICLE_WIDTH.max),
      h: p5.random(PARTICLE_HEIGHT.min, PARTICLE_HEIGHT.max)
    };
    this.id = Particle.particleCount++;
  }

  update() {
    this.loc.add(this.spd);
    this.age++;
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




    g.push();
    g.translate(this.loc.x, this.loc.y);
    // point in direction of travel
    g.rotateZ(this.spd.heading());
    
    g.rectMode(p5.RADIUS);
    g.fill(70);
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
export function spawnParticle(loc, rot) {
  particles.push(new Particle(loc, rot));
}

/**
 * Update all particles
 */
export function updateParticles() {
  for (let i=particles.length-1; i>=0; i--) {
    const p = particles[i];
    p.update();

    // remove old particles
    if (p.age <= 0) particles.splice(i, 1);
  };
}

export function drawParticles(g) {
  particles.forEach(p => p.draw(g));
}
