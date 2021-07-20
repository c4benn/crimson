<script>
export default {
  name: "AddToBagDialog",

  data() {
    return {
      showSizeGuide: false,
      sizeGuideMirrorElBound: {},
      confirmationMirrorElBound: {},
      showConfirmationDialog: false,
      confirmationTransitionState: "",
      showLoader: true,
      dialogScale: "in",
    };
  },

  computed: {
    addToBagObject() {
      return this.$store.state.vmodel.addToBag;
    },
    selectedSize() {
      return this.addToBagObject.size;
    },
    dialogObject() {
      return this.$store.state.vmodel.dialogs.addToBag;
    },
    template() {
      if (/^select-size/i.test(this.dialogObject.template)) {
        return "select-size";
      }
      if (/^product-info/i.test(this.dialogObject.template)) {
        return "product-info";
      }
      if (/^size-guide/i.test(this.dialogObject.template)) {
        return "size-guide";
      }
      if (/^delivery/i.test(this.dialogObject.template)) {
        return "delivery";
      }
      if (/^confirmation-dialog/i.test(this.dialogObject.template)) {
        return "confirmation-dialog";
      }
      if (/^warning-dialog/i.test(this.dialogObject.template)) {
        return "warning-dialog";
      }
      if (/^share/i.test(this.dialogObject.template)) {
        return "share";
      } else return "undefined";
    },
    confirmDialog() {
      return this.template == "confirmation-dialog";
    },
    warnDialog() {
      return this.template == "warning-dialog";
    },
    isDialog() {
      return this.confirmDialog || this.warnDialog;
    },
  },

  created() {
    this.$store.commit("V_MODEL", {
      value: {
        ...this.dialogObject,
        active: false,
      },
      path: "addToBag",
      innerPath: "dialogs",
    });
  },

  render(h) {
    const scoping = { "data-atbdg": "" };
    const modal = (d, c) => h(this.isDialog ? "ui-dialog" : "ui-sheet", d, c);
    const div = (d, c) => h("div", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const header = (d, c) => h("header", d, c);
    const article = (d, c) => h("article", d, c);
    const p = (d, c) => h("p", d, c);
    const containerTranisiton = (d, c) => h("ui-container-transition", d, c);
    const ul = (d, c) => h("ul", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const sizeGuideContent = (d) => h("size-dialog-content", d);

    return modal({
      props: {
        vmodel: this.dialogObject.active,
        backdrop: this.isDialog ? 0.75 : 0.6,
        contentAttrs: { ...scoping },
        contentClass: `add-to-bag-dialog ${this.template}-template ${
          !this.showLoader && this.confirmDialog ? "invisible" : ""
        }`,
        removeContent: false,
        label:
          this.template == "delivery"
            ? "delivery and returns"
            : `${this.template.replace(/info$/, "information")}`,
        transition: this.confirmDialog
          ? {
              transition: !this.showLoader ? "none" : "scale(1.25)",
              // type: "spring",
              fade: this.showLoader,
            }
          : this.warnDialog
          ? {
              transition: {
                enter: "scale(0.75)",
                leave: this.dialogScale == "out" ? "scale(1.15)" : "scale(0.9)",
              },
              fade: true,
              ease: {
                leave: this.dialogScale == "out" ? undefined : "ease",
              },
              duration: {
                leave: this.dialogScale == "out" ? undefined : "300",
              },

              // type: { enter: "spring" },
              // springConfig: springPresets.wobbly,
            }
          : {
              transition:
                this.template == "select-size" && this.showSizeGuide
                  ? "none"
                  : "slide-y",
              fade: false,
            },
        // hideTransitioningContent: true,
      },
      on: {
        vmodel: (e) => {
          if (
            (this.confirmDialog && !this.showConfirmationDialog) ||
            (this.confirmDialog && this.showLoader)
          ) {
            return;
          }

          const dialogObject = this.dialogObject;

          const toggle = (value) =>
            this.$store.commit("V_MODEL", {
              value: {
                ...dialogObject,
                active: value,
              },
              path: "addToBag",
              innerPath: "dialogs",
            });

          if (this.confirmDialog && !e) {
            this.dialogScale = "in";
            return this.$nextTick(() =>
              requestAnimationFrame(() => {
                toggle(false);
              })
            );
          }

          requestAnimationFrame(() => toggle(e));
        },
        afterEnter: async () => {
          if (this.confirmDialog) {
            this.confirmationMirrorElBound = this.$el
              .querySelector(".__content")
              .getBoundingClientRect();
            await this.$sleep(1000);
            this.showConfirmationDialog = true;
          }
        },
        leave: () => {
          if (this.confirmDialog) {
            this.$store.commit("V_MODEL", {
              path: "addToBag",
              value: {
                size: "",
                color: "",
                quantity: 1,
              },
            });
          }
        },
        afterLeave: () => {
          this.showSizeGuide = false;
          this.showConfirmationDialog = false;
          this.showLoader = true;

          if (this.dialogScale == "out" && this.warnDialog) {
            this.dialogScale = "in";

            requestAnimationFrame(() => {
              this.$store.commit("V_MODEL", {
                value: {
                  ...this.dialogObject,
                  template: "confirmation-dialog",
                },
                path: "addToBag",
                innerPath: "dialogs",
              });

              requestAnimationFrame(() =>
                this.$store.commit("V_MODEL", {
                  value: {
                    ...this.dialogObject,
                    template: "confirmation-dialog",
                    active: true,
                  },
                  path: "addToBag",
                  innerPath: "dialogs",
                })
              );
            });
          }

          this.dialogScale = "in";
        },
      },
      scopedSlots: {
        append:
          this.template == "select-size"
            ? () => {
                return containerTranisiton({
                  attrs: { id: "size-guide-root" },
                  props: {
                    config: {
                      class: "size-guide",
                      attrs: { ...scoping },
                      mirrorElBound: this.sizeGuideMirrorElBound,
                      static: true,
                      duration: "300",
                    },
                    mirrorEl: ".add-to-bag-dialog[data-atbdg]",
                    zIndex: 10,
                    vmodel: this.showSizeGuide,
                  },
                  on: {
                    vmodel: (e) => (this.showSizeGuide = e),
                  },
                  scopedSlots: {
                    default: ({ state }) => {
                      return div(
                        {
                          style: {
                            display: /^enter|afterEnter|leave/i.test(state)
                              ? undefined
                              : "none",
                          },
                        },
                        [
                          sizeGuideContent({
                            props: {
                              showBackButton: true,
                              opacity:
                                /afterEnter/i.test(state) && this.showSizeGuide
                                  ? undefined
                                  : "0",
                            },
                            on: {
                              "back-button-clicked": () => {
                                this.showSizeGuide = false;
                              },
                            },
                          }),
                        ]
                      );
                    },
                  },
                });
              }
            : this.confirmDialog
            ? (payload) => {
                return containerTranisiton({
                  attrs: { id: "confirm-dialog-root" },
                  props: {
                    config: {
                      class: [
                        {
                          "confirm-dialog": true,
                          "scale-out": this.dialogScale == "out",
                          "invisible no-transition": /beforeEnter|^enter/i.test(
                            payload.state
                          ),
                        },
                      ],
                      attrs: { ...scoping },
                      mirrorElBound: this.confirmationMirrorElBound,
                      static: true,
                      duration: "300",
                    },
                    mirrorEl: ".add-to-bag-dialog[data-atbdg]",
                    zIndex: 10,
                    vmodel: this.showConfirmationDialog,
                  },
                  on: {
                    vmodel: (e) => (this.showConfirmationDialog = e),
                    afterEnter: async () => {
                      this.showLoader = false;

                      this.$store.commit("BAG", {
                        action: "add",
                        value: {
                          id: this.$route.path,
                          name: `product - ${
                            this.$route.path
                              .match(/\/\d+$/)?.[0]
                              ?.replace(/^\//, "") || "0"
                          }`,
                          size: this.addToBagObject.size,
                          quantity: this.addToBagObject.quantity || 1,
                          color: this.addToBagObject.color || 0,
                        },
                      });

                      await this.$sleep(3000);

                      this.$nextTick(payload.close);
                    },
                  },
                  scopedSlots: {
                    default: ({ state }) => {
                      this.confirmationTransitionState = state;
                      return div(
                        {
                          style: {
                            display: /^enter|afterEnter|leave/i.test(state)
                              ? undefined
                              : "none",
                            opacity: /leave/i.test(payload.state)
                              ? "0"
                              : undefined,
                          },
                        },
                        [
                          h("svg-checked", {
                            staticClass: "icon",
                            attrs: { ...scoping },
                          }),
                          p(
                            {
                              attrs: { ...scoping },
                              staticClass: "confirm-description",
                            },
                            this.addToBagObject.quantity > 1
                              ? `${this.addToBagObject.quantity} items added to bag!`
                              : `Item added to bag!`
                          ),
                          btn(
                            {
                              props: {
                                case: "initial",
                                background: "primary",
                                flat: true,
                                persistent: true,
                              },
                              class: "view-bag",
                              on: {
                                click: async () => {
                                  const close = () =>
                                    this.$store.commit("V_MODEL", {
                                      value: {
                                        ...this.dialogObject,
                                        active: false,
                                      },
                                      path: "addToBag",
                                      innerPath: "dialogs",
                                    });
                                  this.dialogScale = "out";

                                  await this.$sleep(16);

                                  this.$nextTick(() =>
                                    requestAnimationFrame(close)
                                  );

                                  await this.$sleep(364, true);

                                  this.$router.push("/bag");
                                },
                              },
                            },
                            `View Bag`
                          ),
                        ]
                      );
                    },
                  },
                });
              }
            : undefined,
        default: ({ close, state }) => {
          const lorem =
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem commodi velit facere ad sequi nulla maiores doloribus illum libero, repellat.";
          const Header = (text) => {
            return header(
              {
                attrs: { ...scoping },
                staticClass: "header sheet-header fill-before-and-after",
              },
              [
                h1(
                  {
                    attrs: { ...scoping, id: "select-size" },
                    class: "title sheet-heading line-clamp-1",
                  },
                  text
                ),
                // icon({
                //   props: {
                //     name: "close",
                //     clickable: true,
                //   },
                //   on: {
                //     mousedown: () => requestAnimationFrame(close),
                //     click: () => requestAnimationFrame(close),
                //   },
                // }),

                btn(
                  {
                    props: {
                      size: "md",
                      text: true,
                      persistent: true,
                    },
                    attrs: { ...scoping },
                    staticClass: "close-btn sheet-close-btn",
                    on: {
                      "&!click": () => requestAnimationFrame(close),
                      "&!mousedown": () => requestAnimationFrame(close),
                    },
                  },
                  "Close"
                ),
              ]
            );
          };
          const selectSize =
            this.template == "select-size"
              ? div(
                  {
                    style: {
                      opacity:
                        this.showSizeGuide || /beforeleave|^leave/i.test(state)
                          ? "0"
                          : undefined,
                      transition: this.showSizeGuide
                        ? "0.3s opacity"
                        : undefined,
                    },
                  },
                  [
                    Header("Select Size"),

                    article(
                      {
                        attrs: { ...scoping },
                        class: "main",
                      },
                      [
                        ul(
                          {
                            attrs: {
                              ...scoping,
                              role: "radiogroup",
                              "aria-labelledby": "select-size",
                            },
                            staticClass: "items-wrapper",
                          },
                          [
                            [1, 2, 3].map((item, index) => {
                              const size =
                                item == 1 ? "SM" : item == 2 ? "MD" : "LG";
                              const selected = this.selectedSize == size;

                              return btn(
                                {
                                  key: index,
                                  attrs: {
                                    ...scoping,
                                    role: "radio",
                                    tabindex: selected ? "0" : "-1",
                                    "aria-checked": `${selected}`,
                                    title:
                                      item == 1
                                        ? "small - Chest 38 Inches"
                                        : item == 2
                                        ? "medium - Chest 48 Inches"
                                        : "large - Chest 58 Inches",
                                  },
                                  staticClass: "item",
                                  props: {
                                    shape: "tile",
                                    flat: true,
                                    block: true,
                                    tag: "li",
                                    case: "initial",
                                    background: selected ? "info" : undefined,
                                  },
                                  on: {
                                    click: async () => {
                                      this.$store.commit("V_MODEL", {
                                        value: size,
                                        path: "size",
                                        innerPath: "addToBag",
                                      });
                                      await this.$sleep(200);
                                      close();
                                    },
                                  },
                                },
                                [
                                  p(
                                    {
                                      key: "prepend",
                                      slot: "prepend",
                                      attrs: { ...scoping },
                                      staticClass: "item-prepend",
                                    },
                                    [size]
                                  ),
                                  p(
                                    {
                                      key: "default",
                                      slot: "default",
                                      attrs: { ...scoping },
                                      staticClass: "item-default",
                                    },
                                    [
                                      item == 1
                                        ? "Chest 38 Inches"
                                        : item == 2
                                        ? "Chest 48 Inches"
                                        : "Chest 58 Inches",
                                    ]
                                  ),
                                  selected
                                    ? p(
                                        {
                                          key: "append",
                                          slot: "append",
                                          attrs: { ...scoping },
                                          staticClass: "item-append",
                                        },
                                        [
                                          icon({
                                            props: {
                                              name: "check",
                                            },
                                          }),
                                        ]
                                      )
                                    : null,
                                ]
                              );
                            }),
                          ]
                        ),

                        btn(
                          {
                            props: {
                              case: "initial",
                              flat: true,
                              color: "info",
                            },
                            attrs: { ...scoping, title: "size guide" },
                            staticClass: "size-guide-activator",
                            on: {
                              click: async (e) => {
                                const bound =
                                  e.currentTarget
                                    .closest(".__content")
                                    .getBoundingClientRect() || {};

                                this.sizeGuideMirrorElBound = bound;

                                await this.$sleep(48);

                                requestAnimationFrame(() => {
                                  this.$nextTick(
                                    () => (this.showSizeGuide = true)
                                  );
                                });
                              },
                            },
                          },
                          ["Size Guide"]
                        ),
                      ]
                    ),
                  ]
                )
              : undefined;
          const productInfo =
            this.template == "product-info"
              ? div([
                  Header("Product information"),
                  article(
                    {
                      attrs: { ...scoping },
                      class: "main",
                    },
                    [
                      p({ attrs: { ...scoping }, class: "content" }, [
                        Array.from({ length: 10 }, (_, i) => i).map(
                          () => lorem
                        ),
                      ]),
                    ]
                  ),
                ])
              : undefined;
          const sizeGuide =
            this.template == "size-guide"
              ? sizeGuideContent({
                  staticClass: "size-guide-template",
                  props: {
                    showBackButton: false,
                    showCloseButton: true,
                  },
                  on: {
                    "close-button-clicked": () => requestAnimationFrame(close),
                  },
                })
              : undefined;
          const delivery =
            this.template == "delivery"
              ? div([
                  Header("Delivery and returns"),
                  article(
                    {
                      attrs: { ...scoping },
                      class: "main",
                    },
                    [
                      p({ attrs: { ...scoping }, class: "content" }, [
                        Array.from({ length: 10 }, (_, i) => i).map(
                          () => lorem
                        ),
                      ]),
                    ]
                  ),
                ])
              : undefined;

          const confirmDialog = this.confirmDialog
            ? div(
                {
                  attrs: { ...scoping },
                  staticClass: "loader-wrapper",
                  class: [
                    {
                      show:
                        /afterEnter/i.test(state) &&
                        !this.showConfirmationDialog,
                    },
                  ],
                },
                [
                  div({
                    attrs: {
                      ...scoping,
                      title: "adding item to bag",
                      "aria-label": "adding item to bag",
                      role: "status",
                    },
                    staticClass: "spinner-border",
                    class: [
                      {
                        animate: /afterEnter/i.test(state),
                        "pause-animation": !/enter/i.test(state),
                      },
                    ],
                  }),
                ]
              )
            : undefined;

          const warnDialog = this.warnDialog
            ? article(
                {
                  attrs: { ...scoping },
                  staticClass: "warn-dialog-wrapper",
                  style: {
                    visibility: /leave/i.test(state) ? "hidden" : undefined,
                  },
                },
                [
                  p(
                    {
                      attrs: { ...scoping },
                      staticClass: "message",
                    },
                    this.dialogObject.meta.message
                  ),
                  div(
                    {
                      attrs: { ...scoping },
                      staticClass: "action-wrapper",
                    },
                    [
                      [1, 2].map((item, index) => {
                        return btn(
                          {
                            key: index,
                            attrs: { ...scoping },
                            props: {
                              outlined: item == 1,
                              flat: true,
                              case: "initial",
                              background: "transparent",
                            },
                            staticClass: `action-${item}`,
                            on: {
                              "!click": () => {
                                if (item == 1) {
                                  this.dialogScale = "in";

                                  this.$nextTick(() =>
                                    requestAnimationFrame(close)
                                  );
                                } else {
                                  this.dialogScale = "out";

                                  this.$nextTick(() =>
                                    requestAnimationFrame(close)
                                  );
                                }
                              },
                            },
                          },
                          item == 1 ? "Cancel" : "Continue"
                        );
                      }),
                    ]
                  ),
                ]
              )
            : undefined;

          const share =
            this.template == "share"
              ? h("share-dialog-template", {
                  props: {
                    // opacity: !/afterE/i.test(state) ? "0" : undefined,
                  },
                  on: {
                    "close-dialog": () => {
                      this.$nextTick(() => requestAnimationFrame(close));
                    },
                  },
                })
              : undefined;

          return [
            selectSize,
            productInfo,
            sizeGuide,
            delivery,
            confirmDialog,
            warnDialog,
            share,
          ];
        },
      },
    });
  },
};
</script>

<style>
#size-guide-root {
  pointer-events: none;
}

.size-guide[data-atbdg] {
  pointer-events: auto;
  width: 100%;
  height: var(--full-dialog);
  max-height: var(--full-dialog);
  position: absolute;
  bottom: 0;
  transition: 0.3s;
  transition-property: opacity, transform;
  transform-origin: bottom;
  border-radius: 10px 10px 0 0;
  background-color: var(--theme-primary);
  box-shadow: var(--raise-dark);
}

.ui-dialog:not(.__active) .size-guide[data-atbdg] {
  transform: translate3d(0, 100%, 0);
}

@media (hover: hover) and (pointer: fine) {
  .header[data-atbdg] .ui-btn:not(:hover):not(:focus)::before {
    opacity: 0.05;
  }
}

.main[data-atbdg] {
  display: grid;
  justify-items: center;
  margin-bottom: 2rem;
}

.items-wrapper[data-atbdg] {
  padding: 1.5rem 0;
  display: grid;
  row-gap: 8px;
  width: 100%;
}

.item[data-atbdg] {
  height: 48px !important;
  padding: 0 1.5rem !important;
  column-gap: 1rem !important;
}

.dark-theme .item[data-atbdg]:not(.info)::before {
  opacity: 0.025;
}

.light-theme .item[data-atbdg]:not(.info)::before {
  opacity: 0.035;
}

.item-prepend[data-atbdg] {
  font-weight: 600;
}

.item-default[data-atbdg] {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-size-template > div {
  transition: 0.2s opacity;
}

/* .size-guide-activator[data-atbdg] {
  height: 48px !important;
  display: flex !important;
  justify-content: flex-start;
  padding: 0 2rem !important;
} */

.size-guide-activator[data-atbdg] > .__default-slot {
  justify-self: center;
  width: 100%;
}

.product-info-template[data-atbdg],
.size-guide-template[data-atbdg],
.delivery-template[data-atbdg] {
  max-height: var(--full-dialog) !important;
  height: var(--full-dialog) !important;
  overflow: hidden !important;
}

.product-info-template[data-atbdg] > div,
.delivery-template[data-atbdg] > div {
  display: grid;
}

.product-info-template[data-atbdg] .main,
.delivery-template[data-atbdg] .main {
  overflow: hidden auto;
  max-height: calc(100% - 48px);
}

.product-info-template[data-atbdg] .content,
.delivery-template[data-atbdg] .content {
  padding: 1rem 1.5rem;
  line-height: 1.75;
}

.confirmation-dialog-template[data-atbdg] {
  padding: 1.25rem;
  box-shadow: var(--raise-normal) !important;
  border-radius: 8px !important;
}

.loader-wrapper[data-atbdg] {
  transition: 0.3s opacity;
  opacity: 0;
}

.loader-wrapper[data-atbdg].show {
  opacity: 1;
}

.spinner-border[data-atbdg] {
  --size: 2.5rem;
}

.spinner-border[data-atbdg].animate {
  will-change: transform;
}

.spinner-border[data-atbdg].pause-animation {
  animation-play-state: paused;
}

#confirm-dialog-root {
  pointer-events: none;
  display: grid;
  place-items: center;
}

.confirm-dialog[data-atbdg] {
  pointer-events: auto;
  height: calc(160px + 9.5rem);
  min-width: min(320px, 80%);
  position: absolute;
  transition: 0.3s;
  transition-property: opacity, transform;
  transition-timing-function: var(--circOut);
  transform-origin: center;
  border-radius: 8px;
  background-color: var(--theme-primary);
  box-shadow: var(--raise-dark);
}

.confirm-dialog[data-atbdg] > div {
  display: grid;
  grid-template-rows: 112px 2rem 48px;
  row-gap: 2rem;
  padding: 2rem 1.5rem 1.5rem;
  justify-items: center;
  align-items: center;
  transition: 0.1s opacity;
}

.confirm-dialog[data-atbdg] .close-confirm-dialog {
  justify-self: flex-end;
  align-self: center;
  --icon__size-md: 42px;
}

@media (hover: hover) and (pointer: fine) {
  .confirm-dialog[data-atbdg]
    .close-confirm-dialog:not(:hover):not(:focus)::before {
    opacity: 0.05;
  }
}

.confirm-dialog[data-atbdg] .close-confirm-dialog:not(:active)::before {
  opacity: 0.05;
}

.confirm-dialog[data-atbdg] .icon {
  color: var(--success);
  height: 90%;
  width: 90%;
}

.confirm-dialog[data-atbdg] .icon svg {
  height: 100% !important;
  width: 100% !important;
}

.confirm-dialog[data-atbdg] .confirm-description {
  font-size: 1.5rem;
}

.confirm-dialog[data-atbdg] .view-bag {
  width: 100%;
}

.ui-dialog:not(.__active) .confirm-dialog[data-atbdg] {
  transform: scale3d(0.5, 0.5, 1);
  transition-timing-function: cubic-bezier(0.5, 1, 0.89, 1);
  opacity: 0;
}

.ui-dialog:not(.__active) .confirm-dialog[data-atbdg].scale-out {
  transform: scale3d(1.15, 1.15, 1);
}

.warning-dialog-template {
  max-width: calc(100% - 1.5rem) !important;
}

.warn-dialog-wrapper[data-atbdg] {
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-rows: auto auto;
  row-gap: 1.65rem;
  width: 450px;
  max-width: 100%;
  transition: 0.2s opacity;
}

.warn-dialog-wrapper[data-atbdg] .message {
  line-height: 1.75;
  font-size: 1.21428rem;
  opacity: var(--t-body);
}

.warn-dialog-wrapper[data-atbdg] .action-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.warn-dialog-wrapper[data-atbdg] .action-2 {
  margin-left: 0.5rem;
  color: var(--info);
}

.warn-dialog-wrapper[data-atbdg] .action-2::after {
  opacity: 1 !important;
}

.warn-dialog-wrapper[data-atbdg] .action-2:focus > span[aria-hidden],
.warn-dialog-wrapper[data-atbdg] .action-2:focus::after,
.warn-dialog-wrapper[data-atbdg] .action-1:focus::after {
  display: none;
}

.warn-dialog-wrapper[data-atbdg] .action-1 {
  background: var(--error);
  color: var(--theme-surface);
}

@media (hover: hover) and (pointer: fine) {
  .warn-dialog-wrapper[data-atbdg] .action-2:focus {
    background-color: var(--info) !important;
    color: var(--theme-surface) !important;
  }

  .warn-dialog-wrapper[data-atbdg] .action-1:focus {
    background-color: var(--error) !important;
    color: var(--theme-surface);
  }
}

@media (hover: none) and (pointer: coarse) {
  .warn-dialog-wrapper[data-atbdg] .action-2 {
    color: var(--info) !important;
    background: none !important;
  }

  .warn-dialog-wrapper[data-atbdg] .action-2 > span[aria-hidden],
  .warn-dialog-wrapper[data-atbdg] .action-2::after,
  .warn-dialog-wrapper[data-atbdg] .action-1::after {
    display: none;
  }
}
</style>
