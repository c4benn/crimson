<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ShopGrid",
  props: {
    items: {
      type: Array,
      default: () => [
        {
          img: {
            alt: "",
            src: "",
          },
          name: "item-name",
        },
      ],
    },
    name: {
      type: String,
      default: "undefined",
    },
    viewAll: {
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    renderedComponents: ["appImg"],
  }),

  computed: {
    ...uiMount.computed,
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
          value: "shopGrid",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-sgd": "" };
    const div = (d, c) => h("div", d, c);
    const a = (d, c) => h("nuxt-link", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const img = (d, c) => h("app-img", d, c);

    return div(
      {
        attrs: {
          ...scoping,
        },
        staticClass: "root",
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: "grid",
          },
          [
            this.items.map((item, index, arr) => {
              return index < arr.length
                ? a(
                    {
                      key: index,
                      attrs: {
                        ...scoping,
                        title: item.name || `item ${index}`,
                      },
                      props: {
                        to: "/",
                      },
                      staticClass: "item fill-after",
                    },
                    [
                      img({
                        props: {
                          src: item.img.src,
                          alt: item.img.alt,
                        },
                        staticClass: "background fill-after",
                      }),
                    ]
                  )
                : null;
            }),
          ]
        ),
        btn(
          {
            attrs: { ...scoping, "aria-label": `click to view all items` },
            props: {
              background: "primary",
              raise: false,
              case: "intial",
              tag: "nuxt-link",
              to: this.viewAll || `/shop/view/${this.name}`,
            },
            staticClass: "view-all",
          },
          [`View All`]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-sgd] {
  position: relative;
  display: grid;
  justify-items: center;
  row-gap: 1.5rem;
  isolation: isolate;
}

.grid[data-sgd] {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 0.55rem;
  padding: 0 0.5rem;
}

.item[data-sgd] {
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  transition: 0.3s transform;
  isolation: isolate;
}

.item[data-sgd]:focus-visible {
  outline: 1px solid var(--theme-surface-text);
}

.item[data-sgd]::after {
  background-color: #000;
  opacity: 0;
  transition: 0.2s opacity;
}

@media (hover: hover) and (pointer: fine) {
  .item[data-sgd]:hover::after {
    opacity: 0.35;
  }

  .item[data-sgd]:focus::after {
    opacity: 0.5;
  }
}

.item[data-sgd]:active {
  transform: scale3d(var(--active-scale));
}

.item[data-sgd]:active::after {
  opacity: 0.3;
}

.item[data-sgd]:nth-child(1) {
  grid-column: 1/3;
  grid-row: 1/3;
}

.item[data-sgd]:nth-child(2),
.item[data-sgd]:nth-child(3) {
  grid-column: 3/4;
}

.item[data-sgd]:nth-child(2) {
  grid-row: 1/2;
}

.item[data-sgd]:nth-child(3) {
  grid-row: 2/3;
}

.item[data-sgd]:nth-child(4),
.item[data-sgd]:nth-child(5),
.item[data-sgd]:nth-child(6) {
  grid-row: 3/4;
}

.item[data-sgd]:nth-child(4) {
  grid-column: 1/2;
}

.item[data-sgd]:nth-child(5) {
  grid-column: 2/3;
}

.item[data-sgd]:nth-child(4) {
  grid-column: 3/4;
}

.item[data-sgd] .background {
  padding-bottom: 125%;
  border-radius: inherit;
}

.item[data-sgd] .background::after {
  border: var(--ui-divide);
}

.item[data-sgd] img {
  height: 100% !important;
  width: 100% !important;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
  border-radius: inherit;
}

.view-all[data-sgd] {
  /* min-width: min(55%, 256px); */
  padding: 4px 40px;
  display: grid;
  margin: 1rem 0;
}

@media (min-width: 500px) and (max-width: 960px) {
  .grid[data-sgd] {
    grid-template-rows: repeat(4, auto);
  }

  .item[data-sgd]:nth-child(1) {
    grid-column: 1/2;
    grid-row: 1/3;
  }

  .item[data-sgd]:nth-child(2),
  .item[data-sgd]:nth-child(3) {
    grid-row: 1/3;
  }

  .item[data-sgd]:nth-child(2) {
    grid-column: 2/3;
  }

  .item[data-sgd]:nth-child(3) {
    grid-column: 3/4;
  }

  .item[data-sgd]:nth-child(4),
  .item[data-sgd]:nth-child(5),
  .item[data-sgd]:nth-child(6) {
    grid-row: 3/5;
  }

  .item[data-sgd]:nth-child(4) {
    grid-column: 1/2;
  }

  .item[data-sgd]:nth-child(5) {
    grid-column: 2/3;
  }

  .item[data-sgd]:nth-child(4) {
    grid-column: 3/4;
  }
}
</style>
