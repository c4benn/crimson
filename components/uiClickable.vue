<script>
import { eventKey, nextFrame, vibrate } from "./utils/main";
export default {
  name: "UiClickable",
  props: {
    persistent: {
      type: Boolean,
      default: undefined,
    },
    persistentOffset: {
      type: Number,
      default: 80,
    },
    tag: {
      type: String,
      default: "button",
    },
    native: Boolean,
    to: {
      type: [String, Object],
      default: () => undefined,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    pseudoActive: false,
    activeEvent: "",
    slowActiveTransition: null,

    boundingClient: { empty: true },
  }),
  watch: {
    pseudoActive(n) {
      this.$emit("pseudo-active", n, this.$el);
    },
    "$breakpoints.matches"() {
      this.pseudoActive = false;
      this.slowActiveTransition = false;
      this.boundingClient = { empty: true };
    },
  },
  methods: {
    getEvents(native) {
      const emit = (evt, e) => {
        // !native && this.$emit(evt, e)
      };
      const active = (val) => {
        if (!val) {
          this.pseudoActive = val;
          this.slowActiveTransition = val;
          this.boundingClient = { empty: true };
        } else this.pseudoActive = val;
      };
      const activeEvent = (val) => (this.activeEvent = val);

      const state = this.$store.state;
      const isTouchDevice = state.isTouchDevice;
      const isStrictTouchDevice = state.isStrictTouchDevice;

      const returnValue = {
        "&!touchstart": (e) => {
          activeEvent("touch");

          emit("touchstart", e);

          active(true);
        },
        "&!touchmove": (e) => {
          if (this.activeEvent != "touch") {
            return;
          }

          emit("touchmove", e);

          this.$nextTick(() => {
            if (this.persistent && this.boundingClient.empty) {
              const bound = this?.$el?.getBoundingClientRect?.() || {};

              const $bound = (path) => bound[path] || 0;

              const $pageYOffset = pageYOffset;
              const $pageXOffset = pageXOffset;

              this.boundingClient = {};

              this.boundingClient.top = $bound("top") + $pageYOffset;
              this.boundingClient.bottom = $bound("bottom") + $pageYOffset;

              this.boundingClient.left = $bound("left") + $pageXOffset;
              this.boundingClient.right = $bound("right") + $pageXOffset;
            }

            const touchValues = {
              pageX: e.touches[0].pageX,
              pageY: e.touches[0].pageY,
              elTop: this.boundingClient.top,
              elLeft: this.boundingClient.left,
              elBottom: this.boundingClient.bottom,
              elRight: this.boundingClient.right,
            };

            const offset = this.persistentOffset + 1;

            if (this.persistent) {
              const moreThanTop =
                touchValues.pageY + offset <= touchValues.elTop;
              const moreThanBottom =
                touchValues.elBottom + offset <= touchValues.pageY;
              const moreThanLeft =
                touchValues.pageX + offset <= touchValues.elLeft;
              const moreThanRight =
                touchValues.elRight + offset <= touchValues.pageX;

              if (!this.boundingClient.empty) {
                this.pseudoActive = !(
                  moreThanTop ||
                  moreThanBottom ||
                  moreThanLeft ||
                  moreThanRight
                );

                this.slowActiveTransition = this.pseudoActive;
              }
            } else active(false);
          });
        },
        "&!touchend": async (e) => {
          emit("touchend", e);

          if (this.activeEvent == "touch") {
            if (this.persistent) {
              if (!this.boundingClient.empty && this.pseudoActive) {
                vibrate();

                // e.currentTarget?.click?.();

                await nextFrame();

                this.$emit("active-click", e);
              }
            }

            active(false);
          }
        },
        "&!touchcancel": (e) => {
          emit("touchcancel", e);

          active(false);
        },
        "&!mousedown": (e) => {
          activeEvent("mouse");

          emit("mousedown", e);

          if (!isStrictTouchDevice) {
            active(true);
          }
        },
        "&!mousemove": (e) => {
          emit("mousemove", e);

          requestAnimationFrame(() => {
            if (!isStrictTouchDevice && this.activeEvent == "mouse") {
              active(false);
            }
          });
        },
        "&!mouseup": (e) => {
          emit("mouseup", e);

          if (!isStrictTouchDevice && this.activeEvent == "mouse") {
            active(false);
          }
        },
        "!keydown": async (e) => {
          emit("keydown", e);
          if (/space|enter/i.test(eventKey(e))) {
            e.preventDefault();
            if (!this.readonly) {
              active(true);

              await nextFrame();

              e.currentTarget?.click?.();
            }
          }
        },
        "!keyup": (e) => {
          emit("keyup", e);
          if (/space|enter/i.test(eventKey(e))) {
            e.preventDefault();
            if (!this.readonly) {
              e.currentTarget?.click?.();

              active(false);
            }
          }
        },
        "&!blur": (e) => {
          emit("blur", e);
          active(false);
        },
        "&!click": (e) => {
          emit("click", e);
          active(false);
        },
      };

      Object.keys(returnValue).forEach((x) => {
        if (!isTouchDevice && /touch/.test(x)) {
          return delete returnValue[x];
        }

        if (isStrictTouchDevice && /mouse/.test(x)) {
          delete returnValue[x];
        }
      });

      return returnValue;
    },
  },
  render(h) {
    const componentEvents = (native) => this.getEvents(native);

    return h(
      this.tag,
      {
        attrs: { ...this.$attrs },
        class: [
          {
            "click-persistent": this.persistent,
            "slow-active": this.slowActiveTransition,
            Active: this.pseudoActive,
          },
        ],
        on: {
          ...this.$listeners,
          ...componentEvents(),
        },
        props: {
          to: this.to,
          ...this.componentProps,
        },
        nativeOn: /nuxt-?link|router-?link/i.test(this.tag)
          ? {
              ...componentEvents(true),
            }
          : undefined,
      },
      this.$slots.default
    );
  },
};
</script>
