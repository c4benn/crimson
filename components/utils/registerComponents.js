import { camelCase } from "~/components/utils/main";
import svgChecked from "~/components/svg-checked";

export default function registerComponents(Vue) {
  Vue.component("SvgChecked", svgChecked);
  const requireComponent = require.context(
    "~/components",
    true,
    /uiIcon|uiInput|uiForm|uiDialog|uiNavBar|uiBtn|appFooter|uiTransition\.(vue)$/i
  );

  requireComponent.keys().forEach((fileName) => {
    const componentConfig = requireComponent(fileName);

    const componentName = (val) => {
      val = fileName
        .replace(/^\.\/(\w+\/)?(\w+\W\w+\/)?/, "")
        .replace(/^(\w+\/)?/, "")
        .replace(/\.w+$/, "");

      return camelCase(val);
    };

    const name = componentName();

    if (/\.vue$/i.test(name)) {
      return;
    }

    Vue.component(name, componentConfig.default || componentConfig);
  });
}
