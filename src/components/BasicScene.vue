<template>
  <div>
    <h3>Babylon Js Basic Scene</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { BasicScene } from "@/BabylonExamples/BasicScene";
export default {
  name: "BabylonExample",
  props: {
    msg: String,
  },
  mounted() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      new BasicScene(canvas);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 70%;
  height: 70%;
}
body {
  /* background-image: url("assets/istockphoto.jpeg"); */
  /* background-color: black; */
}
</style>
