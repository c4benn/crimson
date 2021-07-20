<script>
export default {
  name: "AppImg",
  props: {
    height: {
      type: [String, Number],
      default: undefined,
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    src: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "div",
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loaded: "false",
      isIntersecting: false,
    };
  },
  computed: {
    validSrc() {
      const isString = (value) => typeof value == "string";

      return !!(isString(this.src) && this.src.length);
    },
    imageLoaded() {
      if (this.hasLoaded) {
        return true;
      }

      return this.validSrc && this.loaded !== false;
    },
    events() {
      const $events = {
        "~load": () => {
          this.loaded = true;

          const url = `${this.src}`;

          !this.$c4.loadedImages.includes(url) &&
            this.$c4.loadedImages.push(url);
        },
        "~error": () => {
          this.loaded = false;
        },
      };
      if (this.loaded === true) {
        delete $events["~error"];
      }
      if (this.loaded === false) {
        delete $events["~load"];
      }
      return $events;
    },
    hasLoaded() {
      return this.$c4.loadedImages.find(
        (scr) => scr === `${this.src}-${this.alt}`
      );
    },
    selfMounted() {
      return this.$fetched.components.includes("appImg");
    },
  },

  created() {
    this.loaded = "not-rendered";

    if (this.hasLoaded) {
      this.loaded = true;
    }
  },

  mounted() {
    this.$store.commit("FETCHED", {
      value: "appImg",
      path: "components",
    });
  },

  render(h) {
    const scoping = { "data-aig": "" };
    const intersection = (d) => h("ui-intersection", d);
    const transition = (d) => h("ui-transition", d);
    const root = (d, c) => h(this.tag, d, c);
    const img = (d) => h("img", d);
    const div = (d, c) => h("div", d, c);

    const icon = h(`ui-icon`, {
      props: { name: "imageIcon" },
      class: "__icon __content",
    });

    return intersection({
      props: {
        disableIntersection: !!this.hasLoaded || this.loaded === true,
      },
      scopedSlots: {
        default: (payload) => {
          this.isIntersecting = payload.isIntersecting;

          return root(
            {
              ref: "$el",
              key: "root-key-" + this.alt || "undefined",
              props: {
                ...this.componentProps,
              },
              attrs: {
                ...this.$attrs,
                role: this.imageLoaded ? "img" : "presentation",
                "aria-label": this.alt || "missing-alt",
                // title: this.alt || "missing-alt",
                ...scoping,
              },
              staticClass: "root fill-before",
              class: [
                {
                  "no-img": !this.imageLoaded,
                  loading: this.loaded !== true,
                  "is-intersecting": this.isIntersecting,
                },
              ],
              style: {
                "--width": this.width,
                "--height": this.height,
              },
              on: {
                ...this.$listeners,
              },
            },
            [
              transition({
                props: {
                  transition: false,
                  fade: "var(--t-disabled)",
                  duration: this.isIntersecting ? "250ms" : "0s",
                  ease: "ease",
                },
                scopedSlots: {
                  default: () => {
                    return (
                      this.loaded !== true &&
                      div(
                        {
                          key: this.loaded,
                          attrs: { ...scoping, "aria-hidden": "true" },
                          staticClass: "loading-wrap fill-before-and-after",
                        },
                        [
                          div({
                            key: "item",
                            attrs: { ...scoping },
                            staticClass: "loading-item",
                          }),
                        ]
                      )
                    );
                  },
                },
              }),
              this.imageLoaded
                ? img({
                    ref: "$img",
                    key: "img-key-" + this.alt || "undefined",
                    attrs: {
                      loading: !this.hasLoaded ? "lazy" : undefined,
                      decoding: "async",
                      width: this.width,
                      height: this.height,
                    },
                    domProps: {
                      src: this.src,
                      alt: this.alt,
                    },
                    staticClass: "__content",
                    style: this.loaded !== true ? `opacity:0;` : undefined,
                    on: { ...this.events },
                  })
                : icon,
              this.$scopedSlots?.default?.(this.loaded),
            ]
          );
        },
      },
    });
    // intersection({
    //   props: {
    //     once: true,
    //     config: {
    //       rootMargin: "16px",
    //     },
    //     disableIntersection: !!this.hasLoaded,
    //   },
    //   scopedSlots: {
    //     default: (payload) => {
    //       return ;
    //     },
    //   },
    // }),
  },
};
</script>

<style>
.root[data-aig] {
  overflow: hidden;
  position: relative;
  isolation: isolate;
  --defaultTransition: opacity 0.2s cubic-bezier(0.52, 0.16, 0.24, 1);
}

.root[data-aig]:not(.is-intersecting) {
  --defaultTransition: none;
}

/* .root[data-aig]::before {
  opacity: 0;
  z-index: 10;
  display: block;
  transition-property: opacity, transform, display, filter;
  transition-duration: 0.3s;
}

.root[data-aig]:empty::before {
  opacity: 0.1;
  background: currentColor;
} */

.root[data-aig] > * {
  transition: var(--defaultTransition);
  border-radius: inherit;
}

.root[data-aig] > img {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

.loading-wrap[data-aig] {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--theme-primary);
  border-radius: inherit;
  --_size: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(1.25);
}

.dark-theme .loading-wrap[data-aig] {
  --t-disabled: 0.35;
}

.light-theme .loading-wrap[data-aig] {
  --t-disabled: 0.5;
}

.loading-item[data-aig],
.loading-wrap[data-aig]::before,
.loading-wrap[data-aig]::after {
  --_size: 1rem;
  border-radius: 50%;
  color: inherit;
  background: currentColor;
  filter: brightness(0.75);
  opacity: var(--t-disabled);
  border: var(--ui-divide);
}

.loading-wrap[data-aig]::before,
.loading-wrap[data-aig]::after {
  top: 50%;
  --transform-offset: calc(var(--_size) * 1.4);
}

.loading-wrap[data-aig]::before {
  left: 50%;
  transform: translate(calc(-50% - var(--transform-offset)), -50%);
}

.loading-wrap[data-aig]::after {
  right: 50%;
  left: auto;
  transform: translate(calc(50% + var(--transform-offset)), -50%);
}
</style>
