<script>
import { sleep } from "~/components/utils/main";

export default {
  data() {
    return {
      componentMounted: true,
      addWillChange: false,
    };
  },
  render(h) {
    if (!this.$store.state.rootBanner.render) {
      return null;
    }

    const scoping = { "data-rbr": "" };
    const aside = (d, c) => h("aside", d, c);
    const p = (d, c) => h("p", d, c);
    const strong = (d, c) => h("strong", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const clearBtn = (d) => h("clear-btn", d);
    const intersection = (d, c) => h("ui-intersection", d, c);

    return intersection({
      scopedSlots: {
        default: (payload) => {
          this.$store.commit("ROOT_BANNER", {
            path: "intersecting",
            value: payload.isIntersecting,
          });
          return aside(
            {
              attrs: { ...scoping },
              staticClass: "root fill-before",
              style: {
                zIndex: payload.isIntersecting ? "9999" : undefined,
                opacity: this.componentMounted ? undefined : "0",
                transform: this.componentMounted
                  ? undefined
                  : "translate3d(-75%,0,0)",
                willChange: this.addWillChange
                  ? "transform, opacity"
                  : undefined,
              },
            },
            [
              clearBtn({
                props: {
                  text: "Close",
                  root: "#ui-root",
                },
                staticClass: "close-btn",
                on: {
                  "ui-cleared": async () => {
                    this.addWillChange = true;
                    await sleep.call(this, 16);

                    this.componentMounted = false;
                    await sleep.call(this, 382);
                    this.$nextTick(() =>
                      requestAnimationFrame(() => {
                        this.$store.commit("ROOT_BANNER", {
                          path: "render",
                          value: false,
                        });
                      })
                    );
                  },
                },
              }),
              p(
                {
                  attrs: { ...scoping },
                  staticClass: "title gradient-text",
                },
                ["Black Friday!"]
              ),

              p(
                {
                  attrs: { ...scoping },
                  class: "description",
                },
                [
                  "Seize this opportunity as items go on sale for as much as ",
                  strong("50%"),
                  "! 🔥",
                ]
              ),

              btn(
                {
                  props: {
                    raise: false,
                    size: "sm",
                    case: "initial",
                    background: "primary",
                  },
                  staticClass: "action-btn",
                },
                ["View items"]
              ),
            ]
          );
        },
      },
    });
  },
};
</script>

<style>
.root[data-rbr] {
  position: relative;
  z-index: -100;
  display: grid;
  font-family: var(--font-family-monospace);
  padding: 1.5rem 0 0.75rem;
  grid-template-rows: 38px auto auto;
  row-gap: 8px;
  justify-items: center;
  background-color: var(--theme-primary);
  transition: 0.35s opacity, 0.35s transform;
  transition-timing-function: var(--quintOut);
}

.root[data-rbr]::before {
  border-bottom: var(--ui-divide);
}

.root[data-rbr] .ui-btn {
  box-shadow: var(--raise-light-1);
}

.root[data-rbr] .close-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.75rem 1rem;
  background-color: var(--error);
  color: var(--theme-surface);
  box-shadow: none;
}

.root[data-rbr] .close-btn *[class*="icon"] {
  opacity: 1;
}

.title[data-rbr] {
  font-size: 1.825rem;
  font-weight: 700;
  justify-self: center;
}

@media (prefers-color-scheme: light) {
  #ui-root:not(.light-theme):not(.dark-theme) .title[data-rbr] {
    background-image: linear-gradient(to top, #d3012b 50%, #d6d602);
  }
}

@media (prefers-color-scheme: dark) {
  #ui-root:not(.light-theme):not(.dark-theme) .title[data-rbr] {
    background-image: linear-gradient(to top, #d3012b 20%, #d6d602);
  }
}

.dark-theme .title[data-rbr] {
  background-image: linear-gradient(to top, #d3012b 20%, #d6d602);
}

.light-theme .title[data-rbr] {
  background-image: linear-gradient(to top, #d3012b 50%, #d6d602);
}

.description[data-rbr] {
  padding: 0 2rem;
  justify-self: center;
  text-align: center;
  opacity: var(--t-body);
}
</style>
