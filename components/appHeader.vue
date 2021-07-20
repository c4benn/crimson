<script>
export default {
  name: "AppHeader",
  computed: {
    headerContent() {
      return this.$store.state.vmodel.headerContent;
    },
  },

  watch: {
    "$route.path"() {
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: "",
      });
    },
  },

  render(h) {
    const header = (d, c) => h("header", d, c);
    // const transition = (d, c) => h("ui-transition", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const icon = (d, c) => h("ui-logo", d, c);

    const content = this?.$store?.state?.vmodel?.headerContent.text || "";

    const showText = this.headerContent.showText;

    return header(
      {
        attrs: { "aria-label": "header", id: "app-header" },
        class: [
          this.headerContent.showBorder
            ? "fill-after __show-border __fill-header"
            : "",
          {
            "remove-blur": !this.headerContent.blurText,
            hidden: !showText,
          },
        ],
        on: {
          "!click": () => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            });
          },
        },
      },
      [
        icon({
          props: {
            tag: "nuxt-link",
            to: "/",
            width: "30px",
            height: "30px",
          },
          attrs: {
            id: "app-logo",
            disabled: this.$c4.overlays.length ? "true" : undefined,
            // title: "Paradice Parade logo",
            // "aria-label":
            //   this.$route.path == "/" ? undefined : "click to go to shop page",
          },
          class: [{ "__show-text": showText, hidden: !showText }],
          on: {
            click: (e) => {
              e.stopPropagation();
            },
          },
        }),
        h1(
          {
            key: content,
            attrs: {
              "aria-label": showText ? content : undefined,
              title: showText ? content : undefined,
              "aria-hidden": showText ? undefined : "true",
            },
            class: [
              "header-text",
              {
                "__show-text": showText,
                hidden: !showText,
              },
            ],
          },
          content
        ),
        // transition({
        //   props: {
        //     transition: "scale(0.975)",
        //     duration: 300,
        //   },
        //   scopedSlots: {
        //     default: () => {
        // const content =
        //   this?.$store?.state?.vmodel?.headerContent.text || "";

        //       return h1(
        //         {
        //           key: content,
        //           attrs: {
        //             "aria-label": showText ? content : undefined,
        //             title: showText ? content : undefined,
        //             "aria-hidden": showText ? undefined : "true",
        //           },
        //           class: [
        //             "header-text",
        //             {
        //               "__show-text": showText,
        //               hidden: !showText,
        //             },
        //           ],
        //         },
        //         content
        //       );
        //     },
        //   },
        // }),
      ]
    );
  },
};
</script>

<style>
#ui-root.hide-header #app-header {
  display: none;
}

#app-header {
  height: calc(var(--header-height) + 1px);
  width: 100%;
  /* transition: 0.3s opacity linear; */
  position: fixed;
  left: 0;
  top: -1px;
  isolation: isolate;
  z-index: 500;
  opacity: 0;
  transition: 0.2s opacity;
  display: grid;
  align-items: center;
}

#back-button {
  position: absolute;
  left: 1rem;
  z-index: 1;
}

#app-logo {
  position: absolute;
  left: 1.75rem;
  z-index: 2;
  color: var(--primary);
  transition: 0.3s opacity ease, 0.3s transform ease;
  transform: translate3d(0, -0.2rem, 0);
}

.is-offline #app-logo {
  color: var(--theme-surface-text);
  opacity: 0.5;
}

#app-logo.__show-text {
  opacity: 0.8;
  transform: translate3d(0, 0, 0);
}

@supports (backdrop-filter: blur(1px)) {
  #app-header {
    background-color: var(--blur-header);
  }

  /* #app-header::before {
    z-index: 1;
    backdrop-filter: blur(3px) saturate(1.85);
    transition: 0.3s opacity;
    opacity: 0;
    height: calc(100% - 1px);
    bottom: 1px;
  } */

  /* .overlay-active:not(.no-overlay) #app-header:not(.remove-blur)::before {
    opacity: 1;
  } */
}

@supports not (backdrop-filter: blur(1px)) {
  #app-header {
    background-color: var(--theme-primary);
  }
}

#app-header::after {
  border-bottom: var(--ui-divide);
  opacity: 0;
  transition: 0.3s opacity;
}

#app-header.__show-border::after {
  opacity: 1;
}

#app-header.__fill-header {
  opacity: 1;
}

/* @media (max-width: 960px) and (orientation: landscape) {
  #app-header {
    visibility: hidden;
  }
} */

.or-la.lt-sm-xs #app-header {
  visibility: hidden;
}

.header-text {
  transition: 0.2s opacity ease, 0.3s transform ease;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  opacity: 0;
  transform: translate3d(0, -0.2rem, 0);
}

.header-text.__show-text {
  opacity: var(--t-body);
  transform: translate3d(0, 0, 0);
}

.overlay-active:not(.no-overlay) .header-text {
  opacity: 0.3;
}

html:not(.overlay-active):not(.no-overlay) #app-header {
  transition: 0s !important;
}

@media (min-width: 961px) {
  .header-text {
    display: none;
  }
}
</style>
