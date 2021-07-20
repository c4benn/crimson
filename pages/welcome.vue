<script>
import { uiMount } from "~/components/utils/main";

export default {
  name: "WelcomePage",

  data: () => ({
    renderedComponents: [],
  }),

  head() {
    const name = this.currentUser?.name;

    return {
      title: `${name ? `Hi ${name}, w` : "W"}elcome to Paradice`,
    };
  },

  computed: {
    ...uiMount.computed,

    currentUser() {
      return this.$store.state.user;
    },
    supabase() {
      return this.$store.getters.supabase;
    },
    greeting() {
      return this.$store.state.greeting;
    },
  },

  watch: {
    ...uiMount.watch,
  },

  beforeCreate() {
    this.$store.commit("V_MODEL", {
      path: "showBorder",
      innerPath: "headerContent",
      value: true,
    });

    this.$store.commit("V_MODEL", {
      path: "showText",
      innerPath: "headerContent",
      value: true,
    });
  },

  beforeMount() {
    const hash = this.$store.state.initialRoute.hash;

    if (!this.supabase.auth.user() && !/&type=signup$/.test(hash)) {
      return this.$router.push("/");
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: "Welcome",
      });
    });

    this.mountSelf();
  },

  beforeDestroy() {
    this.$store.commit("V_MODEL", {
      path: "text",
      innerPath: "headerContent",
      value: "",
    });
  },

  methods: {
    mountSelf() {
      if (this.selfMounted) {
        this.$store.commit("FETCHED", {
          value: this.$route.path,
          path: "pages",
        });

        this.$store.commit("V_MODEL", {
          path: "loadingBar",
          value: false,
        });

        this.$store.commit("UPDATE_", {
          path: "showPageLoading",
          value: false,
        });
      }
    },
  },

  render(h) {
    const scoping = { "data-wpg": "" };
    const div = (d, c) => h("div", d, c);
    const main = (d, c) => h("main", d, c);
    const p = (d, c) => h("p", d, c);
    const img = (d, c) => h("app-img", d, c);
    const btn = (d, c) => h("ui-btn", d, c);

    return main(
      {
        attrs: { ...scoping },
        staticClass: "root",
      },
      [
        img({
          props: {
            src: "/img/illustrations/account-created.png",
            alt: "welcome image",
          },
          staticClass: "image",
        }),

        div(
          {
            attrs: { ...scoping },
            staticClass: "greeting-wrapper",
          },
          [
            p(
              {
                attrs: { ...scoping },
                staticClass: "greeting",
              },
              [`Good ${this.greeting}`]
            ),
            this.currentUser.name
              ? p(
                  {
                    attrs: { ...scoping },
                    staticClass: "name",
                  },
                  [this.currentUser.name]
                )
              : h("app-loader"),

            p(
              {
                attrs: { ...scoping },
                staticClass: "desc",
              },
              `Welcome to Paradice Parade online store`
            ),
          ]
        ),

        [
          {
            title: "View Profile",
            background: "primary",
            to: "/profile",
          },
          {
            title: "View Shop",
            color: "primary",
            text: true,
            to: "/",
          },
        ].map((item, key) => {
          return btn(
            {
              key,
              props: {
                background: item.background,
                color: item.color,
                flat: true,
                text: item.text,
                tag: "nuxt-link",
                actionButton: true,
                to: item.to,
              },
              attrs: { ...scoping },
              staticClass: `action action-${key + 1}`,
            },
            item.title
          );
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-wpg] {
  margin-top: var(--header-height);
  padding: 0rem 1rem 4rem;
  min-height: calc(100vh - var(--app-bars-height));
}

.root[data-wpg] .image {
  height: max(30vh, 256px);
  width: 100%;
}

/* .dark-theme .root[data-wpg] img {
  filter: invert(0.91) saturate(1.5) hue-rotate(110deg);
} */

.greeting-wrapper[data-wpg] {
  display: grid;
  justify-items: center;
  margin: 1.5rem 0;
  row-gap: 1.5rem;
  letter-spacing: 0.4px;
}

.greeting[data-wpg] {
  font-size: 1.35rem;
  opacity: var(--t-body);
}

.name[data-wpg] {
  font-size: 1.75rem;
  opacity: var(--t-title);
}

.desc[data-wpg] {
  font-size: 0.875rem;
  opacity: var(--t-caption);
}

.action[data-wpg] {
  min-width: 256px;
  display: grid;
  margin: 2rem auto;
}

.action-1[data-wpg] {
  margin-top: 4rem;
}
</style>
