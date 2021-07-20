const Warn = () => {
  throw new Error(
    `ui-portal requires a valid querySelector, or a valid DOM node.`
  );
};

export default function Mount(Vue) {
  requestAnimationFrame(() => {
    if (!this.teleport) {
      return;
    }
    this.cleanup();

    if (!this.limbo) {
      this.errorCaught = true;
      return Warn;
    }

    const callback = () => {
      this.errorCaught = false;
      const mountEl = document.createElement("div");

      this.limbo.insertAdjacentElement(this.insertPosition.trim(), mountEl);

      const $root = this;
      const $Wrapper = Vue.extend({
        router: $root.$router,
        store: $root.$store,
        parent: $root.$parent,

        props: {
          content: {
            type: Array,
            default: () => [],
          },
          teleport: {
            type: Boolean,
            default: undefined,
          },
          wrapper: {
            type: [Object, Boolean],
            default: undefined,
          },
        },
        data: () => ({ newContent: null }),
        computed: {
          dynamicContent() {
            if (typeof this.newContent == "undefined") {
              return null;
            }
            return this.newContent || this.content;
          },
          computedWrapper() {
            if (!this.wrapper) {
              return false;
            }
            const $reactive = this.wrapper.reactiveData;
            const $context =
              this.content && this.content[0] && this.content[0].context;
            const $portalData = $context && $context[$reactive || "portalData"];

            if ($portalData && !this.wrapper.notReactive) {
              return $portalData;
            }
            return this.wrapper;
          },
        },
        render(h) {
          const $create = this.computedWrapper;
          return this.teleport
            ? $create
              ? h($create.tag, { ...$create.data }, [this.dynamicContent])
              : this.dynamicContent
            : this.dynamicContent;
        },
      });
      const content = this.$slots.default;
      const wrapper = this.computedWrapper;
      const teleport = this.teleport;

      this.target = new $Wrapper({
        el: mountEl,
        propsData: { content, wrapper, teleport },
      });

      this.$emit("content-mounted", this.target.$el, this.target.$vnode);
    };
    if (this.lazyTeleport) {
      return requestAnimationFrame(callback);
    }
    return callback();
  });
}
