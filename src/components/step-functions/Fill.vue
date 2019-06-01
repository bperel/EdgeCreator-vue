<template>
  <div>
    <Draggable
        :x="parseFloat(tweakedStepOptions.Pos_x) * this.zoom"
        :y="parseFloat(tweakedStepOptions.Pos_y) * this.zoom"
        :width="CROSS_SIZE"
        :height="CROSS_SIZE"
        :boundX="previewBounds.left - CROSS_SIZE / 2"
        :boundY="previewBounds.top - CROSS_SIZE / 2"
        :boundWidth="previewBounds.width"
        :boundHeight="previewBounds.height"
        @update-position="updatePreview">
      <img class="fill-point" src="images/cross.png"/>
    </Draggable>
    <v-alert outline color="blue" type="info" value="1" style="background: white">
      <ul>
        <li>Déplacez le curseur en forme de croix pour modifier le point de remplissage.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage.</li>
      </ul>
    </v-alert>
    <ColorPicker :color="tweakedStepOptions.Couleur" @update-color="updatePreview"/>
  </div>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'

export default {
  name: 'Fill.vue',
  props: {
    zoom: Number,
    options: Object,
    canvasRef: {
      default: null
    }
  },
  computed: {
    previewBounds: function () {
      return this.canvasRef.getBoundingClientRect()
    }
  },
  data () {
    return {
      CROSS_SIZE: 10,
      tweakedStepOptions: { ...this.options }
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Pos_x = parseInt(newValues.x / this.zoom)
      }
      if (newValues.y) {
        this.tweakedStepOptions.Pos_y = parseInt(newValues.y / this.zoom)
      }
      if (newValues.color) {
        this.tweakedStepOptions.Couleur = newValues.color
      }

      this.$emit('options-changed', this.tweakedStepOptions)
    }
  },
  components: {
    ColorPicker,
    Draggable
  }
}
</script>

<style>
  ul {
    color: black;
  }

  .fill-point {
    position: absolute;
    background: linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%);
  }
</style>
