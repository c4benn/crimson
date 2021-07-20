<script>
import { lorem, uiMount } from "~/components/utils/main";
export default {
  name: "ShopPage",

  computed: {
    ...uiMount.computed,

    renderedComponents() {
      return [
        "shopCampaign",
        "shopBuyTheLook",
        "shopMinimalGrid",
        "shopRecentlyViewed",
        "shopBanner",
        "shopCategories",
      ];
    },
  },

  watch: {
    ...uiMount.watch,
  },

  created() {
    this.renderedComponents.forEach((x) => {
      if (this.$store.state.loadedComponents?.[x]) {
        this.loadedComponents.push(x);
      }
    });
  },

  mounted() {
    this.selfRendered = true;

    this.mountSelf();
  },

  beforeDestroy() {
    this.selfRendered = false;
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: this.$route.path,
          path: "pages",
        });

        this.$store.commit("V_MODEL", {
          path: "loadingBar",
          value: false,
        });

        this.$store.commit("UPDATE_", {
          path: "showPageLoading",
          value: false,
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-hpe": "" };
    const section = (d, c) => h("section", d, c);
    const main = (d, c) => h("main", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const h3 = (d, c) => h("h3", d, c);
    // const btn = (d, c) => h("ui-btn", d, c);
    const campaign = (d) => h("shop-campaign", d);
    const buyTheLook = (d) => h("shopBuyTheLook", d);
    const shopGrid = (d) => h("shopGrid", d);
    const minimalGrid = (d) => h("shop-minimal-grid", d);
    const recentlyViewed = (d) => h("shop-recently-viewed", d);
    const shopBanner = (d) => h("shop-banner", d);
    const categories = (d) => h("shop-categories", d);
    const icon = (d) => h("uiIcon", d);

    return main(
      {
        attrs: {
          id: "home-page",
        },
        // class: [
        //   {
        //     hidden: this.$route.path != "/",
        //   },
        // ],
      },
      [
        shopBanner(),
        section(
          {
            attrs: { ...scoping },
            staticClass: "new-in",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "tag",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __new-in",
              }),
              `New in`,
            ]),
            h3(
              { staticClass: "__shop-section-description" },
              `Check out the latest products added to our store.`
            ),
            minimalGrid({
              props: {
                name: "new_in",
                campaignName: "product",
                img: {
                  src: "/img/campaign/4.jpg",
                  alt: "lorem",
                },
                items: [1, 2, 3, 4, 5, 6],
              },
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "campaigns",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "carousel",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __campaign",
              }),
              `Campaigns`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            [1, 2].map((item, index, arr) => {
              const campaignName =
                item == 1
                  ? `Paradice is a state of mind`
                  : `Welcome to Paradice`;
              const campaignDate = item == 1 ? `April 2021` : `January 2020`;
              return campaign({
                key: item,
                props: {
                  campaignName,
                  campaignDate,
                  isNew: item == 1,
                  img: {
                    src:
                      item == 1
                        ? `/img/campaign/${item}.jpg`
                        : "/img/campaign/3.jpg",
                    alt: "latest campaign image",
                  },
                },
                class: [{ "last-campaign": index + 1 == arr.length }],
              });
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "on-sale",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "tag",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __on-sale",
              }),
              `Items on sale`,
            ]),
            h3(
              { staticClass: "__shop-section-description" },
              `Hurry up and grab some of these ravishing apparels we found on sale!`
            ),
            minimalGrid({
              props: {
                name: "on_sale",
                campaignName: "product",
                img: {
                  src: "/img/campaign/1.jpg",
                  alt: "lorem",
                },
                // onSale: true,
                items: [1, 2, 3, 4, 5, 6],
              },
            }),

            // btn(
            //   {
            //     props: {
            //       background: "primary",
            //       raise: false,
            //       case: "initial",
            //       tag: "nuxt-link",
            //       to: "/shop/view/on_sale",
            //     },
            //     staticClass: "view-all",
            //     attrs: {
            //       "aria-label": `click to view all items`,
            //     },
            //   },
            //   [`View All`]
            // ),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "categories fill-before",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "shape",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __categories",
              }),
              `Categories`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            categories({
              props: {
                items: [
                  {
                    title: "Hoodies",
                    img: {
                      alt: "",
                      src: "/img/campaign/3.jpg",
                    },
                  },
                  {
                    title: "Hats",
                    img: {
                      alt: "",
                      src: "/img/campaign/1.jpg",
                    },
                  },
                  {
                    title: "T-Shirts",
                    img: {
                      alt: "",
                      src: "/img/campaign/2.jpg",
                    },
                  },
                  {
                    title: "Shirts",
                    img: {
                      alt: "",
                      src: "/img/campaign/4.jpg",
                    },
                  },
                  {
                    title: "Trousers",
                    img: {
                      alt: "",
                      src: "/img/campaign/5.jpg",
                    },
                  },
                ],
              },
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "trending fill-before",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "hash",
                },
                staticClass: "title-deco __trending",
              }),
              `Trending`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            shopGrid({
              props: {
                name: "trending",
                items: [
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/3.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/1.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/2.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/5.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/4.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/3.jpg",
                    },
                  },
                ],
              },
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "recommended",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "androidMessage",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __recommended",
              }),
              `Recommended`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            minimalGrid({
              props: {
                name: "recommended",
                campaignName: "product",
                img: {
                  src: "/img/campaign/4.jpg",
                  alt: "lorem",
                },
                items: [1, 2, 3, 4, 5, 6],
              },
            }),

            // btn(
            //   {
            //     props: {
            //       background: "primary",
            //       raise: false,
            //       case: "initial",
            //       tag: "nuxt-link",
            //       to: "/shop/view/recommended",
            //     },
            //     staticClass: "view-all",
            //     attrs: {
            //       "aria-label": `click to view all items`,
            //     },
            //   },
            //   [`View All`]
            // ),
          ]
        ),

        section(
          { attrs: { ...scoping }, staticClass: "buy-the-look fill-before" },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "clothHanger",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __buy-the-look",
              }),
              `Buy the look`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            buyTheLook({
              props: {
                items: [
                  {
                    title: "Lorem ipsum dolor sit amet",
                    img: {
                      alt: "lorem",
                      src: "/img/campaign/4.jpg",
                    },
                  },
                  {
                    title: "Lorem ipsum dolor sit amet",
                    img: {
                      alt: "lorem",
                      src: "/img/campaign/3.jpg",
                    },
                  },
                  {
                    title: "Lorem ipsum dolor sit amet",
                    img: {
                      alt: "lorem",
                      src: "/img/campaign/5.jpg",
                    },
                  },
                ],
              },
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "saved-items fill-before",
          },
          [
            h2({ staticClass: "__section-title" }, [
              icon({
                props: {
                  name: "bookmark",
                },
                attrs: { ...scoping },
                staticClass: "title-deco __saved",
              }),
              `Your saved items`,
            ]),
            h3({ staticClass: "__shop-section-description" }, lorem),
            shopGrid({
              props: {
                name: "saved_items",
                viewAll: "/saved",
                items: [
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/4.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/3.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/5.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/1.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/2.jpg",
                    },
                  },
                  {
                    img: {
                      alt: "",
                      src: "/img/campaign/4.jpg",
                    },
                  },
                ],
              },
            }),
          ]
        ),
        recentlyViewed(),
      ]
    );
  },
};
</script>

<style>
#home-page {
  min-height: calc(100vh - var(--app-bars-height));
  margin: 0;
  isolation: isolate;
  position: relative;
}

.__shop-section-description {
  padding: 0 1.5rem;
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  opacity: var(--t-subtitle);
  margin-bottom: 2.5rem;
}

.title-deco.__new-in[data-hpe] {
  color: var(--secondary);
  opacity: 1 !important;
}

.campaigns[data-hpe] {
  padding-bottom: 2rem;
  border-bottom: var(--ui-divide);
}

.campaigns[data-hpe] .last-campaign {
  margin-bottom: 0;
  padding-bottom: 0;
}

.campaigns[data-hpe] .last-campaign::after {
  opacity: 0;
}

.recommended[data-hpe],
.on-sale[data-hpe],
.new-in[data-hpe] {
  display: grid;
  padding-bottom: 2rem;
  border-bottom: var(--ui-divide);
}

.recommended[data-hpe] .view-all,
.on-sale[data-hpe] .view-all,
.new-in[data-hpe] .view-all {
  justify-self: center;
  margin: 1rem 0;
  padding: 4px 40px;
}

.on-sale[data-hpe] .line-through {
  opacity: var(--t-disabled);
}

.title-deco.__on-sale[data-hpe] {
  color: var(--warning);
  opacity: 1 !important;
}

.buy-the-look[data-hpe],
.trending[data-hpe],
.saved-items[data-hpe],
.categories[data-hpe] {
  position: relative;
  padding-bottom: 2.5rem;
}

.trending[data-hpe]::before,
.saved-items[data-hpe]::before,
.categories[data-hpe] {
  border-bottom: var(--ui-divide);
}

.buy-the-look[data-hpe]::before {
  border-bottom: var(--ui-divide);
}

.__buy-the-look[data-hpe] {
  --title-deco-color: #ffd700;
}

.__recommended[data-hpe] {
  --title-deco-color: var(--droid-color);
}
</style>
