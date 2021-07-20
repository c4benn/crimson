const buildFrames = ({ from, to, name }) => {
  const frames = `from{${from}}to{${to}}`;

  let returnValue = "";

  ["@-webkit-", "@"].forEach(
    (x) => (returnValue += `${x}keyframes ${name.toUpperCase()} {${frames}}`)
  );

  return returnValue;
};

function buildAnimRule({ name, dir }) {
  return `animation:${name.toUpperCase()} ${this.getDuration[dir]} ${
    this.getEase[dir]
  } both;transform-origin:${`${this.getOrigin[dir]}`.replace(
    /true|false|undefined|null/,
    "center"
  )};`;
}

const $className = (val) => val.replace(/^#ui-root \./, "");

function assignValue(obj, value) {
  this.$store.commit("SAVED_ANIMATIONS", {
    value,
    action: "updateRoot",
  });

  Object.assign(obj, value);
}

function slide({ axis, defaultValue = "100%" }) {
  const args = (dir) => this.getTransitionArgs(dir) || [];

  const getTranslate = (translate, important = true) =>
    `transform:${this.previousTransform}translate3d(${
      axis == "x" ? `${translate},0` : `0,${translate}`
    },0)${important ? "" : ""};`;

  const defaultTranslate = (important) =>
    `transform:${this.previousTransform}translate3d(0,0,0)${
      important ? "" : ""
    };`;

  const enter = () => {
    const name = this.getAnimationName.name.enter;

    const translate = args("enter")[0] || defaultValue;

    const CName = `#ui-root .${name}-slide-${axis}`;

    const returnValue = {};

    returnValue[name] = {
      beforeEnter: {},
      enter: {},
      afterEnter: {},
    };

    const setBeforeEnter = () => {
      const className = `${CName}-before-enter`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.enter ? `opacity:${this.returnFade.before};` : ""
        }${getTranslate(translate)}}`,
      };

      assignValue.call(this, returnValue[name].beforeEnter, value);
    };

    setBeforeEnter();

    const setEnter = () => {
      const fadeFrom = this.returnFade.before;

      const fadeTo = this.returnFade.enter;

      const className = `${CName}-enter`;

      if (this.getType("enter") == "spring") {
        const hasFade = this.hasFade.enter;

        const springValues = {
          from: {
            x: axis == "x" ? translate : "0",
            y: axis == "y" ? translate : "0",
            opacity: hasFade ? fadeFrom : undefined,
          },
          to: {
            x: "0",
            y: "0",
            opacity: hasFade ? fadeTo : undefined,
          },
        };

        const springFrom = springValues.from;

        const springTo = springValues.to;

        const animExists = this.$store.state.savedAnimations?.[`slide-${axis}`]
          ?.enter?.[name.toLowerCase()]?.enter;

        if (!animExists && process.client) {
          let worker = this.worker;

          worker.addEventListener(
            "message",
            (e) => {
              if (e.data.id == this.transitionId) {
                const className = e.data.className;
                const animName = e.data.animName;
                const direction = e.data.direction;
                const duration = e.data.duration;

                const cssAnimConfig = `#ui-root .${className}{animation:${animName} ${duration} linear both;transform-origin:${`${this.getOrigin[direction]}`.replace(
                  /true|false|undefined|null/,
                  "center"
                )};}`;
                const cssText = `${e.data.keyFrames}${cssAnimConfig}`;

                this.$store.commit("SAVED_ANIMATIONS", {
                  action: "updateSpringActive",
                  name: e.data.animType,
                  direction,
                  key: e.data.animPath,
                  value: {
                    className,
                    text: cssText,
                    duration: parseFloat(duration),
                  },
                });

                console.log({
                  className,
                  text: cssText,
                  duration: parseFloat(duration),
                  e,
                  name: e.data.animType,
                });

                // e.target.terminate?.();

                worker = 0;
              }
            },
            { once: true, passive: true }
          );

          const springConfig = this.getSpringConfig.enter;

          worker.postMessage({
            id: this.transitionId,
            className: className.replace(/^#ui-root \./, ""),
            timeStamp: performance.now(),
            name: "spring",
            animName: `${name.toUpperCase()}-ENTER`,
            animType: `slide-${axis}`,
            animPath: name.toLowerCase(),
            direction: "enter",
            stiffness: springConfig.stiffness,
            mass: springConfig.mass,
            precision: springConfig.precision,
            damping: springConfig.damping,
            from: [springFrom.x, springFrom.y, springFrom.opacity],
            to: [springTo.x, springTo.y, springTo.opacity],
            cssText: `transform:${
              this.previousTransform
            }translate3d({0},{1},0);${hasFade ? "opacity:{2};" : ""}`,
            type: "keyFrame",
          });

          return assignValue.call(this, returnValue[name].enter, {
            className: className.replace(/^#ui-root \./, ""),
          });
        } else
          return assignValue.call(this, returnValue[name].enter, {
            className: className.replace(/^#ui-root \./, ""),
          });
      }

      const frames = buildFrames({
        from: `${
          this.hasFade.enter ? `opacity:${fadeFrom};` : ""
        }${getTranslate(translate, false)}`,
        to: `${
          this.hasFade.enter ? `opacity:${fadeTo};` : ""
        }${defaultTranslate(false)}`,
        name,
      });

      const animRule = buildAnimRule.call(this, {
        name: `${name}`,
        dir: "enter",
      });

      const value = {
        className: $className(className),
        text: `${frames}${className}{${animRule}}`,
      };

      assignValue.call(this, returnValue[name].enter, value);
    };

    setEnter();

    const setAfterEnter = () => {
      const className = `${CName}-after-enter`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.enter ? `opacity:${this.returnFade.enter};` : ""
        }${defaultTranslate()}}`,
      };

      assignValue.call(this, returnValue[name].afterEnter, value);
    };

    setAfterEnter();

    return returnValue;
  };

  const leave = () => {
    const name = this.getAnimationName.name.leave;

    const translate = args("leave")[0] || defaultValue;

    const CName = `#ui-root .${name}-slide-${axis}`;

    const returnValue = {};

    returnValue[name] = {
      beforeLeave: {},
      leave: {},
      afterLeave: {},
    };

    const setLeaveAnim = () => {
      const className = `${CName}-before-leave`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.leave ? `opacity:${this.returnFade.enter};` : ""
        }${defaultTranslate()}}`,
      };

      assignValue.call(this, returnValue[name].beforeLeave, value);
    };

    setLeaveAnim();

    const setLeaveActiveAnim = () => {
      const before = this.returnFade.enter;

      const frames = buildFrames({
        from: `${
          this.hasFade.leave ? `opacity:${before};` : ""
        }${defaultTranslate(false)}`,
        to: `${
          this.hasFade.leave ? `opacity:${this.returnFade.leave};` : ""
        }${getTranslate(translate, false)}`,
        name,
      });

      const animRule = buildAnimRule.call(this, {
        name: `${name}`,
        dir: "leave",
      });

      const className = `${CName}-leave`;

      const value = {
        className: $className(className),
        text: `${frames}${className}{${animRule}}`,
      };

      assignValue.call(this, returnValue[name].leave, value);
    };

    setLeaveActiveAnim();

    const setLeaveToAnim = () => {
      const className = `${CName}-after-leave`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.leave ? `opacity:${this.returnFade.leave};` : ""
        }${getTranslate(translate)}}`,
      };

      assignValue.call(this, returnValue[name].afterLeave, value);
    };

    setLeaveToAnim();

    return returnValue;
  };

  const value = {
    enter: enter(),
    leave: leave(),
  };

  this.$store.commit("SAVED_ANIMATIONS", {
    animName: `slide-${axis}`,
    value,
  });

  return value;
}

function scale({ axis = "both", defaultValue = "0" }) {
  const args = (dir) => this.getTransitionArgs(dir) || [];

  const getTranslate = (translate, important = true) =>
    `transform:${this.previousTransform}scale3d(${
      axis == "both"
        ? `${translate[0] || defaultValue},${
            translate[1] || translate[0] || defaultValue
          }`
        : axis == "x"
        ? `${translate[0] || defaultValue},1`
        : `1,${translate[0] || defaultValue}`
    },1)${important ? "" : ""};`;

  const defaultTranslate = (important) =>
    `transform:${this.previousTransform}scale3d(1,1,1)${important ? "" : ""};`;

  const enter = () => {
    const name = this.getAnimationName.name.enter;

    const translate = args("enter");

    const CName = `#ui-root .${name}-scale-${axis}`.replace(/-both/, "");

    const returnValue = {};

    returnValue[name] = {
      beforeEnter: {},
      enter: {},
      afterEnter: {},
    };

    const setBeforeEnter = () => {
      const className = `${CName}-before-enter`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.enter ? `opacity:${this.returnFade.before};` : ""
        }${getTranslate(translate)}}`,
      };

      assignValue.call(this, returnValue[name].beforeEnter, value);
    };

    setBeforeEnter();

    const setEnter = () => {
      const className = `${CName}-enter`;

      const fadeFrom = this.returnFade.before;

      const fadeTo = this.returnFade.enter;

      const hasFade = this.hasFade.enter;

      if (this.getType("enter") == "spring") {
        const springValues = {
          from: {
            x: translate[0] || "0",
            y: translate[1] || translate[0] || "0",
            opacity: hasFade ? fadeFrom : undefined,
          },
          to: {
            x: "1",
            y: "1",
            opacity: hasFade ? fadeTo : undefined,
          },
        };

        const springFrom = springValues.from;

        const springTo = springValues.to;

        const animExists = this.$store.state.savedAnimations?.scale?.enter?.[
          name.toLowerCase()
        ]?.enter;

        if (!animExists && process.client) {
          let worker = this.worker;

          worker.addEventListener(
            "message",
            (e) => {
              if (e.data.id == this.transitionId) {
                const className = e.data.className;
                const animName = e.data.animName;
                const direction = e.data.direction;
                const duration = e.data.duration;
                // this.springDuration[direction] = parseFloat(duration);
                const cssAnimConfig = `#ui-root .${className}{animation:${animName} ${duration} linear both;transform-origin:${`${this.getOrigin[direction]}`.replace(
                  /true|false|undefined|null/,
                  "center"
                )};}`;
                const cssText = `${e.data.keyFrames}${cssAnimConfig}`;

                this.$store.commit("SAVED_ANIMATIONS", {
                  action: "updateSpringActive",
                  name: e.data.animType,
                  direction,
                  key: e.data.animPath,
                  value: {
                    className,
                    text: cssText,
                    duration: parseFloat(duration),
                  },
                });

                // e.target.terminate?.();

                worker = 0;
              }
            },
            { once: true, passive: true }
          );

          const springConfig = this.getSpringConfig.enter;

          worker.postMessage({
            id: this.transitionId,
            className: className.replace(/^#ui-root \./, ""),
            timeStamp: performance.now(),
            name: "spring",
            animName: `${name.toUpperCase()}-ENTER`,
            animType: "scale",
            animPath: name.toLowerCase(),
            direction: "enter",
            stiffness: springConfig.stiffness,
            mass: springConfig.mass,
            precision: springConfig.precision,
            damping: springConfig.damping,
            from: [springFrom.x, springFrom.y, springFrom.opacity],
            to: [springTo.x, springTo.y, springTo.opacity],
            cssText: `transform:${this.previousTransform}scale3d({0},{1},1);${
              hasFade ? "opacity:{2};" : ""
            }`,
            type: "keyFrame",
          });

          return assignValue.call(this, returnValue[name].enter, {
            className: className.replace(/^#ui-root \./, ""),
          });
        } else
          return assignValue.call(this, returnValue[name].enter, {
            className: className.replace(/^#ui-root \./, ""),
          });
      }

      const frames = buildFrames({
        from: `${
          this.hasFade.enter ? `opacity:${fadeFrom};` : ""
        }${getTranslate(translate, false)}`,
        to: `${
          this.hasFade.enter ? `opacity:${fadeTo};` : ""
        }${defaultTranslate(false)}`,
        name,
      });

      const animRule = buildAnimRule.call(this, {
        name: `${name}`,
        dir: "enter",
      });

      const value = {
        className: $className(className),
        text: `${frames}${className}{${animRule}}`,
      };

      assignValue.call(this, returnValue[name].enter, value);
    };

    setEnter();

    const setAfterEnter = () => {
      const className = `${CName}-after-enter`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.enter ? `opacity:${this.returnFade.enter};` : ""
        }${defaultTranslate()}}`,
      };

      assignValue.call(this, returnValue[name].afterEnter, value);
    };

    setAfterEnter();

    return returnValue;
  };

  const leave = () => {
    const name = this.getAnimationName.name.leave;

    const translate = args("leave");

    const CName = `#ui-root .${name}-scale-${axis}`.replace(/-both/, "");

    const returnValue = {};

    returnValue[name] = {
      beforeLeave: {},
      leave: {},
      afterLeave: {},
    };

    const setLeaveAnim = () => {
      const className = `${CName}-before-leave`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.leave ? `opacity:${this.returnFade.enter};` : ""
        }${defaultTranslate()}}`,
      };

      assignValue.call(this, returnValue[name].beforeLeave, value);
    };

    setLeaveAnim();

    const setLeaveActiveAnim = () => {
      const fadeFrom = this.returnFade.enter;
      const fadeTo = this.returnFade.leave;

      const className = `${CName}-leave`;

      const frames = buildFrames({
        from: `${
          this.hasFade.leave ? `opacity:${fadeFrom};` : ""
        }${defaultTranslate(false)}`,
        to: `${this.hasFade.leave ? `opacity:${fadeTo};` : ""}${getTranslate(
          translate,
          false
        )}`,
        name,
      });

      const animRule = buildAnimRule.call(this, {
        name: `${name}`,
        dir: "leave",
      });

      const value = {
        className: $className(className),
        text: `${frames}${className}{${animRule}}`,
      };

      assignValue.call(this, returnValue[name].leave, value);
    };

    setLeaveActiveAnim();

    const setLeaveToAnim = () => {
      const className = `${CName}-after-leave`;

      const value = {
        className: $className(className),
        text: `${className}{${
          this.hasFade.leave ? `opacity:${this.returnFade.leave};` : ""
        }${getTranslate(translate)}}`,
      };

      assignValue.call(this, returnValue[name].afterLeave, value);
    };

    setLeaveToAnim();

    return returnValue;
  };

  const value = {
    enter: enter(),
    leave: leave(),
  };

  // if (this.getType("enter") == "spring") {
  //   delete value.enter[this.getAnimationName.name.enter].enter;
  // }

  // if (this.getType("leave") == "spring") {
  //   delete value.leave[this.getAnimationName.name.leave].leave;
  // }

  console.log(value);

  this.$store.commit("SAVED_ANIMATIONS", {
    animName: `scale-${axis}`.replace(/-both/, ""),
    value,
  });

  return value;
}

export default {
  fade() {
    const enter = () => {
      const name = this.getAnimationName.name.enter;

      const CName = `#ui-root .${name}-fade`;

      const returnValue = {};

      returnValue[name] = {
        beforeEnter: {},
        enter: {},
        afterEnter: {},
      };

      const setBeforeEnter = () => {
        const className = `${CName}-before-enter`;

        const value = {
          className: $className(className),
          text: `${className}{opacity:${this.returnFade.before};}`,
        };

        assignValue.call(this, returnValue[name].beforeEnter, value);
      };

      setBeforeEnter();

      const setEnter = () => {
        const before = this.returnFade.before;

        const frames = buildFrames({
          from: `opacity:${before}`,
          to: `opacity:${this.returnFade.enter}`,
          name,
        });

        const animRule = buildAnimRule.call(this, {
          name: `${name}`,
          dir: "enter",
        });

        const className = `${CName}-enter`;

        const value = {
          className: $className(className),
          text: `${frames}${className}{${animRule}}`,
        };

        assignValue.call(this, returnValue[name].enter, value);
      };

      setEnter();

      const setAfterEnter = () => {
        const className = `${CName}-after-enter`;

        const value = {
          className: $className(className),
          text: `${className}{opacity:${this.returnFade.enter};}`,
        };

        assignValue.call(this, returnValue[name].afterEnter, value);
      };

      setAfterEnter();

      return returnValue;
    };

    const leave = () => {
      const name = this.getAnimationName.name.leave;

      const CName = `#ui-root .${name}-fade`;

      const returnValue = {};

      returnValue[name] = {
        beforeLeave: {},
        leave: {},
        afterLeave: {},
      };

      const setLeaveAnim = () => {
        const className = `${CName}-before-leave`;

        const value = {
          className: $className(className),
          text: `${className}{opacity:${this.returnFade.enter};}`,
        };

        assignValue.call(this, returnValue[name].beforeLeave, value);
      };

      setLeaveAnim();

      const setLeaveActiveAnim = () => {
        const before = this.returnFade.enter;

        const frames = buildFrames({
          from: `opacity:${before}`,
          to: `opacity:${this.returnFade.leave}`,
          name,
        });

        const animRule = buildAnimRule.call(this, {
          name: `${name}`,
          dir: "leave",
        });

        const className = `${CName}-leave`;

        const value = {
          className: $className(className),
          text: `${frames}${className}{${animRule}}`,
        };

        assignValue.call(this, returnValue[name].leave, value);
      };

      setLeaveActiveAnim();

      const setLeaveToAnim = () => {
        const className = `${CName}-after-leave`;

        const value = {
          className: $className(className),
          text: `${className}{opacity:${this.returnFade.leave};}`,
        };

        assignValue.call(this, returnValue[name].afterLeave, value);
      };

      setLeaveToAnim();

      return returnValue;
    };

    const value = {
      enter: enter(),
      leave: leave(),
    };

    this.$store.commit("SAVED_ANIMATIONS", {
      animName: "fade",
      value,
    });

    return value;
  },

  "slide-y"() {
    return slide.call(this, { axis: "y" });
  },

  "slide-y-reverse"() {
    return slide.call(this, { axis: "y", defaultValue: "-100%" });
  },

  "slide-x"() {
    return slide.call(this, { axis: "x" });
  },

  "slide-x-reverse"() {
    return slide.call(this, { axis: "x", defaultValue: "-100%" });
  },

  scale() {
    return scale.call(this, { axis: "both" });
  },

  "scale-x"() {
    return scale.call(this, { axis: "x" });
  },

  "scale-y"() {
    return scale.call(this, { axis: "y" });
  },
};
