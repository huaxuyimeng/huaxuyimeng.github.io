<template>
  <view 
    class="toast" 
    v-if="visible"
    :class="[
      `toast-${type}`,
      `toast-${position}`
    ]"
  >
    <text v-if="icon" class="toast-icon">{{ icon }}</text>
    <text class="toast-message">{{ message }}</text>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 2000
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['top', 'center', 'bottom'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  }
})

const visible = ref(false)

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
}

const displayIcon = ref(props.icon || icons[props.type] || '')

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  background: rgba(0, 0, 0, 0.7);
  color: $white;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 80%;
  animation: toast-fade-in 0.3s $transition-timing;
  
  &.toast-top {
    top: 200rpx;
  }
  
  &.toast-center {
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &.toast-bottom {
    bottom: 200rpx;
  }
  
  &.toast-success {
    background: rgba($success-color, 0.9);
  }
  
  &.toast-error {
    background: rgba($danger-color, 0.9);
  }
  
  &.toast-warning {
    background: rgba($warning-color, 0.9);
  }
  
  &.toast-info {
    background: rgba($info-color, 0.9);
  }
}

.toast-icon {
  margin-right: $spacing-1;
  font-size: inherit;
}

.toast-message {
  font-size: inherit;
  color: inherit;
}

@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -20rpx);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
