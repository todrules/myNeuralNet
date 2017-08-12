import { StaticConnection, StaticGating } from './config';
import { Neuron } from './neuron';
import { LayerConnectionRef, LayerInf } from './models';

export class Layer implements LayerInf {

  public neurons;
  public connectionTypes: LayerConnectionRef;

  constructor(size) {
    this.neurons = [];
    this.connectionTypes = {
      incomingConns: [],
      outgoingConns: [],
      selfConns: []
    };
    for (let i = 0; i < size; i++) {
      this.neurons.push(new Neuron());
    }
  }

  public forwardpropLayer(inputArray?: number[]) {
    let values = [];
    if(inputArray) {
      if (inputArray.length !== this.neurons.length) {
        console.error('Array with values should be same as the amount of neurons!');
        return;
      }
    }
    for (let i = 0; i < this.neurons.length; i++) {
      if (!inputArray) {
        values.push(this.neurons[i].forwardpropNeuron());
      } else {
        values.push(this.neurons[i].forwardpropNeuron(inputArray[i]));
      }
    }
    return values;
  }

  public backpropLayer(learningRate: number, momentum: number, targetValue?: number[]) {

    if(targetValue) {
      if (targetValue.length !== this.neurons.length) {
        console.error('Array with values should be same as the amount of neurons!');
        return;
      }
    }
    for (let i = this.neurons.length - 1; i >= 0; i--) {
      if (!targetValue) {
        this.neurons[i].backpropNeuron(learningRate, momentum);
      } else {
        this.neurons[i].backpropNeuron(learningRate, momentum, targetValue[i]);
      }
    }
  }

  public connectLayer(target, method?: StaticConnection, weight?: number) {
    let synapses = [];
    let synapse;
    if (target instanceof Layer) {
      if (!method) {
        if (this !== target) {
          method = StaticConnection.ALL_TO_ALL;
        } else {
          method = StaticConnection.ONE_TO_ONE;
        }
      }
      if (method === StaticConnection.ALL_TO_ALL || method === StaticConnection.ALL_TO_ELSE) {
        for (let i = 0; i < this.neurons.length; i++) {
          for (let j = 0; j < target.neurons.length; j++) {
            if (method === StaticConnection.ALL_TO_ELSE && this.neurons[i] === target.neurons[j]) {
              continue;
            }
            synapse = this.neurons[i].connectNeurons(target.neurons[j], weight);
            this.connectionTypes.outgoingConns.push(synapse[0]);
            target.connectionTypes.incomingConns.push(synapse[0]);
            synapses.push(synapse[0]);
          }
        }
      } else if (method === StaticConnection.ONE_TO_ONE) {
        if (this.neurons.length !== target.neurons.length) {
          throw new Error('From and To group must be the same size!');
        }

        for (let i = 0; i < this.neurons.length; i++) {
          synapse = this.neurons[i].connectNeurons(target.neurons[i], weight);
          this.connectionTypes.selfConns.push(synapse[0]);
          synapses.push(synapse[0]);
        }
      }
    } else if (target instanceof Neuron) {
      for (let i = 0; i < this.neurons.length; i++) {
        synapse = this.neurons[i].connectNeurons(target, weight);
        this.connectionTypes.outgoingConns.push(synapse[0]);
        synapses.push(synapse[0]);
      }
    }

    return synapses;
  }


  gate(connections, method) {
    if (typeof method === 'undefined') {
      console.error('Please specify Gating.INPUT, Gating.OUTPUT');
    }

    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    let origneurons = [];
    let targetneurons = [];

    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      if (!origneurons.includes(connection.origNeuron)) {
        origneurons.push(connection.origNeuron);
      }
      if (!targetneurons.includes(connection.targetNeuron)) {
        targetneurons.push(connection.targetNeuron);
      }
    }

    switch (method) {
      case StaticGating.INPUT:
        for (let i = 0; i < targetneurons.length; i++) {
          let neuron = targetneurons[i];
          let gated = this.neurons[i % this.neurons.length];

          for (let j = 0; j < neuron.connectionTypes.incomingConns.length; j++) {
            let conn = neuron.connectionTypes.incomingConns[j];
            if (connections.includes(conn)) {
              gated.gate(conn);
            }
          }
        }
        break;
      case StaticGating.OUTPUT:
        for (let i = 0; i < origneurons.length; i++) {
          let neuron = origneurons[i];
          let gated = this.neurons[i % this.neurons.length];

          for (let j = 0; j < neuron.connectionTypes.outgoingConns.length; j++) {
            let conn = neuron.connectionTypes.outgoingConns[j];
            if (connections.includes(conn)) {
              gated.gate(conn);
            }
          }
        }
        break;
      case StaticGating.SELF:
        for (let i = 0; i < origneurons.length; i++) {
          let neuron = origneurons[i];
          let gated = this.neurons[i % this.neurons.length];

          if (connections.includes(neuron.connectionTypes.selfConn)) {
            gated.gate(neuron.connectionTypes.selfConn);
          }
        }
    }
  }


  set(values) {
    for (let i = 0; i < this.neurons.length; i++) {
      if (typeof values.bias !== 'undefined') {
        this.neurons[i].bias = values.bias;
      }

      this.neurons[i].squash = values.squash || this.neurons[i].squash;
      this.neurons[i].neuronType = values.neuronType || this.neurons[i].neuronType;
    }
  }


  clear() {
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].clear();
    }
  }
}
