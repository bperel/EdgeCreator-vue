<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :resizable="true"
          :rotatable="false"
          :x="addZoom(tweakedStepOptions.Pos_x_debut)"
          :y="addZoom(tweakedStepOptions.Pos_y_debut)"
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

    <ColorPicker :color="tweakedStepOptions.Couleur" @update-color="updatePreview"/>
    <label>Rectangle rempli :&nbsp;<input type="checkbox" v-model="tweakedStepOptions.Rempli" @change="updatePreview"/></label>
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
        backgroundColor: this.tweakedStepOptions.Rempli ? this.tweakedStepOptions.Couleur : 'transparent',
        outline: this.tweakedStepOptions.Rempli ? 'none' : `1px solid ${this.tweakedStepOptions.Couleur}`
      }
    },
    shownWidth: function () {
      return this.addZoom(this.tweakedStepOptions.Pos_x_fin - this.tweakedStepOptions.Pos_x_debut)
    },
    shownHeight: function () {
      return this.addZoom(this.tweakedStepOptions.Pos_y_fin - this.tweakedStepOptions.Pos_y_debut)
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x !== undefined) {
        this.tweakedStepOptions.Pos_x_debut = this.removeZoom(newValues.x)
      }
      if (newValues.w !== undefined) {
        this.tweakedStepOptions.Pos_x_fin = this.removeZoom(newValues.x + newValues.w)
      }
      if (newValues.y !== undefined) {
        this.tweakedStepOptions.Pos_y_debut = this.removeZoom(newValues.y)
      }
      if (newValues.h !== undefined) {
        this.tweakedStepOptions.Pos_y_fin = this.removeZoom(newValues.y + newValues.h)
      }
      if (newValues.color !== undefined) {
        this.tweakedStepOptions.Couleur = newValues.color
      }
      if (newValues.filled !== undefined) {
        this.tweakedStepOptions.Rempli = newValues.filled
      }

      this.$emit('options-changed', this.tweakedStepOptions)
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
