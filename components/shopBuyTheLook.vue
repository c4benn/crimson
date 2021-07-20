<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ShopBuyTheLook",
  props: {
    items: {
      type: Array,
      default: () => [],
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
          value: "shopBuyTheLook",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = {
      "data-sbtlk": "",
    };
    const div = (d, c) => h("div", d, c);
    const a = (d, c) => h("nuxt-link", d, c);
    const p = (d, c) => h("p", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const img = (d, c) => h("app-img", d, c);

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root hide-scrollbar",
        style: {
          "--length": this.items.length,
        },
      },
      this.items.map((item, index) => {
        return a(
          {
            key: index,
            attrs: { ...scoping, title: item.title.toLowerCase() },
            staticClass: "item fill-before-and-after ui-card __vertical",
            props: {
              to: "/",
            },
          },
          [
            img({
              props: {
                src: item.img.src,
                alt: item.img.alt,
              },
              class: ["background fill-after"],
            }),
            p({ attrs: { ...scoping }, class: "title" }, item.title),
            btn(
              {
                props: {
                  shape: "pill",
                  color: "primary",
                  background: "theme-surface",
                  flat: true,
                  size: "sm",
                  readonly: true,
                },
                class: "order-btn",
              },
              "Order"
            ),
          ]
        );
      })
    );
  },
};
</script>

<style>
.root[data-sbtlk] {
  --item-width: max(calc(90% - 1.5rem), calc(320px - 2rem));
  --title-height: 96px;
}

.root[data-sbtlk] {
  display: grid;
  overflow: auto hidden;
  grid-auto-flow: column;
  grid-template-columns: repeat(var(--length), var(--item-width)) 0.1rem;
  isolation: isolate;
  scroll-snap-type: x mandatory;
  column-gap: 1rem;
  position: relative;
  padding: 0 0 1rem 1.5rem;
}

.root[data-sbtlk]::after {
  content: "";
}

.item[data-sbtlk] {
  color: var(--theme-surface-text);
  outline: none;
  text-decoration: none;
  display: grid;
  grid-template-rows: 1fr var(--title-height);
  align-items: center;
  position: relative;
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
  grid-template-areas: "img img" "title btn";
  column-gap: 0.5rem;
  transition: 0.3s transform;
  background-color: var(--theme-primary);
  --img-height: calc(100% - var(--title-height));
  scroll-snap-margin-left: 1.5rem;
  scroll-margin-left: 1.5rem;
  transform: none !important;
  box-shadow: var(--raise-light);
}

.item[data-sbtlk]::before {
  height: var(--title-height);
  bottom: 0;
  top: auto;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.item[data-sbtlk]::before {
  opacity: 0;
  transition: 0.2s opacity;
}

.item[data-sbtlk]::before {
  background-color: currentColor;
}

@media (hover: hover) and (pointer: fine) {
  .item[data-sbtlk]:hover::before {
    opacity: 0.15;
  }

  .item[data-sbtlk]:focus-within::before {
    opacity: 0.2;
  }

  .item[data-sbtlk]:hover .background::before {
    opacity: 0.35;
  }

  .item[data-sbtlk]:focus-within .background::before {
    opacity: 0.5;
  }

  .item[data-sbtlk]:focus-visible:focus-within {
    outline: 1px solid;
  }
}

.item[data-sbtlk]:active {
  transform: scale3d(0.975, 0.975, 1);
}

.item[data-sbtlk] .background {
  height: 100%;
  padding-bottom: 125%;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  grid-area: img;
}

.root[data-sbtlk] img {
  height: auto !important;
}

.title[data-sbtlk] {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  font-size: 1.05rem;
  transition: 0.2s transform;
  grid-area: title;
}

.item[data-sbtlk] .order-btn {
  grid-area: btn;
  margin-right: 0.75rem;
  justify-self: flex-end;
  align-self: center;
}

@media (min-width: 500px) {
  .root[data-sbtlk] {
    --item-width: calc(50% - 1.5rem);
  }
}
</style>
