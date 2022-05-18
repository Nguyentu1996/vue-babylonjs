<template>
  <div>
    <h3>Babylon Js StandardMaterial</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { StandardMaterialExample } from "@/BabylonExamples/StandardMaterial";
export default {
  name: "BabylonExample",
  props: {
    msg: String,
  },
  mounted() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      new StandardMaterialExample(canvas);
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
