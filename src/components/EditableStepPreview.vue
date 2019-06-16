<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true, 'step-preview': true, editing}"
      @click.stop="!editing && editStep()">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <img :src="`/images/fonctions/${stepFunctionName}.png`" />
      <span v-if="editing" class="title">{{ stepFunctionName }}</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex justify-start align-top>
        <img v-if="loadPreview" v-show="!editing" :src="previewUrl" @load="$emit('step-preview-loaded')"/>
        <div v-show="editing" ref="canvas" class="empty-canvas" :style="canvasDimensions"></div>
        <v-layout v-if="editing" d-flex column align-content-space-between class="step-options-wrapper">
          <v-sheet>
            <component :is="stepFunctions[stepFunctionName]" :options="stepOptions" @options-changed="updatePreview" />
          </v-sheet>
          <v-layout justify-end style="flex-grow: 0 !important;">
            <v-btn v-for="action in availableActions" @click.stop="action.click" :key="action.id" left>
              {{ action.title }}
            </v-btn>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-sheet>
    <ConfirmCancelEditWizard
        v-if="cancelEditRequested"
        @close-dialog="cancelEditRequested = false"
        @cancel-edit="cancelEditRequested = false; updatePreview(); $emit('stop-editing')"/>
  </v-sheet>
</template>

<script>
import * as stepFunctions from './step-functions'

import stepOptionsMixin from '../stepOptionsMixin'
import ConfirmCancelEditWizard from './wizards/ConfirmCancelEditWizard'
import StepPreview from './StepPreview'
import { mapGetters } from 'vuex'
const axios = require('axios')

export default {
  name: 'EditableStepPreview.vue',
  extends: StepPreview,
  mixins: [stepOptionsMixin],
  props: {
    editing: Boolean,
    shouldLoad: Boolean,
    stepFunctionName: String
  },
  data () {
    return {
      stepFunctions: {
        Rectangle: 'RectangleFunction',
        Image: 'ImageFunction',
        Remplir: 'FillFunction'
      },
      cancelEditRequested: false,
      tweakedOptions: null,
      availableActions: [{
        id: 'close', title: 'Fermer', click: this.requestCancelEditing
      }, {
        id: 'validate', title: 'Valider', click: this.requestCancelEditing
      }]
    }
  },
  computed: {
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
      axios.post(`/parametrageg_wizard/index/${this.stepNumber}`)
        .then(function ({ data }) {
          vm.stepOptions = vm.convertToSimpleOptions(data)
          vm.$emit('start-editing')
        })
    },
    requestCancelEditing: function () {
      if (!this.tweakedOptions || this.tweakedOptions === {} || this.stepOptions === this.tweakedOptions) {
        this.$emit('stop-editing')
      } else {
        this.cancelEditRequested = true
      }
    },
    updatePreview: function (newOptions = {}) {
      this.tweakedOptions = Object.assign({}, newOptions)
      this.$emit('tweak-options', this.tweakedOptions)
    }
  },
  mounted () {
    this.loadPreview = this.shouldLoad
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
  }

  .step-options-wrapper > div {
    padding: 8px;
  }
</style>
