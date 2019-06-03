<template>
  <div class="workspace" :style="draggableBounds" ref="workspace">
    <FreeTransform
        :width="shape.width"
        :height="shape.height"
        :x="shape.x"
        :y="shape.y"
        :offset-x="offsetX"
        :offset-y="offsetY"
        :scale-x="1"
        :scale-y="1"
        :angle="0"
        :disable-scale="true"
        :styles="{width: shape.width, height: shape.height}"
        @update="update(shape.id, $event)"
        @mouseup="$emit('update-position', shape)"
    >
      <div :style="getElementStyles(shape)">
        <slot />
      </div>
    </FreeTransform>
  </div>
</template>

<script>
import FreeTransform from 'vue-free-transform'
import { mapGetters } from 'vuex'
export default {
  name: 'Draggable',
  props: {
    x: Number,
    y: Number,
    boundOffsetX: {
      default: 0
    },
    boundOffsetY: {
      default: 0
    },
    width: Number,
    height: Number
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
    draggableBounds () {
      return {
        // FIXME externalize
        top: `${-8 * 2 + 1 + this.boundOffsetX}px`,
        left: `${-8 * 2 + 1 + this.boundOffsetY - this.displayedWidth()}px`
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
    }
  },
  methods: {
    update (id, payload) {
      if (
        payload.x + this.shape.width + this.boundOffsetX > 0 && payload.x < this.displayedWidth() &&
        payload.y + this.shape.height + this.boundOffsetY > 0 && payload.y < this.displayedHeight()) {
        this.shape = {
          ...this.shape,
          ...payload
        }
      }
    },
    getElementStyles (element) {
      return {
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...(element.styles || {})
      }
    }
  },
  mounted () {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  },
  components: {
    FreeTransform
  }
}
</script>

<style scoped>
  .workspace {
    position: absolute;
  }

  .tr-transform--active {
    cursor: move;
  }
</style>
