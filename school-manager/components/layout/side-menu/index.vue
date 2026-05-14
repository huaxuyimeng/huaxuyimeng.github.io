<template>
  <view>
    <view 
      class="side-menu-overlay" 
      v-if="visible"
      :class="{ 'overlay-active': visible }"
      @click="handleClose"
    ></view>
    <view 
      class="side-menu" 
      :class="[
        `side-menu-${position}`,
        { 'side-menu-active': visible }
      ]"
    >
      <view class="menu-header" v-if="showHeader">
        <slot name="header">
          <text class="menu-title">{{ title }}</text>
        </slot>
      </view>
      <view class="menu-body">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: '菜单'
  },
  width: {
    type: [String, Number],
    default: '600rpx'
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  if (props.closeOnClickOverlay) {
    emit('close')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.side-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  opacity: 0;
  visibility: hidden;
  transition: all $transition-duration $transition-timing;
  
  &.overlay-active {
    opacity: 1;
    visibility: visible;
  }
}

.side-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 600rpx;
  max-width: 80vw;
  background: $white;
  z-index: 2000;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  transition: transform $transition-duration $transition-timing;
  
  &.side-menu-left {
    left: 0;
    transform: translateX(-100%);
  }
  
  &.side-menu-right {
    right: 0;
    transform: translateX(100%);
  }
  
  &.side-menu-active {
    transform: translateX(0);
  }
}

.menu-header {
  padding: $spacing-4;
  border-bottom: 1rpx solid $gray-2;
  
  .menu-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.menu-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
