<script>
export default {
  name: "UiPagination",

  props: {
    length: {
      type: Number,
      default: 4,
      //   required: true,
    },
    leftIcon: {
      type: String,
      default: "menuLeft",
    },
    rightIcon: {
      type: String,
      default: "menuRight",
    },
  },

  render(h, c) {
    const data = c.data;
    const attrs = data.attrs;
    const staticClass = data.staticClass;
    const props = c.props;
    let V = {};

    if (process.client) {
      V = window.$nuxt;
    }

    const scoping = { "data-upn": "" };

    const div = (d, c) => h("div", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);

    const paddle = (name) => {
      const isLeft = /left/.test(name);

      const page = parseFloat(V?.$route?.query?.page || 1);

      const disabled =
        (!isLeft && page == props.length) || (isLeft && page == 1);

      const pageIndex = isLeft
        ? page > 1
          ? page - 1
          : 1
        : page < props.length
        ? page + 1
        : page;

      return btn(
        {
          props: {
            filledText: true,
            simpleButton: true,
            flat: true,
            size: "sm",
            disabled,
            tag: "nuxt-link",
            to: V?.$route ? `${V?.$route?.path}?page=${pageIndex}` : "/",
          },
          attrs: {
            ...scoping,
            "aria-label": "pages paddle",
            title: isLeft ? "previous" : "next",
          },
          staticClass: "paddle",
          class: [{ transparent: disabled }],
        },
        [
          icon({
            props: {
              name: props[name],
            },
          }),
        ]
      );
    };

    return div(
      {
        ...data,
        attrs: { ...scoping, ...attrs },
        staticClass: `root${staticClass ? ` ${staticClass}` : ""}`,
      },
      [
        paddle("leftIcon"),
        div(
          {
            attrs: { ...scoping },
            staticClass: "items-wrap hide-scrollbar",
            style: {
              "--length": props.length,
            },
          },
          Array.from({ length: props.length }, (_, i) => i + 1).map(
            (item, key) => {
              let to = "/";

              if (V.$route) {
                to = `${V.$route.path}?page=${item}`;
              }

              const active = V?.$route?.query?.page == item;

              return btn(
                {
                  key,
                  //   attrs: { ...scoping },
                  staticClass: "item",
                  attrs: {
                    ...scoping,
                    flat: true,
                    tag: "nuxt-link",
                    to,
                    simpleButton: true,
                    background: active ? "info" : "theme-banner",
                    size: "sm",
                  },
                  on: {
                    click: (e) => {
                      e.preventDefault();
                    },
                  },
                },
                [`${item}`]
              );
            }
          )
        ),
        paddle("rightIcon"),
      ]
    );
  },
};
</script>

<style>
.root[data-upn] {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  column-gap: 0.5rem;
  max-width: 600px;
  width: calc(100% - 6rem);
  margin: 0 auto;
  align-items: center;
}

.paddle[data-upn] {
  --btn__size-sm: 42px;
  width: var(--btn__size-sm);
}

.items-wrap[data-upn] {
  display: grid;
  grid-template-columns: repeat(var(--length), 48px);
  column-gap: 0.25rem;
  max-width: 100%;
  overflow: auto hidden;
}

.item[data-upn] {
  --btn__size-sm: 48px;
  width: var(--btn__size-sm);
}

.item[data-upn]:not(.info) {
  transform: scale3d(0.875, 0.875, 1) !important;
}
</style>
