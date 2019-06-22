<template>
  <div class="workspace" :style="offset" ref="workspace">
    <drr
        :class="{rotatable, scalable}"
        :w="shape.width"
        :h="shape.height"
        :x="shape.x"
        :y="shape.y"
        :offset-x="offsetX"
        :offset-y="offsetY"
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
        top: `-15px`,
        left: `${-15 - this.displayedWidth()}px`
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
  },
  mounted () {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  }
}
</script>

<style>
  .workspace {
    position: absolute;
  }
</style>
