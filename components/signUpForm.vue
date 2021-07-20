<script>
import { sleep, addUser } from "~/components/utils/main";
// import { sleep } from "~/components/utils";
export default {
  events: ["updateTemplate", "submitting-form", "account-created"],
  name: "SignUpForm",
  props: {
    nameValidator: {
      type: Function,
      required: true,
    },
    emailValidator: {
      type: Function,
      required: true,
    },
    passwordValidator: {
      type: Function,
      required: true,
    },
    creatingAccount: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    formKey: "undefined",
    form: {
      name: "",
      username: "",
      email: "",
      password: "",
      showPassword: false,
      agreed: false,
    },
    creatingAccountComponent: false,
  }),

  computed: {
    supabase() {
      return this.$store.getters.supabase;
    },
  },

  methods: {
    resetSignUp() {
      this.form = {
        name: "",
        username: "",
        email: "",
        password: "",
        showPassword: false,
        agreed: false,
      };
      this.formKey = performance.now();
    },
  },

  render(h) {
    const scoping = { "data-sufm": "" };
    const div = (d, c) => h("div", d, c);
    const textDivide = (d, c) => h("text-divide", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const input = (d) => h("ui-input", d);
    const btn = (d, c) => h("ui-btn", d, c);
    const appLoader = (d, c) => h("app-loader", d, c);

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
          form(
            {
              key: this.formKey,
              props: {
                name: "sign up",
                submitData: {
                  attrs: { ...scoping },
                  props: {
                    background: "info",
                    flat: true,
                    disabled:
                      this.creatingAccount || this.creatingAccountComponent,
                  },
                  staticClass: "submit",
                },
                submitText: "Create Account",
              },
              attrs: {
                ...scoping,
                action: ".",
                autocomplete: "on",
                "aria-label": "create account",
              },
              staticClass: "form fill-before",
              on: {
                "submit-form": () => {
                  this.creatingAccountComponent = true;

                  this.$emit("submitting-form");

                  this.supabase.auth.user() && this.supabase.auth.signOut();

                  this.supabase.auth
                    .signUp({
                      email: this.form.email,
                      password: this.form.password,
                    })
                    .then((r) => {
                      this.creatingAccountComponent = false;
                      if (!r.error) {
                        addUser
                          .call(this, {
                            email: this.form.email,
                            name: this.form.name,
                            user: r?.user || {},
                          })
                          .then(async (res) => {
                            if (res.status == 201) {
                              this.$emit("account-created", this.form);

                              this.$store.commit("UPDATE_", {
                                name: "user",
                                value: {
                                  ...this.$store.state.user,
                                  ...r?.user,
                                },
                              });

                              this.$emit("updateTemplate", "account-created");

                              this.$store.commit("UPDATE_", {
                                value: {
                                  ...this.$store.state.user,
                                  awaitingSignIn: {
                                    email: this.form.email,
                                    password: this.form.password,
                                  },
                                },
                                name: "user",
                              });

                              await sleep.call(this, 200);
                              this.resetSignUp();
                              this.$nextTick(() => {
                                this.$emit("reset-form");
                              });
                            }
                          });
                      }
                    });
                },
              },
            },
            [
              (this.creatingAccount || this.creatingAccountComponent) &&
                div(
                  { staticClass: "submit-button-wrapper", slot: "submitText" },
                  [
                    appLoader({
                      props: { size: "1.5rem" },
                      staticClass: "loader",
                    }),
                    `Creating Account`,
                  ]
                ),
              [
                {
                  label: "Name",
                  validator: this.nameValidator,
                  placeholder: "Egwu Sade",
                },
                {
                  label: "Email",
                  pattern:
                    "^\\s*?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\s*?$",
                  type: "email",
                  validator: this.emailValidator,
                  placeholder: "example@domain",
                  hint: "You will need to verify your email",
                },
                {
                  label: "Password",
                  autocomplete: "new-password",
                  placeholder: "6+ characters",
                  showPassword: this.form.showPassword,
                  type: "password",
                  validator: this.passwordValidator,
                  hint:
                    this.form.password &&
                    this.passwordValidator(this.form.password) === true &&
                    !this.form.showPassword
                      ? "Double check your password"
                      : undefined,
                  attentionHint: true,
                  passwordToggle: {
                    class: {
                      "heart-beat delayed":
                        this.passwordValidator(this.form.password) === true,
                    },
                  },
                },
              ].map((item, key) => {
                const lowerCaseLabel = item.label.toLowerCase();

                const events = {
                  vmodel: (e) => {
                    this.form[lowerCaseLabel] = e;
                    this.form.agreed = false;
                  },
                };

                if (lowerCaseLabel == "password") {
                  events["append-click"] = () => {
                    this.form.showPassword = !this.form.showPassword;
                  };
                }

                const asyncValidator =
                  item.label == "Email"
                    ? async (e) => {
                        try {
                          const {
                            data: users,
                            error,
                          } = await this.supabase.from("users").select("email");

                          const asyncValidate = {
                            valid: null,
                            message: null,
                          };

                          if (users && !error) {
                            const findEmail = users?.find?.(
                              (x) => x.email.toLowerCase?.() == e.toLowerCase()
                            );

                            if (findEmail) {
                              asyncValidate.valid = false;
                              asyncValidate.message = "Account exists";
                            } else {
                              asyncValidate.valid = true;
                              asyncValidate.message = "";
                            }
                          } else {
                            asyncValidate.valid = false;
                            asyncValidate.message = "Error fetching";
                          }

                          return asyncValidate;
                        } catch (e) {
                          console.log(e);
                          if (e) {
                            const networkErr = /network request failed/i.test(
                              e.message
                            );
                            return {
                              valid: false,
                              message:
                                networkErr || !this.$nuxt.isOnline
                                  ? "Network error"
                                  : "Error",
                            };
                          }
                        }
                      }
                    : undefined;

                return input({
                  key,
                  props: {
                    readonly: this.creatingAccountComponent,
                    type: item.type || "text",
                    label: item.label,
                    autocomplete: item.autocomplete || lowerCaseLabel,
                    id: `sign-up-${lowerCaseLabel}`,
                    vmodel: this.form[lowerCaseLabel],
                    validator: item.validator,
                    pattern: item.pattern || ".+",
                    showPassword: item.showPassword,
                    placeholder: item.placeholder,
                    asyncValidator,
                    hint: item.hint,
                    attentionHint: item.attentionHint,
                    passwordToggle: item.passwordToggle,
                  },
                  on: { ...events },
                });
              }),

              input({
                props: {
                  label: "Agree to terms and conditions",
                  id: "delivery-agreed",
                  type: "switch",
                  vmodel: this.form.agreed,
                  required: true,
                  validator: (e) => {
                    if (!e) {
                      return "Required";
                    }
                    return true;
                  },
                  hint: `By signing up, you have agreed to our <span>terms and conditions</span>`,
                },
                on: {
                  vmodel: (e) => {
                    this.form.agreed = e;
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
                  textDivide([`Have an account?`]),
                  btn(
                    {
                      props: {
                        text: true,
                        color: "info",
                        tag: "nuxt-link",
                        to: `${this.$route.path}?dialog=sign-in`,
                        filledText: true,
                        actionButton: true,
                      },
                      style: {
                        opacity: this.creatingAccount
                          ? "var(--t-disabled)"
                          : undefined,
                      },
                      attrs: { ...scoping, title: "click to sign in" },
                      staticClass: "sign-in-alt",
                      // on: {
                      //   "!click": () => {
                      //     this.$emit("updateTemplate", "sign-in");
                      //   },
                      // },
                    },
                    ["Sign in"]
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
.form[data-sufm] {
  margin: 2rem auto 4rem;
  position: relative;
  padding: 0 var(--x-padding) 2.5rem;
  display: grid;
  max-width: 612px;
}

.submit[data-sufm],
.sign-in-alt[data-sufm] {
  width: calc(100% - 3rem);
  display: flex;
  max-width: 612px;
  margin: 2.75rem auto;
}

.submit[data-sufm] .loader {
  margin-right: 1rem;
}

.root[data-sufm] .root[data-tde] {
  padding: 0 0.5rem;
}

.root[data-sufm] .content[data-tde] {
  font-size: 1.15rem;
}

.root[data-sufm] .heart-beat.delayed {
  animation-delay: 1.2s;
}

.root[data-sufm] .sign-up-password .input-hint {
  color: var(--hint-color);
}
</style>
