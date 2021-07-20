<script>
import { uiMount } from "~/components/utils/main";

export default {
  name: "SizeRadioGrid",

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
        { title: "SM", prepend: "Chest 38 inches" },
        { title: "MD", prepend: "Chest 48 inches" },
        { title: "LG", prepend: "Chest 58 inches" },
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
          value: "sizeRadioGrid",
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
        template: "size",
        label: "size",
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
