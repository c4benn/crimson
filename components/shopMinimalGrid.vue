<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ShopMinimalGrid",

  props: {
    itemProps: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6, 7, 8],
    },
    campaignName: {
      type: String,
      required: true,
    },
    img: {
      type: Object,
      default: () => ({
        src: "undefined",
        alt: "missing alt",
      }),
    },
    to: {
      type: String,
      default: "2021",
    },
    onSale: Boolean,
    name: {
      type: String,
      default: "undefined",
    },
  },

  data: () => ({
    renderedComponents: ["shopMinimalItem"],
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
          value: "shopMinimalGrid",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-smgd": "" };
    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const shopItem = (d, c) => h("shop-minimal-item", d, c);

    return div(
      {
        key: `${this.items.length}`,
        ref: "grid",
        attrs: { ...scoping },
        staticClass: "root",
        class: [
          {
            "view-all": this.items.length >= 8,
          },
        ],
        style: { "--length": this.items < 8 ? this.items : 9 },
      },
      [
        this.$slots.prepend,
        this.items.map((item, key) => {
          if (key < 8) {
            return shopItem({
              key,
              props: {
                tag: "nuxt-link",
                img: this.img,
                price: `$${key}0.00`,
                title: `${this.campaignName}-${key}`,
                subtitle: `${this.campaignName}-${key}`,
                id: key,
                useIntersection: false,
                onSale: this.onSale,
                to: this.to,
                ...this.itemProps,
              },
            });
          }
          return null;
        }),
        this.items.length > 7
          ? div(
              {
                attrs: { ...scoping },
                staticClass: "view-all-wrapper",
              },
              [
                btn(
                  {
                    props: {
                      simpleButton: true,
                      background: "primary",
                      tag: "nuxt-link",
                      to: `/shop/view/${this.name}`,
                      raise: false,
                    },
                    staticClass: "view-all",
                  },
                  "View All"
                ),
              ]
            )
          : null,
        this.$slots.append,
      ]
    );
  },
};
</script>

<style>
.root[data-smgd] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max(150px, 30%), 1fr));
  gap: 0.75rem;
  justify-items: center;
  isolation: isolate;
  position: relative;
  padding: 0 1rem 1.5rem;
}

.root[data-smgd] > .view-all-wrapper {
  --_size: 100%;
  min-width: 18rem;
  display: grid;
  place-items: center;
}

.root[data-smgd] > .view-all {
  align-self: center;
  padding: 4px 40px;
  min-width: max-content;
  width: auto;
}

.root[data-smgd].view-all {
  grid-template-columns: repeat(var(--length), calc(50% - 1.125rem)) auto 0.375rem;
}

@media (min-width: 500px) {
  .root[data-smgd].view-all {
    grid-template-columns:
      repeat(var(--length), calc(min(30%, 244px) - 1.125rem))
      auto 0.375rem;
  }
  /* add orientation prop */
}
</style>
