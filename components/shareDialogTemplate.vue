<script>
/* eslint-disable promise/param-names */
import {
  capitalize,
  Copy,
  sleep,
  springPresets,
} from "~/components/utils/main";
export default {
  name: "ShareDialogTemplate",
  props: {
    item: {
      type: Object,
      default: () => ({
        title: "A very cool and unique product name",
        img: { src: "/img/campaign/6.png", alt: "alt" },
        price: "8000.00",
      }),
    },
    opacity: {
      type: String,
      default: undefined,
    },
    transitionState: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      newLine: "%0D%0A",
      showCopyStatus: false,
    };
  },
  computed: {
    url() {
      return `${location.origin}${this.$route.fullPath}`;
    },
    shareBody() {
      const nl = this.newLine;
      return `Purchase${nl}"${this.item.title}"${nl}from Paradice Parade${nl}for ${this.$currencies.naira}${this.item.price} using the link below!${nl}`;
    },
    shareVia() {
      const defaultBody = `${this.shareBody}${this.url}`;
      return {
        message: `sms:?&body=${defaultBody}`,
        twitter: `https://twitter.com/intent/tweet?url=${this.url}&text=${this.shareBody}`,
        whatsapp: `https://api.whatsapp.com/send?phone=whatsappphonenumber&text=${defaultBody}`,
        email: `mailto:?subject=Shop on Paradice Parade&body=${defaultBody}`,
      };
    },
  },
  render(h) {
    const scoping = { "data-sdte": "" };
    const div = (d, c) => h("div", d, c);
    const header = (d, c) => h("header", d, c);
    const article = (d, c) => h("article", d, c);
    const span = (d, c) => h("span", d, c);
    const btn = (d, c) => h("ui-btn", d, c);
    const icon = (d, c) => h("ui-icon", d, c);
    const h1 = (d, c) => h("h1", d, c);
    const h2 = (d, c) => h("h2", d, c);
    const h3 = (d, c) => h("h3", d, c);
    const img = (d) => h("app-img", d);
    const transition = (d) => h("ui-transition", d);
    const btnProps = {
      block: true,
      flat: true,
      // persistent: true,
      shape: "tile",
    };
    const close = () => this.$emit("close-dialog");

    const iconProps = (name) => ({
      slot: "prepend",
      props: { size: 18, name },
    });

    return div(
      {
        attrs: { ...scoping },
        staticClass: "root",
        style: {
          opacity: this.opacity,
        },
      },
      [
        header(
          {
            attrs: { ...scoping },
            staticClass: "header sheet-header fill-before-and-after",
          },
          [
            h1(
              {
                attrs: { ...scoping },
                staticClass: "heading sheet-heading",
              },
              "Share"
            ),
            // icon({
            //   props: {
            //     name: "close",
            //     clickable: true,
            //     size: "md",
            //     shape: "circle",
            //   },
            //   attrs: { ...scoping, title: "close" },
            //   staticClass: "close-btn",
            //   on: {
            //     click: close,
            //   },
            // }),
            btn(
              {
                props: {
                  size: "md",
                  text: true,
                  // color: "primary",
                  persistent: true,
                },
                attrs: { ...scoping },
                staticClass: "close-btn sheet-close-btn",
                on: {
                  click: close,
                },
              },
              "Close"
            ),
          ]
        ),
        article(
          {
            attrs: { ...scoping },
            staticClass: "main",
          },
          [
            div(
              {
                attrs: { ...scoping },
                staticClass: "hero fill-before",
              },
              [
                img({
                  props: {
                    src: this.item.img.src,
                    alt: this.item.img.alt,
                  },
                  staticClass: "image fill-before-and-after",
                }),
                div(
                  {
                    attrs: { ...scoping },
                    staticClass: "product-info",
                  },
                  [
                    h2(
                      {
                        attrs: { ...scoping },
                        staticClass: "title line-clamp-2",
                      },
                      this.item.title
                    ),

                    h3(
                      {
                        attrs: { ...scoping },
                        staticClass: "price line-clamp-2",
                      },
                      `${this.$currencies.naira}${this.item.price}`
                    ),
                  ]
                ),
              ]
            ),
            div(
              {
                attrs: { ...scoping },
                staticClass: "wrapper",
              },
              [
                span({
                  attrs: { ...scoping, "aria-hidden": "true" },
                  staticClass: "divide fill-before-and-after",
                }),
                [1, 2, 3, 4].map((item, index) => {
                  const iconName =
                    item == 1
                      ? "message"
                      : item == 2
                      ? "twitter"
                      : item == 3
                      ? "whatsapp"
                      : "email";

                  return btn(
                    {
                      key: index,
                      props: {
                        tag: "a",
                        ...btnProps,
                      },
                      attrs: {
                        ...scoping,
                        title: `share via ${iconName}`,
                        target: "_blank",
                        href: this.shareVia[iconName],
                        rel: "noreferrer",
                      },
                      on: {
                        "!click": () => {
                          this.$nextTick(close);
                        },
                        "active-click": (e) => {
                          e.target.click?.();
                        },
                      },
                      staticClass: `action`,
                    },
                    [
                      icon({
                        attrs: { ...scoping },
                        staticClass: `icon ${iconName} fill-before`,
                        ...iconProps(iconName),
                      }),
                      capitalize(iconName),
                    ]
                  );
                }),
                btn(
                  {
                    props: { ...btnProps },
                    attrs: { ...scoping, title: "copy link" },
                    staticClass: `action`,
                    on: {
                      click: async () => {
                        await Copy({
                          text: this.url,
                          onSuccess: () => {
                            this.copyStatus = "copied";
                          },
                          onError: () => {
                            this.copyStatus = "error";
                          },
                        });
                        this.$nextTick(() => (this.showCopyStatus = true));
                      },
                    },
                  },
                  [
                    icon({
                      attrs: { ...scoping },
                      staticClass: "icon copy-link fill-before",
                      ...iconProps("linkVariant"),
                    }),
                    "Copy link",
                    transition({
                      slot: "append",
                      props: {
                        transition: "slide-x(75%)",
                        duration: "400",
                        type: "spring",
                        springConfig: springPresets.wobbly,
                      },
                      on: {
                        afterEnter: async () => {
                          await sleep.call(this, 100);
                          this.$nextTick(close);
                          await sleep.call(this, 400);
                          this.showCopyStatus = false;
                        },
                      },
                      scopedSlots: {
                        default: () => {
                          return (
                            this.showCopyStatus &&
                            div(
                              {
                                attrs: { ...scoping },
                                staticClass: "copy-status",
                                class: [
                                  `${
                                    /copied/i.test(this.copyStatus)
                                      ? "success"
                                      : "error"
                                  }-text`,
                                ],
                              },
                              this.copyStatus
                            )
                          );
                        },
                      },
                    }),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
};
</script>

<style>
.root[data-sdte] {
  transition: 0.15s opacity;
}

.main[data-sdte] {
  padding-bottom: 64px;
  max-height: calc(100vh - var(--sheet-header-height));
  overflow: hidden auto;
  height: 100%;
  background: var(--theme-banner);
}

.wrapper[data-sdte] {
  position: relative;
  --item-size: 54px;
  --icon-size: 28px;
  --divide-margin: calc(2.75rem + var(--icon-size));
  padding-top: 0.5rem;
}

.hero[data-sdte] {
  height: calc(64px + 0.75rem);
  padding: 0 1rem;
  display: grid;
  align-items: center;
  column-gap: 0.75rem;
  grid-template-columns: 56px 1fr;
  background-color: var(--theme-surface);
  position: relative;
}

.hero[data-sdte]::before {
  border-bottom: var(--ui-divide);
}

.hero[data-sdte] .image {
  border-radius: 6px;
  height: 56px;
  background-color: var(--theme-primary);
}

.hero[data-sdte] .image::before {
  border: var(--ui-divide);
  display: block;
  opacity: var(--t-disabled);
}

.hero[data-sdte] img {
  padding: 0.35rem;
}

.title[data-sdte] {
  font-size: 0.95rem;
  opacity: var(--t-subtitle);
  font-weight: 400;
}

.price[data-sdte] {
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 4px;
  opacity: var(--t-title);
  letter-spacing: 0.4px;
}

.action[data-sdte] {
  height: var(--item-size);
  display: flex;
  justify-content: flex-start;
  padding: 0 1.75rem;
  font-size: 1.1rem !important;
  font-weight: 400 !important;
  background: var(--theme-banner);
}

.icon[data-sdte] {
  --size: var(--icon-size);
  color: #fff;
  height: var(--size);
  width: var(--size);
  border-radius: 6px;
  position: relative;
}

.dark-theme .icon[data-sdte]::before,
.copy-link[data-sdte]::before {
  background-color: currentColor;
  opacity: 0.1;
  z-index: -1;
}

.copy-link[data-sdte]::before {
  opacity: 0.125;
}

.message[data-sdte] {
  --color: #66bb6a;
  color: var(--color);
}

.twitter[data-sdte] {
  --color: #00acee;
  color: var(--color);
}

.whatsapp[data-sdte] {
  --color: #c0ca33;
  color: var(--color);
}

/* .whatsapp[data-sdte] > svg {
  margin-bottom: 1.5px;
} */

.email[data-sdte] {
  --color: #2196f3;
  color: var(--color);
}

.light-theme .message[data-sdte] {
  background: var(--color);
  color: var(--theme-primary);
}

.light-theme .twitter[data-sdte] {
  background: var(--color);
  color: var(--theme-primary);
}

.light-theme .whatsapp[data-sdte] {
  background: var(--color);
  color: var(--theme-primary);
}

.light-theme .email[data-sdte] {
  background: var(--color);
  color: var(--theme-primary);
}

.copy-link[data-sdte] {
  color: var(--theme-surface-text);
}

.copy-status[data-sdte] {
  position: absolute;
  right: 1.8rem;
  font-size: 0.9rem;
}

.action[data-sdte] .__default-slot {
  margin-left: 1rem;
}

.divide[data-sdte] {
  height: calc(100% - 0.5rem);
  width: calc(100% - var(--divide-margin));
  top: 0.5rem;
  left: var(--divide-margin);
  position: absolute;
  z-index: 1;
  border-bottom: var(--ui-divide);
  opacity: 0.75;
  pointer-events: none;
}

.divide[data-sdte]::before,
.divide[data-sdte]::after {
  height: var(--item-size);
  top: var(--item-size);
  border: var(--ui-divide);
  border-width: 0.5px 0;
  z-index: 1;
  opacity: 0.75;
}

.divide[data-sdte]::after {
  top: calc(var(--item-size) * 3);
}
</style>
