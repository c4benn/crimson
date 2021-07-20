export default function mdnIcons(Vue) {
  const requireComponent = require.context(
    "vue-material-design-icons",
    true,
    /\/(close|home|magnify|shopping|account|dotsHorizontal|bookmark|bookmarkOutline|fileImage|imageMultiple|playlistMusic|faceAgent|informationVariant|themeLightDark|chevronDoubleUp|exportVariant|chevronDown|plus|minus|chevronLeft|check|checkCircle|email|whatsapp|twitter|message|linkVariant|delete|chevronRight|chevronUp|checkboxMarkedCircleOutline|eye|eyeOff|shieldAlert|wifiStrength1Alert|accountAlert|alert|tag)\.(vue|js)$/i
  );

  requireComponent.keys().forEach((fileName) => {
    const componentConfig = requireComponent(fileName);
    const componentName = `mdi${fileName.replace(/^\.\/(.*)\.\w+$/, "$1")}`;

    Vue.component(componentName, componentConfig.default || componentConfig);
  });
}
