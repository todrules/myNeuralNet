import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicApp } from 'ionic-angular';
import { Cognition } from './intellect/cognition';
import { UIGraphics } from './ui.graphics';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Hunger } from './structural/drives/hunger';
import { Contentment } from './structural/drives/contentment';
import { Fatigue } from './structural/drives/fatigue';
import { Pleasure } from './structural/drives/pleasure';
import { Pain } from './structural/drives/pain';
import { Arousal } from './structural/drives/arousal';
import { Rules } from './structural/rules';
import { ShortTermMemory } from './intellect/stm';
import { Sensory } from './intellect/sensory';
import { GUI } from './gui/gui';
import { GenerateResponse } from './intellect/generate-response';
import { DeepModule } from './deep-q/deep.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FlexLayoutModule,
    Ng2GoogleChartsModule,
    DeepModule
  ],
  declarations: [
    UIGraphics,
    GUI
  ],
  providers: [
    Hunger,
    Arousal,
    Pain,
    Pleasure,
    Fatigue,
    Contentment,
    Rules,
    Cognition,
    ShortTermMemory,
    Sensory,
    GenerateResponse

  ],
  exports: [
    CommonModule,
    UIGraphics,
    IonicModule,
    Ng2GoogleChartsModule,
    GUI,
    DeepModule
  ],
  entryComponents: [
    GUI
  ]
})
export class SystemModule { }
