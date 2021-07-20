<script>
export default {
  name: "UiBtn",
  functional: true,

  props: {
    tag: {
      type: String,
      default: "button",
    },
    to: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
    },
    text: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    raise: {
      type: [Boolean, String],
      default: "raise-light",
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    shape: {
      type: String,
      default: "round",
    },
    background: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    case: {
      type: String,
      default: "initial",
    },
    value: {
      type: String,
      default: undefined,
    },
    readonly: Boolean,
    simpleButton: Boolean,
    actionButton: Boolean,
    filledText: Boolean,
    asWrapper: Boolean,
    persistent: {
      type: Boolean,
      default: undefined,
    },
    persistentOffset: {
      type: Number,
      default: 50,
    },
    appendClass: {
      type: [String, Boolean],
      default: true,
    },
    prependClass: {
      type: [String, Boolean],
      default: true,
    },
  },

  render(h, c) {
    let $attrs = c.data?.attrs || {};

    const staticClass = c.data.staticClass ? ` ${c.data.staticClass}` : "";

    const span = (d, c) => h("span", d, c);
    const root = (d, c) => h("ui-clickable", d, c);

    let isText = false;

    const canRaise = !c.props.flat && !c.props.text && !c.props.outlined;

    const title = () => {
      if ($attrs.title) {
        return $attrs.title;
      }
      const slot = (c.slots?.() || {})?.default?.find(
        (x) => typeof x.text == "string" && !x.tag && !x.isComment
      );
      const text = slot?.text;

      if (slot) {
        isText = true;
        return text.toLowerCase();
      }
    };

    const wrapperClasses = {
      __flat: c.props.flat,
      __disabled: c.props.disabled,
      __tile: /^tile$/i.test(c.props.shape) && !c.props.icon,
      __round: /^round$/i.test(c.props.shape) && !c.props.icon,
      __pill: /^pill$/i.test(c.props.shape) && !c.props.icon,
      __circle: /^circle$/i.test(c.props.shape) && !c.props.icon,
      __icon: c.props.icon,
      "theme-primary":
        c.props.background == "" && !c.props.text && !c.props.outlined,
      "__default-color":
        c.props.color == "" && (c.props.text || c.props.outlined),
      __block: c.props.block && !c.props.icon,
      __readonly: c.props.readonly,
    };

    $attrs = 0;

    return root(
      {
        ...c.data,

        props: {
          to: c.props.to,
          tag: c.props.tag,
          persistent:
            typeof c.props.persistent == "boolean"
              ? c.props.persistent
              : c.props.actionButton && !c.props.text && !c.props.filledText,
          persistentOffset: c.props.persistentOffset,
        },
        attrs: {
          role: !/button/i.test(c.props.tag) ? "button" : undefined,
          tabindex: !/button/i.test(c.props.tag)
            ? c.props.disabled || c.props.readonly
              ? "-1"
              : "0"
            : c.props.readonly
            ? "-1"
            : undefined,
          ...(c.data?.attrs || {}),
          disabled: c.props.disabled,
          value: c.props.value,
          title: title(),
        },
        staticClass: `ui-btn ${staticClass}`,
        scopedSlots: (c.scopedSlots || {})?.default
          ? {
              default: (c.scopedSlots || {}).default,
            }
          : undefined,
        class: [
          c.props.asWrapper
            ? { ...wrapperClasses }
            : {
                ...wrapperClasses,
                __sm: /^sm$|^small$/i.test(c.props.size),
                __md: /^md$|^medium$/i.test(c.props.size),
                __lg: /^lg$|^large$/i.test(c.props.size),
                __prepend: c.props.prependClass
                  ? !!(c.slots?.() || {}).prepend
                  : false,
                __append: c.props.appendClass
                  ? !!(c.slots?.() || {}).append
                  : false,
                __text: c.props.text,
                __outlined: c.props.outlined,
                "__case-capitalize": /capitalize/i.test(c.props.case),
                "__case-upper": /^caps$|^uppercase$|^upper$/i.test(
                  c.props.case
                ),
                "__case-lower": /^low$|^lowercase$|^lower$/i.test(c.props.case),
                "__case-initial": /^initial$/i.test(c.props.case),
                __action: c.props.actionButton,
                "__filled-text": c.props.filledText && !c.props.disabled,
              },
          !c.props.text && !c.props.outlined ? c.props.background : "",
          c.props.color
            ? /-text$/i.test(c.props.color)
              ? c.props.color
              : `${c.props.color}-text`
            : "__default-color",
          c.props.raise === true && canRaise
            ? "raise-light"
            : typeof c.props.raise == "string" && canRaise
            ? c.props.raise
            : "",
          /^tile$|^round$|^pill$|^circle$/i.test(c.props.shape)
            ? c.props.shape
            : "",
          c.data.class || [],
        ],
        on: {
          ...c.data.on,
        },
        nativeOn: /nuxt-?link|router-?link/i.test(c.props.tag)
          ? {
              ...c.data.on,
            }
          : undefined,
      },
      [
        (c.slots?.() || {}).prepend && (c.slots?.() || {}).prepend,
        c.props.icon || c.props.simpleButton || isText
          ? (c.slots?.() || {}).default
          : (c.slots?.() || {}).default &&
            span({ staticClass: "__default-slot" }, [
              (c.slots?.() || {}).default,
            ]),
        (c.slots?.() || {}).append && (c.slots?.() || {}).append,
        c.props.outlined &&
          span({ attrs: { "aria-hidden": "true" }, staticClass: "outline" }),
      ]
    );
  },
};
</script>

<style>
.ui-btn {
  --btn__size-sm: 32px;
  --btn__size-md: 42px;
  --btn__size-lg: 56px;

  --btn__size-text-sm: 28px;
  --btn__size-text-md: 38px;
  --btn__size-text-lg: 52px;

  --icon__size-sm: 32px;
  --icon__size-md: 38px;
  --icon__size-lg: 48px;

  /* --padding-sm: 3px 16px; */
  --padding-sm: 3px 20px;
  /* --padding-md: 3px 24px; */
  --padding-md: 4px 40px;
  /* --padding-lg: 8.8px 32px; */
  --padding-lg: 8px 50px;
  --padding__text-sm: 0 14px;
  --padding__text-md: 0 22px;
  --padding__text-lg: 4px 30px;

  --fontSize-sm: 13px;
  --lineHeight-sm: 1.1;
  --fontSize-md: 16px;
  --lineHeight-md: 1.3;
  --fontSize-lg: 19px;
  --lineHeight-lg: 1.5;

  --pill__padding-sm: 5.6px 14px;
  --pill__padding-md: 9.6px 22px;
  --pill__padding-lg: 10.4 30px;
  --circle__padding-sm: 4px;
  --circle__padding-md: 4px;
  --circle__padding-lg: 4px;

  --border-radius-pill: 1.6rem;

  --gap-sm: 4px;
  --gap-md: 6px;
  --gap-lg: 8px;

  --before-color: inherit;

  --filled-text-opacity: 0.15;
}

.ui-btn {
  -webkit-appearance: none;
  font-weight: 500;
  font-family: var(--default-font-family);
  overflow: hidden;
  position: relative;
  display: inline-grid;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  word-spacing: 0.8px;
  width: fit-content;
  border: none;
  outline: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: 0.25s transform var(--backOut), 0.1s opacity, 0.2s filter;
  backface-visibility: hidden;
  isolation: isolate;
  white-space: nowrap;
}

.ui-btn.__filled-text {
  background: none !important;
}

.ui-btn.__filled-text:not(.Active)::before {
  opacity: var(--filled-text-opacity, 0.15);
}

@media (hover: hover) and (pointer: fine) {
  .ui-btn.__filled-text:not(:hover):not(.Active)::before {
    opacity: 0.2;
  }
}

.ui-btn.__readonly {
  pointer-events: none !important;
}

.ui-btn.__prepend:not(.__append),
.ui-btn.__append:not(.__prepend) {
  grid-template-columns: auto 1fr;
}

.ui-btn.__prepend.__append {
  grid-template-columns: auto 1fr auto;
}

.ui-btn[class*="pend"].__sm {
  column-gap: var(--gap-sm);
}

.ui-btn[class*="pend"].__md {
  column-gap: var(--gap-md);
}

.ui-btn[class*="pend"].__lg {
  column-gap: var(--gap-lg);
}

/* .ui-btn > * {
  transition: 0.2s transform;
  backface-visibility: hidden;
} */

.ui-btn > .material-design-icon {
  height: 100%;
  display: flex;
  align-items: center;
}

.ui-btn > .__default-slot {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.ui-btn > span.outline {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0.75px;
  width: calc(100% - 1.5px);
  border-radius: inherit;
  pointer-events: none;
  border: 1.5px solid currentColor;
  opacity: var(--t-caption);
  transition: none;
  transform: none !important;
}

.ui-btn.__case-lower {
  text-transform: lowercase;
}

.ui-btn.__case-upper {
  text-transform: uppercase;
}

.ui-btn.__case-inital {
  text-transform: initial;
}

.ui-btn.__case-capitalize {
  text-transform: capitalize;
}

.ui-btn::before,
.ui-btn::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
  color: inherit;
  transition: 0.2s opacity ease;
  z-index: -1;
}

.ui-btn::after {
  transform: scale(0.995);
  border: 2px solid currentColor;
  opacity: 0;
  transition: 0s;
}

.ui-btn::before {
  /* color: var(--before-color); */
  background-color: currentColor;
  opacity: 0;
  z-index: -1;
}

/* .ui-btn.__default-color {
  --before-color: var(--primary);
} */

.ui-btn:focus-visible::after {
  opacity: var(--t-disabled);
}

.ui-btn.__outlined:focus-visible::after {
  opacity: var(--t-caption);
}

@media (hover: hover) and (pointer: fine) {
  .ui-btn:hover {
    filter: brightness(0.875);
  }
  .ui-btn:hover::before {
    opacity: 0.15;
  }
  /* .ui-btn:hover > * {
    transform: scale3d(1.01, 1.01, 1);
  }
  .ui-btn.__icon:hover > * {
    transform: scale3d(1.05, 1.05, 1);
  } */
  .ui-btn:focus-within::before {
    opacity: 0.25;
  }
  .ui-btn.Active::before {
    opacity: 0.25;
  }
}

.ui-btn.Active::before {
  opacity: 0.25;
  transition: 0s;
}

.ui-btn.slow-active::before,
.ui-btn.slow-active {
  transition-duration: 150ms !important;
  transition-timing-function: linear !important;
}

.ui-btn.Active {
  transition: 0.4s transform;
  transform: scale3d(0.975, 0.975, 1);
  /* opacity: var(--t-caption); */
}

.ui-btn.__icon.Active,
.ui-btn.__sm.Active {
  transition: 0.4s transform;
  transform: scale3d(0.9, 0.9, 1);
  /* opacity: var(--t-caption); */
}

.ui-btn.__disabled::before {
  opacity: 0;
}

.ui-btn.__outlined,
.ui-btn.__text {
  background: none;
}

.ui-btn.__sm.__round {
  border-radius: var(--rounded-sm);
}

.ui-btn.__md.__round {
  border-radius: var(--rounded);
}

.ui-btn.__lg.__round {
  border-radius: var(--rounded-lg);
}

.ui-btn.__pill {
  border-radius: var(--border-radius-pill);
}

.ui-btn.__sm.__pill {
  padding: var(--pill__padding-sm);
}

.ui-btn.__md.__pill {
  padding: var(--pill__padding-md);
}

.ui-btn.__lg.__pill {
  padding: var(--pill__padding-lg);
}

.ui-btn.__circle {
  border-radius: 50%;
}

.ui-btn.__sm.__circle {
  height: var(--btn__size-sm);
  width: var(--btn__size-sm);
  padding: var(--circle__padding-sm);
}

.ui-btn.__md.__circle {
  height: var(--btn__size-md);
  width: var(--btn__size-md);
  padding: var(--circle__padding-md);
}

.ui-btn.__lg.__circle {
  height: var(--btn__size-lg);
  width: var(--btn__size-lg);
  padding: var(--circle__padding-lg);
}

.ui-btn.__sm {
  padding: var(--padding-sm);
  min-height: var(--btn__size-sm);
  height: fit-content;
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-sm);
}

.ui-btn.__sm.__text {
  min-height: var(--btn__size-text-sm);
}

.ui-btn.__md {
  padding: var(--padding-md);
  min-height: var(--btn__size-md);
  height: fit-content;
  font-size: var(--fontSize-md);
  line-height: var(--lineHeight-md);
}

.ui-btn.__md.__text {
  min-height: var(--btn__size-text-md);
}

.ui-btn.__lg {
  padding: var(--padding-lg);
  min-height: var(--btn__size-lg);
  height: fit-content;
  font-size: var(--fontSize-lg);
  line-height: var(--lineHeight-lg);
}

.ui-btn.__lg.__text {
  min-height: var(--btn__size-text-lg);
  height: var(--btn__size-text-lg);
}

.ui-btn.__text.__sm {
  padding: var(--padding__text-sm);
}

.ui-btn.__text.__md {
  padding: var(--padding__text-md);
}

.ui-btn.__text.__lg {
  padding: var(--padding__text-lg);
}

.ui-btn.__icon {
  padding: 0 !important;
  border-radius: 50%;
}

.ui-btn.__sm.__icon {
  height: var(--icon__size-sm);
  max-height: var(--icon__size-sm);
  min-height: var(--icon__size-sm);
  width: var(--icon__size-sm);
  max-width: var(--icon__size-sm);
  min-width: var(--icon__size-sm);
}

.ui-btn.__md.__icon {
  height: var(--icon__size-md);
  max-height: var(--icon__size-md);
  min-height: var(--icon__size-md);
  width: var(--icon__size-md);
  max-width: var(--icon__size-md);
  min-width: var(--icon__size-md);
}

.ui-btn.__lg.__icon {
  height: var(--icon__size-lg);
  max-height: var(--icon__size-lg);
  min-height: var(--icon__size-lg);
  width: var(--icon__size-lg);
  max-width: var(--icon__size-lg);
  min-width: var(--icon__size-lg);
}

#ui-root .ui-btn.__disabled {
  box-shadow: none;
  opacity: var(--t-disabled);
}

.ui-btn.__disabled:not(.__text):not(.transparent) {
  background: var(--disabled) !important;
}

.light-theme .ui-btn.__disabled {
  color: rgba(59, 59, 59) !important;
  pointer-events: none;
}

.dark-theme .ui-btn.__disabled {
  color: #ffffff77 !important;
  pointer-events: none;
}

.ui-btn.outlined.__disabled,
.ui-btn.__text.__disabled {
  background: none !important;
  border-color: var(--disabled) !important;
  color: var(--disabled) !important;
}

.ui-btn.__block {
  display: grid;
  width: 100%;
}

.ui-btn.__action {
  height: 48px;
  border-radius: var(--pill) !important;
}
</style>
