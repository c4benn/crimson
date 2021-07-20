export default function setProps(group) {
  return {
    appear: this.appear,

    appearActiveClass: this.appearActiveClass,

    appearClass: this.appearClass,

    appearToClass: this.appearToClass,

    css: this.css,

    duration: undefined,

    enterActiveClass: undefined,

    enterClass: undefined,

    enterToClass: undefined,

    leaveActiveClass: undefined,

    leaveClass: undefined,

    leaveToClass: undefined,

    moveClass: group === "group" ? this.moveClass : undefined,

    mode: group !== "group" ? this.mode : undefined,

    name: undefined,

    tag: group === "group" ? this.tag : undefined,

    type: "",
  };
}
