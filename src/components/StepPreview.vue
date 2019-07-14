<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true}">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <span class="subheading">Preview</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex shrink justify-center align-top>
        <div class="preview-wrapper">
          <img :src="previewUrl"/>
          <div class="preview-text">Preview</div>
        </div>
        <div v-if="model.photo" class="preview-wrapper">
          <img :height="$store.getters.displayedHeight()" :src="$store.getters.getPhotoUrl(model.photo)"/>
          <div class="preview-text">Photo&nbsp;<img src="images/photo.png" /></div>
        </div>
      </v-flex>
    </v-sheet>
  </v-sheet>
</template>

<script>
import stepOptionsMixin from '../stepOptionsMixin'
import { mapState } from 'vuex'

export default {
  name: 'StepPreview.vue',
  mixins: [stepOptionsMixin],
  props: {
    stepNumber: { default: 'final' }
  },
  data () {
    return {
      stepOptions: {},
      previewUrl: ''
    }
  },
  computed: mapState([
    'model',
    'zoom',
    'editingStep',
    'editingStepTweakedOptions'
  ]),
  watch: {
    zoom: {
      immediate: true,
      handler () {
        this.setPreviewUrl()
      }
    },
    editingStepTweakedOptions: function () {
      if (this.stepNumber === 'final') {
        this.setPreviewUrl()
      }
    }
  },
  methods: {
    setPreviewUrl: function () {
      let options = this.convertFromSimpleOptions(this.editingStepTweakedOptions || {})
      this.previewUrl = `/viewer_wizard/etape/${this.zoom}/${this.stepNumber}/${this.editingStep ? this.editingStep + '.' : ''}${this.objectToUrlParams(options)}/false/false/false/0`
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

  .preview-wrapper {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    margin: 0 8px;
    line-height: 14px;
    text-align: center;
  }

  .preview-wrapper .preview-text {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 50px;
    text-align: right;
    transform: rotate(-90deg);
    transform-origin: 30px 25px;
  }
</style>
