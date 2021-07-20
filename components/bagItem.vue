<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "BagItem",

  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    tag: {
      type: String,
      default: "div",
    },
  },

  computed: {
    ...uiMount.computed,

    renderedComponents() {
      return ["appImg", "swipeToDelete"];
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
          value: "bagItem",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-bim": "" };

    const div = (d, c) => h("div", d, c);
    const swipeToDelete = (d, c) => h("swipeToDelete", d, c);
    const img = (d) => h("app-img", d);
    const h2 = (d, c) => h("h2", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const btn = (d, c) => h("ui-btn", d, c);

    return h(
      this.tag,
      {
        attrs: { ...scoping, tabindex: "0" },
        staticClass: "root fill-before",
      },
      [
        swipeToDelete(
          {
            staticClass: "swiper",
            on: {
              "right-confirmed": () => {
                this.$emit("item-deleted");
              },
              "delete-clicked": (e) => {
                this.$emit("delete-clicked", e);
              },
            },
          },
          [
            img({
              props: {
                src: "/img/campaign/6.png",
                alt: "",
              },
              staticClass: "image",
            }),
            div({ attrs: { ...scoping }, staticClass: "description" }, [
              h2(
                {
                  attrs: { ...scoping, "data-feedback": "In stock" },
                  staticClass: "header",
                },
                [`${this.$currencies.naira}8000.00`]
              ),
              h3(
                {
                  attrs: { ...scoping },
                  staticClass: "item-name",
                },
                `A very unique name`
              ),
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "__info hide-scrollbar fill-before",
                },
                [
                  `Price: ${this.$currencies.naira}4000.00 | Quantity: 3 | Size: MD | Color: Black`,
                ]
              ),
            ]),
          ]
        ),
        div(
          {
            attrs: { ...scoping },
            staticClass: "footer",
          },
          [
            [1, 2].map((item, key) => {
              return btn(
                {
                  key,
                  props: {
                    shape: "pill",
                    flat: true,
                    size: "sm",
                    color:
                      item == 1 ? "" : item == 2 ? "theme-primary" : "error",
                    simpleButton: true,
                  },
                  attrs: { ...scoping },
                  staticClass: `action action-${item}`,
                },
                [item == 1 ? "Move to Saved" : item == 2 ? "Edit" : "Delete"]
              );
            }),
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-bim] {
  background-color: var(--theme-primary);
  border-radius: var(--rounded);
  overflow: hidden;
  --swiper-size: 80px;
  cursor: pointer;
  position: relative;
  isolation: isolate;
  outline: none;
  display: grid;
}

.root[data-bim]::before {
  opacity: 0;
  background-color: currentColor;
  transition: 0.2s opacity;
  z-index: 1;
}

@media (hover: hover) and (pointer: fine) {
  .root[data-bim]:hover::before {
    opacity: 0.1;
  }

  .root[data-bim]:focus-within::before {
    opacity: 0.2;
  }
}

.root[data-bim]:active .item-name {
  opacity: 1;
}

.root[data-bim] .main {
  display: grid;
  grid-template-columns: var(--swiper-size) 1fr;
  column-gap: 1rem;
  padding: 0rem 0.75rem 0 1.5rem;
}

.root[data-bim] .image {
  height: var(--swiper-size);
  align-self: center;
  position: relative;
  z-index: 1;
}

.description[data-bim] {
  padding: 1rem 0 0.825rem;
  display: grid;
  grid-template-rows: auto auto 1fr;
  row-gap: 0.35rem;
  letter-spacing: 0.5px;
}

.header[data-bim] {
  font-size: 1.275rem !important;
  font-weight: 500 !important;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  position: relative;
  opacity: var(--t-body);
}

.header[data-bim]::after {
  pointer-events: none;
  position: absolute;
  right: 1rem;
  content: attr(data-feedback);
  font-size: 0.825rem;
  font-weight: 500;
  opacity: var(--t-caption);
}

.item-name[data-bim] {
  font-size: 1.15rem !important;
  font-weight: 400 !important;
  opacity: var(--t-subtitle);
  position: relative;
  z-index: 1;
  transition: 0.2s opacity;
  display: flex;
}

.__info[data-bim] {
  font-size: 0.825rem;
  opacity: var(--t-caption);
  padding: 0.25rem 0 0.35rem;
  max-width: 97%;
  white-space: nowrap;
  display: grid;
  grid-template-columns: 1fr 2.25rem;
  overflow: auto hidden;
  isolation: isolate;
}

.root[data-bim] .confirm-right.swiper .__info[data-bim] {
  pointer-events: none;
}

.__info[data-bim]::before {
  background-image: var(--hidden-text-background);
}

.__info[data-bim]::after {
  content: "";
  width: 100%;
  height: 100%;
}

.footer[data-bim] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 0 1.5rem;
  height: 54px;
  position: relative;
  z-index: 1;
}

.action[data-bim]::before {
  opacity: 0.025;
}

/* .action-1[data-bim] {
  color: var(--info);
} */

/* .dark-theme .action-1[data-bim] {
  color: var(--success);
} */

.light-theme .action[data-bim]::before {
  opacity: 0.05;
}
</style>
