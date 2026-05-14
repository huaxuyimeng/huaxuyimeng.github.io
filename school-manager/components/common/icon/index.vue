<template>
  <!-- 优先使用 SVG 图标 -->
  <view 
    v-if="useSvg"
    class="icon-component icon-svg"
    :class="`icon-${size}`"
    :style="iconStyle"
    v-html="svgContent"
  ></view>
  <!-- 回退到 emoji/iconfont -->
  <text 
    v-else
    class="icon-component"
    :class="[iconClass, `icon-${size}`]"
    :style="iconStyle"
  >
    {{ iconText }}
  </text>
</template>

<script setup>
import { computed } from 'vue'
import { getIcon } from '@/utils/icons'
import { getSvgIcon, hasSvgIcon } from '@/static/icons/svg-icons'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['xs', 'sm', 'base', 'lg', 'xl', '2xl'].includes(value)
  },
  color: {
    type: String,
    default: ''
  },
  useSvg: {
    type: Boolean,
    default: true
  }
})

const useSvg = computed(() => {
  return props.useSvg && hasSvgIcon(props.name)
})

const iconText = computed(() => {
  return getIcon(props.name)
})

const iconClass = computed(() => {
  // 如果是iconfont类名，返回类名；否则返回空
  if (props.name.startsWith('icon-')) {
    return props.name
  }
  return ''
})

const iconStyle = computed(() => {
  const style = {}
  if (props.color) {
    style.color = props.color
  }
  return style
})

const svgContent = computed(() => {
  if (!useSvg.value) return ''
  const sizeMap = {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 32,
    xl: 40,
    '2xl': 48
  }
  const iconSize = sizeMap[props.size] || 24
  const iconColor = props.color || 'currentColor'
  return getSvgIcon(props.name, iconColor, iconSize)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.icon-component {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  
  &.icon-svg {
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  
  &.icon-xs {
    width: 16rpx;
    height: 16rpx;
    font-size: $font-size-xs;
  }
  
  &.icon-sm {
    width: 20rpx;
    height: 20rpx;
    font-size: $font-size-sm;
  }
  
  &.icon-base {
    width: 24rpx;
    height: 24rpx;
    font-size: $font-size-base;
  }
  
  &.icon-lg {
    width: 32rpx;
    height: 32rpx;
    font-size: $font-size-lg;
  }
  
  &.icon-xl {
    width: 40rpx;
    height: 40rpx;
    font-size: $font-size-xl;
  }
  
  &.icon-2xl {
    width: 48rpx;
    height: 48rpx;
    font-size: $font-size-2xl;
  }
}
</style>


