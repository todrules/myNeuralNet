

import { HostListener, Injectable } from '@angular/core';
import { KEYBOARD_KEYS } from '../config';

@Injectable()
export class KeyboardListener {

  public keysdown = [];

  @HostListener('window:keydown', ['$event'])
  keyboardDown (event: KeyboardEvent) {

    const type = this.getKeyType(event.keyCode);
    this.keysdown.push(type);
    console.log(type);
  }

  @HostListener('window:keyup', ['$event'])
  keyboardUp (event: KeyboardEvent) {
   // delete this.keysDown[event.keyCode];
  }

  constructor() {

  }

  private getKeyType(keycode) {
    return KEYBOARD_KEYS[keycode];
  }
}
