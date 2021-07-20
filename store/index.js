import Vue from "vue";
import { createClient } from "@supabase/supabase-js";
import { getObjectPath } from "~/components/utils/main";

const supabaseUrl = "https://pymyzktuberhfkkzbfkw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjU1ODEwNywiZXhwIjoxOTM4MTM0MTA3fQ.Glp-4h4oQpc3Laharg0Xlo_WnD2UHFhXc5BMyWyh4L0";
const supabase = createClient(supabaseUrl, supabaseKey);

export const state = () => ({
  // addNuxtKeyForAddToBag: null,
  // styleEl: null,
  // htmlHead: null,
  savedAnimations: {
    allAnimClasses: [],
    allAnimText: "",
    springs: {
      // allAnimClasses: [],
      // allAnimText: "",
    },
    springDurations: {},
  },
  pageVisible: true,
  isTouchDevice: null,
  isStrictTouchDevice: null,
  beforeCreateCalled: false,
  // trackRoutes: {},
  isPWA: false,
  barsHeight: {
    appBar: "48px",
    navBar: "64px",
  },
  breakpoints: {},
  // appLoaded: false,
  showPageLoading: false,
  loadedComponents: {},
  loadingBarColor: undefined,
  fetched: {
    components: [],
    pages: [],
  },
  // routeToSavedPage: false,
  // styles: [],
  worker: null,
  forgotPasswordTimeout: {
    email: "",
    count: 0,
    timeStamp: 0,
  },
  greeting: "",
  renderPageTitle: null,
  sleep: null,
  scrollPosition: {},
  initialRoute: null,
  user: {
    awaitingSignIn: null,
  },
  localStorage: {
    user: {
      remember: null,
    },
  },
  savedDeliveryInfo: null,
  savedDeliveryInstructions: "",
  hideXOverflow: false,
  hideXOverflowCalls: 0,
  // footerIntersection: { entries: {} },
  pageTransition: "",
  pageTransitionState: "",
  pageTransitionDuration: "200ms",
  bagPageFetchedStates: null,
  // rootBanner: {
  //   render: false,
  //   intersecting: "not-set",
  // },
  userPreference: {
    reduceMotion: false,
    data: true,
  },
  vmodel: {
    loadingBar: false,
    errorPage: false,
    headerContent: {
      text: "",
      showText: false,
      showBorder: false,
      blurText: true,
    },
    dialogs: {
      addToBag: {
        active: false,
        template: "share-dialog",
        meta: {},
      },
      bagPage: {
        active: false,
        template: "anonymous-order",
        meta: {},
      },
    },
    menus: {
      navBar: false,
    },
    activeBannerIndex: 0,
    addToBag: {
      size: "",
      color: "",
      quantity: 1,
    },
  },
  bagItems: {
    items: [{ quantity: 1 }],
  },
  savedItems: [],
});

export const mutations = {
  SAVED_ANIMATIONS(s, p) {
    const root = s.savedAnimations;

    const className = p.value.className;

    const text = p.value.text;

    const allAnimClasses = root.allAnimClasses;

    if (p.action == "updateRoot") {
      if (!allAnimClasses.includes(className)) {
        allAnimClasses.push(className);

        return (root.allAnimText += `${root.allAnimText ? " " : ""}${text}`);
      }
      return;
    }

    if (p.action == "updateSpringActive") {
      const springRoot = root.springs;

      // const allAnimClasses = springRoot.allAnimClasses;

      // const savedAnim = allAnimClasses.includes(className);

      // if (savedAnim) {
      //   return console.log("saved!!!");
      // }

      const animName = springRoot?.[p.name] || (springRoot[p.name] = {});

      const direction = p.direction;

      const animDir = animName?.[direction] || (animName[direction] = {});

      const animKey = p.key;

      const animPath = animDir?.[animKey] || (animDir[animKey] = {});

      if (animPath) {
        root.allAnimText += ` ${text}`;

        allAnimClasses.push(className);

        if (!animPath[direction]) {
          animPath[direction] = { className, text };
        }

        const duration = p.value.duration || 0;

        root.springDurations[animKey] = duration;
      }
      return;
    }

    const animName = p.animName;

    const path =
      root?.[animName] ||
      (root[animName] = {
        enter: {},
        leave: {},
      });

    const value = p.value;

    Object.assign(path.enter, { ...path.enter, ...value.enter });
    Object.assign(path.leave, { ...path.leave, ...value.leave });
  },

  // TRACK_ROUTES(s, p) {
  //   const pathName = (p.path || p.name)
  //     ?.replace(/^index$/, "shop")
  //     .toLowerCase();

  //   // if (!/-/i.test(pathName)) {
  //   //   pathName = `${pathName}`;
  //   // }

  //   const path = s.trackRoutes[pathName];

  //   if (!path) {
  //     return;
  //   }

  //   if (/^scroll/i.test(p.action)) {
  //     path.scrollPosition = p.value;
  //   }

  //   if (p.action == "push") {
  //     const valueIsTheLastItem = path.history?.slice(-1)[0] == p.value;

  //     !valueIsTheLastItem && path.history?.push?.(p.value);
  //   }

  //   if (p.action == "splice") {
  //     path.history = [...path.history].filter((x) => x != p.value);
  //   }
  // },

  FETCHED(s, p) {
    const root = s.fetched;
    const path = p.path;
    const value = p.value;
    const oldValue = root?.[path];

    if (oldValue && value) {
      Vue.set(root, path, [...new Set([...oldValue, value])]);
    }
  },

  // ANIMATIONS(s, p) {
  //   const findValue = s.animations.find((x) => x.key == p.value.key);

  //   if (/add|put/i.test(p.action)) {
  //     if (!findValue) {
  //       Vue.set(s, "animations", [...s.animations, { ...p.value }]);
  //     }
  //   }

  //   if (/delete|remove/i.test(p.action)) {
  //     if (!findValue) {
  //       Vue.set(
  //         s,
  //         "animations",
  //         [...s.animations].filter((x) => {
  //           const IDs = [p.value].flat(Infinity).map((x) => x.key);

  //           return !IDs.includes(x.key);
  //         })
  //       );
  //     }
  //   }
  // },

  UPDATE_(s, p) {
    if (
      (s?.name == "sleep" ||
        s?.path == "sleep" ||
        s?.name == "springWorker" ||
        s?.path == "springWorker" ||
        s?.name == "uiTransitionWorker" ||
        s?.path == "uiTransitionWorker" ||
        s?.name == "worker" ||
        s?.path == "worker") &&
      p.caller != "appMounted"
    ) {
      return;
    }

    const root = getObjectPath({ obj: s, path: `${p.innerPath}` });
    const path = p?.name || p.path;
    const value = p.value;

    const pathExists = path in root;

    if (!pathExists) {
      throw new TypeError(`${path} is an undefined path`);
    }

    root[path] = value;

    Vue.set(root, path, value);

    root[path] = p.value;
  },

  LOCAL_STORAGE(s, p) {
    Vue.set(
      getObjectPath({ obj: s.localStorage, path: p.innerPath }),
      p?.name || p.path,
      p.value
    );

    Vue.nextTick(() => {
      localStorage.setItem(
        "prd",
        JSON.stringify({ ...s.localStorage, timeStamp: Date.now() })
      );
    });
  },

  // PAGE_TRANSITION(s, p) {
  //   Vue.set(s, "pageTransition", p);
  // },

  BAG(s, p) {
    const add = (item) => {
      Vue.set(s.bagItems, "items", [...s.bagItems.items, item]);
    };
    const remove = (id) => {
      const item = s.bagItems.items.find((i) => i.id == id);
      Vue.set(
        s.bagItems,
        "items",
        [...s.bagItems.items].filter((x) => x != item)
      );
    };

    if (p.action == "add") {
      return add(p.value);
    }
    if (p.action == "remove") {
      return remove(p.value);
    }
    if (p.action == "empty") {
      return Vue.set(s.bagItems, "items", []);
    }
  },

  // CONTAINER(s, p) {
  //   Vue.set(s.containerTransition, p.path, p.value);
  // },

  V_MODEL(s, p) {
    const innerPath = getObjectPath({
      obj: s.vmodel,
      path: p.innerPath,
    });

    Vue.set(
      innerPath,
      p.path,
      p.value == "toggle" ? !innerPath[p.path] : p.value
    );
  },

  // ROOT_BANNER(s, p) {
  //   Vue.set(s.rootBanner, p.path, p.value);
  // },

  // PREFRENCE(s, p) {
  //   Vue.set(s.userPreference, p.path, p.value);
  // },

  // PARALLAX(s, p) {
  //   s.parallax_px = p;
  // },

  // SAVED_ITEMS(s, p) {
  //   if (typeof p?.type != "string" || !/add|remove/i.test(p?.type)) {
  //     throw new Error("SAVED_ITEMS recieved an invalid payload!");
  //   }

  //   const type = p.type.toLowerCase();

  //   if (type == "add") {
  //     Vue.set(s, "savedItems", [...s.savedItems, p.value]);
  //   } else if (type == "remove") {
  //     Vue.set(
  //       s,
  //       "savedItems",
  //       [...s.savedItems].filter((x) => x.id != p.id)
  //     );
  //   }
  // },
};

export const getters = {
  bagLength(s) {
    return s.bagItems.items.reduce((a, b) => a + parseFloat(b.quantity), 0);
  },
  supabase(s) {
    // const $supabase = s.supabase;
    // console.log($supabase, process.env);
    return supabase;
  },
  awaitingSignIn(s) {
    return s.user.awaitingSignIn;
  },
  // getAnimations(s) {
  //   const filterBy = ({ path, value }) => [
  //     ...s.animations.filter((x) => {
  //       return true;
  //     }),
  //   ];

  //   return {
  //     rule: filterBy({ path: "type", value: "rule" }),
  //     keyFrames: filterBy({ path: "type", value: "keyFrame" }),
  //     spring: filterBy({ path: "animType", value: "spring" }),
  //   };
  // },
  // breakpoints(s) {
  //   return s.breakpoints;
  // },
};

// export const actions = {
//   createUser(context) {

//   }
// }
