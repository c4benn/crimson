import {
  defaultSpringConfig,
  defaultTransition,
} from "~/components/utils/main";

export default {
  appearActiveClass: String,

  appearClass: String,

  appearToClass: String,

  enterActiveClass: String,

  enterClass: String,

  enterToClass: String,

  leaveActiveClass: String,

  leaveClass: String,

  leaveToClass: String,

  moveClass: String,

  appear: Boolean,

  css: {
    type: Boolean,
    default: false,
  },

  duration: {
    type: [String, Number, Object],
    default: () => ({ enter: 300, leave: 250 }),
  },

  mode: {
    type: String,
    default: "out-in",
  },

  tag: {
    type: String,
    default: "div",
  },

  transition: {
    type: [String, Object, Boolean],
    default: () => "slide-x-reverse",
  },

  name: {
    type: [String, Object, Boolean],
    default: () => "slide-x-reverse",
  },

  fade: {
    type: [Boolean, Number, String, Object],
    default: true,
  },

  origin: {
    type: [String, Object, Boolean],
    default: () => false,
  },

  delay: {
    type: [String, Number, Object],
    default: () => 0,
  },

  ease: {
    type: [String, Object],
    default: () => ({ ...defaultTransition }),
  },

  custom: {
    type: [Boolean, Object],
    default: () => false,
  },

  group: {
    type: Boolean,
    default: false,
  },

  springConfig: {
    type: Object,
    default: () => defaultSpringConfig,
  },

  type: {
    type: [String, Object],
    default: () => ({
      enter: "ease",
      leave: "ease",
    }),
  },

  previousTransform: {
    type: String,
    default: "",
  },
};
