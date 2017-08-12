import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SystemModule } from '../system/system.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MouseListener } from '../system/utils/listeners/mouse.listener';
import { KeyboardListener } from '../system/utils/listeners/keyboard.listener';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { ChatterBot } from '../pages/bot/bot';
import { DeepPage } from '../pages/deep/deep';
import { GamePage } from '../pages/game/game';
import { DeepModule } from '../system/deep-q/deep.module';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    GamePage,
    DeepPage,
    ChatterBot
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'chatter_db',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    FlexLayoutModule,
    Ng2GoogleChartsModule,
    DeepModule,
    SystemModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    GamePage,
    DeepPage,
    ChatterBot
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KeyboardListener,
    MouseListener
  ],
  exports: [
    FlexLayoutModule,
    IonicModule,
    Ng2GoogleChartsModule,
    DeepModule
  ]
})
export class AppModule {}
