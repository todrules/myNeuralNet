

export class Goal {

  public drive: number;
  public shortTermImportance: number;
  public longTermImportance: number;
  public isParentGoal: boolean;
  public isChildGoal: boolean;
  public relatedGoals: Goal;
  public confidence: number;
  public expertise: number;
  public cost: number;
  public expectedReward: any;
  public actualReward: any;
  public associatedObjects: any | any[];
  public influences;

  constructor() {

  }
}
