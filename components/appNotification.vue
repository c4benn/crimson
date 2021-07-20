<script>
import Events from "~/components/appNotification/events";
export default {
  name: "AppNotification",

  data() {
    return {
      touchActive: false,

      currentTouchEvent: "",

      touchStartTimeStamp: null,

      transform: undefined,

      mouseY: 0,

      dragDy: 0,

      dy: 0,

      slideDirection: "",

      transitionDuration: 0,

      worker: null,

      springAnimationClassName: "",

      springTimeStamp: null,

      isSpringing: false,

      currentSpring: [],
    };
  },

  computed: {
    rows() {
      return 1;
    },
    showAction() {
      return true;
    },
    stiffness() {
      let maximum = 200;

      if (this.showAction) {
        maximum -= 100;
      }

      if (this.rows == 2) {
        maximum -= 75;
      }

      return maximum;
    },
  },

  // mounted() {
  //   this.worker = this.$store.state.worker;

  //   this.worker.addEventListener("message", (e) => {
  //     if (
  //       e.data.name == "spring" &&
  //       e.data.component == `appNotification_${this._uid}`
  //     ) {
  //       this.currentSpring = e.data.data;

  //       this.springTimeStamp = e.data.timeStamp;

  //       this.transitionDuration = 0;

  //       this.isSpringing = true;

  //       this.$store.commit("UPDATE_", {
  //         name: "styles",
  //         value: [
  //           ...this.$store.state.styles,
  //           {
  //             text: e.data.cssText,
  //             key: this.springTimeStamp,
  //           },
  //         ],
  //       });

  //       requestAnimationFrame(() => {
  //         this.springAnimationClassName = e.data.className;
  //       });
  //     }
  //   });
  // },

  methods: {
    removeCurrentSpringRule() {
      this.$store.commit("UPDATE_", {
        name: "styles",
        value: [...this.$store.state.styles].filter(
          (x) => x.key != this.springTimeStamp
        ),
      });
    },
  },

  render(h) {
    if (!this.touchActive) {
      return null;
    }

    const scoping = { "data-ann": "" };
    const div = (d, c) => h("div", d, c);

    return div({
      attrs: { ...scoping },
      style: {
        "--y": this.transform,
        transition: `${this.transitionDuration}ms transform ease`,
      },
      on: {
        ...Events.call(this),
        animationstart: () => {
          this.transform = "";
        },
        animationcancel: (e) => {
          const duration = (this.currentSpring.frames / 60) * 1000;
          let elapsedTime = e.elapsedTime * 1000 + 60;

          if (elapsedTime > duration) {
            elapsedTime = duration;
          }

          const currentIndex = (elapsedTime / 1000) * 60;

          this.dragDy = this.currentSpring.positions[
            Math.floor(currentIndex)
          ].value;

          this.transform = `${this.dragDy}%`;

          this.springAnimationClassName = "";

          requestAnimationFrame(() => {
            this.removeCurrentSpringRule();
            this.springTimeStamp = null;
            this.isSpringing = false;
          });
        },
        animationend: () => {
          this.transform = "";
          this.dragDy = 0;

          requestAnimationFrame(() => {
            this.removeCurrentSpringRule();

            this.$nextTick(() => {
              this.springTimeStamp = null;

              this.springAnimationClassName = "";

              requestAnimationFrame(() => (this.isSpringing = false));
            });
          });
        },
      },
      staticClass: "root",
      class: [
        {
          "will-change": this.touchActive || this.isSpringing,
          "one-row": this.rows == 1,
          "two-rows": this.rows == 2,
          "show-action": this.showAction,
        },
        !this.touchActive ? this.springAnimationClassName : "",
      ],
    });
  },
};
</script>

<style>
.root[data-ann] {
  position: fixed;
  width: calc(100% - 2rem);
  top: 1rem;
  left: 50%;
  z-index: 19999;
  isolation: isolate;
  display: grid;
  --extra-height: 2rem;
  touch-action: none;
  max-width: 512px;
  border-radius: 0.825rem;
  transform: translateX(-50%) translate3d(0, var(--y, 0), 0);
  box-shadow: 0px 1px 10px -1px rgba(0, 0, 0, 0.3),
    1px 2px 15px 0px rgba(0, 0, 0, 0.051), 1px 2px 20px 1px rgba(0, 0, 0, 0.092);
}

.dark-theme .root[data-ann] {
  background: #636363;
}

.light-theme .root[data-ann] {
  background: #2b2b2b;
}

.root[data-ann].show-action {
  --extra-height: calc(3rem + 42px);
}

.root[data-ann].one-row {
  height: calc(var(--extra-height) + 32px);
}

.root[data-ann].two-rows {
  height: calc(var(--extra-height) + 64px);
}

.root[data-ann].will-change {
  will-change: transform;
}
</style>
