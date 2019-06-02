<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true}">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <span class="subheading">Preview</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex shrink justify-center align-top>
        <img v-if="loadPreview" :src="previewUrl" @load="$emit('step-preview-loaded')"/>
      </v-flex>
    </v-sheet>
  </v-sheet>
</template>

<script>
import stepOptionsMixin from '../stepOptionsMixin'

export default {
  name: 'StepPreview.vue',
  mixins: [stepOptionsMixin],
  props: {
    shouldLoad: Boolean,
    stepNumber: {
      default: 'final'
    },
    tweakedStep: Number,
    tweakedStepOptions: Object
  },
  data () {
    return {
      loadPreview: false,
      stepOptions: {},
      previewUrl: ''
    }
  },
  computed: {
    zoom () {
      return this.$store.state.zoom
    }
  },
  watch: {
    shouldLoad: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.loadPreview = true
        }
      }
    },
    zoom: {
      immediate: true,
      handler () {
        this.setPreviewUrl()
      }
    },
    tweakedStepOptions: function () {
      this.setPreviewUrl()
    }
  },
  methods: {
    setPreviewUrl: function () {
      let options = this.convertFromSimpleOptions(this.tweakedStepOptions || {})
      this.previewUrl = `/viewer_wizard/etape/${this.zoom}/${this.stepNumber}/${this.tweakedStep ? this.tweakedStep + '.' : ''}${this.objectToUrlParams(options)}/false/false/false/${Math.random()}`
    }
  }
}
</script>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .header img {
    height: 18px;
  }
  .header .subheading {
    font-weight: bold;
    color: white;
    padding: 8px;
  }

  .d-flex > img {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    margin: 0 8px;
  }
</style>
