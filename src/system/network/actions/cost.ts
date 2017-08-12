


export class Cost {

  constructor() {

  }

  // Cross entropy error
  public static CROSS_ENTROPY(target, output) {
    let error = 0;
    for (let i = 0; i < output.length; i++) {
      // Avoid negative and zero numbers, use 1e-15 http://bit.ly/2p5W29A
      error -= target[i] * Math.log(Math.max(output[i], 1e-15)) + (1 - target[i]) * Math.log(1 - Math.max(output[i], 1e-15));
    }
    return error;
  }

  // Mean Squared Error
  public static MSE = function (targetValues: number, outputValues: number[]): number {
    let loss = 0;
    for (let i = 0; i < outputValues.length; i++) {
      loss += Math.pow(targetValues[i] - outputValues[i], 2);
    }

    return loss / outputValues.length;
  };

  // Binary error
  public static BINARY(target, output) {
    let misses = 0;
    for (let i = 0; i < output.length; i++) {
      if(Math.round(target[i] * 2) !== Math.round(output[i] * 2)) {
        misses++;
      }
    }

    return misses;
  }

  // Mean Absolute Error
  public static MAE(target, output) {
    let error = 0;
    for (let i = 0; i < output.length; i++) {
      error += Math.abs(target[i] - output[i]);
    }

    return error / output.length;
  }

  // Mean Absolute Percentage Error
  public static MAPE(target, output) {
    let error = 0;
    for (let i = 0; i < output.length; i++) {
      error += Math.abs((output[i] - target[i]) / Math.max(target[i], 1e-15));
    }

    return error / output.length;
  }

  // Mean Squared Logarithmic Error
  public static MSLE(target, output) {
    let error = 0;
    for (let i = 0; i < output.length; i++) {
      error += Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
    }

    return error;
  }

  // Hinge loss, for classifiers
  public static HINGE(target, output) {
    let error = 0;
    for (let i = 0; i < output.length; i++) {
      error += Math.max(0, 1 - target[i] * output[i]);
    }

    return error;
  }
}
