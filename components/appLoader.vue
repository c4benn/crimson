<script>
export default {
  name: "AppLoader",
  functional: true,

  props: {
    size: {
      type: String,
      default: undefined,
    },
    color: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: "loading",
    },
    stroke: {
      type: String,
      default: undefined,
    },
    duration: {
      type: String,
      default: undefined,
    },
    direction: {
      type: String,
      default: undefined,
    },
  },

  render(h, c) {
    const props = c.props;

    const $data = c.data;

    const $attrs = $data.attrs;

    const $class = $data.class;

    const staticClass = $data.staticClass ? ` ${$data.staticClass}` : "";

    const style = typeof $data.style == "object" ? { ...$data.style } : {};

    const getProp = (prop) => {
      if (/^--/.test(props[prop])) {
        return `var(${props[prop]})`;
      }
      return props[prop];
    };

    const div = (d) => h("div", d);
    const intersection = (d) => h("ui-intersection", d);

    const spinner = (p) =>
      div({
        ...$data,
        attrs: { role: "status", title: props.title, ...$attrs },
        staticClass: `app-loader spinner-border${staticClass}`,
        class: [
          { paused: typeof p == "object" ? !p.isIntersecting : false },
          $class,
        ],
        style: {
          "--size": getProp("size"),
          "--color": getProp("color"),
          "--stroke": getProp("stroke"),
          // "--duration": `${props.animationDuration}ms`,
          "--direction": getProp("direction"),
          // animationDuration: `${props.animationDuration}ms`,
          ...style,
        },
      });

    if (props.useIntersection) {
      return intersection({
        scopedSlots: {
          default: (p) => {
            return spinner(p);
          },
        },
      });
    } else return spinner();
  },
};
</script>

<style>
.app-loader.paused {
  animation-play-state: paused;
}
</style>
