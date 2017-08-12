
export const config = {
  warnings: false
};

import {
  ConnectionInf,
  ConnectionType, ConnectionTypeInf,
  CrossOverInf,
  CrossoverType,
  GatingInf,
  GatingType,
  SelectionInf,
  SelectionType
} from './models';

export const warnings = false;

export class StaticConnection implements ConnectionTypeInf {
  public static ALL_TO_ALL: ConnectionType = {
    name: 'OUTPUT'
  };
  public static ALL_TO_ELSE: ConnectionType = {
    name: 'INPUT'
  };
  public static ONE_TO_ONE: ConnectionType = {
    name: 'SELF'
  };
}

export class StaticCrossover implements CrossOverInf {
  public static SINGLE_POINT: CrossoverType = {
    name: 'SINGLE_POINT',
    config: [0.4]
  };
  public static TWO_POINT: CrossoverType = {
    name: 'TWO_POINT',
    config: [0.4, 0.9]
  };
  public static UNIFORM: CrossoverType = {
    name: 'UNIFORM'
  };
  public static AVERAGE: CrossoverType = {
    name: 'AVERAGE'
  };
}

export class StaticGating implements GatingInf {
  public static OUTPUT: GatingType = {
    name: 'OUTPUT'
  };
  public static INPUT: GatingType = {
    name: 'INPUT'
  };
  public static SELF: GatingType = {
    name: 'SELF'
  };
}

export class StaticSelection implements SelectionInf {
  public static FITNESS_PROPORTIONATE: SelectionType = {
    name: 'FITNESS_PROPORTIONATE'
  };
  public static POWER: SelectionType = {
    name: 'POWER',
    power: 4
  };
  public static TOURNAMENT: SelectionType = {
    name: 'TOURNAMENT',
    size: 5,
    probability: 0.5
  };
}

