import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicApp } from 'ionic-angular';
import { DeepQ } from './deep-q';
import { UIService } from './ui.service';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    DeepQ
  ],
  providers: [
    UIService
  ],
  entryComponents: [
    DeepQ
  ],
  exports: [
    CommonModule,
    DeepQ
  ]
})
export class DeepModule { }
