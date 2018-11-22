// NeuralNetwork visualizer

const LEVELS = 3;

class nnv {
  constructor(brain){
    this.inputSize = brain.input_nodes;
    this.hiddenSize = brain.hidden_nodes;
    this.outputSize = brain.output_nodes;
    this.IH_weights = brain.weights_ih.data
    this.HO_weights = brain.weights_ho.data
    this.hidden_Bias = brain.bias_h.data
    this.output_Bias = brain.bias_o.data
    this.hidden_values = brain.HiddenValues.data
    this.output_values = brain.OuputValues.data
    this.input_values = brain.InputValues;
    this.NodeSizeBias = 24;
    this.SizeMax = 50;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.x = 0;
    this.y = 0;
    this.xSize = 0;
    this.ySize = 0;
    this.YIntervalI = 0;
    this.YIntervalH = 0;
    this.YIntervalO = 0;
    this.XInterval = 0;
    this.YOffset = 0;
    this.XOffset = 0;
  }

  setValues(x, y, xSize, ySize, XOffset, YOffset){
    this.x = x;
    this.y = y;
    this.xSize = xSize;
    this.ySize = ySize;
    this.XOffset = XOffset;
    this.YOffset = YOffset;
    this.XInterval = this.CalcuateXInterval(this.xSize, LEVELS);
    this.YIntervalI = this.CalcuateYInterval(this.ySize, this.inputSize);
    this.YIntervalH = this.CalcuateYInterval(this.ySize, this.hiddenSize);
    this.YIntervalO = this.CalcuateYInterval(this.ySize, this.outputSize);
  }

  draw(){
    if(this.input_values){
      noStroke();
      fill(200);
      rectMode(CENTER);
      rect(this.x,this.y,this.xSize,this.ySize);
      this.drawNodes();
      this.drawLinks();
    }
    fill(100,255,100,100)
    ellipse(this.birdx,this.birdy, 32,32)
  }

  drawNodes(){
    let size = this.NodeSizeBias;
    for(let i = 0; i < this.inputSize; i++){
      this.color = this.getColor(this.input_values[i],false);
      fill(this.color);
      let xValue = this.x - this.xSize/2 + 0 * this.XInterval + this.XInterval/2 + this.XOffset;
      let yValue = this.YOffset + i * this.YIntervalI + this.YIntervalI/2;
      ellipse(xValue, yValue, size, size);
    }
    for(let i = 0; i < this.hiddenSize; i++){
      this.color = this.getColor(this.hidden_values[i],false);
      fill(this.color);
      size = this.getSize(this.hidden_Bias[i][0]);
      let xValue = this.x - this.xSize/2 + 1 * this.XInterval + this.XInterval/2 + this.XOffset;
      let yValue = this.YOffset + i * this.YIntervalH + this.YIntervalH/2;
      ellipse(xValue, yValue, size, size);
    }
    for(let i = 0; i < this.outputSize; i++){
      this.color = this.getColor(this.output_values[i],true);
      fill(this.color);
      size = this.getSize(this.output_Bias[i][0]);
      let xValue = this.x - this.xSize/2 + 2 * this.XInterval + this.XInterval/2 + this.XOffset;
      let yValue = this.YOffset + i * this.YIntervalO + this.YIntervalO/2;
      ellipse(xValue, yValue, size, size);
    }
  }

  drawLinks(){
    for(let i = 0; i < this.hiddenSize; i++){
      for(let j = 0; j < this.inputSize; j++){
        let x = this.input_values[i];
        let weight = this.IH_weights[i][j];
        let pSum = x * weight;
        if(abs(pSum) >= 1/this.inputSize){
          this.drawConnection(i,j,1,2,this.IH_weights);
        }
      }
    }

    for(let i = 0; i < this.outputSize; i++){
      for(let j = 0; j < this.hiddenSize; j++){
        let x = this.hidden_values[i];
        let weight = this.HO_weights[i][j];
        let pSum = x * weight;
        if(abs(pSum) >= 1/(this.hiddenSize+1)){
          this.drawConnection(i,j,2,3,this.HO_weights);
        }
      }
    }
  }

  drawConnection(i,j,layerX,layerY,weights){
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    if(layerX == 1){
      x1 = this.x - this.xSize/2 + 0 * this.XInterval + this.XInterval/2 + this.XOffset;
      y1 = this.YOffset + j * this.YIntervalI + this.YIntervalI/2;
    }
    if(layerX == 2){
      x1 = this.x - this.xSize/2 + 1 * this.XInterval + this.XInterval/2 + this.XOffset;
      y1 = this.YOffset + j * this.YIntervalH + this.YIntervalH/2;
    }
    if(layerX == 3){
      x1 = this.x - this.xSize/2 + 2 * this.XInterval + this.XInterval/2 + this.XOffset;
      y1 = this.YOffset + j * this.YIntervalO + this.YIntervalO/2;
    }
    if(layerY == 1){
      x2 = this.x - this.xSize/2 + 0 * this.XInterval + this.XInterval/2 + this.XOffset;
      y2 = this.YOffset + i * this.YIntervalI + this.YIntervalI/2;
    }
    if(layerY == 2){
      x2 = this.x - this.xSize/2 + 1 * this.XInterval + this.XInterval/2 + this.XOffset;
      y2 = this.YOffset + i * this.YIntervalH + this.YIntervalH/2;
    }
    if(layerY == 3){
      x2 = this.x - this.xSize/2 + 2 * this.XInterval + this.XInterval/2 + this.XOffset;
      y2 = this.YOffset + i * this.YIntervalO + this.YIntervalO/2;
    }

    stroke(0);
    strokeWeight(abs(weights[i][j]) * 2);
    line(x1,y1,x2,y2);
  }

  getColor(val, output){
    let r = 0;
    let g = 0;
    let b = 0;
    if(output){
      let max = this.getHighestOutput();
      if(val == max){
        r = 0;
        g = 255;
        b = 0;
      } else {
        r = 255;
        g = 0;
        b = 0;
      }
    } else {
      if(val <= .5){
        r = 255;
        g = val * 2 * 255;
        b = 0;
      } else {
        r = (val - .5) * 2 * 255;
        g = 255;
        b = 0;
      }
    }
    let color = [3]
    color[0] = r;
    color[1] = g;
    color[2] = b;
    return color;
  }

  CalcuateYInterval(Height, Size){
    let UsableSpace = Height - 2 * this.YOffset;
    let Interval = UsableSpace / Size;
    return floor(Interval);
  }

  CalcuateXInterval(Width, Size){
    let UsableSpace = Width - 2 * this.XOffset;
    let Interval = UsableSpace / Size;
    return floor(Interval);
  }

  getSize(value){
    value = value * this.SizeMax;
    if(value <= 10) value = this.NodeSizeBias;
    return value;
  }

  getHighestOutput(){
    let max = 0;
    for(let j = 0; j < this.outputSize; j++){
      if(this.output_values[j] >= this.output_values[max]) max = j;
    }
    return this.output_values[max];
  }
}
