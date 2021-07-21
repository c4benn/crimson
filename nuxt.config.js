/* eslint-disable promise/param-names */

const iconSizes = [
  32,
  64,
  72,
  96,
  120,
  128,
  144,
  152,
  192,
  "192",
  256,
  384,
  512,
  "512",
];

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  router: {
    base: "/prd",
    middleware: "pageTransition",
  },

  server: {
    port: 8000, // default: 3000
    host: "0.0.0.0", // default: localhost
  }, // other configs

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Paradice Parade online clothing store",
    meta: [
      { hid: "charset", charset: "utf-8" },
      {
        hid: "viewport",
        name: "viewport",
        content: "width = device-width, initial-scale = 1",
      },
      {
        hid: "description",
        name: "description",
        content: "Shop for high end luxury clothes",
      },
      {
        hid: "keywords",
        name: "keywords",
        content:
          "prd, paradice, paradice parade, clothing store, fashion, clothing app, clothes store, clothes, apparel, apparels, luxury, luxury clothes, luxury apparel, online shop nigeria, online shop, clothes nigeria, nigeria, shop clothes",
      },
      {
        hid: "apple-mobile-web-app-status-bar-style",
        name: "apple-mobile-web-app-status-bar-style",
        content: "black",
      },
      {
        hid: "application-name",
        name: "application-name",
        content: "PRD",
      },
      {
        hid: "supported-color-schemes",
        name: "supported-color-schemes",
        content: "light dark",
      },
      // ...appMetaName,
    ],
    link: [
      // {
      //   rel: "manifest",
      //   hid: "manifest",
      //   href: "app.webmanifest",
      // },
      // {
      //   hid: "shortcut-icon",
      //   rel: "shortcut icon",
      //   href: "/logo/app-logo-64.png",
      // },
      // {
      //   hid: "apple-touch-icon",
      //   rel: "apple-touch-icon",
      //   href: "/logo/app-logo-512.png",
      //   sizes: "512x512",
      // },
      // {
      //   rel: "icon",
      //   type: "image/png",
      //   href: "/logo/app-logo-32.png",
      //   uid: "favicon",
      // },
    ],
    // script: [
    //   {
    //     src:
    //       "https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver",
    //     body: true,
    //   },
    // ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/static/main.css", "~/static/spring.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: false,

  components: ["~/components/transition", "~/components/"],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    "@nuxtjs/pwa",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    // manifest: {
    //   lang: "en",
    // },
    icon: {
      sizes: iconSizes.map((x) => parseFloat(x)),
      // purpose: iconSizes.map((x) =>
      //   typeof x == "string" ? "maskable" : "any"
      // ),
    },
    // icon: false,

    manifest: {
      useWebmanifestExtension: true,
      name: "PRD Clothes Store",
      short_name: "PRD",
      start_url: "/?mode=pwa",
      display: "standalone",
      background_color: "#000",
      theme_color: "#e30303",
      description: "Shop quality, luxurious apparels",
      lang: "en",
      dir: "ltr",
      // icons: ["32", "64", "144", "512"].map((size) => ({
      //   src: `/logo/app-logo-${size}.png`,
      //   sizes:
      //     size == "512"
      //       ? "72x72 96x96 120x120 128x128 152x152 192x192 256x256 384x384"
      //       : `${size}x${size}`,
      //   type: "image/png",
      // })),
      orientation: "portrait",
      categories: [
        "clothes",
        "fashion",
        "shop",
        "luxurious",
        "brand",
        "trending",
        "apparel",
        "high fashion",
        "style",
        "threads",
      ],
      // prefer_related_applications: true,
      // related_applications: [
      //   {
      //     platform: "webapp",
      //     url: "http://172.20.10.2:8000",
      //     id: "com.example.app1",
      //   },
      // ],
    },

    meta: {
      mobileAppIOS: true,
    },

    // workbox: {
    //   enabled: true,
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  loading: false,

  pageTransition: {
    name: "page-transition",

    beforeEnter() {
      this?.$store?.commit("UPDATE_", {
        path: "pageTransitionState",
        value: "beforeEnter",
      });
    },

    enter() {
      this?.$store?.commit("UPDATE_", {
        path: "pageTransitionState",
        value: "enter",
      });

      // !this.$store.state.scrollPosition.y &&
      requestAnimationFrame(async () => {
        await this.$store.state.sleep(70);

        // const $scroll = this.$store.state.routed_with_back_or_forward_button
        //   ? this.$store.state.trackRoutes[
        //       this.$route.name.replace(/^index$/, "shop").toLowerCase()
        //     ].scrollPosition
        //   : this.$store.state.scrollPosition;

        const $scroll = this.$store.state.scrollPosition;

        window.scrollTo($scroll.x, $scroll.y);
      });
    },

    afterEnter() {
      if (this.$store) {
        // this.$store.state.scrollPosition.y &&
        //   document.documentElement.scrollTo(
        //     0,
        //     this.$store.state.scrollPosition.y
        //   )

        this.$nextTick(async () => {
          function nextFrame() {
            return new Promise((r) =>
              requestAnimationFrame(() => {
                r(true);
              })
            );
          }

          await nextFrame();

          this.$store.commit("UPDATE_", {
            path: "pageTransitionState",
            value: "afterEnter",
          });

          this.$store.commit("UPDATE_", {
            path: "hideXOverflow",
            value: false,
          });

          if (this.$store.state.loadedComponents[this.$route.path]) {
            this.$store.commit("V_MODEL", {
              path: "loadingBar",
              value: false,
            });
          }
        });

        // if (process.client) {
        //   const html = document.documentElement;

        //   html.classList.remove(
        //     // "hide-scrollbar",
        //     // "page-changing",
        //     "will-change-scroll"
        //   );
        // }
      }
    },

    beforeLeave() {
      this?.$store?.commit("UPDATE_", {
        path: "pageTransitionState",
        value: "beforeLeave",
      });

      // if (process.client) {
      //   const html = document.documentElement;

      //   html.classList.add(
      //     // "hide-scrollbar",
      //     // "page-changing",
      //     "will-change-scroll"
      //   );
      // }
    },

    afterLeave() {
      this?.$store?.commit("UPDATE_", {
        path: "pageTransitionState",
        value: "afterLeave",
      });
    },

    // beforeEnter: (e) => {
    //   if (process.client) {
    //     const vue = e.__vue__ ? e.__vue__ : window.$nuxt;

    //     if (vue) {
    //       const store = vue.$store;
    //       vue.$nextTick(() =>
    //         requestAnimationFrame(async () => {
    //           await store.state.sleep.call(vue, 10, true);

    // document.documentElement.scrollTo(
    //   0,
    //   store.state.scrollPosition.y
    // );
    //         })
    //       );
    //     }
    //   }
    // },
  },
};
