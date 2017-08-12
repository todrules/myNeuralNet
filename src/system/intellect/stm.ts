

import { Injectable } from '@angular/core';
import { Experience } from '../utils/models';

@Injectable()
export class ShortTermMemory {

  private stmCache = [];
  private num = 0;
  constructor() {

  }

  public add() {

  }

  public addAndLocate(exp: Experience) {
    this.stmCache.push(exp);
    this.num++;
    return false;
  }
}
