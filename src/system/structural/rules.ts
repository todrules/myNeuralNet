import { Injectable } from '@angular/core';

export const enum ActionEnum {
  UP, DOWN, LEFT, RIGHT, STOP
}

@Injectable()
export class Rules {

  public actionWeights = {
    UP: 0,
    DOWN: 0,
    LEFT: 0,
    RIGHT: 0,
    STOP: 0
  };

  public possibleActions = [
    this.actionWeights.UP,
    this.actionWeights.DOWN,
    this.actionWeights.LEFT,
    this.actionWeights.RIGHT,
    this.actionWeights.STOP
  ];

  constructor () {

  }
}
