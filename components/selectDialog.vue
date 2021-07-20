<script>
import {
  ArrowNavigate,
  eventKey,
  springPresets,
} from "~/components/utils/main";
export default {
  name: "SelectDialog",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    dialogPayload: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: "State",
    },
    vmodel: Boolean,
    selected: {
      type: String,
      default: undefined,
    },
    activeState: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      selectedItem: null,
      selectedObject: null,
      previousSelectedItem: null,
      search: "",
      transitionState: "",
    };
  },
  computed: {
    v_model() {
      const toggle = (val) =>
        this.$emit("vmodel", typeof val == "undefined" ? !this.vmodel : val);
      return {
        isActive: this.vmodel,
        open: () => toggle(true),
        close: () => requestAnimationFrame(() => toggle(false)),
        toggle,
      };
    },
    fetchedStates() {
      return this.$store.state.bagPageFetchedStates || [];
    },
    getItems() {
      if (this.label == "State") {
        return Object.keys(this.fetchedStates);
      }
      return this.fetchedStates[this.activeState];
    },
    mapItems() {
      return [...[this.getItems].flat(Infinity)].sort((a, b) => {
        const $a = a.toLowerCase();
        const $b = b.toLowerCase();
        return $a > $b ? 1 : $a < $b ? -1 : 0;
      });
    },
    foundItems() {
      if (!this.search) {
        return this.mapItems;
      }

      return this.mapItems.filter((x) => {
        const searchRegExp = new RegExp(`${this.search}`, "i");

        return searchRegExp.test(x);
      });
    },
    selectedIconTransition() {
      const returnValue = {
        enter: "slide-y(10px)",
        leave: "slide-y(10px)",
      };

      return returnValue;
    },
  },
  watch: {
    transitionState() {
      this.$emit("transition-state", this.transitionState);
    },
  },
  render(h) {
    const scoping = { "data-sdg": "" };
    const modal = (d, c) => h("ui-sheet", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const div = (d, c) => h("div", d, c);
    const ul = (d, c) => h("ul", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const search = (d) => h("ui-input", d);
    const transition = (d, c) => h("ui-transition", d, c);

    return modal({
      attrs: { ...scoping },
      props: {
        label: `select ${this.label}`,
        vmodel: this.vmodel,
        transition: {
          transition: "slide-y",
          fade: false,
          duration: { enter: "500", leave: "400" },
        },
        backdrop: this.$theme.light ? 0.5 : 0.35,
        contentClass: "select-main",
        contentAttrs: { ...scoping },
      },
      on: {
        vmodel: (e) => {
          this.$emit("vmodel", e);
        },
        "&mousedown": (e) => {
          e.stopPropagation();
        },
        "&click": (e) => {
          e.stopPropagation();
        },
        "!keydown": (e) => {
          const key = eventKey(e);

          if (/arrow_up|arrow_down/i.test(key)) {
            e.preventDefault();

            const arrowNavigate = new ArrowNavigate({
              root: e.currentTarget,
              children: "li.item",
            });

            if (/down/i.test(key)) {
              arrowNavigate.forward();
            } else arrowNavigate.backward();
            return;
          }
          if (/^[a-zA-Z]$/.test(e.key)) {
            this.$refs.search.$refs.input.focus();
          }
        },
        "&keyup": (e) => {
          e.stopPropagation();
        },
        beforeEnter: () => {
          this.selectedItem = this.selected;
        },
        afterLeave: () => {
          this.search = "";
          this.selectedItem = null;
        },
        // "intersection-point": (e) => {
        //   /afterE/i.test(this.transitionState) &&
        //     this.$emit("intersection-point", e);
        // },
      },
      staticClass: "root",
      class: [{ active: this.vmodel }],
      scopedSlots: {
        default: (payload) => {
          this.transitionState = payload.state;
          return div(
            {
              attrs: { ...scoping },
              staticClass: "content-wrapper",
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "header fill-before",
                  on: {
                    "!click": () => {
                      requestAnimationFrame(() => {
                        this.$refs["item-wrapper"]?.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      });
                    },
                  },
                },
                [
                  h1(
                    {
                      attrs: {
                        ...scoping,
                        "aria-hidden": !this.vmodel ? "true" : undefined,
                        "aria-label": this.vmodel
                          ? undefined
                          : `choose ${this.label}`,
                      },
                      staticClass: "heading line-clamp-1",
                    },
                    `Choose ${this.label}`
                  ),
                  // icon({
                  //   props: {
                  //     name: "close",
                  //     clickable: true,
                  //   },
                  //   attrs: { ...scoping },
                  //   staticClass: "close-btn",
                  //   on: {
                  // click: (e) => {
                  //   e.stopPropagation();
                  //   this.v_model.close();
                  // },
                  //   },
                  // }),

                  btn(
                    {
                      props: {
                        size: "md",
                        text: true,
                        persistent: true,
                        // color: "primary",
                      },
                      attrs: { ...scoping },
                      staticClass: "close-btn sheet-close-btn",
                      on: {
                        click: (e) => {
                          e.stopPropagation();
                          this.v_model.close();
                        },
                      },
                    },
                    "Close"
                  ),
                ]
              ),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: "main fill-before",
                },
                [
                  search({
                    ref: "search",
                    props: {
                      template: "search",
                      type: "search",
                      label: "Search",
                      required: false,
                      placeholder: "Search",
                      id: "search-field",
                      vmodel: this.search,
                    },
                    on: {
                      vmodel: (e) => {
                        this.search = e;
                      },
                    },
                  }),

                  div({ attrs: { ...scoping }, staticClass: "divide" }),

                  transition({
                    props: {
                      transition: "none",
                      duration: "250",
                      ease: "ease",
                      delay: {
                        enter: 300,
                      },
                    },
                    on: {
                      afterEnter: (e) => {
                        const selectedEl = e.querySelector(".item.selected");
                        if (selectedEl) {
                          selectedEl?.focus();
                        }
                      },
                    },
                    scopedSlots: {
                      default: () => {
                        return ul(
                          {
                            ref: "item-wrapper",
                            attrs: { ...scoping },
                            staticClass: "item-wrapper",
                            directives: [
                              {
                                name: "show",
                                value: /^enter|afterEn|beforeLe|^leave/i.test(
                                  payload.state
                                ),
                              },
                            ],
                          },
                          [
                            this.mapItems.map((item, key, arr) => {
                              const isSelected =
                                item == (this.selectedItem || this.selected);
                              const searchRegExp = new RegExp(
                                `${this.search}`,
                                "i"
                              );
                              return btn(
                                {
                                  key,
                                  props: {
                                    simpleButton: true,
                                    outlined: true,
                                    block: true,
                                    shape: "tile",
                                    tag: "li",
                                  },
                                  attrs: { ...scoping },
                                  staticClass: `item ${
                                    key + 1 == arr.length ? "last-item" : ""
                                  }`,
                                  class: [{ selected: isSelected }],
                                  style: {
                                    display: searchRegExp.test(item)
                                      ? undefined
                                      : "none",
                                  },
                                  on: {
                                    "!click": () => {
                                      this.$emit("item-selected", {
                                        label: this.label.toLowerCase(),
                                        value: item,
                                      });

                                      this.previousSelectedObject = this.selectedObject;

                                      this.selectedItem = item;

                                      this.selectedObject = { key, item };

                                      requestAnimationFrame(async () => {
                                        await this.$sleep(450);
                                        this.v_model.close();
                                      });
                                    },
                                  },
                                },
                                [
                                  item,
                                  transition({
                                    props: {
                                      transition: this.selectedIconTransition,
                                      delay: {
                                        enter: "150ms",
                                        leave: "0ms",
                                      },
                                      duration: "150ms",
                                      fade: true,
                                      type: "spring",
                                      springConfig: springPresets.wobbly,
                                    },
                                    scopedSlots: {
                                      default: () => {
                                        return (
                                          isSelected &&
                                          icon({
                                            key: `icon-${key}-${isSelected}`,
                                            props: { name: "check" },
                                            attrs: { ...scoping },
                                            staticClass: "check",
                                          })
                                        );
                                      },
                                    },
                                  }),
                                ]
                              );
                            }),
                          ]
                        );
                      },
                    },
                  }),

                  !this.foundItems.length
                    ? div(
                        {
                          key: `${this.foundItems.length}`,
                          attrs: {
                            ...scoping,
                          },
                          staticClass: "invalid-search vibrate",
                        },
                        [
                          icon({
                            props: {
                              name: "alert",
                            },
                          }),
                          `No item(s) to match your search.`,
                        ]
                      )
                    : null,
                ]
              ),
            ]
          );
        },
      },
    });
  },
};
</script>

<style>
.root[data-sdg] {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: inherit;
  -webkit-overflow-scrolling: touch;
}

.root[data-sdg] {
  --background-elem-background: var(--theme-surface) !important;
}

.select-main[data-sdg] {
  height: var(--full-dialog);
}

.content-wrapper[data-sdg] {
  height: 100%;
}

.header[data-sdg] {
  height: 50px;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.25rem;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.header[data-sdg]::before,
.main[data-sdg] > .search-field::before {
  background: currentColor;
  opacity: 0.1;
}

.heading[data-sdg] {
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 1.5rem;
  justify-self: flex-start;
}

.main[data-sdg] {
  /* padding-top: 0.5rem; */
  height: calc(100% - var(--sheet-header-height));
  position: relative;
  top: -1px;
}

.main[data-sdg]::before {
  top: auto;
  bottom: 0;
  height: calc(100% - 42px - 1.5rem - 0.5px);
  background-color: var(--theme-surface);
}

.main[data-sdg] > .search-field {
  padding: 0.5rem 1rem 1rem !important;
  margin: 0;
  background-color: var(--theme-primary);
}

.main[data-sdg] > .search-field input {
  background-color: var(--theme-surface);
}

.divide[data-sdg] {
  position: relative;
  border-bottom: var(--ui-divide);
  opacity: 0.5;
}

.item-wrapper[data-sdg] {
  max-height: calc(100% - calc(42px + 1rem));
  overflow: hidden auto;
  padding: 0.5rem 0 42px;
  background-color: var(--theme-surface);
}

.item[data-sdg] {
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem 0 2.25rem !important;
  font-size: 1rem !important;
  letter-spacing: 0.5px !important;
  font-weight: 500;
  --before-color: var(--info) !important;
}

.item[data-sdg]::before {
  transition: 0s !important;
}

.item[data-sdg].selected::before {
  opacity: 0.2;
  background: var(--info);
}

.item.selected[data-sdg] .ui-icon {
  color: var(--info);
}

.item[data-sdg] > span[aria-hidden] {
  width: calc(100% - 3.25rem);
  left: 2.25rem;
  border-width: 0 0 0.5px 0;
  border-color: var(--divide-color);
}

.invalid-search {
  position: relative;
  display: flex;
  padding: 0 1.5rem;
  align-items: center;
  margin-top: calc(-42px + 1.5rem);
  opacity: var(--t-subtitle);
}

.invalid-search > span {
  margin-right: 0.5rem;
}
</style>
