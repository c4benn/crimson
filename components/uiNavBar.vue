<script>
import {
  eventKey as EventKey,
  ArrowNavigate,
  springPresets,
  nextFrame,
} from "~/components/utils/main";
export default {
  name: "UiNavBar",
  data() {
    return {
      menuTransitionState: "",
      itemToReplace: null,
    };
  },
  computed: {
    menuItems() {
      const extraItems = this.items.filter((_, i) => i > 4);
      return [
        ...extraItems,
        {
          name: "Toggle theme",
          icon: "theme-light-dark",
          callback: () => {
            this.$theme.light = !this.$theme.light;
          },
        },
      ];
    },
    items() {
      const $route = this.$route.path;
      const menuActive = this.v_model.isActive;
      const returnValue = [
        {
          name: "Shop",
          to: "/",
          active: /^\/$|\/shop/i.test($route),
          exactActive: $route == "/",
        },
        {
          name: "Search",
          icon: "magnify",
          to: "/search",
          active: /\/search/i.test($route),
          exactActive: true,
        },
        {
          name: "Bag",
          icon: "shopping",
          to: "/bag",
          active: /\/bag/i.test($route),
          exactActive: true,
        },
        {
          name: "Saved",
          longName: "Saved items",
          icon: "bookmark",
          to: "/saved",
          active: /\/saved/i.test($route),
          exactActive: true,
        },
        {
          name: "More",
          icon: "dots-horizontal",
          active: menuActive,
          callback: () => {
            this.v_model.toggle();
          },
        },

        {
          name: "Profile",
          icon: "account",
          to: "/profile",
          active: /\/profile/i.test($route),
          exactActive: true,
        },
        {
          name: "Gallery",
          icon: "image-multiple",
          to: "/gallery",
          active: /\/gallery/i.test($route),
          exactActive: true,
        },
        {
          name: "Playlist",
          icon: "playlist-music",
          to: "/playlist",
          active: /\/playlist/i.test($route),
          exactActive: true,
        },
        {
          name: "Support",
          icon: "face-agent",
          to: "/support",
          active: /\/support/i.test($route),
          exactActive: true,
        },
        {
          name: "About us",
          icon: "information-variant",
          to: "/profile",
          active: /\/profile/i.test($route),
          exactActive: true,
        },
      ];

      if (this.itemToReplace) {
        const itemToReplaceIndex = returnValue.indexOf(
          returnValue.find((x) => x.name == this.itemToReplace.name)
        );
        const itemToReplace = returnValue[itemToReplaceIndex];

        returnValue[itemToReplaceIndex] = returnValue[3];
        returnValue[3] = itemToReplace;
      }

      return returnValue;
    },
    activeItem() {
      return this.items.find((x) => x.active && x.to) || {};
    },
    vmodel() {
      return this.$store.state.vmodel.menus.navBar;
    },
    v_model() {
      const toggleMenu = (value) => {
        if (value && this.v_model.isActive) {
          return;
        }
        if (!value && !this.v_model.isActive) {
          return;
        }

        if (!value && !/afterEnter|^$/i.test(this.menuTransitionState)) {
          return;
        }
        requestAnimationFrame(() =>
          this.$store.commit("V_MODEL", {
            path: "navBar",
            innerPath: "menus",
            value,
          })
        );
      };
      return {
        isActive: this.vmodel,
        open: () => toggleMenu(true),
        close: () => toggleMenu(false),
        toggle: () => toggleMenu(!this.vmodel),
        set: (e) => toggleMenu(e),
      };
    },
    bagItems() {
      return this.$store.state.bagItems.items;
    },
    bagLength() {
      return this.$store.getters.bagLength;
    },
  },

  watch: {
    async activeItem(n) {
      if (!n?.exactActive || /^\/?bag\/?$/i.test(this.$route.path)) {
        return;
      }
      await this.$sleep(parseFloat(this.$store.state.pageTransitionDuration));
      this.$nextTick(() =>
        this.$store.commit("V_MODEL", {
          path: "text",
          innerPath: "headerContent",
          value: n.longName || n.name,
        })
      );
    },

    // $route(n, o) {
    //   this.$store.commit("TRACK_ROUTES", {
    //     value: n.fullPath,
    //     path: n.name,
    //     action: "push",
    //   });

    //   this.$store.commit("TRACK_ROUTES", {
    //     value: { x: pageXOffset, y: pageYOffset },
    //     path: o.name,
    //     action: "scrollPosition",
    //   });

    //   console.log(this.$store.state.trackRoutes);

    //   this.$store.commit("UPDATE_", {
    //     name: "activeTab",
    //     value: {
    //       root: this.activeItem,
    //       n,
    //       o,
    //     },
    //   });

    //   this.$nextTick(() => {
    //     console.log({
    //       n,
    //       o,
    //       root: this.activeItem,
    //     });

    //     const backPathName = o?.name
    //       ?.replace?.(/^index$/, "shop")
    //       ?.toLowerCase();

    //     const sameRouteRegExp = new RegExp(`^${backPathName}`);

    //     const isSameRoute = sameRouteRegExp.test(n.name);

    //     console.log({
    //       showBackBtn: !this.activeItem.exactActive,
    //       backPath: o,
    //       toPath: n,
    //       backHref: isSameRoute ? o.fullPath : this.activeItem.to,
    //     });
    //   });
    // },
  },

  created() {
    // this.$store.commit("UPDATE_", {
    //   name: "activeTab",
    //   value: this.activeItem,
    // });

    const replaceItemMatch = this.menuItems.find((x) => x.active);

    if (replaceItemMatch) {
      this.itemToReplace = replaceItemMatch;
    }

    const activeItem = this.items.find((x) => x.active);

    if (
      !activeItem?.exactActive ||
      /more/i.test(activeItem.name) ||
      /bag/i.test(activeItem.name)
    ) {
      return;
    }

    const activeHeaderText = this.items.find((x) => x.active)?.name;

    activeHeaderText &&
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: activeHeaderText,
      });
  },

  render(h) {
    const scoping = { "data-ubbr": "" };
    const nav = (d, c) => h("nav", d, c);
    const span = (d, c) => h("span", d, c);
    const div = (d, c) => h("div", d, c);
    const li = (d, c) => h("li", d, c);
    const transition = (d, c) => h("ui-transition", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const portal = (d, c) =>
      /sm-/i.test(this.$breakpoints.greater)
        ? h("ui-portal", d, c)
        : h("pseudo", d, c);
    const dialog = (d, c) => h("ui-dialog", d, c);

    const sharedMenuTransition = {
      ease: {
        enter: "--circOut",
      },
      duration: {
        enter: "0.35s",
        leave: "0.2s",
      },
      delay: {
        enter: "0",
      },
    };

    return nav(
      {
        attrs: { ...scoping, "aria-label": "navigation links" },
        staticClass: "root fill-after",
        class: [
          {
            __hidden: /\/welcome|\/reset_password/i.test(this.$route.path),
          },
        ],
        style: {
          touchAction: this.v_model.isActive ? "none" : undefined,
        },
        on: {
          "&!mousedown": () => {
            this.v_model.close();
          },
        },
      },
      [
        this.items
          .filter((_, i) => i < 5)
          .map((item, index) => {
            return btn(
              {
                ref: `nav-item-${index}`,
                key: index,
                attrs: {
                  ...scoping,
                  title: item.name.toLowerCase(),
                  "aria-label": `click to go to ${item.name.toLowerCase()} page`,
                },
                class: [
                  "items",
                  {
                    "__active-class": item.active && item.to,
                    "menu-active": item.active && !item.to,
                    "__no-transition":
                      item.active &&
                      !/afterEnter|^$/i.test(this.menuTransitionState),
                  },
                ],
                props: {
                  tag: item.to ? "nuxt-link" : undefined,
                  to: item.to,
                  shape: "tile",
                  flat: true,
                  case: "capitalize",
                  background:
                    item.active && !item.to ? undefined : "transparent",
                  disabled: this.v_model.isActive && !!item.to,
                  persistent: true,
                  prependClass: false,
                },
                on: !item.to
                  ? {
                      "active-click": (e) => {
                        e.stopPropagation?.();
                        item.callback();
                      },
                      click: (e) => {
                        e.stopPropagation();
                        item.callback();
                      },
                      mousedown: (e) => {
                        e.stopPropagation();
                      },
                    }
                  : undefined,
                nativeOn: item.to
                  ? {
                      "&!mousedown": () => {
                        if (
                          item.active &&
                          item?.exactActive &&
                          window.pageYOffset > 10
                        ) {
                          requestAnimationFrame(() =>
                            window.scrollTo({
                              left: 0,
                              top: 0,
                              behavior: "smooth",
                            })
                          );
                        }
                      },
                    }
                  : undefined,
              },
              [
                span({
                  slot: "prepend",
                  attrs: { ...scoping },
                  staticClass: "pseudo",
                }),
                item.icon &&
                  !/bag/i.test(item.name) &&
                  h(`mdi-${item.icon}`, {
                    attrs: { ...scoping },
                    class: "icon",
                  }),
                /bag/i.test(item.name) && [
                  transition({
                    props: {
                      transition: "scale(0)",
                      type: { enter: "spring" },
                      springConfig: springPresets.wobbly,
                      duration: item.active ? "200" : { enter: "500" },
                      origin: item.active ? "bottom" : "center",
                    },
                    scopedSlots: {
                      default: () => {
                        const bagLength = this.bagLength;
                        return bagLength && !item.active
                          ? div(
                              {
                                key: `${bagLength}`,
                                attrs: {
                                  ...scoping,
                                  role: "status",
                                  "aria-atomic": "true",
                                  "aria-label": "badge",
                                  "aria-live": "polite",
                                },
                                staticClass: "bag-badge fill-before",
                              },
                              `${bagLength < 100 ? bagLength : "99+"}`
                            )
                          : null;
                      },
                    },
                  }),
                  div(
                    {
                      attrs: {
                        ...scoping,
                      },
                      staticClass: "icon",
                    },
                    [h(`mdi-${item.icon}`)]
                  ),
                ],
                item.name == "Shop" &&
                  h("ui-logo", { attrs: { ...scoping }, class: "icon" }),
                span({ attrs: { ...scoping }, class: "title" }, `${item.name}`),
              ]
            );
          }),
        portal(
          {
            // key: this.$store.state.pageTransitionState,
            props: {
              wrapper: false,
            },
          },
          [
            dialog({
              props: {
                label: "navigation menu",
                type: "menu",
                vmodel: this.vmodel,
                transition: {
                  transition: "scale(0.75)",
                  origin: "bottom right",
                  // fade: false,
                  type: { enter: "spring" },
                  springConfig: springPresets.stiff,
                },
                contentTag: "ul",
                contentAttrs: {
                  ...scoping,
                  "aria-label": "more navigations and theme",
                },
                contentClass: "menu",
                contentEvent: {
                  "!keydown": (e) => {
                    const eventKey = EventKey(e);
                    if (/esc|arrow_down|arrow_up/i.test(eventKey)) {
                      e.preventDefault();
                      if (/arrow/i.test(eventKey)) {
                        const navigate = new ArrowNavigate({
                          root: e.currentTarget,
                          children: "li",
                        });

                        if (/down/i.test(eventKey)) {
                          navigate.forward();
                        } else navigate.backward();
                      }
                    }
                  },
                  "!keyup": (e) => {
                    const eventKey = EventKey(e);
                    if (/esc/i.test(eventKey)) {
                      e.preventDefault();
                      this.v_model.close();
                    }
                  },
                },
                addedZIndex: 30000,
              },
              attrs: {
                ...scoping,
                role: "menu",
              },
              staticClass: "menu-root",
              on: {
                mousedown: (e) => e.stopPropagation(),
                click: (e) => e.stopPropagation(),
                vmodel: (e) => {
                  this.v_model.set(e);
                },
                afterEnter: async () => {
                  await nextFrame();
                  console.log(this.$refs?.["menu-item-0"]?.$el);
                  this.$refs?.["menu-item-0"]?.$el?.focus?.();
                },
              },

              scopedSlots: {
                default: (payload) => {
                  this.menuTransitionState = payload.state;

                  return [
                    this.menuItems.map((item, index) => {
                      return btn(
                        {
                          ref: `menu-item-${index}`,
                          key: index,
                          props: {
                            tag: "li",
                            block: true,
                            text: true,
                            case: "initial",
                            persistent: true,

                            // shape: "tile",
                          },
                          attrs: {
                            role: "menuitem",
                          },
                          staticClass: "fill-before",
                          class: [
                            // {
                            //   "rounded-top": index == 0,
                            //   "rounded-bottom": index == arr.length - 1,
                            // },
                          ],
                          on: {
                            click: async () => {
                              if (item.callback) {
                                item.callback();
                              } else {
                                this.v_model.close();
                                await this.$sleep(
                                  sharedMenuTransition.duration.leave
                                );
                                this.itemToReplace = item;
                                this.$nextTick(async () => {
                                  await this.$sleep(75);
                                  this.$refs[`nav-item-${3}`]?.$el?.click?.();
                                });
                              }
                            },
                          },
                        },
                        [
                          h(`mdi-${item.icon}`, {
                            props: { size: 16 },
                            staticClass: "icon fill-before",
                            class: [
                              {
                                isLight:
                                  /^toggle/i.test(item.name) &&
                                  this.$theme.light,
                                "theme-icon": /^toggle/i.test(item.name),
                              },
                            ],
                            slot: "prepend",
                          }),
                          `${item.name}`,
                        ]
                      );
                    }),
                    li({
                      attrs: {
                        role: "presentation",
                      },
                    }),
                  ];
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
.root[data-ubbr] {
  position: fixed;
  bottom: -1px;
  left: 0;
  width: 100%;
  display: flex;
  height: calc(var(--nav-bar-height) + 1px);
  align-items: center;
  z-index: 510;
  /* background-color: var(--theme-primary); */
}

.root[data-ubbr].__hidden {
  display: none;
}

@supports (backdrop-filter: blur(1px)) {
  .light-theme .root[data-ubbr] {
    --blur-header: var(--blur-banner);
  }

  .dark-theme .root[data-ubbr] {
    --blur-header: rgba(35, 35, 35, 0.7);
  }

  .root[data-ubbr] {
    background-color: var(--blur-header);
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .root[data-ubbr] {
    background-color: var(--theme-primary);
  }
}

.root[data-ubbr]::after {
  border-top: var(--ui-divide);
}

.items[data-ubbr] {
  flex-shrink: 0;
  flex-grow: 1;
  height: 100% !important;
  text-decoration: none !important;
  width: 20%;
  padding: 0 !important;
  color: inherit;
  transform: none !important;
}

.items[data-ubbr].Active::before {
  opacity: 0.2;
}

.pseudo[data-ubbr] {
  background: var(--primary);
  transition: opacity 200ms linear;
  opacity: 0;
}

.items[data-ubbr]:not(button).Active .pseudo {
  opacity: 0.4;
}

.items[data-ubbr] .__default-slot {
  display: grid;
  position: relative;
  overflow: visible;
}

.items[data-ubbr].__active-class {
  color: var(--primary);
}

.title[data-ubbr],
.icon[data-ubbr],
.icon[data-ubbr] > span {
  transition-property: transform, opacity;
  transition-duration: 0s;
  transition-timing-function: ease;
  display: inline-block;
  backface-visibility: hidden;
}

.icon[data-ubbr] {
  transform: translate3d(0, 0.75rem, 0);
  opacity: var(--t-caption);
  position: relative;
}

.bag-badge[data-ubbr] {
  position: absolute;
  right: -0.825rem;
  min-width: 1.35rem;
  height: 1.35rem;
  font-size: 0.825rem;
  border-radius: 2rem;
  top: 0.25rem;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  backface-visibility: hidden;
  line-height: 1;
  letter-spacing: 0;
  padding: 0px 6px;
  pointer-events: none;
  color: #fff;
  background-color: var(--info);
  white-space: nowrap;
}

.bag-badge[data-ubbr]::before {
  width: calc(100% + 4px);
  top: -2px;
  left: -2px;
  height: calc(100% + 4px);
}

@supports not (backdrop-filter: blur(1px)) {
  .bag-badge[data-ubbr]::before {
    border: 2px solid var(--theme-primary);
  }
}

.__disabled .bag-badge[data-ubbr] {
  background: var(--disabled);
}

@media (hover: hover) and (pointer: fine) {
  .ui-nav-bar .__items:hover .__icon {
    opacity: 1;
  }
}

.title[data-ubbr] {
  transform-origin: bottom;
  transform: translate3d(0, 1rem, 0) scale3d(0, 0, 1);
  opacity: 0;
}

.items[data-ubbr].menu-active {
  background-color: var(--primary) !important;
  color: #fff !important;
}

.items[data-ubbr].menu-active.__no-transition {
  transition: 0s;
}

.items[data-ubbr] .icon,
.items[data-ubbr] .title {
  transition: 0.2s transform, 0.2s opacity;
}

.items[data-ubbr].__active-class .icon,
.items[data-ubbr].menu-active .icon {
  transform: translate3d(0, 2px, 0);
  opacity: 1;
}

.items[data-ubbr].__active-class .title,
.items[data-ubbr].menu-active .title {
  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  opacity: 1;
}

.title[data-ubbr] {
  height: 1rem;
  font-size: 0.8rem;
}

@media (min-width: 1050px) {
  #ui-root {
    --nav-bar-height: 0;
  }

  .root[data-ubbr] {
    transform: translate3d(0, 100%, 0);
  }
}

.menu-root[data-ubbr] {
  height: calc(100% - var(--nav-bar-height));
  bottom: var(--nav-bar-height);
}

.menu[data-ubbr] {
  background-color: var(--theme-primary);
  border-radius: 0.85rem;
  margin: 0.25rem 0.5rem;
  box-shadow: var(--raise-darker);
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: inherit;
  width: min(60%, 205px);
  padding: 0.25rem 0;
  overflow: hidden;
}

.dark-theme .menu[data-ubbr] {
  background: #282828;
}

.menu[data-ubbr] > li {
  grid-template-columns: auto 1fr !important;
  --btn__size-text-md: 48px;
  --padding__text-md: 0 1.25rem;
  backface-visibility: hidden;
  font-size: 1rem;
  justify-items: flex-start;
  column-gap: 1rem !important;
  --padding__text-md: 0 1rem;
  width: calc(100% - 0.5rem);
  position: relative;
  left: 50%;
  transform: translateX(-50%) !important;
}

.menu[data-ubbr] > li::before {
  border-bottom: var(--ui-divde);
}

.menu[data-ubbr] .__default-slot {
  display: flex;
  align-items: center;
  margin-left: 0.75rem;
}

.menu[data-ubbr] .icon {
  opacity: var(--t-caption);
  --size: 24px;
  height: var(--size) !important;
  width: var(--size) !important;
  position: relative;
  border-radius: 6px;
  isolation: isolate;
}

.light-theme .menu[data-ubbr] .icon {
  color: var(--primary);
}

.dark-theme .menu-root[data-ubbr] .icon {
  opacity: var(--t-subtitle);
}

.menu[data-ubbr] .icon::before {
  background-color: currentColor;
  opacity: 0.1;
  z-index: -1;
}

.menu[data-ubbr] .icon.theme-icon {
  transition: 0.3s transform ease !important;
}

.menu[data-ubbr] .icon.isLight {
  transform: rotate(180deg) translateZ(0);
}

.menu[data-ubbr] li[role="presentation"] {
  position: absolute;
  width: calc(100% - 1rem);
  height: 48px;
  bottom: 0.25rem;
  left: 0.5rem;
  border-top: var(--ui-divide);
  border-width: 0.7px;
  transform: none !important;
  pointer-events: none;
}
</style>
