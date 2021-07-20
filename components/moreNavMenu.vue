<script>
import { eventKey as EventKey, ArrowNavigate } from "./utils/main";
export default {
  name: "MoreNavMenu",

  data: () => ({
    menuTransitionState: "",
  }),

  computed: {
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
  },

  render(h) {
    const scoping = { "data-mnmu": "" };
    const li = (d, c) => h("li", d, c);

    const btn = (d, c) => h("ui-btn", d, c);

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

    return dialog(
      {
        props: {
          label: "navigation menu",
          type: "menu",
          vmodel: this.vmodel,
          transition: {
            transition: "scale(0.75)",
            origin: "bottom right",
            // fade: false,
            type: "spring",
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
        },
      },
      [
        this.menuItems.map((item, index) => {
          return btn(
            {
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
                    await this.$sleep(sharedMenuTransition.duration.leave);
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
                    isLight: /^toggle/i.test(item.name) && this.$theme.light,
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
      ]
    );
  },
};
</script>

<style></style>
