/* eslint-disable promise/param-names */
/* eslint-disable camelcase */

import { capitalize, getType, sleep } from "~/components/utils/main";

export default function Events() {
  const transitionState = (state) => (this.transitionState = state);
  const setProperty = ({ el, prop, value }) =>
    el.style.setProperty(prop, value, "important");

  const reverseSpring = (el, dir) => {
    requestAnimationFrame(() => {
      // this.$store.commit("UPDATE_", {
      //   name: "styles",
      //   value: [...this.$store.state.styles].filter(
      //     (x) => x.key != this.springAnimationClassName[dir]
      //   ),
      // });

      el.classList.remove(this.springAnimationClassName[dir]);
    });
  };

  const beforeEnter = (el, Appear) => {
    const name = Appear || "enter";

    this.direction = "enter";

    this.$emit(`before${capitalize(name)}`, el);

    transitionState(`before${capitalize(name)}`);

    if (!this.getCustom) {
      el._previousStyles = {};

      // set previous styles
      el._previousStyles.willChange = el.style.willChange;
      el._previousStyles.transformOrigin = el.style.transformOrigin;
      el._previousStyles.transition = el.style.transition;

      if (!this.getUseSpring[this.direction]) {
        el._previousStyles.transitionProperty = el.style.transitionProperty;

        el._previousStyles.transitionDuration = el.style.transitionDuration;

        el._previousStyles.transitionTimingFunction =
          el.style.transitionTimingFunction;

        el._previousStyles.opacity = el.style.opacity;
      }

      if (getType(this.$uiTransition?.willChange) == "string") {
        let $willChange = this.$uiTransition.willChange;

        if (this.hasFade && !/opacity/gi.test($willChange)) {
          $willChange = `opacity, ${$willChange}`;
        }

        $willChange += ", transition-timing-function";

        const splitWillChange = $willChange
          .split(",")
          .filter(Boolean)
          .map((x) => x.trim());

        splitWillChange.forEach((x) => {
          el._previousStyles[x] = el.style[x] || "";
        });
      }
      //

      if (this.returnFade.before && !this.getUseSpring[this.direction]) {
        el.style.opacity = this.returnFade.before;
      }

      // set origin
      if (typeof this.getOrigin.enter == "string") {
        el.style.transformOrigin = this.getOrigin.enter;
      }

      if (this.getOrigin.enter === true) {
        el.style.transformOrigin = "center";
      }
      //

      if (getType(this.$uiTransition?.willChange) == "string") {
        let $willChange = this.$uiTransition.willChange;
        if (this.willChange) {
          if (this.hasFade && !/opacity/gi.test($willChange)) {
            $willChange = `opacity, ${$willChange}`;
          }

          setProperty({
            el,
            prop: "will-change",
            value: $willChange.replace(/all/gi, ""),
          });
        }
        !this.getUseSpring[this.direction] &&
          setProperty({
            el,
            prop: "transition-property",
            value: $willChange.replace(/auto/gi, ""),
          });
      } else if (!this.getUseSpring[this.direction]) {
        setProperty({ el, prop: "transition-property", value: "all" });
      }

      this.$uiTransition?.beforeEnter?.(el, this.returnTransitionConfig);

      if (this.getUseSpring[this.direction]) {
        el.addEventListener(
          "animationstart",
          () => {
            el.style.transform = el._previousStyles.transform || "";
          },
          { once: true }
        );
      } else {
        setProperty({
          el,
          prop: "transition-duration",
          value: this.getDuration,
        });
        setProperty({
          el,
          prop: "transition-timing-function",
          value: this.getEase,
        });
      }
    }
  };

  const enter = async (el, done, Appear) => {
    const name = Appear || "enter";

    this.direction = "enter";

    transitionState(name);

    this.$emit(name, el);

    if (!this.getCustom) {
      el._offsetTop = el.getBoundingClientRect();

      delete el._offsetTop;

      this.getDelay && (await sleep.call(this, this.getDelay));

      const cleanUp = () => {
        this.$uiTransition.restoreStyles &&
          el._previousStyles &&
          Object.assign(el.style, el._previousStyles);
        this.$nextTick(() => delete el._previousStyles);
        this.getUseSpring[this.direction] && reverseSpring(el, "enter");
      };

      if (this.getUseSpring[this.direction]) {
        await sleep.call(this, 10);

        this.$nextTick(() =>
          requestAnimationFrame(() => {
            el.classList.add(this.springAnimationClassName[this.direction]);
          })
        );

        const springDone = (e) => {
          this.direction == "enter" && done();

          cleanUp();
          requestAnimationFrame(() => {
            el.removeEventListener(
              `animation${/end/i.test(e.type) ? "cancel" : "end"}`,
              springDone,
              { once: true }
            );
          });
        };

        el.addEventListener("animationend", springDone, { once: true });
        el.addEventListener("animationcancel", springDone, { once: true });

        if (this.springConfig.duration) {
          await sleep.call(this, this.springConfig.duration);

          this.$nextTick(done);
        }
      } else {
        if (this.returnFade.enter) {
          el.style.opacity = this.returnFade.enter;
        }

        this.$uiTransition?.enter?.(el, this.returnTransitionConfig);

        await sleep.call(this, this.getRawDuration);

        this.$nextTick(() =>
          requestAnimationFrame(() => {
            this.$nextTick(done);

            this.$nextTick(() => requestAnimationFrame(cleanUp));
          })
        );
      }
    } else {
      await sleep.call(this, this.getRawDuration);

      this.$nextTick(done);
    }
  };

  const enterCancelled = (el, Appear) => {
    const name = Appear || "enter";

    this.direction = "leave";

    transitionState(`${name}Cancelled`);

    this.$emit(`${name}Cancelled`, el);
  };

  const afterEnter = (el, Appear) => {
    this.$nextTick(() => {
      this.direction = "enter";

      this.$nextTick(() =>
        requestAnimationFrame(() => {
          transitionState("afterEnter");

          this.$emit("afterEnter", el);
        })
      );

      if (!this.getCustom) {
        el.style.willChange = el._previousWillChange || "";

        delete el._previousWillChange;
      }
    });
  };

  const returnValue = {
    beforeAppear: (el) => {
      if (this.beforeAppear) {
        beforeEnter(el, "appear");
      }
    },
    appear: (e) => {
      if (this.beforeAppear) {
        enter(e, "appear");
      }
    },
    appearCancelled: (e) => {
      if (this.beforeAppear) {
        enterCancelled(e, "appear");
      }
    },
    afterAppear: (e) => {
      if (this.beforeAppear) {
        afterEnter(e, "appear");
      }
    },
    beforeEnter,
    enter,

    enterCancelled,

    afterEnter,

    beforeLeave: (el) => {
      this.direction = "leave";

      transitionState("beforeLeave");

      this.$emit("beforeLeave", el);

      if (!this.getCustom) {
        el._previousStyles = {};

        if (this.getUseSpring[this.direction]) {
          el._previousStyles.willChange = el.style.willChange;
          el._previousStyles.transition = el.style.transition;

          if (getType(this.$uiTransition?.willChange) == "string") {
            let $willChange = this.$uiTransition.willChange;

            if (this.hasFade && !/opacity/gi.test($willChange)) {
              $willChange = `opacity, ${$willChange}`;
            }

            const splitWillChange = $willChange
              .split(",")
              .filter(Boolean)
              .map((x) => x.trim());

            splitWillChange.forEach((x) => {
              el._previousStyles[x] = el.style[x] || "";
            });
          }

          // if (this.returnFade.before) {
          //   el.style.opacity = this.returnFade.before;
          // }

          // set origin
          if (typeof this.getOrigin.leave == "string") {
            el.style.transformOrigin = this.getOrigin.leave;
          }

          if (this.getOrigin.leave === true) {
            el.style.transformOrigin = "center";
          } //

          if (getType(this.$uiTransition?.willChange) == "string") {
            let $willChange = this.$uiTransition.willChange;
            if (this.willChange) {
              if (this.hasFade && !/opacity/gi.test($willChange)) {
                $willChange = `opacity, ${$willChange}`;
              }

              setProperty({
                el,
                prop: "will-change",
                value: $willChange.replace(/all/gi, ""),
              });
            }
          }

          return;
        }

        // set previous styles
        el._previousStyles.willChange = el.style.willChange;

        el._previousStyles.transitionProperty = el.style.transitionProperty;

        el._previousStyles.transitionDuration = el.style.transitionDuration;

        el._previousStyles.transitionTimingFunction =
          el.style.transitionTimingFunction;

        el._previousStyles.opacity = el.style.opacity;

        el._previousStyles.transformOrigin = el.style.transformOrigin;

        if (getType(this.$uiTransition?.willChange) == "string") {
          let $willChange = this.$uiTransition.willChange;

          if (this.hasFade && !/opacity/gi.test($willChange)) {
            $willChange = `opacity, ${$willChange}`;
          }

          $willChange += ", transition-timing-function";

          const splitWillChange = $willChange
            .split(",")
            .filter(Boolean)
            .map((x) => x.trim());

          splitWillChange.forEach((x) => {
            el._previousStyles[x] = el.style[x];
          });
        }
        //

        if (typeof this.getOrigin.leave == "string") {
          el.style.transformOrigin = this.getOrigin.leave;
        }

        if (this.getOrigin.leave === true) {
          el.style.transformOrigin = "center";
        }

        if (getType(this.$uiTransition?.willChange) == "string") {
          el._previousWillChange = el.style.willChange;

          let $willChange = this.$uiTransition.willChange;

          if (this.hasFade && !/opacity/gi.test($willChange)) {
            $willChange = `opacity, ${$willChange}`;
          }

          this.willChange &&
            setProperty({
              el,
              prop: "will-change",
              value: $willChange.replace(/all/gi, ""),
            });
          setProperty({
            el,
            prop: "transition-property",
            value: $willChange.replace(/auto/gi, ""),
          });
        } else {
          setProperty({ el, prop: "transition-property", value: "all" });
        }

        setProperty({
          el,
          prop: "transition-duration",
          value: this.getDuration,
        });
        el.style.transitionTimingFunction = this.getEase;
      }
    },

    leave: async (el, done) => {
      this.direction = "leave";

      transitionState("leave");

      this.$emit("leave", el);

      if (!this.getCustom) {
        this.getDelay && (await sleep.call(this, this.getDelay));

        if (this.returnFade.leave) {
          el.style.opacity = this.returnFade.leave;
        }

        this.$uiTransition?.leave?.(el, {}, this.returnTransitionConfig);

        this.$nextTick(async () => {
          await sleep.call(this, this.getRawDuration);

          this.$nextTick(done);

          this.$nextTick(() =>
            requestAnimationFrame(() => {
              this.$uiTransition.restoreStyles &&
                el._previousStyles &&
                Object.assign(el.style, el._previousStyles);
              this.$nextTick(() => delete el._previousStyles);
            })
          );
        });
      } else {
        await sleep.call(this, this.getRawDuration);

        this.$nextTick(done);
      }
    },

    leaveCancelled: (el) => {
      this.direction = "enter";

      transitionState("leaveCancelled");

      this.$emit("leaveCancelled", el);
    },

    afterLeave: (el) => {
      this.$nextTick(() => {
        this.direction = "leave";

        if (!this.getCustom) {
          el.style.willChange = el._previousWillChange || "";

          delete el._previousWillChange;
        }

        this.$nextTick(() =>
          requestAnimationFrame(() => {
            transitionState("afterLeave");

            this.$emit("afterLeave", el);
          })
        );
      });
    },
  };

  return returnValue;
}
