<script>
export default {
  name: "SizeDialogContent",
  functional: true,

  props: {
    showBackButton: Boolean,
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    opacity: {
      type: String,
      default: undefined,
    },
  },
  render(h, c) {
    const props = c.props;

    const $data = c.data;

    const $attrs = $data.attrs;

    const staticClass = $data.staticClass ? ` ${$data.staticClass}` : "";

    const style = typeof $data.style == "object" ? { ...$data.style } : {};

    const $emit = (event, payload = undefined) => {
      return c.listeners[event] && c.listeners[event](payload);
    };

    const scoping = { "data-sdct": "" };
    const div = (d, c) => h("div", d, c);
    const header = (d, c) => h("header", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const article = (d, c) => h("article", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    // const icon = (d, c) => h("ui-icon", d, c);
    const p = (d, c) => h("p", d, c);

    const lorem =
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem commodi velit facere ad sequi nulla maiores doloribus illum libero, repellat.";

    return div(
      {
        ...$data,
        attrs: { ...scoping, ...$attrs },
        staticClass: `root${staticClass}`,
        style: { opacity: props.opacity, ...style },
      },
      [
        header(
          {
            attrs: { ...scoping },
            class: "header sheet-header fill-before-and-after",
          },
          [
            // props.showBackButton &&
            //   btn(
            //     {
            //       props: {
            //         icon: true,
            //         flat: true,
            //       },
            //       on: {
            //         "!click": (e) => {
            //           $emit("back-button-clicked", e);
            //         },
            //       },
            //       attrs: {
            //         ...scoping,
            //         title: "back",
            //       },
            //       staticClass: "back-btn",
            //     },
            //     [
            //       icon({
            //         props: {
            //           name: "chevronLeft",
            //         },
            //       }),
            //     ]
            //   ),
            h1(
              {
                attrs: { ...scoping },
                class: "title sheet-heading",
              },
              "Size Guide"
            ),
            props.showCloseButton &&
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
                    "!click": (e) => $emit("close-button-clicked", e),
                  },
                },
                "Close"
              ),
            // icon({
            //   props: {
            //     name: "close",
            //     clickable: true,
            //   },
            //   on: {
            //     click: (e) => {
            //       $emit("close-button-clicked", e);
            //     },
            //   },
            //   staticClass: "close-btn",
            //   attrs: {
            //     ...scoping,
            //   },
            // }),
          ]
        ),
        article(
          {
            attrs: { ...scoping },
            class: "main",
          },
          [
            p({ attrs: { ...scoping }, class: "content" }, [
              Array.from({ length: 10 }, (_, i) => i).map(() => lorem),
            ]),
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-sdct] {
  display: grid;
  transition: 0.15s opacity;
}

.main[data-sdct] {
  max-height: calc(100% - max(var(--header-height), 48px));
  overflow: hidden auto;
}

.content[data-sdct] {
  padding: 1rem 1.5rem;
  line-height: 1.75;
}
</style>
