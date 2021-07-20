<script>
import { mediaListener } from "~/components/utils/main";
export default {
  name: "Breakpoints",

  data() {
    return {
      input: {
        is: "",
        allowed: "",
        orientation: "",
      },
    };
  },

  computed: {
    queries() {
      return [
        "<xl>(min-width: 1920px)",
        "<lg>(min-width: 1280px) and (max-width: 1919px)",
        "<md>(min-width: 960px) and (max-width: 1279px)",
        "<sm>(min-width: 600px) and (max-width: 959px)",
        "<xs>(min-width: 0px) and (max-width: 599px)",
        "<orientation>(orientation: landscape)",
      ];
    },
    output() {
      const input = this.input;
      const is = input.is;

      const p = "phone";
      const s = "small";
      const po = "portrait";
      const l = "landscape";
      const la = "large";
      const i = "ipad";
      const t = "tablet";
      const ip = "ipad-pro";
      const m = "mini-laptop";
      const L = "laptop";

      let matches = [p, `${s}-${p}`, `${po}-${p}`];

      if (is == "sm") {
        matches = [`${l}-${p}`, `${la}-${p}`, i, t, `${i}-${po}`, `${t}-${po}`];
      }

      if (is == "md") {
        matches = [ip, `${ip}-${po}`, `${t}-${l}`, `${i}-${l}`, m];
      }

      if (is == "lg") {
        matches = [L, `${ip}-${l}`];
      }

      if (is == "xl") {
        matches = ["4k"];
      }

      return {
        orientationAlias: this.input.orientation.slice(0, 2),
        matches,
        ...input,
      };
    },
  },

  mounted() {
    this.queries.forEach((x, i) => {
      const regExp = /^<.+>/g;
      const mediaQuery = window.matchMedia(x.replace(regExp, ""));
      const matches = mediaQuery.matches;
      const name = this.getMediaName(x);

      const allowed = matches ? this.getAllowed(i) : null;

      this.updateMediaListener({
        matches,
        name,
        allowed,
      });

      mediaListener({
        media: mediaQuery,
        event: "change",
        callback: (e) => {
          this.updateMediaListener({
            matches: e.matches,
            index: i,
            name,
          });
        },
      });
    });
  },

  methods: {
    // update(e) {
    //   const el = this.$refs.el;
    //   this.input = {
    //     width: el.clientWidth,
    //     height: el.clientHeight,
    //     orientation: el.offsetLeft ? "landscape" : "portrait",
    //   };

    //   const value = { ...this.output };

    //   this.$store.commit("UPDATE_", {
    //     path: "breakpoints",
    //     value,
    //   });

    //   console.log(e);
    // },

    getMediaName(val) {
      const regExp = /^<.+>/g;
      return val.match?.(regExp)?.[0]?.replace?.(/<|>/g, "");
    },

    getAllowed(index) {
      return this.queries
        .filter((_, id, arr) => id >= index && id < arr.length - 1)
        .map((x) => this.getMediaName(x))
        .reverse()
        .join("-");
    },

    updateMediaListener(e) {
      const name = e.name;
      const index = e.index;
      const isOrientation = /orientation/.test(name);
      const matches = e.matches;
      const data = isOrientation ? (matches ? "landscape" : "portrait") : name;

      const update = () => {
        if (isOrientation) {
          this.input.orientation = data;
        } else {
          this.input.is = data;

          const allowed = e.allowed
            ? e.allowed
            : matches
            ? this.getAllowed(index)
            : null;

          this.input.allowed = allowed;
        }

        const value = { ...this.output };

        this.$store.commit("UPDATE_", {
          path: "breakpoints",
          value,
        });
      };

      if (isOrientation) {
        update();
      } else if (e.matches) {
        update();
      }
    },
  },

  render(h) {
    const scoping = { "data-bs": "" };
    const div = (d) => h("div", d);

    return div({
      ref: "el",
      attrs: {
        ...scoping,
        "aria-hidden": "true",
      },
      // on: {
      //   transitionend: () => {
      //     this.update();
      //   },
      // },
      staticClass: "root",
    });
  },
};
</script>

<style>
.root[data-bs] {
  height: 100%;
  width: 100%;
  z-index: -1;
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  overflow: hidden;
  opacity: 0;
  transition: 1ms opacity 0s;
  display: block;
}

@media (orientation: landscape) {
  .root[data-bs] {
    left: 10px;
    opacity: 0.1;
  }
}

/* small breakpoint */
@media (min-width: 600px) and (max-width: 959px) {
  .root[data-bs] {
    opacity: 0.2;
  }
}

/* medium breakpoint */
@media (min-width: 960px) and (max-width: 1279px) {
  .root[data-bs] {
    opacity: 0.3;
  }
}

/* large breakpoint */
@media (min-width: 1280px) and (max-width: 1919px) {
  .root[data-bs] {
    opacity: 0.4;
  }
}

/* xtra-large breakpoint */
@media (min-width: 1920px) {
  .root[data-bs] {
    opacity: 0.5;
  }
}
</style>
