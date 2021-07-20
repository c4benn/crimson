/* eslint-disable promise/param-names */
export default function uiTransition() {
  const springSlide = ({ el, config, axis, both, dir }) => {
    return new Promise((r) => {
      if (!this.getUseSpring[this.direction]) {
        return r(false);
      }

      el.style.transition = "none";
      const args = config.arguments ? config.arguments : false;
      const getValue = (Axis, If, Else) => (axis == Axis ? If : Else);
      const value = args
        ? both
          ? `${args[0]}, ${args[1] || args[0]}, 0`
          : `${getValue("x", args[0], "0")}, ${getValue("y", args[0], "0")}, 0`
        : `${getValue("x", "100%", "0")}, ${getValue("y", "100%", "0")},0`;

      el.style.transform = `translate3d(${value})`;

      const from = (dir == "enter"
        ? both
          ? value
              .split(",")
              .filter((_, i) => i < 2)
              .join(",")
          : `${args[0] || "100%"}`
        : "0"
      ).split(",");

      const to = (dir == "enter"
        ? "0"
        : both
        ? value
            .split(",")
            .filter((_, i) => i < 2)
            .join(",")
        : `${args[0] || "100%"}`
      ).split(",");

      if (this.hasFade) {
        from.push(this.returnFade.before);
        to.push(this.returnFade[dir]);
      }

      (this.worker || this.$store.state.springWorker).postMessage({
        name: "spring",
        component: `uiTransition_${this._uid}`,
        to,
        from,
        // className: this.springAnimationClassName[dir],
        ...this.springConfig[dir],
        precision: 0.001,
        cssText: `transform: translate3d(${
          both
            ? "{0}, {1}, 0"
            : `${getValue("x", "{0}", "0")}, ${getValue("y", "{0}", "0")}`
        }, 0);`,
        // hasFade: this.hasFade,
      });

      requestAnimationFrame(() => {
        r(true);
      });
    });
  };

  const transitions = {
    scale: {
      beforeEnter: (el, config) => {
        el.style.transition = "none";
        const args = config.arguments ? config.arguments : false;
        const value = args
          ? `${args[0]},${args[1] || args[0]}, ${args[2] || "1"}`
          : "0,0,1";

        el.style.transform = `scale3d(${value})`;
      },
      enter: (el) => {
        el.style.transform = "scale3d(1,1,1)";
      },
      leave: (el, _, config) => {
        const args = config.arguments ? config.arguments : false;
        const value = args
          ? `${args[0]},${args[1] || args[0]}, ${args[2] || "1"}`
          : "0,0,1";

        el.style.transform = `scale3d(${value})`;
      },
      willChange: "transform",
    },
    slide: {
      beforeEnter: (el, config) => {
        el.style.transition = "none";
        const args = config.arguments ? config.arguments : false;
        const value = args
          ? `${args[0]},${args[1] || args[0]}, ${args[2] || "0"}`
          : "0,0,0";

        el.style.transform = `translate3d(${value})`;
      },
      enter: (el) => {
        el.style.transform = "translate3d(0,0,0)";
      },
      leave: (el, _, config) => {
        const args = config.arguments ? config.arguments : false;
        const value = args
          ? `${args[0]},${args[1] || args[0]}, ${args[2] || "0"}`
          : "0,0,0";

        el.style.transform = `translate3d(${value})`;
      },
      willChange: "transform",
    },
    "slide-x": {
      beforeEnter(el, config) {
        const value = config.arguments ? config.arguments[0] : "-100%";
        el.style.transform = `translate3d(${value}, 0,0)`;
      },
      enter: (el) => {
        el.style.transform = "translate3d(0,0,0)";
      },
      leave(el, _, config) {
        el.style.transform = `translate3d(${
          config.arguments ? config.arguments[0] : "-100%"
        }, 0,0)`;
      },
      willChange: "transform",
    },
    "slide-x-reverse": {
      beforeEnter(el, config) {
        const value = config.arguments ? config.arguments[0] : "100%";
        el.style.transform = `translate3d(${value}, 0,0)`;
      },
      enter: (el) => {
        el.style.transform = "translate3d(0,0,0)";
      },
      leave(el, _, config) {
        el.style.transform = `translate3d(${
          config.arguments ? config.arguments[0] : "100%"
        }, 0,0)`;
      },
      willChange: "transform",
    },
    "slide-y": {
      beforeEnter: async (el, config) => {
        if (this.getUseSpring[this.direction]) {
          await springSlide({
            el,
            config,
            axis: "y",
            dir: "enter",
          });
        } else {
          el.style.transform = `translate3d(0, ${
            config.arguments ? config.arguments[0] : "100%"
          },0)`;
        }
      },
      enter: (el) => {
        if (!this.getUseSpring[this.direction]) {
          el.style.transform = "translate3d(0,0,0)";
        }
      },
      leave: async (el, config) => {
        if (this.getUseSpring[this.direction]) {
          await springSlide({
            el,
            config,
            axis: "y",
            dir: "leave",
          });
        } else {
          el.style.transform = `translate3d(0, ${
            config.arguments ? config.arguments[0] : "100%"
          }, 0)`;
        }
      },
      willChange: "transform",
    },
    "slide-y-reverse": {
      beforeEnter(el, config) {
        el.style.transform = `translate3d(0, ${
          config.arguments ? config.arguments[0] : "-100%"
        },0)`;
      },
      enter: (el) => {
        el.style.transform = "translate3d(0,0,0)";
      },
      leave(el, _, config) {
        el.style.transform = `translate3d(0, ${
          config.arguments ? config.arguments[0] : "-100%"
        }, 0)`;
      },
      willChange: "transform",
    },
  };

  console.log(this.getUseSpring[this.direction], [this.direction]);

  return transitions;
}
