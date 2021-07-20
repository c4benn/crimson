<script>
export default {
  name: "DynamicBookmark",
  props: {
    saved: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      default: undefined,
    },
  },
  render(h) {
    const icon = (d, c) => h("ui-icon", d, c);

    return icon({
      key: `bookmark${this.saved ? "" : "-outline"}`,
      props: {
        name: this.saved ? "bookmark" : "bookmarkOutline",
        size: this.size,
      },
    });
  },
};
</script>
