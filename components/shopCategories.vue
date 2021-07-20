<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ShopCategories",
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
          value: "shopCategories",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = {
      "data-scs": "",
    };
    const div = (d, c) => h("div", d, c);
    const a = (d, c) => h("nuxt-link", d, c);
    const p = (d, c) => h("p", d, c);
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
            staticClass:
              "item fill-before-and-after ui-card __vertical __reversed",
            props: {
              to: "/",
            },
          },
          [
            p({ attrs: { ...scoping }, class: "title" }, item.title),
            img({
              props: {
                src: item.img.src,
                alt: item.img.alt,
              },
              class: ["background fill-after"],
            }),
          ]
        );
      })
    );
  },
};
</script>

<style>
.root[data-scs] {
  --item-width: calc(100% - 1.5rem);
  --title-height: 96px;
}

.root[data-scs] {
  display: grid;
  overflow: auto hidden;
  grid-auto-flow: column;
  grid-template-columns: repeat(var(--length), var(--item-width)) 1.5rem;
  isolation: isolate;
  scroll-snap-type: x mandatory;
  column-gap: 1rem;
  position: relative;
  padding: 0 0 1rem 1.5rem;
  filter: drop-shadow(0px 0px 6px rgb(0, 0, 0, 0.05));
}

.root[data-scs]::after {
  content: "";
}

.item[data-scs] {
  background-color: var(--theme-primary);
  outline: none;
  text-decoration: none;
  display: grid;
  grid-template-rows: var(--title-height) 1fr;
  align-items: center;
  position: relative;
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
  column-gap: 0.5rem;
  transition: 0.3s transform;
  scroll-snap-margin-left: 1.5rem;
  scroll-margin-left: 1.5rem;
}

.item[data-scs]::before {
  height: var(--title-height);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.item[data-scs]::after {
  border: var(--ui-divide);
}

.light-theme .item[data-scs]::after {
  border-width: 1px;
}

.item[data-scs]::before,
.item[data-scs] .background::after {
  opacity: 0;
  transition: 0.2s opacity;
}

.item[data-scs]::before {
  background-color: currentColor;
}

@media (hover: hover) and (pointer: fine) {
  .item[data-scs]:hover::before {
    opacity: 0.15;
  }

  .item[data-scs]:focus-within::before {
    opacity: 0.2;
  }

  .item[data-scs]:hover .background::before {
    opacity: 0.35;
  }

  .item[data-scs]:focus-within .background::before {
    opacity: 0.5;
  }

  .item[data-scs]:focus-visible:focus-within {
    outline: 1px solid;
  }
}

.item[data-scs]:active {
  transform: scale3d(0.975, 0.975, 1);
}

.item[data-scs]:active .background::after {
  transition: 0.4s opacity;
  opacity: 0.4;
}

.item[data-scs] .background {
  height: 100%;
  max-height: 380px;
  padding-bottom: 100%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.root[data-scs] img {
  height: auto !important;
}

.title[data-scs] {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  transition: 0.2s transform;
  color: var(--theme-surface-text);
  opacity: var(--t-title);
  border-bottom: var(--ui-divide);
  border-width: 0.7px;
}

@media (min-width: 500px) {
  .root[data-scs] {
    --item-width: calc(50% - 1.5rem);
  }
}
</style>
