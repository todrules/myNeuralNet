import { Injectable } from '@angular/core';
import { Drive } from './drive';

@Injectable()
export class Hunger {

  public timestamp;
  public static readonly max = 100000;
  public nourishment: number;
  public static readonly baserate = 0.3;
  
  constructor () {
    this.timestamp = Date.now() / 1000;
    this.nourishment = 50000;
  }
  
  public adjustHungerLevel(activity?: string, calories?: number) {
    const now = Date.now() / 1000;
    const timeelapsed = now - this.timestamp;
    this.timestamp = now;
    let rate = Hunger.baserate;
    let cals = this.nourishment;
    let newcals = 0;
    if(typeof activity === 'string') {
     rate = this.getAdjustedRate(activity);
    }
    if(calories) {
      newcals = calories;
    }
    cals = cals - (timeelapsed * rate) + newcals;
    this.nourishment = cals;
    return this.nourishment;
  }
  
  public getAdjustedRate(act: string) {
    return Hunger.baserate + this.adjustedRate[act];
  }
  
  private adjustedRate = {
    strenuous: 0.1,
    moderate: 0.05,
    rest: -0.03,
    sleeping: -0.1
  };

}
