import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { UIState } from './utils/models';
import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;
import { CANVAS_HEIGHT, CANVAS_WIDTH, KEYBOARD_KEYS } from './utils/config';
import { Cognition } from './intellect/cognition';
import { hungerChartData } from './utils/config';
import { NavController } from 'ionic-angular';



@Component({
  selector: 'ui-graphics',
  templateUrl: './ui-graphics.template.html'
})
export class UIGraphics implements AfterViewInit {
  
  @ViewChild('myinput') myinput;
  public keysdown = '';
  
  @HostListener('window:keydown', ['$event'])
  keyboardDown (event: KeyboardEvent) {
    event.preventDefault();
    const type = this.getKeyType(event.keyCode);
    const blinker = `<span class="blinking-cursor">|</span>`;
    
    if(event.keyCode >= 48 || event.keyCode === 32) {
      
      this.keysdown = this.keysdown + event.key;
      
    } else if(event.keyCode === 8) {

      this.keysdown = this.keysdown.slice(0, -1);
      
    } else if(event.keyCode === 13) {
      
      this.update(this.keysdown);
      this.keysdown = '';
    }
    this.textInput.innerHTML = this.keysdown + blinker;
  }
  
  @HostListener('window:keyup', ['$event'])
  keyboardUp (event: KeyboardEvent) {
    // delete this.keysDown[event.keyCode];
  }
  
  @HostListener('window:mousedown', ['$event'])
    mouseDown (event: MouseEvent) {
    const e = {
      target: event.target,
      xcoord: event.clientX,
      ycoord: event.clientY
    };
    this.mousedown.push(e);
  }
  
  @HostListener('window:mouseup', ['$event'])
    mouseup (event: MouseEvent) {
  }
  
  public mousedown = [];

  private getKeyType (keycode: number): string {
    return KEYBOARD_KEYS[keycode];
  }
 
  public animate = requestAnimationFrame ||
    webkitRequestAnimationFrame ||
    function (callback) { setTimeout(callback, 1000 / 60); };
  
  public playingField;
  public ctx;
  public stop = true;
  public uiState: UIState;
  private numSteps = 0;
  public canvasWidth;
  public canvasHeight;
  public currentFrame = {
    canvas: {
      ctx: null,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    },
    numCycles: 0,
    timeLastReward: 0,
    avgTimeBTR: 0,
    totalRewards: 0,
    totalTime: 0,
    isExploring: false,
    isStuck: false,
    prevLoc: [],
    loc: []
    
  };
  public hungerChart;
  public systemstate;
  private cognition: Cognition;
  public textInput;
  
  private nav: NavController;
  
  constructor (private cogservice: Cognition, private navCtrl: NavController) {
    this.cognition = cogservice;
    this.hungerChart = hungerChartData;
    this.nav = navCtrl;

  }

  
 // action potential, dendrite, axon
  
  ngAfterViewInit () {
    this.textInput = this.myinput.nativeElement;
    this.textInput.innerHTML = `<span class="blinking-cursor">|</span>`;
    this.initCanvas();
  }
  
  private initCanvas (): void {

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
      this.currentFrame.numCycles++;
      
      this.update();
     // this.render();
      this.animate(this.step);
    }
  };
  
  switchTabs () {
    this.nav.parent.select(1);
  }
  
  private update(stimulus?: any) {
    if(stimulus) {
      this.cognition.nextState(stimulus);
    } else {
      this.cognition.nextState();
      if (this.mod(20)) {
        this.systemstate = this.cognition.getStats();
        let chart = [this.numSteps, this.systemstate.hunger, this.systemstate.fatigue, this.systemstate.wellness, this.systemstate.arousal, this.systemstate.contentment];
        this.hungerChart.dataTable.push(chart);
        this.hungerChart = Object.assign({}, this.hungerChart);
      }
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
  
  public static getDistance (x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  }
  
  
  
}
