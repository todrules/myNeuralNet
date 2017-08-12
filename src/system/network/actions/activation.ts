

export class Activation {

    public static LOGISTIC(x, derivate) {

      let fx = 1 / (1 + Math.exp(-x));
      if (!derivate) { return fx; }
      return fx * (1 - fx);
    }

  public static TANH(x, derivate) {
      if (derivate) { return 1 - Math.pow(Math.tanh(x), 2); }
      return Math.tanh(x);
    }

  public static IDENTITY(x, derivate) {
      return derivate ? 1 : x;
    }

  public static STEP(x, derivate) {
      return derivate ? 0 : x > 0 ? 1 : 0;
    }

  public static RELU(x, derivate) {
      if (derivate) { return x > 0 ? 1 : 0; }
      return x > 0 ? x : 0;
    }

  public static SOFTSIGN(x, derivate) {
      let d = 1 + Math.abs(x);
      if (derivate) { return x / Math.pow(d, 2); }
      return x / d;
    }

  public static SINUSOID(x, derivate) {
      if (derivate) { return Math.cos(x); }
      return Math.sin(x);
    }

  public static GAUSSIAN(x, derivate) {
      let d = Math.exp(-Math.pow(x, 2));
      if (derivate) { return -2 * x * d; }
      return d;
    }

  public static BENT_IDENTITY(x, derivate) {
      let d = Math.sqrt(Math.pow(x, 2) + 1);
      if (derivate) { return x / (2 * d) + 1; }
      return (d - 1) / 2 + x;
    }

  public static BIPOLAR(x, derivate) {
      return derivate ? 0 : x > 0 ? 1 : -1;
    }

  public static BIPOLAR_SIGMOID(x, derivate) {
      let d = 2 / (1 + Math.exp(-x)) - 1;
      if (derivate) { return 1 / 2 * (1 + d) * (1 - d); }
      return d;
    }

  public static HARD_TANH(x, derivate) {
      if (derivate) { return x > -1 && x < 1 ? 1 : 0; }
      return Math.max(-1, Math.min(1, x));
    }

  public static ABSOLUTE(x, derivate) {
      if (derivate) { return x < 0 ? -1 : 1; }
      return Math.abs(x);
    }

  public static INVERSE(x, derivate) {
      if (derivate) { return -1; }
      return 1 - x;
    }
    // https://arxiv.org/pdf/1706.02515.pdf
  public static SELU(x, derivate) {
      let alpha = 1.6732632423543772848170429916717;
      let scale = 1.0507009873554804934193349852946;
      let fx = x > 0 ? x : alpha * Math.exp(x) - alpha;
      if (derivate) { return x > 0 ? scale : (fx + alpha) * scale; }
      return fx * scale;
    }

}
