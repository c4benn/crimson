<script>
import { kebabCase } from "~/components/utils/main";
export default {
  name: "UiAlert",
  props: {
    icon: {
      type: String,
      default: undefined,
    },
    closeIcon: {
      type: String,
      default: undefined,
    },
    background: {
      type: String,
      default: "info",
    },
    iconData: {
      type: Object,
      default: () => ({}),
    },
    closeData: {
      type: Object,
      default: () => ({}),
    },
    closeIconData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {};
  },

  mounted() {
    this.$emit("alert-height", this.$el.clientHeight);
  },

  render(h) {
    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("ui-btn", d, c);

    let cols = 1;

    if (this.icon) {
      cols += 1;
    }

    if (this.closeIcon) {
      cols += 1;
    }

    const background = this.background.replace(/--/, "");

    return div(
      {
        staticClass: "ui-alert fill-before",
        class: [
          {
            "two-cols": cols == 2,
            "three-cols": cols == 3,
          },
          this.$theme.light ? background : "",
        ],
        style: {
          "--alert-color": `var(--${background})`,
        },
      },
      [
        this.icon
          ? h(`mdi-${kebabCase(this.icon).replace(/^mdi-/, "")}`, {
              ...this.iconData,
              staticClass: `prepend-icon ${this.iconData?.staticClass || ""}`,
            })
          : null,
        this.$slots.default,
        this.closeIcon
          ? btn(
              {
                ...this.closeData,
                props: {
                  icon: true,
                  text: true,
                  size: "sm",
                  ...(this.closeData?.props || {}),
                },
                attrs: {
                  title: "close alert",
                },
                staticClass: `close-btn ${this.closeData?.staticClass || ""}`,
                on: {
                  "!click": () => {
                    this.$emit("close-alert");
                  },
                },
              },
              [
                h(`mdi-${kebabCase(this.closeIcon).replace(/^mdi-/, "")}`, {
                  ...this.closeIconData,
                  props: { size: 20, ...(this.closeIconData?.props || {}) },
                }),
              ]
            )
          : null,
      ]
    );
  },
};
</script>

<style>
.ui-alert {
  position: relative;
  min-height: 64px;
  display: grid;
  grid-template-columns: auto;
  column-gap: 1rem;
  align-items: flex-start;
  padding: 0.75rem 0.5rem;
  padding-left: 0.75rem;
  border-left: 0.5rem solid var(--alert-color, var(--info));
}

.light-theme .ui-alert {
  border-left: none;
  padding-left: 1.25rem;
}

.light-theme .ui-alert::before {
  width: calc(0.5rem - 1px);
  left: 1px;
  background: currentColor;
  opacity: 0.5;
}

.ui-alert.two-cols {
  grid-template-columns: auto 1fr;
}

.ui-alert.three-cols {
  grid-template-columns: auto 1fr auto;
}

.dark-theme .ui-alert::before {
  background: var(--alert-color);
  opacity: 0.25;
}

.ui-alert .prepend-icon {
  margin-top: 0.25rem;
}

.ui-alert .close-btn {
  color: inherit;
}
</style>
