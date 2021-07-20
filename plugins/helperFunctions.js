/* eslint-disable promise/param-names */
/* eslint-disable valid-typeof */
/* eslint-disable no-new-func */
/* eslint-disable camelcase */

export function timeout({ callback, delay = 0, cancel = () => {} }) {
  const noop = () => {};

  const browserSupportsRaf =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (window.mozRequestAnimationFrame &&
      window.mozCancelRequestAnimationFrame) ||
    // Firefox 5 ships without cancel support
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  const requestTimeoutNoRaf = (fn, delay, registerCancel) => {
    const timeoutId = setTimeout(() => {
      fn();
      clearTimeout(timeoutId);
    }, delay);
    registerCancel(() => clearTimeout(timeoutId));
  };

  const requestTimeoutRaf = (fn, delay, registerCancel) => {
    const start = performance.now();

    const loop = () => {
      const delta = performance.now() - start;

      if (delta >= delay) {
        fn();
        registerCancel(noop);

        nextFrame(() => cancelAnimationFrame(raf));
        return;
      }

      const raf = requestAnimationFrame(loop);
      registerCancel(() => cancelAnimationFrame(raf));
    };

    const raf = requestAnimationFrame(loop);
    registerCancel(() => cancelAnimationFrame(raf));
  };

  const requestTimeout = browserSupportsRaf
    ? requestTimeoutRaf
    : requestTimeoutNoRaf;

  return requestTimeout(callback, delay, cancel);
}

function animationFrame(action) {
  const aF = "AnimationFrame";

  if (action == "request") {
    return (
      window[`${action}${aF}`] ||
      window[`webkitRequest${aF}`] ||
      window[`mozRequest${aF}`] ||
      window[`msRequest${aF}`]
    );
  }
  return (
    window[`${action}${aF}`] ||
    window[`webkitCancel${aF}`] ||
    window[`mozCancel${aF}`] ||
    window[`msCancel${aF}`]
  );
}

export const expandSeconds = (val) => {
  let rawMin = val / 60;
  let rawSec = /\./.test(`${rawMin}`)
    ? parseFloat(`${rawMin}`.replace(/^\d+\./, "0.")) * 60
    : "00";
  const $min = rawMin.toString().replace(/\.\d+/, "");
  let hr = "";
  let day = "";

  rawSec = rawSec.toString().replace(/\.\d+/, "");

  if (rawSec.length < 2) {
    rawSec = `0${rawSec}`;
  }

  if (rawSec == "60") {
    rawSec = "00";
    rawMin = parseFloat($min) + 1;
  }

  let returnValue = `${$min} : ${rawSec}`;

  if (parseFloat($min) >= 60) {
    hr = Math.floor(parseFloat($min) / 60);

    rawMin = `${parseFloat($min) - 60 * hr}`;

    returnValue = `${hr} : ${rawMin} : ${rawSec}`;
  }

  if (hr >= 24) {
    day = Math.floor(hr / 24);

    hr = hr - 24 * day;

    returnValue = `${day} : ${hr} : ${rawMin} : ${rawSec}`;
  }
  return returnValue;
};

export const rAF = animationFrame("request");
export const cAF = animationFrame("cancel");

export const trim = (x) => x.toLowerCase().trim();
export const isHTML = (x) => x instanceof HTMLElement;

export function loop(callback, loop) {
  const $loop = loop;

  for (let i = 0; i < $loop; i++) {
    callback(i);
  }
}

export function range({ start, stop, step = 1 }) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}

export function randomValue(array) {
  if (Array.isArray(array)) {
    return array[Math.floor(Math.random() * (array.length - 1))];
  }
  return null;
}

export function arrayFromCenter(array) {
  if (Array.isArray(array) && array.length) {
    const output = [];
    const arrayLength = array.length;
    const halfLength = arrayLength / 2;
    const round_halfLength = Math.floor(halfLength);
    const organize = (step) => {
      let count = 1;
      for (let i = step; i < arrayLength; i++) {
        if (i % 2 > 0) {
          output[i] = array[round_halfLength - count];
        } else {
          output[i] = array[round_halfLength + count];
          count++;
        }
      }
    };

    if (arrayLength % 2 > 0) {
      output[0] = array[round_halfLength];
      organize(1);
    } else {
      output[0] = array[halfLength - 1];
      output[1] = array[halfLength];

      organize(2);
    }
    return output;
  }
  return [];
}

// export function windowSize(val) {
//   return (
//     window[`inner${capitalize(val)}`] -
//     (window[`inner${capitalize(val)}`] -
//       document.documentElement[`client${capitalize(val)}`])
//   );
// }

export function parser({ input, type, bind = null }) {
  const $ = new Function(
    `try{return ${input}}catch(e){if(e)throw new Error('invalid input')}`
  );
  const hasType = type && typeof type == "string" && type.length;
  const output = $.call(bind);
  const returnValue = !hasType
    ? output
    : type == "array"
    ? Array.isArray(output)
      ? output
      : undefined
    : type == "object"
    ? !Array.isArray(output) && typeof output == "object"
      ? output
      : undefined
    : typeof output == type
    ? output
    : undefined;
  return returnValue;
}

export class Debounce {
  constructor({ callback = () => {}, delay = 0 }) {
    this.callback = callback;
    this.delay = delay;
    this.timeout = null;
  }

  get Delay() {
    if (typeof this.delay == "function") {
      return this.delay();
    }
    return this.delay;
  }

  init() {
    this.timeout && window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.callback();
    }, this.Delay);
  }

  kill() {
    this.timeout = null;
  }
}

export const nextFrame = (callback, timeout) => {
  return timeout ? setTimeout(() => rAF(callback), timeout) : rAF(callback);
};

export function kebabCase(val) {
  if (typeof val == "string") {
    return val
      .replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)
      .replace(/-+/g, "-")
      .replace(/^-*/, "");
  }
  return val;
}

export function $nextTick(callback) {
  const isFunction = typeof callback == "function";
  !isFunction && console.warn("$nextTick value is not a function", callback);
  return (
    isFunction &&
    (window.queueMicrotask
      ? window.queueMicrotask(callback)
      : requestAnimationFrame(callback))
  );
}

// get object path. Returns the last valid object path
export function getObjectPath({ obj, path }) {
  if (!path) {
    path = "";
  }
  let hit_undefined = false;
  let output = obj;
  const arr = path.split(".").filter((x) => x.length);

  arr.forEach((x) => {
    if (!hit_undefined) {
      const $path = x.trim().replace(/(\(.*\))$/, "");
      const args = parser({
        input: x.match(/(\(.*\))/g)?.[0],
      });

      if (output && typeof output[$path] != "undefined") {
        output = /(\(.*\))$/.test(x) ? output[$path](args) : output[$path];
      } else {
        hit_undefined = true;
      }
    }
  });
  return output;
}

export function camelCase(val) {
  if (typeof val == "string") {
    return val.replace(/-./g, (x) => x.toUpperCase()[1]);
  }
  return val;
}

// export function isIntersecting(el) {
//   if (!isHTML(el)) {
//     return false;
//   }
//   const bound = () => el.getBoundingClientRect();
//   const intersecting =
//     bound().width > 0 &&
//     bound().height > 0 &&
//     bound().top >= 0 &&
//     bound().top <= windowSize("height") &&
//     bound().left >= 0 &&
//     bound().left <= windowSize("width");

//   return intersecting;
// }

export function zIndex(not, numb, notElement, This) {
  This.$c4.componentZIndex.push(This);
  This.$c4.componentZIndex = [...new Set(This.$c4.componentZIndex)];

  const lengthTimes100 = 100 * This.$c4.componentZIndex.length;

  return 1099 + This.$c4.componentZIndex.length + lengthTimes100;
}

export function convertSeconds(val, fallback) {
  if (isNaN(parseFloat(val)) || val === Infinity) {
    return fallback || 0;
  }
  if (typeof val === "number") {
    return Math.abs(val);
  }
  if (typeof val === "string") {
    const seconds = /\d\s*s\s*$/.test(val);
    if (seconds) {
      return Math.abs(parseFloat(val) * 1000);
    }
    return Math.abs(parseFloat(val));
  }
}

export function isMobile(val) {
  if (
    /Android|webOs|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    val = true;
    return val;
  } else {
    val = false;
  }
  return val;
}

export function eventKey(e) {
  let key = "";
  const spaceBar = /^space$/i.test(e.code) || e.keyCode === 32;
  const enterKey = /^enter$/i.test(e.code) || e.keyCode === 13;
  const esc = /^escape$/i.test(e.code) || e.keyCode === 27;
  const tab = /^tab$/i.test(e.code) || e.keyCode === 9;
  const arrowUp = /^arrowup$/i.test(e.code) || e.keyCode === 38;
  const arrowRight = /^arrowright$/i.test(e.code) || e.keyCode === 39;
  const arrowDown = /^arrowdown$/i.test(e.code) || e.keyCode === 40;
  const arrowLeft = /^arrowleft$/i.test(e.code) || e.keyCode === 37;
  const slash = /^slash/i.test(e.code) || e.key == "/" || e.keyCode == 191;
  const backspace =
    /^backspace/i.test(e.code) || e.keyCode == 8 || /^backspace/i.test(e.key);
  const Delete =
    /^delete/i.test(e.code) || e.keyCode == 46 || /^delete/i.test(e.key);

  if (backspace) {
    key = "backkey";
    return key;
  }

  if (Delete) {
    key = "delete";
    return key;
  }

  if (arrowUp) {
    key = "arrow_up";
    return key;
  }
  if (arrowLeft) {
    key = "arrow_left";
    return key;
  }
  if (arrowDown) {
    key = "arrow_down";
    return key;
  }
  if (arrowRight) {
    key = "arrow_right";
    return key;
  }
  if (spaceBar) {
    key = "spacebar";
    return key;
  }
  if (enterKey) {
    key = "enter";
    return key;
  }
  if (esc) {
    key = "esc";
    return key;
  }
  if (tab) {
    key = "tab";
    return key;
  }
  if (slash) {
    key = "slash";
    return key;
  }
  return key;
}

export class ArrowNavigate {
  constructor({ root, children, loop = true, preventScroll = false, closest }) {
    this.root = root;
    this.$children = this.root.querySelectorAll(`${children}`);
    this.loop = loop;
    this.preventScroll = preventScroll;
    this.closest = closest || children;

    this.focusableNodes =
      this.$children &&
      [...this.$children].filter((x) => {
        const validFocusable =
          isHTML(x) &&
          x.tabIndex > -1 &&
          x.getAttribute("tabindex") > -1 &&
          !x.getAttribute("disabled") &&
          x.offsetHeight;
        return validFocusable
          ? this.closest
            ? x.closest(this.closest)
            : x
          : false;
      });
    this.index =
      this.focusableNodes?.length &&
      this.focusableNodes.indexOf(
        this.focusableNodes.find((x) =>
          x.isSameNode(x.ownerDocument.activeElement)
        )
      );
  }

  forward(count = 0) {
    if (!this.focusableNodes.length) {
      return;
    }
    const getIndex =
      this.index + 1 + count > this.focusableNodes.length - 1
        ? this.loop
          ? 0
          : this.focusableNodes.length - 1
        : this.index + 1 + count;

    this.focusableNodes[getIndex].focus({ preventScroll: this.preventScroll });
  }

  backward(count = 0) {
    if (!this.focusableNodes.length) {
      return;
    }

    const getIndex =
      this.index - 1 - count < 0
        ? this.loop
          ? this.focusableNodes.length - 1
          : 0
        : this.index - 1 - count;

    this.focusableNodes[getIndex].focus({ preventScroll: this.preventScroll });
  }
}

export class HapticFeedback {
  constructor({ callback = () => {}, delay = 550 }) {
    this.touchDown = false;
    this.touchDuration = 0;
    this.runCalculation = this.startCalculation.bind(this);
    this.callback = callback;
    this.callbackCalled = 0;
    this.delay = delay;
  }

  startCalculation(e) {
    let start = 0;
    if (e.type == "touchstart") {
      start = e.timeStamp;
    }
    const callback = (x) => {
      this.touchDuration = x - start;

      if (this.touchDuration >= this.delay) {
        this.touchDown = false;
        this.touchDuration = "haptic feedback";
        e.preventDefault();
        if (!this.callbackCalled) {
          this.callback(e);
        }
        this.callbackCalled++;
        return;
      }

      if (this.touchDown) {
        requestAnimationFrame(callback);
      }
    };
    requestAnimationFrame(callback);
  }

  touchstart(e) {
    this.callbackCalled = 0;
    this.touchDown = true;
    this.touchDuration = 0;
    this.runCalculation(e);
  }

  touchmove() {
    this.touchDown = false;
  }

  touchcancel(e) {
    this.touchDown = false;
    if (this.touchDuration == "haptic feedback") {
      e.preventDefault();
      if (!this.callbackCalled) {
        this.callback(e);
      }
      this.callbackCalled++;
    }
    this.touchDown = false;
  }

  touchend(e) {
    this.touchcancel(e);
  }
}

export function getOrigin({ config, defaults, input, centered = false }) {
  /*
        this function returns an object based on its dynamic config.
        config is an object that has the same values as the defaults object,
        what it basically does is to check that each value in defaults is a match in config.
        E.g config = {x: ['top','left','center']}, 
            defaults = {x: 'top'} --okay.
            defaults = {x:'bottom'} --wrong.
        The config is also usefull when the input has been splitted up and we want to determine where 
        each value of the string should fit.
        E.g config = {x: ['left', 'right'], y: ['top', 'bottom']}
        input = 'left top'. Automatically, left = x, top = y. If clashing values are set, 
        input = 'left left', output will be x: 'left', y: 'left'.
        typescript will probably handle this efficiently.
    */

  const getObjectKeys = (obj) => Object.keys(obj);
  const isValid =
    typeof config == "object" &&
    typeof input == "string" &&
    typeof defaults == "object" &&
    defaults[getObjectKeys(config)[0]] &&
    defaults[getObjectKeys(config)[1]];

  if (!isValid) {
    return {};
  }

  const output = { ...defaults };
  const $input = String(input.trim().toLowerCase());
  const isCentered =
    centered && ($input == "centered" || /^center\s+center$/.test($input));

  if (isCentered) {
    for (const key in output) {
      output[key] = "center";
    }
    return output;
  }

  const splitValues = $input.split(" ").filter((x) => x.length);
  const matchValues = (val) => {
    // returns the keys of the config object that can accept 'val'
    const returnValue = [];
    for (const key in config) {
      config[key].includes(val) && returnValue.push(key);
    }
    return returnValue;
  };
  const validValues = () => {
    const validLength = /1|2/.test(`${splitValues.length}`);
    let valuesMatched = [];
    const regExpMatcher = (val) => {
      // returns a Boolean array. an array of RegExp that matches.
      const $value = matchValues(val);
      const returnValue = [];
      if (!$value.length) return;
      $value.forEach((x) => {
        let string_to_match = "";
        config[x].forEach((x) => (string_to_match += `^${x}$|`));
        string_to_match.replace(/\|$/, "");
        returnValue.push(new RegExp(string_to_match).test(val));
      });
      return !returnValue.includes(false);
    };

    splitValues.forEach((x) => valuesMatched.push(regExpMatcher(x)));

    valuesMatched = valuesMatched.filter(Boolean);

    const returnValue =
      valuesMatched.length == splitValues.length &&
      splitValues[0] != splitValues[1] &&
      !valuesMatched.includes(false) &&
      validLength;

    return returnValue;
  };

  if (!validValues()) {
    return output;
  }

  splitValues.forEach((x) =>
    matchValues(x).forEach((item) => (output[item] = x))
  );

  return output;
}

export const getStackedImages = (tracks, size, stacked) => {
  let images = [...new Set(tracks.map((x) => x?.img?.[size || "md"]))].filter(
    (item, index) => index < 4 && item
  );

  if (stacked) {
    images = tracks
      .map((x) => x?.img?.[size || "md"])
      .filter((item, index) => index < 3 && item);
    return images;
  }

  if (images.length == 1) {
    return images;
  } else if (images.length == 2) {
    images[2] = images[1];
    images[3] = images[0];
    return images;
  } else if (images.length == 3) {
    images[3] = images[0];
    return images;
  }
  return images;
};

export function warn({ message }) {
  if (process.env.NODE_ENV == "development") {
    const getPrefix = () => (/ui-\w+\s*/g.test(message) ? "component-" : "");
    throw new Error(
      `[Fend-ui ${getPrefix()}warn]:\n${message
        .replace(/^\s*\w/, (x) => x.toUpperCase())
        .replace(/\n\w/g, (x) => `${x.toUpperCase([1])}`)
        .replace(/\n/g, ".\n")
        .replace(/\s*$/, ".")
        .replace(/component\s+component/g, "component")
        .replace(/\.\./, ".")}`
    );
  }
}

export function removeNode(node) {
  if ("remove" in node) {
    return node && node.remove();
  } else {
    node && node.parentElement && node.parentElement.removeChild(node);
  }
}
