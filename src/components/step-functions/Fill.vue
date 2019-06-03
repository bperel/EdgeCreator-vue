<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :x="addZoom(tweakedStepOptions.Pos_x)"
          :y="addZoom(tweakedStepOptions.Pos_y)"
          :width="CROSS_SIZE"
          :height="CROSS_SIZE"
          :boundOffsetX="- CROSS_SIZE / 2"
          :boundOffsetY="- CROSS_SIZE / 2"
          @update-position="updatePreview">
        <img class="fill-point" src="images/cross.png"/>
      </Draggable>
    </template>
    <template #instructions>
      <ul>
        <li>Déplacez le curseur en forme de croix pour modifier le point de remplissage.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage.</li>
      </ul>
    </template>

    <ColorPicker :color="tweakedStepOptions.Couleur" @update-color="updatePreview"/>
  </StepFunction>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'
import StepFunction from '../StepFunction'

export default {
  name: 'Fill.vue',
  extends: StepFunction,
  data () {
    return {
      CROSS_SIZE: 10
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Pos_x = this.removeZoom(newValues.x)
      }
      if (newValues.y) {
        this.tweakedStepOptions.Pos_y = this.removeZoom(newValues.y)
      }
      if (newValues.color) {
        this.tweakedStepOptions.Couleur = newValues.color
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
  .fill-point {
    position: absolute;
    background: linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%);
  }
</style>
