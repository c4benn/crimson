<script>
import {
  capitalizeAll,
  Debounce,
  sleep,
  vibrate,
} from "~/components/utils/main";
export default {
  name: "UiInput",
  model: {
    prop: "vmodel",
    event: "vmodel",
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    appendValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    pattern: {
      type: String,
      default: undefined,
    },
    vmodel: {
      type: [String, Boolean],
      default: "",
    },
    minlength: {
      type: [String, Number],
      default: undefined,
    },
    maxlength: {
      type: [String, Number],
      default: undefined,
    },
    validator: {
      type: Function,
      default: () => undefined,
    },
    loading: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    selectToggled: Boolean,
    showPassword: Boolean,
    topSlot: {
      type: Boolean,
      default: true,
    },
    hint: {
      type: String,
      default: undefined,
    },
    attentionHint: Boolean,
    title: {
      type: String,
      default: undefined,
    },
    autocomplete: {
      type: [String, Boolean],
      default: undefined,
    },
    asyncValidator: {
      type: Function,
      default: undefined,
    },
    passwordToggle: {
      type: Object,
      default: () => ({}),
    },
    passwordToggleAlertClass: {
      type: String,
      default: "var(--secondary)",
    },
    showPasswordToggleAlert: Boolean,
  },
  data() {
    return {
      inputFocused: undefined,
      inputDirtied: undefined,
      asyncValidate: undefined,
      asyncState: undefined,
      asyncValidationDebounce: null,

      keys: {
        "v-msg": 0,
      },
    };
  },
  computed: {
    isSelect() {
      return this.type == "select";
    },
    validation() {
      if (this.disabled) {
        return {
          valid: undefined,
          message: "",
        };
      }
      const validator = this.validator(this.vmodel);

      if (typeof validator == "undefined" || !this.inputDirtied) {
        return {
          valid: undefined,
          message: "",
        };
      }
      if (typeof validator == "string") {
        return {
          valid: false,
          message: validator,
        };
      }
      if (this.asyncValidation.valid === false) {
        return {
          valid: false,
          message: this.asyncValidation.message,
        };
      }
      if (validator === true) {
        return {
          valid: true,
          message: "",
        };
      }
      return {
        valid: undefined,
        message: "",
      };
    },
    asyncValidation() {
      const validator = this.asyncValidate;

      if (typeof validator == "undefined" || !this.inputDirtied) {
        return {
          valid: true,
          message: "",
        };
      }
      if (typeof validator == "object") {
        return validator;
      }
      return {
        valid: undefined,
        message: "",
      };
    },
    output() {
      return this.appendValue
        ? `(${this.appendValue})${this.vmodel}`.replace(/\s+/g, (x) =>
            this.type == "tel" ? "-" : x
          )
        : this.vmodel;
    },
    isSearch() {
      return this.type == "search";
    },
    notSelectable() {
      return this.readonly || this.disabled || this.loading;
    },
  },

  watch: {
    async selectToggled() {
      if (!this.selectToggled) {
        await sleep.call(this, 550);
        this.inputDirtied = true;
      }
    },
    validation() {
      this.setValidationMessage();
    },
    vmodel(n) {
      this.type == "select" && this.$emit("vmodel", n);
      if (this.type == "switch") {
        vibrate();
      }
    },
  },

  created() {
    this.inputFocused = undefined;
    this.inputDirtied = undefined;

    this.asyncValidationDebounce = new Debounce({
      instance: this,
      callback: () => {
        requestAnimationFrame(async () => {
          if (this.validator(this.vmodel) === true) {
            this.asyncState = "fetching";

            const validation = await this.asyncValidator(this.vmodel);

            await sleep.call(this, 300);

            this.asyncValidate = validation;

            if (this.asyncValidation.valid) {
              this.asyncState = "check";
            } else this.asyncState = false;
          }
        });
      },
      delay: 550,
    });
  },

  mounted() {
    this.setValidationMessage();
  },

  methods: {
    validate() {
      this.inputDirtied = true;
      this.validator(this.vmodel);
      this.setValidationMessage();
    },
    setValidationMessage() {
      this.$nextTick(() => {
        const input = this.$refs.input;
        const message = this.validation.message;

        input?.setCustomValidity?.(message);
      });
    },
  },

  render(h) {
    const scoping = { "data-uiit": "" };
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const label = (d, c) => h("label", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const clickable = (d, c) => h("ui-clickable", d, c);
    const input = (d) => h(this.type == "address" ? "textarea" : "input", d);
    const appLoader = (d) => h("app-loader", d);

    const validationMessage =
      this.inputDirtied && this.validation.message
        ? div(
            {
              key: this.keys["v-msg"],
              attrs: { ...scoping },
              staticClass: "v-msg vibrate",
            },
            this.validation.message
          )
        : null;

    if (this.type == "switch") {
      return div(
        {
          attrs: {
            ...scoping,
            title: (this.title || this.label).toLowerCase(),
            role: "checkbox",
            "aria-checked": `${this.vmodel}`,
          },
          staticClass: `root fill-before-and-after ${this.id} switch`,
          class: [
            {
              "hide-top": !this.topSlot,
              __disabled: this.disabled,
              "int-v": this.validation.valid === undefined,
              "inv-v": this.validation.valid === false,
            },
          ],
        },
        [
          this.topSlot &&
            span({ attrs: { ...scoping }, staticClass: "switch-v-msg" }, [
              validationMessage,
            ]),
          div(
            {
              attrs: { ...scoping },
              staticClass: "content-wrapper",
              on: {
                "&mousedown": () => {
                  this.$refs.input.click();
                },
              },
            },
            [
              h("input", {
                ref: "input",
                domProps: {
                  checked: this.vmodel,
                },
                attrs: {
                  ...scoping,
                  type: "checkbox",
                  id: this.id,
                  checked: this.vmodel,
                  required: this.required,
                  disabled: this.disabled,
                },
                staticClass: "switch-input",
                on: {
                  input: (e) => {
                    const value = e.currentTarget.checked;
                    this.inputDirtied = true;
                    this.$emit("vmodel", value);
                    this.validator(this.vmodel);
                  },
                },
              }),
              clickable(
                {
                  props: {
                    tag: "label",
                  },
                  ref: "label",
                  attrs: {
                    ...scoping,
                    for: this.id,
                  },
                  staticClass: "switch-label fill-before",
                  on: {
                    mousedown: (e) => {
                      e.stopPropagation();
                      this.$nextTick(() => {
                        this.validator(this.vmodel);
                      });
                    },
                    click: (e) => {
                      e.stopPropagation();
                    },
                  },
                },
                `${this.label}${!this.vmodel && this.required ? " *" : ""}`
              ),
              div(
                {
                  attrs: {
                    ...scoping,
                  },
                  staticClass: "switch-wrapper fill-before",
                },
                [
                  div({
                    attrs: {
                      ...scoping,
                      title: `${this.vmodel ? "on" : "off"}`,
                    },
                    staticClass: "switch-control fill-before-and-after",
                    class: [{ checked: this.vmodel }],
                  }),
                ]
              ),
            ]
          ),

          this.hint
            ? div({
                key: this.attentionHint ? `${this.inputFocused}` : undefined,
                attrs: { ...scoping },
                staticClass: "hint",
                class: [
                  {
                    "bounce-top": this.attentionHint,
                    __hidden: this.attentionHint && this.inputFocused,
                  },
                ],
                domProps: {
                  innerHTML: this.hint,
                },
              })
            : null,
        ]
      );
    }

    const border = span({
      attrs: { ...scoping, "aria-hidden": "true" },
      staticClass: "border",
    });

    return div(
      {
        attrs: {
          ...scoping,
          title: `${this.isSelect ? "choose " : this.isSearch ? "" : "enter "}${
            this.label
          }`.toLowerCase(),
        },
        staticClass: `root fill-before-and-after ${this.id}`,
        class: [
          this.isSearch
            ? { search: true }
            : {
                "int-v": this.validation.valid === undefined,
                "inv-v": this.validation.valid === false,
                select: this.isSelect,
                "has-hint": !!this.hint,
                inactive: this.notSelectable,
                __disabled: this.disabled,
              },
        ],
      },
      [
        this.isSearch
          ? null
          : label(
              {
                attrs: {
                  ...scoping,
                  for: this.id,
                  "data-append":
                    !`${this.vmodel}`.trim().length && this.required ? "*" : "",
                },
                staticClass: "label",
              },
              [`${this.label}`, validationMessage]
            ),
        this.isSelect
          ? btn(
              {
                attrs: { ...scoping, role: "button", tabindex: "-1" },
                staticClass: `activator input ${this.id}`,
                class: [{ placeholder: !this.vmodel }],
                props: {
                  value: this.vmodel,
                  tag: "div",
                  disabled: this.notSelectable,
                  readonly: this.notSelectable,
                  simpleButton: true,
                },
                on: {
                  "!click": (e) => {
                    this.$nextTick(() =>
                      requestAnimationFrame(() =>
                        this.$emit("toggle-select", e)
                      )
                    );
                  },
                },
              },
              [
                border,
                this.loading
                  ? div(
                      {
                        attrs: { ...scoping, id: this.id },
                        staticClass: "loading",
                      },
                      [
                        appLoader({
                          attrs: { ...scoping },
                          staticClass: "prepend-loader",
                        }),
                        ` Loading`,
                      ]
                    )
                  : h("input", {
                      ref: "input",
                      domProps: {
                        value: this.vmodel,
                      },
                      attrs: {
                        ...scoping,
                        autocomplete: this.autocomplete,
                        name: this.autocomplete || this.id,
                        value: this.vmodel,
                        pattern: this.pattern,
                        required: this.required,
                        spellcheck: "false",
                        type: "text",
                        tabindex:
                          this.readonly || this.disabled ? "-1" : undefined,
                        readonly: this.readonly,
                        disabled: this.disabled,
                        id: this.id,
                        placeholder: this.placeholder,
                      },
                      staticClass: "__pseudo-input",
                      on: {
                        "&focus": (e) => {
                          this.inputFocused = true;

                          e.currentTarget?.blur?.();

                          if (
                            e.relatedTarget &&
                            (!this.disabled || this.loading)
                          ) {
                            e.currentTarget.closest(".activator")?.click?.();
                          }
                        },
                        "&input": (e) => {
                          const input = e.currentTarget;

                          this.inputDirtied = true;

                          const value = input.value;

                          this.$emit("vmodel", value);

                          this.validator(this.vmodel);
                        },
                        "&blur": (e) => {
                          this.inputFocused = false;

                          if (e.relatedTarget) {
                            if (
                              !e.relatedTarget?.isSameNode(
                                this.$el.querySelector(`[role='button']`)
                              )
                            ) {
                              this.inputDirtied = true;
                            }
                          } else {
                            this.inputDirtied = true;
                          }
                        },
                      },
                    }),
                icon({
                  props: {
                    name: `${this.notSelectable ? "minus" : "chevron-down"}`,
                    size: 22,
                  },
                  attrs: { ...scoping },
                  staticClass: "activator-icon",
                  slot: "append",
                }),
              ]
            )
          : div(
              {
                attrs: { ...scoping },
                staticClass: `input-wrapper fill-before-and-after ${this.id}`,
              },
              [
                this.type == "tel"
                  ? btn(
                      {
                        ref: "prepend",
                        props: {
                          simpleButton: true,
                          flat: true,
                          disabled: true,
                          background: "transparent",
                          tag: "div",
                          value: this.appendValue,
                        },
                        attrs: { ...scoping },
                        staticClass: "prepend",
                      },
                      this.appendValue
                    )
                  : null,
                border,
                this.isSearch
                  ? icon({
                      props: {
                        name: "magnify",
                        size: 20,
                      },
                      attrs: { ...scoping },
                      staticClass: "search-icon",
                    })
                  : null,
                input({
                  ref: "input",
                  domProps: {
                    value: this.vmodel,
                  },
                  attrs: {
                    ...scoping,
                    id: this.id,
                    name: this.autocomplete || this.id,
                    autocomplete: this.autocomplete,
                    type:
                      this.type == "address"
                        ? undefined
                        : this.type == "password"
                        ? this.showPassword
                          ? "text"
                          : "password"
                        : this.type,
                    spellcheck: "false",
                    placeholder: this.placeholder
                      ? this.placeholder
                      : undefined,
                    required: this.required,
                    pattern: this.pattern,
                    minlength: this.minlength,
                    maxlength: this.maxlength,
                    disabled: this.disabled,
                  },
                  staticClass: "input",
                  class: [
                    {
                      search: this.isSearch,
                      capitalize: this.autocomplete == "name",
                    },
                  ],
                  on: {
                    "&input": (e) => {
                      this.asyncValidate = undefined;
                      const input = e.currentTarget;

                      this.asyncState = false;

                      this.inputDirtied = true;

                      const value = input.value;

                      this.$emit(
                        "vmodel",
                        this.autocomplete == "name"
                          ? capitalizeAll(value)
                          : value
                      );

                      this.$nextTick(() => {
                        const validatorProp = this.validator(this.vmodel);

                        validatorProp === true &&
                          typeof this.asyncValidator == "function" &&
                          this.asyncValidationDebounce.init();
                      });
                    },
                    "&focus": () => {
                      this.inputFocused = true;
                    },
                    "&blur": (e) => {
                      this.inputFocused = false;

                      this.$emit("password-blurred", {});

                      if (e.relatedTarget) {
                        if (
                          !e.relatedTarget?.isSameNode(
                            this.$el.querySelector(`[role='button']`)
                          )
                        ) {
                          this.inputDirtied = true;
                        }
                      } else {
                        this.inputDirtied = true;
                      }
                    },
                  },
                }),

                [1].map(() => {
                  const title =
                    this.asyncState == "check" ? "available" : "loading";
                  return (
                    /check|fetching/i.test(this.asyncState) &&
                    div(
                      {
                        attrs: { ...scoping, title },
                        staticClass: "append-state",
                      },
                      [
                        this.asyncState == "check"
                          ? icon({
                              props: { name: "check" },
                              staticClass: "hint-color-text",
                            })
                          : appLoader({
                              props: {
                                title,
                                size: "1rem",
                                color: "--info",
                                stroke: "1.5px",
                              },
                            }),
                      ]
                    )
                  );
                }),

                this.type == "password" &&
                  btn(
                    {
                      key: `toggle-password-${this.showPassword}`,
                      props: {
                        flat: true,
                        background: "transparent",
                        tag: "div",
                        simpleButton: true,
                      },
                      attrs: {
                        ...scoping,
                        role: "checkbox",
                        "aria-checked": `${this.showPassword}`,
                        title: `click to ${
                          this.showPassword ? "hide" : "show"
                        } password`,
                      },
                      staticClass: "append-btn",
                      style: {
                        color:
                          this.showPasswordToggleAlert && !this.showPassword
                            ? this.passwordToggleAlertClass
                            : undefined,
                      },
                      on: {
                        "!click": (e) => {
                          this.$emit("password-blurred", {});

                          this.$emit("append-click", e);
                        },
                      },
                    },
                    [
                      div(
                        {
                          attrs: { ...scoping },
                          staticClass: `toggle-password`,
                          class: [
                            this.passwordToggle.class
                              ? this.passwordToggle.class
                              : "",
                            {
                              dim: !this.vmodel.length,
                            },
                          ],
                        },
                        [
                          icon({
                            props: {
                              name: `eye${this.showPassword ? "Off" : ""}`,
                              size: 20,
                            },
                            key: `${this.showPassword}`,
                            attrs: { ...scoping },
                            staticClass: "visibility-icon",
                          }),
                        ]
                      ),
                    ]
                  ),
              ]
            ),
        this.hint &&
          span(
            {
              key: this.attentionHint ? `${this.inputFocused}` : undefined,
              attrs: {
                ...scoping,
              },
              staticClass: "input-hint",
              class: [
                {
                  "bounce-top": this.attentionHint,
                  __hidden: this.attentionHint && this.inputFocused,
                },
              ],
            },
            this.hint
          ),
      ]
    );
  },
};
</script>

<style>
.root[data-uiit] {
  display: grid;
  --input-height: 42px;
  grid-template-rows: auto var(--input-height) auto;
  grid-template-columns: 64px repeat(3, auto);
  row-gap: 0.25rem;
  position: relative;
  margin: 0 0.875rem 1rem 0;
  isolation: isolate;
  --main-border-width: 1px;
  --hint: 0px;
}

.root.__disabled[data-uiit] .label[data-uiit],
.root.__disabled[data-uiit] .content-wrapper[data-uiit],
.root.__disabled[data-uiit] .input-wrapper {
  opacity: var(--t-disabled);
}

.root.__disabled[data-uiit] .content-wrapper[data-uiit] {
  pointer-events: none;
}

.root[data-uiit].inactive {
  pointer-events: none;
}

.root[data-uiit].has-hint {
  --hint: 16px;
  margin-bottom: 1.25rem;
}

.root[data-uiit].switch {
  --input-height: 38px;
  grid-template-rows: 1rem var(--input-height) auto;
  grid-template-columns: 1fr;
  gap: 0;
}

.root[data-uiit].switch.hide-top {
  grid-template-rows: var(--input-height) auto;
}

.root[data-uiit].search {
  grid-template-rows: var(--input-height);
  grid-template-columns: auto;
  margin-right: 0;
}

.root[data-uiit].search .input-wrapper {
  border-radius: 8px !important;
}

.border[data-uiit] {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  border-radius: inherit;
  border: var(--ui-divide);
  border-width: var(--main-border-width);
  pointer-events: none;
  opacity: var(--t-disabled);
  z-index: 1;
}

.light-theme .border[data-uiit] {
  --t-disabled: 0.875;
}

.root.inv-v[data-uiit]:not(:focus-within) .border[data-uiit],
.inv-v[data-uiit] .input-wrapper:not(:focus-within)::after,
.inv-v[data-uiit] .input-wrapper:not(:focus-within)::before,
.root.inv-v[data-uiit] .activator-icon[data-uiit] {
  border-color: var(--error) !important;
}

.light-theme .root[data-uiit]:not(.inv-v) {
  --main-border-width: 0.75px;
}

.root.inv-v[data-uiit] {
  --main-border-width: 1px;
}

.root[data-uiit].delivery-address {
  --input-height: 84px;
  margin-right: 0;
}

.label[data-uiit] {
  margin: 0 6px;
  opacity: var(--t-body);
  grid-column: 1/5;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.label[data-uiit]::after {
  content: attr(data-append);
  margin-left: 0.5ch;
}

.root.inv-v[data-uiit] .label {
  color: var(--error);
  font-weight: 500;
}

.root[data-uiit]:focus-within .label {
  font-weight: 500;
}

.v-msg[data-uiit] {
  color: var(--error);
  font-size: 0.875em;
  opacity: var(--t-subtitle);
  animation-delay: 150ms;
  position: absolute;
  right: 0;
}

.prepend[data-uiit] {
  border-radius: 6px 0 0 6px !important;
  width: 64px !important;
  height: 100% !important;
  padding: 0;
  font-size: 14px;
  background-color: var(--theme-primary);
  flex-shrink: 0;
}

.input-wrapper[data-uiit] {
  position: relative;
  grid-column: 1/5;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.input-wrapper[data-uiit].delivery-phone::after,
.input-wrapper[data-uiit].delivery-phone::before {
  border-left: var(--ui-divide);
  border-width: var(--main-border-width);
  width: calc(100% - 64px);
  left: 64px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-wrapper[data-uiit].delivery-phone::before {
  opacity: var(--t-disabled);
}

.input-wrapper[data-uiit]::after {
  border: 2px solid var(--info) !important;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  top: -1px;
  left: -1px;
  opacity: 0;
  transition: 0.2s opacity;
}

.input-wrapper[data-uiit]:focus-within::after {
  opacity: 1;
}

#ui-root .input-wrapper:focus-within::after,
#ui-root .input-wrapper:focus-within::before {
  border-color: var(--info) !important;
}

.search-icon[data-uiit] {
  position: absolute;
  left: 0.75rem;
  opacity: var(--t-disabled);
}

.input[data-uiit] {
  background-color: var(--theme-primary);
  border: none;
  box-shadow: none;
  outline: none;
  border-radius: inherit;
  padding: 0 1rem;
  color: inherit;
  width: 100%;
  height: 100%;
  resize: none;
  letter-spacing: 0.5px !important;
  appearance: none;
}

.input[data-uiit][disabled] {
  opacity: var(--t-body);
}

.input[data-uiit][type="tel"] {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input[data-uiit].capitalize {
  text-transform: capitalize;
}

.input[data-uiit].search {
  padding-left: 2.5rem;
}

.input[data-uiit]::-ms-reveal,
.input[data-uiit]::-ms-clear {
  display: none;
}

.input[data-uiit]:-webkit-autofill,
.__pseudo-input[data-uiit]:-webkit-autofill {
  box-shadow: 0 0 0 1000px var(--theme-primary) inset !important;
  -webkit-box-shadow: 0 0 0 1000px var(--theme-primary) inset !important;
  -webkit-text-fill-color: var(--theme-surface-text) !important;
}

.input[data-uiit]:autofill,
.__pseudo-input[data-uiit]:autofill {
  box-shadow: 0 0 0 1000px var(--theme-primary) inset !important;
  -webkit-box-shadow: 0 0 0 1000px var(--theme-primary) inset !important;
  -webkit-text-fill-color: var(--theme-surface-text) !important;
}

.input[data-uiit][type="search"]::-webkit-search-decoration,
.input[data-uiit][type="search"]::-webkit-search-cancel-button,
.input[data-uiit][type="search"]::-webkit-search-results-button,
.input[data-uiit][type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

textarea.input[data-uiit] {
  padding: 0.75rem 1rem;
  font-family: inherit;
  line-height: 1.365;
  letter-spacing: 0.4px;
}

.input[data-uiit]::placeholder,
.__pseudo-input[data-uiit]::placeholder {
  opacity: var(--t-disabled);
  font-size: 14px !important;
  color: inherit;
}

.light-theme .__pseudo-input[data-uiit],
.light-theme .input[data-uiit] {
  --t-disabled: 0.75;
}

.input[data-uiit][type="password"] {
  padding-right: 54px;
}

.append-state[data-uiit] {
  width: 3rem;
  height: calc(100% - 4px);
  top: 2px;
  right: 2px;
  z-index: 1;
  background-color: var(--theme-primary);
  display: grid;
  place-content: center;
  position: absolute;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
}

.append-btn[data-uiit] {
  position: absolute;
  right: 0;
  border-radius: 0 !important;
  border-top-right-radius: inherit !important;
  border-bottom-right-radius: inherit !important;
  width: 48px !important;
  padding: 0 !important ;
}

.toggle-password.dim[data-uiit] {
  opacity: var(--t-caption);
  display: grid;
  place-items: center;
}

.visibility-icon[data-uiit] {
  opacity: var(--t-caption);
}

.activator[data-uiit] {
  grid-column: 1/5;
  display: flex;
  justify-content: space-between;
  padding: 0px !important;
  border-radius: 6px !important;
  font-size: 16px !important;
  column-gap: 0 !important;
  --before-color: var(--info) !important;
}

.activator[data-uiit]:hover:not(.Active) > * {
  transform: none !important;
}

.root.inv-v[data-uiit] .activator {
  --before-color: var(--error) !important;
}

.activator[data-uiit].__readonly svg {
  opacity: var(--t-disabled);
}

#ui-root .activator[data-uiit] {
  background-color: var(--theme-primary) !important;
}

.__pseudo-input[data-uiit] {
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: transparent;
  border: none;
  color: inherit;
  user-select: none;
  outline: none !important;
  box-shadow: none;
  padding: 0 1rem;
}

.loading[data-uiit] {
  display: grid;
  align-items: center;
  grid-template-columns: auto auto;
  column-gap: 0.65rem;
  padding: 0 1rem;
  opacity: var(--t-disabled);
  font-size: 0.95rem;
}

.prepend-loader[data-uiit] {
  --size: 1.25rem;
}

.activator-icon[data-uiit] {
  width: 64px;
  height: 100%;
  background-color: var(--theme-primary);
  border-left: var(--ui-divide);
  border-left-width: var(--main-border-width);
  opacity: var(--t-caption);
}

@media (hover: hover) and (pointer: fine) {
  .activator[data-uiit]:hover::before {
    opacity: 0.1;
  }

  .activator[data-uiit]:focus::before {
    opacity: 0.15;
  }

  .activator[data-uiit]:focus::after {
    border-width: 2px;
  }

  .int-v[data-uiit] .activator[data-uiit]:focus::after {
    border: 2px solid var(--info) !important;
  }

  .inv-v[data-uiit] .activator[data-uiit]:focus::after {
    border: 2px solid var(--error) !important;
  }
}

.activator[data-uiit]:focus-visible::before {
  opacity: 0.15;
}

.activator[data-uiit]:focus-visible::after {
  border-width: 2px;
}

.int-v[data-uiit] .activator[data-uiit]:focus-visible::after {
  border: 2px solid var(--info) !important;
}

.inv-v[data-uiit] .activator[data-uiit]:focus-visible::after {
  border: 2px solid var(--error) !important;
}

/* switch */

.content-wrapper[data-uiit] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column: 1/5;
  cursor: pointer;
  isolation: isolate;
  position: relative;
}

.switch-v-msg[data-uiit] {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.switch-label[data-uiit] {
  font-size: 1.1rem;
  letter-spacing: 0.1px;
  flex-grow: 1;
  cursor: inherit;
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 6px;
  margin-right: 10px;
  border-radius: var(--rounded);
  position: relative;
}

.switch-label[data-uiit]::before {
  opacity: 0;
  transition: 0.1s opacity linear;
  background: var(--info);
}

.switch-label[data-uiit].Active::before {
  opacity: 0.2;
}

.root.inv-v[data-uiit] .switch-label::before {
  background: var(--error);
}

.switch-wrapper[data-uiit] {
  width: 44px;
  height: 28px;
  border-radius: 16px;
  padding: 0;
  position: relative;
  isolation: isolate;
  cursor: inherit;
  flex-shrink: 0;
}

.switch-wrapper[data-uiit]::before {
  transition: 0.2s opacity;
  opacity: 0;
}

.root.switch[data-uiit]:focus-within .switch-wrapper::before,
.switch-label[data-uiit].Active + .switch-wrapper::before {
  opacity: var(--t-body);
  border: 2px solid var(--info);
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  z-index: 2;
  top: -5px;
  left: -5px;
  border-radius: 20px;
}

.root.inv-v[data-uiit] .switch-wrapper::before {
  border-color: var(--error) !important;
}

.switch-input[data-uiit] {
  width: 100%;
  height: 50%;
  position: absolute;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  top: 25%;
}

.switch-control[data-uiit] {
  position: absolute;
  z-index: 1;
  isolation: isolate;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--disabled);
}

.switch-control[data-uiit]::before {
  background-color: var(--info);
  transition: 0.2s opacity;
  opacity: 0;
}

.switch-control.checked[data-uiit]::before {
  opacity: 1;
}

.switch-control[data-uiit]::after {
  z-index: 1;
  background-color: #f5f5f5;
  box-shadow: var(--raise-dark);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  top: 1.35px;
  left: 1.35px;
  transition: 0.2s transform, 0.2s opacity;
  opacity: var(--t-body);
}

.switch-control.checked[data-uiit]::after {
  opacity: 1;
  transform: translate3d(16px, 0, 0);
}

.hint[data-uiit],
.input-hint[data-uiit] {
  word-spacing: 0.5px;
  font-size: 0.8rem;
  opacity: var(--t-caption);
  display: inline-block;
  --bounce-opacity: var(--t-caption);
  margin-left: 6px;
  transition: 1ms visibility 150ms;
}

.input-hint[data-uiit] {
  grid-column: 1/5;
  margin-left: 0.5rem;
  animation-duration: 1.5s;
}

.__hidden[data-uiit] {
  transition: 0s !important;
  visibility: hidden !important;
}

.bounce-top[data-uiit] {
  animation-delay: 500ms !important;
}

/* switch ends */
</style>
