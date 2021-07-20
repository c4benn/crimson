<script>
import {
  capitalize,
  formatTel,
  sleep,
  updateDeliveryInfo,
} from "~/components/utils/main";
export default {
  name: "DeliveryForm",
  props: {
    nameValidator: {
      type: Function,
      required: true,
    },
    passwordValidator: {
      type: Function,
      required: true,
    },
    emailValidator: {
      type: Function,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: `Delivery info`,
    },
    showAppendDialog: {
      type: Boolean,
      required: true,
    },
    selectDialogTemplate: {
      type: Object,
      required: true,
    },
    selectValue: {
      type: String,
      required: true,
    },
    disableTitleIntersection: Boolean,
    template: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    form: {
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
    submitText: "Add Delivery Info",
  }),

  computed: {
    fetchedStates() {
      return this.$store.state.bagPageFetchedStates;
    },
    supabase() {
      return this.$store.getters.supabase;
    },
    savedDelivery() {
      return this.$store.state.savedDeliveryInfo;
    },
  },

  created() {
    if (
      /^main$/i.test(this.template) &&
      typeof this.savedDelivery == "object" &&
      this.savedDelivery !== null
    ) {
      this.submitText = "Update Delivery Info";

      this.form.name = this.savedDelivery.name;
      this.form.phone = this.savedDelivery.tel
        .replace(/\(.+\)/, "")
        .replace(/-/g, " ");
      this.form.email = this.savedDelivery.email;
      this.form.state = this.savedDelivery["address-level1"];
      this.form.city = this.savedDelivery["address-level2"];
      this.form.address = this.savedDelivery["street-address"];
      this.form.save = this.savedDelivery["save info"];

      this.$emit("select-vmodel", {
        label: "city",
        value: this.form.city,
      });

      this.$emit("select-vmodel", {
        label: "state",
        value: this.form.state,
      });
    } else {
      this.submitText = "Add Delivery Info";
    }
  },

  mounted() {
    this.$nextTick(() => {
      requestAnimationFrame(async () => {
        if (
          this.fetchedStates === null ||
          this.fetchedStates == "Error fetching"
        ) {
          if (!this.$nuxt.isOnline) {
            return this.updateFetchedStates("Error fetching");
          }

          const { data: nigerianstates, error } = await this.supabase
            .from("nigerianstates")
            .select("*");

          if (!error) {
            const states = {};

            nigerianstates.forEach((x) => {
              states[x.state] = JSON.parse(x.cities);
            });

            this.updateFetchedStates(states);
          } else {
            this.updateFetchedStates("Error fetching");
          }
        }
      });
    });
  },

  methods: {
    updateFetchedStates(value) {
      this.$store.commit("UPDATE_", {
        name: "bagPageFetchedStates",
        value,
      });
    },
  },

  render(h) {
    const scoping = { "data-dfm": "" };
    const div = (d, c) => h("div", d, c);
    const p = (d, c) => h("p", d, c);
    const form = (d, c) => h("ui-form", d, c);
    const input = (d) => h("ui-input", d);
    const intersection = (d) => h("ui-intersection", d);

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
          intersection({
            props: {
              // disableIntersection: this.disableTitleIntersection,
              config: {
                target: this.$el,
              },
            },
            scopedSlots: {
              default: (payload) => {
                // !this.disableTitleIntersection &&
                this.$emit("title-intersecting", payload.isIntersecting);
                return p(
                  {
                    attrs: { ...scoping },
                    staticClass: "title",
                  },
                  this.title
                );
              },
            },
          }),

          form(
            {
              props: {
                name: "delivery form",
                submitData: {
                  attrs: { ...scoping },
                  props: {
                    background: "info",
                    flat: true,
                    actionButton: true,
                  },
                  staticClass: "submit",
                },
                submitText: this.submitText,
              },
              attrs: {
                ...scoping,
                action: ".",
                "aria-label": "delivery form",
              },
              staticClass: "form fill-before",
              on: {
                "submit-form": async (e) => {
                  this.$nextTick(() =>
                    requestAnimationFrame(() =>
                      this.$emit("form-submitted", {
                        ...e,
                        submitText: this.submitText,
                      })
                    )
                  );

                  await updateDeliveryInfo.call(this, { value: e });

                  await sleep.call(this, 1000);

                  this.payload?.close();
                },
              },
            },
            [
              input({
                props: {
                  label: "Name",
                  autocomplete: "name",
                  id: "delivery-name",
                  placeholder: "Egwu Sade",
                  vmodel: this.form.name,
                  validator: this.nameValidator,
                  pattern: ".+",
                },
                on: {
                  vmodel: (e) => {
                    this.form.isCorrect = false;
                    this.form.name = e;
                  },
                },
              }),
              input({
                props: {
                  label: "Phone",
                  autocomplete: "tel",
                  id: "delivery-phone",
                  type: "tel",
                  appendValue: "+234",
                  placeholder: "801 2345 678",
                  pattern: "^\\s*?\\d{3}\\s+\\d{1,3}(\\s+?\\d{1,4})?\\s*?$",
                  vmodel: this.form.phone,
                  validator: (e) => {
                    const value = e.trim();
                    if (!value.length) {
                      return "Required";
                    }
                    if (/[a-zA-Z]+/g.test(e)) {
                      return "Numbers only";
                    }
                    if (value.length < 4) {
                      return "Min length is 4";
                    }
                    if (value.length > 12) {
                      return "Max length is 10";
                    }
                    return true;
                  },
                },
                on: {
                  vmodel: (e) => {
                    this.form.isCorrect = false;
                    this.form.phone = formatTel(e);
                  },
                },
              }),
              input({
                props: {
                  label: "Email",
                  type: "email",
                  autocomplete: "email",
                  id: "delivery-email",
                  placeholder: "example@domain",
                  vmodel: this.form.email,
                  pattern:
                    "^\\s*?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\s*?$",
                  validator: this.emailValidator,
                },
                on: {
                  vmodel: (e) => {
                    this.form.isCorrect = false;
                    this.form.email = e;
                  },
                },
              }),

              ["State", "City"].map((item, key) => {
                return input({
                  key,
                  props: {
                    appendValue: item.appendValue,
                    readonly: item == "State",
                    autocomplete:
                      item == "State" ? "address-level1" : "address-level2",
                    label: item,
                    id: `delivery-${item}`.toLowerCase(),
                    placeholder: !this.$nuxt.isOnline
                      ? "Network error"
                      : this.fetchedStates == "Error fetching"
                      ? "Error fetching"
                      : !this.form.state && key == 1
                      ? "Choose State"
                      : `Choose ${item}`,
                    type: "select",
                    template: "select",
                    vmodel:
                      key == 1
                        ? this.selectValue
                        : this.form[item.toLowerCase()],
                    pattern: ".+",
                    validator: (e) => {
                      const value = e.trim();
                      if (!value.length) {
                        return "Required";
                      }
                      return true;
                    },
                    disabled:
                      this.fetchedStates == "Error fetching" ||
                      (!this.form.state && key == 1),
                    loading: this.fetchedStates === null,
                    selectToggled:
                      this.showAppendDialog &&
                      this.selectDialogTemplate.label == item,
                  },
                  on: {
                    vmodel: (e) => {
                      this.form[item.toLowerCase()] = capitalize(e);
                      this.form.isCorrect = false;
                      this.$emit("select-vmodel", {
                        value: capitalize(e),
                        label: item.toLowerCase(),
                      });
                    },
                    "toggle-select": () => {
                      this.$emit("toggle-select", item);
                    },
                  },
                });
              }),

              input({
                props: {
                  label: "Address",
                  id: "delivery-address",
                  placeholder: "number, street name, closest bus stop",
                  type: "address",
                  vmodel: this.form.address,
                  minlength: "10",
                  autocomplete: "street-address",
                  validator: (e) => {
                    const value = e.trim();
                    if (!value.length) {
                      return "Required";
                    }
                    if (value.length < 10) {
                      return "Min length is 10";
                    }
                    return true;
                  },
                },
                on: {
                  vmodel: (e) => {
                    this.form.isCorrect = false;
                    this.form.address = e;
                  },
                },
              }),

              input({
                props: {
                  label: "Save info",
                  id: "delivery-save-info",
                  type: "switch",
                  vmodel: this.form.save,
                  required: false,
                  validator: () => {
                    return true;
                  },
                  topSlot: false,
                  hint: this.form.save
                    ? `Your current delivery info will be ${
                        this.$store.state.isPWA
                          ? "remembered for next time"
                          : "saved on <em>this</em> browser"
                      }.`
                    : `Your current delivery info will be cleared on your next visit.`,
                },
                on: {
                  vmodel: (e) => {
                    this.form.save = e;
                  },
                },
              }),

              input({
                props: {
                  label: "Information is correct",
                  id: "delivery-info-correct",
                  title: !this.form.isCorrect
                    ? "information is incorrect"
                    : "information is correct",
                  type: "switch",
                  vmodel: this.form.isCorrect,
                  validator: (e) => {
                    if (e !== true) {
                      return "Required";
                    }
                    return true;
                  },
                  required: true,
                },
                on: {
                  vmodel: (e) => {
                    this.form.isCorrect = e;
                  },
                },
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
.root[data-dfm] {
  --x-padding: 1.15rem;
  max-width: 612px;
  margin: 0 auto;
}

.form[data-dfm] {
  margin: 1rem 0 4rem;
  position: relative;
  padding: 0 var(--x-padding) 2.5rem;
  display: grid;
}

.title[data-dfm] {
  padding: 0 var(--x-padding);
  margin: calc(1rem + var(--x-padding)) 0 calc(0.5rem + var(--x-padding));
  font-size: 1.25rem;
  font-weight: 600;
  opacity: var(--t-body);
}

.forgot-password[data-dfm] {
  margin: -0.75rem 0 1rem !important;
  padding: 2px 8px !important;
}

.submit[data-dfm] {
  width: calc(100% - 3rem);
  margin: 2.75rem auto;
}

.alt-register[data-dfm] {
  text-align: center;
  font-size: 1.1rem;
}

.sign-up-action[data-dfm] {
  font-size: 1.1rem !important;
}
</style>
