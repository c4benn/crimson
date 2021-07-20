<script>
import { setSprings } from "./utils/main";
// import { timeout } from "~/components/utils";
export default {
  name: "UiSheet",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    transition: {
      type: [String, Object, Boolean],
      default: () => ({
        transition: "slide-y",
        fade: false,
        duration: { enter: "500" },
      }),
    },
    backdrop: {
      type: [String, Object, Number, Boolean],
      default: () => 0.7,
    },
    vmodel: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: [String, Number],
      default: "",
    },
    removeContent: {
      type: Boolean,
      default: true,
    },
    removeAppend: {
      type: Boolean,
      default: true,
    },
    removePrepend: {
      type: Boolean,
      default: true,
    },
    contentAttrs: {
      type: Object,
      default: () => ({}),
    },
    contentStyle: {
      type: [Object, String],
      default: () => ({}),
    },
    contentClass: {
      type: [Object, Array, String],
      default: () => [],
    },
    contentEvent: {
      type: Object,
      default: () => ({}),
    },
    raise: {
      type: Boolean,
      default: true,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    background: {
      type: String,
      default: "__default-background",
    },
    renderBackgroundElem: {
      type: Boolean,
      default: true,
    },
    useIntersection: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      required: true,
    },
    hideTransitioningContent: Boolean,
    fullscreen: Boolean,
  },
  data() {
    return {
      transitionState: "",
      canSnap: false,
      intersectionState: {
        entries: {},
      },
      addWillChange: false,
      initialBackdropOpacity: undefined,
      backdropOpacity: undefined,
      reducedBackdropTransition: false,
      backgroundElemHeight: undefined,
      showBackgroundElem: false,
      noTransition: false,

      emittedAboutToScrollOut: false,
    };
  },
  computed: {
    getBackdropOpacity() {
      return this.$refs.root?.backdropConfig?.opacity || undefined;
    },
    intersectionHeight() {
      const height =
        this.intersectionState.entries?.boundingClientRect?.height || undefined;
      return height ? Math.floor(height) : undefined;
    },
    v_model() {
      return {
        isActive: this.vmodel,
        open: () => this.$emit("vmodel", true),
        close: () => requestAnimationFrame(() => this.$emit("vmodel", false)),
        toggle: () => this.$emit("vmodel", !this.vmodel),
      };
    },
    transitionConfig() {
      const defaults = {
        transition: "slide-y",
        fade: false,
        duration: { enter: "500" },
        type: { enter: "spring" },
        springConfig: setSprings(1.25, 250, 28),
      };

      if (this.transition === true) {
        return defaults;
      }

      if (this.transition === false) {
        return false;
      }

      if (typeof this.transition == "string") {
        defaults.transition = this.transition;
        return defaults;
      }

      if (typeof this.transition == "object") {
        if (this.transition.transition) {
          defaults.transition = this.transition.transition;
        }

        if (this.transition.fade) {
          defaults.fade = this.transition.fade;
        }

        if (this.transition.duration) {
          defaults.duration = this.transition.duration;
        }
      }

      return defaults;
    },
  },
  watch: {
    backdrop() {
      this.initialBackdropOpacity = parseFloat(this.getBackdropOpacity);
    },
    intersectionHeight() {
      if (this.intersectionHeight) {
        this.backgroundElemHeight = `${this.intersectionHeight * 0.65}px`;
      } else this.backgroundElemHeight = undefined;
    },
    transitionState() {
      const afterEnter = /afterE/i.test(this.transitionState);
      if (afterEnter) {
        this.reducedBackdropTransition = true;
      }

      this.showBackgroundElem = afterEnter;
    },
    "v_model.isActive"() {
      this.blurText(true, false);

      this.reducedBackdropTransition = false;
      this.addWillChange = false;
      if (this.v_model.isActive) {
        this.noTransition = false;
        this.$el.scrollTo(0, this.$el.clientHeight);
      } else {
        this.backgroundElemHeight = undefined;
        this.showBackgroundElem = false;
      }
    },
    intersectionState() {
      if (this.v_model.isActive) {
        let ratio = this.intersectionState?.entries?.intersectionRatio;
        if (isNaN(ratio)) {
          ratio = 1;
        }

        const entriesBottom =
          this.intersectionState?.entries?.boundingClientRect?.bottom || 1;

        const rootBoundsBottom =
          this.intersectionState?.entries?.rootBounds?.bottom || 1;

        const isAboutToScrollOut =
          ratio < 1 &&
          ratio > 0.8 &&
          entriesBottom > rootBoundsBottom &&
          !this.emittedAboutToScrollOut;

        if (/afterEnter/i.test(this.transitionState)) {
          if (isAboutToScrollOut) {
            this.emittedAboutToScrollOut = true;
            this.$emit("about-to-scroll-out");

            this.blurText(false);
          }

          if (ratio == 1 && this.emittedAboutToScrollOut) {
            this.emittedAboutToScrollOut = false;

            this.blurText(true);
          }
        }

        // this.showBackgroundElem = ratio >= 0.8 || entriesTop < 1;

        this.showBackgroundElem = false;

        requestAnimationFrame(() => {
          let ratio = this.intersectionState?.entries?.intersectionRatio;
          if (isNaN(ratio)) {
            ratio = 1;
          }

          if (/afterEnter|leave/i.test(this.transitionState)) {
            if (/afterEnter/i.test(this.transitionState)) {
              this.addWillChange = ratio <= 0.995;
            }

            this.backdropOpacity = this.initialBackdropOpacity * ratio;

            if (this.initialBackdropOpacity - this.backdropOpacity < 0.01) {
              this.backdropOpacity = this.initialBackdropOpacity;
            }

            if (ratio <= 0.05) {
              this.noTransition = true;
              this.$emit("scrolled-out", this.intersectionState);
              requestAnimationFrame(this.v_model.close);
            }
          }
        });
      }
    },
  },

  methods: {
    blurText(value, rAF = true) {
      const callback = () =>
        this.$store.commit("V_MODEL", {
          path: "blurText",
          innerPath: "headerContent",
          value,
        });

      return rAF ? requestAnimationFrame(callback) : callback();
    },
  },

  render(h) {
    const dialog = (d, c) => h("ui-dialog", d, c);
    const intersection = (d, c) => h("ui-intersection", d, c);
    const div = (d, c) => h("div", d, c);

    return dialog({
      ref: "root",
      props: {
        vmodel: this.vmodel,
        transition:
          /leave/i.test(this.transitionState) && this.noTransition
            ? { duration: 0, transition: false }
            : this.transitionConfig,
        backdrop: this.backdrop,
        zIndex: this.zIndex,
        removeContent: this.removeContent,
        contentAttrs: this.contentAttrs,
        contentStyle: this.contentStyle,
        contentClass: this.contentClass,
        contentEvent: this.contentEvent,
        raise: this.raise,
        rounded: this.rounded,
        background: this.background,
        isSheet: true,
        backdropOpacity: /afterEnter|leave/i.test(this.transitionState)
          ? `${this.backdropOpacity}`
          : undefined,
        reducedBackdropTransition: this.reducedBackdropTransition,
        label: this.label,
        hideTransitioningContent: this.hideTransitioningContent,
        fullscreen: this.fullscreen,
      },
      on: {
        ...this.$listeners,
        vmodel: (e) => {
          this.$emit("vmodel", e);
        },

        beforeEnter: (e) => {
          this.emittedAboutToScrollOut = false;

          this.$emit("beforeEnter", e);
          this.backdropOpacity = parseFloat(
            this.$refs.root.backdropConfig.opacity
          );
          this.initialBackdropOpacity = this.backdropOpacity;
        },
        afterEnter: (e) => {
          this.$emit("afterEnter", e);
          requestAnimationFrame(() => {
            if (!this.backgroundElemHeight) {
              this.backgroundElemHeight = `${e.clientHeight * 0.65}px`;
            }
          });
        },
        afterLeave: (e) => {
          this.$emit("afterLeave", e);
        },
      },
      staticClass: "ui-sheet hide-scrollbar",
      class: [
        {
          "show-background-elem":
            this.showBackgroundElem && this.renderBackgroundElem,
          "will-change": this.addWillChange,
          entered: /afterE/i.test(this.transitionState),
        },
      ],

      style: {
        "--background-elem-height": this.backgroundElemHeight,
      },

      scopedSlots: {
        prepend: (payload) => this.$scopedSlots?.prepend?.(payload),
        default: (payload) => {
          this.transitionState = payload.state;
          const thresholdLength = 200;
          return [
            this.useIntersection &&
              intersection({
                props: {
                  useAnimationFrame: false,
                  config: {
                    root: this.$el,
                    threshold: [
                      ...Array.from(
                        { length: thresholdLength },
                        (_, i) => i * (1 / thresholdLength)
                      ),
                      1,
                    ],
                  },
                },
                scopedSlots: {
                  default: (intersectionPayload) => {
                    if (/afterEn/i.test(this.transitionState)) {
                      if (!this.intersectionState.entries.boundingClientRect) {
                        requestAnimationFrame(() => {
                          this.intersectionState = intersectionPayload;
                        });
                      } else this.intersectionState = intersectionPayload;
                    } else {
                      this.intersectionState = { entries: {} };
                    }

                    this.$emit("intersection-point", intersectionPayload);
                    return div({
                      attrs: { "aria-hidden": "true" },
                      staticClass: "observer-el fill-before",
                    });
                  },
                },
              }),
            this.$scopedSlots?.default?.(payload),
          ];
        },
        append: (payload) => this.$scopedSlots?.append?.(payload),
      },
    });
  },
};
</script>

<style>
.ui-sheet.ui-dialog {
  align-items: flex-end;
  display: grid;
  grid-template-rows: 100% 100%;
  overflow: hidden auto;
  justify-content: stretch;
  scroll-snap-type: y mandatory;
  --background-elem-background: var(--theme-primary);
}

.ui-sheet.ui-dialog.will-change {
  will-change: scroll-position;
}

/* .ui-sheet.ui-dialog.entered {
  grid-template-rows: 100% auto;
}

.ui-sheet.ui-dialog.entered > .content-wrapper {
  height: fit-content;
} */

.ui-sheet.ui-dialog > .content-wrapper {
  display: flex;
  align-items: flex-end;
  scroll-snap-align: start;
  z-index: 1;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.ui-sheet.ui-dialog::before {
  content: "";
  height: 100%;
  width: 100%;
  display: block;
  scroll-snap-align: end;
}

@supports (-webkit-overflow-scrolling: touch) {
  .ui-sheet.ui-dialog::after {
    position: fixed;
    bottom: 0;
    left: 0;
    height: var(--background-elem-height);
    width: 100%;
    display: block;
    content: "";
    background-color: var(--background-elem-background);
    opacity: 0;
  }

  .ui-sheet.ui-dialog.show-background-elem::after {
    opacity: 1;
  }
}

.ui-sheet.ui-dialog > .__backdrop {
  position: fixed;
}

.ui-sheet.ui-dialog.will-change > .__backdrop {
  will-change: opacity;
}

.ui-sheet.ui-dialog .__content {
  width: 100%;
  /* border-radius: 10px 10px 0 0 !important; */
  border-radius: 0 !important;
  /* box-shadow: none !important; */
  -webkit-overflow-scrolling: touch;
}

.ui-sheet.ui-dialog .__content > .observer-el {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: transparent;
  border-radius: inherit;
}

.ui-sheet.ui-dialog .__content > .observer-el::before {
  height: 5%;
  border-top: var(--ui-divide);
  transition: 0.2s opacity;
  opacity: 0;
}

.ui-sheet.ui-dialog.will-change .__content > .observer-el::before {
  opacity: var(--t-disabled);
}
</style>
