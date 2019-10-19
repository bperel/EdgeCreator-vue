<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :x="addZoom(editingStepTweakedOptions.Pos_x)"
          :y="addZoom(editingStepTweakedOptions.Pos_y)"
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

    <ColorPicker :color="editingStepTweakedOptions.Couleur" @update-color="updatePreview"/>
  </StepFunction>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'
import StepFunction from '../StepFunction'

export default {
  name: 'FillFunction',
  extends: StepFunction,
  data () {
    return {
      CROSS_SIZE: 10
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x !== undefined) {
        this.editingStepTweakedOptions.Pos_x = this.removeZoom(newValues.x)
      }
      if (newValues.y !== undefined) {
        this.editingStepTweakedOptions.Pos_y = this.removeZoom(newValues.y)
      }
      if (newValues.color !== undefined) {
        this.editingStepTweakedOptions.Couleur = newValues.color
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
  .fill-point {
    position: absolute;
    background: linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%);
  }
</style>
