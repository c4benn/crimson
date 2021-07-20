<script>
import { sleep, uiMount } from "~/components/utils/main";
export default {
  name: "ResetPassword",

  beforeRouteLeave(t, f, n) {
    this.$store.commit("V_MODEL", {
      path: "text",
      innerPath: "headerContent",
      value: "",
    });
    n();
  },

  data() {
    return {
      form: {
        password: "",
        confirmPassword: "",
        keepMeSignedIn: false,
        showPassword: false,
        showConfirmPassword: false,
      },
      showComplete: false,
      submitting: false,

      // renderedComponents:['ui-input','ui-form']
      renderedComponents: [],
    };
  },

  head() {
    return {
      title: `Reset your password`,
    };
  },

  computed: {
    ...uiMount.computed,

    passwordValidator() {
      const value = this.form.password?.trim();
      if (!value.length) {
        return "Required";
      }
      if (value.length < 6) {
        return "Min length is 6";
      }
      return true;
    },

    user() {
      return this.$store.state.user;
    },

    supabase() {
      return this.$store.getters.supabase;
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

  created() {
    this.showComplete = false;
    this.submitting = false;
  },

  beforeMount() {
    const hash = this.$store.state.initialRoute.hash;
    if (!/&type=recovery/i.test(hash) && !this.supabase.auth.user()) {
      this.$router.push("/");
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: "Reset Password",
      });
    });

    this.mountSelf();
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
    const scoping = { "data-rpd-pg": "" };
    const p = (d, c) => h("p", d, c);
    const span = (d, c) => h("span", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const input = (d, c) => h("ui-input", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const Input = (d) => h("input", d);
    const transition = (d, c) => h("ui-transition", d, c);
    const div = (d, c) => h("div", d, c);
    const main = (d, c) => h("main", d, c);
    const appLoader = (d, c) => h("app-loader", d, c);

    const formField = () => {
      return main(
        {
          key: "form-field",
          attrs: { ...scoping },
          staticClass: "form-field",
        },
        [
          p(
            {
              attrs: { ...scoping },
              staticClass: "greeting",
            },
            [
              span(
                {
                  attrs: { ...scoping },
                  staticClass: "greet",
                },
                `Good ${this.$greeting} `
              ),
              span(
                {
                  attrs: { ...scoping },
                  staticClass: "name",
                },
                [this.user.name]
              ),
              ",",
            ]
          ),

          p(
            {
              attrs: { ...scoping },
              staticClass: "desc",
            },
            `Reset your password below.`
          ),

          form(
            {
              attrs: { ...scoping },
              staticClass: "form",
              props: {
                submitText: "Reset Password",
                submitData: {
                  props: {
                    background: "info",
                    actionButton: true,
                    block: true,
                    flat: true,
                    disabled: this.submitting,
                  },
                  attrs: { ...scoping },
                  staticClass: "submit",
                },
              },
              on: {
                "submit-form": async () => {
                  this.submitting = true;

                  const { user, error } = await this.supabase.auth.update({
                    password: this.form.password,
                    data: { name: this.user.name },
                  });

                  this.submitting = false;

                  if (!error && user?.aud == "authenticated") {
                    window.scrollTo(0, 0);

                    await sleep.call(this, 16);

                    this.showComplete = true;

                    !this.form.keepMeSignedIn && this.supabase.auth.signOut();

                    await sleep.call(this, 300);

                    this.form.password = "";
                    this.form.confirmPassword = "";
                  }
                },
              },
            },
            [
              this.submitting &&
                appLoader({ slot: "submitText", props: { size: "1.5rem" } }),
              Input({
                attrs: {
                  ...scoping,
                  autocomplete: "username",
                  value: this.user.email || "user",
                  placeholder: "Username",
                  title: "username",
                },
                staticClass: "sr-only",
              }),
              [
                {
                  label: "New password",
                  placeholder: "6+ characters",
                  vmodel: "password",
                  validator: () => this.passwordValidator,
                  showPassword: "showPassword",
                  required: true,
                  autocomplete: "new-password",
                  disabled: this.submitting,
                },
                {
                  label: "Confirm password",
                  placeholder:
                    this.passwordValidator === true
                      ? "Must match new password"
                      : "Enter a valid password",
                  vmodel: "confirmPassword",
                  disabled: this.passwordValidator !== true || this.submitting,
                  validator: (e) => {
                    const value = e?.trim();
                    if (!value.length) {
                      return "Required";
                    }
                    if (this.passwordValidator !== true) {
                      return "Invalid password";
                    }
                    if (e !== this.form.password) {
                      return "Passwords must match";
                    }
                    return true;
                  },
                  showPassword: "showConfirmPassword",
                  required: true,
                  autocomplete: "new-password",
                },
                {
                  label: "Keep me signed in",
                  vmodel: "keepMeSignedIn",
                  validator: () => true,
                  type: "switch",
                  required: false,
                  topSlot: false,
                  hint: this.form.keepMeSignedIn
                    ? "You will be automatically signed in after resetting your password"
                    : `You won't be signed in after resetting your password`,
                  disabled: this.submitting,
                },
              ].map((item, key) => {
                return input({
                  key,
                  props: {
                    label: item.label,
                    type: item.type || "password",
                    placeholder: item.placeholder,
                    vmodel: this.form[item.vmodel],
                    validator: item.validator,
                    disabled: item.disabled,
                    showPassword: this.form[item.showPassword],
                    hint: item.hint,
                    topSlot: item.topSlot,
                    required: item.required,
                    id: item.label.replace(/\s+/g, "-").toLowerCase(),
                    autocomplete: item.autocomplete,
                  },
                  on: {
                    vmodel: (e) => {
                      this.form[item.vmodel] = e;
                    },
                    "append-click": () => {
                      this.form[item.showPassword] = !this.form[
                        item.showPassword
                      ];
                    },
                  },
                });
              }),
            ]
          ),
        ]
      );
    };

    const completed = () => {
      return div(
        {
          key: "completed",
          attrs: { ...scoping },
          staticClass: "completed",
        },
        [
          h("svg-checked", { attrs: { ...scoping }, staticClass: "checked" }),
          p(
            {
              attrs: { ...scoping },
              staticClass: "c-desc",
            },
            [`Your password has been succesfully updated!`]
          ),

          div(
            {
              attrs: { ...scoping },
              staticClass: "actions-wrapper",
            },
            [
              {
                text: this.form.keepMeSignedIn ? "View Account" : "View Shop",
                background: "info",
                to: "/profile",
              },
              {
                text: this.form.keepMeSignedIn ? "View Account" : "Exit PRD",
                color: "info",
                to: "/",
                isBtn: !this.form.keepMeSignedIn,
              },
            ]
              .sort((a, b) => (this.form.keepMeSignedIn ? a - b : b - a))
              .map((item, key) => {
                return btn(
                  {
                    key,
                    props: {
                      background: item.background,
                      color: item.color,
                      tag: item.isBtn ? undefined : "nuxt-link",
                      to: item.to,
                      actionButton: true,
                      flat: true,
                    },
                    attrs: { ...scoping },
                    staticClass: `action action-${key + 1}`,
                    on: item.isBtn
                      ? {
                          "!click": () =>
                            (window.location.href = "about:blank"),
                        }
                      : undefined,
                  },
                  item.text
                );
              })
          ),
        ]
      );
    };

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root",
      },
      [
        transition({
          props: {
            transition: {
              leave: "slide-y(1rem)",
              enter: "slide-y(-1rem)",
            },
            ease: "ease",
          },
          scopedSlots: {
            default: () => {
              return [this.showComplete ? completed() : formField()];
            },
          },
        }),
      ]
    );
  },
};
</script>

<style>
.root[data-rpd-pg] {
  margin-top: var(--header-height);
  isolation: isolate;
  min-height: calc(100vh - var(--header-height));
  padding: 2.5rem 1.5rem 1.5rem;
  background: var(--theme-primary);
}

.greeting[data-rpd-pg] {
  margin-bottom: 0.75rem;
}

.greet[data-rpd-pg] {
  font-size: 1.25rem;
  opacity: var(--t-body);
}

.name[data-rpd-pg] {
  font-size: 1.35rem;
  font-weight: 600;
  opacity: var(--t-title);
}

.desc[data-rpd-pg] {
  opacity: var(--t-subtitle);
}

.form[data-rpd-pg] {
  max-width: 612px;
  margin: 3rem auto 0;
  display: grid;
}

.form[data-rpd-pg] > .root[data-uiit] {
  margin-right: 0 !important;
}

.submit[data-rpd-pg] {
  margin-top: 2rem;
  width: calc(100% - 3rem) !important;
  justify-self: center;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.completed[data-rpd-pg] {
  display: grid;
  grid-template-rows: min(200px, 20vmax) auto auto;
  row-gap: 2rem;
}

.checked[data-rpd-pg],
.checked[data-rpd-pg] > svg {
  width: 100%;
  height: 100%;
  color: var(--success);
}

.c-desc[data-rpd-pg] {
  text-align: center;
  font-size: 1.35rem;
  opacity: var(--t-title);
  margin-top: 1rem;
  line-height: 1.5;
}

.actions-wrapper[data-rpd-pg] {
  display: grid;
  row-gap: 1.5rem;
  justify-items: center;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.action[data-rpd-pg] {
  min-width: 256px !important;
}
</style>
