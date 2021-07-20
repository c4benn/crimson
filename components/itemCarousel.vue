<script>
import { eventKey, uiMount } from "~/components/utils/main";
export default {
  name: "ItemCarousel",

  props: {
    item: {
      type: Object,
      default: () => ({
        img: [
          {
            src: "/img/campaign/6.png",
            alt: "alt",
          },
          {
            src: "/img/campaign/6.png",
            alt: "alt",
          },
          {
            src: "/img/campaign/6.png",
            alt: "alt",
          },
          {
            src: "/img/campaign/6.png",
            alt: "alt",
          },
        ],
        quantity: 10,
        onSale: false,
        newIn: false,
      }),
    },
  },

  data() {
    return {
      delimiter: 0,
      intersection: {
        title: {},
        price: {},
      },

      renderedComponents: ["appImg"],
    };
  },

  computed: {
    ...uiMount.computed,

    soldOut() {
      return this.item.quantity < 1;
    },
    itemsCount() {
      return this.item.quantity;
    },
  },

  watch: {
    ...uiMount.watch,

    "intersection.title"(n) {
      this.$emit("title-intersection", n);
    },
    "intersection.price"(n) {
      this.$emit("price-intersection", n);
    },
  },

  mounted() {
    this.mountSelf();
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: "itemCarousel",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-icl": "" };
    const section = (d, c) => h("section", d, c);
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const p = (d, c) => h("p", d, c);
    const img = (d) => h("app-img", d);
    const intersection = (d) => h("ui-intersection", d);
    const items = this.item.img;

    return section(
      {
        attrs: {
          ...scoping,
          tabindex: "0",
        },
        staticClass: "root",
        style: {
          "--length": items.length,
        },
        on: {
          keydown: (e) => {
            const Key = eventKey(e);
            if (/arrow_left|arrow_right/i.test(Key)) {
              e.stopPropagation();

              e.preventDefault();
            }
          },
          keyup: (e) => {
            const Key = eventKey(e);
            if (/arrow_left|arrow_right/i.test(Key)) {
              e.stopPropagation();

              e.preventDefault();

              this.$el.focus?.({ preventScroll: true });

              const scrollWrapper = this.$refs["scroll-wrapper"];

              if (/left/i.test(Key)) {
                if (this.delimiter > 0) {
                  this.$el.click();
                  requestAnimationFrame(() => {
                    scrollWrapper?.scrollTo({
                      top: 0,
                      left: scrollWrapper?.clientWidth * (this.delimiter - 1),
                      behavior: "smooth",
                    });
                  });
                }
              } else if (this.delimiter < 3) {
                this.$el.click();
                requestAnimationFrame(() => {
                  scrollWrapper?.scrollTo({
                    top: 0,
                    left: scrollWrapper?.clientWidth * (this.delimiter + 1),
                    behavior: "smooth",
                  });
                });
              }
            }
          },
        },
      },
      [
        div(
          {
            ref: "scroll-wrapper",
            attrs: { ...scoping },
            staticClass: "wrapper hide-scrollbar",
          },
          [
            items.map((item, index) => {
              return intersection({
                key: index,
                props: {
                  config: {
                    threshold: 0.55,
                    rootMargin: "50% 0px",
                  },
                },
                scopedSlots: {
                  default: (payload) => {
                    if (payload.isIntersecting) {
                      requestAnimationFrame(() => (this.delimiter = index));
                    }
                    return img({
                      key: index,
                      ref: `item-${index}`,
                      props: {
                        src: item.src,
                        alt: item.alt,
                      },
                      staticClass: "item",
                      class: [{ active: this.delimiter == index }],
                    });
                  },
                },
              });
            }),
          ]
        ),

        div(
          {
            attrs: { ...scoping },
            staticClass: "overlay",
          },
          [
            intersection({
              props: {
                config: {
                  threshold: 0.2,
                  rootMargin: `-${this.$store.state.barsHeight.appBar} 0px 0px 0px`,
                },
              },
              scopedSlots: {
                default: (payload) => {
                  this.intersection.title = payload;

                  return h2(
                    {
                      attrs: { ...scoping },
                      staticClass: "title line-clamp-2",
                    },
                    ["A very cool and unique name"]
                  );
                },
              },
            }),
            span(
              {
                attrs: { ...scoping },
                staticClass: "chip pill",
                class: [
                  {
                    primary: false,
                    "theme-primary-invert": true,
                  },
                ],
              },
              [`${this.delimiter + 1}/${items.length}`]
            ),
            (this.onSale || this.newIn) &&
              span({
                attrs: { ...scoping },
                staticClass: "overlay-header",
                class: [
                  {
                    "on-sale": true,
                    "new-in": true,
                  },
                ],
              }),
            div(
              {
                attrs: { ...scoping },
                staticClass: "delimiter-wrapper",
              },
              [
                items.map((_, key) => {
                  return h("button", {
                    key,
                    attrs: { ...scoping, title: `image-${key + 1}` },
                    staticClass: "delimiter fill-before-and-after",
                    class: [{ active: this.delimiter == key }],
                    on: {
                      "!click": () => {
                        this.$nextTick(() => {
                          const scrollLeft =
                            this.$refs[`item-${key}`]?.$el?.offsetLeft || 0;
                          requestAnimationFrame(() =>
                            this.$refs["scroll-wrapper"]?.scrollTo({
                              left: scrollLeft,
                              top: 0,
                              behavior: "smooth",
                            })
                          );
                        });
                      },
                    },
                  });
                }),
              ]
            ),
            (this.soldOut || +this.itemsCount < 4) &&
              span(
                {
                  attrs: { ...scoping },
                  staticClass: "overlay-footer error",
                },
                `${
                  +this.itemsCount
                    ? `${this.itemsCount} items left`
                    : "Sold Out"
                }`
              ),
            intersection({
              props: {
                config: {
                  threshold: 0.1,
                  rootMargin: `-${
                    parseFloat(this.$store.state.barsHeight.appBar) + 44
                  }px 0px 0px 0px`,
                },
              },
              scopedSlots: {
                default: (payload) => {
                  this.intersection.price = payload;

                  return p(
                    {
                      attrs: { ...scoping, "data-decimal": "00" },
                      staticClass: "price",
                    },
                    ["₦8000."]
                  );
                },
              },
            }),
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-icl] {
  position: relative;
  overscroll-behavior-x: contain;
  outline: none !important;
}

.wrapper[data-icl] {
  display: grid;
  grid-template-columns: repeat(var(--length), 100%);
  height: 100%;
  max-width: 100%;
  overflow: auto hidden;
  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  column-gap: 5rem;
  position: relative;
}

.wrapper[data-icl] > .item {
  scroll-snap-align: start;
}

.wrapper[data-icl] > .item > * {
  transition: 0.4s transform;
  transform: scale3d(0.875, 0.875, 1);
}

.wrapper[data-icl] > .item.active > * {
  transform: scale3d(1, 1, 1);
}

.wrapper[data-icl] img {
  padding: 1rem;
  object-position: center;
}

.overlay[data-icl] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.title[data-icl],
.price[data-icl] {
  font-family: "Bangers", monospace;
}

.title[data-icl] {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  font-size: 1.75rem;
  max-width: 60%;
  font-weight: normal;
  pointer-events: initial;
  opacity: var(--t-body);
}

.chip[data-icl] {
  position: absolute;
  top: 1.75rem;
  right: 1.5rem;
  pointer-events: none;
  padding: 0 0.6rem;
  font-size: 0.825rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  letter-spacing: 0.65px;
  font-weight: 600;
  opacity: var(--t-body);
}

.price[data-icl] {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  /* right: 50%;
  transform: translateX(50%); */
  font-size: 2.35rem;
  opacity: var(--t-title);
  padding: 0 0.5rem;
  pointer-events: initial;
}

.price[data-icl]::after {
  content: attr(data-decimal);
  font-size: 0.8em;
  pointer-events: initial;
  user-select: initial;
  -webkit-user-drag: initial;
}

.overlay-header[data-icl] {
  position: absolute;
  height: 1.75rem;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}

.overlay-header[data-icl]::before,
.overlay-header[data-icl]::after {
  height: 100%;
  padding: 0 0.65rem;
  width: auto;
  display: grid;
  place-items: center;
}

.overlay-header[data-icl]::before {
  content: "On Sale";
  background-color: var(--warning);
  color: #000;
  border-radius: 0 0 6px 0;
}

.overlay-header[data-icl]::after {
  content: "New";
  background-color: #4f4fe4;
  color: #fff;
  border-radius: 0 0 0 6px;
}

.overlay-footer[data-icl] {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: 1.5rem;
  padding: 0 0.65rem;
  border-radius: 4px 4px 0 0;
  display: grid;
  place-items: center;
}

.delimiter-wrapper[data-icl] {
  --size: 0.75rem;
  position: absolute;
  width: 100%;
  height: 2rem;
  bottom: 5rem;
  padding: 0 1rem;
  display: grid;
  justify-content: center;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(var(--length), var(--size));
  column-gap: 1rem;
  /* display: none; */
}

.delimiter[data-icl] {
  --i-size: calc(var(--size) - 0.1rem);
  width: var(--i-size);
  height: var(--i-size);
  border-radius: var(--i-size);
  background-color: var(--theme-surface-text);
  /* background: var(--primary); */
  position: relative;
  display: inline-block;
  --t-disabled: 0.5;
  opacity: var(--t-disabled);
  transform: scale3d(0.75, 0.75, 1);
  transition: 0.2s opacity, 0.2s transform;
  pointer-events: initial;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: none;
}

.delimiter[data-icl]::after {
  background: var(--primary);
  opacity: 0;
  transition: 0.2s opacity;
}

@media (hover: hover) and (pointer: fine) {
  .delimiter[data-icl]:hover {
    opacity: var(--t-body);
  }

  .delimiter[data-icl]:focus {
    opacity: 1;
  }
}

.delimiter[data-icl]:focus-visible::before {
  visibility: visible;
}

.delimiter.active[data-icl] {
  opacity: 1;
  transform: scale3d(1, 1, 1);
}

.delimiter.active[data-icl]::after {
  opacity: 1;
}

.delimiter[data-icl]::before {
  border: 1.5px solid var(--theme-surface-text);
  transition: 0.3s transform, opacity 0.3s;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  /* opacity: 0;
  transform: scale3d(0.25, 0.25, 1); */
  visibility: hidden;
}

.delimiter.active[data-icl]::before {
  transform: scale3d(1, 1, 1);
  opacity: 1;
}

@media (max-width: 960px) {
  .root[data-icl] {
    height: min(75vh, 612px);
    margin-top: var(--header-height);
    background-color: var(--theme-surface);
  }

  @media (orientation: landscape) {
    .root[data-icl] {
      height: calc(100vh - var(--nav-bar-height));
    }

    .wrapper[data-icl] {
      column-gap: 1rem;
    }
  }
}
</style>
