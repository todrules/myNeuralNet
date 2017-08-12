
export class Rate {


    public static FIXED = (baseRate) => {
      return  baseRate;
    }

    public static STEP = (baseRate, iteration, gamma, stepSize) => {
      gamma = gamma || 0.9;
      stepSize = stepSize || 100;

        return baseRate * Math.pow(gamma, Math.floor(iteration / stepSize));


    }

    public static EXP = (baseRate, iteration, gamma) => {
      gamma = gamma || 0.999;

        return baseRate * Math.pow(gamma, iteration);


    }

    public static INV = (baseRate, iteration, gamma, power) => {
      gamma = gamma || 0.001;
      power = power || 2;

      return baseRate * Math.pow(1 + gamma * iteration, -power);

    }

}
