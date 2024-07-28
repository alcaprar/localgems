<template>
  <div
    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
  >
    <h1 class="h2">Dashboard</h1>
  </div>

  <h2>Click on the left menù</h2>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ 
      layout: "admin",
      middleware: "auth"
    });
  },
  created() {
    this.$log().info('test', this.$backend)
  },
};
</script>
