import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicApp } from 'ionic-angular';
import { DeepQ } from './deep-q';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    DeepQ
  ],
  providers: [

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
