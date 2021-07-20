/* eslint-disable promise/param-names */
import { convertSeconds } from "~/components/utils/main";

export default function BuildTransitions() {
  // set rule, then set class.

  const buildEaseFrames = ({ animName, keyFrames }) => {
    return `@-webkit-keyframes ${animName} ${keyFrames} @keyframes ${animName} ${keyFrames}`;
  };

  const buildEaseClass = ({ className, animName }) =>
    this.buildEaseClass({
      className,
      animName,
      duration: `${convertSeconds(this.getDuration)}ms`,
      ease: this.getEase,
    });

  // SLIDE Y UTILS

  const slideYEnterToAndBeforeLeave = (state) => {
    return new Promise((r) => {
      const className = `${this.getAnimationConfig.className}-${state}`;

      const findClass = this.savedAnimationsClassName.find(
        (x) => x.key == className
      );

      if (!findClass) {
        this.$store.commit("ANIMATIONS", {
          action: "add",
          value: {
            key: className,
            type: "rule",
            text: `.${className}{transition:0s!important;${
              this.hasFade ? `opacity:${this.returnFade.enter};` : ""
            }transform:translate3d(0,0,0);}`,
            name: this.getAnimationConfig.className,
            animType: this.getType,
          },
        });

        r();
      } else r();
    });
  };

  const slideYEnterActiveAndLeaveActive = ({
    state,
    keyFrames,
    to,
    from,
    cssText,
  }) => {
    return new Promise((r) => {
      const className = `${this.getAnimationConfig.className}-${state}`;
      const animName = `${this.getAnimationConfig.animName}`;
      const springConfig = this.springConfig[this.direction];

      const findClass = this.savedAnimationsClassName.find(
        (x) => x.key == className
      );

      const findAnim = this.savedAnimationsKeyFrame.find(
        (x) => x.key == animName
      );

      if (this.getType == "spring") {
        if (!this.worker) {
          return r(false);
        }

        if (!findClass && !findAnim) {
          this.worker.postMessage({
            id: this._uid,
            className,
            animName,
            stiffness: springConfig.stiffness,
            mass: springConfig.mass,
            precision: springConfig.precision,
            damping: springConfig.damping,
            timeStamp: performance.now(),
            name: "spring",
            to,
            from,
            cssText,
            type: "keyFrame",
            // hasFade: this.hasFade,
            // fade: this.hasFade
            //   ? {
            //       from: this.returnFade.before,
            //       to: this.returnFade[this.direction],
            //     }
            //   : null,
          });
        }

        return r(true);
      }

      const classRule = buildEaseClass({ className, animName });

      this.$store.commit("ANIMATIONS", {
        action: "add",
        value: {
          type: "rule",
          key: className,
          text: classRule,
          animType: this.getType,
          name: this.getAnimationConfig.className,
        },
      });

      const buildKeyFrames = buildEaseFrames({
        animName,
        keyFrames,
      });

      this.$store.commit("ANIMATIONS", {
        action: "add",
        value: {
          type: "keyFrame",
          key: animName,
          text: buildKeyFrames,
          animType: this.getType,
          name: this.getAnimationConfig.className,
        },
      });

      r();
    });
  };

  const slideYBeforeEnterAndLeaveTo = (state) => {
    return new Promise((r) => {
      const className = `${this.getAnimationConfig.className}-${state}`;

      const findClass = this.savedAnimationsClassName.find(
        (x) => x.key == className
      );

      if (!findClass) {
        const value = this.getTransitionArgs?.[0];

        this.$store.commit("ANIMATIONS", {
          action: "add",
          value: {
            type: "rule",
            key: className,
            text: `.${className}{transition:0s!important;${
              this.hasFade
                ? `opacity:${
                    this.returnFade[
                      this.direction == "enter" ? "before" : "leave"
                    ]
                  };`
                : ""
            }transform:translate3d(0,${value || "100%"},0)}`,
            name: this.getAnimationConfig.className,
            animType: this.getType,
          },
        });

        r();
      } else r();
    });
  };

  // SLIDE Y UTILS ENDS

  const returnValue = {
    "slide-y": {
      enter: () => {
        slideYBeforeEnterAndLeaveTo("enter");

        return new Promise((r) => r(true));
      },

      enterActive: () => {
        const state = "enter-active";

        const value = this.getTransitionArgs?.[0];

        slideYEnterActiveAndLeaveActive({
          state,
          keyFrames: `{from{transform:translate3d(0,${value || "100%"},0);${
            this.hasFade ? `opacity:${this.returnFade.before};` : ""
          }}to{transform:translate3d(0,0,0);${
            this.hasFade ? `opacity:${this.returnFade.enter};` : ""
          }}}`,
          to: `0`,
          from: value || `100%`,
          cssText: `transform:translate3d(0,{0},0)`,
        });

        return new Promise((r) => r(true));
      },

      enterTo: () => {
        slideYEnterToAndBeforeLeave("enter-to");

        return new Promise((r) => r(true));
      },

      leave: () => {
        slideYEnterToAndBeforeLeave("leave");

        return new Promise((r) => r(true));
      },

      leaveActive: () => {
        const state = "leave-active";

        const value = this.getTransitionArgs?.[0];

        slideYEnterActiveAndLeaveActive({
          state,
          keyFrames: `{from{transform:translate3d(0,0,0);${
            this.hasFade ? `opacity:${this.returnFade.enter};` : ""
          }}to{transform:translate3d(0,${value || "100%"},0);${
            this.hasFade ? `opacity:${this.returnFade.leave};` : ""
          }}}`,
          from: `0`,
          to: value || `100%`,
          cssText: `transform:translate3d(0,{0},0)`,
        });

        return new Promise((r) => r(true));
      },

      leaveTo: () => {
        slideYBeforeEnterAndLeaveTo("leave-to");

        return new Promise((r) => r(true));
      },
    },
  };

  return returnValue;
}
