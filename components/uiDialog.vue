<script>
/* eslint-disable prefer-const */
/* eslint-disable prefer-const */
import Vue from "vue";

import {
  zIndex,
  convertSeconds,
  eventKey as EventKey,
} from "~/components/utils/main";

export default {
  name: "UiDialog",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    addedZIndex: {
      type: Number,
      default: 0,
    },
    transition: {
      type: [String, Object, Boolean],
      default: "scale(1.25)",
    },
    backdrop: {
      type: [String, Object, Number, Boolean],
      default: () => true,
    },
    backdropOpacity: {
      type: [String, Number],
      default: undefined,
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
    contentTag: {
      type: String,
      default: "section",
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
    restoreFocus: {
      type: Boolean,
      default: true,
    },
    isSheet: Boolean,
    reducedBackdropTransition: Boolean,
    contentWrapperData: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "dialog",
    },
    hideTransitioningContent: Boolean,
    fullscreen: Boolean,
  },
  data() {
    return {
      transitionState: "",
      stored_zIndex: "",
      previousFocus: null,

      rootKey: 0,
    };
  },
  computed: {
    v_model() {
      return {
        isActive: this.vmodel,
        open: () => this.$emit("vmodel", true),
        close: () => this.$emit("vmodel", false),
        toggle: () => this.$emit("vmodel", !this.vmodel),
      };
    },
    payload() {
      return {
        state: this.transitionState,
        zIndex: parseFloat(this.stored_zIndex),
        content: this.$refs.content,
        ...this.v_model,
      };
    },
    transitionConfig() {
      let duration = { enter: "350", leave: "300" };
      let output = {
        duration,
        transition: "scale(1.2)",
        fade: true,
      };

      if (typeof this.transition == "undefined" || this.transition === true) {
        return output;
      }

      if (this.transition === false) {
        output.duration = { enter: "0s", leave: "0s" };
        output.fade = false;
        output.transition = false;
        return output;
      }

      if (typeof this.transition == "string") {
        output.transition = this.transition;
        return output;
      }

      if (typeof this.transition == "object") {
        output = { ...output, ...this.transition };
        let $duration = this.transition.duration;
        if (/string|number/.test($duration)) {
          output.duration.enter = $duration;
          output.duration.leave = $duration;
        }
        if (typeof $duration == "object") {
          duration = { ...duration, ...$duration };
          output.duration = duration;
        }
        return output;
      }
      return output;
    },
    getTransitionDuration() {
      let $duration = this.transitionConfig.duration;

      if (this.v_model.isActive) {
        if (typeof $duration == "object" && $duration.enter) {
          $duration = $duration.enter;
        }
        return convertSeconds($duration);
      }

      if (typeof $duration == "object" && $duration.leave) {
        $duration = $duration.leave;
      }

      return convertSeconds($duration);
    },
    backdropConfig() {
      if (this.backdrop === false) {
        return {};
      }

      let config = {
        background: "#000",
        opacity: "0.4",
      };

      if (this.backdrop === true) {
        return config;
      }

      if (/string|number/.test(typeof this.backdrop)) {
        let parse = Math.abs(parseFloat(this.backdrop));
        if (isNaN(parse)) {
          config.background = this.backdrop;
        }
        if (isFinite(parse) && parse >= 0 && parse <= 1) {
          config.opacity = parse;
        }
        return config;
      }

      if (typeof this.backdrop === "object") {
        if (/string|number/.test(typeof this.backdrop.opacity)) {
          let opacity = Math.abs(parseFloat(this.backdrop.opacity));
          if (isFinite(opacity) && opacity >= 0 && opacity <= 1) {
            config.opacity = `${opacity}`;
          }
        }
        if (typeof this.backdrop.background == "string") {
          config.background = this.backdrop.background;
        }
        return config;
      }
      return config;
    },
    hasBackdrop() {
      return Object.keys(this.backdropConfig).length;
    },
    canRenderAdditional() {
      return (
        /afterEnter|leave/i.test(this.transitionState) &&
        !/afterLeave/i.test(this.transitionState)
      );
    },
    showAppend() {
      if (!this.removeAppend) {
        return this.canRenderAdditional;
      }
      return true;
    },
    showPrepend() {
      if (!this.removePrepend) {
        return this.canRenderAdditional;
      }
      return true;
    },
    overlayObjectPath() {
      return /uiSheet/i.test(this.$parent._name) ? this.$parent : this;
    },
    latestOverlay() {
      return this.$c4.overlays.slice(-1)?.[0];
    },
    isHidden() {
      return this.latestOverlay?._uid != this.overlayObjectPath._uid;
    },
  },
  watch: {
    "v_model.isActive"(n) {
      if (n) {
        this.transitionState = "beforeEnter";

        Vue.set(this.$c4, "overlays", [
          ...this.$c4.overlays,
          this.overlayObjectPath,
        ]);
        this.previousFocus = document?.activeElement || null;

        this.stored_zIndex = zIndex.call(this) + this.addedZIndex;
      } else {
        this.transitionState = "beforeLeave";
      }
    },
  },

  mounted() {
    this.updateNodeMethods();
  },

  updated() {
    this.updateNodeMethods();
  },

  beforeDestroy() {
    Vue.set(
      this.$c4,
      "componentZIndex",
      this.$c4.componentZIndex.filter(
        (x) => x._uid != this.overlayObjectPath._uid
      )
    );

    Vue.set(
      this.$c4,
      "overlays",
      this.$c4.overlays.filter((x) => x._uid != this.overlayObjectPath._uid)
    );
  },

  methods: {
    updateNodeMethods() {
      this.$nextTick(() => {
        this.$el.open = this.v_model.open;
        this.$el.close = this.v_model.close;
        this.$el.toggle = this.v_model.toggle;
      });
    },
    afterLeaveCallback({ clearZIndex }) {
      Vue.set(
        this.$c4,
        "componentZIndex",
        this.$c4.componentZIndex.filter(
          (x) => x._uid != this.overlayObjectPath._uid
        )
      );

      Vue.set(
        this.$c4,
        "overlays",
        this.$c4.overlays.filter((x) => x._uid != this.overlayObjectPath._uid)
      );

      if (clearZIndex) {
        !this.vmodel &&
          this.$nextTick(() => {
            this.stored_zIndex = "auto";
            this.stored_zIndex = "";
          });
      } else if (!this.vmodel) {
        this.rootKey += 1;
      }

      if (this.restoreFocus) {
        const previousFocus =
          this?.latestOverlay?.$el?.querySelector?.(".__content") ||
          this?.latestOverlay?.$el ||
          this.previousFocus;

        try {
          previousFocus.focus();
        } catch (e) {
          if (e) {
            document.body.focus?.();
          }
        }
      }
    },
  },

  render(h) {
    const main = (d, c) => h("main", d, c);
    const div = (d, c) => h("div", d, c);
    const transition = (d, c) => h("ui-transition", d, c);
    const span = (d, c) => h("span", d, c);
    const content = (d, c) => h(this.contentTag, d, c);

    const repeatedTypeRegExp = new RegExp(`${this.type}\\s+${this.type}$`, "g");

    const hideAria = {
      tabindex: this.isHidden || !this.v_model.isActive ? "-1" : "0",
      "aria-hidden":
        this.isHidden || !this.v_model.isActive ? "true" : undefined,
      // hidden: this.isHidden || !this.v_model.isActive ? "true" : undefined,
    };

    const label = `${this.label} ${this.type}`
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(repeatedTypeRegExp, this.type);

    return main(
      {
        // key: this.rootKey,
        attrs: {
          id: `${label.replace(/\s+/g, "-")}-root`,
          "aria-label": label,
          ...this.$attrs,
          role: "dialog",
          "aria-expanded": `${this.v_model.isActive}`,
          ...hideAria,
        },
        class: [
          "ui-dialog",
          { __active: this.v_model.isActive, __fullscreen: this.fullscreen },
        ],
        style: {
          zIndex: this.stored_zIndex || undefined,
          // touchAction: this.v_model.isActive ? "none" : undefined,
          pointerEvents: /beforeLeave|^leave/i.test(this.transitionState)
            ? "initial"
            : undefined,
          willChange: /^before|^enter|^leave/i.test(this.transitionState)
            ? "contents"
            : undefined,
        },
        on: {
          ...this.$listeners,
          mousedown: (e) => {
            /afterE/i.test(this.transitionState) &&
              this.$nextTick(this.v_model.close);
            this.$emit("mousedown", e);
          },
          keydown: (e) => {
            const eventKey = EventKey(e);

            if (eventKey == "tab" && this.type == "menu") {
              e.preventDefault();

              this.v_model.close();
            }
          },
          keyup: (e) => {
            let eventKey = EventKey(e);

            if (/esc/i.test(eventKey)) {
              this.v_model.close();
            }
            this.$emit("keyup", e);
          },
        },
      },
      [
        this.hasBackdrop &&
          div({
            ref: "backdrop",
            attrs: {
              "aria-label": this.v_model.isActive
                ? "click to close"
                : undefined,
            },
            staticClass: "__backdrop",
            style: {
              background: this.backdropConfig.background,
              opacity:
                this.v_model.isActive &&
                /enter|afterE/i.test(this.transitionState)
                  ? `${this.backdropOpacity || this.backdropConfig.opacity}`
                  : "0",
              "--transition": this.reducedBackdropTransition
                ? `0ms`
                : `${this.getTransitionDuration * 0.75}ms opacity ease`,
              // willChange: /^before|^enter|^leave/i.test(this.transitionState)
              //   ? "opacity"
              //   : undefined,
            },
          }),
        this.canRenderAdditional &&
          span({
            ref: "focus-trap-1",
            key: "focus-trap-1",
            attrs: { tabindex: "0", "aria-hidden": "true" },
            on: {
              focus: () => {
                this.$refs.content?.focus?.();
              },
            },
          }),
        this.showAppend ? this.$scopedSlots?.prepend?.(this.payload) : null,
        // this.isSheet &&
        //   div({
        //     attrs: { "aria-hidden": "true" },
        //     staticClass: "false-el",
        //   }),
        div(
          {
            ref: "content-wrapper",
            ...this.contentWrapperData,
            staticClass: `content-wrapper${
              this.contentWrapperData?.staticClass
                ? ` ${this.contentWrapperData.staticClass}`
                : ""
            }`,
          },
          [
            transition({
              key: "transition-wrapper",
              props: {
                ...this.transitionConfig,
                group: false,
              },
              on: {
                beforeEnter: (e) => {
                  this.$emit("beforeEnter", e);
                },
                enter: (e) => {
                  this.$emit("enter", e);
                },
                enterCancelled: (e) => {
                  this.$emit("enterCancelled", e);
                  this.afterLeaveCallback({ clearZIndex: false });
                },
                afterEnter: (e) => {
                  e?.focus?.();
                  this.$emit("afterEnter", e);
                },
                beforeLeave: (e) => {
                  this.$emit("beforeLeave", e);
                },
                leave: (e) => {
                  this.$emit("leave", e);

                  if (
                    !this.$c4.overlays?.filter(
                      (x) => x._uid != this.overlayObjectPath._uid
                    )?.length
                  ) {
                    const html = document.documentElement;

                    this.$nextTick(() => html.classList.add("no-overlay"));
                  }
                },
                leaveCancelled: (e) => {
                  this.$emit("leaveCancelled", e);
                  e?.focus?.();
                },
                afterLeave: (e) => {
                  this.$emit("afterLeave", e);

                  this.afterLeaveCallback({ clearZIndex: true });
                },
              },
              scopedSlots: {
                default: (p) => {
                  this.transitionState = p;
                  const $content = content(
                    {
                      ref: "content",
                      key: "content",
                      attrs: {
                        role: "document",
                        ...this.contentAttrs,
                        ...hideAria,
                      },
                      staticClass: "__content",
                      class: [
                        this.contentClass,
                        {
                          __rounded: this.rounded,
                          "raise-dark": this.raise,
                          transitioning: /before|^ent|^lea/i.test(p),
                          "hide-transitioning-content": this
                            .hideTransitioningContent,
                        },
                        this.background,
                      ],
                      style: this.contentStyle,
                      on: {
                        ...this.contentEvent,
                        "&mousedown": (e) => {
                          e.stopPropagation();
                          this.$emit("content-mousedown", e);
                        },
                        "&wheel": (e) => {
                          e.stopPropagation();
                          this.$emit("content-wheel", e);
                        },
                        "&touchstart": (e) => {
                          e.stopPropagation();
                          this.$emit("content-touchstart", e);
                        },
                      },
                      directives: !this.removeContent
                        ? [
                            {
                              name: "show",
                              value: this.v_model.isActive,
                            },
                          ]
                        : undefined,
                    },
                    [this.$scopedSlots?.default?.(this.payload)]
                  );

                  if (this.removeContent) {
                    return this.v_model.isActive && $content;
                  } else return $content;
                },
              },
            }),
          ]
        ),
        this.showPrepend ? this.$scopedSlots?.append?.(this.payload) : null,
        this.canRenderAdditional &&
          span({
            ref: "focus-trap-2",
            key: "focus-trap-2",
            attrs: { tabindex: "0", "aria-hidden": "true" },
            on: {
              "&focus": () => {
                this.$refs.content?.focus?.();
              },
            },
          }),
      ]
    );
  },
};
</script>

<style>
.ui-dialog {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: -1000;
  overscroll-behavior: contain;
  outline: none !important;
}

.ui-dialog.__fullscreen .__content {
  height: var(--full-dialog);
}

/* .dark-theme .ui-dialog {
  --theme-primary: #202020;
} */

.ui-dialog .__content.__default-background {
  background-color: var(--theme-primary);
}

.ui-dialog.__active {
  pointer-events: initial;
}

.ui-dialog > .__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: var(--transition);
}

.ui-dialog > .content-wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}

.ui-dialog .__content {
  z-index: 1;
  overflow: hidden;
  isolation: isolate;
  min-height: 2rem;
  max-height: 100vh;
  min-width: 2rem;
  max-width: 100%;
  outline: none;
  position: relative;
}

.ui-dialog .__content.transitioning.hide-transitioning-content > * {
  opacity: 0 !important;
}

.ui-dialog .__content.__rounded {
  border-radius: 8px;
}
</style>
