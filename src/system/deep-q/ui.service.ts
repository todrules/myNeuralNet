import { AfterViewInit, Component, HostListener, Injectable, ViewChild } from '@angular/core';
import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;
import * as Matter from 'matter-js';
import Engine = Matter.Engine;
import Render = Matter.Render;
import World = Matter.World;
import Bodies = Matter.Bodies;
import Body = Matter.Body;
import Composites = Matter.Composites;
import { NavController } from 'ionic-angular';
import * as Matterwrap from 'matter-wrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as numjs from 'numjs';

@Injectable()
export class UIService implements AfterViewInit {
  
  public playingField;
  public ctx;
  public canvasWidth;
  public canvasHeight;
  public engine: Matter.Engine;
  public gamerender: Matter.Render;
  public ballC: Matter.Body;
  public ballD: Matter.Body;
  public ballA: Matter.Body;
  public ballB: Matter.Body;
  public particleOptions = {
    friction: 0.05,
    frictionStatic: 0.1,
    render: { visible: true }
  };
  public player;
  public collisionListener;
  public reward$: Subject<number> = new Subject<number>();
  public gameArea;
  
  constructor () {
    (Matter as any).use(Matterwrap);
  }
  
  public foodOptions = {
    plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: 1200, y: 800 } } },
    render: {
      fillStyle: 'rgba(155, 197, 61, 0.1)', lineWidth: 4,
      strokeStyle: 'rgba(155, 197, 61, 1)', opacity: 1
    },
    isStatic: true
  };
  
  public playerOptions = {
    plugin: { wrap: { min: { x: 0, y: 0 }, max: { x: 1200, y: 800 } } },
    render: {
      fillStyle: 'rgba(255, 155, 255, 0.1)', lineWidth: 8,
      strokeStyle: 'rgba(255, 255, 255, 1)', opacity: 1
    }
  };
 
  ngAfterViewInit () {
  
  }
  
  public createPlayingField (canvas): void {

    this.engine = Engine.create();
    this.gamerender = Render.create({
      canvas: canvas,
      engine: this.engine,
      options: {
        width: 1200,
        height: 800,
        wireframes: false
      }
    });
    let worldObjects = [];
    const food = this.createFood(25);
    const player = this.createPlayer();
    
    worldObjects = food;
    worldObjects.push(player[0]);
    this.addToWorld(worldObjects);
    
   // Body.setAngularVelocity(this.ballD, Math.PI / 4);
    this.engine.world.gravity.x = 0;
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.scale = 0.005;
    
    Engine.run(this.engine);
    this.gamerender.options['background'] = '#1B263B';
    Render.run(this.gamerender);
    const myPlayer = player[0] as Body;
    this.player = myPlayer;
    Matter.Body.set(myPlayer, 'label', 'player');
   // Matter.Body.setAngularVelocity(myPlayer, Math.PI / 4);
   Matter.Events.on(this.engine, 'collisionActive', (e) => {
     for(let i = 0; i < e.pairs.length; i++) {
       const pair = e.pairs[i];
       console.log(pair);
       if(pair.bodyA.label === 'player') {
         World.remove(this.engine.world, pair.bodyB);
         setTimeout(() => {
           this.fixRotation();
         }, 1000);
         
       } else {
         World.remove(this.engine.world, pair.bodyA);
         setTimeout(() => {
           this.fixRotation();
         }, 1000);
       }
     }
     this.reward$.next(1);
     setTimeout(() => {
       if(Matter.Composite.allBodies.length < 26) {
         let newfood = this.createFood();
         this.addToWorld(newfood);
       }
     }, 3000);
   })
  }
  
  public addToWorld(obj: any[]): void {
    for(let i = 0; i < obj.length; i++) {
      World.add(this.engine.world, [obj[i]]);
    }
  }
  
  public getState() {
    let bodies = Matter.Composite.allBodies(this.engine.world);
    let player;
    let food = [];
    bodies.forEach((item, index) => {
      if(item.label === 'player') {
        player = item;
      } else {
        food.push(item);
      }
    });
    
    let vertices = [
      {x: player.position.x + 20 - 100, y: player.position.y + 20 - 100},
      { x: player.position.x + 20 + 100, y: player.position.y + 20 - 100 },
      { x: player.position.x + 20 + 100, y: player.position.y + 20 + 100 },
      { x: player.position.x + 20 - 100, y: player.position.y + 20 + 100 }
    
    ];
    for(let i = 0; i < vertices.length; i++) {
      vertices[i].x = vertices[i].x >= 0 ? vertices[i].x : 0;
      vertices[i].y = vertices[i].y >= 0 ? vertices[i].y : 0;
    }
    
    
    let bounds = Matter.Bounds.create(vertices);
    let visible = Matter.Query.region(food, bounds);
    let gameArea = numjs.zeros([20, 20]);
  
    let rootx = Math.floor(vertices[0].x / 10);
    let rooty = Math.floor(vertices[0].y / 10);
    
    visible.forEach((obj) => {
      let x = Math.floor((obj.position.x + 10) / 10);
      let y = Math.floor((obj.position.y + 10) / 10);

      gameArea.set(y - rooty, x - rootx, 1);
    });
    gameArea.set(9, 9, 1);
    gameArea.set(7, 9, 1);
    gameArea.set(8, 9, 1);
    gameArea.set(10, 9, 1);
    gameArea.set(11, 9, 1);
    gameArea.set(9, 8, 1);
    gameArea.set(9, 7, 1);
    gameArea.set(9, 10, 1);
    gameArea.set(9, 11, 1);
    gameArea.set(7, 7, 1);
    gameArea.set(8, 8, 1);
    gameArea.set(10, 10, 1);
    gameArea.set(11, 11, 1);
    gameArea.set(11, 8, 1);
    gameArea.set(10, 8, 1);
    gameArea.set(7, 8, 1);
    gameArea.set(7, 10, 1);
    gameArea.set(8, 10, 1);
    gameArea.set(8, 7, 1);
    gameArea.set(10, 7, 1);
    gameArea.set(11, 7, 1);
    gameArea.set(11, 10, 1);
    gameArea.set(7, 11, 1);
    gameArea.set(8, 11, 1);
    gameArea.set(10, 11, 1);
    return gameArea;
  }
  
  private fixRotation() {
    Matter.Body.rotate(this.player, -this.player.angle);
  }
  
  public createFood(amount?: number): Bodies[] {
    let food = [];
    let loc;
    let rect;
    let amt = amount > 1 ? amount : 1;
    for(let i = 0; i < amt; i++) {
      loc = this.getRndLocation();
      rect = Bodies.rectangle(loc[0], loc[1], 20, 20, this.foodOptions);
      rect.friction = 0.1;
      rect.frictionAir = 0;
      rect.frictionStatic = 0.5;
      rect.density = 0.001;
      rect.restitution = 0.7;
      food.push(rect);
    }
    return food;
  }
  
  public createPlayer (): Bodies[] {
    let food = [];
    const loc = [580, 380];
    const rect = Bodies.rectangle(loc[0], loc[1], 40, 40, this.playerOptions);
    rect.friction = 0.1;
    rect.frictionAir = 0.005;
    rect.frictionStatic = 0.1;
    rect.density = 0.01;
    rect.restitution = 0.7;
    food.push(rect);
    return food;
  }
  
  private getRndLocation(): number[] {
    
    const x = (Math.random() * 1160) + 20;
    const y = (Math.random() * 760) + 20;
    const loc = [x, y];
    return loc;
  }
  
  public movePlayer(xforce: number = 0, yforce: number = 0) {
    if(this.player.angle !== 0) {
      this.fixRotation();
    }
    const mass = this.player.mass;
    const x = this.player.position.x;
    const y = this.player.position.y;
    const radius = 50;
    const vert = [
      { x: x - radius, y: y - radius },
      { x: x + radius, y: y - radius },
      { x: x + radius, y: y + radius },
      { x: x - radius, y: y + radius }
    ];
    xforce = Math.abs(xforce) > 0.001 ? (0.001 * mass * xforce / Math.abs(xforce)) : (xforce * mass);
    yforce = Math.abs(yforce) > 0.001 ? (0.001 * mass * yforce / Math.abs(yforce)) : (yforce * mass);
    Body.applyForce(this.player, this.player.position, { x: xforce, y: yforce });
  }
  
  
  public static getDistance (x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  }
  
}
