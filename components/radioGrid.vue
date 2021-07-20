<script>
import {} from "~/components/utils/main";
export default {
  name: "RadioGrid",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    vmodel: {
      type: [Number, String],
      default: undefined,
    },
    id: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    selected() {
      const selected = this.items?.find((x) => this.vmodel == x.title);
      return selected;
    },
  },

  mounted() {
    this.$store.commit("FETCHED", {
      value: "radioGrid",
      path: "components",
    });
  },

  render(h) {
    const scoping = { "data-rgd": "" };
    const ul = (d, c) => h("ul", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const span = (d, c) => h("span", d, c);
    const colorTemplate = this.template == "color";

    return ul(
      {
        attrs: { ...scoping, role: "radiogroup", "aria-labelledby": this.id },
        staticClass: "root",
        class: [{ inactive: !this.selected }],
      },
      this.items.map((item, index) => {
        const active = this.vmodel == item.title;
        return btn(
          {
            key: index,
            props: {
              tag: "li",
              simpleButton: true,
              flat: true,
            },
            attrs: {
              ...scoping,
              role: "radio",
              tabindex: this.selected ? "0" : "-1",
              "aria-checked": `${active}`,
              title: !this.selected ? `choose a ${this.label}` : item.title,
            },
            staticClass: `item fill-before-and-after ${
              colorTemplate ? "color-template" : "size-template"
            }`,
            class: [{ active }],
            on: {
              click: () => {
                requestAnimationFrame(() => {
                  this.$emit("vmodel", item.title);
                });
              },
            },
          },
          [
            colorTemplate
              ? span({
                  attrs: { ...scoping },
                  staticClass: "prepend __color-code",
                  style: {
                    "--color": item.prepend,
                  },
                })
              : span(
                  {
                    attrs: { ...scoping },
                    staticClass: "prepend __title",
                  },
                  item.title
                ),
            span(
              {
                attrs: { ...scoping },
                staticClass: "description",
              },
              [colorTemplate ? item.title : item.prepend]
            ),
          ]
        );
      })
    );
  },
};
</script>

<style>
.root[data-rgd] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max(150px, 30%), 1fr));
  gap: 1.25rem;
  transition: 0.35s opacity;
  touch-action: manipulation;
}

.root.inactive[data-rgd] {
  opacity: var(--t-caption);
}

.item[data-rgd] {
  position: relative;
  border-radius: 8px;
  display: grid;
  grid-template-rows: auto 1.25rem;
  justify-items: center;
  padding: 0.75rem;
  row-gap: 0.75rem;
  text-transform: capitalize;
  outline: none !important;
  cursor: pointer;
  overflow: auto hidden;
  width: 100%;
}

.item.size-template[data-rgd] {
  padding: 0.825rem;
  row-gap: 0.5rem;
}

.item:not(.active) {
  background: var(--theme-surface);
}

.item[data-rgd].active,
.root.inactive[data-rgd] > .item {
  opacity: 1;
}

.__color-code[data-rgd] {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--color);
  border: var(--ui-divide);
  border-width: 0.7px;
}

.prepend.__title[data-rgd] {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.5px;
  opacity: var(--t-body);
}

.description[data-rgd] {
  opacity: var(--t-caption);
  font-size: 0.95rem;
  font-weight: 400;
  display: flex;
}

.item[data-rgd]::after {
  border: var(--ui-divide);
  border-width: 1px;
  opacity: var(--t-caption);
}

.root.inactive[data-rgd] .item[data-rgd]::after {
  opacity: var(--t-disabled);
}

.item[data-rgd].active::after {
  border: 2.5px solid var(--info);
  opacity: 1;
}

.item[data-rgd]:focus-visible::after {
  opacity: 1;
}
</style>
