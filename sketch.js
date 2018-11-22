
const TOTAL = 500;
let birds = [];
let pipes = [];
let savedBirds = [];
let counter = 0;
let slider;
let ExampleBird;
let Height = 480;
let Width = 1280;
let gen = 0;
let NNV;
let hs = 0;

function PickNewExample(j){
    let temp = floor(random(0,j));
    if(temp < 0) {
      temp = 0;
    }
    ExampleBird = birds[temp];
}

function setup() {
  createCanvas(Width, Height);
  slider = createSlider(1, 100, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
    birds[i].gen = gen;
    birds[i].index = i;
  }
  console.log('Generation: ' + gen);
  PickNewExample(TOTAL);
}

function draw() {

  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if(birds[j].y >= Height || birds[j].y <= 0){
          savedBirds.push(birds.splice(j, 1)[0]);
            if(j >= 0){
              PickNewExample(j-1);
            }
        } else if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
            if(j >= 0){
              PickNewExample(j-1);
          }
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0;
      nextGeneration();
      pipes = [];
    }
  }

  background(0);
  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }
  NNV = new nnv(ExampleBird.brain);
  NNV.birdx = ExampleBird.x;
  NNV.birdy = ExampleBird.y;

  NNV.setValues(960,240,642,482,30,30);
  NNV.draw();
  fill(255)
  if(birds[0].score > hs){
    hs = birds[0].score;
  }
  text("Current Score: " + birds[0].score, 650,475)
  text("High Score: " + hs, 650,25)
  text("Generation: " + gen, width - 150,25)
}
