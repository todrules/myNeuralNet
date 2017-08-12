import { Connection } from './connection';
import { Neuron } from './neuron';


export interface Entity {
  name: string;
  id?: string | number;
  meta?: {
    category?: string;
    structure?: {
      colors?: string | string[];
      weight?: string;
      material?: string | string[];
      size?: string;
      shape?: string;
      isAbstract?: boolean;
      isPlant?: boolean;
      isAnimal?: boolean;
      isFabricated?: boolean;
    };
    purpose?: {
      usedToSolve?: any[];
      dangerFrom?: any[];
      requiredSkills?: any[];
      helpWithGoals?: any[];
    };
    relatedEntities?: Entity[];
  }
}

export interface Action {
  confidence?: number;
  expectedReward?: number;
  difficulty?: number;
  pastPerformance?: number;
  cost?: number;

}


export interface Motivation {
  goals: Goal[];
  principles: Principle[];
  beliefs: Belief[];
}

export interface Goal {
  name?: string;
}

export interface Principle {
  name?: string;
}

export interface Belief {
  name?: string;
}

export interface ConnectionInf {
  origNeuron?: Neuron | Neuron[];
  targetNeuron?: Neuron | Neuron[];
  weight?: number;
  gated?: any[];
  eligibility?: number;
  previousDeltaWeight?: number;
  totalDeltaWeight?: number;
  xtrace?: {
    neurons?: Neuron[],
    values?: number | number[] | number[][]
  }

}

export interface ConnectionRef {
  incomingConns?: Connection[];
  outgoingConns?: Connection[];
  gatedConns?: Connection[];
  selfConn?: Connection;
}

export interface LayerConnectionRef {
  incomingConns?: Connection[];
  outgoingConns?: Connection[];
  gatedConns?: Connection[];
  selfConns?: Connection[];
}

export interface NeuronInf {
  bias?: number;
  squash?: any;
  neuronType?: string;
  activation?: number;
  state?: number;
  prevState?: number;
  mask?: number;
  previousDeltaBias?: number;
  totalDeltaBias?: number;
  connectionTypes?: ConnectionRef;
  derivative?: number;
  loss?: LossInf;
}

export interface LayerInf {
  neurons: Neuron[];
  connectionTypes: LayerConnectionRef;
}

export interface LossInf {
  responsibility?: number;
  projected?: number;
  gated?: number;
}

export interface TrainingInf {
  inputValues: any;
  targetValues: any;
}

export interface TrainingOptions {
  targetLoss?: number;
  iterations?: number;
  learningRate?: number;
  gamma?: number;
  power?: number;
  dropout?: number;
  momentum?: number;
  ratePolicy?: LearningRateFunc;
  cost?: CostFunc;
}

export interface NNOptions {
  equal?: boolean;
  clear?: boolean;
  popsize?: number;
  elitism?: number;
  provenance?: number;
  mutationRate?: number;
  mutationAmount?: number;
  selection?: any;
  crossover?: any;
  mutation?: any;
  network?: any;
}

export interface MemOptions {
  memoryToMemory?: boolean;
  outputToMemory?: boolean;
  outputToGates?: boolean;
  inputToOutput?: boolean;
  inputToDeep?: boolean;

}

export interface CostState {
  loss?: number;
  misses?: any;
}

export type CostFunc = (targetValues: number, outputValues: number[]) => number;

export type ActivationFunc = (x: number, derivate: boolean) => ActivationState;

export type LearningRateFunc = (baseRate: number, iteration?: number, gamma?: number, power?: number, stepSize?: number) => number;

export interface ActivationState {
  activation?: number;
}

export interface ConnectionType {
  name: string;
}

export interface ConnectionTypeInf {
  ALL_TO_ALL?: ConnectionType;
  ALL_TO_ELSE?: ConnectionType;
  ONE_TO_ONE?: ConnectionType;
}

export interface CrossoverType {
  name: string;
  config?: number[];
}

export interface CrossOverInf {
  SINGLE_POINT?: CrossoverType;
  TWO_POINT?: CrossoverType;
  UNIFORM?: CrossoverType;
  AVERAGE?: CrossoverType;
}

export interface GatingType {
  name: string;
}

export interface GatingInf {
  OUTPUT?: GatingType;
  INPUT?: GatingType;
  SELF?: GatingType;
}

export interface SelectionType {
  name: string;
  power?: number;
  size?: number;
  probability?: number;
}

export interface SelectionInf {
  FITNESS_PROPORTIONATE?: SelectionType;
  POWER?: SelectionType;
  TOURNAMENT?: SelectionType;
}

export interface MutationType {
  name: string;
  min?: number;
  max?: number;
  keep_gates?: boolean;
  mutateOutput?: boolean;
  allowed?: any[];
}

export interface Id {
  id: any;
}

export interface D3Node {
  id: number;
  group?: number;

}

export interface D3Links {
  source: number;
  target: number;
  value: number;
}

export interface D3Graph {
  nodes: D3Node[];
  links: D3Links[];
}
