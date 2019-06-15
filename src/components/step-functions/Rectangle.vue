<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable :scalable="true"
          :x="addZoom(tweakedStepOptions.Pos_x_debut)"
          :y="addZoom(tweakedStepOptions.Pos_y_debut)"
          :width="rectangleWidth"
          :height="rectangleHeight"
          @update-position="updatePreview">
        <div :style="{...rectangleStyle, width: `${rectangleWidth}px`, height: `${rectangleHeight}px`}"/>
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
  name: 'Rectangle.vue',
  extends: StepFunction,
  computed: {
    rectangleStyle: function () {
      return {
        backgroundColor: this.tweakedStepOptions.Rempli ? this.tweakedStepOptions.Couleur : 'transparent',
        outline: this.tweakedStepOptions.Rempli ? 'none' : `1px solid ${this.tweakedStepOptions.Couleur}`
      }
    },
    rectangleWidth: function () {
      return this.addZoom(this.tweakedStepOptions.Pos_x_fin - this.tweakedStepOptions.Pos_x_debut)
    },
    rectangleHeight: function () {
      return this.addZoom(this.tweakedStepOptions.Pos_y_fin - this.tweakedStepOptions.Pos_y_debut)
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Pos_x_debut = this.removeZoom(newValues.x)
      }
      if (newValues.width) {
        this.tweakedStepOptions.Pos_x_fin = this.removeZoom(newValues.x + newValues.width)
      }
      if (newValues.y) {
        this.tweakedStepOptions.Pos_y_debut = this.removeZoom(newValues.y)
      }
      if (newValues.height) {
        this.tweakedStepOptions.Pos_y_fin = this.removeZoom(newValues.y + newValues.height)
      }
      if (newValues.color) {
        this.tweakedStepOptions.Couleur = newValues.color
      }
      if (newValues.filled) {
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
