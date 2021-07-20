<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "UiForm",
  props: {
    showSubmit: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: "Submit",
    },
    submitData: {
      type: Object,
      default: () => ({
        props: {
          background: "info",
          flat: true,
        },
      }),
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  render(h) {
    const form = (d, c) => h("form", d, c);
    const div = (d, c) => h("div", d, c);
    const submit = (d, c) => h("ui-btn", d, c);
    const transition = (d, c) => h("ui-transition", d, c);

    const submitData = { ...this.submitData };

    return form(
      {
        attrs: { name: this.name, ...this.$attrs },
        on: {
          submit: (e) => {
            e.preventDefault();
          },
        },
      },
      [
        this.$slots.default,
        this.showSubmit
          ? submit(
              {
                ...submitData,
                props: {
                  simpleButton: true,
                  actionButton: true,
                  persistent: false,
                  ...(submitData?.props || {}),
                },
                attrs: {
                  title: this.submitText.toLowerCase(),
                  ...(submitData?.attrs || {}),
                },
                on: {
                  ...(submitData?.on || {}),

                  "!click": async (e) => {
                    this.$emit("submit-clicked");

                    e.preventDefault();

                    const inputs = [...this.$children].filter((x) =>
                      /input/i.test(x.$vnode.tag)
                    );
                    const validForm = {
                      componentInvalid: [],
                      checkValidity: undefined,
                      reportValidity: undefined,
                    };

                    const vmodel = {};

                    inputs.forEach((x) => {
                      vmodel[(x.autocomplete || x.label).toLowerCase()] =
                        x.output;
                      x?.validate?.();
                      this.$nextTick(() => {
                        if (x?.validation?.valid === false) {
                          validForm.componentInvalid.push(x);

                          x.keys["v-msg"] += 1;
                        }
                      });
                    });

                    delete vmodel["information is correct"];

                    await sleep.call(this, 16);

                    if (typeof this.$el.reportValidity == "function") {
                      validForm.reportValidity = this.$el.reportValidity?.();
                    }

                    validForm.checkValidity = this.$el?.checkValidity?.();

                    const htmlValid = /true|undefined/i;

                    const isValid =
                      !validForm.componentInvalid.length &&
                      htmlValid.test(validForm.checkValidity) &&
                      htmlValid.test(validForm.reportValidity);

                    if (isValid) {
                      this.$nextTick(() => {
                        this.$emit("submit-form", vmodel);
                      });
                    }
                  },
                },
              },
              [
                transition({
                  props: {
                    transition: "slide-y",
                  },
                  scopedSlots: {
                    default: () => {
                      return div(
                        {
                          key: this.submitText,
                          staticClass: "__submit-btn-content",
                        },
                        this.$slots.submitText || this.submitText
                      );
                    },
                  },
                }),
              ]
            )
          : null,
        this.$slots.append,
      ]
    );
  },
};
</script>
