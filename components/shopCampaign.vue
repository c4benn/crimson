<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ShopCampaign",

  props: {
    campaignName: {
      type: String,
      required: true,
    },
    campaignDate: {
      type: String,
      required: true,
    },
    isNew: Boolean,
    img: {
      type: Object,
      default: () => ({
        src: "undefined",
        alt: "missing alt",
      }),
    },
  },
  data() {
    return {
      mainPayload: {},
      headerPayload: {},
      pseudoPL: {},
      gridPayload: {},

      renderedComponents: ["shopGrid", "appImg"],
    };
  },

  computed: {
    ...uiMount.computed,

    headerHeight() {
      return (
        this.$el?.closest?.("#ui-root")?.querySelector?.("#app-header")
          ?.clientHeight || 0
      );
    },
    pseudoBackgroundOpacity() {
      const entries = this.gridPayload?.entries || {};
      const gridPayloadBound = entries?.boundingClientRect;

      // if (!gridPayloadBound) {
      //   return 1;
      // }

      const entriesBottom = gridPayloadBound?.bottom || 1;

      if (entriesBottom <= 0) {
        return 1;
      }

      if (this.mainPayload.isIntersecting && !this.pseudoPL.isIntersecting) {
        let returnValue = entries.intersectionRatio * 1.25;
        const entriesY = entries?.boundingClientRect?.y || 1;

        if (
          this.$store.state.userPreference.reduceMotion &&
          returnValue > 0.0
        ) {
          return 1;
        }

        if (returnValue >= 0.99 || entriesY <= 0 || entriesBottom <= 0) {
          returnValue = 1;
        }
        return returnValue;
      } else return 0;
    },

    fillTitle() {
      return this.mainPayload.isIntersecting && !this.pseudoPL.isIntersecting;
    },
  },

  watch: {
    ...uiMount.watch,
  },

  mounted() {
    this.mountSelf();
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: "shopCampaign",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-scn": "" };
    const intersection = (d, c) => h("ui-intersection", d, c);
    const section = (d, c) => h("section", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const img = (d) => h("app-img", d);
    const span = (d, c) => h("span", d, c);
    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("uiBtn", d, c);
    const shopGrid = (d, c) => h("shop-minimal-grid", d, c);

    return intersection({
      scopedSlots: {
        default: ($PL) => {
          this.mainPayload = $PL;

          return section(
            {
              attrs: { ...scoping },
              staticClass: "root fill-after",
              style: {
                zIndex:
                  this.mainPayload.isIntersecting &&
                  !this.pseudoPL.isIntersecting
                    ? "400"
                    : undefined,
              },
            },
            [
              intersection({
                props: {
                  config: {
                    threshold: 1,
                    rootMargin: `-${this.headerHeight}px 0px 0px`,
                  },
                  useAnimationFrame: false,
                },
                scopedSlots: {
                  default: (pseudo) => {
                    this.pseudoPL = pseudo;

                    return span({
                      attrs: {
                        ...scoping,
                        "aria-hidden": "true",
                      },
                      class: "observer",
                    });
                  },
                },
              }),
              h3(
                {
                  attrs: { ...scoping },
                  staticClass: "title fill-before-and-after",
                  class: [
                    {
                      intersecting: this.fillTitle,
                    },
                  ],
                },
                [
                  span({
                    staticClass: "line-clamp-2",
                    domProps: {
                      innerHTML: `${
                        this.isNew ? `<span class='badge'>*New*</span> ` : ""
                      }${this.campaignName} Campaign. <strong>${
                        this.campaignDate
                      }</strong>`,
                    },
                  }),
                ]
              ),
              img({
                props: {
                  src: this.img.src,
                  alt: this.img.alt,
                },
                class: [
                  "background",
                  { "hide-img": this.pseudoBackgroundOpacity == 1 },
                ],
                scopedSlots: {
                  default: () => {
                    return div({
                      attrs: {
                        ...scoping,
                        "aria-hidden": "true",
                      },
                      class: ["pseudo-background"],
                      style: {
                        opacity: this.pseudoBackgroundOpacity,
                        willChange:
                          this.mainPayload.isIntersecting &&
                          !this.pseudoPL.isIntersecting &&
                          !(
                            this.$c4.componentZIndex.length ||
                            this.$store.state.vmodel.menus.navBar
                          )
                            ? "opacity"
                            : undefined,
                      },
                    });
                  },
                },
              }),
              div({
                attrs: { ...scoping, "aria-hidden": "true" },
                staticClass: "pseudo_grid",
              }),
              shopGrid(
                {
                  ref: "shop-grid",
                  props: {
                    campaignName: this.campaignName,
                    img: this.img,
                    items: [1, 2, 3, 4, 5, 6],
                  },
                },
                [
                  intersection({
                    slot: "append",
                    props: {
                      singleAnimationFrame: true,
                      config: {
                        threshold: Array.from(
                          { length: 200 },
                          (_, i) => i * 0.005
                        ),
                        rootMargin: "50% 0px",
                      },
                    },
                    scopedSlots: {
                      default: (payload) => {
                        this.gridPayload = payload;

                        return div({
                          staticClass: "grid-observer",
                        });
                      },
                    },
                  }),
                ]
              ),

              [1, 2].map((item, key) => {
                return btn(
                  {
                    key,
                    props: {
                      background: item == 1 ? "primary" : undefined,
                      case: "initial",
                      raise: false,
                      tag: "nuxt-link",
                      to: "/",
                      text: item == 2,
                    },
                    attrs: {
                      ...scoping,
                      "aria-label": `click to ${
                        item == 1 ? "shop" : "discover"
                      } ${this.campaignName} campaign`,
                    },
                    class: [
                      {
                        "order-btn": item == 1,
                        "discover-btn": item == 2,
                      },
                    ],
                  },
                  [item == 1 ? "Shop Now" : "Discover Campaign"]
                );
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
.root[data-scn] {
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  position: relative;
  isolation: isolate;
  display: grid;
  --background-height: max(
    calc(100vh - var(--header-height) - var(--nav-bar-height)),
    590px
  );
}

.root[data-scn]::after {
  width: calc(100% - 2.5rem);
  left: 1.25rem;
  border-bottom: var(--ui-divide);
}

.observer[data-scn] {
  position: absolute;
  top: -16px;
  width: 100%;
  height: 16px;
  pointer-events: none;
}

.title[data-scn] {
  padding: 0 1.5rem;
  font-size: 0.95rem;
  height: 43px;
  font-weight: 500;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: calc(var(--header-height) - 1px);
  z-index: 401;
  cursor: pointer;
  isolation: isolate;
  background-color: var(--theme-surface);
  border-bottom: var(--ui-divide);
}

.title[data-scn].intersecting {
  box-shadow: var(--raise-normal);
}

.light-theme .title[data-scn] {
  border-bottom: none;
}

.title[data-scn]::after {
  background-color: var(--theme-banner);
  opacity: 0;
  transition: opacity 0.2s linear 32ms;
  z-index: -1;
}

.title[data-scn].intersecting::after {
  opacity: 1;
}

.title[data-scn]:not(.intersecting) {
  transition-delay: 0s;
}

.title[data-scn]::before {
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
}

.title[data-scn] > span {
  transition: 0.2s transform ease;
}

.title[data-scn]:active > span {
  transform: scale3d(0.975, 0.975, 1);
  transition: 0.5s transform ease;
}

.title[data-scn]:active::before {
  opacity: 0.3;
  transition: 0.4s opacity;
}

.title[data-scn] .badge {
  color: var(--warning);
}

.root[data-scn] > .background {
  height: var(--background-height);
  position: sticky !important;
  top: calc(var(--header-height) + 42px);
}

.root[data-scn] > .background.hide-img > * {
  opacity: 0;
}

.root[data-scn] > .background img {
  object-fit: cover !important;
}

.pseudo-background[data-scn] {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: var(--theme-surface);
  transition: 0.2s opacity linear !important;
  z-index: 399;
  pointer-events: none;
}

.pseudo_grid[data-scn] {
  height: calc(var(--background-height) * 1);
  opacity: 0;
  pointer-events: none;
}

.root[data-scn] .grid-observer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
}

.order-btn[data-scn],
.discover-btn[data-scn] {
  margin: 1rem 0;
  padding: 4px 40px;
  justify-self: center;
  z-index: 100;
}

.discover-btn[data-scn] {
  color: var(--primary);
}
</style>
