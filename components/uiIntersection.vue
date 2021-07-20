<script>
import { sleep } from "~/components/utils/main";
const defaultConfig = {
  threshold: "0",
  rootMargin: "0px 0px 0px 0px",
  root: null,
};

export default {
  name: "UiIntersection",
  props: {
    // tag: String,
    once: Boolean,
    config: {
      type: Object,
      default: () => defaultConfig,
    },
    useAnimationFrame: {
      type: Boolean,
      default: true,
    },
    disableIntersection: Boolean,
    singleAnimationFrame: Boolean,
    // keepAlive: Boolean,
  },
  data() {
    return {
      isIntersecting: false,
      target: null,
      entries: {},

      Observer: {
        class: null,
        callback: (entry) => {
          entry.forEach((entries) => {
            const setPayload = () => {
              this.entries = entries;
              this.isIntersecting = entries.isIntersecting;
              this.target = entries.target;
            };
            const callback = () => {
              if (this.once) {
                if (!this.Observer.class) {
                  return;
                }

                setPayload();

                if (this.isIntersecting) {
                  this.$emit("once-intersected", entries);
                  this.Observer.class?.unobserve(this.$el);
                  this.Observer.class?.disconnect?.();
                  this.Observer.class = null;
                }

                return;
              }

              setPayload();
            };
            if (!this.useAnimationFrame) {
              return callback();
            }
            if (this.singleAnimationFrame) {
              return requestAnimationFrame(callback);
            }
            requestAnimationFrame(() => requestAnimationFrame(callback));
          });
        },
      },
    };
  },
  computed: {
    payload() {
      return {
        isIntersecting: this.isIntersecting,
        target: this.target,
        entries: this.entries,
      };
    },
  },

  watch: {
    "$store.state.breakpoints.is"(n) {
      this.refresh();
    },
    disableIntersection(n) {
      this.refresh();
    },
  },

  beforeMount() {
    this.observe();
  },
  activated() {
    this.observe();
  },
  beforeDestroy() {
    this.disconnect();
  },
  deactivated() {
    this.disconnect();
  },
  methods: {
    connect() {
      if (this.Observer.class || this.disableIntersection) {
        return;
      }

      const initialOptions = {
        ...defaultConfig,
        ...this.config,
      };

      const options = {
        ...initialOptions,
        threshold: /string|number/i.test(typeof initialOptions.threshold)
          ? parseFloat(initialOptions.threshold)
          : initialOptions.threshold,
      };

      requestAnimationFrame(() => {
        if (!this.disableIntersection) {
          this.$nextTick(() => {
            this.Observer.class = new IntersectionObserver(
              this.Observer.callback,
              options
            );
            this.$nextTick(() => {
              this.Observer.class.observe(this.$el);
            });
          });
        }
      });
    },
    observe() {
      this.$nextTick(async () => {
        await sleep.call(this, 1, true);
        this.connect();
      });
    },
    disconnect() {
      this.Observer.class?.unobserve(this.$el);
      this.Observer.class?.disconnect();

      this.$nextTick(() => {
        this.Observer.class = null;
      });
    },
    refresh() {
      this.disconnect();
      this.$nextTick(this.connect);
    },
  },
  render() {
    const el = this.$scopedSlots?.default?.(this.payload);
    return el;
  },
};
</script>
