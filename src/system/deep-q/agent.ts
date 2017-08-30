

import { Injectable } from '@angular/core';

@Injectable()
export class QAgent {
  
  public alpha = 0.1;
  public theta = 0.001;
  public learningSteps = 100e3;
  public learningStepsBurn = 3e3;
  public epsilonMin = 0.05;
  public epsilonTest = 0.05;
  public experience: 25e3;
  public learningRate: 64;
  public beginLearningRate: 1000;
  public discount: 0.9;
  public beta: 0.15;
  public net;
  public target;
  public targetWeight;
  public agent;
  public buffer;
  public states;
  public actions;
  public input;
  public history;
  public age;
  public learning;
  public ready;
  public acted;
  public recallsize;
  public training;
  public epsilon;
  
  constructor(public aAgent, public aStates?, public aActions?) {
    
    this.states = aStates;
    this.agent = aAgent;
    this.actions = aActions;
    
   
    
    this.history = {
      states: null,
      actions: null,
      inputs: null,
      rewards: null
    }
    this.age = 1;
    this.learning = true;
    this.ready = true;
    this.recallsize = 64;
  }
  
  public policy (state) {
    if (!this.ready) {
      return;
    }
    
    let input = this.getStateInputVector(state);

    
    this.history.inputs.push(input);
    this.history.states.push(state);

    this.acted = true;

  }
  
  public actionToVector (action) {
    if (action instanceof Float64Array) {
      return action;
    }
    
    if (Number.isInteger(action)) {

    }
  }
  
  public getStateInputVector (state) {
    if(this.recallsize > 0) {
      let input = new Float64Array(this.input);
      let cursor = 0;
  
      for (let i = 0; i < this.recallsize; i++) {
        if (this.history.states.size > i) {
          input.set(this.history.states.get(i), cursor);
          input.set(this.actionToVector(this.history.actions.get()), cursor + this.states);
        }
        cursor += this.states + this.actions;
      }
      input.set(state, cursor);
      return input;
    }
    return state;
  }

  public simulate (state, action) {
    if (!this.ready) {
      return;
    }
    
    let input = this.getStateInputVector(state);
  
    this.history.inputs.push(input);
    this.history.states.push(state);
    this.history.actions.push(action);
    this.acted = true;
  }

  public learn (reward) {
    if (!this.acted || !this.ready) {
      return;
    }
    
    this.acted = false;
    this.history.rewards.push(reward);

    if (this.history.states.size < 2 || this.learning === false) {
      return;
    }

    let experience = null;
    experience.action0 = this.history.actions.get(1);
    experience.state0 = this.history.inputs.get(1);
    experience.reward0 = this.history.rewards.get(1);
    experience.state1 = this.history.inputs.get(0);
    experience.action1 = this.history.actions.get(0);
    experience.init();

    this.buffer.add(experience);

    ++this.age;
    
    return this.backward();
  }
  
  public backward () {
    if (this.beginLearningRate > this.age) {
      return false;
    }

    this.training = true;
    let loss = this.replay();

    return loss;
  }
  
  public replay () {
    let batch = this.buffer.sample(this.learningRate);
    let loss = 0.0;
    
    for (let i = 0; i < batch.length; i++) {
      loss += batch[i].step();
    }
    
    this.buffer.updateAfterLearning(batch);
    
    return loss / batch.length;
  }

  public act (state, target) {
    if (this.agent.learning) {
      this.epsilon = Math.max(1.0 - Math.max((this.agent.age - this.learningStepsBurn) / this.learningSteps, 0.0), this.epsilonMin);
    } else {
      this.epsilon = this.epsilonTest;
    }
    
    if (Math.random() <= this.epsilon) {

    }
  
    this.net.forward(state);
  
    return this.net.output.weights.maxi();
  }
  
  public value (state, action, target) {
    target = target == null ? this.net : this.target;
    target.forward(state);
    return target.output.weights[action];
  }
  
  public evaluate (state, target) {
    return this.evaluate(state, target);
  }

  
  public getInputDimension (states, actions, temporalWindow) {
    return states + temporalWindow * (states + actions);
  }
}
