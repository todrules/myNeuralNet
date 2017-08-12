import { HostListener, Injectable } from '@angular/core';

@Injectable()
export class MouseListener {

  public mousedown = [];

  @HostListener('window:mousedown', ['$event'])
  mouseDown (event: MouseEvent) {
    const e = {
      target: event.target,
      xcoord: event.clientX,
      ycoord: event.clientY
    }
    this.mousedown.push(e);

  }

  @HostListener('window:mouseup', ['$event'])
  mouseup (event: MouseEvent) {
    this.mousedown = null;
   // console.log(event.target);
  }

  constructor() {

  }
}
