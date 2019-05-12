<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true, 'step-preview': true, editing}"
      @click="!editing && editStep">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <img :src="`/images/fonctions/${step.Nom_fonction}.png`" />
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex justify-start align-top>
        <img v-if="loadPreview" ref="stepPreview" :src="previewUrl" @load="$emit('stepPreviewLoaded')"/>
        <v-flex class="step-options-wrapper" v-if="editing">
          <v-sheet>
            <div v-switch="step.Nom_fonction">
              <Fill v-case="'Remplir'" :zoom="zoom" :options="stepOptions" :stepPreviewImg="$refs.stepPreview" @options-changed="updatePreview" />
            </div>
          </v-sheet>
        </v-flex>
      </v-flex>
    </v-sheet>
  </v-sheet>
</template>

<script>
import Fill from './step-functions/Fill'
import { convertToSimpleOptions } from '../util'
const axios = require('axios')

export default {
  name: 'StepPreview.vue',
  components: { Fill },
  props: {
    zoom: Number,
    shouldLoad: Boolean,
    step: Object,
    editing: Boolean,
    dimensions: Object
  },
  data () {
    return {
      loadPreview: false,
      stepOptions: {},
      previewUrl: '',
      MIN_STEP_WIDTH: 36
    }
  },
  watch: {
    shouldLoad: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.loadPreview = true
        }
      }
    }
  },
  methods: {
    editStep: function () {
      let vm = this
      axios.post(`/parametrageg_wizard/index/${this.step.Ordre}`)
        .then(function ({ data }) {
          vm.stepOptions = convertToSimpleOptions(data)
          vm.$emit('editing')
        })
    },
    updatePreview: function (newOptions) {
      this.stepOptions = Object.assign({}, this.stepOptions, newOptions)
      this.setPreviewUrl()
    },
    setPreviewUrl: function () {
      this.previewUrl = `/viewer_wizard/etape/${this.zoom}/${this.step.Ordre}/${JSON.stringify(this.stepOptions)}/false/false/false/${Math.random()}`
    }
  },
  mounted () {
    this.setPreviewUrl()
  }
}
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .header img {
    height: 18px;
  }

  img {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    margin: 0 8px;
  }

  .step-options-wrapper {
    margin: 16px 16px 16px 8px ;
  }

  .step-options-wrapper > div {
    padding: 8px;
  }
</style>
