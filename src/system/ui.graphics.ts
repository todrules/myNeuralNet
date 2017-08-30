import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  @ViewChild('rewardbtn') rewardbtn;
  @ViewChild('punishbtn') punishbtn;
  @ViewChild('dxdiag') dxdiag;
  
  public rewardbtncoords = {
    top: null,
    left: null,
    width: null,
    height: null,
    right: null,
    bottom: null
  };
  public punishbtncoords = {
    top: null,
    left: null,
    width: null,
    height: null,
    right: null,
    bottom: null
  };
  public playbtncoords = {
    top: null,
    left: null,
    width: null,
    height: null,
    right: null,
    bottom: null
  };
  public pausebtncoords = {
    top: null,
    left: null,
    width: null,
    height: null,
    right: null,
    bottom: null
  };
  
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
    this.mousedown(e);
  }
  
  @HostListener('window:mouseup', ['$event'])
    mouseup (event: MouseEvent) {
  }
  
  @HostListener('window:mousemove', ['$event'])
    mouseMove (event: MouseEvent) {
    const e = {
      xcoord: event.clientX,
      ycoord: event.clientY
    };
    this.mousemove(e);
  }

  private getKeyType (keycode: number): string {
    return KEYBOARD_KEYS[keycode];
  }
  
  public bright = 1;
  public blobamt = 1.5;
  public energy = 1;
  public particles = 20;
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
  public punishamount = 0;
  public rewardamount = 0;
  public totalpunish = 0;
  public totalreward = 0;
  public diag = '';
  public dxDiag;
  public diagArray = [];
  
  constructor (private cogservice: Cognition, private navCtrl: NavController) {
    this.cognition = cogservice;
    this.hungerChart = hungerChartData;
    this.nav = navCtrl;
  }
  
  private mousemove(event) {
    if (event.xcoord >= this.rewardbtncoords.left &&
      event.xcoord <= this.punishbtncoords.right &&
      event.ycoord >= this.rewardbtncoords.top &&
      event.ycoord <= this.rewardbtncoords.bottom) {
      if (event.xcoord <= this.rewardbtncoords.right) {
        // have a hit for reward btn
        document.body.style.cursor = 'pointer';
      } else if (event.xcoord >= this.punishbtncoords.left) {
        // have a hit for punish btn
        document.body.style.cursor = 'pointer';
      } else {
        // clicked on gap between btns
        document.body.style.cursor = 'default';
      }
    } else if (event.xcoord >= this.playbtncoords.left &&
      event.xcoord <= this.pausebtncoords.right &&
      event.ycoord >= this.playbtncoords.top &&
      event.ycoord <= this.playbtncoords.bottom) {
      if (event.xcoord <= this.playbtncoords.right) {
        // have a hit for reward btn
        document.body.style.cursor = 'pointer';
      } else if (event.xcoord >= this.pausebtncoords.left) {
        // have a hit for punish btn
        document.body.style.cursor = 'pointer';
      } else {
        // clicked on gap between btns
        document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  }
  
  private mousedown(event) {
    if(event.xcoord >= this.rewardbtncoords.left &&
      event.xcoord <= this.punishbtncoords.right &&
      event.ycoord >= this.rewardbtncoords.top &&
      event.ycoord <= this.rewardbtncoords.bottom) {
      if(event.xcoord <= this.rewardbtncoords.right) {
        // have a hit for reward btn
        this.reward();
      } else if(event.xcoord >= this.punishbtncoords.left) {
        // have a hit for punish btn
        this.punish();
      } else {
        // clicked on gap between btns
      }
    } else if (event.xcoord >= this.playbtncoords.left &&
      event.xcoord <= this.pausebtncoords.right &&
      event.ycoord >= this.playbtncoords.top &&
      event.ycoord <= this.playbtncoords.bottom) {
      if (event.xcoord <= this.playbtncoords.right) {
        // have a hit for reward btn
        this.playGame();
        this.diagnostics('Play Game called.', 'mousedown');
      } else if (event.xcoord >= this.pausebtncoords.left) {
        // have a hit for punish btn
        this.stopGame();
        this.diagnostics('Stop Game called.', 'mousedown');
      } else {
        // clicked on gap between btns
      }
    }
  }

  
 // action potential, dendrite, axon
  
  ngAfterViewInit () {
    this.textInput = this.myinput.nativeElement;
    this.textInput.innerHTML = `<span class="blinking-cursor">|</span>`;
    this.initBtns();
    this.initCanvas();
    
  }
  
  private initDiag() {
    this.dxDiag = this.dxdiag.nativeElement;
  }
  
  public diagnostics(input: any, label?: string) {
    let diag;
    let newlabel = '';
    if(!label) {
      newlabel = 'DXDiag: ';
    } else {
      newlabel = label + ': ';
    }
    if(typeof input === 'object') {
      let obj = JSON.stringify(input);
      obj = newlabel + obj;
      diag = this.printDiag(obj);
    } else if(typeof input === 'string') {
      input = newlabel + input;
      diag = this.printDiag(input);
    } else {
      let msg = 'Input type not allowed.';
      msg = newlabel + msg;
      diag = this.printDiag(msg);
    }
    return diag;
  }
  
  private printDiag(input: string) {
    if (this.diagArray.length < 5) {
      this.diagArray.push(input);
    } else if (this.diagArray.length >= 5) {
      this.diagArray.shift();
      this.diagArray.push(input);
    }
    this.diag = this.diagArray.join('<br>');
    return this.diag;
  }
  
  private initBtns() {
    setTimeout(() => {
      const punish = new ElementRef(document.getElementById('punishbtn'));
      const reward = new ElementRef(document.getElementById('rewardbtn'));
      const play = new ElementRef(document.getElementById('playbtn'));
      const pause = new ElementRef(document.getElementById('pausebtn'));

      this.punishbtncoords = {
        top: punish.nativeElement.offsetTop,
        left: punish.nativeElement.offsetLeft,
        width: punish.nativeElement.offsetWidth,
        height: punish.nativeElement.offsetHeight,
        right: punish.nativeElement.offsetLeft + punish.nativeElement.offsetWidth,
        bottom: punish.nativeElement.offsetTop + punish.nativeElement.offsetHeight
      };
      this.diagnostics(this.punishbtncoords, 'Punish Button');

      this.rewardbtncoords = {
        top: reward.nativeElement.offsetTop,
        left: reward.nativeElement.offsetLeft,
        width: reward.nativeElement.offsetWidth,
        height: reward.nativeElement.offsetHeight,
        right: reward.nativeElement.offsetLeft + reward.nativeElement.offsetWidth,
        bottom: reward.nativeElement.offsetTop + reward.nativeElement.offsetHeight
      };
      this.diagnostics(this.rewardbtncoords, 'Reward Button');
  
      this.playbtncoords = {
        top: play.nativeElement.offsetTop,
        left: play.nativeElement.offsetLeft,
        width: play.nativeElement.offsetWidth,
        height: play.nativeElement.offsetHeight,
        right: play.nativeElement.offsetLeft + play.nativeElement.offsetWidth,
        bottom: play.nativeElement.offsetTop + play.nativeElement.offsetHeight
      };
      this.diagnostics(this.playbtncoords, 'Play Button');
  
      this.pausebtncoords = {
        top: pause.nativeElement.offsetTop,
        left: pause.nativeElement.offsetLeft,
        width: pause.nativeElement.offsetWidth,
        height: pause.nativeElement.offsetHeight,
        right: pause.nativeElement.offsetLeft + pause.nativeElement.offsetWidth,
        bottom: pause.nativeElement.offsetTop + pause.nativeElement.offsetHeight
      };
      this.diagnostics(this.pausebtncoords, 'Pause Button');
    });
  }
  
  private initCanvas (): void {

  }
  
  public reward() {
    this.rewardamount++;
    this.totalreward++;
  }
  
  public punish() {
    this.punishamount++;
    this.totalpunish++;
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
