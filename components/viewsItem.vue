<script>
import { nextFrame, springPresets } from "./utils/main";
export default {
  name: "ViewsItem",

  props: {
    tag: {
      type: String,
      default: "div",
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Object,
      required: true,
      default: () => ({
        sale: undefined,
        real: "10",
      }),
    },
    img: {
      type: Object,
      required: true,
      default: () => ({
        src: "",
        alt: "",
      }),
    },
    to: {
      type: String,
      default: undefined,
    },
    id: {
      type: String,
      default: undefined,
    },
    badges: {
      type: Object,
      default: () => ({
        new: true,
        sale: false,
        lowStock: false,
        sellingFast: false,
      }),
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    gridView: {
      type: [String, Number],
      default: 1,
    },
    backdrop: {
      type: Object,
      default: () => ({}),
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isLowInStock: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    saved: false,
    showSaved: false,
    notifySaved: false,
    savedTimeStamp: null,
    savedTransitionState: "",
  }),

  computed: {
    singleGrid() {
      return this.gridView == 1;
    },

    getPricePath() {
      return this.price.sale ? "sale" : "real";
    },

    tags() {
      const newIn = this.isNew;
      const onSale = this.getPricePath == "sale";
      const lowStock = this.isLowInStock;

      const value = newIn || lowStock || onSale ? [] : false;

      if (Array.isArray(value)) {
        newIn &&
          value.push({
            text: "New",
            class: "info",
          });
        onSale &&
          value.push({
            text: "5% Off",
            class: "warning",
          });
        lowStock &&
          value.push({
            text: "Few left",
            class: "error",
          });
      }

      return value;
    },
  },

  watch: {
    async saved(n) {
      if (n) {
        const TS = this.savedTimeStamp;

        this.savedTransitionState = "beforeUpdate";

        this.showSaved = true;

        await nextFrame();

        if (this.savedTimeStamp != TS) {
          return;
        }

        this.notifySaved = true;

        await this.$sleep(2000);

        if (this.savedTimeStamp != TS) {
          return;
        }

        this.notifySaved = false;

        await nextFrame();

        if (this.savedTimeStamp != TS) {
          return;
        }

        this.showSaved = false;
      } else {
        const TS = this.savedTimeStamp;

        this.notifySaved = false;

        await this.$sleep(600);

        if (this.savedTimeStamp != TS) {
          return;
        }

        this.showSaved = false;
      }
    },
    async notifySaved(n) {
      if (!n) {
        await nextFrame();

        this.showSaved = false;
      }
    },
  },

  render(h) {
    const scoping = { "data-vim": "" };

    const root = (d, c) => h(this.tag, d, c);

    const img = (d, c) => h("app-img", d, c);

    const h2 = (d, c) => h("h2", d, c);

    const h3 = (d, c) => h("h3", d, c);

    const ul = (d, c) => h("ul", d, c);

    const li = (d, c) => h("li", d, c);

    const span = (d, c) => h("span", d, c);

    const div = (d, c) => h("div", d, c);

    const p = (d, c) => h("p", d, c);

    const savedBtn = (d, c) => h("saved-btn", d, c);

    const btn = (d, c) => h("ui-btn", d, c);

    const transition = (d, c) => h("ui-transition", d, c);

    return root(
      {
        attrs: { ...scoping, "aria-label": this.title.toLowerCase() },
        props: {
          ...this.componentProps,
        },
        staticClass: "root fill-after",
        class: [
          {
            "single-grid": this.singleGrid,
            "will-change-content": !/^after|cancelled|^$/i.test(
              this.savedTransitionState
            ),
          },
        ],
      },
      [
        img({
          props: {
            src: this.img.src,
            alt: this.img.alt,
            tag: "ui-clickable",
            componentProps: {
              tag: "div",
            },
            width: this.singleGrid ? "320px" : "160px",
            height: this.singleGrid ? "320px" : "160px",
          },
          attrs: {
            title: `click to view ${this.title}`.toLowerCase(),
          },
        }),

        div(
          {
            attrs: {
              ...scoping,
              "aria-label": "product info",
            },
            staticClass: "product-info",
          },
          [
            h2(
              {
                attrs: { ...scoping },
                staticClass: "title",
              },
              [this.title]
            ),

            h3(
              {
                attrs: {
                  ...scoping,
                  "data-real-price":
                    this.getPricePath == "sale"
                      ? `${this.$c4.currencies.naira}${this.price.real}`
                      : undefined,
                },
                staticClass: "price",
              },
              [`${this.$c4.currencies.naira}${this.price[this.getPricePath]}`]
            ),

            this.singleGrid
              ? ul(
                  {
                    attrs: { ...scoping, "aria-label": "available colors" },
                    staticClass: "colors-wrap",
                  },
                  ["#007bff", "#009bee", "#fff"].map((item, key) => {
                    return li({
                      key,
                      attrs: { ...scoping, title: item },
                      staticClass: "color",
                      style: {
                        "--color": item,
                      },
                    });
                  })
                )
              : null,

            this.singleGrid
              ? span(
                  {
                    attrs: { ...scoping, "aria-label": "available sizes" },
                    staticClass: "sizes-wrap",
                  },
                  [`SM • MD • LG`]
                )
              : null,

            btn(
              {
                props: {
                  size: "sm",
                  shape: "pill",
                  color: "info",
                  readonly: true,
                  filledText: true,
                  flat: true,
                },
                attrs: {
                  ...scoping,
                  "aria-label": "order",
                },
                staticClass: "order-btn",
              },
              "ORDER"
            ),
          ]
        ),

        this.singleGrid &&
          savedBtn({
            props: {
              componentProps: {
                filledText: true,
              },
            },
            staticClass: "saved-btn",
            on: {
              toggled: (e, evt) => {
                this.saved = e;

                this.savedTimeStamp = evt?.timeStamp || performance.now();
              },
            },
          }),

        // this.showSaved
        //   ? [
        //       div({
        //         attrs: {
        //           ...scoping,
        //           "aria-hidden": "true",
        //         },
        //         staticClass: "backdrop",
        //         class: [
        //           {
        //             __visible: this.notifySaved,
        //           },
        //         ],
        //         style: {
        //           "--background": this.backdrop.background,
        //         },
        //         on: {
        //           mousedown: (e) => {
        //             e.stopPropagation();

        //             e.preventDefault();

        //             this.notifySaved = false;
        //           },

        //           click: (e) => {
        //             e.stopPropagation();

        //             e.preventDefault();
        //           },
        //         },
        //       }),
        //     ]
        //   : null,

        transition({
          props: {
            transition: "scale(1.25)",
            // type: "spring",
            ease: "ease",
            springConfig: springPresets.wobbly,
            previousTransform: "translate(-50%,-50%) ",
          },
          scopedSlots: {
            default: (payload) => {
              this.savedTransitionState = payload;

              return (
                this.notifySaved &&
                p(
                  {
                    key: this.notifySaved,
                    attrs: {
                      ...scoping,
                      "aria-hidden": "true",
                    },
                    staticClass: "saved-alert",
                  },
                  [h("svg-checked"), "Saved"]
                )
              );
            },
          },
        }),

        this.singleGrid &&
          this.tags &&
          ul(
            {
              attrs: { ...scoping, "aria-label": "product tags" },
              staticClass: "tags-wrap",
            },
            this.tags.map((item, key) => {
              const text = item.text;
              const $text = text.toLowerCase();
              const height = text.replace(/\s+/g, "").length;

              return li({
                key,
                attrs: {
                  ...scoping,
                  "aria-label": `product tag (${$text})`,
                  title: $text,
                  "data-content": text,
                },
                staticClass: `tag bold-text ${item.class}`,
                style: {
                  "--height": `calc(${height}ch + ${
                    height > 5 ? "1.15rem" : "1.5rem"
                  })`,
                },
              });
            })
          ),
      ]
    );
  },
};
</script>

<style>
.root[data-vim].single-grid {
  --img-size: 320px;
  --title-font-size: 1.15rem;
  --price-font-size: 1.25rem;
  --root-padding: 3rem 1rem;
  --order-btn-font-size: 12.5px;
  --root-border-radius: 0;
  --order-btn-padding: 3px 10px;
  --price-margin-top: 0.5rem;
}

.root:not(.single-grid)[data-vim] {
  --img-size: 160px;
  --title-font-size: 0.95rem;
  --price-font-size: 1.05rem;
  --root-padding: 1.5rem 1rem;
  --order-btn-font-size: 10px;
  --root-border-radius: var(--rounded);
  --order-btn-padding: 0px 9px;
  --price-margin-top: 0.35rem;
}

.root[data-vim] {
  position: relative;
  display: grid;
  text-decoration: none;
  padding: var(--root-padding);
  border-radius: var(--root-border-radius);
  isolation: isolate;
}

.root[data-vim] > .root[data-aig] {
  display: block;
  height: var(--img-size);
  display: grid;
  place-items: center;
}

.root[data-vim] > .root[data-aig] > .__content {
  width: var(--img-size);
  height: var(--img-size);
  object-fit: cover;
  left: auto;
}

.product-info[data-vim] {
  display: grid;
}

.title[data-vim] {
  font-weight: 400;
  font-size: var(--title-font-size);
  opacity: var(--t-subtitle);
  text-align: center;
}

.price[data-vim] {
  font-weight: 600;
  font-size: var(--price-font-size);
  opacity: var(--t-title);
  text-align: center;
  margin-top: var(--price-margin-top);
  color: var(--info);
}

.price[data-vim]::before {
  --t-disabled: 0.45;
  content: attr(data-real-price);
  color: var(--theme-surface-text);
  opacity: var(--t-disabled);
  font-size: 0.875rem;
  text-decoration: line-through;
  margin-right: 0.5rem;
  font-weight: 400;
}

.light-theme .price[data-vim]::before {
  --t-disabled: 0.6;
}

.colors-wrap[data-vim] {
  --size: 1.15rem;
  height: var(--size);
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1rem auto 0.5rem;
}

.color[data-vim] {
  --_size: var(--size);
  border-radius: 50%;
  background: var(--color);
  margin: 0 min(calc(var(--size) * 0.15), 50px);
  opacity: var(--t-body);
  border: var(--ui-divide);
}

.sizes-wrap[data-vim] {
  text-align: center;
  font-size: 0.85rem;
  opacity: var(--t-caption);
  font-weight: 400;
  margin: 0.25rem auto;
}

.order-btn[data-vim] {
  justify-self: center;
  margin-top: 1rem;
  pointer-events: none !important;
  --fontSize-sm: var(--order-btn-font-size);
  --pill__padding-sm: var(--order-btn-padding);
}

.root[data-vim] > .saved-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  --icon__size-md: 44px !important;
  z-index: 12;
}

.root[data-vim] > .saved-btn svg {
  width: 24px !important;
  height: 24px !important;
}

/* .backdrop[data-vim] {
  background: var(--background);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 10;
  transition: opacity 0.25s linear;
  opacity: 0;
  border: var(--ui-divide);
  border-width: 0.75px 0;
}

.backdrop[data-vim].__visible {
  opacity: 0.65;
} */

.saved-alert[data-vim] {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  padding: 0 1rem;
  border-radius: var(--rounded);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  box-shadow: var(--raise-dark);
  color: #000000e0;
  background-color: #fff;
}

.saved-alert[data-vim] > span {
  --_size: 1.25rem;
  color: var(--success);
  margin-right: 0.5rem;
}

.tags-wrap[data-vim] {
  z-index: 13;
  position: absolute;
  top: -2px;
  left: 1rem;
  height: 100%;
  width: calc(100% - 2rem);
  filter: drop-shadow(0px 2px 2px rgb(0, 0, 0, 0.4))
    drop-shadow(0px 6px 8px rgb(0, 0, 0, 0.2));
  display: flex;
  font-size: 0.85rem;
  pointer-events: none;
}

.tag[data-vim] {
  display: inline-flex;
  width: 28px;
  min-height: 48px;
  height: auto;
  box-shadow: var(--raise-normal);
  margin-right: 0.5rem;
  border-radius: 2px 2px 0 0;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 8px), 0 100%);
  height: var(--height);
  position: relative;
}

.tag[data-vim]::after {
  content: attr(data-content);
  display: inline-grid;
  place-items: center;
  width: auto;
  white-space: nowrap;
  height: 1.25rem;
  transform: rotate(-90deg) translate(-4px, -50%);
  transform-origin: 0 0;
  position: absolute;
  bottom: 0;
  left: 50%;
}
</style>
