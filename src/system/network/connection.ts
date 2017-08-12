

import { ConnectionInf } from './models';

export class Connection implements ConnectionInf {

  public origNeuron;
  public targetNeuron;
  public gain: number;
  public weight: number;
  public gated = null;
  public eligibility = 0;
  public previousDeltaWeight = 0;
  public totalDeltaWeight = 0;
  public xtrace = {
    neurons: [],
    values: []
  };

  constructor(incoming, outgoing, weight) {
    this.origNeuron = incoming;
    this.targetNeuron = outgoing;
    this.gain = 1;

    this.weight = (typeof weight === 'undefined') ? (Math.random() * 0.2) - 0.1 : weight;


  }

  toJSON() {
    return {
      weight: this.weight
    }
  }

  public static innovationID(a, b) {
    return 1 / 2 * (a + b) * (a + b + 1) + b;
  }

}
