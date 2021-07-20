<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "LoadingBar",
  data() {
    return {
      transform: -0,
      elapsedTime: 0,
      hideLoader: false,
      addAnimation: false,
      renderBar: false,
      background: undefined,
    };
  },

  watch: {
    background(n) {
      this.$store.commit("UPDATE_", {
        path: "loadingBarColor",
        value: n,
      });
    },
    async "$route.path"() {
      this.background = undefined;

      if (this.$fetched.pages.includes(this.$route.fullPath)) {
        return;
      }

      this.renderBar = false;
      this.$store.commit("V_MODEL", {
        path: "loadingBar",
        value: true,
      });
      await sleep.call(this, 16);
      this.renderBar = true;
      this.hideLoader = false;
      this.addAnimation = false;
      this.transform = -10;
      this.elapsedTime = 0;
      this.startLoading();
    },
    "$store.state.vmodel.loadingBar"() {
      if (this.$store.state.vmodel.loadingBar) {
        this.renderBar = true;
        this.hideLoader = false;
        this.addAnimation = false;
        this.transform = -10;
        this.elapsedTime = 0;
        this.startLoading();
      } else {
        this.stopLoading();
      }
    },
  },
  methods: {
    async startLoading() {
      this.background = "";
      if (!this.$store.state.vmodel.loadingBar) {
        return;
      }
      if (this.transform <= 85) {
        this.transform += 4;

        await sleep.call(this, this.elapsedTime * 10);
        this.elapsedTime += 5;
        requestAnimationFrame(this.startLoading);
      } else {
        this.background = "var(--warning)";

        await sleep.call(this, 350, true);

        this.addAnimation = true;
        await sleep.call(this, 15000, true);

        if (!this.addAnimation) {
          return;
        }

        this.background = "var(--error)";

        await sleep.call(this, 350, true);

        this.stopLoading();

        await sleep.call(this, 100);

        this.$nuxt.error({
          message: "Opps! This page took too long to respond",
          statusCode: 504,
        });

        this.$nextTick(() =>
          this.$store.commit("UPDATE_", {
            path: "showPageLoading",
            value: false,
          })
        );
      }
    },
    async stopLoading() {
      this.addAnimation = false;
      await sleep.call(this, 16, true);
      this.elapsedTime = 100;
      this.transform = 100;
      await sleep.call(this, 450);
      this.hideLoader = true;
      await sleep.call(this, 220);

      this.transform = 0;
      this.elapsedTime = 0;
      this.renderBar = false;
      this.background = "";
    },
  },
  render(h) {
    const div = (d, c) => h("div", d, c);

    return div({
      key: this.$route.path,
      attrs: {
        "data-lbr": "",
        role: this.renderBar ? "presentation" : undefined,
        "aria-hidden": !this.renderBar ? "true" : undefined,
      },
      staticClass: "root",
      class: [
        {
          __animate: this.addAnimation,
          __hidden: !this.renderBar,
          "will-change": this.renderBar && !this.addAnimation,
          "opacity-0": this.hideLoader,
        },
      ],
      style: {
        "--x": `${this.transform - 100}%`,
        "--background": this.background ? this.background : undefined,
        "--color-duration":
          this.background == "var(--error)" ? "0.5s" : undefined,
      },
    });
  },
};
</script>

<style>
.root[data-lbr] {
  --color-duration: 1.5s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.1875rem;
  background: var(--background, currentColor);
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  pointer-events: none;
  transition: transform 0.2s linear, opacity 0.2s,
    background-color var(--color-duration) linear;
  overflow: hidden;
  z-index: 20000;
  isolation: isolate;
  --x: -100%;
  transform: translate3d(var(--x), 0, 0);
  opacity: 0.9;
}

.root[data-lbr].__hidden {
  display: none;
  transition: 0s;
}

.root[data-lbr].will-change {
  will-change: transform, opacity;
}

.root[data-lbr].opacity-0 {
  opacity: 0;
}

@keyframes animating-loading-bar {
  from {
    transform: translateX(-225%) translateZ(0);
  }
  to {
    transform: translateX(125%) translateZ(0);
  }
}

.root[data-lbr].__animate::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: translateX(-225%) translateZ(0);
  background-image: linear-gradient(
    90deg,
    rgba(200, 200, 200, 0),
    rgba(255, 255, 255, 0.75),
    rgba(200, 200, 200, 0)
  );
  animation: animating-loading-bar 2s infinite cubic-bezier(0, 0.55, 0.45, 1)
    calc(var(--color-duration) * 0.5);
}
</style>
