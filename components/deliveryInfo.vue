<script>
import { capitalize } from "~/components/utils/main";
// import { sleep } from "~/components/utils";
export default {
  name: "DeliveryInfo",
  props: {
    validation: {
      type: Object,
      required: true,
    },
  },

  computed: {
    deliveryInfo() {
      return this.$store.state.savedDeliveryInfo;
    },
    user() {
      return this.$store.state.user;
    },
  },

  mounted() {
    this.$store.commit("FETCHED", {
      value: "deliveryInfo",
      path: "components",
    });
  },

  render(h) {
    const scoping = { "data-dio": "" };
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const p = (d, c) => h("p", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const br = (d, c) => h("br", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const transition = (d, c) => h("ui-transition", d, c);

    const updateDialog = ({ template }) => {
      this.$router.push({
        query: {
          dialog: template,
        },
      });
    };

    const sameAlertInfo = "We will need a valid address to deliver your order.";

    const fillDelivery = !this.deliveryInfo
      ? [
          div(
            {
              attrs: { ...scoping },
              staticClass: "alert rounded-right fill-before-and-after",
            },
            [
              this.user.session
                ? [
                    p(sameAlertInfo),
                    p(`Enter your delivery info to be saved for next time. 😉`),
                  ]
                : [
                    p([
                      `${sameAlertInfo} You may choose to order as anonymous (without creating an account), or sign in to save your delivery info for next time.`,
                    ]),

                    !this.user.session &&
                      p([
                        `However, anonymous orders can only be shipped to residents in Lagos.`,
                      ]),
                  ],
            ]
          ),

          div(
            {
              attrs: { ...scoping },
              staticClass: "action-wrapper",
            },
            [
              this.user.session
                ? btn(
                    {
                      props: {
                        color: "primary",
                        flat: true,
                        simpleButton: true,
                        actionButton: true,
                      },
                      attrs: { ...scoping },
                      staticClass: `action action-1`,
                      on: {
                        "!click": () => {
                          updateDialog({
                            template: "delivery-info",
                          });
                        },
                      },
                    },
                    ["Add Delivery Info"]
                  )
                : ["Sign in", "Anonymous order"].map((item, key) => {
                    return btn(
                      {
                        key,
                        props: {
                          color: key == 1 ? "primary" : undefined,
                          background: key == 0 ? "primary" : undefined,
                          flat: true,
                          simpleButton: true,
                          actionButton: true,
                          text: key == 1,
                          tag: "nuxt-link",
                          to: `${
                            this.$route.path
                          }?dialog=${item.toLowerCase().replace(/\s+/g, "-")}`,
                        },
                        attrs: { ...scoping, title: item },
                        staticClass: `action action-${key + 1}`,
                        on: {
                          // "!click": (e) => {
                          //   updateDialog({
                          //     template: item.toLowerCase().replace(/\s+/g, "-"),
                          //   });
                          // },
                        },
                      },
                      [item]
                    );
                  }),
            ]
          ),
        ]
      : null;

    const showDelivery = this.deliveryInfo
      ? [
          div(
            {
              attrs: { ...scoping },
              staticClass: "wrapper fill-before",
            },
            [
              ["name", "tel", "address"].map((item, key) => {
                const title = item == "tel" ? "Phone" : capitalize(item);
                const path = item == "address" ? "street-address" : item;
                const content = this.deliveryInfo[path];
                return p(
                  {
                    key,
                    attrs: { ...scoping },
                    staticClass: `item __${title.toLowerCase()}`,
                    class: [{ "fill-before": key != 2 }],
                  },
                  [
                    `${title}:`,
                    key == 2
                      ? p(
                          {
                            attrs: { ...scoping },
                            staticClass: "desc",
                          },
                          [
                            `${this.deliveryInfo["address-level1"]}, ${this.deliveryInfo["address-level2"]},`,
                            br({ attrs: { ...scoping } }),
                            `${content}.`,
                          ]
                        )
                      : p(
                          {
                            attrs: { ...scoping },
                            staticClass: "desc",
                          },
                          item == "tel"
                            ? `${content}`.replace(/\)/, ") ").replace(/\+/, "")
                            : `${content}`
                        ),
                  ]
                );
              }),
            ]
          ),
          btn(
            {
              props: {
                color: "info",
                flat: true,
                simpleButton: true,
                filledText: true,
                shape: "pill",
              },
              attrs: { ...scoping },
              staticClass: "edit-action",
              on: {
                "!click": () =>
                  updateDialog({
                    template: "delivery-info",
                  }),
              },
            },
            "Edit"
          ),
        ]
      : null;

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root fill-before",
      },
      [
        h2(
          {
            attrs: { ...scoping },
            staticClass: "header",
          },
          [
            icon({
              props: {
                name: "axisArrowInfo",
              },
              attrs: { ...scoping },
              staticClass: "title-deco",
            }),
            `Delivery info`,
            transition({
              props: {
                transition: "slide-y(-4px)",
                ease: "ease",
              },
              scopedSlots: {
                default: (payload) => {
                  return this.validation.text
                    ? div(
                        {
                          key: this.validation.timeStamp,
                          attrs: { ...scoping },
                          staticClass: "v-msg",
                          class: [{ vibrate: /afterEnter/i.test(payload) }],
                        },
                        [span(this.validation.text)]
                      )
                    : null;
                },
              },
            }),
          ]
        ),
        fillDelivery,
        showDelivery,
      ]
    );
  },
};
</script>

<style>
.root[data-dio] {
  padding: 1.5rem 1.25rem 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  display: grid;
}

.root[data-dio]::before {
  border-bottom: var(--ui-divide);
  /* border-width: 0.5px 0; */
}

.header[data-dio] {
  display: flex;
  align-items: center;
  opacity: var(--t-title);
}

.v-msg[data-dio] {
  display: inline-block;
  font-size: 0.9rem;
  color: var(--v-msg-color);
  margin-left: 0.5rem;
}

.v-msg[data-dio] > span {
  opacity: var(--t-body);
}

.alert[data-dio] {
  margin: 1.75rem 0 2.25rem;
  padding: 1.25rem 1rem;
  position: relative;
  isolation: isolate;
  --alert-color: var(--info);
  border-left: 0.5rem solid var(--alert-color);
  line-height: 1.4;
  font-size: 0.95rem;
  background-color: inherit;
}

.alert[data-dio] > p {
  opacity: var(--t-body);
}

.alert[data-dio] > p:first-of-type {
  margin-bottom: 0.5rem;
}

.alert[data-dio]::before {
  background-color: var(--alert-color);
  z-index: -1;
  opacity: 0.2;
}

.alert[data-dio]::after {
  background-color: var(--theme-surface);
  z-index: -1;
}

.dark-theme .alert[data-dio]::after {
  background-color: var(--theme-banner);
  box-shadow: none;
}

.action-wrapper[data-dio] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(224px, 45vw), 1fr));
  gap: 1.5rem 1rem;
  margin-bottom: 0.5rem;
}

.action[data-dio] {
  width: 100%;
}

.action[data-dio] {
  background-color: var(--info);
  color: #fff;
  max-width: max(85vw, 285px);
  justify-self: center;
}

.action-2[data-dio]::before {
  background-color: var(--info) !important;
}

.action-2[data-dio] {
  background-color: inherit !important;
  color: var(--info);
}

/* SHOW DELIVERY INFO STYLES BELOW */

.wrapper[data-dio] {
  display: grid;
  row-gap: 0.25rem;
  background-color: var(--theme-banner);
  padding: 1rem;
  padding-right: 0;
  margin: 2rem 0 2.5rem;
  border-radius: var(--rounded);
}

.light-theme .wrapper[data-dio] {
  box-shadow: var(--raise-light);
}

.edit-action[data-dio] {
  text-decoration: underline !important;
  min-width: 128px;
  margin: 0 auto;
}

.edit-action[data-dis]::before {
  opacity: 0.05;
}

.item[data-dio] {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;
  align-items: center;
  font-weight: 400;
  font-size: 0.975rem;
  letter-spacing: 0.4px;
  line-height: 1.5;
  padding: 0 1rem 0.25rem 0;
  position: relative;
  opacity: var(--t-body);
  min-height: 3rem;
}

.item[data-dio]::before {
  border-bottom: 1.5px dotted currentColor;
  opacity: 0.35;
}

.desc[data-dio] {
  font-weight: 500;
  font-size: 1rem;
  text-align: right;
}
</style>
