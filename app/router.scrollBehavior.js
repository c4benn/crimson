import { sleep } from "~/components/utils/main";

export default async function (to, from, saved) {
  const $store = this.app.$store;

  if (to.hash) {
    return {
      selector: to.hash,
    };
  }

  if (to.path == from.path) {
    return {};
  }

  const hasSaved = typeof saved == "object" && saved != null;

  // $store.commit("UPDATE_", {
  //   name: "routed_with_back_or_forward_button",
  //   value: hasSaved,
  // });

  const top = hasSaved ? saved?.y || 0 : 0;
  const left = hasSaved ? saved?.x || 0 : 0;

  // $store.commit("UPDATE_", {
  //   name: "routeToSavedPage",
  //   value: hasSaved && saved !== null,
  // });

  const value = { x: left, y: top };

  $store.commit("UPDATE_", {
    name: "scrollPosition",
    value,
  });

  await sleep.call(
    this.app,
    parseFloat($store.state.pageTransitionDuration) * 1.5
  );

  return {};
}
