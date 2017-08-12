

export function sigmoid(x) {
  return 1.0 / (1 + Math.exp(-x));
}

// syntactic sugar function for getting default parameter values

export function getopt (opt, field_name, default_value): any {
  if (typeof opt === 'undefined') { return default_value; }
  return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
}

export function setConst (arr: Array<any>, c): Array<any> {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = c;
  }
  return arr;
}

export function sampleWeighted (p): number {
  const r = Math.random();
  let c = 0.0;
  for (let i = 0; i < p.length; i++) {
    c += p[i];
    if (c >= r) { return i; }
  }
  assert(false, 'wtf');
}

export function assert (condition, message?) {
  if (!condition) {
    message = message || 'Assertion failed';
    if (typeof Error !== 'undefined') {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}

export function zeros (n): Float64Array | Array<any> {
  if (typeof(n) === 'undefined' || isNaN(n)) { return []; }
  if (typeof ArrayBuffer === 'undefined') {
    // lacking browser support
    const arr = new Array(n);
    for (let i = 0; i < n; i++) { arr[i] = 0; }
    return arr;
  } else {
    return new Float64Array(n);
  }
}

