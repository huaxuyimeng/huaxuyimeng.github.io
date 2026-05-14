<template>
  <view 
    class="fab-button" 
    :class="[
      `fab-button-${position}`,
      {
        'fab-button-active': active
      }
    ]"
    :style="fabStyle"
    @click="handleClick"
  >
    <text class="fab-icon">{{ active ? closeIcon : icon }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: '+'
  },
  closeIcon: {
    type: String,
    default: '✕'
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
  },
  color: {
    type: String,
    default: '#007AFF'
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const fabStyle = computed(() => {
  return {
    backgroundColor: props.color
  }
})

const handleClick = (e) => {
  emit('click', e)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.fab-button {
  position: fixed;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: $primary-color;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-lg;
  z-index: 1000;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.95);
    box-shadow: $shadow-base;
  }
  
  .fab-icon {
    font-size: $font-size-2xl;
    font-weight: 300;
    color: $white;
  }
}

.fab-button-top-left {
  top: 120rpx;
  left: $spacing-4;
}

.fab-button-top-right {
  top: 120rpx;
  right: $spacing-4;
}

.fab-button-bottom-left {
  bottom: 120rpx;
  left: $spacing-4;
}

.fab-button-bottom-right {
  bottom: 120rpx;
  right: $spacing-4;
}

.fab-button-active {
  transform: rotate(45deg);
}
</style>
