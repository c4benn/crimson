<script>
import icons from "~/components/utils/uiIcons";
import { camelCase, kebabCase } from "~/components/utils/main";
export default {
  name: "UiIcon",
  functional: true,

  props: {
    name: {
      type: String,
      default: undefined,
      validator: (x) => {
        if (typeof icons[camelCase(x)] != "object") {
          throw new TypeError("Invalid icon name " + x);
        } else return true;
      },
    },
    color: {
      type: String,
      default: undefined,
    },
    size: {
      type: [String, Number],
      default: "24px",
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    height: {
      type: [String, Number],
      default: undefined,
    },
    viewBox: {
      type: String,
      default: `0 0 24 24`,
    },
    title: {
      type: String,
      default: undefined,
    },
    shape: {
      type: String,
      default: "round",
    },
    props: {
      type: Object,
      default: () => undefined,
    },
    clickable: Boolean,
    tag: {
      type: String,
      default: "span",
    },
    to: {
      type: [Object, String],
      default: () => undefined,
    },
  },

  render(h, c) {
    const props = c.props;

    const root = (d, c) => h(props.clickable ? "ui-btn" : props.tag, d, c);
    const svg = (d, c) => h("svg", d, c);
    const path = (d, c) => h("path", d, c);
    const g = (d, c) => h("g", d, c);

    const $data = c.data;

    const $slots = c.slots?.();

    const $attrs = $data.attrs;

    const $listeners = $data.on;

    const slot = $slots?.default?.[0];

    const staticClass = $data.staticClass ? ` ${$data.staticClass}` : "";

    const $class = $data.class;

    const getSize = () => {
      if (props.clickable) {
        return props.size.match(/^\d+/) ? "md" : props.size;
      }

      const getValue = (prop) => parseFloat(props[prop] || props.size);

      return {
        width: getValue("width"),
        height: getValue("height"),
      };
    };

    const $getName = (val) => {
      return `${kebabCase(val)}`.replace(/-/g, " ").toLowerCase();
    };

    if (!props.name && typeof slot?.text != "string") {
      throw new TypeError("invalid icon path!");
    }

    const objectPath = slot?.text || props.name;

    const icon = icons?.[camelCase(objectPath)];

    if (typeof icon != "object") {
      throw new ReferenceError("invalid icon path! " + objectPath);
    }

    const getName = $getName(objectPath);

    const setPath = (d) =>
      path(
        {
          attrs: {
            fill: "currentColor",
            d,
          },
        }
        // [title(props?.title || `${getName} icon`)]
      );

    return root(
      {
        ...$data,
        key: `${objectPath}`,
        attrs: {
          role: props.clickable ? "button" : "img",
          "aria-label": `${getName}${props.clickable ? "" : " icon"}`,
          title: props.clickable ? getName : $attrs?.title || undefined,
          ...$attrs,
        },
        staticClass: `ui-icon${staticClass}`,
        class: [
          {
            "__sm-icon": /^sm$|small/i.test(getSize()),
            "__md-icon": /^md$|medium/i.test(getSize()),
            "__lg-icon": /^lg$|large/i.test(getSize()),
          },
          $class,
        ],
        props: props.clickable
          ? {
              simpleButton: true,
              icon: true,
              flat: true,
              asWrapper: true,
              tag: props.tag,
              ...props.props,
            }
          : /nuxt-link/i.test(props.tag)
          ? { to: props.to }
          : undefined,
        on: $listeners,
      },
      [
        svg(
          {
            attrs: {
              xmlns: "http://www.w3.org/2000/svg",
              version: "1.1",
              viewBox: props.viewBox,
              width: !props.clickable ? `${getSize().width}px` : undefined,
              height: !props.clickable ? `${getSize().height}px` : undefined,
              focusable: "false",
              // ...$attrs,
            },
          },
          [
            !$slots?.default?.[0]
              ? icon.map((x) => {
                  if (x.d) {
                    return setPath(x.d);
                  }

                  if (x.g) {
                    return g(x.g.map((d) => setPath(d)));
                  }
                  return null;
                })
              : null,
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.ui-icon {
  --svg-sm-size: 15px;
  --svg-md-size: 19px;
  --svg-lg-size: 25px;
  --sm-size: calc(var(--svg-sm-size) + 10px);
  --md-size: calc(var(--svg-md-size) + 10px);
  --lg-size: calc(var(--svg-lg-size) + 10px);
}

.ui-icon {
  isolation: isolate;
  display: inline-grid;
  pointer-events: none;
  place-items: center;
  flex-shrink: 0;
  opacity: 0.8;
}

a.ui-icon,
.ui-btn.ui-icon {
  pointer-events: initial;
}

.ui-icon.ui-btn {
  opacity: 0.9;
}

.ui-icon > svg {
  color: inherit;
}

.ui-icon.ui-btn.__sm-icon > svg {
  width: var(--svg-sm-size);
  height: var(--svg-sm-size);
}

.ui-icon.ui-btn.__md-icon > svg {
  width: var(--svg-md-size);
  height: var(--svg-md-size);
}

.ui-icon.ui-btn.__lg-icon > svg {
  width: var(--svg-lg-size);
  height: var(--svg-lg-size);
}

.ui-icon.__sm-icon {
  height: var(--sm-size);
  max-height: var(--sm-size);
  min-height: var(--sm-size);
  width: var(--sm-size);
  max-width: var(--sm-size);
  min-width: var(--sm-size);
}

.ui-icon.__md-icon {
  height: var(--md-size);
  max-height: var(--md-size);
  min-height: var(--md-size);
  width: var(--md-size);
  max-width: var(--md-size);
  min-width: var(--md-size);
}

.ui-icon.__lg-icon {
  height: var(--lg-size);
  max-height: var(--lg-size);
  min-height: var(--lg-size);
  width: var(--lg-size);
  max-width: var(--lg-size);
  min-width: var(--lg-size);
}

#ui-root .ui-icon.__disabled {
  --t-disabled: 0.4;
  background-color: transparent !important;
  opacity: var(--t-disabled) !important;
}
</style>
