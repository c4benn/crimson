<script>
export default {
  name: "AppFooter",
  data() {
    return {
      intersection: { entries: {} },
    };
  },
  // watch: {
  //   intersection() {
  //     const value = { ...this.intersection };
  //     this.$store.commit("UPDATE_", {
  //       name: "footerIntersection",
  //       value: {
  //         isIntersecting: value.isIntersecting,
  //         height: value.isIntersecting
  //           ? value?.entries?.intersectionRect?.height || 0
  //           : 0,
  //       },
  //     });
  //   },
  // },
  render(h) {
    const scoping = { "data-afr": "" };
    const footer = (d, c) => h("footer", d, c);
    const div = (d, c) => h("div", d, c);
    const p = (d, c) => h("p", d, c);
    const a = (d, c) => h("a", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    // const intersection = (d, c) => h("ui-intersection", d, c);
    // const intersectionLength = 200;

    const scroll = () =>
      requestAnimationFrame(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });

    return footer(
      {
        attrs: { ...scoping, "aria-label": "footer" },
        staticClass: "root fill-before",
      },
      [
        // !/\/bag/i.test(this.$route.path)
        //   ? intersection({
        //       props: {
        //         config: {
        //           threshold: Array.from(
        //             { length: intersectionLength },
        //             (_, i) => i * (1 / intersectionLength)
        //           ),
        //         },
        //       },
        //       scopedSlots: {
        //         default: (payload) => {
        //           this.intersection = payload;
        //           return div({
        //             attrs: { ...scoping },
        //             staticClass: "observer",
        //           });
        //         },
        //       },
        //     })
        //   : null,
        btn(
          {
            attrs: {
              ...scoping,
              title: "scroll to top",
            },
            props: {
              size: "lg",
              background: this.$theme.light ? "primary" : undefined,
              shape: "circle",
              flat: true,
              outlined: this.$theme.dark,
              simpleButton: true,
              persistent: true,
            },
            staticClass: "scroll-to-top",
            on: {
              "&mousedown": scroll,
              "&click": scroll,
            },
          },
          [
            icon({
              props: { size: 28, name: "chevronDoubleUp" },
              staticClass: "icon",
            }),
          ]
        ),
        div(
          {
            attrs: { ...scoping },
            staticClass: "last-row",
          },
          [
            div({ attrs: { ...scoping }, staticClass: "icons8-wrapper" }, [
              p(
                { attrs: { ...scoping }, staticClass: "link-text" },
                `All vector illustrations are from the awesome `
              ),
              a(
                {
                  attrs: {
                    ...scoping,
                    href: "https://icons8.com/illustrations",
                    target: "_blank",
                    title: "visit Icons8",
                    rel: "noopener",
                  },
                  staticClass: "ext-link",
                },
                "Icons8"
              ),
            ]),
            div(
              {
                attrs: { ...scoping },
                staticClass: "copyright-wrapper",
              },
              [
                h("ui-logo", { attrs: { ...scoping }, staticClass: "logo" }),

                p(
                  {
                    attrs: {
                      ...scoping,
                    },
                    staticClass: "copyright",
                  },
                  [
                    `Copyright © ${new Date().getFullYear()} Paradice Parade • All rights reserved.`,
                  ]
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-afr] {
  background-color: var(--theme-banner);
  margin-bottom: var(--nav-bar-height);
  position: relative;
  isolation: isolate;
  display: grid;
  padding: 1.5rem 1rem 3rem;
  row-gap: 0.75rem;
}

.observer[data-afr] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}

/* .root[data-afr]::before {
  border-top: var(--ui-divide);
} */

.link-text[data-afr] {
  opacity: var(--t-caption);
  margin-right: 0.35rem;
  font-size: 0.9rem;
}

.ext-link[data-afr] {
  font-size: 0.9rem;
  opacity: var(--t-body);
  color: var(--external-link) !important;
}

.last-row[data-afr] {
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  margin-top: 2rem;
  row-gap: 2rem;
  justify-items: center;
}

.icons8-wrapper[data-afr] {
  display: flex;
}

.copyright-wrapper[data-afr] {
  display: grid;
  justify-items: center;
  row-gap: 0.5rem;
}

.logo[data-afr] {
  opacity: var(--t-subtitle);
  margin-left: 8px;
}

.copyright[data-afr] {
  opacity: var(--t-disabled);
  font-size: 0.8rem;
}

.light-theme .copyright[data-afr] {
  --t-disabled: 0.7;
}

.scroll-to-top[data-afr] {
  --btn__size-lg: 64px;
  justify-self: flex-end;
  position: absolute;
  top: -32px;
  right: 1rem;
}

.scroll-to-top[data-afr] .outline {
  color: var(--divide-color) !important;
  opacity: var(--t-disabled);
  transform: none !important;
}

.scroll-to-top[data-afr] span {
  opacity: 1;
}

.scroll-to-top[data-afr] .__default-slot {
  overflow: visible;
}

.dark-theme .scroll-to-top[data-afr] {
  background-color: var(--theme-primary);
  color: var(--primary);
}

.scroll-to-top[data-afr] .icon {
  transition: 0.3s transform;
}

.scroll-to-top[data-afr].Active .icon {
  transform: translate3d(0, -50%, 0);
}
</style>
