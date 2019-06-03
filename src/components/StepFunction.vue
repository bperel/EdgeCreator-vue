<template>
  <div>
    <slot name="canvas-override"/>
    <v-alert outline color="blue" type="info" value="1" style="background: white">
      <slot name="instructions" />
    </v-alert>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StepFunction',
  props: {
    options: Object
  },
  data () {
    return {
      tweakedStepOptions: { ...this.options }
    }
  },
  computed: mapGetters([
    'addZoom',
    'removeZoom'
  ])
}
</script>

<style>
  ul {
    color: black;
  }
</style>
