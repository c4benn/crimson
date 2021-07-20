<script>
import { sleep, uiMount } from "~/components/utils/main";

export default {
  name: "ShopRecentlyViewed",

  props: {
    itemProps: {
      type: Object,
      default: () => ({
        background: "primary",
      }),
    },
  },

  data() {
    return {
      cleared: false,
      rootHeight: undefined,
      zIndex: undefined,
      renderComponent: true,
      hideComponent: false,
      addWillChange: false,

      renderedComponents: ["clearBtn", "shopMinimalGrid"],
    };
  },

  computed: {
    ...uiMount.computed,
  },

  watch: {
    ...uiMount.watch,

    async cleared() {
      if (this.cleared) {
        this.addWillChange = true;
        await sleep.call(this, 16);

        this.hideComponent = true;
        requestAnimationFrame(() => {
          this.$nextTick(async () => {
            await sleep.call(this, 382);

            this.rootHeight = "0px";

            this.$nextTick(() => {
              this.renderComponent = false;
            });
            await sleep.call(this, 16);
            this.rootHeight = "";
          });
        });
      }
    },
  },

  mounted() {
    this.mountSelf();
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: "shopRecentlyViewed",
          path: "components",
        });
      }
    },
  },

  render(h) {
    if (!this.renderComponent) {
      return null;
    }
    const scoping = { "data-srvd": "" };
    const h2 = (d, c) => h("h2", d, c);
    const span = (d, c) => h("span", d, c);
    const clearBtn = (d) => h("clear-btn", d);
    const icon = (d) => h("ui-icon", d);
    const minimalGrid = (d) => h("shop-minimal-grid", d);
    const section = (d, c) => h("section", d, c);

    return section(
      {
        ref: "$el",
        attrs: { ...scoping },
        staticClass: "root",
        class: [
          {
            "view-all": true,
          },
        ],
        style: {
          willChange: this.addWillChange ? "transform, opacity" : undefined,
          zIndex: this.addWillChange ? "9999" : undefined,
          height: this.rootHeight,
          paddingBottom: this.rootHeight ? "0px" : undefined,
          opacity: this.hideComponent ? "0" : undefined,
          transform: this.hideComponent ? "translate3d(-75%,0,0)" : undefined,
        },
      },
      [
        h2({ attrs: { ...scoping }, staticClass: "__section-title" }, [
          icon({
            attrs: { ...scoping },
            staticClass: "title-deco",
            props: {
              name: "history",
            },
          }),
          span({ staticClass: "truncate-text" }, [`Recently viewed`]),
          clearBtn({
            props: {
              root: "#home-page",
              componentProps: {
                filledText: true,
              },
            },
            staticClass: "clear-btn",
            on: {
              "ui-cleared": () => {
                this.cleared = true;
              },
            },
          }),
        ]),
        minimalGrid({
          props: {
            campaignName: "product",
            img: {
              src: "/img/campaign/item (6).jpg",
              alt: "lorem",
            },
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            name: "recently_viewed",
            itemProps: this.itemProps,
          },
          staticClass: "grid hide-scrollbar",
        }),
      ]
    );
  },
};
</script>

<style>
/* eslint-disable prettier/prettier */

.root[data-srvd] {
  padding-bottom: 3rem;
  border-bottom: var(--ui-divide);
  transition: 0.35s opacity, 0.35s transform;
  transition-timing-function: var(--quintOut);
  overflow-y: hidden;
}

.__section-title[data-srvd] {
  min-height: 32px;
  position: relative;
}

.__section-title[data-srvd] > span {
  display: flex;
}

.root[data-srvd] .clear-btn {
  flex-shrink: 0;
  position: absolute;
  right: 1.5rem;
  top: 0;
}

.root[data-srvd] .grid {
  grid-auto-flow: column;
  grid-template-columns: repeat(var(--length), calc(50% - 1.125rem)) 0.375rem;
  overflow: auto hidden;
  scroll-snap-type: x;
  padding: 1.5rem 0 1rem 1.5rem;
  scroll-padding-left: 1.5rem;
  scroll-snap-padding-left: 1.5rem;
  gap: 0 0.75rem;
  position: relative;
}

.root[data-srvd].view-all .grid {
  grid-template-columns: repeat(var(--length), calc(50% - 1.125rem)) auto 0.375rem;
}

.root[data-srvd] .grid::after {
  content: "";
  width: 100%;
}

.root[data-srvd] .grid > * {
  scroll-snap-align: start;
}

@media (min-width: 500px) {
  .root[data-srvd] .grid {
    grid-template-columns: repeat(8, calc(min(30%, 244px) - 1.125rem)) 0.375rem;
  }

  .root[data-srvd].view-all .grid {
    grid-template-columns:
      repeat(var(--length), calc(min(30%, 244px) - 1.125rem))
      auto 0.375rem;
  }
}
</style>
