import * as mathjs from 'mathjs';
import * as numjs from 'numjs';

export class NeuralNet {

  public values;
  public inputshape;
  public outputsize;
  public sum;
  public inputWeights;
  public outputWeights;
  public paramWeights;
  public inputDeriv;
  public outputDeriv;
  public paramDeriv;
  public probability;
  public storage;
  public activate;
  public leaky;
  public activationType;
  public hiddensize;
  
  public inputlayer;
  public outputlayer;
  public hiddenlayers = [];
  public sizeaug = 1;
  constructor(public inputShape: number[], public outputSize: number, public hiddenSize: number, public actType: string) {
  
    this.inputshape = inputShape;
    this.outputsize = outputSize;
    this.hiddensize = hiddenSize;
    
    this.inputlayer = numjs.random([this.inputshape[0], this.inputshape[1]]);
    this.outputlayer = numjs.ones([1, this.outputsize]);
    
    for(let i = 0; i < this.hiddensize; i++) {
      
      let size1 = Math.floor(this.inputshape[0] / this.sizeaug);
      let size2 = Math.floor(this.inputshape[1] / this.sizeaug);
      let layer = numjs.random([size1, size2]);
      this.sizeaug *= 2;
      this.hiddenlayers.push(layer);
    }
    
    this.storage = {
      activations: null
    };
    
    this.activationType = actType;
  }
  
  public forwardprop (inputValues, prob?: number, aLeaky?: number) {
    this.leaky = aLeaky || 0;
    this.probability = prob;
    
    this.sum = 0;
    this.inputWeights = inputValues.input.weights;
    this.outputWeights = inputValues.output.weights;
    this.paramWeights = inputValues.params.weights;
    this.activate = inputValues.activations;
    switch (this.activationType) {
      case 'fullyConnected':
        this.fullConn.forward();
        break;
      case 'sigmoid':
        this.sigmoid.forward();
        break;
      case 'dropout':
        this.dropout.forward();
        break;
      case 'tanh':
        this.tanh.forward();
        break;
      case 'relu':
        this.relu.forward();
        break;
      case 'softmax':
        this.softmax.forward();
        break;
      default:
        break;
    }
    
    
  }
  
  public backprop (inputValues, prob?: number, aLeaky?: number) {
    this.leaky = aLeaky || 0;
    this.probability = prob;
    
    this.sum = 0;
    this.inputWeights = inputValues.input.weights;
    this.outputWeights = inputValues.output.weights;
    this.paramWeights = inputValues.params.weights;
    this.activate = inputValues.activations;
    this.inputDeriv = inputValues.input.derivWeights;
    this.outputDeriv = inputValues.output.derivWeights;
    this.paramDeriv = inputValues.params.derivWeights;
  
    switch (this.activationType) {
      case 'fullyConnected':
        this.fullConn.backward();
        break;
      case 'sigmoid':
        this.sigmoid.backward();
        break;
      case 'dropout':
        this.dropout.backward();
        break;
      case 'tanh':
        this.tanh.backward();
        break;
      case 'relu':
        this.relu.backward();
        break;
      case 'softmax':
        this.softmax.backward();
        break;
      default:
        break;
    }
    
  }
  
  private fullConn = {
    forward: () => {
      for (let i = 0; i < this.outputsize; i++) {
        this.sum = 0;
        for (let j = 0; j < this.inputshape; j++) {
          this.sum += this.inputWeights[j] * this.paramWeights[(i * this.inputshape) + j];
      
        }
        this.outputWeights[i] = this.sum + this.paramWeights[(this.inputshape * this.outputsize) + i];
      }
    },
    backward: () => {
      for (let i = 0; i < this.outputsize; i++) {
        this.sum = 0;
        for (let j = 0; j < this.inputshape; j++) {
          this.sum += this.paramWeights[(j * this.outputsize) + i];
          this.paramDeriv[(j * this.outputsize) + i] = this.inputWeights[i] * this.outputDeriv[j];
      
        }
        this.inputDeriv[i] = this.sum;
      }
  
      for (let i = 0; i < this.outputsize.length; i++) {
        this.paramDeriv[(this.inputshape * this.outputsize) + i] = this.outputDeriv[i];
    
      }
    }
    
  }
  
  private dropout = {
      forward: () => {
        for (let i = 0; i < this.inputshape; i++) {
          if (Math.random() < this.probability) {
            this.outputWeights[i] = 0;
            this.activate[i] = 0;
          } else {
            this.outputWeights[i] = this.inputWeights[i] / (1 - this.probability);
            this.activate[i] = 1;
          }
        }
      },
      backward: () => {
        for (let i = 0; i < this.outputsize; i++) {
          this.inputDeriv[i] = this.activate[i] * this.outputDeriv[i] / (1 - this.probability);
        }
      }
  }
  
  private sigmoid = {
    forward: () => {
      for (let i = 0; i < this.inputshape; i++) {
        this.outputWeights[i] = 1 / (1 + Math.exp(-this.inputWeights[i]));
      }
    },
    backward: () => {
      for (let i = 0; i < this.inputshape; i++) {
        this.inputDeriv[i] = this.outputWeights[i] * (1 - this.outputWeights[i] * this.outputDeriv[i]);
      }
    }
  }
  
  private tanh = {
    forward: () => {
      let y = 0;
  
      for (let i = 0; i < this.inputshape; i++) {
        y = Math.exp(2 * this.inputWeights[i]);
        this.outputWeights[i] = (y - 1) / (y + 1);
      }
    },
    backward: () => {
      for (let i = 0; i < this.inputshape; i++) {
    
        this.inputDeriv[i] = (1 - this.outputWeights[i] * this.outputWeights[i]) * this.outputDeriv[i];
      }
    }
  }
  
  private relu = {
    forward: () => {
  
      for (let i = 0; i < this.inputshape; i++) {
        this.outputWeights[i] = (this.inputWeights[i] > 0 ? this.inputWeights[i] : this.leaky * this.inputWeights[i]);
      }
    },
    backward: () => {
      for (let i = 0; i < this.inputshape; i++) {
        this.inputDeriv[i] = (this.inputWeights[i] > 0 ? 1 : this.leaky) * this.outputDeriv[i];
      }
    }
  }
  
  private softmax = {
    forward: () => {
      let inputMax = -Infinity;
  
      for (let i = 0; i < this.inputshape; i++) {
        if (this.inputWeights[i] > inputMax) {
          inputMax = this.inputWeights[i];
        }
      }
  
      let expsum = 0;
      for (let i = 0; i < this.inputshape; i++) {
        expsum += this.outputWeights[i] = Math.exp(this.inputWeights[i] - inputMax);
    
      }
      for (let i = 0; i < this.inputshape; i++) {
        this.outputWeights[i] /= expsum;
    
      }
    },
    backward: () => {
      for (let i = 0; i < this.inputshape; i++) {
        let sum = this.outputWeights[i] * (1 - this.outputWeights[i]) * this.outputDeriv[i];
    
        for (let j = 0; j < this.inputshape; j++) {
          if (i !== j) {
            sum -= this.outputWeights[j] * this.outputWeights[i] * this.outputDeriv[j];
          }
      
        }
        this.inputDeriv[i] = sum;
      }
    }
  }
  
}

