<template>
  <div class="workspace" :style="offset">
    <drr
        :rotatable="rotatable"
        :scalable="scalable"
        :selected="true"
        :w="shape.width"
        :h="shape.height"
        :x="shape.x"
        :y="shape.y"
        :angle="shape.angle"
        :styles="{width: shape.width, height: shape.height}"
        @change="$emit('update-position', $event)"
    >
      <slot />
    </drr>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Draggable',
  props: {
    x: Number,
    y: Number,
    boundOffsetX: { default: 0 },
    boundOffsetY: { default: 0 },
    width: Number,
    height: Number,
    angle: { default: 0 },
    rotatable: { default: false },
    scalable: { default: false }
  },
  data () {
    return {
      shape: {},
      offsetX: 0,
      offsetY: 0
    }
  },
  computed: {
    ...mapGetters([
      'displayedWidth',
      'displayedHeight'
    ]),
    offset () {
      return {
        // FIXME externalize
        top: `${-15 + this.height / 2}px`,
        left: `${-15 + this.width / 2 - this.displayedWidth()}px`
      }
    }
  },
  watch: {
    x: {
      immediate: true,
      handler (newVal) { this.shape.x = newVal }
    },
    y: {
      immediate: true,
      handler (newVal) { this.shape.y = newVal }
    },
    width: {
      immediate: true,
      handler (newVal) { this.shape.width = newVal }
    },
    height: {
      immediate: true,
      handler (newVal) { this.shape.height = newVal }
    },
    angle: {
      immediate: true,
      handler (newVal) { this.shape.angle = newVal }
    }
  }
}
</script>

<style>
  .workspace {
    position: absolute;
  }
</style>
