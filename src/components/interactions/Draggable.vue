<template>
  <div class="workspace" :style="draggableBounds" ref="workspace">
    <FreeTransform
        :class="{rotatable, scalable}"
        :width="shape.width"
        :height="shape.height"
        :x="shape.x"
        :y="shape.y"
        :offset-x="offsetX"
        :offset-y="offsetY"
        :scale-x="shape.scaleX"
        :scale-y="shape.scaleY"
        :angle="shape.angle"
        :styles="{width: shape.width, height: shape.height}"
        :scale-from-center="false"
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
    boundOffsetX: { default: 0 },
    boundOffsetY: { default: 0 },
    scaleX: { default: 1 },
    scaleY: { default: 1 },
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
    scaleX: {
      immediate: true,
      handler (newVal) { this.shape.scaleX = newVal }
    },
    scaleY: {
      immediate: true,
      handler (newVal) { this.shape.scaleY = newVal }
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

<style>
  .workspace {
    position: absolute;
  }

  .tr-transform--active {
    cursor: move;
  }

  .tr-transform__content{
    user-select: none;
  }

  .tr-transform__rotator,
  .tr-transform__scale-point {
    background: #fff;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .tr-transform__rotator:hover,
  .tr-transform__scale-point:hover {
    background: #F1F5F8;
  }

  .tr-transform__rotator:active,
  .tr-transform__scale-point:active {
    background: #DAE1E7;
  }

  .tr-transform__scale-point--tl {
    top: -7px;
    left: -7px;
  }

  .tr-transform__scale-point--ml {
    top: calc(50% - 7px);
    left: -7px;
  }

  .tr-transform__scale-point--tr {
    left: calc(100% - 7px);
    top: -7px;
  }

  .tr-transform__scale-point--tm {
    left: calc(50% - 7px);
    top: -7px;
  }

  .tr-transform__scale-point--mr {
    left: calc(100% - 7px);
    top: calc(50% - 7px);
  }

  .tr-transform__scale-point--bl {
    left: -7px;
    top: calc(100% - 7px);
  }

  .tr-transform__scale-point--bm {
    left: calc(50% - 7px);
    top: calc(100% - 7px);
  }

  .tr-transform__scale-point--br {
    left: calc(100% - 7px);
    top: calc(100% - 7px);
  }

  .tr-transform__rotator {
    display: none;
  }

  .rotatable .tr-transform__scale-point {
    display: block;
    top: -45px;
    left: calc(50% - 7px);
  }

  .tr-transform__scale-point {
    display: none;
  }

  .scalable .tr-transform__scale-point {
    display: block;
  }

  .tr-transform__content div {
    width: 100% !important;
    height: 100% !important;
  }
</style>
