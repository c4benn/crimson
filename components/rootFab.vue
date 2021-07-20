<script>
export default {
  name: "RootFab",
  computed: {
    footerIntersection() {
      const intersection = this.$store.state.footerIntersection;
      return {
        addTransition: !intersection.isIntersecting,
        translate: `-${intersection.height}px`,
        willChange: intersection.isIntersecting,
      };
    },
  },
  render(h) {
    const scoping = { "data-rfb": "" };
    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const transition = (d, c) => h("ui-transition", d, c);

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root",
        class: [
          {
            transition: this.footerIntersection.addTransition,
            "will-change":
              !this.$c4.overlays.length && this.footerIntersection.willChange,
          },
        ],
        style: {
          "--y": this.footerIntersection.translate,
        },
      },
      [
        transition({
          props: {
            transition: "scale(0.5)",
            ease: "ease",
            fade: true,
            delay: {
              enter: 300,
            },
          },
          scopedSlots: {
            default: (payload) => {
              return !/\/bag/i.test(this.$route.path)
                ? btn(
                    {
                      props: {
                        size: "lg",
                        raise: false,
                        background: "warning",
                        shape: "circle",
                        tag: "nuxt-link",
                        to: "/bag",
                      },
                      attrs: { ...scoping, title: "bag" },
                      staticClass: "fab",
                      class: [{ __transitioning: !/afterE|^$/i.test(payload) }],
                    },
                    [
                      icon({
                        props: {
                          name: "shopping",
                        },
                      }),
                    ]
                  )
                : null;
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-rfb] {
  position: fixed;
  height: calc(100% - var(--app-bars-height));
  width: 100%;
  left: 0;
  top: 0;
  z-index: 9999;
  pointer-events: none;
  transform: translate3d(0, calc(var(--header-height) + var(--y)), 0);
  transition: 0.15s linear;
  isolation: isolate;
}

.root[data-rfb].will-change {
  will-change: transform;
}

.root[data-rfb].transition {
  transition: 0.45s transform ease;
}

.fab[data-rfb] {
  touch-action: none !important;
  --btn__size-lg: 64px;
  box-shadow: var(--raise-dark);
  position: absolute;
  right: 0.5rem;
  bottom: 1rem;
  pointer-events: initial;
}

.fab[data-rfb]:active,
.fab[data-rfb].Active:not(:active) {
  transform: scale3d(0.925, 0.925, 1) !important;
  opacity: 1 !important;
}

.fab[data-rfb].__transitioning {
  pointer-events: none;
}
</style>
