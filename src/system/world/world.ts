import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { UIState } from '../utils/models';
import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;
import { CANVAS_HEIGHT, CANVAS_WIDTH, KEYBOARD_KEYS } from '../utils/config';

import * as Matter from 'matter-js';
import Engine = Matter.Engine;
import Render = Matter.Render;
import World = Matter.World;
import Bodies = Matter.Bodies;
import Body = Matter.Body;
import Composites = Matter.Composites;
import { NavController } from 'ionic-angular';
import * as Matterwrap from 'matter-wrap';

@Component({
  selector: 'bot-world',
  templateUrl: './world.template.html'
})
export class WorldClass implements AfterViewInit {
  
  @ViewChild('mycanvas') mycanvas;
  
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
  public engine: Matter.Engine;
  public gamerender: Matter.Render;
  public ballC: Matter.Body;
  public ballD: Matter.Body;
  public ballA: Matter.Body;
  public ballB: Matter.Body;
  public ground: Matter.Body;
  public wall1: Matter.Body;
  public wall2: Matter.Body;
  public ceiling: Matter.Body;
  public comp1: Matter.Composite;
  public comp2: Matter.Composite;
  public comp3: Matter.Composite;
  public particleOptions = {
    friction: 0.05,
    frictionStatic: 0.1,
    render: { visible: true }
  };
  
  private nav: NavController;
  
  constructor (private navCtrl: NavController) {
    this.nav = navCtrl;
    (Matter as any).use(Matterwrap);
  }
  
  public circOptions = {
    plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: 1200, y: 800 } } },
    render: {
      fillStyle: 'rgba(155, 197, 61, 0.1)', lineWidth: 8,
      strokeStyle: 'rgba(155, 197, 61, 1)', opacity: 1
    }
  };
  
  // action potential, dendrite, axon
  
  ngAfterViewInit () {
    this.initCanvas();
  }
  
  private initCanvas (): void {
    this.playingField = this.mycanvas.nativeElement;
    this.ctx = this.playingField.getContext('2d');
    this.currentFrame.canvas.ctx = this.ctx;
    this.canvasWidth = this.playingField.width;
    this.canvasHeight = this.playingField.height;
    this.engine = Engine.create();
    this.gamerender = Render.create({
      canvas: this.playingField,
      engine: this.engine,
      options: {
        width: 1200,
        height: 800,
        wireframes: false
      }
    });
    this.ballC = Bodies.circle(400, 200, 80, this.circOptions);
    this.ballD = Bodies.circle(650, 150, 80, this.circOptions);
    this.ballA = Bodies.circle(380, 100, 40, this.circOptions);
    this.ballB = Bodies.circle(460, 210, 40, this.circOptions);
    this.ballA.restitution = 1;
    this.ballB.restitution = 1;
    this.comp1 = Composites.softBody(250, 100, 5, 5, 0, 0, true, 18, this.particleOptions, null),
      this.comp2 = Composites.softBody(400, 300, 8, 3, 0, 0, true, 15, this.particleOptions, null),
      this.comp3 = Composites.softBody(250, 400, 4, 4, 0, 0, true, 15, this.particleOptions, null),
      this.ground = Bodies.rectangle(600, 800, 1200, 60, { isStatic: true });
    this.wall1 = Bodies.rectangle(0, 400, 60, 800, { isStatic: true });
    this.wall2 = Bodies.rectangle(1200, 400, 60, 800, { isStatic: true });
    this.ceiling = Bodies.rectangle(600, 0, 1200, 60, { isStatic: true });
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.scale = 0.005;
    
    this.ballA.friction = 0;
    this.ballA.frictionAir = 0;
    this.ballA.frictionStatic = 0;
    this.ballA.density = 0.0001;
    Body.setAngularVelocity(this.ballA, Math.PI / 6);
    this.ballB.friction = 0;
    this.ballB.frictionAir = 0;
    this.ballB.frictionStatic = 0;
    this.ballB.density = 0.0001;
    Body.setAngularVelocity(this.ballB, Math.PI / 2);
    this.ballC.friction = 0;
    this.ballC.frictionAir = 0;
    this.ballC.frictionStatic = 0;
    this.ballC.density = 0.0001;
    Body.setAngularVelocity(this.ballC, Math.PI / 3);
    this.ballD.friction = 0;
    this.ballD.frictionAir = 0;
    this.ballD.frictionStatic = 0;
    this.ballD.density = 0.0001;
    Body.setAngularVelocity(this.ballD, Math.PI / 4);
    World.add(this.engine.world, [this.ballC, this.ballD, this.ballA, this.ballB]);
    Engine.run(this.engine);
    this.gamerender.options['background'] = '#1B263B';
    Render.run(this.gamerender);
    
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
  
  private update () {
  
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
