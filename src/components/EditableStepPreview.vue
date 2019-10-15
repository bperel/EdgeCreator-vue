<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true, 'step-preview': true, editing: isEditingStep()}"
      @click.stop="!isEditingStep() && editStep()">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <img :src="`/images/fonctions/${stepFunctionName}.png`" />
      <span v-if="isEditingStep()" class="title">{{ stepFunctionName }}</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-layout class="contents d-flex justify-start align-top">
        <img v-if="isLoaded || isLoadingStep()" v-show="isLoaded && !isEditingStep()" :src="previewUrl" @load="isLoaded = true; loadNextStep()"/>
        <div v-show="isEditingStep()" ref="canvas" class="empty-canvas" :style="canvasDimensions"></div>
        <v-card v-if="isEditingStep()" class="step-options-wrapper d-flex column justify-space-between">
          <v-sheet>
            <component :is="stepFunctions[stepFunctionName]" :options="stepOptions" @options-changed="updatePreview" />
          </v-sheet>
          <v-footer absolute class="d-flex justify-space-between">
            <v-btn v-for="action in availableActions" @click.stop="action.click" :key="action.id">
              {{ action.title }}
            </v-btn>
          </v-footer>
        </v-card>
      </v-layout>
    </v-sheet>
    <ConfirmCancelEditWizard
        v-if="cancelEditRequested"
        @close-dialog="cancelEditRequested = false"
        @save="saveStep()"
        @cancel-edit="cancelEditRequested = false; stopEditing()"/>
  </v-sheet>
</template>

<script>
import * as stepFunctions from './step-functions'

import stepOptionsMixin from '../stepOptionsMixin'
import ConfirmCancelEditWizard from './wizards/ConfirmCancelEditWizard'
import StepPreview from './StepPreview'
import { mapGetters, mapMutations, mapState } from 'vuex'
const axios = require('axios')

export default {
  name: 'EditableStepPreview.vue',
  extends: StepPreview,
  mixins: [stepOptionsMixin],
  props: {
    stepNumber: Number,
    stepFunctionName: String
  },
  data () {
    return {
      isLoaded: false,
      stepFunctions: {
        Rectangle: 'RectangleFunction',
        Image: 'ImageFunction',
        Remplir: 'FillFunction',
        TexteMyFonts: 'TextFunction'
      },
      cancelEditRequested: false,
      availableActions: [
        { id: 'close', title: 'Fermer', click: this.requestCancelEditing },
        { id: 'validate', title: 'Valider', click: this.saveStep }
      ]
    }
  },
  computed: {
    ...mapState([
      'loadingStep',
      'editingStep',
      'editingStepTweakedOptions'
    ]),
    ...mapGetters([
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
  methods: {
    ...mapMutations([
      'startEditing',
      'setEditingStepTweakedOptions',
      'updateLastPreviewGenerationTime',
      'stopEditing',
      'loadNextStep'
    ]),

    isLoadingStep: function () { return this.loadingStep === this.stepNumber },
    isEditingStep: function () { return this.editingStep === this.stepNumber },
    editStep: function () {
      let vm = this
      axios.post(`/parametrageg_wizard/index/${this.stepNumber}`)
        .then(({ data }) => {
          vm.stepOptions = vm.convertToSimpleOptions(data)
          vm.startEditing(vm.stepNumber)
        })
    },
    requestCancelEditing: function () {
      if (!this.editingStepTweakedOptions || !Object.keys(this.editingStepTweakedOptions).length || this.stepOptions === this.editingStepTweakedOptions) {
        this.stopEditing()
      } else {
        this.cancelEditRequested = true
      }
    },
    updatePreview: function (newOptions = {}) {
      this.setEditingStepTweakedOptions(Object.assign({}, newOptions))
    },
    saveStep: function () {
      let vm = this
      let options = this.convertFromSimpleOptions(this.editingStepTweakedOptions || {})
      axios.post(`/update_wizard/index/${this.stepNumber}/${this.objectToUrlParams(options)}`).then(({ data }) => {
        vm.updateLastPreviewGenerationTime(vm.stepNumber)
        vm.updateLastPreviewGenerationTime('final')
        vm.stopEditing()
      })
    }
  },
  components: {
    ConfirmCancelEditWizard,
    ...stepFunctions
  }
}
</script>

<style scoped>
  .empty-canvas {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    border: 1px solid black;
    background-color: white;
    margin: 0 8px;
  }

  .step-options-wrapper {
    margin: 16px 16px 16px 8px ;
    padding-bottom: 48px;
  }

  .step-options-wrapper > div {
    padding: 8px;
  }
</style>
