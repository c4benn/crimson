<script>
import {
  convertSeconds,
  defaultSpringConfig,
  defaultTransition,
  getType,
  kebabCase,
  promiser,
} from "../utils/main";
// import { convertSeconds } from "../utils/main";
import props from "./props";
import render from "./render";
import utils from "./utils";

function propsToWatch() {
  const value = {};

  [
    // "duration",
    // "delay",
    // "ease",
    // "origin",
    // "transition",
    // "type",
    // "springConfig",
    // "fade",

    "getRawDuration",
    "getOrigin",
    "getEase",
    "getCustom",
    "hasFade",
    "returnFade",
    "getTransitionName",
    "getSpringConfig",
    "currentTransitionName",
  ].forEach((prop) => {
    value[prop] = function () {
      this.utils("enter");
      this.utils("leave");
    };
  });

  return value;
}

export default {
  name: "UiTransition",

  props,

  data: () => ({
    direction: "",

    transitionState: "",

    transitionGroup: null,

    transitionClass: {
      enter: "",
      enterActive: "",
      enterTo: "",
      leave: "",
      leaverActive: "",
      leaveTo: "",
    },

    transitionId: null,

    springDuration: {
      enter: null,
      leave: null,
    },

    currentTransitionName: "",
  }),

  computed: {
    worker() {
      return this.$store.state.worker;
    },

    getDuration() {
      if (this.$store.state.userPreference.reduceMotion) {
        return 0;
      }

      const output = { enter: "300ms", leave: "300ms" };
      const $duration = (val) => {
        if (/\d+\s*$/.test(val)) {
          return `${val}ms`;
        }
        return val;
      };
      const supports = (val) => isFinite(parseFloat(val));

      if (/string|number/.test(typeof this.duration)) {
        if (supports(this.duration)) {
          output.enter = $duration(this.duration);
          output.leave = $duration(this.duration);
        }
      } else if (typeof this.duration == "object") {
        if (
          /string|number/i.test(typeof this.duration.enter) &&
          supports(this.duration.enter)
        ) {
          output.enter = $duration(this.duration.enter);
        }
        if (
          /string|number/i.test(typeof this.duration.leave) &&
          supports(this.duration.leave)
        ) {
          output.leave = $duration(this.duration.leave);
        }
      }
      return output;
    },

    getRawDuration() {
      return convertSeconds(this.getDuration) + parseFloat(this.getDelay);
    },

    getOrigin() {
      let config = { enter: "center", leave: "center" };
      if (typeof this.origin == "object") {
        // Object.assign(config, this.origin);

        config = { ...config, ...this.origin };
      }

      if (/string|boolean/i.test(typeof this.origin)) {
        config.enter = this.origin;
        config.leave = this.origin;
      }

      return config;
    },

    getEase() {
      const returnEase = () => {
        const output = { ...defaultTransition };

        const defaults = { ...output };

        if (typeof this.ease == "object") {
          output.enter = this.ease?.enter || defaults.enter;
          output.leave = this.ease?.leave || defaults.leave;
        } else if (typeof this.ease == "string") {
          output.enter = this.ease || defaults.enter;
          output.leave = this.ease || defaults.leave;
        }

        return output;
      };

      const returnValue = returnEase();

      if (/^--/.test(returnValue)) {
        return `var(${returnValue})`;
      }
      return returnValue;
    },

    getCustom() {
      const returnCustom = () => {
        const output = {
          enter: false,
          leave: false,
        };
        const defaults = { ...output };

        if (typeof this.custom == "object") {
          output.enter = this.custom?.enter || defaults.enter;
          output.leave = this.custom?.leave || defaults.leave;
        } else if (typeof this.custom == "boolean") {
          output.enter = this.custom || defaults.enter;
          output.leave = this.custom || defaults.leave;
        }

        return output;
      };

      const returnValue = returnCustom();

      if (/^--/.test(returnValue)) {
        return `var(${returnValue})`;
      }
      return returnValue;
    },

    getDelay() {
      const output = {
        enter: "0ms",
        leave: "0ms",
      };

      if (this.$store.state.userPreference.reduceMotion) {
        return output;
      }

      if (typeof this.delay == "object") {
        output.enter = `${convertSeconds(this.delay?.enter || 0)}ms`;
        output.leave = `${convertSeconds(this.delay?.leave || 0)}ms`;
      } else if (/string|number/i.test(typeof this.delay)) {
        const parsed = `${convertSeconds(this.delay, 0)}ms`;
        output.enter = parsed;
        output.leave = parsed;
      }

      return output;
    },

    hasFade() {
      if (this.$store.state.userPreference.reduceMotion) {
        return false;
      }

      let output = { enter: false, leave: false };

      if (typeof this.fade == "boolean" && this.fade) {
        output.enter = true;
        output.leave = true;
      } else if (/string|number/i.test(typeof this.fade)) {
        const value = parseFloat(this.fade);

        if (!isNaN(value) && value >= 0 && value <= 1) {
          output.enter = true;
          output.leave = true;
        }
      } else if (getType(this.fade) == "object") {
        // Object.assign(output, this.fade);

        output = { ...output, ...this.fade };
      }
      return output;
    },

    returnFade() {
      // const returnValue = { before: null, enter: null, leave: null };

      const returnValue = { before: "1", enter: "1", leave: "1" };

      const validValue = (value) => !isNaN(value) && value >= 0 && value <= 1;

      if (getType(this.fade) == "boolean" && this.fade) {
        returnValue.before = "0";
        returnValue.enter = "1";
        returnValue.leave = "0";
      } else if (/number|string/i.test(typeof this.fade)) {
        const value = parseFloat(this.fade);

        if (validValue(value)) {
          returnValue.before = "0";
          returnValue.enter = `${value}`;
          returnValue.leave = "0";
        }
      } else if (getType(this.fade) == "object") {
        const enter = parseFloat(this.fade.enter);
        const leave = parseFloat(this.fade.leave);

        if (validValue(enter)) {
          returnValue.before = "0";
          returnValue.enter = `${enter}`;
        }

        if (validValue(leave)) {
          returnValue.leave = `${leave}`;
        }
      }

      return returnValue;
    },

    getTransitionName() {
      if (this.$store.state.userPreference.reduceMotion) {
        return "none";
      }

      const output = {
        enter: "",
        leave: "",
      };

      if (this.transition === false) {
        output.enter = "none";
        output.leave = "none";
      }

      if (typeof this.transition == "string") {
        output.enter = this.transition;
        output.leave = this.transition;
      }

      if (getType(this.transition) == "object") {
        if (typeof this.transition.enter == "string") {
          output.enter = this.transition.enter;
        }
        if (typeof this.transition.leave == "string") {
          output.leave = this.transition.leave;
        }
      }
      return output;
    },

    getAnimationName() {
      const returnValue = { name: { enter: "", leave: "" } };

      // return fade name
      const returnFade = this.returnFade;

      returnValue.name.enter = "uiam-";
      returnValue.name.leave = "uiam-";

      // if (/none|false/i.test(`${this.transition}`) && this.hasFade) {
      const append = (dir) => this.getAnimProps(dir);

      returnValue.name.enter += this.formatAnimKey(
        `${returnFade.before}-${returnFade.enter}-${append("enter")}`
      );

      returnValue.name.leave += this.formatAnimKey(
        `${returnFade.enter}-${returnFade.leave}-${append("leave")}`
      );
      // }

      return returnValue;
    },

    getSpringConfig() {
      const returnValue = { ...defaultSpringConfig };

      if (typeof this.springConfig == "object") {
        // Object.assign(returnValue.enter, {
        //   ...returnValue.enter,
        //   ...(this.springConfig?.enter || this.springConfig),
        // });

        returnValue.enter = {
          ...returnValue.enter,
          ...(this.springConfig?.enter || this.springConfig),
        };

        // Object.assign(returnValue.leave, {
        //   ...returnValue.leave,
        //   ...(this.springConfig?.leave || this.springConfig),
        // });

        returnValue.leave = {
          ...returnValue.leave,
          ...(this.springConfig?.leave || this.springConfig),
        };
      }

      return returnValue;
    },
  },

  watch: {
    ...propsToWatch.call(this),
    // async "$store.state.fetched.pages"(n) {
    //   await this.$nextTick();

    //   this.utils("enter");

    //   this.utils("leave");
    // },
  },

  created() {
    this.transitionId = this._uid;

    // if (this.$store.state.uiTransitionWorker === null) {
    //   this.$store.commit("UPDATE_", {
    //     name: "uiTransitionWorker",
    //     value: new Worker("/workers/uiTransition.js"),
    //     caller: "appMounted",
    //   });
    // }
  },

  async beforeMount() {
    await this.$nextTick();

    this.utils("enter");

    this.utils("leave");
  },

  methods: {
    getType(dir) {
      let config = { enter: "ease", leave: "ease" };
      if (typeof this.type == "object") {
        // Object.assign(config, this.type);

        config = { ...config, ...this.type };
      }

      if (typeof this.type == "string") {
        config.enter = this.type;
      }

      config.leave = "ease";

      return config[dir].toLowerCase();
    },

    getAnimPath(dir) {
      const savedAnimations = this.$store.state.savedAnimations;

      const currentAnimPath = savedAnimations?.[this.getAnimName(dir)];

      const currentAnimDir = currentAnimPath?.[dir];

      const animName = this.getAnimationName?.name?.[dir];

      const currentAnimName = currentAnimDir?.[animName];

      const value = currentAnimName || {};

      return value;
    },

    utils(dir) {
      const $state = this.$store.state;

      const animName = this.getAnimName(dir);

      const value = $state.savedAnimations?.[animName]?.[dir]?.[
        this.getAnimationName?.name?.[dir]
      ] ||
        utils[animName]?.call?.(this) || { fetching: true };

      return promiser(value);
    },
    returnTransitionName(dir) {
      const returnValue = kebabCase(
        this.getTransitionName[dir].replace(/:\w+/g, "").replace(/\(.+\)$/g, "")
      );

      return returnValue;
    },
    getTransitionArgs(dir) {
      if (this.$store.state.userPreference.reduceMotion) {
        return "";
      }

      const $name = this.getTransitionName[dir].match(/\(.+\)$/g);
      let returnValue = null;

      if ($name) {
        returnValue = $name[0]
          .replace(/\(|\)/g, "")
          .split(",")
          .map((x) => `${x}`.trim());

        return returnValue;
      } else return returnValue;
    },

    getAnimName(dir) {
      let value = this.returnTransitionName(dir);

      const hasFade = this.hasFade[dir];

      if (value == "none" && hasFade) {
        value = "fade";
      }

      this.currentTransitionName = value;

      return value;
    },
    getAnimProps(dir) {
      const springConfig = this.getSpringConfig[dir];

      const isSpring = this.getType(dir) == "spring";

      const duration = isSpring
        ? `mm${springConfig.mass}-ss${springConfig.stiffness}-dd${springConfig.damping}-pp${springConfig.precision}`
        : this.getDuration[dir];

      const ease = isSpring ? "" : this.getEase[dir];

      return this.formatAnimKey(
        `${duration}-${this.getDelay[dir]}-${ease}-${`${
          this.getOrigin?.[dir] || "center"
        }`.replace(/true|false/, "center")}`
      );
    },
    formatAnimKey(val) {
      const results =
        this.formatAnimKey.results || (this.formatAnimKey.results = {});

      const saved = results[val];

      if (saved) {
        return saved;
      }

      return (results[val] = val
        .replace(/var\(/g, "v(")
        .replace(/cubic-bezier/g, "cb")
        .replace(/\(/g, "bo")
        .replace(/\)/g, "bc")
        .replace(/,/g, "c")
        .replace(/\./g, "d")
        .replace(/\s+/g, "")
        .replace(/%/g, "pe")
        .replace(/null/g, "")
        .replace(/-{2,}/g, "_"));
    },
  },

  render,
};
</script>

<style>
.anim-in-progress {
  transition: 0s !important;
  will-change: opacity, transform !important;
  backface-visibility: hidden !important;
  /* perspective: 1000 !important; */
  pointer-events: none;
}

#ui-root[aria-label] .anim-cancelled {
  visibility: hidden;
  animation: none !important;
}
</style>
