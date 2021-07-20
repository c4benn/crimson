<script>
export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head() {
    return {
      title: this.message,
    };
  },
  computed: {
    message() {
      return this.error.message;
    },
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },
  },
  render(h) {
    return h(
      "div",
      {
        style: "width:100vw;height:100vh;background:var(--theme-surface)",
      },
      [
        `${this.message}!`,
        this.statusCode === 404 &&
          h(
            "nuxt-link",
            {
              props: {
                to: "/",
              },
            },
            "Home page"
          ),
      ]
    );
  },
};
</script>

<style scoped></style>
