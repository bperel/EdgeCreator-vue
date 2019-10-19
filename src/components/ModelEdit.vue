<template>
  <div v-if="dimensions && steps.length" class="d-flex justify-center" id="current-steps-and-preview">
    <v-layout id="editor" class="d-flex justify-center">
      <div id="layers" :style="canvasDimensions">
        <img v-for="step in steps" :key="step.Ordre"
             class="layer"
             v-show="isLoaded && !isEditingStep(step.Ordre)"
             :src="previewUrl(step.Ordre)"
             @load="isLoaded = true; loadNextStep()"/>
      </div>
      <v-card class="step-options-wrapper d-flex column justify-space-between" :style="{height: `${displayedHeight()}px`}">
        <v-sheet>
          <v-tabs vertical right @change="editStep">
            <v-tab v-for="step in steps" :key="step.Ordre" class="d-flex center">
              <img class="function-icon" :src="`/images/fonctions/${step.Nom_fonction}.png`"
                   :title="step.Nom_fonction"/>
            </v-tab>
            <v-tab-item v-for="step in steps" :key="step.Ordre" style="width: 500px">
              <component v-if="editingStepInitialOptions" :is="stepFunctions[step.Nom_fonction]" />
            </v-tab-item>
          </v-tabs>
        </v-sheet>
      </v-card>
    </v-layout>
    <v-layout id="model-preview">
      <StepPreview/>
    </v-layout>
  </div>
</template>

<script>
import * as stepFunctions from './step-functions'
import StepPreview from './StepPreview'
import { mapGetters, mapMutations, mapState } from 'vuex'
import stepOptionsMixin from '../stepOptionsMixin'

const axios = require('axios')

export default {
  name: 'ModelEdit',
  mixins: [stepOptionsMixin],
  data () {
    return {
      isLoaded: false,
      stepFunctions: {
        Rectangle: 'RectangleFunction',
        Image: 'ImageFunction',
        Remplir: 'FillFunction',
        TexteMyFonts: 'TextFunction'
      }
    }
  },
  computed: {
    ...mapState([
      'model',
      'dimensions',
      'steps',
      'loadingStep',
      'editingStep',
      'editingStepInitialOptions'
    ]),
    ...mapGetters([
      'getStepPreviewUrl',
      'displayedWidth',
      'displayedHeight'
    ]),
    canvasDimensions () {
      return {
        width: `${this.displayedWidth()}px`,
        height: `${this.displayedHeight()}px`
      }
    }
  },
  watch: {
    model: {
      immediate: true,
      handler () {
        let vm = this
        axios.post('/parametrageg_wizard/index')
          .then(({ data }) => {
            vm.setSteps(data.filter(step => step.Ordre !== -1) || [])
            vm.setLoadingStep(vm.steps[0].Ordre)
          })

        axios.post('/parametrageg_wizard/index/-1')
          .then(({ data }) => {
            const dimensions = vm.convertToSimpleOptions(data)
            vm.setDimensions({
              width: parseInt(dimensions.Dimension_x),
              height: parseInt(dimensions.Dimension_y)
            })
          })
      }
    }
  },
  methods: {
    ...mapMutations([
      'setDimensions',
      'setSteps',
      'setLoadingStep',
      'loadNextStep',
      'startEditing',
      'setEditingStepOptions'
    ]),

    previewUrl: function (stepNumber) {
      return this.getStepPreviewUrl(stepNumber, '_')
    },

    isLoadingStep: function (stepNumber) {
      return this.loadingStep === stepNumber
    },

    isEditingStep: function (stepNumber) {
      return this.editingStep === stepNumber
    },

    editStep: function (stepIndex) {
      this.setEditingStepOptions(null)
      this.stepNumber = this.steps[stepIndex].Ordre
      let vm = this
      axios.post(`/parametrageg_wizard/index/${this.stepNumber}`)
        .then(({ data }) => {
          vm.setEditingStepOptions(vm.convertToSimpleOptions(data))
          vm.startEditing(vm.stepNumber)
        })
    }
  },
  components: {
    StepPreview,
    ...stepFunctions
  }
}
</script>

<style>
  .function-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: white;
    padding: 8px;
  }

  #current-steps-and-preview {
    padding-top: 80px;
    width: 100%;
    box-sizing: border-box;
  }

  .v-tab--active {
    background: #1976d2;
  }

  #editor #layers img {
    position: absolute;
  }

  .preview {
    margin-left: 15px;
    margin-right: 15px;
  }

  .preview .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
  }

  .step-preview {
    position: static;
    vertical-align: top;
    display: inline-block;
    white-space: normal;
  }

  .step-options-wrapper {
    margin: 0 16px 0 8px;
    /*overflow-y: auto;*/
  }

  .step-options-wrapper > div {
    padding: 8px;
  }

  .step-options-wrapper .v-tabs {
    height: 100%;
  }

  .layer {
    opacity: 0.2;
  }

  #model-preview {
    flex-grow: 0;
  }

  .v-tabs-items > div {
    height: 100%;
  }

  .v-tabs-bar__content {
    overflow-y: auto;
    width: 90px;
  }
</style>
