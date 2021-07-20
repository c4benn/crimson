<script>
import Vue from "vue";
import mount from "./mount.js";

export default Vue.extend({
  name: "UiPortal",
  props: {
    removeRoot: Boolean,
    shouldCleanUp: {
      type: Boolean,
      default: true,
    },
    insertPosition: {
      type: String,
      default: "beforeend",
    },
    teleport: {
      type: Boolean,
      default: true,
    },
    to: {
      type: [String],
      default: "#app-overlays",
    },
    wrapper: {
      type: [Object, Boolean],
      default: () => ({
        tag: "ui-transition",
        data: { props: { group: true, transition: "slide-x", fade: true } },
      }),
    },
    lazyTeleport: Boolean,
  },

  data: () => ({
    errorCaught: false,
    target: null,
    removedNode: null,
  }),
  computed: {
    computedWrapper() {
      return this.wrapper;
    },
    limbo() {
      return typeof this.to == "string"
        ? document.querySelector(this.to)
        : typeof this.to == "object" && this.to instanceof HTMLElement
        ? this.to
        : false;
    },
  },

  watch: {
    to() {
      this.refresh();
    },
    teleport() {
      this.$nextTick(() => (this.teleport ? this.mount() : this.cleanup()));
    },
  },

  beforeCreate() {
    setTimeout(() => {
      this.mount();
    });
  },
  mounted() {},
  beforeUpdate() {
    this.update();
  },
  beforeDestroy() {
    this.cleanup();
  },

  methods: {
    mount() {
      mount.call(this, Vue);
    },
    update() {
      const callback = () => {
        if (this.errorCaught || !this.teleport || !this.target) {
          return;
        }
        this.target.newContent = this.$slots.default;
        this.$nextTick(() =>
          this.$emit("content-updated", this.target.newContent)
        );
        this.$emit("content-mounted", this.target.$el, this.target.$vnode);
      };

      // callback();
      callback();
    },
    cleanup() {
      if (!this.shouldCleanUp) {
        return;
      }

      const { target } = this;

      if (this.errorCaught || !target) {
        return;
      }
      target.$destroy();
      const el = target.$el;
      el && el.parentElement && el.parentElement.removeChild(el);
    },
    refresh() {
      if (this.limbo) {
        this.errorCaught = false;
      }
      this.cleanup();
      this.mount();
    },
  },

  render(h) {
    return this.teleport ? h() : this.$slots.default;
  },
});
</script>
