<template>
  <view class="loading-container" v-if="visible">
    <view class="loading-content">
      <view class="loading-spinner" :class="[`spinner-${type}`]">
        <view class="spinner-item" v-for="i in (type === 'spinner' ? 12 : 1)" :key="i"></view>
      </view>
      <text class="loading-text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'spinner', // spinner | circular
    validator: (value) => ['spinner', 'circular'].includes(value)
  },
  size: {
    type: [String, Number],
    default: 40
  },
  color: {
    type: String,
    default: '#007AFF'
  },
  text: {
    type: String,
    default: ''
  },
  textSize: {
    type: [String, Number],
    default: 28
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  position: relative;
}

// Spinner 类型
.spinner-spinner {
  width: 40rpx;
  height: 40rpx;
  
  .spinner-item {
    position: absolute;
    width: 6rpx;
    height: 6rpx;
    background: $primary-color;
    border-radius: 50%;
    animation: spinner-rotate 1.2s linear infinite;
    
    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        top: 50%;
        left: 50%;
        margin-top: -3rpx;
        margin-left: -3rpx;
        transform: rotate(#{($i - 1) * 30deg}) translateY(-17rpx);
        animation-delay: #{($i - 1) * 0.1}s;
      }
    }
  }
}

// Circular 类型
.spinner-circular {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: circular-rotate 1s linear infinite;
}

.loading-text {
  margin-top: $spacing-2;
  font-size: $font-size-sm;
  color: $gray-5;
  text-align: center;
}

@keyframes spinner-rotate {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}

@keyframes circular-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
