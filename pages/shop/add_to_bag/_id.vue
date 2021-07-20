<script>
import { sleep, springPresets, uiMount } from "~/components/utils/main";
export default {
  name: "ProductPageChild",

  data() {
    return {
      saved: false,
      savedBtnTransitionState: "",
      showTitleBanner: false,
      pageMounted: false,

      intersection: {
        title: {},
        price: {},
      },
    };
  },
  head() {
    return {
      title: `Add ${"a very cool item name"} to bag`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Add ${this.$route.path} to bag`,
        },
      ],
    };
  },

  computed: {
    ...uiMount.computed,

    renderedComponents() {
      return [
        "itemCarousel",
        "colorRadioGrid",
        "sizeRadioGrid",
        "orderQuantity",
        "shopMinimalGrid",
        "shopRecentlyViewed",
      ];
    },

    addToBagObject() {
      return this.$store.state.vmodel.addToBag;
    },
    orderQuantity() {
      return this.addToBagObject.quantity || 1;
    },
    totalPrice() {
      return `${(8000 * this.orderQuantity).toFixed(2)}`;
    },
    bagItems() {
      return this.$store.state.bagItems.items;
    },
    colorValidation() {
      return !this.addToBagObject.color ? "*Required*" : "";
    },
    sizeValidation() {
      return !this.addToBagObject.size ? "*Required*" : "";
    },
    addToBagValidation() {
      if (/\*required/i.test(this.colorValidation)) {
        return `*Please choose a color*`;
      }
      if (/\*required/i.test(this.sizeValidation)) {
        return `*Please choose a size*`;
      }
      return "";
    },
    disableQuantityAndBag() {
      return (
        /\*required/i.test(this.sizeValidation) ||
        /\*required/i.test(this.colorValidation)
      );
    },
    dialogObject() {
      return this.$store.state.vmodel.dialogs.addToBag;
    },
  },

  watch: {
    selfMounted(n) {
      if (n) {
        this.mountSelf();
      }
    },
  },

  beforeCreate() {
    this.$store.commit("UPDATE_", {
      value: false,
      name: "renderPageTitle",
    });

    this.$store.commit("V_MODEL", {
      path: "showBorder",
      innerPath: "headerContent",
      value: true,
    });

    this.$store.commit("V_MODEL", {
      path: "showText",
      innerPath: "headerContent",
      value: true,
    });
  },

  created() {
    this.renderedComponents.forEach((x) => {
      if (this.$store.state.loadedComponents?.[x]) {
        this.loadedComponents.push(x);
      }
    });

    this.$nextTick(() =>
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: "Add to bag",
      })
    );
  },

  mounted() {
    this.mountSelf();

    this.pageMounted = true;

    this.$store.commit("V_MODEL", {
      path: "addToBag",
      value: {
        size: "",
        quantity: "",
        color: "",
      },
    });
  },

  beforeDestroy() {
    this.pageMounted = false;
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
    const scoping = { "data-spp-id": "" };
    const aside = (d, c) => h("aside", d, c);
    const span = (d, c) => h("span", d, c);
    const carousel = (d) => h("item-carousel", d);
    const div = (d, c) => h("div", d, c);
    const h2 = (d, c) => h("h2", d, c);
    // const h3 = (d, c) => h("h3", d, c);
    const p = (d, c) => h("p", d, c);
    const label = (d, c) => h("label", d, c);
    const main = (d, c) => h("main", d, c);
    const section = (d, c) => h("section", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const transition = (d) => h("ui-transition", d);
    // const intersection = (d) => h("ui-intersection", d);
    const icon = (d) => h("ui-icon", d);
    const colorRadio = (d) => h("color-radio-grid", d);
    const sizeRadio = (d) => h("size-radio-grid", d);
    const orderQuantity = (d) => h("order-quantity", d);
    const minimalGrid = (d) => h("shop-minimal-grid", d);
    const dialogObject = this.dialogObject;
    const recentlyViewed = (d) => h("shop-recently-viewed", d);

    const updateDialog = async ({ template, active = true, meta = {} }) => {
      const sameTemplate = dialogObject.template == template;

      this.$store.commit("V_MODEL", {
        value: {
          ...dialogObject,
          template,
          meta,
        },
        path: "addToBag",
        innerPath: "dialogs",
      });

      await sleep.call(this, sameTemplate ? 0 : 32);

      this.$nextTick(() =>
        requestAnimationFrame(() =>
          this.$store.commit("V_MODEL", {
            value: {
              ...dialogObject,
              template,
              meta,
              active,
            },
            path: "addToBag",
            innerPath: "dialogs",
          })
        )
      );
    };

    const validationMessage = (name, $transition = {}) => {
      const validation = this[`${name}Validation`];
      return transition({
        props: {
          transition: "none",
          duration: "170",
          ease: "linear",
          // ...$transition,
        },
        scopedSlots: {
          default: () => {
            return validation
              ? span(
                  {
                    key: `${name}-${validation}`,
                    attrs: { ...scoping },
                    staticClass: "v-msg",
                  },
                  [validation]
                )
              : null;
          },
        },
      });
    };

    const quantityAndBagValidation = () =>
      span(
        {
          attrs: { ...scoping },
          staticClass: "v-msg-wrapper",
        },
        [
          validationMessage("addToBag", {
            type: { enter: "spring" },
            springConfig: springPresets.wobbly,
          }),
        ]
      );

    const addToBagBtn = () => {
      return div(
        {
          attrs: { ...scoping },
          staticClass: "add-to-bag-wrapper",
        },
        [
          btn(
            {
              attrs: {
                ...scoping,
                "aria-label": `add ${this.orderQuantity} item${
                  this.orderQuantity > 1 ? "s" : ""
                } at ${8000} for a total of ${this.totalPrice} to bag`,
              },
              props: {
                background: "primary",
                raise: false,
                disabled: this.disableQuantityAndBag,
                size: "md",
                simpleButton: true,
                persistent: true,
                actionButton: true,
              },
              staticClass: "add-to-bag",
              on: {
                "!click": () => {
                  if (/select size/i.test(this.selectedSize)) {
                    const selectSizeBtn = this.$refs["select-size"];

                    selectSizeBtn.click();
                  } else {
                    const updateBag = {
                      id: this.$route.path,
                      name: `product - ${
                        this.$route.path
                          .match(/\/\d+$/)?.[0]
                          ?.replace(/^\//, "") || "0"
                      }`,
                      size: this.addToBagObject.size,
                      quantity: this.orderQuantity || 1,
                      color: this.addToBagObject.color || 0,
                    };

                    const existingValue = (x) =>
                      x.id == updateBag.id &&
                      x.size == updateBag.size &&
                      x.quantity == updateBag.quantity &&
                      x.color == updateBag.color;

                    const existingItem = this.bagItems.find((x) =>
                      existingValue(x)
                    );

                    if (existingItem) {
                      const multipleExisting = this.bagItems
                        .filter((x) => x != existingItem)
                        .find((x) => existingValue(x));

                      return updateDialog({
                        template: "warning-dialog",
                        meta: {
                          message: `Item${
                            multipleExisting ? "s" : ""
                          } with the same specifications will be duplicated in your bag.`,
                        },
                      });
                    }

                    updateDialog({ template: "confirmation-dialog" });
                  }
                },
              },
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "add-to-bag-content-wrapper",
                },
                [
                  `Add to Bag `,
                  span(
                    {
                      staticClass: "price-wrapper",
                    },
                    [
                      span(
                        {
                          attrs: {
                            // "data-currency": `${this.$currencies.naira}`,
                            "data-decimal":
                              `${this.totalPrice}`
                                .match(/(?:\.\d*)$/)?.[0]
                                ?.replace(/\./, "") || "00",
                          },
                          class: "price",
                        },
                        `${this.$currencies.naira}${this.totalPrice}`.replace(
                          /(?:\.\d*)$/,
                          "."
                        )
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),
          quantityAndBagValidation(),
        ]
      );
    };

    return main(
      {
        key: `${this.$route.fullPath}-main`,
        attrs: { ...scoping },
        staticClass: "root",
        class: [
          {
            "__title-hidden": !this.intersection.title.isIntersecting,
            "__price-hidden": !this.intersection.price.isIntersecting,
          },
        ],
      },
      [
        this.$fetched.pages.includes(this.$route.path) &&
          aside(
            {
              key: `${this.$route.fullPath}-banner`,
              attrs: { ...scoping },
              staticClass: "banner fill-before-and-after",
              class: [{ show: this.showTitleBanner && this.pageMounted }],
            },
            [
              h2(
                {
                  staticClass: "title",
                },
                `A very cool and unique product name`
              ),
              span(
                {
                  attrs: {
                    "data-currency": `${this.$currencies.naira}`,
                    "data-decimal": "00",
                  },
                  staticClass: "price",
                  class: [
                    {
                      __hidden: this.intersection.price.isIntersecting,
                    },
                  ],
                },
                [`8000.`]
              ),
            ]
          ),
        carousel({
          key: this.$route.fullPath,
          on: {
            "title-intersection": (e) => {
              if (e.entries?.boundingClientRect) {
                this.showTitleBanner = !e?.isIntersecting;
              }
              this.intersection.title = e;
            },
            "price-intersection": (e) => {
              this.intersection.price = e;
            },
          },
        }),
        div(
          {
            attrs: { ...scoping },
            staticClass: "btn-group fill-before fill-after",
          },
          [
            [1, 2].map((_, i) => {
              return btn(
                {
                  props: {
                    simpleButton: true,
                    flat: true,
                    shape: "tile",
                  },
                  attrs: {
                    ...scoping,
                    title: i == 0 ? (this.saved ? "saved" : "save") : "share",
                  },
                  staticClass: "btn-group-item fill-before fill-after",
                  class: [
                    {
                      readonly:
                        /leave/i.test(this.savedBtnTransitionState) && i == 0,
                    },
                  ],
                  on:
                    i == 0
                      ? {
                          "!click": () => {
                            this.saved = !this.saved;
                          },
                        }
                      : {
                          "!click": () => {
                            updateDialog({
                              template: "share",
                            });
                          },
                        },
                },
                [
                  span(
                    {
                      attrs: { ...scoping },
                      staticClass: "btn-group-item-text",
                    },
                    i == 0 ? (this.saved ? "Saved" : "Save") : "Share"
                  ),
                  i == 0 &&
                    div(
                      {
                        attrs: { ...scoping },
                        staticClass: "btn-group-item-icon-wrapper",
                      },
                      [
                        transition({
                          props: {
                            transition: {
                              enter: this.saved
                                ? "scale(1,-0.1)"
                                : "scale(0.9)",
                              leave: this.saved
                                ? "scale(0.5)"
                                : "scale(1,-0.1)",
                            },
                            type: this.saved ? { enter: "spring" } : undefined,
                            springConfig: springPresets.savedAnim,
                            origin: {
                              leave: !this.saved ? "top" : undefined,
                              enter: this.saved ? "top" : undefined,
                            },
                            ease: "ease",
                            duration: {
                              enter: "0.3s",
                              leave: !this.saved ? "0.3s" : "0.2s",
                            },
                            delay: {
                              enter: !this.saved ? 50 : undefined,
                            },
                          },
                          scopedSlots: {
                            default: (payload) => {
                              this.savedBtnTransitionState = payload;
                              return div(
                                {
                                  key: `${this.saved}`,
                                  attrs: { ...scoping },
                                  staticClass: "saved-transition",
                                },
                                [
                                  icon({
                                    props: {
                                      name: `${
                                        this.saved
                                          ? "bookmark"
                                          : "bookmark-outline"
                                      }`,
                                    },
                                  }),
                                ]
                              );
                            },
                          },
                        }),
                      ]
                    ),
                  i == 1 &&
                    icon({
                      props: {
                        name: "share",
                      },
                    }),
                ]
              );
            }),
          ]
        ),

        div(
          {
            attrs: {
              ...scoping,
            },
            staticClass: "form",
          },
          [
            // intersection({
            //   scopedSlots: {
            //     default: (payload) => {
            //       const entriesY = payload?.entries?.boundingClientRect?.y || 1;
            //       this.showTitleBanner =
            //         !payload.isIntersecting && entriesY < 0;
            //       return h2(
            //         {
            //           attrs: {
            //             ...scoping,
            //           },
            //           staticClass: "price",
            //         },
            //         [
            //           span(
            //             {
            //               staticClass: "sale",
            //             },
            //             `${this.$currencies.naira}5000.00`
            //           ),
            //           span(
            //             {
            //               attrs: {
            //                 "data-currency": `${this.$currencies.naira}`,
            //                 "data-decimal": "00",
            //               },
            //               staticClass: "current",
            //             },
            //             `8000.`
            //           ),
            //         ]
            //       );
            //     },
            //   },
            // }),
            // h3(
            //   {
            //     attrs: { ...scoping },
            //     staticClass: "item-title line-clamp-2 fill-before",
            //   },
            //   `A very cool and unique product name`
            // ),

            div(
              {
                attrs: {
                  ...scoping,
                },
                staticClass: "color",
              },
              [
                p(
                  {
                    attrs: {
                      id: "color",
                    },
                    staticClass: "title",
                  },
                  ["Color", validationMessage("color")]
                ),

                colorRadio({
                  props: {
                    vmodel: this.addToBagObject.color || 0,
                    id: "color",
                  },
                  on: {
                    vmodel: (e) => {
                      this.$store.commit("V_MODEL", {
                        path: "color",
                        innerPath: "addToBag",
                        value: e,
                      });
                    },
                  },
                }),
              ]
            ),

            div(
              {
                attrs: {
                  ...scoping,
                },
                staticClass: "size",
                class: [{ invalid: /\*required/i.test(this.sizeValidation) }],
              },
              [
                p(
                  {
                    attrs: {
                      id: "size",
                    },
                    staticClass: "title",
                  },
                  [
                    "Size",
                    validationMessage("size"),
                    btn(
                      {
                        props: {
                          // flat: true,
                          size: "sm",
                          text: true,
                          color: "primary",
                          filledText: true,
                        },
                        attrs: { ...scoping },
                        staticClass: "size-guide-activator",
                        on: {
                          "!click": () => {
                            updateDialog({ template: "size-guide" });
                          },
                        },
                      },
                      "Size guide"
                    ),
                  ]
                ),

                sizeRadio({
                  props: {
                    vmodel: this.addToBagObject.size || 0,
                    id: "size",
                  },
                  on: {
                    vmodel: (e) => {
                      this.$store.commit("V_MODEL", {
                        path: "size",
                        innerPath: "addToBag",
                        value: e,
                      });
                    },
                  },
                }),
              ]
            ),

            // div(
            //   {
            //     ref: "select-size-wrapper",
            //     attrs: {
            //       ...scoping,
            //     },
            //     class: "size-dropdown-wrapper fill-before",
            //   },
            //   [
            //     intersection({
            //       props: {
            //         singleAnimationFrame: false,
            //       },
            //       scopedSlots: {
            //         default: (payload) => {
            //           return div(
            //             {
            //               ref: "select-size",
            //               attrs: {
            //                 ...scoping,
            //                 role: "button",
            //               },
            //               staticClass:
            //                 "size-dropdown fill-before fill-after",
            //               on: {
            //                 click: () => {
            //                   updateDialog({ template: "select-size" });
            //                 },
            //               },
            //             },
            //             [
            //               span({
            //                 staticClass: "title",
            //                 domProps: {
            //                   innerHTML: this.selectedSize,
            //                 },
            //               }),
            //               h(`mdi-chevron-down`, {
            //                 staticClass: "icon",
            //                 class: [
            //                   {
            //                     active:
            //                       dialogObject.active &&
            //                       /select-size/i.test(dialogObject.template),
            //                     "no-transition": !payload.isIntersecting,
            //                   },
            //                 ],
            //               }),
            //             ]
            //           );
            //         },
            //       },
            //     }),
            //   ]
            // ),

            div(
              {
                attrs: {
                  ...scoping,
                },
                staticClass: "quantity",
              },
              [
                label(
                  {
                    attrs: { for: "item-quantity" },
                    staticClass: "title",
                  },
                  "Quantity"
                ),

                orderQuantity({
                  props: {
                    vmodel: parseFloat(this.orderQuantity),
                    disabled: this.disableQuantityAndBag,
                    id: "item-quantity",
                  },

                  on: {
                    vmodel: (e) => {
                      this.$store.commit("V_MODEL", {
                        path: "quantity",
                        innerPath: "addToBag",
                        value: parseFloat(e),
                      });
                    },
                  },
                }),

                quantityAndBagValidation(),
              ]
            ),

            addToBagBtn(),
          ]
        ),

        div(
          {
            attrs: { ...scoping },
            staticClass: "product-info fill-before fill-after",
          },
          [
            [1, 2, 3].map((item, index) => {
              return btn(
                {
                  props: {
                    block: true,
                    flat: true,
                    // shape: "tile",
                    case: "initial",
                    background: "transparent",
                  },
                  attrs: { ...scoping },
                  on: {
                    "!click": () => {
                      const template =
                        item == 1
                          ? "product-info"
                          : item == 2
                          ? "size-guide"
                          : "delivery";

                      updateDialog({ template });
                    },
                  },
                },
                [
                  item == 1
                    ? "Product information"
                    : item == 2
                    ? "Size guide"
                    : "Delivery and returns",
                  icon({ props: { name: "chevronRight" }, slot: "append" }),
                ]
              );
            }),
          ]
        ),

        div(
          {
            attrs: { ...scoping },
            staticClass: "next-and-previous-wrapper",
          },
          ["Previous", "Next"].map((item, key) => {
            return btn(
              {
                key,
                props: {
                  color: "primary",
                  flat: true,
                  filledText: true,
                },
                attrs: {
                  ...scoping,
                  title: `${item} product`.toLowerCase(),
                },
                staticClass: `${item.toLowerCase()}`,
                on: {
                  "!click": () => {
                    this.$router.push(
                      `/shop/add_to_bag/${Math.floor(Math.random() * 2000)}`
                    );
                  },
                },
              },
              [
                item,
                // icon({
                //   slot: key == 0 ? "prepend" : "append",
                //   props: {
                //     // name: key == 0 ? "previousPage" : "nextPage",
                //     name: key == 0 ? "chevronLeft" : "chevronRight",
                //   },
                // }),
              ]
            );
          })
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "buy-the-look fill-before",
          },
          [
            h2(
              {
                attrs: { ...scoping },
                staticClass: "buy-the-look-header",
              },
              [
                icon({
                  props: {
                    name: "clothHanger",
                  },
                  attrs: { ...scoping },
                  staticClass: "title-deco __buy-the-look",
                }),
                `Buy the look`,
              ]
            ),

            minimalGrid({
              props: {
                campaignName: "product",
                img: {
                  src: "/img/campaign/item (3).jpg",
                  alt: "lorem",
                },
                to: /2020$/.test(this.$route.path) ? "2021" : "2020",
                items: [1, 2, 3, 4],
                itemProps: {
                  background: "primary",
                },
              },
              class: "grid hide-scrollbar",
            }),
          ]
        ),

        section(
          {
            attrs: { ...scoping },
            staticClass: "recommended fill-before",
          },
          [
            h2(
              {
                attrs: { ...scoping },
                staticClass: "recommended-header",
              },
              [
                icon({
                  props: {
                    name: "android",
                  },
                  attrs: { ...scoping },
                  staticClass: "title-deco droid",
                }),
                `You might also like`,
              ]
            ),

            minimalGrid({
              props: {
                campaignName: "product",
                img: {
                  src: "/img/campaign/item (2).jpg",
                  alt: "lorem",
                },
                to: /2020$/.test(this.$route.path) ? "2021" : "2020",
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                itemProps: {
                  background: "primary",
                },
              },
              class: "grid hide-scrollbar",
            }),
          ]
        ),

        recentlyViewed({
          props: {
            itemProps: {
              background: "primary",
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-spp-id] {
  min-height: calc(100vh - var(--app-bars-height));
  margin: 0 auto;
}

.dark-theme .banner[data-spp-id] {
  --theme-banner: #333;
}

.dark-theme .banner[data-spp-id]::before {
  opacity: 0.5;
}

.banner[data-spp-id] {
  height: 43px;
  width: 100%;
  position: fixed;
  top: calc(var(--header-height) - 1px);
  left: 0;
  z-index: 100;
  opacity: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.5rem;
  align-items: center;
  padding: 0 1rem;
  pointer-events: none;
  transform: translate3d(0, -4px, 0);
  isolation: isolate;
}

.banner[data-spp-id]::before {
  border-bottom: var(--ui-divide);
  z-index: 2;
}

@supports (backdrop-filter: blur(1px)) {
  .banner[data-spp-id]::after {
    backdrop-filter: var(--banner-backdrop-filter);
  }

  .banner[data-spp-id] {
    background-color: var(--blur-banner);
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .banner[data-spp-id]::after {
    display: none;
  }

  .banner[data-spp-id] {
    background-color: var(--theme-banner);
  }
}

.banner[data-spp-id].show {
  transition: 0.3s opacity, 0.3s transform;
  opacity: 1;
  transform: translate3d(0, 0, 0);
  pointer-events: initial;
}

.banner[data-spp-id] > .title {
  font-weight: 400;
  font-size: 0.975em;
  opacity: var(--t-body);
  z-index: 1;
}

.banner[data-spp-id] > .price {
  font-weight: 600;
  transition: 0.3s opacity;
  z-index: 1;
  opacity: var(--t-title);
}

.banner[data-spp-id] > .price.__hidden {
  opacity: 0;
  transition: 0s;
}

.banner[data-spp-id] > * {
  font-size: 1rem;
}

.banner[data-spp-id] > .price::before {
  content: attr(data-currency);
  margin-right: 2px;
  font-size: 0.9em;
}

.banner[data-spp-id] > .price::after {
  content: attr(data-decimal);
  font-size: 0.85em;
}

.btn-group[data-spp-id] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  background-color: var(--theme-primary);
  isolation: isolate;
  position: relative;
  overflow: hidden;
  touch-action: pan-y pan-x;
}

/* .btn-group[data-spp-id] {
  --theme-primary: var(--theme-surface);
} */

/* .dark-theme .btn-group[data-spp-id],
.dark-theme .form[data-spp-id] {
  --theme-primary: #151718;
} */

/* .dark-theme .product-info[data-spp-id],
.dark-theme .next-and-previous-wrapper[data-spp-id] {
  --theme-primary: #151718;
  --theme-surface: #090909;
  background: var(--theme-surface);
} */

.btn-group[data-spp-id]::before {
  height: 80%;
  width: 0.5px;
  z-index: 1;
  background-color: var(--theme-surface-text);
  opacity: 0.25;
  top: 10%;
  left: 50%;
}

.btn-group[data-spp-id]::after {
  border: var(--ui-divide);
  border-width: 0.5px 0;
  opacity: var(--t-disabled);
}

.btn-group-item[data-spp-id] {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  justify-items: center;
  position: relative;
  height: 100% !important;
  width: 100% !important;
  padding: 0 2rem !important;
}

.btn-group-item[data-spp-id].readonly {
  pointer-events: none;
}

.btn-group-item-icon-wrapper[data-spp-id],
.saved-transition[data-spp-id] {
  display: inline-flex;
  align-items: center;
}

.btn-group-item-text[data-spp-id] {
  justify-self: flex-start;
  margin-right: 0.5rem;
}

.btn-group-item-icon-wrapper[data-spp-id] {
  overflow: hidden;
}

.form[data-spp-id] {
  /* background-color: var(--theme-primary); */
  padding: 1.5rem 1.25rem;
  padding-top: 0;
  position: relative;
}

.price[data-spp-id] {
  margin-bottom: 0.75rem;
  opacity: var(--t-title);
}

.price[data-spp-id] > .current {
  font-size: 1.6rem;
  font-weight: 600;
}

.price[data-spp-id] > .current::before {
  content: attr(data-currency);
  font-size: 0.9em;
  margin-right: 3px;
  pointer-events: none;
}

.price[data-spp-id] > .current::after {
  content: attr(data-decimal);
  font-size: 0.75em;
  pointer-events: none;
}

.price[data-spp-id] > .sale {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: var(--t-disabled);
  margin-right: 0.35rem;
  text-decoration: line-through;
}

.item-title[data-spp-id] {
  padding-bottom: 2rem;
  font-size: 1.325rem;
  font-weight: 400;
  opacity: var(--t-subtitle);
  position: relative;
}

.item-title[data-spp-id]::before {
  border-bottom: var(--ui-divide);
}
/* 
.size-dropdown-wrapper {
  padding: 2rem 0;
  position: relative;
  display: flex;
  align-items: center;
}

.size-dropdown-wrapper::before {
  border-bottom: var(--ui-divide);
}

.size-dropdown[data-spp-id] {
  height: 48px;
  border-radius: 8px;
  position: relative;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 360px;
  width: 100%;
  transition: 0.3s transform;
  backface-visibility: hidden;
}

.size-dropdown[data-spp-id]::before {
  background-color: currentColor;
  opacity: 0;
  transition: 0.2s opacity;
}

@media (hover: hover) and (pointer: fine) {
  .size-dropdown[data-spp-id]:hover::before {
    opacity: 0.15;
  }

  .size-dropdown[data-spp-id]:focus::before {
    opacity: 0.25;
  }
}

.size-dropdown[data-spp-id]:active::before {
  opacity: 0.15;
}

.size-dropdown[data-spp-id]:active {
  transform: scale3d(0.975, 0.975, 1);
}

.size-dropdown[data-spp-id]::after {
  border: var(--ui-divide);
  border-width: 2px;
  opacity: 0.8;
}

.size-dropdown[data-spp-id]:focus-visible:after {
  opacity: 1;
}

.size-dropdown[data-spp-id] > .title {
  font-size: 1.1rem;
}

.size-dropdown[data-spp-id] > .icon {
  transition: 0.2s transform;
}

.size-dropdown[data-spp-id] > .icon.active {
  transform: scale3d(1, -1, 1);
} */

.color[data-spp-id],
.size[data-spp-id],
.quantity[data-spp-id] {
  padding: 2.5rem 0;
  border-bottom: var(--ui-divide);
}

.quantity[data-spp-id] {
  padding: 2.5rem 0.5rem calc(2.5rem - 6px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.color[data-spp-id] > .title,
.size[data-spp-id] > .title,
.quantity[data-spp-id] > .title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.quantity[data-spp-id] > .title {
  margin-bottom: 0;
}

.quantity[data-spp-id] .v-msg-wrapper[data-spp-id] {
  text-align: right;
  margin-right: calc(30px - 0.5rem);
}

.size[data-spp-id] > .title {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.size-guide-activator[data-spp-id] {
  position: absolute;
  right: 0;
  width: auto;
  text-decoration: underline;
  text-underline-offset: 1px;
  opacity: var(--t-body);
}

.v-msg-wrapper[data-spp-id] {
  min-height: 1rem;
  width: 100%;
  display: inline-block;
  margin-top: 6px;
  pointer-events: none;
}

.v-msg[data-spp-id] {
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  color: var(--v-msg-color);
  margin-left: 0.7rem;
  display: inline-block;
  pointer-events: none;
}

.add-to-bag-wrapper[data-spp-id] {
  padding: 3rem 0 calc(1.5rem - 6px);
  display: grid;
  width: calc(100% - 1rem);
  margin: 0 auto;
}

.add-to-bag[data-spp-id] {
  width: 100%;
  /* box-shadow: var(--raise-light); */
  --btn__size-md: 48px;
  font-size: 1.2rem !important;
  font-weight: 600;
  max-width: 612px !important;
  margin: 0 auto !important;
}

.dark-theme .add-to-bag[data-spp-id].__disabled {
  --disabled: #22222281;
}

.add-to-bag-content-wrapper[data-spp-id] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0 1.5rem;
  flex-wrap: wrap;
  pointer-events: none;
}

.add-to-bag[data-spp-id] .price-wrapper {
  font-size: 0.975rem;
  opacity: var(--t-subtitle);
  margin-left: 0.5rem;
  font-weight: 400;
}

.add-to-bag[data-spp-id] .price::before {
  content: attr(data-currency);
  font-size: 0.95em;
  margin-right: 1px;
}

.add-to-bag[data-spp-id] .price::after {
  content: attr(data-decimal);
  font-size: 0.825em;
}
/* 
.add-to-bag[data-spp-id].cta-fab {
  position: fixed;
  bottom: calc(var(--nav-bar-height) + 1rem);
  margin: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  max-width: 280px;
  box-shadow: var(--raise-10);
  opacity: 1 !important;
} */

.add-to-bag-wrapper[data-spp-id] .v-msg-wrapper {
  text-align: center;
}

.product-info[data-spp-id] {
  position: relative;
  overflow: hidden;
  border-top: var(--ui-divide);
  padding-top: 0.5rem;
}

.product-info[data-spp-id]::before {
  height: 64px;
  border: var(--ui-divide);
  border-width: 0.5px 0;
  top: calc(64px + 0.5rem);
  width: calc(100% - 1.5rem);
  left: 1.5rem;
  opacity: 0.8;
}

.product-info[data-spp-id]::after {
  border-bottom: var(--ui-divide);
  margin-left: 1.5rem;
}

.product-info[data-spp-id] .ui-btn {
  display: flex;
  justify-content: space-between;
  height: 64px;
  padding: 0 1.5rem !important;
}

.product-info[data-spp-id] .ui-btn > [role="img"] {
  opacity: 0.5;
}

.next-and-previous-wrapper[data-spp-id] {
  padding: 2.75rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(164px, 40vw), 1fr));
  gap: 1rem;
}

.next[data-spp-id],
.previous[data-spp-id] {
  width: 100%;
  display: flex;
  gap: 0 !important;
}

.previous[data-spp-id] .ui-icon {
  margin-right: 0.5rem;
}

.next[data-spp-id] .ui-icon {
  margin-left: 0.5rem;
}

.recommended[data-spp-id] {
  position: relative;
  padding: 2rem 0 32px;
}

.recommended[data-spp-id]::before {
  border: var(--ui-divide);
  border-width: 0 0 0.5px;
}

.recommended[data-spp-id] .grid {
  grid-auto-flow: column;
  grid-template-columns: repeat(8, calc(50% - 1.125rem)) 0.375rem;
  overflow: auto hidden;
  scroll-snap-type: x;
  padding: 1rem 0 1rem 1.5rem;
  scroll-padding-left: 1.5rem;
  scroll-snap-padding-left: 1.5rem;
  gap: 0 0.75rem;
  position: relative;
}

.recommended[data-spp-id] .grid::after {
  content: "";
  width: 100%;
}

.recommended[data-spp-id] .grid > * {
  scroll-snap-align: start;
}

@media (min-width: 500px) {
  .recommended[data-spp-id] .grid {
    grid-template-columns: repeat(8, calc(min(30%, 224px) - 1.125rem)) 0.375rem;
  }
}

.recommended-header[data-spp-id],
.buy-the-look-header[data-spp-id] {
  margin: 0 0 0.5rem;
  padding: 0 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

/* .recommended-header[data-spp-id] svg {
  color: var(--success);
} */

.buy-the-look[data-spp-id],
.recommended[data-spp-id],
.root[data-srvd] {
  background: var(--theme-primary);
}

.light-theme .buy-the-look[data-spp-id] > .root.grid,
.light-theme .recommended[data-spp-id] > .root.grid,
.light-theme .root[data-srvd] > .root.grid {
  filter: var(--ds-light);
}

.buy-the-look[data-spp-id] {
  padding: 1.75rem 0;
  position: relative;
}

.buy-the-look[data-spp-id]::before {
  border: var(--ui-divide);
  border-width: 0.5px 0;
}

.buy-the-look-header[data-spp-id] {
  margin: 0.5rem 0 1.5rem;
}

/* .recommended-header[data-spp-id]:active .title-deco,
.buy-the-look-header[data-spp-id]:active .title-deco {
  color: var(--title-deco-color, unset);
} */

/* @media (hover: hover) and (pointer: fine) {
  .recommended-header[data-spp-id]:hover .title-deco,
  .buy-the-look-header[data-spp-id]:hover .title-deco {
    color: var(--title-deco-color, unset);
    transition-delay: 1750ms !important;
  }
} */

.droid[data-spp-id] {
  --title-deco-color: var(--droid-color);
}

.__buy-the-look[data-spp-id] {
  --title-deco-color: #ffd700;
}
</style>
