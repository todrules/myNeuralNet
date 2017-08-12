import { Activation } from './activation';

export class Mutation {


    public static ADD_NODE = {
      name: 'ADD_NODE'
    };
  public static SUB_NODE = {
      name: 'SUB_NODE',
      keep_gates: true
    };
  public static ADD_CONN = {
      name: 'ADD_CONN'
    };
  public static SUB_CONN = {
      name: 'REMOVE_CONN'
    };
  public static MOD_WEIGHT = {
      name: 'MOD_WEIGHT',
      min: -1,
      max: 1
    };
  public static MOD_BIAS = {
      name: 'MOD_BIAS',
      min: -1,
      max: 1
    };
  public static MOD_ACTIVATION = {
      name: 'MOD_ACTIVATION',
      mutateOutput: true,
      allowed: [
        Activation.LOGISTIC,
        Activation.TANH,
        Activation.RELU,
        Activation.IDENTITY,
        Activation.STEP,
        Activation.SOFTSIGN,
        Activation.SINUSOID,
        Activation.GAUSSIAN,
        Activation.BENT_IDENTITY,
        Activation.BIPOLAR,
        Activation.BIPOLAR_SIGMOID,
        Activation.HARD_TANH,
        Activation.ABSOLUTE,
        Activation.INVERSE,
        Activation.SELU
      ]
    };
  public static ADD_SELF_CONN = {
      name: 'ADD_SELF_CONN'
    };
  public static SUB_SELF_CONN = {
      name: 'SUB_SELF_CONN'
    };
  public static ADD_GATE = {
      name: 'ADD_GATE'
    };
  public static SUB_GATE = {
      name: 'SUB_GATE'
    };
  public static ADD_BACK_CONN = {
      name: 'ADD_BACK_CONN'
    };
  public static SUB_BACK_CONN = {
      name: 'SUB_BACK_CONN'
    };
  public static SWAP_NODES = {
      name: 'SWAP_NODES',
      mutateOutput: true
    }
  public static ALL = [
    Mutation.ADD_NODE,
    Mutation.SUB_NODE,
    Mutation.ADD_CONN,
    Mutation.SUB_CONN,
    Mutation.MOD_WEIGHT,
    Mutation.MOD_BIAS,
    Mutation.MOD_ACTIVATION,
    Mutation.ADD_GATE,
    Mutation.SUB_GATE,
    Mutation.ADD_SELF_CONN,
    Mutation.SUB_SELF_CONN,
    Mutation.ADD_BACK_CONN,
    Mutation.SUB_BACK_CONN,
    Mutation.SWAP_NODES
  ];

  public static FFW = [
    Mutation.ADD_NODE,
    Mutation.SUB_NODE,
    Mutation.ADD_CONN,
    Mutation.SUB_CONN,
    Mutation.MOD_WEIGHT,
    Mutation.MOD_BIAS,
    Mutation.MOD_ACTIVATION,
    Mutation.SWAP_NODES
  ];
}
