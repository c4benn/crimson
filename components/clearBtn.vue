<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "ClearBtn",
  props: {
    size: {
      type: String,
      default: "sm",
    },
    root: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: "Clear",
    },
    color: {
      type: String,
      default: undefined,
    },
    background: {
      type: String,
      default: undefined,
    },
    disabled: Boolean,
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      expanded: false,
      cleared: false,
      transitionState: "",
      zIndex: undefined,
      screenScrolled: false,
    };
  },
  watch: {
    async zIndex() {
      if (this.zIndex) {
        await sleep.call(this, 416);
        this.zIndex = undefined;
      }
    },
    cleared() {
      if (this.cleared) {
        this.$nextTick(() => {
          this.removeEvents();
        });
      }
    },
  },
  mounted() {
    this.$store.commit("FETCHED", {
      value: "clearBtn",
      path: "components",
    });
  },
  methods: {
    async collapse(e) {
      if (!this.cleared && this.expanded) {
        if (/touchmove|wheel/i.test(e.type)) {
          this.screenScrolled = true;
          await sleep.call(this, 1);
        }
        this.zIndex = `11000`;
        await sleep.call(this, 16);
        requestAnimationFrame(() => {
          this.expanded = false;
          this.$emit("ui-collapsed", e);
        });
      }
    },
    addEvents() {
      this.$nextTick(async () => {
        await sleep.call(this, 16, true);

        const root = document.querySelector?.(this.root);

        if (root) {
          root.addEventListener("mouseup", this.collapse, { passive: true });
          root.addEventListener("touchmove", this.collapse, { passive: true });
          root.addEventListener("wheel", this.collapse, { passive: true });
        }
      });
    },
    removeEvents() {
      const root = document.querySelector?.(this.root);

      if (root) {
        root.removeEventListener("mouseup", this.collapse, { passive: true });
        root.removeEventListener("touchmove", this.collapse, { passive: true });
        root.removeEventListener("wheel", this.collapse, { passive: true });
      }
    },
  },
  render(h) {
    const scoping = { "data-cbn": "" };
    const btn = (d, c) => h("ui-btn", d, c);
    const transition = (d) => h("ui-transition", d);
    const intersection = (d) => h("ui-intersection", d);
    const p = (d, c) => h("p", d, c);

    return intersection({
      props: {
        once: true,
      },
      scopedSlots: {
        default: (Payload) => {
          if (Payload?.isIntersecting) {
            this.addEvents();
          }
          return btn(
            {
              props: {
                shape: "circle",
                raise: false,
                icon: true,
                case: "initial",
                size: "sm",
                color: this.color,
                background: this.background,
                disabled: this.disabled,
                ...this.componentProps,
              },
              attrs: {
                ...scoping,
                title: this.expanded
                  ? `${this.text}`.toLowerCase()
                  : `click to ${this.text}`.toLowerCase(),
                ...this.$attrs,
              },
              staticClass: "root",
              class: [{ expanded: this.expanded, cleared: this.cleared }],
              style: {
                zIndex: this.zIndex,
                willChange: this.zIndex ? "width" : undefined,
                width: this.expanded
                  ? `${this.text.length + 2.5}ch`
                  : undefined,
              },
              on: {
                click: async (e) => {
                  e.stopPropagation();

                  this.screenScrolled = false;
                  this.$emit("click", e);
                  if (!this.expanded) {
                    this.zIndex = `11000`;
                    await sleep.call(this, 16);
                    return requestAnimationFrame(() => {
                      this.expanded = true;
                      this.$emit("ui-expanded", e);
                    });
                  }
                  if (this.expanded) {
                    this.cleared = true;
                    await sleep.call(this, 266, true);
                    this.$emit("ui-cleared", e);
                  }
                },
                mouseup: (e) => {
                  e.stopPropagation();
                },
              },
            },
            [
              transition({
                props: {
                  fade: {
                    leave: true,
                    enter: !this.expanded ? 0.8 : true,
                  },
                  transition: this.screenScrolled
                    ? false
                    : {
                        enter: this.expanded ? "slide-x(25%)" : "none",
                        leave: this.expanded ? "none" : "slide-x(25%)",
                      },
                  duration: "0.175s",

                  ease: "ease",
                },
                scopedSlots: {
                  default: (payload) => {
                    this.transitionState = payload;

                    if (this.cleared) {
                      return null;
                    }

                    return this.expanded
                      ? p(
                          { attrs: { ...scoping }, staticClass: "text" },
                          this.text
                        )
                      : h(`mdi-close`, {
                          props: {
                            size: 20,
                          },
                        });
                  },
                },
              }),
            ]
          );
        },
      },
    });
  },
};
</script>

<style>
.root[data-cbn] {
  transition-property: width, opacity !important;
  transition-duration: 0.25s !important;
  border-radius: var(--pill) !important;
  transition-delay: 4ms;
  max-width: none !important;
}

.root[data-cbn].expanded {
  transition-delay: 16ms;
}

@media (prefers-reduced-motion: reduce) {
  .root[data-cbn] {
    transition: 0s !important;
  }
}

.root.cleared[data-cbn] {
  opacity: 0;
}

.text[data-cbn] {
  line-height: 1px;
  vertical-align: top;
  font-size: 0.85rem;
}
</style>
