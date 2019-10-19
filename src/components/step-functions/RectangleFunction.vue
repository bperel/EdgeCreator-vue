<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :resizable="true"
          :rotatable="false"
          :x="addZoom(editingStepTweakedOptions.Pos_x_debut)"
          :y="addZoom(editingStepTweakedOptions.Pos_y_debut)"
          :width="shownWidth"
          :height="shownHeight"
          @update-position="updatePreview">
        <div :style="{...rectangleStyle, width: '100%', height: '100%'}"/>
      </Draggable>
    </template>
    <template #instructions>
      <ul>
        <li>Déplacez et redimensionnez le rectangle.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage ou de contour.</li>
      </ul>
    </template>

    <ColorPicker :color="editingStepTweakedOptions.Couleur" @update-color="updatePreview"/>
    <v-checkbox v-model="editingStepTweakedOptions.Rempli" @change="updatePreview" label="Rectangle rempli" />
  </StepFunction>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'
import StepFunction from '../StepFunction'

export default {
  name: 'RectangleFunction',
  extends: StepFunction,
  computed: {
    rectangleStyle: function () {
      return {
        backgroundColor: this.editingStepTweakedOptions.Rempli ? this.editingStepTweakedOptions.Couleur : 'transparent',
        outline: this.editingStepTweakedOptions.Rempli ? 'none' : `1px solid ${this.editingStepTweakedOptions.Couleur}`
      }
    },
    shownWidth: function () {
      return this.addZoom(this.editingStepTweakedOptions.Pos_x_fin - this.editingStepTweakedOptions.Pos_x_debut)
    },
    shownHeight: function () {
      return this.addZoom(this.editingStepTweakedOptions.Pos_y_fin - this.editingStepTweakedOptions.Pos_y_debut)
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x !== undefined) {
        this.editingStepTweakedOptions.Pos_x_debut = this.removeZoom(newValues.x)
      }
      if (newValues.w !== undefined) {
        this.editingStepTweakedOptions.Pos_x_fin = this.removeZoom(newValues.x + newValues.w)
      }
      if (newValues.y !== undefined) {
        this.editingStepTweakedOptions.Pos_y_debut = this.removeZoom(newValues.y)
      }
      if (newValues.h !== undefined) {
        this.editingStepTweakedOptions.Pos_y_fin = this.removeZoom(newValues.y + newValues.h)
      }
      if (newValues.color !== undefined) {
        this.editingStepTweakedOptions.Couleur = newValues.color
      }
      if (newValues.filled !== undefined) {
        this.editingStepTweakedOptions.Rempli = newValues.filled
      }

      this.$emit('options-changed', this.editingStepTweakedOptions)
    }
  },
  components: {
    StepFunction,
    ColorPicker,
    Draggable
  }
}
</script>

<style>
  label {
    display: flex;
    align-items: center;
  }
</style>
