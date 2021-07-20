import setProps from "@/components/transition/setProps.js";
import Events from "@/components/transition/_events.js";

export default function Render(h) {
  let $slot =
    this.$scopedSlots?.default?.(this.transitionState) ||
    this.$slots.default ||
    undefined;

  if (typeof $slot === "undefined") {
    return null;
  }

  const singleTransition = (slot) => {
    this.transitionGroup = false;

    return h(
      "transition",
      {
        ref: "uiSingleTransition",
        key: `key:transition-${this._uid}`,
        attrs: { ...this.$attrs },
        props: setProps.call(this, false),
        on: { ...Events.call(this) },
      },
      [
        typeof slot !== "undefined"
          ? slot.map((item, key) => {
              if (typeof item.key === "undefined") {
                item.key = `ui-transition_${key}`;
              }

              return item;
            })
          : null,
      ]
    );
  };

  const transitionGroup = (slot) => {
    this.transitionGroup = true;

    return h(
      "transition-group",
      {
        ref: "uiTransitionGroup",
        key: `key:transition-${this._uid}-group`,
        attrs: { ...this.$attrs },
        props: { ...setProps.call(this, "group") },
        on: { ...Events.call(this) },
      },
      [
        typeof slot !== "undefined"
          ? slot.map((item, key) => {
              if (typeof item.tag === "undefined") {
                return null;
              }

              if (typeof item.key === "undefined") {
                item.key = `ui-transition__${key}`;
              }
              return item;
            })
          : null,
      ]
    );
  };

  if (this.group) {
    return transitionGroup();
  }

  if ($slot.length === 1) {
    return singleTransition($slot);
  }

  if ($slot.length > 1) {
    // the output will ALWAYS be 1 node
    const slotArray = [];

    // check if it's v-if or v-show
    $slot.forEach((x, i) => {
      if (typeof x.tag !== "undefined" && x.text !== "") {
        if (!x.key) {
          x.key = i;
        }
        slotArray.push(x);
      }
    });

    $slot = 0;

    if (slotArray.length === 1) {
      return singleTransition(slotArray);
    }
    return transitionGroup(slotArray);
  }
  return singleTransition($slot);
}
