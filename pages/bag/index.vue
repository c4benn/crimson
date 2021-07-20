<script>
import {
  eventKey,
  sleep,
  springPresets,
  uiMount,
} from "~/components/utils/main";
// import { sleep } from "~/components/utils";
export default {
  name: "BagPage",

  async beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    if (this.$store.state.vmodel.dialogs.bagPage.active) {
      this.$store.commit("V_MODEL", {
        value: {
          template: this.dialogObject.template,
          active: false,
        },
        path: "bagPage",
        innerPath: "dialogs",
      });

      await sleep.call(this, 400);

      next(to);
    } else next();
  },

  data() {
    return {
      pageMounted: false,
      currentlyDeletedId: null,
      bannerExpanded: false,
      recieptIntersecting: false,
      deleted: [],
      pseudoItems: [
        { id: 22 },
        { id: 34 },
        { id: 221 },
        { id: 345 },
        { id: 30 },
        // { id: 1122 },
        // { id: 3422 },
        // { id: 22133 },
        // { id: 34511 },
        // { id: 3099 },
      ],
      deliveryInfoValidation: { timeStamp: 0, text: "", running: false },
    };
  },

  head() {
    return {
      title: `Your Bag${this.appendBagInfo || " (empty)"}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View items in your bag",
        },
      ],
    };
  },

  computed: {
    ...uiMount.computed,

    renderedComponents() {
      return [
        "appImg",
        "bagItem",
        "coupon",
        "deliveryInfo",
        "deliveryInstructions",
      ];
    },
    hasDeliveryInfo() {
      return this.$store.state.savedDeliveryInfo;
    },
    bagLength() {
      return this.$store.getters.bagLength;
    },
    appendBagInfo() {
      return `${
        this.bagLength > 0
          ? ` (${this.bagLength} item${this.bagLength > 1 ? "s" : ""})`
          : ""
      }`;
    },
    headerText() {
      return this.$store.state.vmodel.headerContent.showText;
    },
    dialogObject() {
      return this.$store.state.vmodel.dialogs.bagPage;
    },
  },

  watch: {
    ...uiMount.watch,

    headerText() {
      if (!this.headerText && this.pageMounted) {
        this.bannerExpanded = false;
      }
    },
  },

  created() {
    this.renderedComponents.forEach((x) => {
      if (this.$store.state.loadedComponents?.[x]) {
        this.loadedComponents.push(x);
      }
    });
  },

  mounted() {
    this.mountSelf();

    this.pageMounted = true;
    this.$nextTick(() => {
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: `Bag${this.appendBagInfo}`,
      });
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

    validateDelivery() {
      if (
        !this.pageMounted ||
        this.deliveryInfoValidation.running ||
        this.hasDeliveryInfo
      ) {
        return;
      }

      this.deliveryInfoValidation.running = true;

      const headerHeight =
        this.$root.$el.querySelector("#app-header")?.clientHeight || 0;
      const deliveryInfoEl = this.$refs["delivery-info"]?.$el;
      const scrollTop =
        deliveryInfoEl?.getBoundingClientRect().top +
        pageYOffset -
        headerHeight -
        42 +
        0.5;

      requestAnimationFrame(async () => {
        this.bannerExpanded = false;

        await sleep.call(this, 266);

        window.scrollTo({
          top: scrollTop,
          left: 0,
        });

        await sleep.call(this, 500);

        this.deliveryInfoValidation = {
          timeStamp: Date.now(),
          text: "*Required*",
        };

        this.deliveryInfoValidation.running = false;
      });
    },
  },

  render(h) {
    const scoping = { "data-bp-ix": "" };
    const main = (d, c) => h("main", d, c);
    const div = (d, c) => h("div", d, c);
    const section = (d, c) => h("section", d, c);
    const img = (d, c) => h("app-img", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const p = (d, c) => h("p", d, c);
    const span = (d, c) => h("span", d, c);
    const transition = (d) => h("ui-transition", d);
    const intersection = (d) => h("ui-intersection", d);
    const aside = (d, c) => h("aside", d, c);
    const ul = (d, c) => h("ul", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const clickable = (d, c) => h("ui-clickable", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const bagItem = (d) => h("bag-item", d);
    const coupon = (d) => h("coupon", d);
    const deliveryInfo = (d) => h("delivery-info", d);
    const deliveryInstructions = (d) => h("delivery-instructions", d);

    const emptyBag = () => {
      return div(
        {
          key: "empty-bag",
          attrs: { ...scoping },
          staticClass: "empty-bag-wrapper",
        },
        [
          div(
            {
              attrs: { ...scoping },
              staticClass: "empty-bag",
            },
            [
              img({
                props: {
                  src: "/img/illustrations/emptybag - by icons8 from ouch!.png",
                  alt: "empty bag by icons8 from ouch!",
                },
                staticClass: "background",
              }),
              h2(
                {
                  attrs: { ...scoping },
                  staticClass: "title",
                },
                "There is nothing in your bag."
              ),
              ["View Saved Items", "Go to Shop"].map((item, key) => {
                return btn(
                  {
                    key,
                    props: {
                      background: key == 0 ? "primary" : undefined,
                      color: key == 1 ? "primary" : undefined,
                      text: key == 1,
                      tag: "nuxt-link",
                      to: key == 0 ? "/saved" : "/",
                      raise: false,
                      simpleButton: true,
                      actionButton: true,
                    },
                    attrs: { ...scoping, title: item.toLowerCase() },
                    staticClass: `${key == 0 ? "raise-light" : ""} action`,
                  },
                  item
                );
              }),
            ]
          ),
        ]
      );
    };

    const bannerActivatorTitle = `${
      this.bannerExpanded ? "Hide" : "Show"
    } order summary`;

    const fullBag = () => {
      return div(
        {
          key: "full-bag",
          attrs: { ...scoping },
          staticClass: "full-bag",
        },
        [
          aside(
            {
              attrs: {
                ...scoping,
                tabindex: this.bannerExpanded ? "0" : undefined,
              },
              staticClass: "banner",
              class: [{ expanded: this.bannerExpanded }],
              on: this.bannerExpanded
                ? {
                    "!keyup": (e) => {
                      const Key = eventKey(e);
                      if (/esc/i.test(Key)) {
                        this.bannerExpanded = false;
                      }
                    },
                    "&touchmove": (e) => {
                      e.stopPropagation();
                    },
                  }
                : undefined,
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "banner-content fill-before",
                },
                [
                  h2(
                    {
                      attrs: { ...scoping },
                      staticClass: "banner-title",
                    },
                    "Order Summary"
                  ),
                  [
                    { name: "Subtotal", price: "8000.00" },
                    { name: "Delivery Fee", price: "1000.00" },
                    { name: "Processing Fee", price: "500.00" },
                    { name: "Total", price: "0", total: true },
                  ].map((item, key, arr) => {
                    const totalPrice = arr.reduce(
                      (a, b) => a + parseFloat(b.price),
                      0
                    );
                    return p(
                      {
                        key,
                        attrs: { ...scoping },
                        staticClass: `banner-summary-item banner-${item.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")} ${
                          item.total ? "fill-before" : ""
                        }`,
                      },
                      [
                        `${item.name}:`,
                        span(
                          {
                            attrs: { ...scoping },
                            staticClass: `banner-${item.name}-price`,
                          },
                          `${this.$currencies.naira}${
                            item.total ? totalPrice.toFixed(2) : item.price
                          }`
                        ),
                      ]
                    );
                  }),
                  btn(
                    {
                      props: {
                        background: "primary",
                        flat: true,
                        simpleButton: true,
                      },
                      attrs: { ...scoping },
                      staticClass: "banner-checkout",
                      on: {
                        "!click": () => {
                          this.validateDelivery();
                        },
                      },
                    },
                    "Check Out"
                  ),
                ]
              ),
              clickable(
                {
                  props: {
                    tag: "div",
                    persistent: true,
                  },
                  attrs: {
                    ...scoping,
                    tabindex: "0",
                    title: bannerActivatorTitle,
                  },
                  staticClass: "banner-activator fill-before-and-after",
                  class: [`${this.$theme.is}-theme`.toLowerCase()],
                  on: {
                    "!click": () => {
                      this.bannerExpanded = !this.bannerExpanded;
                    },
                  },
                },
                [
                  div(
                    {
                      attrs: { ...scoping },
                      staticClass: "banner-activator-content fill-before",
                    },
                    [
                      bannerActivatorTitle,
                      icon({
                        props: { size: 20, name: "chevron-down" },
                        attrs: { ...scoping },
                        staticClass: "banner-activator-icon",
                      }),
                    ]
                  ),
                ]
              ),
            ]
          ),

          coupon({
            staticClass: "coupon",
          }),

          ul(
            {
              ref: "item-wrapper",
              attrs: { ...scoping },
              staticClass: "item-wrapper",
            },
            [
              this.pseudoItems
                .filter((x) => !this.deleted.includes(x.id))
                .map((item, index) => {
                  return transition({
                    key: index,
                    props: {
                      custom: { leave: true },
                      transition: {
                        enter: "slide-y(100%)",
                        leave: "none",
                      },
                      fade: false,
                      ease: {
                        enter: "ease",
                      },
                      duration: {
                        enter: 300,
                        leave: 0,
                      },
                      // type: "spring",
                      springConfig: springPresets.stiff,
                    },
                    scopedSlots: {
                      default: () => {
                        return bagItem({
                          props: { id: item.id, tag: "li" },
                          key: item.id,
                          staticClass: "bag-item",
                          on: {
                            "delete-clicked": (e) => {
                              this.currentlyDeletedId = item.id;
                            },
                            "item-deleted": () => {
                              this.currentlyDeletedId = `${item.id}-confirmed`;

                              this.$nextTick(() => {
                                requestAnimationFrame(() =>
                                  this.deleted.push(item.id)
                                );
                              });
                            },
                          },
                          style:
                            this.currentlyDeletedId == `${item.id}-confirmed`
                              ? {
                                  transition:
                                    "0.3s transform ease, 0.3s opacity ease",
                                  transform: `scale3d(0.5,0.5,1)`,
                                  opacity: "0",
                                  willChange: `transform, opacity`,
                                  transformOrigin: "bottom",
                                }
                              : undefined,
                        });
                      },
                    },
                  });
                }),
            ]
          ),

          section(
            {
              attrs: { ...scoping },
              staticClass: "order-details-and-action fill-before",
            },
            [
              deliveryInfo({
                ref: "delivery-info",
                props: {
                  validation: this.deliveryInfoValidation,
                },
                on: {},
              }),

              deliveryInstructions({
                on: {},
              }),

              intersection({
                props: {
                  config: {
                    threshold: 0.5,
                  },
                },
                scopedSlots: {
                  default: (payload) => {
                    this.recieptIntersecting = payload?.isIntersecting;
                    return div(
                      {
                        attrs: { ...scoping },
                        staticClass: "reciept fill-before",
                      },
                      [
                        h2(
                          {
                            attrs: { ...scoping },
                            staticClass: "reciept-title",
                          },
                          "Order Summary"
                        ),

                        [
                          { name: "Subtotal", price: "8000.00" },
                          { name: "Delivery Fee", price: "1000.00" },
                          { name: "Processing Fee", price: "500.00" },
                          { name: "Total", price: "0", total: true },
                        ].map((item, key, arr) => {
                          const totalPrice = arr.reduce(
                            (a, b) => a + parseFloat(b.price),
                            0
                          );
                          return p(
                            {
                              key,
                              attrs: { ...scoping },
                              staticClass: `reciept-summary-item reciept-${item.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`,
                            },
                            [
                              `${item.name}:`,
                              span(
                                {
                                  attrs: { ...scoping },
                                  staticClass: `reciept-${item.name}-price`,
                                },
                                `${this.$currencies.naira}${
                                  item.total
                                    ? totalPrice.toFixed(2)
                                    : item.price
                                }`
                              ),
                            ]
                          );
                        }),
                        btn(
                          {
                            props: {
                              background: "primary",
                              flat: true,
                              simpleButton: true,
                              disabled: !this.hasDeliveryInfo,
                              actionButton: true,
                            },
                            attrs: { ...scoping },
                            staticClass: "reciept-action",
                            on: {
                              "!click": () => {
                                this.validateDelivery();
                              },
                            },
                          },
                          "Check Out"
                        ),
                        !this.hasDeliveryInfo
                          ? p(
                              {
                                attrs: { ...scoping },
                                staticClass: "reciept-v-msg",
                              },
                              `*Delivery info required*`
                            )
                          : null,
                      ]
                    );
                  },
                },
              }),
            ]
          ),

          div(
            {
              attrs: { ...scoping },
              staticClass: "bottom-action-wrapper fill-before",
            },
            [
              ["Continue Shopping", "Empty bag"].map((item, key) => {
                return btn(
                  {
                    key,
                    props: {
                      simpleButton: true,
                      flat: true,
                      filledText: key == 0,
                      actionButton: true,
                      text: key == 1,
                      // color: "primary",
                      // outlined: key == 0 && this.$theme.light,
                    },
                    attrs: { ...scoping, title: item.toLowerCase() },
                    staticClass: `${item
                      .toLowerCase()
                      .replace(/\s+/, "-")}-fbg bottom-action`,
                    on: {
                      click: async () => {
                        if (key == 1) {
                          window.scrollTo(0, 0);
                          await sleep.call(this, 32);
                          this.$store.commit("BAG", { action: "empty" });
                        }
                      },
                    },
                  },
                  item
                );
              }),
            ]
          ),
        ]
      );
    };

    return main(
      {
        attrs: { ...scoping, id: "bag-page" },
        staticClass: "root",
        class: [
          {
            "show-banner": this.headerText && !this.recieptIntersecting,
            "banner-expanded": this.bannerExpanded,
          },
        ],
        on: this.bannerExpanded
          ? {
              "&touchmove": () => {
                this.$nextTick(() =>
                  requestAnimationFrame(() => (this.bannerExpanded = false))
                );
              },
              "&wheel": () => {
                this.$nextTick(() =>
                  requestAnimationFrame(() => (this.bannerExpanded = false))
                );
              },
            }
          : {},
      },
      [
        this.bagLength
          ? div({
              attrs: {
                ...scoping,
                "aria-hidden": !this.bannerExpanded ? "true" : undefined,
                "aria-label": this.bannerExpanded
                  ? "click to close order summary"
                  : undefined,
              },
              staticClass: "backdrop",
              on: this.bannerExpanded
                ? {
                    "&!mousedown": () => {
                      this.bannerExpanded = false;
                    },
                    "&!click": () => {
                      this.bannerExpanded = false;
                    },
                  }
                : undefined,
            })
          : null,
        transition({
          props: {
            transition: {
              leave: "slide-y(10vh)",
              enter: "slide-y(-10vh)",
            },
            duration: { leave: 400 },
          },
          scopedSlots: {
            default: () => {
              return !this.bagLength ? emptyBag() : fullBag();
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-bp-ix] {
  --banner-height: 42px;
  min-height: calc(100vh - var(--app-bars-height));
}

.root[data-bp-ix] > .backdrop {
  position: fixed;
  background-color: #000;
  z-index: 1;
  height: calc(100% - var(--app-bars-height));
  width: 100%;
  top: var(--header-height);
  opacity: 0;
  transition: 0.3s opacity;
  pointer-events: none;
}

.root.banner-expanded[data-bp-ix] > .backdrop {
  opacity: 0.7;
  transition: 0.35s opacity;
  pointer-events: initial;
  touch-action: none;
}

/* empty bag */

.empty-bag-wrapper[data-bp-ix] {
  display: grid;
  align-items: center;
  min-height: inherit;
}

@media (orientation: landscape) {
  .empty-bag-wrapper[data-bp-ix] {
    min-height: calc(100vh - calc(var(--bars-height) * 2));
  }
}

.empty-bag[data-bp-ix] {
  display: grid;
  grid-template-rows: repeat(4, auto);
  justify-items: center;
  padding: 2rem 0.5rem;
  row-gap: 1.25rem;
  align-self: center;
  margin-bottom: max(96px, 20vh);
}

.title[data-bp-ix] {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: var(--t-title);
}

.empty-bag[data-bp-ix] > .background::before {
  visibility: hidden;
}

.empty-bag[data-bp-ix] > .background {
  height: 100%;
  min-width: 128px;
  height: max(96px, 20vh);
  margin: 1rem;
  outline: none !important;
}

.action[data-bp-ix] {
  min-width: 256px;
}

.action[data-bp-ix]:last-of-type {
  margin-top: 1rem;
}

/* empty bag ends */

.full-bag[data-bp-ix] {
  display: grid;
}

.root[data-bp-ix]:not(.show-banner) .banner[data-bp-ix] {
  transition: 0s;
  visibility: hidden;
  opacity: 0;
  transform: translate3d(0, -4px, 0);
}

.root[data-bp-ix]:not(.show-banner) .banner-activator[data-bp-ix],
.root[data-bp-ix]:not(.show-banner) .banner-content {
  transition: 0s !important;
}

.banner[data-bp-ix] {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  --content-height: calc(82px + 8.25rem);
  height: calc(var(--content-height) + var(--banner-height));
  pointer-events: none;
  transition: 0.25s opacity, 0.2s transform;
  transform: translate3d(0, 0, 0);
  outline: none !important;
}

.banner[data-bp-ix] > div {
  pointer-events: initial;
  touch-action: none;
}

.banner-content[data-bp-ix] {
  background-color: var(--theme-surface);
  transition: 0.25s transform;
  transform: translate3d(0, -100%, 0);
  backface-visibility: hidden;
  position: relative;
  display: grid;
  grid-template-rows: 38px 1.75rem 1.5rem calc(1.5rem + 2px) 2rem calc(
      42px + 1.5rem
    );
  padding: 0 1.5rem;
  align-items: flex-end;
  position: relative;
}

.banner-content[data-bp-ix]::before {
  border-bottom: var(--ui-divide);
}

.banner.expanded[data-bp-ix] .banner-activator[data-bp-ix].dark-theme {
  --theme-banner: #333;
}

.banner-activator[data-bp-ix] {
  background-color: var(--theme-banner);
  position: relative;
  height: var(--banner-height);
  backface-visibility: hidden;
  transition: 0.25s transform;
  transform: translate3d(
    0,
    calc(var(--content-height) - calc(var(--content-height) * 2) - 0.5px),
    0
  );
  font-size: 0.975rem;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none !important;
  cursor: pointer;
  box-shadow: var(--raise-normal);
}

.banner-activator[data-bp-ix]::after {
  opacity: 0;
  background-color: currentColor;
  transition: 0.3s opacity;
}

.banner-activator-content[data-bp-ix] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: 0.3s transform;
}

.banner-activator-content[data-bp-ix]::before {
  border-radius: 4px;
  border: var(--ui-divide);
  border-width: 1px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  top: -2px;
  left: -2px;
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .banner-activator-content[data-bp-ix]:focus-visible::before {
    opacity: 1;
  }

  .banner-activator[data-bp-ix]:hover::after {
    opacity: 0.15;
  }

  .banner-activator[data-bp-ix]:focus::after {
    opacity: 0.25;
  }
}

.banner-activator[data-bp-ix].Active::after {
  opacity: 0.25;
  transition: 0s;
}

.banner-activator[data-bp-ix].slow-active::after {
  transition: 0.3s opacity;
}

.banner-activator[data-bp-ix].Active > div {
  transform: scale3d(0.975, 0.975, 1);
}

.banner-activator-icon {
  margin-left: 0.5rem;
}

.banner[data-bp-ix].expanded > div {
  transform: translate3d(0, 0, 0);
  transition: 0.25s transform;
}

.banner[data-bp-ix].expanded .banner-activator-icon {
  transform: rotate(-180deg);
}

/* .banner-activator[data-bp-ix]::before {
  border-bottom: var(--ui-divide);
} */

.banner-title[data-bp-ix] {
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 0 0.25rem 0.15rem;
  font-size: 1.1rem !important;
  font-weight: 550 !important;
  opacity: var(--t-title);
}

.banner-summary-item[data-bp-ix] {
  padding: 0 0.5rem;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: var(--t-body);
}

.banner-summary-item[data-bp-ix] > span {
  letter-spacing: 0.5px;
}

.banner-processing-fee[data-bp-ix] {
  padding-bottom: 2px;
}

.banner-total[data-bp-ix] {
  position: relative;
  height: 100%;
  align-items: center;
  font-size: 1.105rem;
  font-weight: 600;
  opacity: var(--t-title);
}

.banner-total[data-bp-ix]::before {
  border-bottom: var(--ui-divide);
}

.banner-checkout[data-bp-ix] {
  align-self: center;
  justify-self: flex-end;
  min-width: 128px;
  width: min(45%, 172px);
}

.item-wrapper[data-bp-ix] {
  padding: 48px 1.25rem 3rem;
  position: relative;
  display: grid;
  row-gap: 2.5rem;
  position: relative;
}

.order-details-and-action[data-bp-ix] {
  background: var(--theme-primary);
  padding-bottom: 2rem;
  position: relative;
}

/* .order-details-and-action[data-bp-ix]::before {
  border-bottom: var(--ui-divide);
  opacity: var(--t-disabled);
} */

.reciept[data-bp-ix] {
  background-color: var(--theme-banner);
  margin: 3rem auto;
  position: relative;
  padding: 0.75rem;
  border-radius: 6px;
  display: grid;
  grid-template-rows: 48px repeat(3, 24px) 28px auto;
  max-width: 700px;
  width: calc(100% - 1.5rem);
}

.light-theme .reciept[data-bp-ix] {
  box-shadow: var(--raise-light);
}

.reciept-title[data-bp-ix] {
  align-self: center;
  margin-left: 0.5rem;
  opacity: var(--t-title);
}

.reciept-summary-item[data-bp-ix] {
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  margin: 0 1rem;
  opacity: var(--t-body);
}

.reciept-total[data-bp-ix] {
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--t-title);
}

.reciept-action[data-bp-ix] {
  width: calc(100% - 1.5rem);
  display: grid;
  align-self: center;
  margin: 1rem auto 0.5rem;
}

.reciept[data-bp-ix]::before {
  border: var(--ui-divide);
  border-width: 1.7px;
  border-style: dashed;
}

.reciept-v-msg[data-bp-ix] {
  font-size: 0.875rem;
  margin-left: 0.75rem;
  color: var(--v-msg-color);
}

.full-bag[data-bp-ix] .coupon {
  margin: var(--banner-height) auto -0.75rem;
  width: calc(100% - 6rem);
  min-width: 290px;
}

.bottom-action-wrapper[data-bp-ix] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(224px, 45vw), 1fr));
  gap: 1.5rem 1rem;
  margin-bottom: 0.5rem;
  padding: 3.5rem 1.25rem 3rem;
  position: relative;
}

/* .bottom-action-wrapper[data-bp-ix]::before {
  border-top: var(--ui-divide);
} */

.bottom-action[data-bp-ix] {
  margin: 0 auto;
  width: 100%;
  max-width: max(85vw, 285px);
}

.continue-shopping-fbg[data-bp-ix] {
  background: var(--theme-banner);
  color: var(--primary);
}

.empty-bag-fbg[data-bp-ix] {
  background-color: inherit !important;
  color: var(--primary);
}

/* .empty-bag-fbg[data-bp-ix]::before {
  opacity: 0.1;
} */
</style>
