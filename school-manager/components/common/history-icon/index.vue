<!--
 * 文件路径: components/common/history-icon/index.vue
 * 功能说明: 历史记录页面专用图标组件
 * 使用生成的 SVG 图标
 -->
<template>
  <view 
    class="history-icon" 
    :class="[`icon-${name}`, customClass]"
    :style="iconStyle"
    @click="handleClick"
  >
    <svg 
      :width="size" 
      :height="size" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        :d="iconPath" 
        :fill="displayColor" 
        fill-rule="evenodd" 
        clip-rule="evenodd"
      />
    </svg>
  </view>
</template>

<script>
// 注意：在 uni-app 中，静态 JS 文件需要使用相对路径导入
// 根据组件位置调整路径
import { getHistoryIconPath, getHistoryIconConfig } from '../../../static/icons/history/index.js'

export default {
  name: 'HistoryIcon',
  props: {
    // 图标名称
    name: {
      type: String,
      required: true
    },
    // 图标大小
    size: {
      type: [Number, String],
      default: 20
    },
    // 图标颜色
    color: {
      type: String,
      default: ''
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 获取图标路径
    iconPath() {
      return getHistoryIconPath(this.name) || ''
    },
    // 获取图标配置
    iconConfig() {
      return getHistoryIconConfig(this.name) || {}
    },
    // 显示颜色（优先使用传入的 color，否则使用配置中的默认颜色）
    displayColor() {
      return this.color || this.iconConfig.color || 'currentColor'
    },
    // 图标样式
    iconStyle() {
      const size = typeof this.size === 'number' ? `${this.size}px` : this.size
      return {
        width: size,
        height: size,
        color: this.displayColor,
        cursor: this.clickable ? 'pointer' : 'default'
      }
    }
  },
  methods: {
    handleClick(e) {
      if (this.clickable) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.history-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  // 可点击时的样式
  &[data-clickable="true"] {
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:active {
      opacity: 0.7;
    }
  }
  
  // 常用图标尺寸预设
  &.size-xs {
    width: 12px;
    height: 12px;
  }
  
  &.size-sm {
    width: 16px;
    height: 16px;
  }
  
  &.size-md {
    width: 20px;
    height: 20px;
  }
  
  &.size-lg {
    width: 24px;
    height: 24px;
  }
  
  &.size-xl {
    width: 30px;
    height: 30px;
  }
}
</style>
