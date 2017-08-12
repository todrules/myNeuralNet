import { Injectable } from '@angular/core';
import { Drive } from '../structural/drives/drive';
import { ShortTermMemory } from './stm';
import { Experience, Document, AnnotateTextRequest, DocumentType, EncodingType } from '../utils/models';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GenerateResponse } from './generate-response';


@Injectable()
export class Cognition {

  private queue = [];
  private currentFrame;
  private previousFrame;

  public state;
  public prevState;
  public prevStates = [];
  public actualReward;
  
  public arousal = Math.random();
  public contentment = Math.random();
  public hunger = Math.random();
  public fatigue = Math.random();
  public wellness = Math.random();
  public pain = Math.random();
  public pleasure = Math.random();
  private hungerWt = this.getWeight();
  private arousalWt = this.getWeight();
  private contentWt = this.getWeight();
  private fatigueWt = this.getWeight();
  private wellnessWt = this.getWeight();
  private painWt = this.getWeight();
  private pleasureWt = this.getWeight();
  public actHunger = 0;
  public actFatigue = 0;
  public actArousal = 0;
  public actWellness = 0;
  public actContent = 0;
  public actPain = 0;
  public actPleasure = 0;
  
  public fight = 0;
  public flight = 0;

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
    uiState: null

  };
  public outputs = [];
  public randomOutputs = [];
  public lockedCycleCount = 0;
  private stm: ShortTermMemory;
  public numCycles = 0;

  private http: Http;
  private genResponse: GenerateResponse;
  
  constructor(private aHttp: Http, private generateResponse: GenerateResponse) {
    this.http = aHttp;
    this.genResponse = generateResponse;
  }
  
  public sigmoid (x) {
    return 1.0 / (1 + Math.exp(-x));
  }

  public nextState(stimulus?: any) {
    if(stimulus) {
      this.assessInput(stimulus);
    }
    this.getUpdates();
    this.getActivations();
  }
  
  private assessInput(stimulus: string) {
    if(typeof stimulus === 'string') {
      const request: AnnotateTextRequest = {
        document: {
          content: stimulus,
          type: DocumentType.PLAIN_TEXT
        },
        features: {
          extractSyntax: true,
          extractEntities: true,
          extractDocumentSentiment: true,
          extractEntitySentiment: true,
        },
        encodingType: EncodingType.NONE
      };
      
      this.http.post('https://language.googleapis.com/v1beta2/documents:annotateText?key=AIzaSyASeMJAOsuaOlTDhVAKQC7oTTz7bUZEhNQ',
        request ).subscribe((results) => {
        const data = results.json();
        this.genResponse.getReply(data);
        console.log(data.sentences);
        console.log(data.tokens);
        console.log(data.entities);
        console.log(data.documentSentiment);
      });
      
    }
    
  }
  
  private getActivations() {
    this.actHunger = this.sigmoid(Math.log(this.hunger));
    this.actArousal = this.sigmoid(Math.log(this.arousal));
    this.actFatigue = this.sigmoid(Math.log(this.fatigue));
    this.actContent = this.sigmoid(Math.log(this.contentment));
    this.actWellness = this.sigmoid(Math.log(this.wellness));
  }
  
  selectAction() {
  
  }
  
  
  private getWeight() {
    return (Math.random() * 3) + 1;
  }
  
  public getUpdates() {
    this.numCycles++;
    this.hunger += Math.exp(-this.hungerWt) /(this.hunger + this.hungerWt);
    this.fatigue += Math.exp(-this.fatigueWt) / (this.fatigue + this.fatigueWt);
    this.wellness += Math.exp(-this.wellnessWt) / (this.wellness + this.wellnessWt);
    this.arousal += Math.exp(-this.arousalWt) / (this.arousal + this.arousalWt);
    const avg = (this.hunger + this.fatigue + this.wellness + this.arousal) / 4;
    this.contentment = avg;
    
  }
  
  public getStats() {
    return {
      hunger: this.hunger,
      fatigue: this.fatigue,
      wellness: this.wellness,
      arousal: this.arousal,
      contentment: this.contentment,
      hungerAct: this.actHunger,
      fatigueAct: this.actFatigue,
      wellnessAct: this.actWellness,
      contentAct: this.actContent,
      arousalAct: this.actArousal
    }
  }
 

}
