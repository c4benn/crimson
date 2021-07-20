<script>
export default {
  name: "UserInFeedback",
  props: {
    signedIn: Boolean,
    accountCreated: Boolean,
    newUser: {
      type: Object,
      default: () => ({}),
    },
    actions: {
      type: Array,
      default: () => [
        {
          text: "Fill Delivery Info",
          attrs: {},
          props: {
            background: "info",
            flat: true,
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
  },

  computed: {
    user() {
      return (
        this.$store.getters?.supabase?.auth?.user?.()?.user_metadata ||
        this.$store.state.user
      );
    },
  },

  render(h) {
    const scoping = { "data-ufk": "" };
    const div = (d, c) => h("div", d, c);
    const p = (d, c) => h("p", d, c);
    const q = (d, c) => h("q", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const h4 = (d, c) => h("h4", d, c);
    const h5 = (d, c) => h("h5", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const img = (d, c) => h("app-img", d, c);

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root",
      },
      [
        img({
          props: {
            src: `/img/illustrations/${
              this.signedIn
                ? "signed-in.svg"
                : !this.user.session
                ? "confirm.png"
                : "account-created.png"
            }`,
            alt: `${
              !this.user.session ? "confirm account" : "account created"
            } illustration`,
          },
          staticClass: `account-created-img ${
            this.user.session ? "" : "confirm-account"
          }`,
        }),

        this.accountCreated
          ? [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "greetings",
                },
                [
                  h3(
                    {
                      attrs: { ...scoping },
                      staticClass: "subtitle",
                    },
                    [`Hi`]
                  ),
                  h4(
                    {
                      attrs: {
                        ...scoping,
                      },
                      staticClass: "title",
                    },
                    `${this.newUser.name}`
                  ),
                  h5(
                    {
                      attrs: { ...scoping },
                      staticClass: "caption",
                    },
                    [
                      !this.user.session
                        ? "Please confrim your email"
                        : `Welcome to Paradice.`,
                    ]
                  ),
                ]
              ),

              !this.user.session
                ? [
                    div(
                      {
                        attrs: { ...scoping },
                        staticClass: "confrim-desc alert fill-before-and-after",
                      },
                      [
                        p(
                          `You'll recieve a confirmation from an email that ends with "supabase.io".`
                        ),
                        p({
                          domProps: {
                            innerHTML: `Kindly click on the confirmation link, and you'll be redirected to our <em>Welcome page</em> on a new tab. Feel free to close that tab and come back here to continue. ✌`,
                          },
                        }),
                      ]
                    ),
                    div(
                      {
                        attrs: { ...scoping },
                        staticClass: "hint",
                      },
                      [
                        p(`Your registration email address is`),
                        q(this.newUser.email),
                      ]
                    ),
                  ]
                : div(
                    {
                      attrs: { ...scoping },
                      staticClass: "account-created-action-wrapper",
                    },
                    ["Fill in Delivery", "View Account"].map((item, key) => {
                      return btn(
                        {
                          key,
                          props: {
                            background: key == 0 ? "info" : undefined,
                            color: key == 1 ? "info" : undefined,
                            flat: true,
                            actionButton: true,
                          },
                          attrs: { ...scoping },
                          staticClass: `account-created-action-${key + 1}`,
                        },
                        item
                      );
                    })
                  ),
            ]
          : [
              div(
                {
                  attrs: { ...scoping },
                  staticClass: "si-greeting-wrapper",
                },
                [
                  p(
                    {
                      attrs: { ...scoping },
                      staticClass: "si-greeting",
                    },
                    `Good ${this.$store.state.greeting}`
                  ),
                  this.user.name
                    ? p(
                        {
                          attrs: { ...scoping },
                          staticClass: "si-name",
                        },
                        [this.user.name]
                      )
                    : h("app-loader"),
                  // p(
                  //   {
                  //     attrs: { ...scoping },
                  //     staticClass: "si-desc",
                  //   },
                  //   [`Welcome back, we've missed you.`]
                  // ),
                ]
              ),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: "si-action-wrapper",
                },
                [
                  this.actions.map((item, key) => {
                    const data = { ...item };
                    delete data.text;
                    return btn(
                      {
                        key,
                        ...data,
                        attrs: { ...data.attrs, ...scoping },
                        props: {
                          simpleButton: true,
                          actionButton: true,
                          ...data.props,
                        },
                        staticClass: `${data.staticClass} si-action si-action-${
                          key + 1
                        }`,
                      },
                      item.text
                    );
                  }),
                ]
              ),
            ],
      ]
    );
  },
};
</script>

<style>
.alert[data-ufk] {
  margin-top: 1rem;
  padding: 1rem;
  padding-left: 0.75rem;
  position: relative;
  isolation: isolate;
  --alert-color: var(--info);
  border-left: 0.5rem solid var(--alert-color);
  line-height: 1.35;
  background-color: inherit;
}

.alert[data-ufk] > p {
  opacity: var(--t-body);
  z-index: 1;
}

.alert[data-ufk]::before {
  background-color: var(--alert-color);
  opacity: 0.25;
}

.account-created-img {
  height: max(30vh, 256px);
  width: 100%;
}

.greetings[data-ufk] {
  text-align: center;
  margin-top: 1rem;
  display: grid;
  row-gap: 1rem;
}

.subtitle[data-ufk] {
  opacity: var(--t-subtitle);
  font-size: 1.25rem;
  font-weight: 500;
}

.title[data-ufk] {
  opacity: var(--t-body);
  font-size: 1.5rem;
}

.caption[data-ufk] {
  opacity: var(--t-caption);
  font-size: 0.975rem;
  font-weight: normal;
}

.account-created-action-wrapper[data-ufk] {
  margin: 3rem 1.5rem 2rem;
  display: grid;
  justify-items: center;
  gap: 1.5rem 1rem;
}

.account-created-action-1[data-ufk],
.account-created-action-2[data-ufk] {
  width: 100%;
  max-width: 320px;
}

.confrim-desc.alert[data-ufk] {
  line-height: 1.5;
  letter-spacing: 0.4px;
  display: grid;
  row-gap: 0.75rem;
  margin: 2rem 0;
}

.confrim-desc.alert[data-ufk] > p {
  opacity: var(--t-body);
}

.confrim-desc.alert[data-ufk]::before {
  opacity: 0.2;
}

/* .light-theme .confrim-desc.alert[data-ufk]::before {
  opacity: 0.2;
} */

.confrim-desc.alert[data-ufk]::after {
  border: var(--ui-divide);
  border-width: 0.5px 0;
  opacity: 0.5;
}

.hint[data-ufk] {
  text-align: center;
  line-height: 1.75;
  letter-spacing: 0.2px;
  margin-bottom: 4rem;
}

.hint[data-ufk] > p {
  opacity: var(--t-caption);
}

.hint[data-ufk] > q {
  opacity: var(--t-caption);
}

.si-greeting-wrapper[data-ufk] {
  display: grid;
  justify-items: center;
  margin: 1.5rem 0;
  row-gap: 1rem;
  letter-spacing: 0.4px;
}

.si-greeting[data-ufk] {
  font-size: 1.25rem;
  opacity: var(--t-subtitle);
}

.si-name[data-ufk] {
  font-size: 1.5rem;
  font-weight: 500;
  opacity: var(--t-title);
}

.si-desc[data-ufk] {
  font-size: 0.875rem;
  opacity: var(--t-caption);
}

.si-action-wrapper[data-ufk] {
  display: grid;
  justify-items: center;
  row-gap: 1.5rem;
  padding-top: 1rem;
  margin-bottom: 10rem;
}

.si-action[data-ufk] {
  min-width: 256px !important;
}

@media (max-height: 550px) {
  .account-created-img {
    display: none;
  }

  .greetings[data-ufk] {
    margin-top: 3rem;
  }
}
</style>
