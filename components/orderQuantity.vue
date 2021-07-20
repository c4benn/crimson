<script>
export default {
  name: "OrderQuantity",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    vmodel: {
      type: [Number, String],
      default: 1,
    },
    disabled: Boolean,
    id: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      inputFocused: false,
    };
  },

  mounted() {
    this.$store.commit("FETCHED", {
      value: "orderQuantity",
      path: "components",
    });
  },

  render(h) {
    const scoping = { "data-oqy": "" };
    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const input = (d) => h("input", d);
    const action = ({ disabled, iconName, mousedown }) => {
      return btn(
        {
          props: {
            icon: true,
            flat: true,
            disabled: this.disabled || disabled,
            background: "transparent",
            persistent: true,
          },
          attrs: { title: iconName == "plus" ? "increase" : "reduce" },
          staticClass: iconName,
          on: {
            "!mousedown": mousedown,
            "active-click": mousedown,
          },
        },
        [
          icon({
            props: {
              name: `${iconName}`,
            },
          }),
        ]
      );
    };

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root fill-before-and-after",
        class: [{ focused: this.inputFocused, __disabled: this.disabled }],
      },
      [
        action({
          disabled: this.vmodel < 2,
          iconName: "minus",
          mousedown: () => {
            requestAnimationFrame(() => {
              this.$emit("vmodel", this.vmodel - 1);
            });
          },
        }),
        input({
          attrs: {
            ...scoping,
            type: "number",
            pattern: "\\d*",
            title: "enter quantity",
            tabindex: this.disabled ? "-1" : undefined,
            id: this.id,
            readonly: this.disabled,
          },
          domProps: {
            value: this.disabled ? 0 : parseFloat(this.vmodel),
          },
          on: {
            focus: () => {
              this.inputFocused = true;
            },
            blur: () => {
              this.inputFocused = false;
            },
            input: (e) => {
              const value = parseFloat(e.currentTarget.value);

              this.$emit("vmodel", value);
            },
            change: (e) => {
              let value = parseFloat(e.currentTarget.value);
              if (!value || value == 0) {
                value = 1;
              }
              if (value > 100) {
                value = 100;
              }
              this.$emit("vmodel", value);
            },
          },
        }),
        action({
          disabled: this.vmodel > 99,
          iconName: "plus",
          mousedown: () => {
            requestAnimationFrame(() => {
              this.$emit("vmodel", this.vmodel + 1);
            });
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-oqy] {
  --size: 52px;
  display: inline-grid;
  grid-template-columns: repeat(3, auto);
  height: var(--size);
  position: relative;
  border-radius: 8px;
  margin: 0.5rem 0 0;
  isolation: isolate;
}

.root[data-oqy]::before {
  border: var(--ui-divide);
  border-width: 1px;
  z-index: 1;
}

.root.__disabled[data-oqy] {
  opacity: var(--t-disabled);
}

.root[data-oqy]::after {
  width: 6.35rem;
  height: calc(100% + 9px);
  left: var(--size);
  top: -4.5px;
  border-radius: 6px;
  border: 3px solid var(--info);
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .root[data-oqy]::after {
    transition: 0.2s opacity;
  }

  .root[data-oqy].hover::after {
    opacity: 0.4;
  }
}

.root[data-oqy].focused::after {
  opacity: var(--t-body);
}

input[data-oqy] {
  background-color: transparent;
  border: none;
  text-align: center;
  font-size: 1.75rem;
  color: var(--theme-surface-text);
  width: 6.35rem;
  caret-color: var(--theme-surface-text);
  opacity: var(--t-body);
  outline: none;
  border: var(--ui-divide);
  border-width: 0 1px;
  border-radius: 0;
  font-family: var(--monospace);
  transition: 0.2s opacity;
  appearance: none;
}

input[data-oqy]::-webkit-outer-spin-button,
input[data-oqy]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[data-oqy][type="number"] {
  -moz-appearance: textfield;
}

.root.__disabled[data-oqy] input {
  opacity: var(--t-disabled);
  pointer-events: none;
}

.root[data-oqy] > .ui-btn {
  width: var(--size) !important;
  max-width: var(--size) !important;
  height: var(--size) !important;
  max-height: var(--size) !important;
  border-radius: 0;
  background: var(--theme-primary);
  opacity: var(--t-body);
}

.root[data-oqy] > .ui-btn.__disabled {
  opacity: var(--t-disabled);
}

.root[data-oqy] > .minus {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.root[data-oqy] > .plus {
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
}
</style>
