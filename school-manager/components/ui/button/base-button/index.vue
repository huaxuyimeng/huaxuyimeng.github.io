<template>
  <view 
    class="base-button" 
    :class="[
      `button-${type}`,
      `button-${size}`,
      {
        'button-plain': plain,
        'button-round': round,
        'button-circle': circle,
        'button-disabled': disabled,
        'button-loading': loading,
        'button-block': block
      }
    ]"
    :style="buttonStyle"
    @click="handleClick"
  >
    <view v-if="loading" class="button-loading-icon">
      <text class="loading-icon">⏳</text>
    </view>
    <text v-if="icon && !loading" class="button-icon">{{ icon }}</text>
    <text class="button-text" v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  plain: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const buttonStyle = computed(() => {
  if (props.color) {
    return {
      backgroundColor: props.plain ? 'transparent' : props.color,
      borderColor: props.color,
      color: props.plain ? props.color : '#fff'
    }
  }
  return {}
})

const handleClick = (e) => {
  if (props.disabled || props.loading) {
    return
  }
  emit('click', e)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  border: 1rpx solid transparent;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  position: relative;
  
  &:active:not(.button-disabled):not(.button-loading) {
    opacity: 0.8;
    transform: scale(0.98);
  }
  
  &.button-block {
    width: 100%;
  }
  
  &.button-round {
    border-radius: $border-radius-full;
  }
  
  &.button-circle {
    border-radius: 50%;
    width: 80rpx;
    height: 80rpx;
    padding: 0;
  }
  
  &.button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.button-loading {
    cursor: not-allowed;
  }
}

// 尺寸
.button-small {
  padding: $spacing-1 $spacing-2;
  font-size: $font-size-sm;
  
  &.button-circle {
    width: 60rpx;
    height: 60rpx;
  }
}

.button-medium {
  padding: $spacing-2 $spacing-4;
  font-size: $font-size-base;
}

.button-large {
  padding: $spacing-3 $spacing-5;
  font-size: $font-size-lg;
  
  &.button-circle {
    width: 100rpx;
    height: 100rpx;
  }
}

// 类型
.button-primary {
  background: $primary-color;
  color: $white;
  border-color: $primary-color;
  
  &.button-plain {
    background: transparent;
    color: $primary-color;
  }
}

.button-success {
  background: $success-color;
  color: $white;
  border-color: $success-color;
  
  &.button-plain {
    background: transparent;
    color: $success-color;
  }
}

.button-warning {
  background: $warning-color;
  color: $white;
  border-color: $warning-color;
  
  &.button-plain {
    background: transparent;
    color: $warning-color;
  }
}

.button-danger {
  background: $danger-color;
  color: $white;
  border-color: $danger-color;
  
  &.button-plain {
    background: transparent;
    color: $danger-color;
  }
}

.button-info {
  background: $info-color;
  color: $white;
  border-color: $info-color;
  
  &.button-plain {
    background: transparent;
    color: $info-color;
  }
}

.button-default {
  background: $white;
  color: $gray-8;
  border-color: $gray-3;
  
  &.button-plain {
    background: transparent;
  }
}

.button-icon {
  margin-right: $spacing-1;
  font-size: inherit;
}

.button-text {
  font-size: inherit;
}

.button-loading-icon {
  margin-right: $spacing-1;
  
  .loading-icon {
    font-size: inherit;
    animation: rotate 1s linear infinite;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
