<script>
/* eslint-disable promise/param-names */
/* eslint-disable promise/param-names */
import { sleep, emailValidator, springPresets } from "~/components/utils/main";
export default {
  name: "BagPageDialog",

  data() {
    return {
      newUser: null,
      signUpFromKey: "undefined",
      creatingAccount: false,
      signinIn: false,
      form: {
        anonymousDelivery: {
          name: "",
          phone: "",
          email: "",
          country: "Nigeria",
          state: "Lagos",
          city: "",
          address: "",
          save: false,
          isCorrect: false,
        },
        signIn: {
          name: "",
          password: "",
          showPassword: false,
          remember: false,
        },
        signUp: {
          name: "",
          username: "",
          email: "",
          password: "",
          showPassword: false,
          agreed: false,
        },
      },
      showAppendDialog: false,
      selectDialogTemplate: {
        label: "",
        selected: "",
      },

      // willchange is for animating the main dialog when select is active.
      addWillChange: false,

      anonymousOrderCompleted: false,

      anonymousOrderCompletedText: "",

      initialTemplate: "",

      appendIntersection: {
        entries: {},
      },

      appendTransitionState: "",

      transformTransition: undefined,

      transformValue: undefined,

      toAndFromTransformValues: {
        to: {
          scaleX: 0.95,
          scaleY: 0.975,
          translateY: -1,
        },
        from: {
          scaleX: 1,
          scaleY: 1,
          translateY: 0,
        },
      },
      showHeaderText: null,
    };
  },

  computed: {
    signedIn() {
      return /signed-in/i.test(this.dialogObject.template);
    },
    accountCreated() {
      return /account-created/i.test(this.dialogObject.template);
    },
    dialogObject() {
      return this.$store.state.vmodel.dialogs.bagPage;
    },
    fetchedStates() {
      return this.$store.state.bagPageFetchedStates;
    },
    supabase() {
      return this.$store.getters.supabase;
    },
    user() {
      return this.$store.state.user;
    },
    showBanner() {
      if (/^anonymous|^sign-/i.test(this.dialogObject.template)) {
        return !this.supabase.auth.user();
      }

      return false;
    },
    deliveryInfoTemplate() {
      return /^delivery-info$/i.test(this.dialogObject.template);
    },
    dialogTitle() {
      return this.signedIn
        ? this.user.session
          ? "Welcome back"
          : ""
        : this.accountCreated
        ? "Confirm email"
        : /anonymous/i.test(this.dialogObject.template)
        ? "Delivery info"
        : /sign-up/i.test(this.dialogObject.template)
        ? "Create account"
        : /^delivery/i.test(this.dialogObject.template)
        ? "Delivery info"
        : "Sign in";
    },
  },

  watch: {
    $route(t, f) {
      if (t.path == "/bag") {
        if (!t.query?.dialog) {
          return this.$nextTick(() => {
            this.$store.commit("V_MODEL", {
              value: {
                template: this.dialogObject.template,
                active: false,
              },
              path: "bagPage",
              innerPath: "dialogs",
            });
          });
        }
        this.triggerRouteQuery({ f, t });
      }
    },
    async showAppendDialog() {
      this.addWillChange = true;
      requestAnimationFrame(() => {
        this.transformValue = this.showAppendDialog
          ? `translate3d(0, -0.75rem, 0) scale3d(0.925,0.925,1)`
          : `translate3d(0, 0, 0) scale3d(1, 1, 1)`;
      });
      await sleep.call(this, 516);
      this.addWillChange = false;
      requestAnimationFrame(() => {
        if (!this.showAppendDialog) {
          this.transformValue = undefined;
        }
      });
    },
    async "form.state"() {
      await sleep.call(this, 516);

      this.form.anonymousDelivery.city = "";
    },
    appendIntersection() {
      if (/afterE/i.test(this.appendTransitionState)) {
        let ratio = this.appendIntersection.entries?.intersectionRatio;

        if (isNaN(ratio)) {
          ratio = 1;
        }

        const transformY = this.toAndFromTransformValues.to.translateY * ratio;

        this.addWillChange =
          transformY != this.toAndFromTransformValues.to.translateY;

        this.transformValue = `translate3d(0, ${transformY}rem, 0)`;
      }
    },
    appendTransitionState() {
      if (/afterE/i.test(this.appendTransitionState)) {
        this.transformTransition = "0ms";
      } else {
        this.transformTransition = undefined;
      }
    },

    dialogObject(n, o) {
      this.$nextTick(() => {
        if (n.active == o.active) {
          return;
        }

        this.showHeaderText = !this.deliveryInfoTemplate;

        const query = JSON.stringify(this.$route.query);
        const toQuery = JSON.stringify({
          dialog: n.active ? this.dialogObject.template : undefined,
          append: n.active ? this.$route.query.append : undefined,
          banner: n.active ? this.$route.query.banner : undefined,
        });

        if (query == toQuery) {
          return;
        }
        this.$router.push({
          query: JSON.parse(toQuery),
        });
      });
    },
  },

  mounted() {
    this.showHeaderText = !this.deliveryInfoTemplate;

    let validTemplates = /^delivery-info$|^anonymous-order$|^sign-in$|^sign-up$|^account-created$|^signed-in$/i.test(
      this.$route?.query?.dialog
    );

    if (
      (this.$route?.query?.dialog == "account-created" && !this.newUser) ||
      (this.$route?.query?.dialog == "signed-in" && !this.supabase.auth.user())
    ) {
      validTemplates = false;
      this.$router.push({
        query: {},
      });
    }

    if (validTemplates) {
      this.$nextTick(async () => {
        await sleep.call(this, 750, true);
        this.triggerRouteQuery("mounted");
      });
    }
  },

  methods: {
    triggerRouteQuery(caller) {
      const query = this.$route.query;

      const active = /^delivery-info$|^anonymous-order$|^sign-in$|^sign-up$|^account-created$|^signed-in$/i.test(
        query?.dialog
      );

      let append =
        (/^sign-in$/i.test(query?.dialog) &&
          /^forgot-password$/i.test(query?.append)) ||
        (/^delivery-info$|^anonymous-order$/i.test(query?.dialog) &&
          /^choose-state|choose-city$/i.test(query?.append));

      if (append && /^choose-state|choose-city$/i.test(query?.append)) {
        const cantChose =
          this.fetchedStates === null || this.fetchedStates == "Error fetching";
        append = !cantChose;
        if (!append) {
          this.updateTemplate({ append: undefined });
        }
      }

      this.$nextTick(() => {
        this.$store.commit("V_MODEL", {
          value: {
            template: query?.dialog || this.dialogObject.template,
            active,
          },
          path: "bagPage",
          innerPath: "dialogs",
        });

        this.$nextTick(async () => {
          await sleep.call(
            this,
            caller == "mounted" ? 1050 : 0,
            caller == "mounted"
          );
          requestAnimationFrame(() => (this.showAppendDialog = append));
        });
      });
    },

    updateTemplate({
      template = this.dialogObject.template,
      append,
      banner = this.$route.query.banner,
    }) {
      return new Promise((r) => {
        requestAnimationFrame(() => {
          this.$router.push({
            query: {
              dialog: template,
              append,
              banner,
            },
          });
          r(this.$router);
        });
      });
    },

    resetSignUp() {
      this.form.signUp = {
        name: "",
        username: "",
        email: "",
        password: "",
        showPassword: false,
        agreed: false,
      };
      this.signUpFromKey = Date.now();
      this.creatingAccount = false;
    },

    resetSignIn() {
      this.form.signIn = {
        name: "",
        password: "",
        showPassword: false,
        remember: false,
      };
    },

    resetAnonymousForm() {
      this.form.anonymousDelivery = {
        name: "",
        phone: "",
        email: "",
        country: "Nigeria",
        state: "Lagos",
        city: "",
        address: "",
        save: false,
        isCorrect: false,
      };
    },
  },

  render(h) {
    const scoping = { "data-bpdg": "" };
    const modal = (d, c) => h(`ui-sheet`, d, c);
    const div = (d, c) => h("div", d, c);
    const userFeedback = (d, c) => h("userFeedback", d, c);
    const p = (d, c) => h("p", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    // const icon = (d, c) => h("ui-icon", d, c);
    const transition = (d, c) => h("ui-transition", d, c);
    const selectDialog = (d, c) => h("select-dialog", d, c);
    const forgotPassword = (d, c) => h("forgot-password", d, c);
    const dialogObject = this.dialogObject;
    const deliveryForm = (d, c) => h("delivery-form", d, c);
    const signUpForm = (d, c) => h("sign-up-form", d, c);
    const signInForm = (d, c) => h("sign-in-form", d, c);

    const changeTransition = {
      transition:
        this.accountCreated || this.signedIn
          ? {
              enter: "slide-y(-2rem)",
              leave: "slide-y(2rem)",
            }
          : {
              enter: "slide-x(3rem)",
              leave: "slide-x(-1.5rem)",
            },
      duration: { leave: 200, enter: 400 },
      ease: "ease",
      type: { enter: "spring" },
      springConfig: springPresets.savedAnim,
    };

    const passwordValidator = (e) => {
      const value = e?.trim();
      if (!value.length) {
        return "Required";
      }
      if (value.length < 6) {
        return "Min length is 6";
      }
      return true;
    };

    const nameValidator = (e, count = 2) => {
      const value = e?.trim();
      if (!value.length) {
        return "Required";
      }
      if (value.length < count) {
        return `Min length is ${count}`;
      }
      return true;
    };

    const banner = ({ text, template, buttonText, slot, use = false }) => {
      if (!use) {
        return null;
      }

      if (this.$route.query.banner == "false" || this.user.session) {
        return null;
      }

      return [
        p(
          {
            slot,
            attrs: { ...scoping },
            staticClass: "alt-sign-in fill-before",
          },
          [
            text,
            btn(
              {
                props: {
                  simpleButton: true,
                  size: "sm",
                  flat: true,
                  color: "secondary",
                  readonly: this.creatingAccount || this.signinIn,
                },
                attrs: {
                  ...scoping,
                  title: /sign/i.test(template) ? "sign in" : "anonymous order",
                },
                staticClass: "banner-action",
                style: {
                  opacity:
                    this.creatingAccount || this.signinIn
                      ? "var(--t-disabled)"
                      : undefined,
                },
                on: {
                  click: (e) => {
                    e.stopPropagation();
                    if (!this.showBanner) {
                      return this.updateTemplate({
                        template: "",
                      }).then(async () => {
                        await sleep.call(this, 500, true);
                        this.updateTemplate({
                          template: "sign-in",
                          banner: "false",
                        });
                      });
                    }
                    requestAnimationFrame(() =>
                      this.updateTemplate({
                        template,
                      })
                    );
                  },
                },
              },
              buttonText
            ),
          ]
        ),
      ];
    };

    const anonymousDeliveryContent = (payload) => [
      div(
        {
          slot: "prepend",
        },
        [
          banner({
            text: "Wish to sign in instead? ",
            template: "sign-in",
            buttonText: "Sign in",
          }),
          !this.user.session &&
            div(
              {
                attrs: { ...scoping },
                staticClass: "alert fill-before-and-after",
                class: [
                  {
                    "__large rounded": !/xs/i.test(this.$breakpoints.greater),
                    // breakpoint is sm and up.
                    rounded: this.$breakpoints.is == "xs",
                  },
                ],
              },
              [
                p(
                  `Anonymous orders can only be delivered to residents in Lagos.`
                ),
                div(
                  {
                    attrs: { ...scoping },
                    staticClass: "alert-action-wrapper",
                  },
                  [
                    {
                      text: "Sign in",
                      dialog: "sign-in",
                    },
                    { text: "Create account", dialog: "sign-up" },
                  ].map((item, key) => {
                    return btn(
                      {
                        key,
                        attrs: { ...scoping },
                        // staticClass: "alt-sign-in",
                        props: {
                          size: "sm",
                          color: "secondary",
                          text: true,
                        },
                        on: {
                          click: (e) => {
                            e.stopPropagation();

                            this.updateTemplate({
                              template: "",
                            }).then(async () => {
                              await sleep.call(this, 500, true);
                              this.updateTemplate({
                                template: item.dialog,
                                banner: "false",
                              });
                            });
                          },
                        },
                      },
                      item.text
                    );
                  })
                ),
              ]
            ),
        ]
      ),

      deliveryForm({
        props: {
          nameValidator,
          passwordValidator,
          emailValidator,
          payload,
          showAppendDialog: this.showAppendDialog,
          selectDialogTemplate: this.selectDialogTemplate,
          selectValue: this.form.anonymousDelivery.city,
          disableTitleIntersection: !this.deliveryInfoTemplate,
          template: this.deliveryInfoTemplate ? "main" : "anonymous-order",
        },
        on: {
          "title-intersecting": (e) => {
            this.showHeaderText = !e;
          },
          "form-submitted": (e) => {
            this.anonymousOrderCompletedText = `Delivery info ${
              /^add/i.test(e.submitText) ? "added" : "updated"
            }`;

            this.$nextTick(async () => {
              this.anonymousOrderCompleted = true;

              await sleep.call(this, 3000);

              requestAnimationFrame(this.resetAnonymousForm);
            });
          },
          "toggle-select": (item) => {
            this.selectDialogTemplate.label = item;
            this.selectDialogTemplate.selected = this.form[item.toLowerCase()];
            this.$nextTick(() =>
              requestAnimationFrame(() => {
                this.updateTemplate({ append: `choose-${item.toLowerCase()}` });
              })
            );
          },
          "select-vmodel": (e) => {
            this.form.anonymousDelivery[e.label] = e.value;
          },
        },
      }),
    ];

    const signInContent = () => [
      banner({
        slot: "prepend",
        text: "Order without signing in? ",
        template: "anonymous-order",
        buttonText: "Click here",
      }),
      signInForm({
        props: {
          emailValidator,
          passwordValidator,
        },
        on: {
          updateTemplate: (e) => {
            this.updateTemplate({
              template: e,
            });
            this.signinIn = false;
          },
          "forgot-password": () => {
            this.$nextTick(() =>
              requestAnimationFrame(() =>
                this.updateTemplate({ append: "forgot-password" })
              )
            );
          },
          "signing-in": () => {
            this.signinIn = true;
          },
        },
      }),
    ];

    const signUpContent = () => [
      banner({
        slot: "prepend",
        text: "Order without signing up? ",
        template: "anonymous-order",
        buttonText: "Click here",
      }),
      signUpForm({
        props: {
          nameValidator,
          passwordValidator,
          emailValidator,
          creatingAccount: this.creatingAccount,
        },
        on: {
          updateTemplate: (e) => {
            if (e == "account-created") {
              this.updateTemplate({
                template: "account-created",
              });
            } else {
              this.updateTemplate({
                template: "sign-in",
              });
            }
          },
          "submitting-form": () => {
            this.creatingAccount = true;
          },
          "account-created": (e) => {
            this.newUser = e;
          },
        },
      }),
    ];

    const successPage = () => [
      userFeedback({
        props: {
          signedIn: this.signedIn,
          accountCreated: this.accountCreated,
          newUser: this.newUser,
          actions: [
            {
              text: "Fill Delivery Info",
              attrs: {},
              props: {
                background: "info",
                flat: true,
              },
              on: {
                "!click": () => {
                  this.updateTemplate({ template: "" }).then(async () => {
                    await sleep.call(this, 500, true);
                    this.updateTemplate({
                      template: "delivery-info",
                      banner: "false",
                    });
                  });
                },
              },
            },
            {
              text: "View Account",
              attrs: {},
              props: {
                color: "info-text",
                flat: true,
                to: "/",
                tag: "nuxt-link",
                text: true,
              },
            },
          ],
        },
      }),
    ];

    return modal({
      staticClass: "bag-page-dialog-root",
      class: [
        `${dialogObject.template}`,
        {
          "append-active": this.showAppendDialog,
          "append-entered": /afterE|beforeL|^le/i.test(
            this.appendTransitionState
          ),
        },
      ],
      props: {
        label: this.dialogTitle.toLowerCase(),
        vmodel: this.dialogObject.active,
        contentAttrs: { ...scoping },
        contentClass: [
          `bag-page-dialog ${dialogObject.template}`,
          {
            "append-active": this.showAppendDialog,
            "will-change": this.addWillChange,
            "append-entered": /afterE|beforeL|^le/i.test(
              this.appendTransitionState
            ),
          },
        ],
        removePrepend: false,
        contentStyle: {
          "--transform-value": this.transformValue,
        },
        renderBackgroundElem: !this.showAppendDialog,
        useIntersection: !this.showAppendDialog,
      },
      on: {
        vmodel: (e) => {
          const toggle = (value) => {
            this.$store.commit("V_MODEL", {
              value: {
                ...dialogObject,
                active: value,
              },
              path: "bagPage",
              innerPath: "dialogs",
            });
          };

          this.$nextTick(() =>
            requestAnimationFrame(() => {
              toggle(e);
            })
          );
        },
        beforeEnter: () => {
          this.initialTemplate = dialogObject.template;
          this.previousTemplates = [];
          this.anonymousOrderCompleted = false;
          this.creatingAccount = false;
          this.signinIn = false;
        },
        afterLeave: () => {
          this.showAppendDialog = false;
          this.form.anonymousDelivery.isCorrect = false;
          this.anonymousOrderCompleted = false;
          this.creatingAccount = false;
          this.signinIn = false;
        },
      },
      scopedSlots: {
        default: (payload) => {
          return div(
            {
              attrs: { ...scoping },
              staticClass: "root",
              class: [
                {
                  __hidden: !/afterEnter|beforeL|^le/i.test(payload.state),
                  __completed: this.anonymousOrderCompleted,
                  "theme-surface": /afterE/i.test(payload.state),
                },
              ],
            },
            [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "header sheet-header fill-before-and-after",
                  // class: [{ "__hide-before": !this.showHeaderText }],
                  on: {
                    click: (e) => {
                      e.stopPropagation();

                      requestAnimationFrame(() =>
                        this.$refs.main.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        })
                      );
                    },
                  },
                },
                [
                  transition({
                    props: {
                      ...changeTransition,
                      delay: {
                        enter: 50,
                      },
                    },
                    scopedSlots: {
                      default: () => {
                        return h1(
                          {
                            key: `heading-${dialogObject.template}`,
                            attrs: {
                              ...scoping,
                              "aria-hidden": this.showAppendDialog
                                ? "true"
                                : undefined,
                              "aria-label": this.showAppendDialog
                                ? undefined
                                : this.dialogTitle,
                            },
                            staticClass: "heading sheet-heading line-clamp-1",
                            class: [
                              {
                                __hidden: !this.showHeaderText,
                                "delivery-info": this.deliveryInfoTemplate,
                              },
                            ],
                          },
                          [this.dialogTitle]
                        );
                      },
                    },
                  }),
                  btn(
                    {
                      props: {
                        size: "md",
                        text: true,
                        // color: "primary",
                        persistent: true,
                        disabled: this.showAppendDialog,
                      },
                      attrs: { ...scoping },
                      staticClass: "close-btn sheet-close-btn",
                      on: {
                        click: (e) => {
                          e.stopPropagation();
                          payload.close();
                        },
                      },
                    },
                    "Close"
                  ),
                  // icon({
                  //   attrs: { ...scoping },
                  //   staticClass: "close",
                  //   props: {
                  //     name: "close",
                  //     clickable: true,
                  //     props: {
                  //       disabled: this.showAppendDialog,
                  //     },
                  //   },
                  //   on: {
                  //     click: (e) => {
                  //       e.stopPropagation();
                  //       payload.close();
                  //     },
                  //   },
                  // }),
                ]
              ),

              transition({
                props: {
                  ...changeTransition,
                  springConfig: springPresets.wobbly,
                  delay: {
                    enter: 150,
                    leave: 32,
                  },
                },
                on: {
                  enter: () => {
                    if (this.deliveryInfoTemplate) {
                      this.showHeaderText = false;
                    }
                  },
                  afterEnter: () => {
                    if (this.deliveryInfoTemplate) {
                      this.showHeaderText = false;
                    }
                  },
                },
                scopedSlots: {
                  default: () => {
                    return div(
                      {
                        key: dialogObject.template,
                        ref: "main",
                        attrs: { ...scoping },
                        staticClass: `main ${dialogObject.template}`,
                      },
                      /anonymous|^delivery-info/i.test(dialogObject.template)
                        ? anonymousDeliveryContent(payload)
                        : /sign-up/i.test(dialogObject.template)
                        ? signUpContent(payload)
                        : /sign-in/i.test(dialogObject.template)
                        ? signInContent(payload)
                        : /^signed-in$|^account-created/i.test(
                            dialogObject.template
                          )
                        ? successPage()
                        : null
                    );
                  },
                },
              }),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: "completed",
                  class: [{ show: this.anonymousOrderCompleted }],
                  style: {
                    transition: !/afterEnter/i.test(payload.state)
                      ? "0s"
                      : undefined,
                  },
                },
                [
                  div(
                    {
                      attrs: { ...scoping },
                      staticClass: "completed-wrapper",
                    },
                    [
                      h("svg-checked", {
                        attrs: { ...scoping },
                        staticClass: "checked",
                      }),
                      p(
                        {
                          attrs: { ...scoping },
                          staticClass: "completed-desc",
                        },
                        this.anonymousOrderCompletedText
                      ),
                    ]
                  ),
                ]
              ),
            ]
          );
        },

        append: (payload) => {
          if (!/afterE/i.test(payload.state)) {
            return null;
          }

          return dialogObject.template == "sign-in"
            ? forgotPassword({
                props: {
                  vmodel: this.showAppendDialog,
                },
                on: {
                  vmodel: (e) => {
                    this.showAppendDialog = e;
                    !e &&
                      this.updateTemplate({
                        append: undefined,
                      });
                  },
                  "intersection-point": (e) => {
                    this.appendIntersection = e;
                  },
                  "transition-state": (e) => {
                    this.appendTransitionState = e;
                  },
                },
              })
            : selectDialog({
                props: {
                  dialogPayload: payload,
                  vmodel: this.showAppendDialog,
                  label: this.selectDialogTemplate.label,
                  selected: this.form.anonymousDelivery[
                    this.selectDialogTemplate.label.toLowerCase()
                  ],
                  activeState:
                    this.selectDialogTemplate.label == "City"
                      ? this.form.anonymousDelivery.state
                      : undefined,
                },
                on: {
                  vmodel: (e) => {
                    this.showAppendDialog = e;
                    !e &&
                      this.updateTemplate({
                        append: undefined,
                      });
                  },
                  "item-selected": async (e) => {
                    this.form.anonymousDelivery[
                      this.selectDialogTemplate.label.toLowerCase()
                    ] = e.value;

                    await sleep.call(this, 500);
                    this.form.anonymousDelivery.isCorrect = false;
                  },
                  "transition-state": (e) => {
                    this.appendTransitionState = e;
                  },
                },
              });
        },
      },
    });
  },
};
</script>

<style>
.bag-page-dialog-root:not(.account-created) {
  --background-elem-background: var(--theme-surface) !important;
}

.bag-page-dialog-root.append-active .bag-page-dialog[data-bpdg] {
  box-shadow: var(--raise-light) !important;
}

.bag-page-dialog[data-bpdg] {
  height: var(--full-dialog);
  --x-padding: 1.15rem;
  transform-origin: top;
  transform: var(--transform-value);
  overflow: hidden !important;
  transition: 0.5s transform;
}

.bag-page-dialog[data-bpdg].will-change {
  will-change: transform;
}

.root[data-bpdg] {
  height: 100%;
  position: relative;
  transition: 1ms background-color 200ms;
}

.root.__hidden[data-bpdg] .header[data-bpdg]::before,
.root.__hidden[data-bpdg] .heading[data-bpdg],
.root.__hidden[data-bpdg] .main[data-bpdg] {
  opacity: 0;
}

.header[data-bpdg] {
  background-color: var(--theme-primary);
  z-index: 1;
  overflow-y: hidden;
}

.header[data-bpdg]::before {
  border-bottom: var(--ui-divide);
  transition: 0.2s opacity;
}

.header[data-bpdg].__hide-before::before {
  opacity: 0;
}

.heading[data-bpdg] {
  transition: 0.25s opacity linear;
}

.heading[data-bpdg].delivery-info {
  transition: 0.2s transform ease, 0.2s opacity ease;
}

.heading[data-bpdg].__hidden {
  transition: 1ms transform 0.3s, 0.2s opacity ease;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(0, 4px, 0);
}

.back[data-bpdg] {
  position: absolute;
  left: var(--x-padding);
}

@media (hover: hover) and (pointer: fine) {
  .close[data-bpdg]:not(.__disabled):not(:hover):not(:focus)::before {
    opacity: 0.05;
  }
}

.close[data-bpdg]:not(.__disabled):not(:active)::before {
  opacity: 0.05;
}

.main[data-bpdg] {
  min-height: calc(100% - var(--sheet-header-height));
  max-height: calc(100% - var(--sheet-header-height));
  overflow: hidden auto;
  position: relative;
  transition: 0.25s opacity linear;
  background-color: var(--theme-surface);
}

.main[data-bpdg].account-created {
  background-color: var(--theme-primary);
}

.dark-theme .main[data-bpdg].account-created {
  background-color: var(--theme-surface);
}

.root.__completed[data-bpdg] .main[data-bpdg] {
  overflow: hidden;
}

/* .alt-sign-in[data-bpdg] {
  padding-left: var(--x-padding);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  background-color: var(--theme-primary);
  position: relative;
}

.alt-sign-in[data-bpdg]::before {
  border-bottom: var(--ui-divide);
} */

.banner-action[data-bpdg] {
  text-decoration: underline;
  padding: 0 0.5rem !important;
  word-spacing: 0px !important;
  letter-spacing: 0.5px;
}

.alert[data-bpdg] {
  margin-top: 1rem;
  padding: 1rem;
  padding-left: 0.75rem;
  position: relative;
  isolation: isolate;
  --alert-color: var(--info);
  line-height: 1.35;
  background-color: inherit;
  display: grid;
  row-gap: 0.5rem;
  width: calc(100% - 2rem);
  font-size: 0.95rem !important;
}

.alert[data-bpdg] .ui-btn {
  --padding__text-sm: 0 10px;
}

.light-theme .alert[data-bpdg],
.light-theme .alert[data-bpdg] .ui-btn {
  background: var(--alert-color) !important;
  color: #fff !important;
}

.light-theme .alert[data-bpdg] {
  border-left-color: #ffffff80;
}

.alert[data-bpdg] {
  left: 50%;
  transform: translateX(-50%);
  max-width: 650px;
  padding-left: 1.25rem;
}

.alert[data-bpdg]::after {
  --t-disabled: 0.15;
  border: 1px solid var(--alert-color);
  opacity: var(--t-disabled);
}

.alert[data-bpdg] > p:first-of-type {
  opacity: var(--t-subtitle);
}

.alert-action-wrapper[data-bpdg] {
  display: grid;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0.25rem;
  grid-template-columns: auto auto;
}

.alert[data-bpdg] > p {
  opacity: var(--t-body);
  z-index: 1;
}

.alert[data-bpdg]::before {
  background-color: var(--alert-color);
  opacity: 0.25;
}

.completed[data-bpdg] {
  width: 100%;
  height: calc(100% - var(--sheet-header-height));
  position: absolute;
  top: var(--sheet-header-height);
  left: 0;
  background-color: var(--theme-primary);
  display: grid;
  align-content: center;
  transition: 0.2s opacity;
  opacity: 0;
  pointer-events: none;
}

.completed[data-bpdg].show {
  opacity: 1;
  pointer-events: initial;
}

.completed-wrapper[data-bpdg] {
  display: grid;
  grid-template-rows: 112px auto;
  row-gap: 3rem;
  margin-top: calc(
    var(--sheet-header-height) - calc(var(--sheet-header-height) * 2)
  );
}

.checked[data-bpdg] {
  display: flex;
  justify-content: center;
  color: var(--success);
}

.checked[data-bpdg] svg {
  height: 100%;
  width: 100%;
}

.completed-desc[data-bpdg] {
  text-align: center;
  font-size: 1.5rem;
}
</style>
