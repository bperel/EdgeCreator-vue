<template>
  <div class="preview-config">
    <img v-if="loadPreview" :src="previewUrl" @load="$emit('stepLoaded', step.Ordre)"/></div>
</template>

<script>
export default {
  name: 'StepPreview.vue',
  props: {
    zoom: Number,
    shouldLoad: Boolean,
    step: Object,
    dimensions: Object
  },
  data () {
    return {
      loadPreview: false,
      stepOptions: {}
    }
  },
  watch: {
    shouldLoad: {
      immediate: true,
      handler: function (newVal) {
        console.log(newVal)
        if (newVal) {
          this.loadPreview = true
        }
      }
    }
  },
  computed: {
    previewUrl: function () {
      return `/viewer_wizard/etape/${this.zoom}/${this.step.Ordre}/${JSON.stringify(this.stepOptions)}/false/false/false/${Math.random()}`
    }
  }
}
</script>

<style scoped>
  .preview-config {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
