<template>
  <div>
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
import { mapGetters } from 'vuex'

export default {
  name: 'Fill.vue',
  props: {
    options: Object
  },
  data () {
    return {
      CROSS_SIZE: 10,
      tweakedStepOptions: { ...this.options }
    }
  },
  computed: mapGetters([
    'addZoom',
    'removeZoom'
  ]),
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
