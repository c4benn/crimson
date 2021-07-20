// import uiTransitions from "@/components/transition/uiTransitions";

import {
  convertSeconds,
  defaultTransition,
  getType,
  kebabCase,
} from "~/components/utils/main";

import buildAnimation from "~/components/transition/buildAnimation";

export default {
  // getUiAnimationArgs() {
  //   return {
  //     name: this.transition,
  //     type: this.type,
  //     fade: this.fade,
  //     ease: this.ease,
  //     duration: this.duration,
  //     spring: this.springConfig,
  //     delay: this.delay,
  //     // direction: this.direction,
  //     instance: this,
  //     origin: this.origin,
  //   };
  // },

  // uiTransitions,

  buildAnimation,

  $uiTransition() {
    return {
      restoreStyles: true,
      willChange: "opacity",
      // ...this.uiTransitions[this.returnTransitionName],
    };
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

      return output[this.direction];
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

      return output[this.direction];
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

    return output[this.direction];
  },

  getTransitionName() {
    if (this.$store.state.userPreference.reduceMotion) {
      return "none";
    }

    const output = {
      enter: "slide-x",
      leave: "slide-x",
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
    return output[this.direction];
  },

  returnTransitionName() {
    const returnValue = kebabCase(
      this.getTransitionName.replace(/:\w+/g, "").replace(/\(.+\)$/g, "")
    );

    return returnValue;
  },

  savedAnimations() {
    return this.$store.state.animations;
  },

  savedAnimationsClassName() {
    return this.savedAnimations.filter((x) => x.type == "rule");
  },

  savedAnimationsKeyFrame() {
    return this.savedAnimations.filter((x) => x.type == "keyFrame");
  },

  getAnimationConfig() {
    let animName = `ui-gen-${this.direction}-`;

    if (this.getType == "spring") {
      animName += "spring-";
    } else {
      animName += "ease-";
    }

    if (this.hasFade) {
      const fadeFrom = this.returnFade[
        this.direction == "enter" ? "before" : "enter"
      ];

      animName += `fade-${fadeFrom}-${this.returnFade[this.direction]}-`;
    }

    animName += `${this.getTransitionName.replace(/^none$/i, "")}`;

    animName = animName.replace(/-{1,1}$/, "");

    animName += "__";

    let className = animName;

    className += `-${this.getOrigin}`.replace(/true|false/g, "center");

    if (this.getType == "spring") {
      const spring = this.springConfig[this.direction];
      className += `-${spring.stiffness}-${spring.mass}-${spring.damping}-${
        spring.precision
      }-${convertSeconds(this.getDelay)}ms`;
    } else {
      className += `-${convertSeconds(this.getDuration)}ms-${
        this.getEase
      }-${convertSeconds(this.getDelay)}ms`;
    }

    const format = (val) => this.formatAnimKey(val);

    animName = `${format(animName)}-anim-name`;

    className = format(className);

    return { animName, className };
  },

  getTransitionArgs() {
    if (this.$store.state.userPreference.reduceMotion) {
      return "";
    }

    const $name = this.getTransitionName.match(/\(.+\)$/g);
    let returnValue = null;

    if ($name) {
      returnValue = $name[0]
        .replace(/\(|\)/g, "")
        .split(",")
        .map((x) => `${x}`.trim());

      return returnValue;
    } else return returnValue;
  },

  getTransitionExp() {
    if (this.$store.state.userPreference.reduceMotion) {
      return "";
    }

    const $exp = this.getTransitionName.match(/:\w+/g);
    let returnValue = "";

    if ($exp) {
      returnValue = $exp[0].replace(":", "");

      return returnValue;
    } else return returnValue;
  },

  returnTransitionConfig() {
    return {
      expression: this.getTransitionExp,
      arguments: this.getTransitionArgs,
    };
  },

  hasFade() {
    if (this.$store.state.userPreference.reduceMotion) {
      return false;
    }

    const output = { enter: false, leave: false };

    if (typeof this.fade == "boolean" && this.fade) {
      output.enter = true;
      output.leave = true;
    } else if (/string|number/i.test(typeof this.fade)) {
      const value = parseFloat(this.fade);

      if (!isNaN(value) && value >= 0 && value <= 1) {
        output.enter = true;
        output.leave = true;
      } else if (isNaN(value) && this.fade?.length) {
        output.enter = true;
        output.leave = true;
      }
    } else if (getType(this.fade) == "object") {
      if (
        typeof this.fade[this.direction] == "boolean" &&
        this.fade[this.direction]
      ) {
        output.enter = true;
        output.leave = true;
      } else if (/string|number/i.test(typeof this.fade[this.direction])) {
        const value = parseFloat(this.fade[this.direction]);

        if (!isNaN(value) && value >= 0 && value <= 1) {
          output.enter = true;
          output.leave = true;
        } else if (isNaN(value) && this.fade[this.direction]?.length) {
          output.enter = true;
          output.leave = true;
        }
      }
    }
    return output[this.direction];
  },

  returnFade() {
    const returnValue = { before: null, enter: null, leave: null };

    if (getType(this.fade) == "boolean" && this.fade) {
      returnValue.before = "0";
      returnValue.enter = "1";
      returnValue.leave = "0";
    } else if (/number|string/i.test(typeof this.fade)) {
      const value = parseFloat(this.fade);

      if (!isNaN(value) && value >= 0 && value <= 1) {
        returnValue.before = "0";
        returnValue.enter = `${value}`;
        returnValue.leave = "0";
      } else if (isNaN(value) && this.fade?.length) {
        returnValue.before = "0";
        returnValue.enter = `${this.fade}`;
        returnValue.leave = "0";
      }
    } else if (getType(this.fade) == "object") {
      if (this.fade[this.direction]) {
        if (
          getType(this.fade[this.direction]) == "boolean" &&
          this.fade[this.direction]
        ) {
          returnValue.before = "0";
          returnValue.enter = "1";
          returnValue.leave = "0";
        } else if (/number|string/i.test(getType(this.fade[this.direction]))) {
          const value = parseFloat(this.fade[this.direction]);

          if (isFinite(value) && value >= 0 && value <= 1) {
            returnValue.before = "0";
            returnValue.enter = `${value}`;
            returnValue.leave = "0";
          } else if (isNaN(value) && this.fade[this.direction]?.length) {
            returnValue.before = "0";
            returnValue.enter = `${this.fade[this.direction]}`;
            returnValue.leave = "0";
          }
        }
      }
    }

    return returnValue;
  },

  getWillChange() {
    let $willChange;
    const returnValue = {
      willChange: "auto",
      property: "all",
    };

    if (getType(this.willChange) == "array") {
      $willChange = this.willChange.join(", ");
    } else {
      $willChange = this.willChange;
    }

    if (getType($willChange) == "string") {
      returnValue.willChange = this.willChange.replace(/all/gi, "auto");
      returnValue.property = this.willChange.replace(/auto/gi, "all");
    }

    return returnValue;
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
    return output[this.direction];
  },

  getRawDuration() {
    return convertSeconds(this.getDuration) + parseFloat(this.getDelay);
  },

  getOrigin() {
    const config = { enter: "center", leave: "center" };
    if (typeof this.origin == "object") {
      if (this.origin[this.direction]) {
        config[this.direction] = this.origin[this.direction];
      }

      if (this.origin[this.direction] === false) {
        config[this.direction] = false;
      }
    }

    if (typeof this.origin == "string") {
      config.enter = this.origin;
      config.leave = this.origin;
    }

    if (typeof this.origin == "boolean") {
      config.enter = this.origin;
      config.leave = this.origin;
    }

    return config[this.direction];
  },

  getUseSpring() {
    const config = { enter: false, leave: false };
    if (typeof this.useSpring == "object") {
      if (this.useSpring[this.direction]) {
        config[this.direction] = this.useSpring[this.direction];
      }
    }

    if (typeof this.useSpring == "boolean") {
      config.enter = this.useSpring;
      config.leave = this.useSpring;
    }

    return config[this.direction];
  },

  getType() {
    const config = { enter: "ease", leave: "ease" };
    if (typeof this.type == "object") {
      if (this.type[this.direction]) {
        config[this.direction] = this.type[this.direction];
      }
    }

    if (typeof this.type == "string") {
      config.enter = this.type;
      config.leave = this.type;
    }

    return config[this.direction].toLowerCase();
  },
};
