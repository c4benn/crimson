<script>
import { sleep } from "~/components/utils/main";

export default {
  name: "ShopBanner",
  data() {
    return {
      componentMounted: false,
      bannerIndex: null,
      bannerText: [
        {
          header: "Paradice Parade",
          text: "Home of quality, luxurious, and contemporary apparels.",
        },
        {
          header: "Worldwide shipping",
          text:
            "Paradice Parade offers premium worldwide shipping to registered customers.",
        },
        {
          header: "Local delivery",
          text:
            "Paradice Parade offers premium delivery to anywhere in Nigeria.<br/>Payment on delivery is available to residents in Lagos only.",
        },
        {
          text: `Subscribe to our <span class='underline-text'>newsletter</span> to stay up to date with our latest campaigns, playlist and many more.`,
          callback: () => {},
        },
      ],
      bannerTransitionState: "",
    };
  },

  computed: {
    storeBannerIndex() {
      return this.$store.state.vmodel.activeBannerIndex;
    },
    activeBannerIndex() {
      return this.bannerIndex;
    },
    bannerIndexDelay() {
      return this.activeBannerIndex == 0 ? 5500 : 5000;
    },
  },

  watch: {
    async storeBannerIndex() {
      if (this.componentMounted) {
        const key = this.componentMounted;

        this.bannerTransitionState = "beforeLeave";

        await sleep.call(this, 16);

        this.bannerTransitionState = "leave";

        await sleep.call(this, 400);

        if (!this.componentMounted == key) {
          return;
        }

        this.bannerTransitionState = "afterLeave";

        this.bannerIndex = this.storeBannerIndex;

        await sleep.call(this, 400);

        await sleep.call(this, 1);

        this.bannerTransitionState = "beforeEnter";

        await sleep.call(this, 16);

        this.bannerTransitionState = "enter";

        await sleep.call(this, 550);

        if (!this.componentMounted == key) {
          return;
        }

        this.bannerTransitionState = "afterEnter";

        await sleep.call(this, 1);

        this.bannerTransitionState = "";

        if (!this.componentMounted == key) {
          return;
        }

        await sleep.call(this, this.bannerIndexDelay, true);

        if (!this.componentMounted == key) {
          return;
        }

        this.updateBannerIndex();
      }
    },
  },

  mounted() {
    this.componentMounted = performance.now();

    this.$store.commit("FETCHED", {
      value: "shopBanner",
      path: "components",
    });

    this.$nextTick(async () => {
      this.updateBannerIndex(0);
      this.bannerIndex = 0;

      await sleep.call(this, 4000, true);
      this.bannerIndex = 0;
      this.updateBannerIndex();
    });
  },

  beforeDestroy() {
    this.updateBannerIndex(0);

    this.componentMounted = false;
    this.bannerIndex = 0;
  },

  methods: {
    updateBannerIndex(count) {
      if (!this.componentMounted) {
        return;
      }
      let value = count;
      if (typeof value == "undefined") {
        value = this.activeBannerIndex == 3 ? 0 : this.activeBannerIndex + 1;
      }
      this.$store.commit("V_MODEL", {
        path: "activeBannerIndex",
        value,
      });
    },
  },

  render(h) {
    const scoping = { "data-sbr": "" };
    const aside = (d, c) => h("aside", d, c);
    const intersection = (d) => h("ui-intersection", d);
    const p = (d, c) => h("p", d, c);
    const div = (d, c) => h("div", d, c);

    const activeBannerIndex = this.bannerIndex || 0;
    const activeBannerText =
      typeof activeBannerIndex == "number"
        ? this.bannerText[activeBannerIndex]
        : [];

    return intersection({
      props: {
        config: {
          rootMargin: `-${this.$store.state.barsHeight.appBar} 0px 0px`,
        },
      },
      scopedSlots: {
        default: (payload) => {
          const hasCallback = !!activeBannerText.callback;
          return aside(
            {
              attrs: { ...scoping },
              class: [
                "root fill-before rounded-right",
                { "not-intersecting": !payload.isIntersecting },
              ],
            },
            [
              activeBannerText.text
                ? div(
                    {
                      attrs: { ...scoping },
                      staticClass: "content",
                      class: [
                        {
                          "fill-before": hasCallback,
                          "no-header": !activeBannerText.header,
                        },
                      ],
                      style: {
                        zIndex:
                          payload.isIntersecting && this.bannerTransitionState
                            ? "400"
                            : undefined,
                        display:
                          !payload.isIntersecting && this.componentMounted
                            ? "none"
                            : undefined,
                        opacity: payload.isIntersecting
                          ? /^leave|afterleave|beforeenter/i.test(
                              this.bannerTransitionState
                            )
                            ? "0"
                            : /^enter/i.test(this.bannerTransitionState)
                            ? "1"
                            : undefined
                          : undefined,
                        transform: payload.isIntersecting
                          ? /beforeenter/i.test(this.bannerTransitionState)
                            ? `translate3d(0,24px,0)`
                            : /^enter/i.test(this.bannerTransitionState)
                            ? `translate3d(0,0,0)`
                            : undefined
                          : undefined,
                        transition:
                          /^before/i.test(this.bannerTransitionState) ||
                          !payload.isIntersecting
                            ? "0s"
                            : /leave/i.test(this.bannerTransitionState)
                            ? "400ms"
                            : /enter/i.test(this.bannerTransitionState)
                            ? "550ms"
                            : undefined,
                        willChange: payload.isIntersecting
                          ? this.bannerTransitionState
                            ? "opacity, transform"
                            : undefined
                          : undefined,
                      },
                    },
                    [
                      p(
                        {
                          attrs: { ...scoping },
                          class: "header",
                        },
                        `${activeBannerText.header || ""}`
                      ),
                      activeBannerText.text
                        ? p({
                            attrs: { ...scoping },
                            class: ["description line-clamp-2"],
                            on: hasCallback
                              ? {
                                  click: activeBannerText.callback,
                                }
                              : undefined,
                            domProps: {
                              innerHTML: `${activeBannerText.text}`,
                            },
                          })
                        : null,
                    ]
                  )
                : null,
            ]
          );
        },
      },
    });
  },
};
</script>

<style>
.root[data-sbr] {
  overflow: hidden;
  padding: calc(0.5rem - 1px) 0;
  position: relative;
  margin: 1rem 0.75rem 0 0;
  --alert-color: var(--info);
  border-left: 0.5rem solid var(--alert-color);
}

.root[data-sbr]:empty,
.root[data-sbr].not-intersecting {
  min-height: calc(60px + 1rem - 2px);
  padding: 0;
}

.content[data-sbr] {
  z-index: 99;
  position: relative;
  isolation: isolate;
  padding: 4px 0.75rem;
  margin: 0 0.5rem;
  height: 60px;
  backface-visibility: hidden;
  transition-timing-function: var(--circOut) !important;
}

.content[data-sbr].fill-before {
  border-radius: 6px;
}

.content[data-sbr].fill-before::before {
  opacity: 0;
  transition: 0.3s opacity;
  background-color: currentColor;
}

.content[data-sbr].fill-before:active::before {
  opacity: 0.3;
}

.content[data-sbr].fill-before > * {
  transition: 0.2s transform;
}

.content[data-sbr].fill-before:active > * {
  transition: 0.5s transform;
  transform: scale3d(0.975, 0.975, 1);
}

.root[data-sbr]::before {
  background-color: var(--alert-color);
  opacity: 0.25;
}

.header[data-sbr] {
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.95rem;
  opacity: var(--t-title);
}

.description[data-sbr] {
  font-size: 0.85rem;
  opacity: var(--t-body);
}

.no-header[data-sbr] {
  cursor: pointer;
}

.no-header[data-sbr] {
  opacity: var(--t-title);
}

.description[data-sbr] .secondary-text:active {
  text-decoration: underline;
}
</style>
