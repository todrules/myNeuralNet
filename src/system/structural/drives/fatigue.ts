import { Injectable } from '@angular/core';
import { Drive } from './drive';
import { Hunger } from './hunger';

@Injectable()
export class Fatigue {

  public timeawake = Date.now() / 1000;
  public fatigue = 0;
  public static readonly baserate = 0.035;
  
  private hungerService: Hunger;
  
  constructor (private hunger: Hunger) {
    this.hungerService = hunger;
  }
  
  public adjustFatigue (sleep?: number) {
    const now = Date.now() / 1000;
    const timeelapsed = now - this.timeawake;
    
    let rate = Fatigue.baserate;
    let nourishment = this.getNourishment();
    let rest = 0;
    if (sleep) {
      rest = Fatigue.baserate * sleep;
    }
    
    this.fatigue = ((timeelapsed * (Fatigue.baserate + nourishment + (timeelapsed / 1000)))/ 100) - rest;
    return this.fatigue;
  }
  
  public getNourishment () {
    return (50000 - this.hungerService.nourishment) / 1000000;
  }

}
