import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UIService } from './ui.service';
import { LSTM } from '../network/lstm';
import * as numjs from 'numjs';
import { NdArray } from 'numjs';
import { State } from './state';
import { NeuralNet } from './layer';

@Component({
  selector: 'deep-q',
  templateUrl: 'deepq.html'
})
export class DeepQ implements AfterViewInit {
  
  @ViewChild('mycanvas') mycanvas;
  
  public playingField;
  public ctx;
  public canvasWidth;
  public canvasHeight;
  public numSteps;
  public stop = true;
  public seq = 0;
  public animate = requestAnimationFrame ||
    webkitRequestAnimationFrame ||
    function (callback) { setTimeout(callback, 1000 / 60); };
  
  private uiservice: UIService;
  public reward;
  public actions = [
    'LEFT',
    'RIGHT',
    'UP',
    'DOWN',
    'STOP'
  ];
  
  public epsilon = 0.1;
  public pastStates = [];
  public gameArea = [];
  public states;
  public rewards;
  public terminals;
  public gamma;
  public stateslist;
  public currentstate;
  public totalRewards;
  public lastaction;
  
  public statesize;
  public actionsize;
  
  public lstm: LSTM;
  
  constructor (private uiService?: UIService) {
  
    this.statesize = 400;
    this.actionsize = 5;
    
    this.lstm = new LSTM(this.statesize, this.actionsize, 3, 100);
    
    this.gamma = 0.5;
    this.rewards = {};
    this.states = {};
    this.stateslist = [];
    this.currentstate = null;
    this.reward = 0;
    this.totalRewards = 0;
    this.uiservice = uiService;
    this.uiservice.reward$.subscribe((reward) => {
      this.reward = reward;
      this.totalRewards += this.reward;
     // this.pastStates[this.pastStates.length - 1].reward = reward;
    });
    
    this.stop = true;
  }
  
  public saveState = (oldState: any[], reward, lastAction, ts) => {
    
      this.addState(oldState, ts);
    
    this.states[ts].addAction(oldState, reward, lastAction, ts);
  };
  
  public addState = (oldState, ts) => {
    let state = new State(ts);
    this.states[ts] = state;
    this.stateslist.push(state);
    return state;
  };
  
  public setState = (ts) => {
    this.currentstate = this.states[ts];
    return this.currentstate;
  };
  
  public getState = () => {
    return this.currentstate;
  };
  
  public randomState () {
    return this.stateslist[Math.floor(this.stateslist.length * Math.random())];
  }
  
  public optimalFutureValue = (state) => {
    let rewards = this.rewards[state];
    let max = 0;
    for (let action in rewards) {
      if (rewards.hasOwnProperty(action)) {
        max = Math.max(max, rewards[action] || 0);
      }
    }
    return max;
  };
  
  public stepState = () => {
    this.currentstate || (this.currentstate = this.randomState());
    let action = this.currentstate.randomAction();
    if(!action) {
      return null;
    }
    this.rewards[this.currentstate.name] || (this.rewards[this.currentstate.name] = {});
    this.rewards[this.currentstate.name][action.name] = (action.reward || 0) + this.gamma * this.optimalFutureValue(action.nextState);
    return this.currentstate = this.states[action.nextState];

  };
  
  public learn = (steps) => {
    steps = Math.max(1, steps || 0);
    while(steps--) {
      this.currentstate = this.randomState();
      this.stepState();
    }
  };
  
  public bestAction = (state) => {
    let rewards = this.rewards[state] || {};
    let bestaction = null;
    for (let action in rewards) {
      if (rewards.hasOwnProperty(action)) {
        if(!bestaction) {
          bestaction = action;
        } else if((rewards[action] === rewards[bestaction]) && (Math.random() > 0.5)) {
          bestaction = action;
        } else if(rewards[action] > rewards[bestaction]) {
          bestaction = action;
        }
      }
    }
    return bestaction;
  };
  
  public knowsAction = (state, action) => {
    return (this.rewards[state] || {}).hasOwnProperty(action);
  };
  
  public applyAction = (actionName) => {
    let actionObj = this.states[this.currentstate.name].actions[actionName];
    if(actionObj) {
      this.currentstate = this.states[actionObj.nextState];
    }
    return actionObj && this.currentstate;
  };
  
  public runOnce = () => {
    let best = this.bestAction(this.currentstate.name);
    let action = this.states[this.currentstate.name].actions[best];
    if(action) {
      this.currentstate = this.states[action.nextState];
    }
    return action && this.currentstate;
  };
  
  
  
  ngAfterViewInit() {
    this.initGameCanvas();
    this.playGame();
  }
  
  private initGameCanvas() {
    this.playingField = this.mycanvas.nativeElement;
    this.uiservice.createPlayingField(this.playingField);
  }
  
  public playGame () {
    this.numSteps = 0;
    this.stop = false;
    this.step();
  }
  
  public stopGame () {
    this.stop = true;
  }
  
  public step = () => {
    if (this.stop === true) {
      return;
    } else {
      this.numSteps++;
      this.update();
      // this.render();
      this.animate(this.step);
    }
  };
  
  switchTabs () {
   // this.nav.parent.select(1);
  }
  
  public fromNdArray(arr: NdArray): number[] {
    let shape = arr.shape;
    let row = [];
    
    
    for(let i = 0; i < shape[0]; i++) {
      let col = [];
      row.push([]);
      for(let j = 0; j < shape[1]; j++) {
        
        row[i] = arr.get(i, j);
      }
    }
    return row;
  }
  
  private getRandomMove() {
    return Math.floor(Math.random() * 3);
  }
  
  private update () {
    if(this.seq !== 0) {
      this.saveState(this.gameArea, this.reward, this.lastaction, this.numSteps);
      this.learn(10);
      this.seq++;
      this.seq = this.seq === 5 ? 0 : this.seq;
    }
    
    
    if(this.numSteps % 20 === 0) {
      this.seq = 1;
      
      const state = this.uiservice.getState();
      const rndMove = this.getRandomMove();
      
      setTimeout(() => {
        this.gameArea = this.fromNdArray(state);
      //  console.log(this.gameArea[5][1]);
      
      });
      let action = this.bestAction(this.gameArea);
      if(action === null || typeof action === 'undefined' || (!this.knowsAction(this.gameArea, rndMove) && Math.random() < this.epsilon)) {
        action = rndMove;
      }
      const move = +action;
      this.lastaction = action;
      
      let xforce = 0;
      let yforce = 0;
      switch(move) {
        case 0:
          xforce = -0.001;
          yforce = 0;
          break;
        case 1:
          xforce = 0.001;
          yforce = 0;
          break;
        case 2:
          xforce = 0;
          yforce = -0.001;
          break;
        case 3:
          xforce = 0;
          yforce = 0.001;
          break;
        case 4:
          xforce = 0;
          yforce = 0;
          break;
        default:
          break;
      }
      this.uiservice.movePlayer(xforce, yforce);
      
    }
  }
  
  private mod (steps: number): boolean {
    const step = steps;
    return this.numSteps % step === 0;
  }
  
  public render = () => {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = '#1B263B';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
  };
  
}
