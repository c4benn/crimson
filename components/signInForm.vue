<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "SignInForm",
  props: {
    emailValidator: {
      type: Function,
      required: true,
    },
    passwordValidator: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    form: {
      email: "",
      password: "",
      showPassword: false,
      remember: false,
    },
    signingIn: false,
    signInMessage: "",
    showAlert: false,
    alertTimeStamp: null,
    forgotPasswordAttention: false,
  }),

  computed: {
    supabase() {
      return this.$store.getters.supabase;
    },
    user() {
      return this.$store.state.user;
    },
  },

  watch: {
    showAlert(n) {
      if (n) {
        this.forgotPasswordAttention = false;

        if (!/invalid\s+email\s+or\s+password/i.test(this.signInMessage)) {
          return;
        }

        requestAnimationFrame(async () => {
          await sleep.call(this, 450);
          this.forgotPasswordAttention = true;
        });
      }
    },
  },

  created() {
    this.showAlert = this.user.session;
  },

  render(h) {
    const scoping = { "data-sifm": "" };
    const div = (d, c) => h("div", d, c);
    const p = (d, c) => h("p", d, c);
    const textDivide = (d, c) => h("text-divide", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const input = (d) => h("ui-input", d);
    const btn = (d, c) => h("ui-btn", d, c);
    const appLoader = (d) => h("app-loader", d);
    const uiAlert = (d, c) => h("ui-alert", d, c);

    return div(
      {
        attrs: {
          ...scoping,
        },
        staticClass: "root",
      },
      [
        this.$slots.prepend,
        [
          this.$slots.socials,
          uiAlert(
            {
              props: {
                background: this.user.session ? "warning" : "error",
                icon: this.user.session
                  ? "alert"
                  : !this.$nuxt.isOnline ||
                    /network.+failed/i.test(this.signInMessage)
                  ? "wifi-strength-1-alert"
                  : /email\s+not\s+confirmed/i.test(this.signInMessage)
                  ? "account-alert"
                  : "shield-alert",
                closeIcon: "close",
              },
              class: ["alert", { __visible: this.showAlert }],
              attrs: { ...scoping },
              on: {
                "close-alert": () => {
                  this.showAlert = false;
                },
              },
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "alert-info",
                },
                [
                  p(
                    {
                      attrs: { ...scoping },
                      staticClass: "alert-header",
                    },
                    this.user.session
                      ? "Already signed in"
                      : !this.$nuxt.isOnline
                      ? "Network error"
                      : `Can't sign you in`
                  ),
                  p({
                    attrs: { ...scoping },
                    staticClass: "alert-desc",
                    domProps: {
                      innerHTML: this.user.session
                        ? `<q>${
                            this.user?.email || "Your current account"
                          }</q> will be signed out.`
                        : !this.$nuxt.isOnline
                        ? `Check your internet connection and try again`
                        : this.signInMessage,
                    },
                  }),
                ]
              ),
            ]
          ),

          form(
            {
              props: {
                submitData: {
                  attrs: { ...scoping },
                  props: {
                    background: "info",
                    flat: true,
                    disabled: this.signingIn,
                  },
                  staticClass: "submit",
                },
                submitText: "Sign in",
                name: "sign in",
              },
              attrs: {
                ...scoping,
                "aria-label": "sign in",
                action: ".",
                autocomplete: "on",
              },
              staticClass: "form sign-in fill-before",
              class: [
                {
                  "alert-visible": this.showAlert,
                },
              ],
              on: {
                "submit-form": async () => {
                  this.forgotPasswordAttention = false;

                  this.signingIn = true;

                  this.$emit("signing-in");

                  this.$store.commit("LOCAL_STORAGE", {
                    innerPath: "user",
                    path: "remember",
                    value: this.form.remember,
                  });

                  if (this.showAlert) {
                    this.showAlert = false;
                    await sleep.call(this, 400);
                  }

                  try {
                    this.supabase.auth.user() && this.supabase.auth.signOut();

                    this.supabase.auth
                      .signIn({
                        email: this.form.email,
                        password: this.form.password,
                      })
                      .then((r) => {
                        this.signingIn = false;
                        if (!r.error) {
                          if (r.session) {
                            this.$emit("signed-in");

                            this.$nextTick(() =>
                              this.$emit("updateTemplate", "signed-in")
                            );
                          }
                        } else {
                          this.signInMessage = r.error.message;
                          this.$nextTick(() => {
                            this.alertTimeStamp = performance.now();
                            this.showAlert = true;
                          });
                        }
                      });
                  } catch (e) {
                    if (e) {
                      console.log(e);
                    }
                  }
                },
              },
            },
            [
              this.signingIn &&
                div(
                  { staticClass: "submit-button-wrapper", slot: "submitText" },
                  [
                    appLoader({
                      props: { size: "1.5rem" },
                      staticClass: "loader",
                    }),
                    `Signing in`,
                  ]
                ),
              input({
                props: {
                  readonly: this.signingIn,
                  label: "Email",
                  autocomplete: "email",
                  id: "delivery-sign-in-email",
                  vmodel: this.form.email,
                  validator: this.emailValidator,
                  pattern:
                    "^\\s*?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\s*?$",
                  placeholder: "example@domain",
                  type: "email",
                },
                on: {
                  vmodel: (e) => {
                    this.form.email = e;
                  },
                },
              }),

              input({
                props: {
                  readonly: this.signingIn,
                  label: "Password",
                  type: "password",
                  id: "delivery-sign-in-password",
                  vmodel: this.form.password,
                  validator: this.passwordValidator,
                  pattern: ".+",
                  showPassword: this.form.showPassword,
                  autocomplete: "current-password",
                  placeholder: "6+ characters",
                  showPasswordToggleAlert: this.forgotPasswordAttention,
                },
                on: {
                  vmodel: (e) => {
                    this.form.password = e;
                  },
                  "append-click": () => {
                    this.form.showPassword = !this.form.showPassword;
                  },
                  "password-blurred": () => {
                    this.forgotPasswordAttention = false;
                  },
                },
              }),

              btn(
                {
                  props: {
                    size: "sm",
                    color: "secondary",
                    text: true,
                    tag: "div",
                  },
                  attrs: {
                    ...scoping,
                    title: "forgot password",
                  },
                  staticClass: "forgot-password",
                  class: [{ "bounce-top": this.forgotPasswordAttention }],
                  on: {
                    "!click": () => {
                      this.$emit("forgot-password");
                    },
                  },
                },
                `Forgot password?`
              ),

              input({
                props: {
                  label: "Remember me",
                  id: "delivery-save-info",
                  type: "switch",
                  vmodel: this.form.remember,
                  required: false,
                  validator: () => {
                    return true;
                  },
                  topSlot: false,
                  hint: this.form.remember
                    ? `Your login info will be remembered on this device.`
                    : `You will need to login on your next visit.`,
                },
                on: {
                  vmodel: (e) => {
                    this.form.remember = e;
                  },
                },
              }),

              div(
                {
                  slot: "append",
                  attrs: { ...scoping },
                  staticClass: "form-append",
                },
                [
                  textDivide({ staticClass: "divide" }, [`New user?`]),
                  btn(
                    {
                      props: {
                        text: true,
                        color: "info",
                        block: true,
                        // tag: "div",
                        simpleButton: true,
                        filledText: true,
                        actionButton: true,
                        tag: "nuxt-link",
                        to: `${this.$route.path}?dialog=sign-up`,
                      },
                      style: {
                        opacity: this.signingIn
                          ? "var(--t-disabled)"
                          : undefined,
                      },
                      attrs: { ...scoping, title: "click to sign up" },
                      staticClass: "sign-up-alt",
                      // on: {
                      //   "!click": () => {
                      //     this.$emit("updateTemplate", "sign-up");
                      //   },
                      // },
                    },
                    "Create account"
                  ),
                ]
              ),
            ]
          ),
        ],
      ]
    );
  },
};
</script>

<style>
.root[data-sifm] {
  overflow: hidden;
}

.alert[data-sifm] {
  transition: 0.3s transform;
}

.alert[data-sifm] {
  transition: 0.3s transform;
}

.alert[data-sifm]:not(.__visible) {
  transform: translate3d(0, -70px, 0);
}

.alert-header[data-sifm] {
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--t-title);
  margin-bottom: 0.25rem;
}

.alert-desc[data-sifm] {
  opacity: var(--t-body);
}

.form[data-sifm] {
  margin: 2rem auto 0;
  max-width: 612px;
  position: relative;
  padding: 0 var(--x-padding) 2.5rem;
  display: grid;
  transition: 0.3s transform;
}

.form[data-sifm].alert-visible {
  margin-bottom: 3rem;
}

.form[data-sifm]:not(.alert-visible) {
  transform: translate3d(0, -64px, 0);
}

.forgot-password[data-sifm] {
  margin: -0.75rem 0 1rem !important;
  padding: 2px 8px !important;
  animation-duration: 1.5s;
}

.submit[data-sifm],
.sign-up-alt[data-sifm] {
  width: calc(100% - 3rem) !important;
  margin: 2.75rem auto;
  justify-self: center;
}

.submit[data-sifm] .loader {
  margin-right: 1rem;
}

.root[data-sifm] .root[data-tde] {
  padding: 0 0.5rem;
}

.root[data-sifm] .content[data-tde] {
  font-size: 1.15rem;
}
</style>
