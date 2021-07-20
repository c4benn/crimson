<script>
import { uiMount } from "~/components/utils/main";
export default {
  name: "ColorRadioGrid",

  model: {
    event: "vmodel",
    prop: "vmodel",
  },
  props: {
    vmodel: {
      type: [String, Number],
      default: undefined,
    },
    items: {
      type: Array,
      default: () => [
        { title: "black", prepend: "#000" },
        { title: "red", prepend: "red" },
        { title: "blue", prepend: "blue" },
        { title: "white", prepend: "#fff" },
      ],
    },
    id: { type: String, default: "" },
  },

  data() {
    return {
      renderedComponents: ["radioGrid"],
    };
  },

  computed: {
    ...uiMount.computed,
  },

  watch: {
    ...uiMount.watch,
  },

  mounted() {
    this.mountSelf();
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: "colorRadioGrid",
          path: "components",
        });
      }
    },
  },

  render(h) {
    return h("radio-grid", {
      props: {
        items: this.items,
        vmodel: this.vmodel,
        id: this.id,
        template: "color",
        label: "color",
      },
      on: {
        vmodel: (e) => {
          this.$emit("vmodel", e);
        },
      },
    });
  },
};
</script>
