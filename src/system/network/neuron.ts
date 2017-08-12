import { Connection } from './connection';
import { Activation } from './actions/activation';
import { Mutation } from './actions/mutation';
import { ConnectionRef, NeuronInf } from './models';

export class Neuron implements NeuronInf {

  public bias: number;
  public squash;
  public neuronType: string;
  public activation = 0;
  public state: number;
  public prevState = 0;
  public mask = 1;
  public previousDeltaBias = 0;
  public totalDeltaBias = 0;
  public connectionTypes: ConnectionRef;
  public derivative;
  public loss = {
    responsibility: 0,
    projected: 0,
    gated: 0
  };

  constructor(neurontype?: string) {

    this.bias = (neurontype === 'inputNeuron') ? 0 : (Math.random() * 0.2) - 0.1;
    this.squash = Activation.LOGISTIC;
    this.neuronType = neurontype || 'hiddenNeuron';
    this.state = (Math.random() * 2) -1;
    this.connectionTypes = {
      incomingConns: [],
      outgoingConns: [],
      gatedConns: [],
      selfConn: new Connection(this, this, 0)
    };
  }

  public forwardpropNeuron(inputValue?: any) {
    // Check if an input is given
    if (typeof inputValue === 'number') {
      this.activation = inputValue;
      return this.activation;
    }

    this.prevState = this.state;

    this.state = (+this.connectionTypes.selfConn.gain * +this.connectionTypes.selfConn.weight * +this.state) + +this.bias;

    for (let i = 0; i < this.connectionTypes.incomingConns.length; i++) {
      let incomingSynapse = this.connectionTypes.incomingConns[i];

      this.state += incomingSynapse.origNeuron.activation * incomingSynapse.weight * incomingSynapse.gain;
    }

    this.activation = +this.squash(this.state) * this.mask;
    this.derivative = +this.squash(this.state, true);

    let neurons = [];
    let influences = [];

    for (let i = 0; i < this.connectionTypes.gatedConns.length; i++) {
      let gatedSynapse = this.connectionTypes.gatedConns[i];
      let outGate = gatedSynapse.targetNeuron;

      let index = neurons.indexOf(outGate);
      if (index > -1) {
        influences[index] += gatedSynapse.weight * gatedSynapse.origNeuron.activation;
      } else {
        neurons.push(outGate);
        influences.push(gatedSynapse.weight * gatedSynapse.origNeuron.activation +
          (outGate.connectionTypes.selfConn.gated === this ? outGate.prevState : 0));
      }
      gatedSynapse.gain = this.activation;
    }

    for (let i = 0; i < this.connectionTypes.incomingConns.length; i++) {
      let incomingSynapse = this.connectionTypes.incomingConns[i];

      incomingSynapse.eligibility = this.connectionTypes.selfConn.gain * this.connectionTypes.selfConn.weight *
        incomingSynapse.eligibility + incomingSynapse.origNeuron.activation * incomingSynapse.gain;

      for (let j = 0; j < neurons.length; j++) {
        let neuron = neurons[j];

        const index = this.connectionTypes.incomingConns[i].xtrace.neurons.indexOf(neurons[j]);

        if (index > -1) {
          this.connectionTypes.incomingConns[i].xtrace.values[index] =
            (neurons[j].connectionTypes.selfConn.gain * neurons[j].connectionTypes.selfConn.weight * this.connectionTypes.incomingConns[i].xtrace.values[index]) +
            (this.derivative * this.connectionTypes.incomingConns[i].eligibility * influences[j]);
        } else {
          this.connectionTypes.incomingConns[i].xtrace.neurons.push(neurons[j]);
          this.connectionTypes.incomingConns[i].xtrace.values.push(this.derivative * this.connectionTypes.incomingConns[i].eligibility * influences[j]);
        }
      }
    }

    return this.activation;
  }

  public backpropNeuron(learningRate: number, momentum: number, doUpdate?: boolean, targetValue?: number) {

    momentum = momentum || 0;
    learningRate = learningRate || 0.3;
    let loss = 0;
    isNaN(learningRate) ? console.log('lr') : null;
    if (this.neuronType === 'outputNeuron') {
      this.loss.responsibility = this.loss.projected = +targetValue - +this.activation;
    } else {
      for (let i = 0; i < this.connectionTypes.outgoingConns.length; i++) {
        let outgoingSynapse = this.connectionTypes.outgoingConns[i];
        let neuron = outgoingSynapse.targetNeuron;
        loss += +neuron.loss.responsibility * +outgoingSynapse.weight * +outgoingSynapse.gain;
        isNaN(loss) ? console.log('loss1') : null;
        isNaN(outgoingSynapse.gain) ? console.log('outgoingSynapse.gain') : null;

      }
      this.loss.projected = +this.derivative * +loss;
      loss = 0;

      for (let i = 0; i < this.connectionTypes.gatedConns.length; i++) {
        let conn = this.connectionTypes.gatedConns[i];
        let neuron = conn.targetNeuron;
        let influence = neuron.connectionTypes.selfConn.gated === this ? neuron.prevState : 0;

        influence += +conn.weight * +conn.origNeuron.activation;
        loss += +neuron.loss.responsibility * +influence;
        isNaN(influence) ? console.log('influence') : null;
        isNaN(conn.origNeuron.activation) ? console.log('activation') : null;
        isNaN(loss) ? console.log('loss2') : null;
      }
      this.loss.gated = +this.derivative * +loss;
      this.loss.responsibility = +this.loss.projected + +this.loss.gated;
    }

    if (this.neuronType === 'constantNeuron') {
      return;
    }

    for (let i = 0; i < this.connectionTypes.incomingConns.length; i++) {
      let incomingSynapse = this.connectionTypes.incomingConns[i];

      let gradient = +this.loss.projected * +incomingSynapse.eligibility;

      for (let j = 0; j < incomingSynapse.xtrace.neurons.length; j++) {
        let neuron = incomingSynapse.xtrace.neurons[j];
        let value = +incomingSynapse.xtrace.values[j];
        gradient += +neuron.loss.responsibility * value;

      }

      incomingSynapse.totalDeltaWeight += +learningRate * +gradient * +this.mask;
      if (doUpdate) {
        incomingSynapse.totalDeltaWeight += +momentum * +incomingSynapse.previousDeltaWeight;
        incomingSynapse.weight += incomingSynapse.totalDeltaWeight;
        incomingSynapse.previousDeltaWeight = +incomingSynapse.totalDeltaWeight;
        incomingSynapse.totalDeltaWeight = 0;
      }
    }

    this.totalDeltaBias += +learningRate * +this.loss.responsibility;

    if (doUpdate) {
      this.totalDeltaBias += +momentum * +this.previousDeltaBias;
      this.bias += +this.totalDeltaBias;
      this.previousDeltaBias = +this.totalDeltaBias;
      this.totalDeltaBias = 0;
    }
  }

  public connectNeurons(target: Neuron | any, weight: number) {
    let myconnections = [];
    if (target.bias) {
      if (target === this && this.connectionTypes.selfConn.weight === 0) {

        this.connectionTypes.selfConn.weight = weight || 1;
        myconnections.push(this.connectionTypes.selfConn);

      } else if (!this.isProjectingTo(target)) {

        let connection = new Connection(this, target, weight);
        target.connectionTypes.incomingConns.push(connection);
        this.connectionTypes.outgoingConns.push(connection);
        myconnections.push(connection);
      }
    } else {
      for (let i = 0; i < target.neurons.length; i++) {
        let connection = new Connection(this, target.neurons[i], weight);
        target.neurons[i].connectionTypes.incomingConns.push(connection);
        this.connectionTypes.outgoingConns.push(connection);
        target.connectionTypes.incomingConns.push(connection);
        myconnections.push(connection);
      }
    }
    return myconnections;
  }

  public disconnectNeurons(neuron: Neuron, twosided?) {
    if (this === neuron) {
      this.connectionTypes.selfConn.weight = 0;
      return;
    }

    for (let i = 0; i < this.connectionTypes.outgoingConns.length; i++) {

      let outgoingSynapse = this.connectionTypes.outgoingConns[i];

      if (outgoingSynapse.targetNeuron === neuron) {

        this.connectionTypes.outgoingConns.splice(i, 1);
        let index = outgoingSynapse.targetNeuron.connectionTypes.incomingConns.indexOf(outgoingSynapse);
        outgoingSynapse.targetNeuron.connectionTypes.incomingConns.splice(index, 1);

        if (outgoingSynapse.gated !== null) {this.ungate(outgoingSynapse);}
        break;
      }
    }

    if (twosided) {
      this.disconnectNeurons(this);
    }
  }

  public gate(connections: Connection | Connection[]) {
    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];

      this.connectionTypes.gatedConns.push(connection);
      connection.gated = this;
    }
  }

  public ungate(connections: Connection | Connection[]) {
    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    for (let i = connections.length - 1; i >= 0; i--) {
      let connection = connections[i];

      let index = this.connectionTypes.gatedConns.indexOf(connection);
      this.connectionTypes.gatedConns.splice(index, 1);
      connection.gated = null;
    }
  }

  public clear() {
    for (let i = 0; i < this.connectionTypes.incomingConns.length; i++) {
      let connection = this.connectionTypes.incomingConns[i];
      connection.eligibility = 0;
      connection.xtrace = {
        neurons: [],
        values: []
      };
    }
    this.loss.responsibility = this.loss.projected = this.loss.gated = 0;
    this.prevState = this.state = this.activation = 0;
  }


  public mutate(method: Mutation) {
    switch (method) {
      case Mutation.MOD_ACTIVATION:
        let squash = Mutation.MOD_ACTIVATION.allowed[(Mutation.MOD_ACTIVATION.allowed.indexOf(this.squash) + Math.floor(Math.random() * (Mutation.MOD_ACTIVATION.allowed.length - 1)) + 1) % Mutation.MOD_ACTIVATION.allowed.length];
        this.squash = squash;
        break;
      case Mutation.MOD_BIAS:
        let modification = Math.random() * (Mutation.MOD_BIAS.max - Mutation.MOD_BIAS.min) + Mutation.MOD_BIAS.min;
        this.bias += modification;
        break;
    }
  }

  isProjectingTo(neuron) {
    for (let i = 0; i < this.connectionTypes.outgoingConns.length; i++) {
      let conn = this.connectionTypes.outgoingConns[i];
      if (conn.targetNeuron === neuron) {
        return true;
      }
    }
    return neuron === this && this.connectionTypes.selfConn.weight !== 0;

  }

  isProjectedBy(neuron) {
    for (let i = 0; i < this.connectionTypes.incomingConns.length; i++) {
      let conn = this.connectionTypes.incomingConns[i];
      if (conn.origNeuron === neuron) {
        return true;
      }
    }
    return neuron === this && this.connectionTypes.selfConn.weight !== 0;
  }

  public toJSON() {
    return {
      bias: this.bias,
      neuronType: this.neuronType,
      squash: this.squash.name,
      mask: this.mask
    }
  }

  public static fromJSON(json) {
    let neuron = new Neuron();
    neuron.bias = json.bias;
    neuron.neuronType = json.neuronType;
    neuron.mask = json.mask;
    neuron.squash = Activation[json.squash];
  }
}
