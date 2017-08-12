import { Entity } from '../network/models';
import { UNKNOWN, VARIES } from '../utils/config';

export class Food implements Entity {

  public name = 'food';
  public color;
  public x;
  public y;
  public width;
  public height;
  public alpha;
  public id;
  public meta = {
    category: 'food',
    structure: {
      colors: ['green'],
      weight: UNKNOWN,
      material: ['organic', 'organic matter', 'plants', 'animals'],
      size: VARIES,
      shape: VARIES,
      isAbstract: false,
      isPlant: true,
      isAnimal: true,
      isFabricated: false
    }
  };

  constructor (x, y) {
    this.setColor();

    const size = Food.getSize();
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.id = Math.floor((Math.random() * 899999) + 100000);
  }

  public setColor () {
    this.alpha = (Math.random() * 0.5) + 0.5;
    this.color = `rgba(156, 236, 91, ${this.alpha - 0.2})`;
  }

  public static getSize () {
    return Math.floor((Math.random() * 10) + 10);
  }

}

