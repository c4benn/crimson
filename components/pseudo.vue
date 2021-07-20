<script>
export default {
  name: "Pseudo",
  functional: true,
  props: {
    render: Boolean,
  },
  render(h, c) {
    return c.props.render ? h("span", { ...c.data }, [c.children]) : null;
  },
};
</script>
