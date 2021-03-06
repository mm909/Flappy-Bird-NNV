// Neuro-Evolution Flappy Bird

class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.7;
    this.lift = -12;
    this.velocity = 0;
    this.storeInputs;
    this.gen;
    this.index;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 4, 2);
    }
  }

  show() {
    stroke(255);
    strokeWeight(1)
      fill(255, 100);
    ellipse(this.x, this.y, 32, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  mutate() {
    this.brain.mutate(0.85);
  }

  think(pipes) {

    // Find the closest pipe
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }


    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = this.velocity / 40;
    inputs[2] = closest.x / width;
    inputs[3] = closest.bottom / height;
    inputs[4] = closest.top / height;
    this.storeInputs = inputs;
    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }

  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    //this.velocity *= 0.9;
    this.y += this.velocity;

  }

}
