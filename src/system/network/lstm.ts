import { EventEmitter, Injectable, Output } from '@angular/core';
import { Layer } from './layer';
import { ConnectionInf, LearningRateFunc, MemOptions, TrainingInf, TrainingOptions } from './models';
import { StaticConnection, StaticGating } from './config';
import { Neuron } from './neuron';
import { Cost } from './actions/cost';
import { Rate } from './actions/rate';
import * as seedrandom from 'seedrandom';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LSTM {

  @Output() onIteration = new EventEmitter<any>();

  public inputsize: number;
  public outputsize: number;
  public neurons = [];
  public connections: ConnectionInf[] = [];
  public gates = [];
  public selfconns = [];
  public dropout = 0;
  public score;
  public numMemBlocks: number;
  public memBlockSize: number;
  public origInput = 0;
  public origOutput = 0;
  public loss;
  public iteration;
  public lr;
  public stats: Subject<any> = new Subject<any>();
  public stat$: Observable<any>;

  constructor (inputSize: number, outputSize: number, numMemoryBlocks: number, memBlockSize: number) {
    this.origInput = inputSize;
    this.origOutput = outputSize;
    this.inputsize = inputSize;
    this.outputsize = outputSize;
    this.numMemBlocks = numMemoryBlocks;
    this.memBlockSize = memBlockSize;
    this.lr = [];
    this.loss = [];
    this.stat$ = this.stats.asObservable();
    return this.init(inputSize, outputSize, numMemoryBlocks, memBlockSize);
  }

  init (inputSize: number, outputSize: number, numMemoryBlocks: number, memBlockSize: number) {
    const inputLayer = new Layer(inputSize);
    inputLayer.set({
      neuronType: 'inputNeuron'
    });
    const outputLayer = new Layer(outputSize);
    outputLayer.set({
      neuronType: 'outputNeuron'
    });

    const options: MemOptions = {};
    options.memoryToMemory = true;
    options.outputToMemory = true;
    options.outputToGates = true;
    options.inputToOutput = true;
    options.inputToDeep = true;
    const groups = [];
    groups.push(inputLayer);

    let previous = inputLayer;
    for (let i = 0; i < numMemoryBlocks; i++) {
      const inputGate = new Layer(memBlockSize);
      const forgetGate = new Layer(memBlockSize);
      const memoryCell = new Layer(memBlockSize);
      const outputGate = new Layer(memBlockSize);
      const outputBlock = i === numMemoryBlocks - 1 ? outputLayer : new Layer(memBlockSize);
      inputGate.set({
        bias: 1
      });
      forgetGate.set({
        bias: 1
      });
      outputGate.set({
        bias: 1
      });

      const inputMemory = previous.connectLayer(memoryCell, StaticConnection.ALL_TO_ALL);
      previous.connectLayer(inputGate, StaticConnection.ALL_TO_ALL);
      previous.connectLayer(outputGate, StaticConnection.ALL_TO_ALL);
      previous.connectLayer(forgetGate, StaticConnection.ALL_TO_ALL);

      memoryCell.connectLayer(inputGate, StaticConnection.ALL_TO_ALL);
      memoryCell.connectLayer(forgetGate, StaticConnection.ALL_TO_ALL);
      memoryCell.connectLayer(outputGate, StaticConnection.ALL_TO_ALL);
      const forgetMemory = memoryCell.connectLayer(memoryCell, StaticConnection.ONE_TO_ONE);
      const outputMemory = memoryCell.connectLayer(outputBlock, StaticConnection.ALL_TO_ALL);

      inputGate.gate(inputMemory, StaticGating.INPUT);
      forgetGate.gate(forgetMemory, StaticGating.SELF);
      outputGate.gate(outputMemory, StaticGating.OUTPUT);

      if (options.inputToDeep && i > 0) {
        inputGate.gate(inputLayer.connectLayer(memoryCell, StaticConnection.ALL_TO_ALL), StaticGating.INPUT);
      }
      if (options.memoryToMemory) {
        inputGate.gate(memoryCell.connectLayer(memoryCell, StaticConnection.ALL_TO_ELSE), StaticGating.INPUT);
      }

      if (options.outputToMemory) {
        inputGate.gate(outputLayer.connectLayer(memoryCell, StaticConnection.ALL_TO_ALL), StaticGating.INPUT);
      }

      if (options.outputToGates) {
        outputLayer.connectLayer(inputGate, StaticConnection.ALL_TO_ALL);
        outputLayer.connectLayer(forgetGate, StaticConnection.ALL_TO_ALL);
        outputLayer.connectLayer(outputGate, StaticConnection.ALL_TO_ALL);
      }
      groups.push(inputGate);
      groups.push(forgetGate);
      groups.push(memoryCell);
      groups.push(outputGate);
      if (i !== numMemoryBlocks - 1) {
        groups.push(outputBlock);
      }
      previous = outputBlock;
    }
    if (options.inputToOutput) {
      inputLayer.connectLayer(outputLayer, StaticConnection.ALL_TO_ALL);
    }

    groups.push(outputLayer);
    return this.create(groups);
  }

  public create (list) {
    let neurons = [];
    let numOutputNeurons = 0;
    let numInputNeurons = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i] instanceof Layer) {
        for (let j = 0; j < list[i].neurons.length; j++) {
          neurons.push(list[i].neurons[j]);
        }
      } else if (list[i] instanceof Neuron) {
        neurons.push(list[i]);
      }
    }
    const inputNeurons = [];
    const outputNeurons = [];
    for (let i = neurons.length - 1; i >= 0; i--) {
      if (neurons[i].neuronType === 'outputNeuron' || neurons[i].connectionTypes.outgoingConns.length + neurons[i].connectionTypes.gatedConns.length === 0) {
        neurons[i].neuronType = 'outputNeuron';
        numOutputNeurons++;
        outputNeurons.push(neurons[i]);
        neurons.splice(i, 1);
      } else if (neurons[i].neuronType === 'inputNeuron' || !neurons[i].connectionTypes.incomingConns.length) {
        neurons[i].neuronType = 'inputNeuron';
        numInputNeurons++;
        inputNeurons.push(neurons[i]);
        neurons.splice(i, 1);
      }
    }
    neurons = inputNeurons.concat(neurons).concat(outputNeurons);
    if (numOutputNeurons === 0 || numInputNeurons === 0) {
      console.error('Given neurons have no clear input/output node!');
      return;
    }
    for (let i = 0; i < neurons.length; i++) {
      for (let j = 0; j < neurons[i].connectionTypes.outgoingConns.length; j++) {
        this.connections.push(neurons[i].connectionTypes.outgoingConns[j]);
      }
      for (let j = 0; j < neurons[i].connectionTypes.gatedConns.length; j++) {
        this.gates.push(neurons[i].connectionTypes.gatedConns[j]);
      }
      if (neurons[i].connectionTypes.selfConn.weight !== 0) {
        this.selfconns.push(neurons[i].connectionTypes.selfConn);
      }
    }
    this.neurons = neurons;
    return this;

  }

  train (trainingInput: TrainingInf[], trainingOpts?: TrainingOptions) {

    if (+trainingInput[0].inputValues.length !== +this.origInput || +trainingInput[0].targetValues.length !== +this.origOutput) {
      console.warn('Dataset input/output size should be same as network input/output size!');
    }

    this.loss = [];
    this.lr = [];
    const options = trainingOpts || {};
    const targetLoss: number = trainingOpts.targetLoss || 0.05;
    const cost = trainingOpts.cost || Cost.MSE;
    const baseLearningRate: number = trainingOpts.learningRate || 0.3;
    const iterations: number = trainingOpts.iterations || 100;
    const dropout: number = trainingOpts.dropout || 0;
    const momentum: number = trainingOpts.momentum || 0;
    const ratePolicy: LearningRateFunc = trainingOpts.ratePolicy || Rate.INV;
    const gamma: number = trainingOpts.gamma || 0.001;
    const power: number = trainingOpts.power || 2;
    const start = Date.now();

    this.dropout = dropout;
    // console.log(baseRate);
    let currentLR = baseLearningRate;
    let iteration = 0;
    let loss = 1;

    while (loss > targetLoss && (iterations === 0 || iteration < iterations)) {
      iteration++;
      currentLR = ratePolicy(+baseLearningRate, +iteration, +gamma, +power);
      loss = this._trainSet(trainingInput, +currentLR, +momentum, cost);
      this.loss.push({ name: iteration, value: loss });
      this.lr.push({ name: iteration, value: currentLR });

      this.stats.next({
        loss: this.loss,
        lr: this.lr
      });
      if (iteration % 100 === 0) {
        console.log(this.stats);
      }
    }
    console.log('done');
    // Creates an object of the results
    console.log({
      loss: loss,
      iterations: iteration,
      time: Date.now() - start
    });
    return {
      loss: loss,
      iterations: iteration,
      time: Date.now() - start
    };

  }

  _trainSet (trainingInput: TrainingInf[], currentLR: number, momentum: number, costFunction) {
    let lossSum = 0;
    for (let i = 0; i < trainingInput.length; i++) {
      const inputValues = trainingInput[i].inputValues;
      const targetValues = trainingInput[i].targetValues;
      const doUpdate = (i + 1) === trainingInput.length;
      const outputValues = this.activate(inputValues, true);
      this.propagate(currentLR, momentum, doUpdate, targetValues);

      lossSum += costFunction(targetValues, outputValues);
    }
    return lossSum / trainingInput.length;
  }

  public test (trainingInput: TrainingInf[], cost) {
    if (this.dropout) {
      for (let i = 0; i < this.neurons.length; i++) {
        if (this.neurons[i].neuronType === 'hiddenNeuron' || this.neurons[i].neuronType === 'constantNeuron') {
          this.neurons[i].mask = 1 - this.dropout;
        }
      }
    }
    cost = cost || Cost.MSE;
    let loss = 0;
    const start = Date.now();

    for (let i = 0; i < trainingInput.length; i++) {
      const inputValues = trainingInput[i].inputValues;
      const targetValues = trainingInput[i].targetValues;
      const outputValues = this.activate(inputValues);
      loss += cost(targetValues, outputValues);
      console.log('inputValues: ');
      console.log(inputValues);
      console.log('outputValues: ');
      console.log(outputValues);
      console.log('targetValues: ');
      console.log(targetValues);
    }
    loss /= trainingInput.length;
    return {
      loss: loss,
      time: Date.now() - start
    };
  }

  public clear () {
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].clear();
    }
  }

  public activate (inputValues, training?) {
    const outputValues = [];

    for (let i = 0; i < this.neurons.length; i++) {
      if (this.neurons[i].neuronType === 'inputNeuron') {
        this.neurons[i].forwardpropNeuron(inputValues[i]);
      } else if (this.neurons[i].neuronType === 'outputNeuron') {
        outputValues.push(this.neurons[i].forwardpropNeuron());
      } else {
        const rand = seedrandom.alea(Math.random());
        if (training) {
          this.neurons[i].mask = 1;
        }
         this.neurons[i].forwardpropNeuron();
      }
    }
     return outputValues;
  }

  propagate (learningRate: number, momentum: number, doUpdate: boolean, targetValues) {
    if (typeof targetValues !== 'undefined' && +targetValues.length !== +this.outputsize) {
      console.error('Output target length should match network output length');
      return;
    }

    let targetIndex = targetValues.length;

    for (let i = this.neurons.length - 1; i >= this.neurons.length - this.outputsize; i--) {
      this.neurons[i].backpropNeuron(learningRate, momentum, doUpdate, targetValues[--targetIndex]);
    }
    for (let i = this.neurons.length - this.outputsize - 1; i >= this.inputsize; i--) {
      this.neurons[i].backpropNeuron(learningRate, momentum, doUpdate);
    }
  }

}
