<template>
  <view 
    class="app-footer" 
    :class="[
      {
        'footer-fixed': fixed
      }
    ]"
    :style="footerStyle"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  fixed: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#fff'
  },
  height: {
    type: [String, Number],
    default: '100rpx'
  }
})

const footerStyle = computed(() => {
  return {
    backgroundColor: props.backgroundColor,
    height: typeof props.height === 'number' ? `${props.height}rpx` : props.height
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-footer {
  width: 100%;
  background: $white;
  border-top: 1rpx solid $gray-2;
  
  &.footer-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
