<script>
import { springPresets, vibrate } from "~/components/utils/main";
export default {
  name: "SavedBtn",

  props: {
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      saved: false,
      transitionState: "",

      componentMounted: false,
      selfName: "savedBtn",

      rootKey: 0,
    };
  },

  mounted() {
    this.$store.commit("FETCHED", {
      value: "savedBtn",
      path: "components",
    });
  },

  render(h) {
    const scoping = { "data-sbn": "" };
    const btn = (d, c) => h("ui-btn", d, c);
    const div = (d, c) => h("div", d, c);
    const transition = (d) => h("ui-transition", d);

    return btn(
      {
        key: this.rootKey,
        attrs: {
          ...scoping,
          role: "checkbox",
          "aria-checked": `${this.saved ? "true" : "false"}`,
          "aria-label": `${this.saved ? "saved" : "save"}`,
          title: this.title || `${this.saved ? "saved" : "click to save"}`,
        },
        class: "root",
        props: {
          icon: true,
          flat: true,
          // readonly: /leave/i.test(this.transitionState),
          ...this.componentProps,
        },
        on: {
          click: async (e) => {
            vibrate();
            e.stopPropagation();
            e.preventDefault();
            this.saved = !this.saved;
            this.$emit("click", e);

            await this.$nextTick();

            this.$emit("toggled", this.saved, e);
          },
          mousedown: (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          // touchstart: (e) => {
          //   e.stopPropagation();
          //   e.preventDefault();
          // },
          // touchend: (e) => {
          //   e.stopPropagation();
          //   e.preventDefault();
          //   e.currentTarget.click();
          // },
        },
      },
      [
        transition({
          props: {
            transition: {
              enter: this.saved ? "scale(1,-0.1)" : "scale(0.9)",
              leave: this.saved ? "scale(0.75)" : "scale(1,-0.1)",
            },
            type: this.saved ? { enter: "spring" } : undefined,
            springConfig: springPresets.savedAnim,
            // transition: "slide-y(4px)",
            origin: {
              leave: !this.saved ? "top" : undefined,
              enter: this.saved ? "top" : undefined,
            },
            ease: "ease",
            duration: {
              enter: "0.3s",
              leave: !this.saved ? "0.3s" : "0.15s",
            },
            // delay: {
            //   enter: !this.saved ? 50 : undefined,
            // },
          },
          on: {
            enterCancelled: () => {
              this.rootKey += 1;
            },
            leaveCancelled: () => {
              this.rootKey += 1;
            },
          },
          scopedSlots: {
            default: (payload) => {
              this.transitionState = payload;
              return div(
                {
                  key: `${this.saved}`,
                  attrs: {
                    ...scoping,
                    "aria-label": `bookmark${
                      this.saved ? "" : "-outline"
                    } icon`,
                    role: "img",
                  },
                },
                [
                  h("dynamic-bookmark", {
                    props: {
                      saved: this.saved,
                    },
                  }),
                ]
              );
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-sbn] {
  --icon__size-md: 30px !important;
  background-color: transparent !important;
}

.root[data-sbn] svg {
  width: 20px !important;
  height: 20px !important;
}

/* .root[data-sbn]::before {
  opacity: 0.05;
}

.dark-theme .root[data-sbn]::before {
  opacity: 0.03;
} */

div[role][data-sbn] {
  pointer-events: none;
  overflow: hidden;
  display: grid;
  place-items: center;
}

div[role][data-sbn] > * {
  opacity: var(--t-caption);
}
</style>
