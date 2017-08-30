import { Component } from '@angular/core';
import { ChatterBot } from '../bot/bot';
import { GUI } from '../../system/gui/gui';
import { DeepPage } from '../deep/deep';
import { GamePage } from '../game/game';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatterBot;
  tab2Root = DeepPage;
  tab3Root = GamePage;

  constructor() {

  }
}
