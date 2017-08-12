import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: './app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  private storage: Storage;
  
  constructor (private platform: Platform,
               private statusBar: StatusBar,
               private splashScreen: SplashScreen,
               private aStorage: Storage) {
    
    this.storage = aStorage;

  }

  ionViewDidLoad () {
    this.platform.ready().then((readySource) => {

      if (readySource === 'cordova') {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      
      this.storage.set('init_time', Date.now());
    });
  }
}
