<script>
import { Copy, sleep, springPresets } from "~/components/utils/main";
export default {
  name: "Coupon",
  props: {
    code: {
      type: [String, Number],
      default: "PRDCODE",
    },
  },
  data() {
    return {
      showCopied: false,
      copyStatus: "",

      componentMounted: false,
    };
  },
  mounted() {
    this.$store.commit("FETCHED", {
      value: "coupon",
      path: "components",
    });

    this.componentMounted = true;
  },

  render(h) {
    const scoping = { "data-cn": "" };
    const div = (d, c) => h("div", d, c);
    const aside = (d, c) => h("aside", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const span = (d, c) => h("span", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const transition = (d, c) => h("ui-transition", d, c);

    return aside(
      {
        attrs: { ...scoping },
        staticClass: "root",
        class: [{ __readonly: this.showCopied }],
      },
      [
        h2({ attrs: { ...scoping }, staticClass: "title" }, [
          `35% Off`,
          this.componentMounted &&
            transition({
              props: {
                transition: "slide-x",
                type: "spring",
                springConfig: springPresets.default,
              },
              scopedSlots: {
                default: () => {
                  return (
                    this.copyStatus &&
                    div(
                      {
                        attrs: { ...scoping },
                        staticClass: "feedback",
                        class: [this.copyStatus],
                      },
                      `${this.copyStatus}`
                    )
                  );
                },
              },
            }),
        ]),
        div({ attrs: { ...scoping }, staticClass: "description" }, [
          span(`Use code`),
          btn(
            {
              props: {
                simpleButton: true,
                flat: true,
                color: "info",
              },
              attrs: { ...scoping, title: "copy code" },
              staticClass: "code",
              on: {
                click: async () => {
                  await Copy({
                    text: this.code,
                    onSuccess: () => {
                      this.copyStatus = "copied";
                    },
                    onError: () => {
                      this.copyStatus = "error";
                    },
                  });

                  this.$nextTick(() =>
                    requestAnimationFrame(() => (this.showCopied = true))
                  );

                  await sleep.call(
                    this,
                    this.copyStatus == "error" ? 2800 : 1800
                  );

                  this.showCopied = false;

                  await sleep.call(this, 316);
                  this.copyStatus = "";
                },
              },
            },
            this.code
          ),
          span(`at checkout`),
        ]),
      ]
    );
  },
};
</script>

<style>
.root[data-cn] {
  padding: 1rem 1rem 1.5rem;
  background: var(--theme-banner);
  border-radius: 12px;
}

.root[data-cn].__readonly {
  pointer-events: none;
}

.title[data-cn],
.description[data-cn] {
  text-align: center;
}

.title[data-cn] {
  font-weight: 600 !important;
  font-size: 2rem !important;
  margin: 0.5rem 0 0.75rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: var(--t-title);
  overflow: hidden;
}

.feedback[data-cn] {
  font-size: 0.9rem;
  display: inline-block;
  position: absolute;
  right: 0.5rem;
  align-self: flex-start;
  transition: 0.25s opacity, 0.25s transform;
}

.feedback[data-cn].copied {
  color: var(--success);
}

.feedback[data-cn].error {
  color: var(--error);
}

.dark-theme .feedback[data-cn] {
  opacity: var(--t-body);
}

.feedback[data-cn].__hidden {
  opacity: 0;
  transform: translate3d(0.5rem, 0, 0);
}

.description[data-cn] > * {
  font-size: 1.15rem;
}

.description[data-cn] > span {
  opacity: var(--t-caption);
}

.code[data-cn] {
  font-weight: 600;
  font-family: var(--default-font-family);
  letter-spacing: 0.5px;
  padding: 4px 6px;
  margin: 0 2px;
  background-color: transparent;
  opacity: var(--t-title);
}
</style>
