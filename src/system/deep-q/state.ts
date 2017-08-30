/* tslint:disable:no-bitwise no-shadowed-variable */

import { Injectable } from '@angular/core';

@Injectable()
export class State {
  
  public name;
  public actions = {};
  public actionslist = [];
  public timestamp;
  constructor (public ts) {
    this.timestamp = ts;
  }
  
  public addAction(state, reward, lastAction, timestamp) {
    
    let action = {
      action: lastAction,
      state: state,
      reward: reward,
      timestamp: timestamp
    }
    
    this.actionslist.push(action);
    this.actions[timestamp] = action;
    
  }
  
  public randomAction() {
    return this.actionslist[Math.floor(this.actionslist.length * Math.random())];
  }
}
