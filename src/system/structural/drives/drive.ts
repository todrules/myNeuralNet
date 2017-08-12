import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;

export abstract class Drive {

  public outvalues: number[] | number[][] | Matrix;
  public weights: number[] | number[][] | Matrix;
  public influence;
  public competitiveness;
  public efficiency;
  public stressInput;

  constructor () {

  }

  public init(outputsize: number) {
    this.outvalues = mathjs.zeros(outputsize);
    this.weights = mathjs.ones(outputsize);
    let newvals = mathjs.map(this.weights, (val) => {
      return Math.random() * 2 - 1;
    })
    this.weights = newvals;

  }

  public step (
    amount: number, isIncrease?: boolean): number[] | number[][] | Matrix {

    return isIncrease ? this.increaseWeight(amount) : this.decreaseWeight(amount);
  }

  public getOutput (): number[] | number[][] | Matrix {

    return this.outvalues;
  }

  public getWeights (): number[] | number[][] | Matrix {
    return this.weights;
  }

  public increaseWeight (
    amt: number): number[] | number[][] | Matrix {

    const diff = Math.exp(amt) / 4.3;
    mathjs.add(this.weights, diff);
    return this.weights;
  }

  public decreaseWeight (
    amt: number): number[] | number[][] | Matrix {

    const diff = Math.exp(amt);
    mathjs.subtract(this.weights, diff);
    return this.weights;
  }

  public static softmax (
    arr: number[] | number[][] | Matrix): number[] {

    return mathjs.divide(mathjs.exp(arr), mathjs.sum(mathjs.exp(arr))) as number[];
  }

}
