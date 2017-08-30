/* tslint:disable:no-bitwise no-shadowed-variable */
import * as mathjs from 'mathjs';
import * as numjs from 'numjs';

import { Injectable } from '@angular/core';

export const EPISODES = 2000;

@Injectable()
export class A3CAgent {
  
  public episode = 0;
  public scores = [];
  public statesize;
  public actionsize;
  public actorLearnRate = 0.001;
  public criticLearnRate = 0.001;
  public discount = 0.99;
  public hidden1 = 400;
  public hidden2 = 200;
  public threads = 8;
  public actor;
  public critic;
  public optimizer;
  public actorOptimize;
  public criticOptimize;
  
  constructor (public stateSize: number, public actionSize: number) {
    this.statesize = stateSize;
    this.actionsize = actionSize;
    
    this.actor = this.build();
    this.critic = this.build();
    this.optimizer = [this.actorOptimizer(), null];
  }
  
  public build() {
    let state = mathjs.zeros([1, this.statesize]);
    let shared = mathjs.ones(this.hidden1);
    let actorhidden = mathjs.ones(this.hidden2);
    let actionprob = mathjs.ones(this.actionsize);
    let valuehidden = mathjs.ones(this.hidden2);
    let statevalue = mathjs.ones(1);
    let actor = {
      inputs: state,
      outputs: actionprob
    };
    let critic = {
      inputs: state,
      outputs: statevalue
    };
    return [actor, critic];
    
  }
  
  private adam(lr = 0.001, beta_1 = 0.9, beta_2 = 0.999, epsilon = 1e-08, decay = 0.0) {
  
  }
  
  public actorOptimizer() {
    let action = null;
    let adv = null;
    
    let policy = this.actor.output;
    let goodprob = mathjs.sum((action * policy), 1);
    let eligibility = Math.log(goodprob + 1e-10) * adv;
    let loss = -mathjs.sum(eligibility);
    
    let entropy = mathjs.sum(policy * Math.log(policy + 1e-10), 1);
    let actorloss = loss + 0.01 * entropy;
    let optimizer = this.adam();
    // let updates = optimizer.
  }
  
}
