<script>
import { emailValidator, sleep } from "~/components/utils/main";
export default {
  name: "ForgotPassword",

  props: {
    vmodel: Boolean,
  },
  data() {
    return {
      transitionState: "",
      form: {
        email: "",
      },
      recoverErrorMessage: "",
      waiting: false,
      alertHeight: undefined,
      alertHeightSet: 0,
    };
  },
  computed: {
    v_model() {
      const toggle = (val) =>
        this.$emit("vmodel", typeof val == "undefined" ? !this.vmodel : val);
      return {
        isActive: this.vmodel,
        open: () => toggle(true),
        close: () => requestAnimationFrame(() => toggle(false)),
        toggle,
      };
    },
    supabase() {
      return this.$store.getters.supabase;
    },
    countdown() {
      return this.$store.state.forgotPasswordTimeout;
    },
  },
  watch: {
    transitionState() {
      this.$emit("transition-state", this.transitionState);
    },
  },

  methods: {
    resetComponent() {
      this.form = {
        email: "",
      };
      this.recoverErrorMessage = "";
      this.waiting = false;
      this.alertHeight = undefined;
      this.alertHeightSet = 0;
      this.showAlert = false;
    },
  },

  render(h) {
    const scoping = { "data-fpd": "" };
    const modal = (d, c) => h("ui-sheet", d, c);
    const p = (d, c) => h("p", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const h4 = (d, c) => h("h4", d, c);
    const h5 = (d, c) => h("h5", d, c);
    const div = (d, c) => h("div", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const input = (d) => h("ui-input", d);
    const btn = (d, c) => h("ui-btn", d, c);
    const appLoader = (d, c) => h("appLoader", d, c);
    const uiAlert = (d, c) => h("ui-alert", d, c);

    return modal({
      attrs: { ...scoping },
      props: {
        label: "forgot password",
        vmodel: this.vmodel,
        transition: {
          transition: "slide-y",
          fade: false,
          duration: { enter: "500", leave: "400" },
          delay: { enter: 20 },
        },
        backdrop: this.$theme.light ? 0.5 : 0.35,
        contentClass: "forgot-password-main",
        contentAttrs: { ...scoping },
        background: this.$theme.dark ? "theme-surface" : undefined,
      },
      on: {
        vmodel: (e) => {
          this.$emit("vmodel", e);
        },
        "&mousedown": (e) => {
          e.stopPropagation();
        },

        "&keyup": (e) => {
          e.stopPropagation();
        },

        afterLeave: this.resetComponent,

        beforeEnter: this.resetComponent,
      },
      staticClass: "root",
      class: [{ active: this.vmodel }],
      scopedSlots: {
        default: (payload) => {
          this.transitionState = payload.state;
          return div(
            {
              attrs: { ...scoping },
              staticClass: "content-wrapper",
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "header sheet-header fill-before-and-after",
                  on: {
                    "!click": () => {
                      requestAnimationFrame(() => {
                        this.$refs["item-wrapper"]?.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      });
                    },
                  },
                },
                [
                  h1(
                    {
                      attrs: {
                        ...scoping,
                        "aria-hidden": !this.vmodel ? "true" : undefined,
                        "aria-label": this.vmodel
                          ? undefined
                          : "forgot password",
                      },
                      staticClass: "heading sheet-heading line-clamp-1",
                    },
                    `Forgot password`
                  ),

                  btn(
                    {
                      props: {
                        size: "md",
                        text: true,
                        persistent: true,

                        // color: "primary",
                      },
                      attrs: { ...scoping },
                      staticClass: "close-btn sheet-close-btn",
                      on: {
                        click: (e) => {
                          e.stopPropagation();
                          this.v_model.close();
                        },
                      },
                    },
                    "Close"
                  ),

                  // icon({
                  //   props: {
                  //     name: "close",
                  //     clickable: true,
                  //   },
                  //   attrs: { ...scoping },
                  //   staticClass: "close-btn",
                  //   on: {
                  // click: (e) => {
                  //   e.stopPropagation();
                  //   this.v_model.close();
                  // },
                  //   },
                  // }),
                ]
              ),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: "main fill-before",
                },
                [
                  div(
                    {
                      attrs: { ...scoping },
                      staticClass: "title-wrapper",
                    },
                    [
                      h3(
                        {
                          attrs: { ...scoping },
                          staticClass: "title",
                        },
                        `Good ${this.$greeting}`
                      ),
                      h4(
                        { attrs: { ...scoping }, staticClass: "subtitle" },
                        `Let's help you recover your password.`
                      ),
                      h5(
                        { attrs: { ...scoping }, staticClass: "caption" },
                        `Enter your email below.`
                      ),
                    ]
                  ),

                  div(
                    {
                      attrs: {
                        ...scoping,
                      },
                      staticClass: "form-wrapper",
                      style: {
                        "--translate-y": this.alertHeight,
                        "--duration": this.alertHeightSet < 2 ? "0s" : "0.3s",
                      },
                    },
                    [
                      uiAlert(
                        {
                          ref: "alert",
                          props: {
                            background: "success",
                            icon: "check",
                          },
                          attrs: { ...scoping },
                          class: [
                            "alert",
                            { "__hidden invisible": !this.showAlert },
                          ],
                          on: {
                            "alert-height": (e) => {
                              this.alertHeight = `-${e + 1}px`;
                              this.alertHeightSet++;
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
                                `Recovery email sent`
                              ),
                              p(
                                {
                                  attrs: { ...scoping },
                                  staticClass: "alert-desc",
                                },
                                `You'll recieve a confirmation from an email that ends with "supabase.io".`
                              ),
                              p({
                                attrs: { ...scoping },
                                staticClass: "alert-desc",
                                domProps: {
                                  innerHTML: `Kindly click on the confirmation link, and you'll be redirected to set a new password. ✌`,
                                },
                              }),
                            ]
                          ),
                        ]
                      ),

                      form(
                        {
                          props: {
                            name: "forgot-password",
                            submitData: {
                              attrs: { ...scoping },
                              staticClass: "action",
                              props: {
                                background: "info",
                                flat: true,
                                disabled:
                                  this.waiting || !!this.countdown.count,
                                actionButton: true,
                              },
                            },
                            submitText: this.countdown.count
                              ? "Please Wait"
                              : `Send recovery link`,
                          },
                          attrs: {
                            ...scoping,
                            action: ".",
                            autocomplete: "on",
                          },
                          staticClass: "form fill-before",
                          class: [
                            {
                              "alert-visible": this.showAlert,
                            },
                          ],
                          on: {
                            "submit-clicked": () => {
                              this.recoverErrorMessage = "";
                            },
                            "submit-form": async () => {
                              await sleep.call(this, this.showAlert ? 316 : 0);

                              this.showAlert = false;

                              this.waiting = true;

                              const res = await this.supabase.auth.api.resetPasswordForEmail(
                                this.form.email
                              );

                              this.waiting = false;

                              if (res.error) {
                                return (this.recoverErrorMessage =
                                  res.error.message);
                              }

                              const alertHeight = this.$refs.alert.$el
                                .clientHeight;

                              this.alertHeightSet++;

                              this.$nextTick(() => {
                                this.alertHeight = `-${alertHeight + 1}px`;
                                this.$nextTick(async () => {
                                  this.showAlert = true;

                                  await sleep.call(this, 100);

                                  this.$store.commit("UPDATE_", {
                                    path: "forgotPasswordTimeout",
                                    value: {
                                      email: this.form.email,
                                      count: 0,
                                      timeStamp: performance.now(),
                                    },
                                  });

                                  this.$nextTick(() => {
                                    this.$store.commit("UPDATE_", {
                                      path: "forgotPasswordTimeout",
                                      value: {
                                        email: this.form.email,
                                        count: 60,
                                        timeStamp: performance.now(),
                                      },
                                    });
                                  });
                                });
                              });
                            },
                          },
                        },
                        [
                          this.waiting
                            ? appLoader({
                                slot: "submitText",
                                props: { size: "1.5rem" },
                                staticClass: "loader",
                              })
                            : null,
                          input({
                            props: {
                              readonly: this.waiting,
                              disabled: !!this.countdown.count,
                              label: "Email",
                              autocomplete: "email",
                              id: "recovery-email",
                              vmodel: this.countdown.count
                                ? this.countdown.email
                                : this.form.email,
                              type: "email",
                              placeholder: "example@domain",
                              hint: "The email you used in signing up",
                              validator: (e) => {
                                if (this.recoverErrorMessage) {
                                  if (
                                    /60\s+seconds/i.test(
                                      this.recoverErrorMessage
                                    )
                                  ) {
                                    return `Try again in 60 seconds`;
                                  }
                                  return this.recoverErrorMessage;
                                }
                                return emailValidator(e);
                              },
                            },
                            on: {
                              vmodel: (e) => {
                                this.form.email = e;

                                this.recoverErrorMessage = "";
                              },
                            },
                          }),

                          this.countdown.count
                            ? p(
                                {
                                  slot: "append",
                                  attrs: { ...scoping },
                                  staticClass: "countdown",
                                },
                                `Resend verification link in ${
                                  this.countdown.count
                                } second${this.countdown.count > 1 ? "s" : ""}`
                              )
                            : null,
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          );
        },
      },
    });
  },
};
</script>

<style>
.root[data-fpd] {
  z-index: inherit;
  -webkit-overflow-scrolling: touch;
}

.root[data-fpd] .sheet-header::after {
  background: var(--theme-primary);
  z-index: -1;
}

/* .root[data-fpd] {
  --background-elem-background: var(--theme-surface) !important;
} */

.forgot-password-main[data-fpd] {
  height: var(--full-dialog);
}

.content-wrapper[data-fpd] {
  height: 100%;
}
/* 
.header[data-fpd] {
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 1rem;
}

.header[data-fpd]::before {
  border-bottom: var(--ui-divide);
}

.heading[data-fpd] {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn[data-fpd] {
  position: absolute;
  right: 1rem;
} */

/* .close-btn[data-fpd]:not(:active)::before {
    opacity: 0.05;
  } */

@media (hover: hover) and (pointer: fine) {
  .close-btn[data-fpd]:not(:hover):not(:focus)::before {
    opacity: 0.05;
  }
}

.main[data-fpd] {
  padding-top: 0.5rem;
  height: calc(100% - calc(var(--sheet-header-height) + 0.5px));
  position: relative;
}

.title-wrapper[data-fpd] {
  text-align: center;
  margin: 2.5rem 0 1.5rem;
}

.title[data-fpd] {
  font-size: 1.65rem !important;
  font-weight: 500 !important;
  opacity: var(--t-body);
  margin-bottom: 1rem;
}

.subtitle[data-fpd] {
  font-size: 1rem;
  font-weight: 500;
  opacity: var(--t-subtitle);
  margin-bottom: 0.75rem;
}

.caption[data-fpd] {
  font-size: 0.95rem;
  font-weight: 400;
  opacity: var(--t-caption);
}

.form-wrapper {
  overflow: hidden;
  max-width: 612px;
  margin: 2rem auto 0;
}

.alert[data-fpd] {
  transition: var(--duration) transform;
}

.alert[data-fpd].__hidden {
  transform: translate3d(0, var(--translate-y), 0);
}

.alert-header[data-fpd] {
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--t-title);
  margin-bottom: 0.25rem;
}

.alert-desc[data-fpd] {
  font-size: 0.975rem;
  opacity: var(--t-title);
  margin-bottom: 0.25rem;
}

.form[data-fpd] {
  padding: 0 1.5rem;
  margin-top: 1.5rem;
  display: grid;
  transition: var(--duration) transform;
}

.form[data-fpd]:not(.alert-visible) {
  transform: translate3d(0, var(--translate-y), 0);
}

.form[data-fpd] > .root[data-uiit] {
  margin-right: 0 !important;
}

.action[data-fpd] {
  width: calc(100% - 3rem) !important;
  justify-self: center;
  margin-top: 2rem;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.countdown[data-fpd] {
  margin-top: 1rem;
  letter-spacing: 0.1px;
  opacity: var(--t-caption);
  font-size: 0.975rem;
  text-align: center;
}
</style>
