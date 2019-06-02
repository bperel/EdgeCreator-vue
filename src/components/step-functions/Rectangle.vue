<template>
  <div>
    <Draggable
        :x="$store.getters.addZoom(tweakedStepOptions.Pos_x_debut)"
        :y="$store.getters.addZoom(tweakedStepOptions.Pos_y_debut)"
        :width="rectangleWidth"
        :height="rectangleHeight"
        @update-position="updatePreview">
      <div class="rectangle" :style="{...rectangleStyle, width: `${rectangleWidth}px`, height: `${rectangleHeight}px`}"/>
    </Draggable>
    <v-alert outline color="blue" type="info" value="1" style="background: white">
      <ul>
        <li>Déplacez et redimensionnez le rectangle.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage ou de contour.</li>
      </ul>
    </v-alert>
    <ColorPicker :color="tweakedStepOptions.Couleur" @update-color="updatePreview"/>
  </div>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'

export default {
  name: 'Rectangle.vue',
  props: {
    options: Object
  },
  computed: {
    zoom () {
      return this.$store.state.zoom
    },
    rectangleStyle: function () {
      return {
        backgroundColor: this.tweakedStepOptions.Rempli ? this.tweakedStepOptions.Couleur : 'transparent',
        outline: this.tweakedStepOptions.Rempli ? 'none' : `1px solid ${this.tweakedStepOptions.Couleur}`
      }
    },
    rectangleWidth: function () {
      return this.$store.getters.addZoom(this.tweakedStepOptions.Pos_x_fin - this.tweakedStepOptions.Pos_x_debut)
    },
    rectangleHeight: function () {
      return this.$store.getters.addZoom(this.tweakedStepOptions.Pos_y_fin - this.tweakedStepOptions.Pos_y_debut)
    }
  },
  data () {
    return {
      tweakedStepOptions: { ...this.options }
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Pos_x_debut = this.$store.getters.removeZoom(newValues.x)
      }
      if (newValues.width) {
        this.tweakedStepOptions.Pos_x_fin = this.$store.getters.removeZoom(newValues.x + newValues.width)
      }
      if (newValues.y) {
        this.tweakedStepOptions.Pos_y_debut = this.$store.getters.removeZoom(newValues.y)
      }
      if (newValues.height) {
        this.tweakedStepOptions.Pos_y_fin = this.$store.getters.removeZoom(newValues.y + newValues.height)
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
  }
</style>
