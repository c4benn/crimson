import { getType, sleep } from "~/components/utils/main";

export default function SpringEvents() {
  const transitionState = (state) => (this.transitionState = state);
  const setProperty = ({ el, prop, value }) =>
    el.style.setProperty(prop, value, "important");

  const reverse = (el, dir) => {
    this.$store.commit("UPDATE_", {
      name: "styles",
      value: [...this.$store.state.styles].filter(
        (x) => x.key != this.springAnimationClassName[dir]
      ),
    });

    el.classList.remove(this.springAnimationClassName[dir]);
  };

  const reverseEnter = (el) => reverse(el, "enter");

  const reverseLeave = (el) => reverse(el, "leave");

  const returnValue = {
    beforeEnter: async (el) => {
      this.direction = "enter";
      this.$emit("beforeEnter", el);

      transitionState("beforeEnter");

      if (!this.getCustom) {
        el._previousStyles = {};

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

        if (this.returnFade.before) {
          el.style.opacity = this.returnFade.before;
        }

        // set origin
        if (typeof this.getOrigin.enter == "string") {
          el.style.transformOrigin = this.getOrigin.enter;
        }

        if (this.getOrigin.enter === true) {
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

        console.log("reac");

        await this.$uiTransition?.beforeEnter?.(
          el,
          this.returnTransitionConfig
        );

        this.getDelay && (await sleep.call(this, this.getDelay));

        el.classList.add(this.springAnimationClassName.enter);
      }
    },

    enter: async (el, done) => {
      this.direction = "enter";

      transitionState("enter");

      this.$emit("enter", el);

      if (!this.getCustom) {
        el.addEventListener("animationstart", async () => {
          el.addEventListener(
            "animationend",
            () => {
              this.direction == "enter" && done();
            },
            { once: true }
          );
          el.addEventListener(
            "animationcancel",
            () => {
              this.direction == "enter" && done();
            },
            { once: true }
          );

          if (this.springConfig.duration) {
            await sleep.call(this, this.springConfig.duration);

            this.$nextTick(done);
          }

          requestAnimationFrame(() => {
            this.$uiTransition.restoreStyles &&
              el._previousStyles &&
              Object.assign(el.style, el._previousStyles);
            this.$nextTick(() => delete el._previousStyles);
          });
        });
      } else {
        await sleep.call(this, this.getRawDuration);

        this.$nextTick(done);
      }
    },

    enterCancelled: (el) => {
      this.$emit("enterCancelled", el);
      transitionState("enterCancelled");
      requestAnimationFrame(() => reverseEnter(el));
    },

    afterEnter: (el) => {
      this.direction = "enter";

      requestAnimationFrame(() => reverseEnter(el));

      this.$nextTick(() =>
        requestAnimationFrame(() => {
          transitionState("afterEnter");

          this.$emit("afterEnter", el);
        })
      );

      if (
        !this.getCustom &&
        typeof el.style == "object" &&
        typeof el._previousStyles == "object"
      ) {
        el.style.willChange = el._previousWillChange || "";
        el.style.transform = el._previousStyles.transform;

        delete el._previousWillChange;
      }
    },

    beforeLeave: (el) => {
      this.direction = "leave";
      this.$emit("beforeLeave", el);

      transitionState("beforeLeave");

      if (!this.getCustom) {
        el._previousStyles = {};

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
      }
    },

    leave: async (el, done) => {
      this.direction = "leave";

      transitionState("leave");

      this.$emit("leave", el);

      if (!this.getCustom) {
        this.getDelay && (await sleep.call(this, this.getDelay));

        await this.$uiTransition?.leave?.(el, this.returnTransitionConfig);

        console.log(this.springAnimationClassName.leave);

        el.addEventListener("animationstart", async () => {
          el.addEventListener(
            "animationend",
            () => {
              this.direction == "leave" && done();
            },
            { once: true }
          );
          el.addEventListener(
            "animationcancel",
            () => {
              this.direction == "leave" && done();
            },
            { once: true }
          );

          if (this.springConfig.duration) {
            await sleep.call(this, this.springConfig.duration);

            this.$nextTick(done);
          }

          requestAnimationFrame(() => {
            this.$uiTransition.restoreStyles &&
              el._previousStyles &&
              Object.assign(el.style, el._previousStyles);
            this.$nextTick(() => delete el._previousStyles);
          });
        });
      } else {
        await sleep.call(this, this.getRawDuration);

        this.$nextTick(done);
      }
    },

    leaveCancelled: (el) => {
      this.$emit("leaveCancelled", el);
      transitionState("leaveCancelled");
      requestAnimationFrame(() => reverseLeave(el));
    },

    afterLeave: (el) => {
      this.direction = "leave";

      requestAnimationFrame(() => reverseLeave(el));

      this.$nextTick(() =>
        requestAnimationFrame(() => {
          transitionState("afterLeave");

          this.$emit("afterLeave", el);
        })
      );

      if (
        !this.getCustom &&
        typeof el.style == "object" &&
        typeof el._previousStyles == "object"
      ) {
        el.style.willChange = el._previousWillChange || "";
        el.style.transform = el._previousStyles.transform;

        delete el._previousWillChange;
      }
    },
  };

  return returnValue;
}
