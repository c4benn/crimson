<script>
/* eslint-disable promise/param-names */
import Vue from "vue";
import uiPortal from "~/components/portal/uiPortal";
import registerComponents from "~/components/utils/registerComponents";

import {
  breakpointsClasses,
  detectTouchscreen,
  mediaListener,
  nextFrame,
  setLocalStorage,
  sleep,
  updateUser,
  // updateUser,
} from "~/components/utils/main";

import MdnIcons from "~/components/mdnIcons";
import breakpoints from "~/components/utils/breakpoints";
import pseudoVue from "~/components/pseudo.vue";

// import smoothscroll from "smoothscroll-polyfill";

const $specialRoutes = /\/welcome|\/reset_password|\/shop\/add_to_bag\/?.+?/;

function updateStyleElWatcher() {
  const barsHeight = `$store.state.barsHeight`;

  return Object.fromEntries(
    [
      `${barsHeight}.appBar`,
      `${barsHeight}.navBar`,
      `$store.state.pageTransitionDuration`,
      `$store.state.savedAnimations.allAnimText`,
    ].map((prop) => {
      return [
        prop,
        function () {
          this.updateStyleEl();
        },
      ];
    })
  );
}

export default {
  name: "AppRoot",
  // keepAlive: true,

  data() {
    return {
      appMounted: false,
      showUserPrefTheme: true,
      appMounting: false,
      loaded: false,
      specialRoutes: $specialRoutes,

      ...breakpoints.data,
    };
  },

  head() {
    const links = [];

    if (!this.appMounting) {
      links.push(
        {
          uid: "initial-theme-styles-preload",
          rel: "preload",
          as: "style",
          href: `/initialTheme.css`,
        },
        {
          uid: "initial-theme-styles",
          rel: "stylesheet",
          href: `/initialTheme.css`,
        }
      );
    }

    links.push(
      {
        uid: "permanent-marker-link-preconnect",
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        uid: "permanent-marker-link",
        href: "https://fonts.googleapis.com/css2?family=Bangers&display=swap",
        rel: "stylesheet",
      }
      // {
      //   uid: "inter-link-preconnect-1",
      //   rel: "preconnect",
      //   href: "https://fonts.googleapis.com",
      // },
      // {
      //   uid: "inter-link-preconnect-2",
      //   rel: "preconnect",
      //   href: "https://fonts.gstatic.com",
      //   crossorigin: "",
      // }
    );

    // const state = this.$store.state;
    // const barsHeight = state.barsHeight;

    // let styleInnerHTML = `/*.*/#ui-root{--header-height:${barsHeight.appBar};--nav-bar-height:${barsHeight.navBar};--pt-duration:${state.pageTransitionDuration}}`;

    // if (this.$store?.state?.styles?.length || this.$store?.state?.animations) {
    //   [...state.styles, ...state.animations].forEach((x, i, a) => {
    //     if (x.text) {
    //       styleInnerHTML += x.text;
    //     } else {
    //       console.log(x);
    //       console.warn(`style recieved no text ${x}`);
    //     }

    //     if (i == a.length - 1) {
    //       styleInnerHTML += "/*.*/";
    //     }
    //   });
    // }

    // styleInnerHTML += this.$store.state.savedAnimations.allAnimText;

    // if (!styleInnerHTML.length) {
    //   delete returnValue.style;
    // }

    return {
      title: "PRD",
      link: [...links],
      // style: [
      //   {
      //     uid: "ui-styles",
      //     type: "text/css",
      //     innerHTML: styleInnerHTML,
      //   },
      // ],
      meta: [
        {
          hid: "apple-mobile-web-app-status-bar-style",
          name: "apple-mobile-web-app-status-bar-style",
          content: this.$theme.dark ? "black" : "default",
        },
        {
          hid: "viewport",
          name: "viewport",
          content:
            "width = device-width, initial-scale = 1, user-scalable = no",
        },
      ].filter((x) => (this.$store.state.isPWA ? true : x.name != "viewport")),
    };
  },

  computed: {
    ...breakpoints.computed,

    headerContent() {
      return this.$store.state.vmodel.headerContent;
    },
    supabase() {
      return this.$store.getters.supabase;
    },
    renderPageTitle() {
      return this.$store.state.renderPageTitle;
    },
    // hasPageOverlay() {
    //   return (
    //     /^\/?bag\/?/i.test(this.$route.path) ||
    //     /shop\/add_to_bag/i.test(this.$route.path)
    //   );
    // },

    pageTransitionState() {
      return this.$store.state.pageTransitionState;
    },
  },

  watch: {
    ...updateStyleElWatcher.call(this),
    "$store.state.isTouchDevice"() {
      this.refreshHTMLEvents();
    },
    "$store.state.isStrictTouchDevice"() {
      this.refreshHTMLEvents();
    },
    "$store.state.breakpoints"(n) {
      this.updateBarsHeight(n);
    },
    async "$store.state.forgotPasswordTimeout.count"(n) {
      function sleep(d) {
        return new Promise((r) => {
          const t = setTimeout(() => {
            r();
            requestAnimationFrame(() => clearTimeout(t));
          }, d);
        });
      }

      if (n > 0) {
        await sleep(1000);

        this.$store.commit("UPDATE_", {
          path: "count",
          innerPath: "forgotPasswordTimeout",
          value: n - 1,
        });
      }
    },
    "$store.state.pageVisible"(n) {
      if (n) {
        this.refreshHTMLEvents();

        this.$nuxt.refreshOnlineStatus();

        this.setGreetings();

        setLocalStorage.call(this, "pageVisibility");

        const updateAppDelivery = () => {
          const localStorageDelivery = localStorage.getItem("delivery-info");

          if (localStorageDelivery) {
            const appDelivery = this.$store.state.savedDeliveryInfo || {};
            const value = JSON.parse(localStorageDelivery);

            if (value.timeStamp > appDelivery.timeStamp || 0) {
              this.$store.commit("UPDATE_", {
                name: "savedDeliveryInfo",
                value,
              });
            }
          }
        };

        updateAppDelivery();
      }
    },
    "$theme.light"() {
      this.$el
        .closest("html")
        .classList.replace(
          this.$theme.light ? "dark-theme" : "light-theme",
          this.$theme.light ? "light-theme" : "dark-theme"
        );
    },

    async "$c4.overlays"() {
      const html = document.documentElement;

      if (this.$c4.overlays.length) {
        if (!this.$c4.htmlOverlayClassAdded) {
          this.$c4.htmlOverlayClassAdded = true;
          html.style.setProperty(
            "--padding-right",
            // `${innerWidth - html.clientWidth}px`,
            "0"
          );

          requestAnimationFrame(() => {
            html.classList.add("overlay-active");
          });
        }
      } else {
        await nextFrame();

        html.classList.remove("overlay-active", "no-overlay");

        html.style.removeProperty("--padding-right");

        this.$c4.htmlOverlayClassAdded = false;
      }
    },

    // "$store.state.pageTransitionState"(n) {
    //   const html = this.$el.closest("html");
    //   if (/afterEnter/i.test(n)) {
    //     html.classList.remove("will-change-scroll");
    //   } else {
    //     html.classList.add("will-change-scroll");
    //   }
    // },

    async $route(n, o) {
      // this.$store.commit("UPDATE_", {
      //   value: n.path == o.path,
      //   path: "addNuxtKeyForAddToBag",
      // });

      this.setGreetings();

      const store = this.$store;
      const specialRoutes = this.specialRoutes;
      const loadedPages = this.$fetched.pages;

      if (!loadedPages.includes(n.path)) {
        this.$store.commit("UPDATE_", {
          path: "showPageLoading",
          value: true,
        });
      }

      if (!specialRoutes.test(n.fullPath)) {
        await sleep.call(this, 16);
        store.commit("UPDATE_", {
          value: true,
          name: "renderPageTitle",
        });
      }

      if (specialRoutes.test(n.fullPath) && !specialRoutes.test(o.fullPath)) {
        await sleep.call(this, 16);
        store.commit("UPDATE_", {
          value: false,
          name: "renderPageTitle",
        });

        store.commit("V_MODEL", {
          path: "showBorder",
          innerPath: "headerContent",
          value: true,
        });

        store.commit("V_MODEL", {
          path: "showText",
          innerPath: "headerContent",
          value: true,
        });
      }
    },

    "$store.state.localStorage"(n) {
      if (typeof n == "object" && n !== null) {
        localStorage.setItem(
          "prd",
          JSON.stringify({ ...n, timeStamp: Date.now() })
        );
      } else {
        throw new Error("invalid local storage value");
      }
    },
  },

  beforeCreate() {
    Vue.component("UiPortal", pseudoVue.default || pseudoVue);

    const store = this.$store;

    const $specialRoutes = /\/welcome|\/reset_password|\/shop\/add_to_bag\/?.+?/;

    // const allRoutes = this.$router.getRoutes();

    // allRoutes.forEach((route) => {
    //   const addRoute = {};

    //   const routeName = route.name.replace(/^index$/, "shop").toLowerCase();

    //   // if (!/-/i.test(routeName)) {
    //   //   routeName = `${routeName}`;
    //   // }

    //   addRoute[routeName] = {
    //     scrollPosition: null,
    //     history: [],
    //   };

    //   store.commit("UPDATE_", {
    //     path: "trackRoutes",
    //     value: { ...store.state.trackRoutes, ...addRoute },
    //   });
    // });

    // store.commit("TRACK_ROUTES", {
    //   value: this.$route.fullPath,
    //   path: this.$route.name,
    //   action: "push",
    // });

    store.commit("UPDATE_", {
      value: this.$route.query.mode == "pwa",
      path: "isPWA",
    });

    store.commit("UPDATE_", {
      value: "48px",
      path: "appBar",
      innerPath: "barsHeight",
    });

    store.commit("UPDATE_", {
      value: "64px",
      path: "navBar",
      innerPath: "barsHeight",
    });

    Vue.prototype.$fetched = Vue.observable(this.$store.state.fetched);

    store.commit("UPDATE_", {
      value: !$specialRoutes.test(this.$route.path),
      name: "renderPageTitle",
    });

    // const allRoutes = this.$router.getRoutes();

    // allRoutes.forEach((route) => {
    //   const addRoute = {};

    //   addRoute[route.name.replace(/^index$/, "shop").toLowerCase()] = {
    //     scrollPosition: null,
    //     history: [],
    //   };

    //   this.$store.commit("UPDATE_", {
    //     path: "trackRoutes",
    //     value: { ...this.$store.state.trackRoutes, ...addRoute },
    //   });
    // });

    // this.$store.commit("TRACK_ROUTES", {
    //   value: this.$route.fullPath,
    //   path: this.$route.name,
    //   action: "push",
    // });

    // this.$store.commit("UPDATE_", {
    //   value: this.$route.query.mode == "pwa",
    //   path: "isPWA",
    // });

    // this.$store.commit("UPDATE_", {
    //   value: "48px",
    //   path: "appBar",
    //   innerPath: "barsHeight",
    // });

    // this.$store.commit("UPDATE_", {
    //   value: "64px",
    //   path: "navBar",
    //   innerPath: "barsHeight",
    // });

    Vue.prototype.$breakpoints = Vue.observable({});

    registerComponents(Vue);
    MdnIcons(Vue);

    class Theme {
      constructor() {
        this.current = "...";
      }

      get is() {
        return this.current;
      }

      set is(val) {
        this.current = val;
      }

      get light() {
        return /light/i.test(this.current);
      }

      get dark() {
        return /dark/i.test(this.current);
      }

      set light(val) {
        if (val) {
          this.current = "light";
        } else this.current = "dark";
      }

      set dark(val) {
        if (val) {
          this.current = "dark";
        } else this.current = "light";
      }
    }

    class C4UiLib {
      constructor() {
        this.theme = Vue.observable(new Theme());
        this.componentZIndex = [];
        this.overlays = [];
        this.htmlOverlayClassAdded = false;
        this.loadedImages = [];
        this.currencies = {
          naira: "₦",
        };
        this.mounted = false;
        this.isMounting = false;
      }
    }

    Vue.prototype.$c4 = Vue.observable(new C4UiLib());

    Vue.prototype.$theme = Vue.prototype.$c4.theme;

    Vue.prototype.$currencies = Vue.prototype.$c4.currencies;

    const supabase = this.$store.getters.supabase;

    supabase
      .from("users")
      .on("*", (p) => {
        const autoSignIn = async () => {
          const awaitingSignIn = this.$store.getters.awaitingSignIn;
          const canSignInUSer =
            /update/i.test(p?.eventType) &&
            typeof awaitingSignIn == "object" &&
            awaitingSignIn !== null;

          if (canSignInUSer) {
            this.$store.commit("UPDATE_", {
              value: { ...this.$store.state.user, awaitingSignIn: null },
              name: "user",
            });

            this.supabase.auth.user() && (await supabase.auth.signOut());

            try {
              supabase.auth.signIn({ ...awaitingSignIn }).then((x) => {
                console.log(x);
              });
            } catch (e) {
              if (e) {
                return e;
              }
            }
          }
        };

        autoSignIn();
      })
      .subscribe();

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(session, event);
      if (session) {
        const user = session.user;
        const sessionUser = await supabase
          .from("users")
          .select("*")
          .eq("uuid", `${user.id}`);
        const sessionName = sessionUser?.data?.[0]?.name;

        sessionName &&
          updateUser
            .call(this, {
              value: {
                meta: JSON.stringify(user),
                confirmed: !!user.confirmed_at,
              },
              id: user.id,
            })
            .then(async () => {
              const user = await supabase
                .from("users")
                .select("*")
                .eq("email", session.user.email);

              if (user.data?.[0]?.email) {
                this.$store.commit("UPDATE_", {
                  name: "user",
                  value: {
                    ...this.$store.state.user,
                    session,
                    ...user.data[0],
                  },
                });
              }
            });
      } else {
        this.$store.commit("UPDATE_", {
          name: "user",
          value: { awaitingSignIn: null },
        });
      }
    });

    const signedInUser = supabase.auth.user();

    if (signedInUser) {
      const setUser = async () => {
        const user = await supabase
          .from("users")
          .select("*")
          .eq("email", signedInUser.email);

        if (user.data?.[0]?.email) {
          this.$store.commit("UPDATE_", {
            name: "user",
            value: {
              awaitingSignIn: null,
              ...user.data[0],
              session: this.supabase.auth.session(),
            },
          });
        }
      };

      setUser();
    }
  },

  created() {
    const { fullPath, params, hash, path, query } = this.$route;

    this.$store.commit("UPDATE_", {
      name: "initialRoute",
      value: {
        fullPath,
        params,
        hash,
        path,
        query,
      },
    });

    this.loaded = false;

    this.setGreetings();

    Vue.prototype.$greeting = this.$store.state.greeting;
  },

  beforeMount() {
    this.$store.commit("UPDATE_", {
      name: "worker",
      value: new Worker("/worker/main.js"),
      caller: "appMounted",
    });

    const setStyleEl = () => {
      const head = document?.head || document.querySelector("head");

      const styleEl = document.createElement("style");

      styleEl.id = "ui-styles";

      const state = this.$store.state;
      const barsHeight = state.barsHeight;

      styleEl.innerText = `/*.*/#ui-root{--header-height:${barsHeight.appBar};--nav-bar-height:${barsHeight.navBar};--pt-duration:${state.pageTransitionDuration}} ${this.$store.state.savedAnimations.allAnimText}`;

      head.appendChild(styleEl);

      // this.$store.commit("UPDATE_", {
      //   value: head,
      //   path: "htmlHead",
      // });

      // this.$store.commit("UPDATE_", {
      //   value: styleEl,
      //   path: "styleEl",
      // });
    };

    setStyleEl();

    breakpoints.mounted.call(this);

    this.$nextTick(() => {
      this.$store.commit("UPDATE_", {
        value: sleep.bind(this),
        name: "sleep",
        caller: "appMounted",
      });

      Vue.prototype.$sleep = this.$store.state.sleep;
    });

    const html = document.documentElement;

    Vue.component("UiPortal", uiPortal.default || uiPortal);

    window.log = console.log.bind(console);

    window.history.scrollRestoration = "auto";

    setLocalStorage.call(this, "mounted");

    this.$nextTick(() => {
      const storageRemember = this.$store.state.localStorage.user.remember;

      if (storageRemember === false) {
        this.supabase?.auth?.signOut?.();
      }
    });

    const handleIsPWA = () => {
      const isPWA = window.matchMedia("(display-mode: standalone)");

      const setIsPWA = (value) =>
        this.$store.commit("UPDATE_", {
          value,
          path: "isPWA",
        });

      setIsPWA(isPWA.matches);

      mediaListener({
        media: isPWA,
        callback: (e) => setIsPWA(e.matches),
      });
    };

    handleIsPWA();

    const updateTheme = () => {
      const setTheme = (val) => {
        this.$theme.is = val;
        html.classList.add(this.$theme.light ? "light-theme" : "dark-theme");
      };

      const currentTheme = window.matchMedia("(prefers-color-scheme: light)");

      if (currentTheme?.matches) {
        setTheme("light");
      } else setTheme("dark");

      mediaListener({
        media: currentTheme,
        callback: (e) => {
          if (e.matches) {
            setTheme("light");
          } else setTheme("dark");
        },
      });
    };

    updateTheme();

    const updatePageVisibility = () => {
      const togglePageVisiblity = () => {
        const hidden =
          document.hidden || document.webkitHidden || document.msHidden;
        const visibility =
          document.visibilityState ||
          document.webkitVisibilityState ||
          document.msVisibilityState;
        const documentHidden = !!hidden || /^hidden/i.test(visibility);
        const toggleVisibility = (value) => {
          this.$store.commit("UPDATE_", {
            value,
            path: "pageVisible",
          });
        };

        if (documentHidden) {
          toggleVisibility(false);
        } else toggleVisibility(true);
      };

      togglePageVisiblity();

      document.addEventListener("visibilitychange", togglePageVisiblity);
    };

    updatePageVisibility();

    const hash = this.$store.state.initialRoute.hash;
    if (/&type=recovery$/i.test(hash)) {
      this.$router.push("/reset_password");
    } else if (/&type=signup$/.test(hash)) {
      this.$router.push("/welcome");
    } else if (
      hash == "#error_code=404&error_description=Confirmation+Token+not+found"
    ) {
      this.$router.push("/");
    }

    this.toggleHTMLEvents("add");

    this.appMounting = true;

    this.$c4.isMounting = true;
  },

  mounted() {
    this.$nextTick(async () => {
      this.appMounted = true;

      // smoothscroll.polyfill();

      // const reduceMotion = window.matchMedia(
      //   "(prefers-reduced-motion: reduce)"
      // );

      // const setMotion = (value) => {
      //   this.$store.commit("PREFRENCE", {
      //     value: !value,
      //     path: "reduceMotion",
      //   });
      // };

      // setMotion(reduceMotion.matches);

      // reduceMotion.addEventListener("change", (e) => {
      //   setMotion(e.matches);
      // });

      try {
        sleep.call(this, 600, true);
      } catch (e) {
        alert(e.message);
      }

      await sleep.call(this, 600, true);

      this.showUserPrefTheme = false;
      this.loaded = true;

      this.$c4.mounted = true;

      const updateAppDelivery = () => {
        const deliveryInfo = localStorage.getItem("delivery-info");

        if (deliveryInfo) {
          const value = JSON.parse(deliveryInfo);

          value.saved &&
            this.$store.commit("UPDATE_", {
              name: "savedDeliveryInfo",
              value,
            });
        }
      };

      updateAppDelivery();
    });
  },

  beforeDestroy() {
    localStorage.setItem(
      "scrollPosition",
      JSON.stringify({
        x: pageXOffset,
        y: pageYOffset,
      })
    );

    this.toggleHTMLEvents("remove");
  },

  methods: {
    ...breakpoints.methods,

    updateStyleEl() {
      const state = this.$store.state;

      const el = document.getElementById("ui-styles");

      const barsHeight = state.barsHeight;

      el.innerText = `/*.*/#ui-root{--header-height:${barsHeight.appBar};--nav-bar-height:${barsHeight.navBar};--pt-duration:${state.pageTransitionDuration}} ${state.savedAnimations.allAnimText}`;

      // if (process.client) {
      //   window.$styleEl = el;
      // }
    },

    updateBarsHeight(br) {
      const update = (appBar, navBar) => {
        appBar &&
          this.$store.commit("UPDATE_", {
            value: appBar,
            path: "appBar",
            innerPath: "barsHeight",
          });

        navBar &&
          this.$store.commit("UPDATE_", {
            value: navBar,
            path: "navBar",
            innerPath: "barsHeight",
          });
      };

      if (!br.lesser) {
        update("48px", "64px");
      } else if (/^sm/.test(br.lesser)) {
        update("0px");
      } else if (/^md/.test(br.lesser)) {
        update("56px", "64px");
      }
    },

    setGreetings() {
      const greeting = () => {
        const hr = new Date().getHours();

        if (hr >= 0 && hr < 12) {
          return "morning";
        }
        if (hr >= 12 && hr < 17) {
          return "afternoon";
        }
        return "evening";
      };

      this.$store.commit("UPDATE_", {
        name: "greeting",
        value: greeting(),
      });
    },

    emptyFunction() {},

    async toggleHTMLEvents(action) {
      await detectTouchscreen.call(this);

      if (!this.not) {
        return;
      }

      [
        "click",
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
        "mousedown",
        "mousemove",
        "mouseup",
        "keydown",
        "keyup",
        // "animationstart",
        // "animationend",
        // "animationcancel",
      ]
        .filter((x) =>
          this.$store.state.isTouchDevice ? true : !/touch/.test(x)
        )
        .forEach((event) => {
          window[`${action}EventListener`](event, this.emptyFunction, {
            passive: true,
          });
        });

      await this.$nextTick();

      return new Promise((r) => r(window));
    },

    refreshHTMLEvents() {
      this.toggleHTMLEvents("remove").then(() => this.toggleHTMLEvents("add"));
    },
  },

  render(h) {
    const hideWhenOverlayActive = {
      "aria-hidden": this.$c4.overlays.length ? "true" : undefined,
      // hidden: this.$c4.overlays.length ? "true" : undefined,
      tabindex: this.$c4.overlays.length ? "-1" : undefined,
    };

    const div = (d, c) => h("div", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const span = (d, c) => h("span", d, c);
    // const transition = (d, c) => h("ui-transition", d, c);
    const logo = (d, c) => h("ui-logo", d, c);
    const intersection = (d, c) => h("ui-intersection", d, c);
    // const keepAlive = (d, c) => h("keep-alive", d, c);
    const Nuxt = h("nuxt", {
      // key: this.$store.state.addNuxtKeyForAddToBag
      //   ? this.$route.fullPath
      //   : undefined,
      ref: "nuxt",
      attrs: {
        "aria-label": `${this.headerContent.text} page content`.toLowerCase(),
        ...hideWhenOverlayActive,
      },
      class: [{ hidden: !this.loaded }],
    });
    const navBar = h("ui-nav-bar", {
      // attrs: { ...hideWhenOverlayActive },
    });
    const appHeader = h("app-header", { attrs: { ...hideWhenOverlayActive } });
    // const rootBanner = (d) => h("rootBanner", d);
    const footer = (d) => h("appFooter", d);
    const loadingBar = (d) => h("loading-bar", d);
    // const rootFab = (d) => h("root-fab", d);
    const notification = (d) => h("app-notification", d);

    const addToBagDialog = () =>
      /shop\/add_to_bag/i.test(this.$route.path)
        ? h("addToBagDialog")
        : undefined;

    const bagPageDialog = () =>
      /^\/?bag\/?/i.test(this.$route.path) ? h("bagPageDialog") : undefined;

    const updateHeader = (p, v) => {
      this.$nextTick(() => {
        if (this.$store.state.vmodel.headerContent[p] == v) {
          return;
        }
        this.$store.commit("V_MODEL", {
          path: p,
          innerPath: "headerContent",
          value: v,
        });
      });
    };

    const pageTitle = this.headerContent.text;
    let hideTitle = this.headerContent.showText;

    const showPageLoading = this.$store.state.showPageLoading;
    const renderLoadingPage = !this.loaded ? true : showPageLoading;

    return div(
      {
        attrs: {
          id: "ui-root",
          "aria-label": "PRD online store",
        },
        class: [
          breakpointsClasses.call(this),
          this.$store.state.pageTransition,
          {
            "reduced-motion": this.$store.state.userPreference.reduceMotion,
            // "root-banner": this.$store.state.rootBanner.render,
            "hide-x-overflow": this.$store.state.hideXOverflow,
            "hide-nav-bar": /\/welcome|\/reset_password/i.test(
              this.$route.path
            ),
            // "hide-header": /shop-add_to_bag-id/i.test(this.$route.name),
            "app-loading": !this.loaded,
            "is-pwa": this.$store.state.isPWA,
            "touch-device": this.$store.state.isTouchDevice,
            "strict-touch": this.$store.state.isStrictTouchDevice,
            "is-offline": this.$nuxt.isOffline,
            "app-hidden": !this.$store.state.pageVisible,
          },
        ],
      },
      [
        // this.$store.state.rootBanner.render && rootBanner(),
        this.loaded && [
          appHeader,
          div({
            // key: `${this.$breakpoints.matches.join("-")}-${
            //   this.$breakpoints.orientation
            // }-${this.$c4.overlays.length}`,
            attrs: {
              "aria-hidden": "true",
              // hidden: "hidden",
            },
            staticClass: "__header-blur",
            class: [
              {
                // invisible:
                //   // this.$store.state.rootBanner.render &&
                //   this.$store.state.rootBanner.intersecting,
                "__show-text": this.$store.state.vmodel.headerContent.showText,
              },
            ],
          }),
        ],

        h1(
          {
            key: `h1-${this.pageTransitionState}`,
            attrs: {
              "aria-label":
                hideTitle || this.$c4.overlays.length
                  ? undefined
                  : pageTitle.toLowerCase(),
              title:
                hideTitle || this.$c4.overlays.length
                  ? undefined
                  : pageTitle.toLowerCase(),
              "aria-hidden":
                hideTitle || this.$c4.overlays.length ? "true" : undefined,
              hidden:
                hideTitle || this.$c4.overlays.length ? "true" : undefined,
              id: "app-title",
            },
            class: [
              "__page-title fill-before",
              {
                "sr-only": !this.renderPageTitle,
              },
            ],
            // style: {
            //   display: !this.renderPageTitle ? "none" : undefined,
            // },
          },
          [
            logo({
              props: {
                width: "45px",
                height: "45px",
                tag: "nuxt-link",
                to: "/",
              },

              attrs: {
                disabled:
                  hideTitle || this.$c4.overlays.length ? "true" : undefined,
              },

              on: {
                click: (e) => {
                  e.stopPropagation();
                },
              },
            }),
            intersection({
              key: `${this.loaded}`,
              props: {
                config: {
                  threshold: 0.02,
                  rootMargin: "0px 0px 0px",
                },
              },
              scopedSlots: {
                default: (p) => {
                  // this.$nextTick(() => {
                  if (this.appMounted && p.target) {
                    if (p.isIntersecting) {
                      hideTitle = false;
                      updateHeader("showBorder", false);
                      updateHeader("showText", false);
                    } else if (!p.isIntersecting) {
                      updateHeader("showText", true);
                      updateHeader("showBorder", true);
                    }
                  }
                  // });
                  return span(
                    {
                      key: pageTitle,
                      class: [
                        {
                          __hidden:
                            hideTitle ||
                            !/afterE|^$/i.test(this.pageTransitionState),
                        },
                      ],
                    },
                    pageTitle
                  );
                },
              },
            }),
          ]
        ),

        Nuxt,
        this.loaded &&
          footer({
            attrs: { ...hideWhenOverlayActive },
            class: [
              {
                hidden: !/afterEn|^$/i.test(this.pageTransitionState),
              },
            ],
          }),

        !this.loaded
          ? div({
              key: "pseudo-nav",
              staticClass: "pseudo-nav",
            })
          : navBar,

        this.loaded &&
          div({
            key: `${/\/welcome|\/reset_password/i.test(this.$route.path)}`,
            attrs: {
              "aria-hidden": "true",
              // hidden: "hidden",
            },
            staticClass: "__nav-blur",
          }),
        this.loaded &&
          // /afterEn|^$/i.test(this.pageTransitionState) &&
          div(
            {
              // key: `app-overlay-${
              //   this.loaded && /afterEn|^$/i.test(this.pageTransitionState)
              // }`,
              attrs: {
                id: "app-overlays",
                "aria-hidden": this.$c4.overlays.length ? undefined : "true",
                // hidden: this.$c4.overlays.length ? undefined : "true",
                tabindex: this.$c4.overlays.length ? undefined : "-1",
              },
            },
            [addToBagDialog(), bagPageDialog(), notification()]
          ),
        // transition({
        //   props: {
        //     transition: false,
        //     fade: true,
        //     ease: "linear",
        //     duration: {
        //       enter: 0,
        //       leave: 400,
        //     },
        //     delay: {
        //       enter: 0,
        //       leave: 100,
        //     },
        //   },
        //   scopedSlots: {
        //     default: () => {
        //       const showPageLoading = this.$store.state.showPageLoading;
        //       const render = !this.loaded ? true : showPageLoading;

        //       return (
        //         render &&
        //         div(
        //           {
        //             key: `${this.loaded}-${/afterE/i.test(
        //               this.pageTransitionState
        //             )}-${this.$route.path}`,
        //             staticClass: "loading-page",
        //             class: [
        //               {
        //                 initial: !this.loaded,
        //                 "page-loading": this.loaded && showPageLoading,
        //               },
        //             ],
        //             on: {
        //               wheel: (e) => {
        //                 e.stopPropagation();
        //                 e.preventDefault();
        //               },
        //             },
        //           },
        //           [
        //             div({
        //               staticClass: "spinner-border",
        //               class: [{ hidden: !render }],
        //               style: {
        //                 "--size": "2.5rem",
        //                 "--stroke": "2px",
        //                 "--color": this.$store.state.loadingBarColor,
        //                 "--color-duration":
        //                   this.background == "var(--error)"
        //                     ? "0.5s"
        //                     : undefined,
        //               },
        //             }),
        //           ]
        //         )
        //       );
        //     },
        //   },
        // }),
        this.loaded && loadingBar(),
        renderLoadingPage &&
          div(
            {
              key: `${this.loaded}-${/afterE/i.test(
                this.pageTransitionState
              )}-${this.$route.path}`,
              staticClass: "loading-page",
              class: [
                {
                  initial: !this.loaded,
                  "page-loading": this.loaded && showPageLoading,
                },
              ],
              on: {
                wheel: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
              },
            },
            [
              div({
                staticClass: "spinner-border",
                class: [{ hidden: !renderLoadingPage }],
                style: {
                  "--size": "2.5rem",
                  "--color": this.$store.state.loadingBarColor,
                  "--color-duration":
                    this.background == "var(--error)" ? "0.5s" : undefined,
                },
              }),
            ]
          ),
        // rootFab()
      ]
    );
  },
};
</script>

<style>
#ui-root > article {
  position: relative;
}

.loading-page {
  width: var(--width, 200%);
  height: var(--height, calc(100% - var(--nav-bar-height)));
  position: fixed;
  left: -50%;
  bottom: var(--bottom, var(--nav-bar-height));
  background-color: var(--theme-surface);
  z-index: 13000;
  touch-action: none;
  display: grid;
  place-items: center;
}

#ui-root:not(.app-loading) .root[data-lbr] {
  font-family: "Bangers", monospace;
}

/* .loading-page.page-loading {
  --height: calc(100% - var(--app-bars-height));
} */

.pseudo-nav {
  z-index: 13001;
  touch-action: none;
  position: fixed;
  bottom: -1px;
  left: 0;
  height: calc(var(--nav-bar-height) + 1px);
  width: 100%;
  background-color: var(--theme-banner);
}

.pseudo-nav::after {
  border-top: var(--ui-divide);
  opacity: var(--t-disabled);
  background: var(--theme-surface);
}

.__page-title {
  min-height: 128px;
  max-height: 128px;
  display: grid;
  align-items: flex-end;
  justify-content: center;
  font-size: 2.35rem !important;
  font-weight: 600 !important;
  /* height: 96px;
  display: flex;
  align-items: flex-end; */
  position: relative;
  transition: 0.3s opacity linear;
  z-index: 100;
  letter-spacing: 0.4px;
  padding: 1.25rem 1rem 1rem;
  grid-template-rows: 45px 1fr;
  align-items: center;
  opacity: var(--t-title);
  isolation: isolate;
}

.__page-title > .ui-icon {
  color: var(--primary);
  z-index: 2;
  opacity: 1;
}

.__page-title > span:not(.ui-icon) {
  opacity: var(--t-title);
}

.is-offline .__page-title > .ui-icon {
  color: var(--theme-surface-text);
  opacity: 0.5;
}

.__header-blur {
  position: fixed;
  width: 100%;
  height: calc(var(--header-height) + 1px);
  top: -1px;
  left: 0;
  pointer-events: none;
  z-index: 499;
}

.__nav-blur {
  position: fixed;
  width: 100%;
  height: calc(var(--nav-bar-height) + 1px);
  bottom: -1px;
  left: 0;
  pointer-events: none;
  z-index: 509;
}

.__header-blur:not(.__show-text) {
  visibility: hidden;
}

.__header-blur.__show-text::before {
  transition: opacity 0.15s linear 400ms;
  opacity: 0;
}

@supports not (backdrop-filter: blur(1px)) {
  .__header-blur,
  .__nav-blur {
    display: none;
  }
}

#ui-root.reduced-motion .__header-blur,
#ui-root.reduced-motion .__nav-blur {
  display: none;
}

#ui-root.reduced-motion {
  --blur-header: var(--theme-primary);
}

@supports (backdrop-filter: blur(1px)) {
  .__header-blur {
    backdrop-filter: var(--header-backdrop-filter);
  }

  .__nav-blur {
    backdrop-filter: var(--backdrop-filter);
  }
}

.__page-title::before {
  border-bottom: var(--ui-divide);
  width: calc(100% - 3rem);
  left: 1.5rem;
}

.__page-title.__hidden {
  opacity: 0;
  transform: translate3d(0, -1rem, 0);
}
</style>
