<script>
import { uiMount } from "~/components/utils/main";
const requiredString = { type: String, required: true };
export default {
  name: "ShopMinimalItem",

  props: {
    background: {
      type: String,
      default: "normal",
    },
    tag: requiredString,
    img: {
      type: Object,
      default: () => ({
        src: "undefined",
        alt: "missing alt",
      }),
    },
    price: requiredString,
    title: requiredString,
    subtitle: {
      type: String,
      default: "",
    },
    saved: Boolean,
    id: {
      type: [String, Number],
      default: Date.now(),
    },
    useIntersection: Boolean,
    intersectionConfig: {
      type: Object,
      default: () => ({
        once: true,
        config: { threshold: 0.3 },
      }),
    },
    onSale: Boolean,
    newIn: Boolean,
    soldOut: Boolean,
    itemsCount: {
      type: [String, Number],
      default: 10,
    },
    to: { type: String, default: "2021" },
  },
  data() {
    return {
      pseudoActive: false,
      isSaved: false,
      notifySaved: false,
      timeStamp: null,

      renderedComponents: ["appImg", "savedBtn"],
    };
  },

  computed: {
    hasBadgeSlot() {
      return !!(this.onSale || this.newIn || this.soldOut);
    },
    ...uiMount.computed,
  },

  watch: {
    ...uiMount.watch,
    isSaved(n) {
      if (n) {
        this.$nextTick(async () => {
          const timeStamp = this.timeStamp;
          this.notifySaved = true;
          await this.$sleep(3000);
          if (timeStamp == this.timeStamp) this.notifySaved = false;
        });
      } else {
        this.notifySaved = false;
      }
    },
  },

  mounted() {
    this.mountSelf();
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: "shopMinimalItem",
          path: "components",
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-smim": "" };
    // const root = (d, c) => h(this.tag, d, c);
    const img = (d, c) => h("app-img", d, c);
    const p = (d, c) => h("p", d, c);
    const btn = (d, c) => h("saved-btn", d, c);
    const intersection = (d, c) => h("ui-intersection", d, c);
    const transition = (d, c) => h("ui-transition", d, c);
    const span = (d, c) => h("span", d, c);
    const div = (d, c) => h("div", d, c);
    const a = (d, c) => h("nuxt-link", d, c);

    const returnValue = (pl) =>
      div(
        {
          props: {
            to: `/shop/add_to_bag/${this.to || "2021"}`,
          },
          attrs: { ...scoping, ...this.$attrs, title: this.title },
          staticClass: "root fill-before-and-after",
          class: [
            {
              Active: this.pseudoActive,
              "show-alert": this.notifySaved && this.isSaved,
              "primary-bg": this.background == "primary",
            },
          ],
          on: { ...this.$listeners },
          // nativeOn: /a|nuxt-link|router-link/i.test(this.tag)
          //   ? { ...this.$listeners, ...clickable.call(this, true) }
          //   : undefined,
          style: this.useIntersection
            ? {
                opacity: pl.isIntersecting ? `` : `0`,
              }
            : undefined,
        },
        [
          img({
            attrs: {
              title: `click to view ${this.title}`.toLowerCase(),
            },
            props: {
              src: "/img/campaign/item (5).png",
              alt: this.img.alt,
              tag: "ui-clickable",
              componentProps: {
                tag: "router-link",
                to: `/shop/add_to_bag/${this.to || "2021"}`,
              },
            },
            class: ["background fill-after"],
            on: {
              "component-loaded": () => {
                this.loadedComponents.push("appImg");
              },
            },
            scopedSlots: {
              default: () => {
                return div(
                  {
                    attrs: { ...scoping },
                    staticClass: "background-slot fill-before-and-after",
                  },
                  [
                    this.hasBadgeSlot
                      ? div(
                          {
                            attrs: { ...scoping },
                            staticClass: "badge-wrapper",
                            class: [
                              {
                                "on-sale fill-before": this.onSale,
                                "new-in fill-after": this.newIn,
                                "sold-out": this.soldOut && !+this.itemsCount,
                              },
                            ],
                          },
                          [
                            (this.soldOut || +this.itemsCount < 4) &&
                              span(
                                `${
                                  +this.itemsCount
                                    ? `${this.itemsCount} items left`
                                    : "Sold Out"
                                }`
                              ),
                          ]
                        )
                      : null,

                    transition({
                      props: {
                        transition: "slide-y",
                        fade: false,
                        // fade: 0.9,
                        ease: "linear",
                        duration: "0.15s",
                        delay: {
                          enter: 64,
                        },
                        // type: "spring",
                      },
                      scopedSlots: {
                        default: () => {
                          return this.notifySaved && this.isSaved
                            ? div(
                                {
                                  // key: `${this.notifySaved}-${this.isSaved}`,
                                  attrs: { ...scoping },
                                  staticClass: "notify theme-primary-invert",
                                },
                                "Saved!"
                              )
                            : null;
                        },
                      },
                    }),
                  ]
                );
              },
            },
          }),
          div(
            {
              attrs: { ...scoping },
              staticClass: "title-wrapper hide-scrollbar",
            },
            [
              a(
                {
                  props: {
                    to: this.$route.path,
                  },
                  attrs: { ...scoping, title: `${this.title}`.toLowerCase() },
                  class: ["title"],
                },
                `${this.title}`
              ),
            ]
          ),
          p(
            {
              attrs: {
                ...scoping,
                "data-smim-price": this.price,
                title: `${this.price}`.toLowerCase(),
              },
              staticClass: "price",
              class: [{ "on-sale": this.onSale }],
            },
            `${this.price}`
          ),
          btn({
            class: "__save-btn",
            on: {
              toggled: (saved, e) => {
                this.isSaved = saved;
                this.timeStamp = e.timeStamp;
              },
            },
          }),
        ]
      );

    if (this.useIntersection) {
      return intersection({
        props: {
          ...this.intersectionConfig,
        },
        scopedSlots: {
          default: (pl) => {
            return returnValue(pl);
          },
        },
      });
    } else return returnValue();
  },
};
</script>

<style>
.root[data-smim] {
  --img-height: calc(min(50vw, 200px) - 2rem);
  width: 100%;
  max-width: 224px;
  border-radius: 6px;
  display: grid;
  grid-template-rows: var(--img-height) auto 32px;
  grid-template-areas:
    "img img"
    "title title"
    "price save";
  padding: 0 0 0.75rem;
  grid-template-columns: auto;
  align-items: center;
  overflow: hidden;
  color: var(--theme-surface-text);
  text-decoration: none;
  position: relative;
  isolation: isolate;
  outline-offset: 2px;
  outline: 0px;
}

.root[data-smim]::after {
  background-color: var(--theme-primary);
  z-index: -1;
  height: calc(100% - var(--img-height));
  bottom: 0;
  top: auto;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: var(--ui-divide);
}

.root.primary-bg[data-smim]::after {
  background-color: var(--theme-banner);
}
/* 
.light-theme .root[data-smim]::after {
  opacity: var(--t-subtitle);
} */

.root[data-smim]:focus-visible {
  outline: solid;
}

.root[data-smim] > * {
  z-index: 1;
}

@media (hover: hover) and (pointer: fine) {
  .root[data-smim]:focus-within .title {
    text-decoration: underline;
  }

  .root[data-smim]:hover::before {
    opacity: 0.15;
  }
}

.root[data-smim]::before {
  background-color: currentColor;
  opacity: 0;
  transition: 0.3s opacity;
  height: calc(100% - calc(min(30vw, 300px) - 3rem));
  bottom: 0;
  top: auto;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
  z-index: 2;
}

.badge-wrapper[data-smim],
.background-slot[data-smim] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
}

.background-slot[data-smim] {
  isolation: isolate;
}

.background-slot[data-smim]::before {
  /* border-bottom: var(--ui-divide); */
  border-bottom-width: 1px;
  opacity: var(--t-disabled);
}

.light-theme .background-slot[data-smim]::before {
  --t-disabled: 0.2;
}

.notify[data-smim] {
  position: absolute;
  width: 100%;
  height: 32px;
  display: grid;
  place-items: center;
  bottom: 0;
  font-weight: 600;
  opacity: 0.95;
  z-index: 1;
}

.badge-wrapper[data-smim]::before {
  background-color: var(--warning);
  width: 45px;
  height: 45px;
  transform: rotate(45deg) translate(-34px, 1px);
  border-right: 0.5px solid #00000073;
  border-radius: 0;
}

.badge-wrapper[data-smim]::after {
  border-radius: 0;
  background-color: #4f4fe4;
  width: 45px;
  height: 45px;
  right: 0;
  left: auto;
  transform: rotate(45deg) translate(1px, -34px);
  border-bottom: 0.5px solid #00000073;
}

.badge-wrapper[data-smim].sold-out {
  background-color: #0000004b;
}

.badge-wrapper[data-smim] > span {
  position: absolute;
  width: 100%;
  height: 2rem;
  background-color: var(--error);
  color: var(--theme-surface);
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  border: var(--ui-divide);
  font-weight: 550;
  opacity: var(--t-subtitle);
}

.root[data-smim] .background {
  height: 100%;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  grid-area: img;
  z-index: 10;
  background-color: var(--theme-surface);
}

.root[data-smim] .background .__content {
  transform-origin: top;
  --defaultTransition: opacity 0.2s cubic-bezier(0.52, 0.16, 0.24, 1),
    transform 0.2s linear !important;
}

/* .root[data-smim].show-alert .background .__content {
  transform: scale3d(0.975, 0.975, 1);
  transition-delay: 72ms;
  transition-duration: 0.2s;
} */

.root[data-smim] .background .background-slot::after {
  opacity: 0;
  color: inherit;
  background: currentColor;
  transition: 0s opacity;
  display: block;
  transition: 0.1s opacity;
}

.root[data-smim] .background *:first-child {
  transition: 0.05s transform linear;
}

.root[data-smim] .background.Active .background-slot::after {
  opacity: 0.2;
}

.root[data-smim] .background.Active > *:first-child {
  transform: scale3d(0.95, 0.95, 1);
  transition: 0.1s transform;
}

/* .root[data-smim] .background:active img {
  filter: none;
} */

.root[data-smim] .background::after {
  border: var(--ui-divide);
  border-width: 1px;
  --t-disabled: 0.2;
  /* --t-disabled: 0; */
  opacity: var(--t-disabled);
  height: calc(100% + 1px);
  width: calc(100% - 0.5px);
  left: 0.25px;
}

/* .root[data-smim] .background::after {
  opacity: 0.4;
} */

.root[data-smim] img {
  object-fit: contain !important;
  object-position: top;
  width: 100%;
  /* filter: drop-shadow(0px 0px 1px rgb(0, 0, 0, 0.45))
    drop-shadow(0px 2px 5px rgb(0, 0, 0, 0.25)); */
}

.title-wrapper[data-smim] {
  grid-area: title;
  margin: 0.6rem 0.5rem 0 0.1rem;
  overflow: auto hidden;
  padding: 0 2.75rem 0 0.65rem;
}

.title-wrapper[data-smim]::before,
.title-wrapper[data-smim]::after {
  content: "";
  display: block;
  position: absolute;
  height: calc(100% - var(--img-height) - 3px);
  z-index: 1;
  pointer-events: none;
  bottom: 0;
  background: linear-gradient(
    var(--position),
    var(--faded-theme-primary) var(--position1, 0%),
    var(--theme-primary) var(--position2, 45%)
  );
}

.root.primary-bg[data-smim] .title-wrapper::before,
.root.primary-bg[data-smim] .title-wrapper::after {
  background: linear-gradient(
    var(--position),
    var(--faded-theme-banner) var(--position1, 0%),
    var(--theme-banner) var(--position2, 45%)
  );
}

.light-theme .title-wrapper[data-smim] {
  --position1: 15%;
}

.title-wrapper[data-smim]::before {
  width: 0.75rem;
  --position: to left;
  left: 0;
}

.title-wrapper[data-smim]::after {
  width: 3.5rem;
  --position: to right;
  right: 0;
}

.title[data-smim] {
  opacity: var(--t-caption);
  transition: 0.2s transform;
  text-decoration: none;
  font-size: 0.9rem;
  white-space: nowrap;
}

.light-theme .title[data-smim] {
  --t-caption: 0.8;
}

.title[data-smim]:active {
  text-decoration: underline;
}

.price[data-smim] {
  grid-area: price;
  position: relative;
  opacity: var(--t-subtitle);
  font-size: 0.975rem;
  font-weight: 550;
  justify-self: flex-start;
  padding: 0 0.5rem 0 0.75rem;
}

.price.on-sale[data-smim]::after {
  color: var(--theme-surface-text);
  opacity: var(--t-disabled);
  content: attr(data-smim-price);
  font-size: 0.95rem;
  margin-left: 5px;
  text-decoration: line-through;
}

.root[data-smim] .__save-btn {
  grid-area: save;
  justify-self: flex-end;
  margin-right: 0.55rem;
}

@media (min-width: 500px) {
  .root[data-smim] {
    grid-template-rows: calc(min(30vw, 300px) - 2rem) auto 32px;
  }
}
</style>
