<script>
export default {
  name: "UiLogo",
  functional: true,

  props: {
    height: {
      type: [String, Number],
      default: 24,
    },
    width: {
      type: [String, Number],
      default: 36,
    },
    tag: {
      type: String,
      default: "span",
    },
    to: {
      type: [Object, String],
      default: () => undefined,
    },
  },

  render(h, c) {
    const props = c.props;

    return h("ui-icon", {
      props: {
        name: "appLogo",
        height: props.height,
        width: props.width,
        viewBox: "0 0 801.47 460.14",
        tag: props.tag,
        to: props.to,
      },
      staticClass: "prd-logo",
      attrs: { ...c.data.attrs },
      on: { ...(c.data?.on || {}) },
    });
  },
};
</script>

<style>
.ui-icon.prd-logo svg {
  margin-left: 10%;
}
</style>
