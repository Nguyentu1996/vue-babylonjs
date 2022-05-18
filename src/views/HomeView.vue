<template>
  <BabylonExample />
</template>

<script lang="ts">
import Vue from "vue";
import BabylonExample from "@/components/BabylonExample.vue"; // @ is an alias to /src
export default Vue.extend({
  name: "HomeView",
  components: {
    BabylonExample,
  },
});
</script>
