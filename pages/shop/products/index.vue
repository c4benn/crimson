<template>
  <div style="min-height: 100vh; background: green">invalid page</div>
</template>

<script>
export default {
  created() {
    this.$nextTick(() =>
      this.$store.commit("V_MODEL", {
        path: "text",
        innerPath: "headerContent",
        value: "Products",
      })
    );
  },
};
</script>

<style scoped></style>
