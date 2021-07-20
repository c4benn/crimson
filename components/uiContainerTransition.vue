<script>
import { isHTML, sleep } from "~/components/utils/main";
export default {
  name: "UiContainerTransition",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    vmodel: Boolean,
    config: {
      type: Object,
      default: () => ({
        style: "",
        class: "",
        attrs: {},
        on: {},
        static: true,
        duration: "0",
      }),
    },
    mirrorEl: {
      type: String,
      required: true,
    },
    zIndex: {
      type: [String, Number],
      default: undefined,
    },
  },
  data() {
    return {
      transform: "",
      opacity: "",
      willChange: "",

      manualVModel: false,
      transitionState: "",
      transition: "",
      rootDisplay: "none",
    };
  },
  computed: {
    state() {
      return this.$store.state.containerTransition;
    },
    v_model() {
      const toggle = (value) => {
        this.$emit("vmodel", value);
      };
      const isActive = this.vmodel;
      return {
        isActive,
        open: () => toggle(true),
        close: () => toggle(false),
        toggle: () => toggle(!isActive),
      };
    },
    payload() {
      return {
        ...this.v_model,
        state: this.transitionState,
      };
    },
  },
  watch: {
    vmodel() {
      const mirrorEl = this.$root.$el.querySelector(this.mirrorEl);
      if (!isHTML(this.$refs.content) || !isHTML(mirrorEl)) {
        this.manualVModel = false;
        this.transitionState = "";
        this.rootDisplay = "none";
        this.transform = "";
        this.willChange = "";
        return;
      }
      if (this.vmodel) {
        requestAnimationFrame(() => {
          this.rootDisplay = undefined;
          this.manualVModel = false;
          this.transition = "0s";
          this.opacity = "";

          requestAnimationFrame(() => {
            this.transitionState = "beforeEnter";
            const contentBound = this.$refs.content.getBoundingClientRect();
            const mirrorElBound = mirrorEl.getBoundingClientRect();
            const toHeight = contentBound.height;
            const fromHeight = mirrorElBound.height;
            const toWidth = contentBound.width;
            const fromWidth = mirrorElBound.width;

            this.$nextTick(() => {
              this.transform = `scale3d(${fromWidth / toWidth},${
                fromHeight / toHeight
              },1)`;

              this.willChange = "transform";

              requestAnimationFrame(async () => {
                this.transitionState = "enter";

                await sleep.call(this, 90);
                this.transition = "";

                this.manualVModel = true;

                await sleep.call(this, parseFloat(this.config.duration));

                this.transitionState = "afterEnter";
                this.willChange = "";
              });
            });
          });
        });
      } else {
        requestAnimationFrame(() => {
          this.transitionState = "beforeLeave";
          requestAnimationFrame(() => {
            this.opacity = "";
            const contentBound = this.$refs.content.getBoundingClientRect();
            const mirrorElBound = mirrorEl.getBoundingClientRect();
            const toHeight = contentBound.height;
            const fromHeight = mirrorElBound.height;
            const toWidth = contentBound.width;
            const fromWidth = mirrorElBound.width;

            this.$nextTick(() => {
              this.transform = `scale3d(${fromWidth / toWidth},${
                fromHeight / toHeight
              },1)`;

              this.willChange = "transform";

              requestAnimationFrame(async () => {
                this.transitionState = "leave";

                await sleep.call(this, parseFloat(this.config.duration));

                this.willChange = "opacity";

                await sleep.call(this, 16);

                this.opacity = "0";

                await sleep.call(this, parseFloat(this.config.duration));

                this.manualVModel = false;
                this.transitionState = "afterLeave";
                this.rootDisplay = "none";
                this.transform = "";
                this.willChange = "";
              });
            });
          });
        });
      }
    },
    manualVModel() {
      if (this.manualVModel) {
        this.transform = "scale3d(1,1,1)";
        this.transform = "";
      }
    },
    transitionState(n) {
      if (n) {
        this.$emit(n);
      }
    },
  },
  render(h) {
    const scoping = { "data-uictn": "" };
    const div = (d, c) => h("div", d, c);

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root",
        style: {
          zIndex: this.zIndex,
          display: this.rootDisplay,
        },
        on: {
          click: (e) => {
            this.$emit("click", e);
            e.stopPropagation();
          },
          mousedown: (e) => {
            this.$emit("mousedown", e);
            e.stopPropagation();
          },
          touchstart: (e) => {
            this.$emit("touchstart", e);
            e.stopPropagation();
          },
        },
      },
      [
        div(
          {
            ref: "content",
            attrs: { ...this.config.attrs },
            staticClass: "content",
            class: [this.config.class],
            style: `will-change:${this.willChange};${
              !this.manualVModel ? "visibility:hidden;" : ""
            }transform:${this.transform};transition:${
              this.transition
            };opacity:${this.opacity};${this.config.style}`,
            on: { ...this.config.on },
          },
          this.$scopedSlots?.default?.(this.payload)
        ),
      ]
    );
  },
};

/***
 * div({
      attrs: { ...scoping },
      staticClass: "root",
      style: `visibility:${this.vmodel.isActive ? "" : "hidden"};transform:${
        this.transform
      };opacity:${this.opacity};transition:${
        this.vmodel.isActive ? "" : "0s!important"
      };${this.state.style}`,
      on: {
        click: async () => {
          this.transform = this.fromTransform;
          await sleep.call(this, 356);

          this.opacity = "0";

          await sleep.call(this, 216);

          this.$store.commit("CONTAINER", {
            value: false,
            path: "active",
          });
        },
      },
    })
 *
 * **/
</script>

<style>
.root[data-uictn] {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -100;
  width: 100%;
  height: 100%;
}
</style>
