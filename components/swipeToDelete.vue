<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "SwipeToDelete",
  data() {
    return {
      watchRightConfirm: false,
      confrimRight: true,
      rightConfirm: {},
      rightIntersection: {},
      mainIntersection: {},
      addRightBackground: false,
      addWillChange: false,
      clickAwayCalled: false,
      deleted: false,
    };
  },
  computed: {
    mainEntriesX() {
      const entriesX = this.mainIntersection?.entries?.boundingClientRect?.left;

      return entriesX || 0;
    },
  },
  watch: {
    mainIntersection() {
      if (!this.mainIntersection.isIntersecting) {
        const entriesX =
          this.mainIntersection?.entries?.boundingClientRect?.left || 0;
        if (entriesX < 0) {
          this.addRightBackground = true;
        }
      }
    },
    watchRightConfirm() {
      this.$nextTick(() => {
        if (this.watchRightConfirm) {
          this.toggleRootEvents("add");

          this.addRightBackground = true;
          return;
        }
        this.toggleRootEvents("remove");
        this.addRightBackground = false;
      });
    },
  },
  mounted() {
    this.$store.commit("FETCHED", {
      value: "swipeToDelete",
      path: "components",
    });
  },
  methods: {
    emitConfirm(dir) {
      if (!this[`${dir}Confirmed`]) {
        this.$emit(`${dir}-confirmed`);
        this[`${dir}Confirmed`] = true;
      }
    },
    toggleRootEvents(action) {
      document[`${action}EventListener`]("scroll", this.clickAway, {
        once: true,
        passive: true,
      });
      document[`${action}EventListener`]("mousedown", this.clickAway, {
        once: true,
        passive: true,
      });
      document[`${action}EventListener`]("click", this.clickAway, {
        once: true,
        capture: true,
      });
      document[`${action}EventListener`]("touchmove", this.clickAway, {
        once: true,
        passive: true,
      });
    },
    clickAway() {
      if (this.clickAwayCalled) {
        return;
      }
      this.addWillChange = true;
      this.confrimRight = false;
      requestAnimationFrame(async () => {
        this.clickAwayCalled = true;
        this.$el.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
        });
        await sleep.call(this, 500);
        this.addWillChange = false;
        this.clickAwayCalled = false;
      });
    },
  },
  render(h) {
    const scoping = { "data-stde": "" };
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const intersection = process.client
      ? (d, c) => h("ui-intersection", d, c)
      : () => null;

    return div(
      {
        attrs: { ...scoping, "aria-label": "swipe to delete" },
        staticClass: "root hide-scrollbar fill-before",
        class: [
          {
            "__right-background": this.addRightBackground,
            "add-will-change": this.addWillChange,
            deleted: this.deleted,
          },
        ],
        on:
          this.mainEntriesX < 0
            ? {
                "&touchmove": (e) => {
                  this.mainEntriesX < 0 && e.stopPropagation();
                },
                "&wheel": (e) => {
                  this.mainEntriesX < 0 && e.stopPropagation();
                },
                "&scroll": (e) => {
                  this.mainEntriesX < 0 && e.stopPropagation();
                },
                "&mousedown": (e) => {
                  this.mainEntriesX < 0 && e.stopPropagation();
                },
              }
            : undefined,
      },
      [
        intersection({
          props: {
            config: {
              threshold: [0.001, 0.99],
              rootMargin: "50% 0px",
            },
          },
          scopedSlots: {
            default: (payload) => {
              requestAnimationFrame(() => {
                this.mainIntersection = payload;
              });
              return div(
                {
                  attrs: { ...scoping },
                  staticClass: "main fill-before",
                },
                this.$slots?.default
              );
            },
          },
        }),
        intersection({
          props: {
            config: {
              rootMargin: "50% 0px",
              threshold: 0.99,
              root: this.$el,
            },
          },
          scopedSlots: {
            default: (p) => {
              requestAnimationFrame(() => {
                this.watchRightConfirm = p.isIntersecting;
                this.rightConfirm = p;
              });
              return div(
                {
                  attrs: { ...scoping, tabindex: "0", title: "delete" },
                  staticClass: "confirm fill-before-and-after",
                  style: {
                    pointerEvents: !p.isIntersecting ? "none" : undefined,
                  },
                  on: {
                    "&blur": () => {
                      this.clickAway();
                    },
                    "&!click": (e) => {
                      this.$emit("delete-clicked", e);
                      this.deleted = true;
                      this.addWillChange = true;
                      requestAnimationFrame(async () => {
                        this.$el.scrollTo({
                          left: this.$el.scrollWidth,
                          top: 0,
                          behavior: "smooth",
                        });

                        await sleep.call(this, 400);
                        this.emitConfirm("right");
                      });
                    },
                  },
                },
                [span("Delete")]
              );
            },
          },
        }),
        intersection({
          props: {
            config: {
              rootMargin: "50% 0px",
              threshold: 0.98,
              root: this.$el,
            },
          },
          scopedSlots: {
            default: (p) => {
              this.rightIntersection = p;
              return div({
                attrs: { ...scoping },
                staticClass: "delete",
              });
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-stde] {
  height: auto;
  min-height: calc(var(--swiper-size) + 1.5rem);
  width: 100%;
  display: grid;
  --delete-width: calc(100% - 8rem);
  --confirm-width: calc(100% - var(--delete-width));
  grid-template-columns:
    100% calc(100% - var(--delete-width))
    var(--delete-width);
  scroll-snap-type: x mandatory;
  overflow: auto hidden;
  isolation: isolate;
  position: relative;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  background-color: var(--theme-primary);
  -webkit-overflow-scrolling: touch;
}

.root.add-will-change[data-stde] {
  scroll-snap-type: initial;
  will-change: scroll-position;
}

.root.__right-background[data-stde] {
  background-color: initial;
  background-image: linear-gradient(
    to right,
    var(--theme-surface) 95%,
    var(--theme-surface-text) 170%
  );
}

.root[data-stde].deleted {
  pointer-events: none;
  grid-template-columns: 100% calc(100% - var(--delete-width)) var(
      --delete-width
    );
  will-change: scroll-position;
}

.root[data-stde].deleted .confirm[data-stde] {
  border-radius: 0 !important;
}

.root[data-stde].deleted .delete {
  display: block;
}

.main[data-stde] {
  width: 100%;
  height: 100%;
  background-color: var(--theme-primary);
  scroll-snap-align: end;
  position: relative;
  border-top-left-radius: inherit;
  color: inherit;
}

.main[data-stde]::before {
  height: 0px;
  bottom: 0.5px;
  top: auto;
  background-color: currentColor;
  border-bottom: 0.5px solid currentColor;
  opacity: 0.2;
  width: calc(100% - 1.5rem);
  left: 1.5rem;
  z-index: 1;
  display: grid;
}

.light-theme .main[data-stde]::before {
  opacity: 0.3;
}

.confirm[data-stde] {
  width: 100%;
  height: 100%;
  background-color: var(--error);
  color: var(--theme-surface);
  scroll-snap-align: start;
  display: grid;
  place-items: center;
  font-size: 1.175rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-top-right-radius: inherit;
  position: relative;
  outline: none;
  z-index: 1;
}

.confirm[data-stde]::before {
  background-color: currentColor;
  opacity: 0;
  transition: 0.2s opacity;
}

@media (hover: hover) and (pointer: fine) {
  .confirm[data-stde]:hover::before {
    opacity: 0.15;
  }
}

.confirm[data-stde]::after {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  top: 2px;
  left: 2px;
  border-radius: 0 10px 0 0;
}

.confirm[data-stde]:focus-visible::after {
  border: 2px solid #fff;
}

.confirm[data-stde]:active::before {
  opacity: 0.25;
}

.confirm[data-stde] span {
  display: inline-block;
  transition: 0.3s transform;
}

.confirm[data-stde]:active span {
  transform: scale3d(0.95, 0.95, 1);
}

.delete[data-stde] {
  width: 100%;
  height: 100%;
  background-color: var(--error);
  scroll-snap-align: start;
  position: relative;
  border-top-right-radius: inherit;
  display: none;
}
</style>
