import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;

import { Injectable } from '@angular/core';
import { Experience, UIState } from '../utils/models';
import { Cognition } from './cognition';


@Injectable()
export class Sensory {

  public currentExp: Experience = {
    inputs: null,
    isNewExperience: true,
    relatedGoals: null,
    confidence: 0,
    exertion: 0,
    influence: 0,
    expertise: 0,
    stressFactor: 0,
    expectedReward: 0,
    primaryEntity: null,
    otherEntities: null,
    uiState: null
  };
  public entities = [];
  public state: UIState;
  public normalizedInput = [];
  private cog: Cognition;
  constructor(private cognition: Cognition) {
    this.cog = cognition;
  }


}
