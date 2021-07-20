<script>
import { capitalize, lorem, nextFrame, uiMount } from "~/components/utils/main";
export default {
  name: "ViewAllPage",

  data: () => ({
    pageMounted: false,

    vmodel: false,

    search: "",

    gridChanger: 1,

    isMounted: false,

    pageTransitionState: "",

    paginationIndex: 1,
  }),

  head() {
    return {
      title: `View all ${this.params} items`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `View all ${this.params} items`,
        },
      ],
    };
  },

  computed: {
    ...uiMount.computed,

    items() {
      return Array.from({ length: 50 }, (_, i) => i);
    },

    renderedComponents() {
      return [];
    },

    params() {
      return (
        capitalize(
          this.$route.params.name
            .replace(/_/g, " ")
            .replace(/undefined/, "")
            .replace(/\s{2,}/g, " ")
        ) || "Items"
      );
    },

    singleGrid() {
      return this.gridChanger == 1;
    },
  },

  watch: {
    ...uiMount.watch,
    async "$store.state.pageTransitionState"(n) {
      this.pageTransitionState = n;

      if (/afterE/i.test(n)) {
        await nextFrame();

        this.isMounted = true;
      }
    },
  },

  created() {
    this.isMounted = false;

    this.renderedComponents.forEach((x) => {
      if (this.$store.state.loadedComponents?.[x]) {
        this.loadedComponents.push(x);
      }
    });

    this.$nextTick(() =>
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: this.params,
      })
    );
  },

  async mounted() {
    this.mountSelf();

    await nextFrame();

    this.pageMounted = true;

    if (/afterE/i.test(this.pageTransitionState)) {
      this.isMounted = true;
    }
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
    const scoping = { "data-vape": "" };

    const main = (d, c) => h("main", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const section = (d, c) => h("section", d, c);
    const p = (d, c) => h("p", d, c);
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const input = (d, c) => h("ui-input", d, c);

    const article = (d, c) => h("article", d, c);

    const portal = (d, c) => h("ui-portal", d, c);
    const dialog = (d, c) => h("ui-sheet", d, c);

    const transition = (d, c) => h("ui-transition", d, c);

    const viewsItem = (d, c) => h("views-item", d, c);

    return (
      this.$c4.mounted &&
      main(
        {
          attrs: { ...scoping },
          staticClass: "root",
        },
        [
          section(
            {
              attrs: { ...scoping, "aria-label": "description" },
              staticClass: "desc-wrap",
            },

            [
              p(
                {
                  attrs: { ...scoping },
                  staticClass: "desc line-clamp-2",
                },
                [lorem]
              ),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: "desc-more-wrap fill-before-and-after",
                },
                [
                  btn(
                    {
                      attrs: { ...scoping },
                      staticClass: "desc-more-btn",
                      props: {
                        text: true,
                        size: "sm",
                      },
                    },
                    ["MORE"]
                  ),
                ]
              ),
            ]
          ),

          form(
            {
              attrs: {
                ...scoping,
                "aria-label": "search",
                action: ".",
              },
              props: {
                name: "search",
                showSubmit: false,
              },
              staticClass: "search-wrap fill-before",
            },
            [
              input({
                props: {
                  vmodel: this.search,
                  label: `Search`,
                  required: false,
                  id: "search-field",
                  placeholder: `Search ${this.params.toLowerCase()} items`.replace(
                    /items items/i,
                    "items"
                  ),
                  title: "search",
                  autocomplete: "off",
                  template: "search",
                  type: "search",
                },
                on: {
                  vmodel: (e) => {
                    this.search = e;
                  },
                },
              }),
            ]
          ),

          div(
            {
              attrs: { ...scoping, "aria-label": "sort and filter" },
              staticClass: "btn-group fill-before-and-after",
            },
            [
              span({
                attrs: { ...scoping },
                staticClass: "pseudo btn-group-blur",
              }),
              [
                {
                  text: "SORT",
                  icon: "chevronDown",
                },
                {
                  text: "FILTER",
                  icon: "filter",
                },
              ].map((item, key) => {
                return btn(
                  {
                    key,
                    props: {
                      text: true,
                      shape: "tile",
                    },
                    attrs: { ...scoping },
                    staticClass: "btn-group-item",
                    on: {
                      mousedown: async () => {
                        await nextFrame();

                        this.vmodel = !this.vmodel;
                      },
                    },
                  },
                  [
                    item.text,
                    icon({
                      props: {
                        name: item.icon,
                        size: "20px",
                      },
                    }),
                  ]
                );
              }),
            ]
          ),

          div(
            {
              attrs: { ...scoping, "aria-label": "grid view changer" },
              staticClass: "grid-changer-wrap",
            },
            [
              {
                icon: "blankCheckbox",
                title: "single grid",
              },
              { icon: "gridView", title: "double grid" },
            ].map((item, key) => {
              const selected = this.gridChanger == key + 1;

              return btn(
                {
                  key,
                  props: {
                    size: "sm",
                    shape: "none",
                    filledText: !selected,
                    simpleButton: true,
                  },
                  attrs: {
                    ...scoping,
                    title: item.title,
                  },
                  staticClass: `grid-changer-item pill-${
                    key == 0 ? "left" : "right"
                  }`,
                  on: {
                    click: async () => {
                      await nextFrame();

                      this.gridChanger = key + 1;
                    },
                  },
                  class: [
                    {
                      info: selected,
                      transparent: !selected,
                    },
                  ],
                },
                [
                  icon({
                    props: {
                      name: item.icon,
                      size: "16px",
                    },
                  }),
                ]
              );
            })
          ),

          article(
            {
              attrs: { ...scoping, "aria-label": "page main content" },
              staticClass: "content-wrap",
            },
            [
              transition({
                props: {
                  transition: {
                    enter: "slide-y(-0.5rem)",
                    leave: "slide-y(0.25rem)",
                  },
                  duration: "300ms",
                  ease: "linear",
                  // delay: {
                  //   leave: 200,
                  // },
                  delay: {
                    leave: 40,
                  },
                },
                on: {
                  beforeLeave: () => {
                    window.scrollTo(0, 0);
                  },
                },
                scopedSlots: {
                  default: () => {
                    return div(
                      {
                        key: `item-wrap-${this.$route.query?.page}`,
                        attrs: {
                          ...scoping,
                          "aria-label": "items wrapper",
                          "data-length": this.items.length,
                        },
                        staticClass: "items-wrap",
                        class: [
                          {
                            "single-grid": this.singleGrid,
                          },
                        ],
                      },
                      this.items
                        .filter((_, i) => i <= 15)
                        .map((item, key) => {
                          const price = (key + 1) * 5000;

                          return viewsItem({
                            key,
                            props: {
                              tag: "nuxt-link",
                              componentProps: {
                                to: `/shop/add_to_bag/${key}`,
                              },
                              title: `Item ${key + 1}`,
                              price: {
                                real: `${price < 50000 ? price : 50000}`,
                                sale: "4000",
                              },
                              img: {
                                src: `/img/campaign/item (${
                                  key + 1 > 31 ? 31 : key + 1
                                }).png`,
                                alt: "img",
                              },
                              id: `200${key}`,
                              gridView: this.gridChanger,
                              backdrop: {
                                background: this.$theme.dark
                                  ? `var(--${
                                      this.singleGrid && (key + 1) % 2 != 0
                                        ? "theme-primary"
                                        : "theme-surface"
                                    })`
                                  : "#000",
                              },
                            },
                            class: [
                              {
                                "theme-surface":
                                  this.singleGrid && (key + 1) % 2 != 0,
                                "theme-primary":
                                  (this.singleGrid && (key + 1) % 2 == 0) ||
                                  !this.singleGrid,
                              },
                            ],
                          });
                        })
                    );
                  },
                },
              }),

              p(
                {
                  attrs: {
                    ...scoping,
                    "aria-label": "items count information",
                  },
                  staticClass: "items-count-info",
                },
                `Showing 1 to 10 of 50`
              ),

              h("ui-pagination", {
                attrs: {
                  "aria-label": "pagination",
                  length: 7,
                },
              }),
            ]
          ),

          this.isMounted &&
            portal(
              {
                key: `${this.isMounted}`,
                props: {
                  to: "#app-overlays",
                  wrapper: false,
                },
              },
              [
                dialog({
                  props: {
                    vmodel: this.vmodel,
                    label: "size",
                    fullscreen: true,
                    contentClass: "view-page-dialog",
                  },
                  on: {
                    vmodel: (e) => {
                      this.vmodel = e;
                    },
                  },
                  scopedSlots: {
                    default: () =>
                      div({
                        staticClass: "dialog-ss",
                      }),
                  },
                }),
              ]
            ),
        ]
      )
    );
  },
};
</script>

<style>
.root[data-vape] {
  --btn-group-height: 43px;

  min-height: calc(100vh - var(--app-bars-height));
  margin: 0 auto 44px;
}

.desc-wrap[data-vape] {
  padding: 1rem 1.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
  position: relative;
}

.desc[data-vape] {
  opacity: var(--t-subtitle);
}

.desc-more-wrap[data-vape] {
  position: absolute;
  bottom: 0.65rem;
  right: 0.875rem;
  z-index: 1;
}

.desc-more-wrap[data-vape]::before {
  background: linear-gradient(
    to right,
    var(--faded-theme-surface) var(--position1, 0%),
    var(--theme-surface) var(--position2, 45%)
  );
  width: 2rem;
}

.desc-more-btn[data-vape] {
  z-index: 2;
  background: var(--theme-surface);
  color: var(--theme-surface-text);
}

.search-wrap[data-vape] {
  margin-top: 0.5rem;
  background: var(--theme-primary);
  position: relative;
  height: 72px;
  display: grid;
  place-items: center;
}

.search-wrap[data-vape]::before {
  border-top: var(--ui-divide);
  opacity: var(--t-disabled);
}

.search-wrap[data-vape] > .root {
  margin-bottom: 0;
  width: calc(100% - 3rem);
}

.search-wrap[data-vape] .input {
  background: var(--theme-surface);
}

.btn-group[data-vape] {
  height: var(--btn-group-height);
  width: 100%;
  position: sticky;
  top: calc(var(--header-height) - 1px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  z-index: 10;
}

@supports (backdrop-filter: blur(1px)) {
  .btn-group-blur[data-vape] {
    background: var(--blur-banner);
    backdrop-filter: var(--banner-backdrop-filter);
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .btn-group-blur[data-vape] {
    display: none;
  }
}

.btn-group[data-vape]::before {
  border: var(--ui-divide);
  border-width: 0.5px 0;
  opacity: var(--t-disabled);
  z-index: 1;
}

.btn-group[data-vape]::after {
  height: 80%;
  width: 0.5px;
  z-index: 1;
  background-color: var(--theme-surface-text);
  opacity: 0.25;
  top: 10%;
  left: 50%;
}

.btn-group-item[data-vape] {
  width: 100%;
  height: inherit !important;
  display: flex;
  color: inherit;
  font-size: 1rem !important;
}

.btn-group-item[data-vape] > .ui-icon {
  margin-left: 0.5rem;
}

.grid-changer-wrap[data-vape] {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 0rem 1.5rem;
  position: relative;
}

.grid-changer-item[data-vape] {
  height: 32px !important;
  width: 40px !important;
  --filled-text-opacity: 0.125;
}

.grid-changer-item[data-vape].info {
  height: 34px !important;
}

.content-wrap[data-vape] {
  overflow: hidden auto;
}

.items-wrap[data-vape] {
  display: grid;
  padding: 1.5rem 0;
  /* gap: 0.75rem 0; */
}

.items-wrap[data-vape]:not(.single-grid) {
  grid-template-columns: repeat(auto-fit, minmax(max(150px, 30%), 1fr));
  gap: 0.75rem;
  padding: 1.5rem 0.5rem;
  filter: var(--ds-light);
}

.items-count-info[data-vape] {
  font-size: 0.875rem;
  opacity: var(--t-caption);
  text-align: center;
  padding: 0.5rem;
}

.pagination[data-vape] {
  border-radius: var(--rounded);
  height: 48px;
  width: calc(100% - 3rem);
  justify-self: center;
  background: var(--theme-primary);
}
</style>
