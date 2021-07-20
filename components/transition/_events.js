/* eslint-disable promise/param-names */
import { nextFrame, promiser, sleep } from "../utils/main";

const filter = (arr, cb) => arr.filter(cb);

const eventConfig = { once: true, passive: true };

const animInProgress = "anim-in-progress";

const animCancelledClass = "anim-cancelled";

export default function Events() {
  const setDirection = (val) => (this.direction = val);

  const setTransitionState = (val) => {
    setDirection(/enter/i.test(val) ? "enter" : "leave");

    this.transitionState = val;
  };

  const animPath = (dir) => this.getAnimPath(dir);

  const setClass = async ({ el, done, state, className }) => {
    const handleClasslist = (action, value) => {
      value && el?.classList?.[action]?.(...[value].flat(Infinity));

      return promiser(el);
    };

    const $state = /^before|^before/i.test(state)
      ? "from"
      : /^enter$|^leave$/i.test(state)
      ? "active"
      : /cancelled$/i.test(state)
      ? "cancelled"
      : "to";

    if ($state == "from") {
      handleClasslist("add", animInProgress);
    }

    setTransitionState(state);

    const handleEventListeners = (action, args) => {
      el?.[`${action}EventListener`]?.(...args);

      return promiser(el);
    };

    const addAnimClass = async () => {
      await handleClasslist("add", animInProgress);

      await handleClasslist("add", className);

      return promiser(el);
    };

    const removeAnimClasses = async ({ all, exempt }) => {
      await handleClasslist(
        "remove",
        filter(
          [
            // animCancelledClass,
            all && /to|cancelled/.test($state) ? animInProgress : null,
            ...filter([...(el?.classList || [])], (x) => /^uiam-/.test(x)),
          ],
          (x) => !!x && (all ? true : x != exempt)
        )
      );

      return promiser();
    };

    if ($state == "from") {
      await this.$nextTick();

      await this.utils(this.direction);

      await removeAnimClasses({ all: true });

      await this.$nextTick();

      await addAnimClass();

      return promiser(el);
    }

    if ($state == "active") {
      // await this.$nextTick();

      // await nextFrame();

      const beforeAnimStart = async () => {
        const callDone = async () => {
          if (!el.classList.contains(animInProgress)) {
            return;
          }

          done();

          await nextFrame();

          removeAnimClasses({ all: true });

          // this.direction == (/enter/i.test(state) ? "enter" : "leave") &&
        };

        const animDoneEvent = (action) => {
          ["end", "cancel"].forEach((type) =>
            handleEventListeners(action, [
              `animation${type}`,
              animDone,
              eventConfig,
            ])
          );
        };

        const animDone = async () => {
          callDone();

          await nextFrame();

          animDoneEvent("remove");
        };

        animDoneEvent("add");

        await handleEventListeners("add", [
          "animationstart",
          async () => {
            await removeAnimClasses({ exempt: className });

            const easeDuration = this.getDuration[this.direction];

            if (this.getType(this.direction) == "ease") {
              await sleep.call(this, easeDuration);

              callDone();
            } else {
              const springDuration = this.$store.state.savedAnimations
                .springDurations[this.getAnimationName.name[this.direction]];

              await sleep.call(this, springDuration);

              callDone();
            }
          },
          eventConfig,
        ]);

        return promiser();
      };

      await beforeAnimStart();

      await this.$nextTick();

      await addAnimClass();

      return promiser(el);
    }

    if ($state == "cancelled") {
      await removeAnimClasses({ all: true });

      await this.$nextTick();

      const enterState = /enter/i.test(state);

      await addAnimClass();

      await handleClasslist("remove", animInProgress);

      await sleep.call(this, 16);

      setTransitionState(enterState ? "afterLeave" : "afterEnter");

      // await removeAnimClasses({ all: true });

      return promiser(el);
    }

    if ($state == "to") {
      await removeAnimClasses({ all: true });

      await addAnimClass();

      await this.$nextTick();

      await removeAnimClasses({ all: true });

      return promiser(el);
    }
  };

  const returnValue = {
    beforeEnter: async (el) => {
      const state = "beforeEnter";

      setTransitionState(state);

      this.$emit(state, el);

      await setClass({
        el,
        state,
        className: animPath("enter").beforeEnter?.className || "",
      });
    },

    enter: async (el, done) => {
      const state = "enter";

      setTransitionState(state);

      this.$emit(state, el);

      // await this.$nextTick();

      const delay = parseFloat(this.getDelay.enter);

      const duration = parseFloat(this.getDuration.enter);

      delay && (await sleep.call(this, delay));

      if (this.getAnimName("enter") == "none") {
        await this.$sleep(duration);

        return done();
      }

      await setClass({
        el,
        state,
        done,
        className: animPath("enter").enter?.className || "",
      });
    },

    enterCancelled: async (el) => {
      const state = "enterCancelled";
      setTransitionState(state);

      this.$emit(state, el);

      await setClass({
        el,
        state,
        className: [
          animCancelledClass,
          animPath("leave").afterLeave?.className || "",
        ],
      });
    },

    afterEnter: async (el) => {
      const state = "afterEnter";

      setTransitionState(state);

      this.$nextTick(() => this.$emit(state, el));

      await setClass({
        el,
        state,
        className: animPath("enter").afterEnter?.className || "",
      });
    },

    beforeLeave: async (el) => {
      const state = "beforeLeave";
      setTransitionState(state);

      this.$emit(state, el);

      await setClass({
        el,
        state,
        className: animPath("leave").beforeLeave?.className || "",
      });
    },

    leave: async (el, done) => {
      const state = "leave";
      setTransitionState(state);

      // await this.$nextTick();

      const delay = parseFloat(this.getDelay.leave);

      const duration = parseFloat(this.getDuration.leave);

      delay && (await sleep.call(this, delay));

      this.$emit(state, el);

      if (this.getAnimName("leave") == "none") {
        await this.$sleep(duration);

        return done();
      }

      await setClass({
        el,
        state,
        done,
        className: animPath("leave").leave?.className || "",
      });
    },

    leaveCancelled: async (el) => {
      const state = "leaveCancelled";
      setTransitionState(state);

      await setClass({
        el,
        state,
        className: ["uiam-", animPath("enter").afterEnter?.className || ""],
      });

      this.$emit(state, el);
    },

    afterLeave: async (el) => {
      const state = "afterLeave";
      setTransitionState(state);

      this.$nextTick(() => this.$emit(state, el));

      await setClass({
        el,
        state,
        className: animPath("leave").afterLeave?.className || "",
      });
    },
  };

  return returnValue;
}
