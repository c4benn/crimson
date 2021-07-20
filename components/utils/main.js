/* eslint-disable promise/param-names */
/* eslint-disable camelcase */
/* eslint-disable valid-typeof */
/* eslint-disable no-new-func */

const setFunctionResults = (fn) => {
  if (!fn.results) {
    fn.results = {};
  }
};

export const lorem =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem commodi velit facere ad sequi nulla maiores doloribus illum libero, repellat.";

export function promiser(val = true) {
  return new Promise((r) => r(val));
}

export const uiMount = {
  computed: {
    selfMounted() {
      let mounted = true;

      const pageTransitionState = this.$store.state.pageTransitionState;

      this.renderedComponents.forEach((x) => {
        if (mounted) {
          mounted = this.$fetched.components.includes(x);
        }
      });

      mounted = /afterE|beforeL|lea|^$/i.test(pageTransitionState);

      return mounted;
    },

    loadedChunks() {
      return (this?.renderedComponents || []).filter((x) =>
        this.$fetched.components.includes(x)
      );
    },

    loadingProgress() {
      const loadedChunksLength = this.loadedChunks.length;
      const renderedComponentsLength = this.renderedComponents.length;

      return (100 / renderedComponentsLength) * loadedChunksLength;
    },
  },

  watch: {
    selfMounted(n) {
      if (n) {
        this.mountSelf();
      }
    },
    // loadingProgress(n) {
    //   console.log(n);
    // },
  },
};

export function mediaListener({ media, event = "change", callback }) {
  if (!media) {
    throw new SyntaxError("invalid args");
  }

  try {
    media.addEventListener(event, callback);
  } catch (e) {
    if (/undefined is not a function/i.test(e.message)) {
      media?.addListener?.(callback);
    }
  }
}

export function breakpointsClasses() {
  const $breakpoints = this.$breakpoints;
  const orientation = $breakpoints.orientationAlias;
  const greater = $breakpoints.greater;
  const lesser = $breakpoints.lesser;
  const is = $breakpoints.is;

  return [
    is ? `br-${is}` : "",
    orientation ? `or-${orientation}` : "",
    greater ? `gt-${greater}` : "",
    lesser ? `lt-${lesser}` : "",
    {
      "is-4k": $breakpoints.is == "xl",
    },
  ];
}

// function commitMounted({ action, name, type = "component" }) {
//   this.$store.commit("LOADED_", {
//     value: {
//       _uid: this._uid,
//       type,
//     },
//     path: name,
//     action,
//   });
// }

// export function pushMountedComponent({ This, name, type }) {
//   const $this = This || (this ? this : null);

//   if (!$this) {
//     return;
//   }

//   commitMounted.call($this, {
//     action: "add",
//     name,
//     type,
//   });
// }

// export function sliceMountedComponent({ This, name, type }) {
//   const $this = This || (this ? this : null);

//   if (!$this) {
//     return;
//   }

//   commitMounted.call($this, {
//     action: "remove",
//     name,
//     type,
//   });
// }

// export function emitMounted(name) {
//   if (!this.$store.state.loadedComponents?.[name]?.[0]) {
//     this.$emit("component-loaded", performance.now());
//   }
// }

// export function emitUnmount(name) {
//   if (!this.$store.state.loadedComponents?.[name]?.[1]) {
//     this.$emit("component-unloaded", performance.now());
//   }
// }

// export function emitLoadState(name) {
//   return {
//     "component-loaded": () => {
//       this.loadedComponents = [...new Set([...this.loadedComponents, name])];
//     },
//     "component-unloaded": () => {
//       this.loadedComponents = [...this.loadedComponents].filter(
//         (x) => x != name
//       );
//     },
//   };
// }

export const defaultTransition = {
  // enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  enter: "cubic-bezier(.07,1.02,.4,1)",
  // enter: "cubic-bezier(0.5,1.14,.4,1)",
  // enter: "cubic-bezier(0.03,.22,0,01)",
  // enter: "cubic-bezier(0.05, 0.65, 0.05, 1)",
  // enter: "cubic-bezier(0,1,0,1)",
  // leave: "cubic-bezier(0.5, 1, 0.89, 1)",
  leave: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const setSprings = (
  mass = 1,
  stiffness = 210,
  damping = 15,
  precision = 0.001
) => ({
  mass,
  stiffness,
  damping,
  precision,
});

export const springPresets = {
  savedAnim: setSprings(1.5, 250, 20),
  smooth: setSprings(1, 170, 26),
  gentle: setSprings(1, 120, 14),
  wobbly: setSprings(1, 180, 12),
  stiff: setSprings(1, 250, 20),
  default: setSprings(),
};

const springDefaults = setSprings();

export const defaultSpringConfig = {
  enter: springDefaults,
  leave: springDefaults,
};

export const emailValidator = (e) => {
  const value = e?.trim();
  const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    value
  );
  if (!value.length) {
    return "Required";
  }
  if (!validEmail) {
    return "Invalid format";
  }
  return true;
};

export function vibrate(d = 1) {
  typeof navigator?.mozVibrate == "function"
    ? navigator.mozVibrate(d)
    : navigator?.vibrate?.(d);
}

export function addUser({ email, name, This, user }) {
  const $this = this ? this : This;
  return $this.supabase.from("users").insert([
    {
      email,
      name,
      uuid: user?.id || Date.now().toString(64),
      created: user?.created_at || Date(),
      confirmationSent: !!user?.confirmation_sent_at,
      confirmed: !!user?.confirmed_at,
      meta: JSON.stringify({ ...user }),
    },
  ]);
}

export function updateUser({ value, This, id }) {
  if (typeof value != "object") {
    throw new SyntaxError("invalid value!");
  }

  const $this = this ? this : This;
  return $this.supabase
    .from("users")
    .update({ ...value })
    .eq("uuid", id);
}

export function updateDeliveryInfo({ This, value }) {
  return new Promise((r) => {
    try {
      const $this = this ? this : This;

      const timeStamp = Date.now();

      // if (value["save info"]) {
      //   localStorage.setItem(
      //     "delivery-info",
      //     JSON.stringify({ ...value, timeStamp })
      //   );
      // } else {
      //   const localDelivery = localStorage.getItem("delivery-info");
      //   localDelivery && localStorage.removeItem("delivery-info");
      // }

      localStorage.setItem(
        "delivery-info",
        JSON.stringify({
          ...value,
          timeStamp,
          saved: value["save info"],
        })
      );

      $this.$store.commit("UPDATE_", {
        name: "savedDeliveryInfo",
        value: { ...value, timeStamp },
      });
      requestAnimationFrame(() => r(value));
    } catch (e) {
      if (e) {
        r(e);
      }
    }
  });
}

export function updateAppLocalStorage({ value }) {
  const freshStore = () => ({
    user: {
      deliveryInfo: {},
      remember: null,
    },
    timeStamp: Date.now(),
  });

  this.$store.commit("UPDATE_", {
    value: value || JSON.parse(localStorage.getItem(freshStore())),
    name: "localStorage",
  });
}

export function setLocalStorage(caller) {
  const name = "prd";
  const store = () => localStorage.getItem(name);
  const appStore = () => this.$store.state.localStorage;
  const freshStore = () => {
    if (typeof appStore() == "object" && appStore() != null) {
      return appStore();
    }
    return {
      user: {
        deliveryInfo: {},
        remember: null,
      },
      timeStamp: Date.now(),
    };
  };

  if (!store()) {
    return updateAppLocalStorage.call(this, { value: freshStore() });
  }

  this.$nextTick(() => {
    let savedStore = null;

    try {
      savedStore = JSON.parse(localStorage.getItem(name));
    } catch (e) {
      if (e) {
        savedStore = freshStore();
        updateAppLocalStorage.call(this, { value: savedStore });
      }
    } finally {
      if (savedStore == null) {
        savedStore = freshStore();
      }

      if (typeof savedStore.timeStamp != "number") {
        savedStore.timeStamp = Date.now();
      }

      if (typeof savedStore?.user != "object" || savedStore?.user === null) {
        savedStore.user = { deliveryInfo: {}, remember: null };
      }

      if (caller == "mounted") {
        updateAppLocalStorage.call(this, { value: savedStore });
      } else {
        const appTimeStamp = appStore()?.timeStamp || 0;
        const storeTimeStamp = JSON.parse(store())?.timeStamp || 0;

        if (storeTimeStamp > appTimeStamp) {
          updateAppLocalStorage.call(this, { value: JSON.parse(store()) });
        }
      }
    }
  });
}

export const formatTel = (value) => {
  const length = value.length;
  const input = value.replace(/\D/g, "").substring(0, length); // First ten digits of input only
  const areaCode = input.substring(0, 3);
  const middle = input.substring(3, 6);
  const last = input.substring(6, length);

  if (input.length > 6) {
    return `${areaCode} ${middle} ${last}`;
  } else if (input.length > 3) {
    return `${areaCode} ${middle}`;
  } else if (input.length > 0) {
    return `${areaCode}`;
  }
};

export function Copy({ text, onSuccess = () => {}, onError = () => {} }) {
  return new Promise((r) => {
    const oldBrowser = () => {
      try {
        const pseudoInput = document.createElement("input");
        pseudoInput.classList.add("sr-only");
        pseudoInput.setAttribute("tabindex", "-1");
        pseudoInput.setAttribute("aria-hidden", "true");
        pseudoInput.value = text;
        document.body.appendChild(pseudoInput);
        pseudoInput.select();

        document.execCommand("copy");
        document.body.removeChild(pseudoInput);
        onSuccess();
      } catch (e) {
        if (e) {
          onError();
        }
      } finally {
        r();
      }
    };

    if ("clipboard" in navigator) {
      try {
        navigator.clipboard.writeText(text);
        onSuccess();
        r();
      } catch (e) {
        if (e) {
          oldBrowser();
        }
      }
    } else oldBrowser();
  });
}

export function getType(x) {
  const $type = typeof x;
  const isArray = (val) => Array.isArray(val);

  if (isArray(x)) {
    return "array";
  }
  if ($type == "object" && !isArray(x)) {
    return "object";
  }
  return $type;
}

export function detectStrictTouchScreen() {
  if (!process.client) {
    return promiser(null);
  }

  setFunctionResults(detectStrictTouchScreen);

  const results = detectStrictTouchScreen.results;

  if (!results.matchMediaCalled) {
    results.matchMediaCalled = true;

    const media = window.matchMedia("(hover: none) and (pointer: coarse)");

    this.$store.commit("UPDATE_", {
      name: "isStrictTouchDevice",
      value: media.matches,
    });

    mediaListener({
      media,
      callback: (e) => {
        this.$store.commit("UPDATE_", {
          name: "isStrictTouchDevice",
          value: e.matches,
        });
      },
    });
  }

  return promiser(this.$store.state.isStrictTouchDevice);
}

export function detectTouchscreen() {
  if (!process.client) {
    return promiser(false);
  }

  setFunctionResults(detectTouchscreen);

  const $results = detectTouchscreen.results;

  if (!$results.strictTouchDetect) {
    $results.strictTouchDetect = true;

    detectStrictTouchScreen.call(this);
  }

  let result = false;
  if (window.PointerEvent && "maxTouchPoints" in navigator) {
    // if Pointer Events are supported, just check maxTouchPoints
    if (navigator.maxTouchPoints > 0) {
      result = true;
    }
  }
  // no Pointer Events...
  else if (
    window.matchMedia &&
    window.matchMedia("(any-pointer:coarse)").matches
  ) {
    // check for any-pointer:coarse which mostly means touchscreen
    result = true;
  } else if (window.TouchEvent || "ontouchstart" in window) {
    // last resort - check for exposed touch events API / event handler
    result = true;
  }

  this.$store.commit("UPDATE_", {
    name: "isTouchDevice",
    value: result,
  });

  return promiser(result);
}

export const isHTML = (x) => x instanceof HTMLElement;

export function kebabCase(val) {
  // setFunctionResults(kebabCase);

  // const results = kebabCase.results;

  // if (results?.[val]) {
  //   return results[val];
  // }

  if (typeof val == "string") {
    return val
      .replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)
      .replace(/-+/g, "-")
      .replace(/^-*/, "");
  }
  return val;
}

function animationFrame(action) {
  if (!process.client) {
    return function () {};
  }
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

export class Debounce {
  constructor({ callback = () => {}, delay = 0, instance }) {
    if (!instance) {
      throw new SyntaxError("Debounce recieved no instance");
    }

    this.callback = () => this.instance.$nextTick(callback);
    this.delay = delay;
    this.timeStamp = null;
    this.instance = instance;
  }

  get Delay() {
    if (typeof this.delay == "function") {
      return this.delay();
    }
    return this.delay;
  }

  init() {
    if (!process.client) {
      return this.callback();
    }

    this.timeStamp = performance.now();

    timeout.call(this.instance || {}, {
      data: () => ({ timeStamp: this.timeStamp }),
      callback: this.callback,
      delay: this.delay,
      cancel: ({ timeStamp }) => timeStamp != this.timeStamp,
    });
  }

  kill() {
    this.timeStamp = `${Math.random() * 100}`;
  }
}

export const rAF = animationFrame("request");
export const cAF = animationFrame("cancel");

const fps = (1 / 60) * 1000;

export function timeout({
  callback,
  delay = 0,
  cancel = () => false,
  timeStamp,
  data = () => ({}),
  app = null,
}) {
  if (!process.client) {
    return callback();
  }

  // const $self = {
  //   data: { ...data() },
  //   timeStamp: timeStamp || performance.now(),
  //   delay: convertSeconds(delay) - (1 / 60) * 1000,
  //   worker: (this || app)?.$store?.state?.worker,
  // };

  // if (!$self.data.timeStamp) {
  //   $self.data.timeStamp = $self.timeStamp;
  // }

  // $self.worker.addEventListener(
  //   "message",
  //   (e) => {
  //     console.log(e.data.timeStamp, $self.timeStamp);
  //     if (e.data.timeStamp == $self.timeStamp && !cancel(e.data)) {
  //       requestAnimationFrame((ts) => callback(e.data, ts));

  //       // $self.worker.terminate?.();

  //       // delete $self.worker;

  //       // $self = 0;
  //     }
  //   },
  //   { passive: true }
  // );

  // $self.worker.postMessage({
  //   name: "timeout",
  //   timeStamp: $self.timeStamp,
  //   delay: $self.delay,
  //   data: $self.data,
  // });

  const $this =
    typeof this == "object" ? this : typeof app == "object" ? app : {};

  const $data = { ...data() };

  const $timeStamp = timeStamp || performance.now();

  const $delay = convertSeconds(delay);

  if (!$data.timeStamp) {
    $data.timeStamp = $timeStamp;
  }

  if ($this?.$store.state?.worker) {
    $this.$store.state.worker.addEventListener(
      "message",
      (e) => {
        if (e.data.timeStamp == $timeStamp && !cancel(e.data)) {
          requestAnimationFrame((ts) => callback(e.data, ts));
        }
      },
      { passive: true }
    );

    $this.$store.state.worker.postMessage({
      name: "timeout",
      timeStamp: $timeStamp,
      delay: $delay - fps,
      data: $data,
    });
  } else {
    console.warn(`timeout recieved no 'this'`);
    requestAnimationFrame(() => {
      const d = ($delay || 0) - fps;
      const t = setTimeout(() => {
        if (!cancel($data)) {
          requestAnimationFrame((ts) => callback($data, ts));
          clearTimeout(t);
        }
      }, d);
    });
  }
}

export function sleep(d = 16, idle) {
  if (!process.client) {
    return new Promise((r) => r());
  }

  // let worker = null;

  // if (this?.$store?.wont) {
  //   worker = this.$store.state.worker;
  // }

  // const Timeout = ({ delay, callback }) => {
  //   requestAnimationFrame(() => {
  //     const timeStamp = performance.now();
  //     worker.onmessage = (e) => {
  //       // worker?.terminate?.();
  //       if (e.data.timeStamp == timeStamp) {
  //         callback();
  //         console.log(e);
  //       }
  //     };

  //     worker.postMessage({
  //       name: "timeout",
  //       timeStamp,
  //       delay: delay - 17,
  //     });
  //   });
  // };

  // // Timeout({
  // //   delay: d,
  // //   callback: () => {
  // //     console.log(d);
  // //   },
  // // });

  // const $timeout = ({ delay, callback }) =>
  //   worker == null
  //     ? timeout({ delay, callback })
  //     : Timeout({ delay, callback });

  const D = convertSeconds(d);

  const idleCallback = (fn) =>
    (window.requestIdleCallback || window.requestAnimationFrame)(fn);
  const cancel_idleCallback = (id) =>
    (window.cancelIdleCallback || window.cancelAnimationFrame)(id);
  return new Promise((r) => {
    if (typeof D == "number") {
      timeout.call(this, {
        timeStamp: Math.random() * performance.now(),
        callback: () => {
          if (!idle) {
            return r();
          }
          const t = idleCallback(() => {
            r();

            requestAnimationFrame(() => cancel_idleCallback(t));
          });
        },
        delay: D,
      });
    } else
      requestAnimationFrame(() => {
        if (!idle) {
          return r();
        }

        const t = idleCallback(() => {
          r();
          requestAnimationFrame(() => cancel_idleCallback(t));
        });
      });
  });
}

export function nextFrame(cb = () => {}) {
  return new Promise((r) =>
    requestAnimationFrame(() => {
      r(true);
      cb();
    })
  );
}

export function zIndex() {
  this.$c4.componentZIndex.push(
    /uiSheet/i.test(this.$parent._name) ? this.$parent : this
  );

  this.$c4.componentZIndex = [...new Set(this.$c4.componentZIndex)];

  const lengthTimes100 = 100 * this.$c4.componentZIndex.length;

  return 10000 + this.$c4.componentZIndex.length + lengthTimes100;
}

export function parser({ input, type, bind = null }) {
  const $ = new Function(
    `try{return ${input}}catch(e){if(e)throw new SyntaxError('invalid input')}`
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

export function convertSeconds(val, fallback) {
  // setFunctionResults(convertSeconds);

  // const results = convertSeconds.results;

  // if (results?.[val]) {
  //   return results[val];
  // }

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

export function camelCase(val) {
  // setFunctionResults(camelCase);

  // const results = camelCase.results;

  // if (results?.[val]) {
  //   return results[val];
  // }

  if (typeof val == "string") {
    return val.replace(/-./g, (x) => x.toUpperCase()[1]);
  }
  return val;
}

export function capitalize(val) {
  // setFunctionResults(capitalize);

  // const results = capitalize.results;

  // if (results?.[val]) {
  //   return results[val];
  // }

  if (typeof val == "string") {
    return val.replace(/^\s*\w{1,1}/g, (x) => x.toUpperCase());
  }
  return val;
}

export function capitalizeAll(val) {
  // setFunctionResults(capitalizeAll);

  // const results = capitalizeAll.results;

  // if (results?.[val]) {
  //   return results[val];
  // }

  if (typeof val == "string") {
    return capitalize(val).replace(/\s+\w{1,1}/g, (x) => x.toUpperCase());
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

export function removeNode(node) {
  if ("remove" in node) {
    return node && node.remove();
  } else {
    node && node.parentElement && node.parentElement.removeChild(node);
  }
}
