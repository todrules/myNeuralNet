export const hungerChartData: any = {
  chartType: 'Line',
  dataTable: [
    ['Time', 'Hunger', 'Fatigue', 'Wellness', 'Arousal', 'Contentment' ],
    [0, 1, 1, 1, 1, 1],

  ],
  options: {
    animation: { easing: 'out' },
    width: 500, height: 400,
    curveType: 'function',
    title: 'Live Stats',
    series: {
      o: {axis: 'Hunger', color: '#53A2BE'},
      1: {axis: 'Fatigue', color: '#9BC53D'}
    },
    backgroundColor: '#BFC0C0'
  }
};

export interface KeyboardMap {
  [index: number]: string;
}

export const FOOD_AMOUNT = 50;
export const VISIBILITY = 150;
export const UNKNOWN = 'UNKNOWN';
export const VARIES = 'VARIES';
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export const TRAINING_DATA = [
  { inputValues: [0, 0], targetValues: [0] },
  { inputValues: [0, 1], targetValues: [1] },
  { inputValues: [1, 0], targetValues: [1] },
  { inputValues: [1, 1], targetValues: [0] }
];

export const QLEARNING_CONFIG = {
  CYCLE_MAX_STEPS: 200,
  TOTAL_MAX_STEPS: 150000,
  MAX_SIZE_EXP_REPLAY: 150000,
  BATCH_SIZE: 32,
  TARGET_UPDATE: 500,
  REWARD_SCALING: 0.01,
  GAMMA: 0.99,
  TERROR_CLIP: 1,
  MIN_EPSILON: 0.1,
  GREEDY_STEPS: 1000
};

export const DIRECTIONS = {
  NORTH: [0, -1],
  SOUTH: [0, 1],
  WEST: [-1, 0],
  EAST: [1, 0],
  NE: [1, -1],
  SE: [1, 1],
  SW: [-1, 1],
  NW: [-1, -1],
  STOP: [0, 0]

};

export const KEYBOARD_KEYS: KeyboardMap = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  19: 'pause/break',
  20: 'caps lock',
  27: 'escape',
  32: 'space',
  33: 'page up',
  34: 'page down',
  35: 'end',
  36: 'home',
  37: 'left arrow',
  38: 'up arrow',
  39: 'right arrow',
  40: 'down arrow',
  45: 'insert',
  46: 'delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'left window key',
  92: 'right window key',
  93: 'select',
  96: 'numpad 0',
  97: 'numpad 1',
  98: 'numpad 2',
  99: 'numpad 3',
  100: 'numpad 4',
  101: 'numpad 5',
  102: 'numpad 6',
  103: 'numpad 7',
  104: 'numpad 8',
  105: 'numpad 9',
  106: 'multiply',
  107: 'add',
  109: 'subtract',
  110: 'decimal point',
  111: 'divide',
  112: 'f1',
  113: 'f2',
  114: 'f3',
  115: 'f4',
  116: 'f5',
  117: 'f6',
  118: 'f7',
  119: 'f8',
  120: 'f9',
  121: 'f10',
  122: 'f11',
  123: 'f12',
  144: 'numlock',
  145: 'scroll lock',
  186: 'semi-colon',
  187: 'equals',
  188: 'comma',
  189: 'dash',
  190: 'period',
  191: 'forward slash',
  192: 'grave accent',
  219: 'open bracket',
  220: 'back slash',
  221: 'close braket',
  222: 'single quote'
};


