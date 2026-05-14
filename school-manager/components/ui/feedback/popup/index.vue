<template>
  <view>
    <view 
      class="popup-overlay" 
      v-if="visible"
      :class="{ 'overlay-active': visible }"
      @click="handleOverlayClick"
    ></view>
    <view 
      class="popup" 
      :class="[
        `popup-${position}`,
        {
          'popup-active': visible,
          'popup-round': round
        }
      ]"
    >
      <view v-if="showClose" class="popup-close" @click="handleClose">
        <text class="close-icon">✕</text>
      </view>
      <slot></slot>
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
    default: 'bottom',
    validator: (value) => ['top', 'bottom', 'left', 'right', 'center'].includes(value)
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: true
  },
  safeArea: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.popup-overlay {
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

.popup {
  position: fixed;
  background: $white;
  z-index: 2000;
  transition: transform $transition-duration $transition-timing;
  
  &.popup-round {
    border-radius: $border-radius-lg $border-radius-lg 0 0;
  }
  
  &.popup-top {
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(-100%);
    
    &.popup-active {
      transform: translateY(0);
    }
  }
  
  &.popup-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    
    &.popup-active {
      transform: translateY(0);
    }
  }
  
  &.popup-left {
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    
    &.popup-active {
      transform: translateX(0);
    }
  }
  
  &.popup-right {
    top: 0;
    right: 0;
    bottom: 0;
    transform: translateX(100%);
    
    &.popup-active {
      transform: translateX(0);
    }
  }
  
  &.popup-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    border-radius: $border-radius-lg;
    
    &.popup-active {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.popup-close {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  
  .close-icon {
    font-size: $font-size-xl;
    color: $gray-5;
    font-weight: 300;
  }
}
</style>
