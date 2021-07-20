<script>
import { sleep } from "~/components/utils/main";
export default {
  name: "DeliveryInstructions",
  data() {
    return {
      vmodel: "",
      saved: false,
      recentStyle: undefined,
      renderStatus: false,
      showStatus: false,
      statusTimeStamp: null,
      insertingText: false,
      inputFocused: false,
    };
  },

  computed: {
    showCancel() {
      return !this.saved && (this.savedVmodel.length || this.vmodel.length);
    },
    savedVmodel() {
      return this.$store.state.savedDeliveryInstructions;
    },
  },

  watch: {
    saved() {
      const input = this.$refs.input;
      if (input) {
        this.recentStyle = input.style.cssText;
      }
    },
  },

  mounted() {
    this.saved = !!this.savedVmodel.length;

    this.$store.commit("FETCHED", {
      value: "deliveryInstructions",
      path: "components",
    });
  },

  methods: {
    updateSavedInstruction(value) {
      this.$store.commit("UPDATE_", {
        name: "savedDeliveryInstructions",
        value,
      });
    },
  },

  render(h) {
    const scoping = { "data-dis": "" };
    const div = (d, c) => h("div", d, c);
    const span = (d, c) => h("span", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const p = (d, c) => h("p", d, c);
    const q = (d, c) => h("q", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const textarea = (d) => h("textarea", d);
    const inputLength = this.vmodel.length;

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root fill-before",
      },
      [
        h2(
          {
            attrs: { ...scoping },
            staticClass: "title",
          },
          [
            icon({
              props: {
                name: "commentQuestion",
              },
              attrs: { ...scoping },
              staticClass: "title-deco",
            }),
            "Instructions",
          ]
        ),
        h3(
          {
            attrs: { ...scoping },
            staticClass: "desc",
          },
          [
            this.saved
              ? `Your instructions has been saved, and we will make sure to carry it out.`
              : `Have any instructions regarding your delivery? Feel free to write it down below.`,
          ]
        ),
        div(
          {
            attrs: { ...scoping },
            staticClass: "input-wrapper",
            class: [
              { saved: this.saved, "fill-before-and-after": !this.saved },
            ],
          },
          [
            this.renderStatus &&
              this.saved &&
              p(
                {
                  attrs: { ...scoping, "aria-hidden": "true" },
                  staticClass: "status",
                  class: [{ show: this.showStatus && this.renderStatus }],
                },
                `Saved!`
              ),
            this.saved && this.savedVmodel.length
              ? q(
                  {
                    attrs: { ...scoping },
                    staticClass: "quote",
                  },
                  [
                    ` ${this.savedVmodel} `,
                    span({ attrs: { ...scoping }, staticClass: "pseudo" }),
                  ]
                )
              : [
                  textarea(
                    {
                      ref: "input",
                      attrs: {
                        ...scoping,
                        spellcheck: "false",
                        value: this.vmodel,
                        placeholder: `${
                          this.inputFocused ? "Add" : "Click to add"
                        } delivery instruction`,
                        maxlength: "200",
                      },
                      domProps: {
                        value: this.vmodel.trimLeft(),
                      },
                      staticClass: "input",
                      style: this.recentStyle,
                      on: {
                        focus: () => {
                          this.inputFocused = true;
                        },
                        blur: (e) => {
                          this.inputFocused = false;

                          if (!this.vmodel.trimLeft().length) {
                            this.vmodel = "";
                            e.currentTarget.value = "";
                          }
                        },
                        input: (e) => {
                          this.insertingText =
                            e.data || /insertFromPaste/i.test(e?.inputType);

                          let scrollHeight = this.$refs.input.scrollHeight;

                          scrollHeight != 84 &&
                            this.$nextTick(() => {
                              this.$refs.input.style.height = "";
                              scrollHeight = this.$refs.input.scrollHeight;
                              requestAnimationFrame(() => {
                                this.$refs.input.style.height = `${scrollHeight}px`;
                              });
                            });
                          this.saved = false;
                          if (this.vmodel.length <= 200) {
                            this.vmodel = e.currentTarget.value.trimLeft();
                          }
                        },
                      },
                    },
                    []
                  ),
                  inputLength
                    ? span(
                        {
                          attrs: { ...scoping },
                          staticClass: "hint",
                          class: [
                            {
                              "warning-text":
                                inputLength > 180 && inputLength < 200,
                              "bounce-top":
                                inputLength > 180 &&
                                inputLength < 200 &&
                                this.insertingText,
                              "error-text vibrate": inputLength >= 200,
                            },
                          ],
                        },
                        `${inputLength}/200`
                      )
                    : null,
                ],
          ]
        ),
        this.savedVmodel || this.vmodel
          ? div(
              {
                attrs: { ...scoping },
                staticClass: "action-wrapper",
                class: [
                  {
                    saved: this.saved,
                    "two-cols": this.showCancel,
                  },
                ],
              },
              [
                this.showCancel
                  ? btn(
                      {
                        attrs: { ...scoping, title: "cancel" },
                        props: {
                          color: "error",
                          flat: true,
                          filledText: true,
                          shape: "pill",
                        },
                        staticClass: "cancel",
                        on: {
                          "!click": () => {
                            if (this.savedVmodel.length) {
                              this.saved = true;
                            } else {
                              this.vmodel = "";
                            }
                          },
                        },
                      },
                      "Cancel"
                    )
                  : null,
                btn(
                  {
                    key: `${this.saved}`,
                    props: {
                      background: !this.saved ? "info" : undefined,
                      color: this.saved ? "info" : undefined,
                      flat: true,
                      disabled: !this.vmodel.length && !this.savedVmodel.length,
                      simpleButton: true,
                      filledText: this.saved,
                      shape: "pill",
                    },
                    attrs: {
                      ...scoping,
                      title: `${this.saved ? "edit" : "save"} instructions`,
                    },
                    staticClass: "dyn-action",
                    class: [{ saved: this.saved }],
                    on: {
                      "!click": () => {
                        if (!this.vmodel.length && !this.saved) {
                          this.updateSavedInstruction(this.vmodel);
                          return;
                        }
                        this.saved = !this.saved;
                        this.$nextTick(() => {
                          if (this.saved) {
                            this.updateSavedInstruction(this.vmodel);
                            this.renderStatus = true;
                            const timeStamp = performance.now();
                            this.statusTimeStamp = timeStamp;
                            requestAnimationFrame(async () => {
                              this.showStatus = true;
                              await sleep.call(this, 2516);
                              this.statusTimeStamp == timeStamp &&
                                (this.showStatus = false);
                              await sleep.call(this, 316);
                              this.statusTimeStamp == timeStamp &&
                                (this.renderStatus = false);
                            });
                          }
                          const input = this.$refs.input;
                          if (!this.saved) {
                            if (this.savedVmodel.length) {
                              this.vmodel = this.savedVmodel;
                            }
                            if (input) {
                              input.selectionEnd = this.vmodel.length;
                              input?.focus?.();
                            }
                          }
                        });
                      },
                    },
                  },
                  [this.saved ? "Edit" : "Save"]
                ),
              ]
            )
          : null,
      ]
    );
  },
};
</script>

<style>
.root[data-dis] {
  position: relative;
  padding: 0 1.25rem 2.5rem;
  margin-bottom: 2rem;
  display: grid;
  overflow-x: hidden;
}

.root[data-dis]::before {
  border-bottom: var(--ui-divide);
}

.title[data-dis] {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  opacity: var(--t-title);
}

.status[data-dis] {
  position: absolute;
  top: -0.25rem;
  right: 0;
  color: var(--success);
  font-size: 0.9rem;
  padding-right: 1rem;
  transition: 0.3s opacity, 0.3s transform;
}

.status[data-dis]:not(.show) {
  opacity: 0;
  transform: translate3d(50%, 0, 0);
}

.desc[data-dis] {
  margin: 1rem 0;
  opacity: var(--t-subtitle);
  font-weight: 400 !important;
  font-size: 1rem !important;
}

.input-wrapper[data-dis] {
  border-radius: var(--rounded);
  position: relative;
  min-height: 84px;
  padding: 1.5rem 0;
  display: grid;
  isolation: isolate;
}

.input-wrapper[data-dis]::before {
  background-color: currentColor;
  transition: 0s;
  opacity: 0;
  z-index: 1;
  height: calc(100% - 3rem);
  top: 1.5rem;
}

@media (hover: hover) and (pointer: fine) {
  .input-wrapper[data-dis]:not(.saved):hover::before {
    opacity: 0.1;
  }

  .input-wrapper[data-dis]:not(.saved):hover::after {
    border-width: 2px;
    opacity: 0.5;
  }

  .input-wrapper[data-dis]:not(.saved):focus-within::before {
    visibility: hidden;
  }
}

.input-wrapper[data-dis]:not(.saved):focus-within::after {
  opacity: 1;
  border-width: 2.5px;
  border-color: var(--warning);
}

.input-wrapper[data-dis]::after {
  z-index: 1;
  transition: 0.15s opacity linear;
  height: calc(100% - 3rem);
  top: 1.5rem;
}

.input-wrapper[data-dis]:not(.saved)::after {
  border: var(--ui-divide);
  border-width: 1px;
  width: 100%;
  left: 0px;
}

.hint[data-dis] {
  font-size: 0.85rem;
  opacity: var(--t-subtitle);
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  z-index: -1;
}

.quote[data-dis] {
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--theme-banner);
  margin: 0 1rem;
  letter-spacing: 0.5px;
  line-height: 1.5;
  min-height: 84px;
  max-width: 100%;
  overflow: auto;
  word-break: break-word;
  position: relative;
}

.quote[data-dis] > span {
  border: var(--ui-divide);
  width: calc(100% - 1px);
  left: 0.5px;
}

.input[data-dis] {
  min-height: 84px;
  border-radius: inherit;
  background-color: var(--theme-banner);
  position: relative;
  outline: none;
  cursor: pointer;
  padding: 0.75rem;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  width: 100%;
  color: inherit;
  outline: none;
  border: none;
  line-height: 1.5;
  caret-color: currentColor;
}

.input[data-dis]::placeholder {
  font-size: 14px;
  opacity: var(--t-caption);
  color: inherit;
}

.action-wrapper[data-dis] {
  display: grid;
  place-items: center;
  gap: 1rem;
  margin: 1rem auto 0.5rem;
}

.action-wrapper[data-dis].two-cols {
  grid-template-columns: 1fr 1fr;
}

.action-wrapper[data-dis].saved {
  grid-template-columns: 1fr;
}

.dyn-action[data-dis] {
  min-width: 128px;
  justify-self: flex-start;
}

.dyn-action.saved[data-dis] {
  text-decoration: underline !important;
  justify-self: center;
}

.cancel[data-dis] {
  min-width: 128px;
  justify-self: flex-end;
}
</style>
