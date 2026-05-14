<template>
  <view class="error-boundary">
    <slot v-if="!hasError" />
    <view v-else class="error-content">
      <text class="error-icon">⚠️</text>
      <text class="error-title">出错了</text>
      <text class="error-message">{{ errorMessage }}</text>
      <view class="error-button" @click="handleRetry">
        <text class="button-text">重试</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  fallback: {
    type: String,
    default: '页面加载失败，请稍后重试'
  }
})

const emit = defineEmits(['error'])

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || props.fallback
  emit('error', err, instance, info)
  return false
})

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.error-boundary {
  width: 100%;
  min-height: 400rpx;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-8 $spacing-4;
}

.error-icon {
  font-size: 120rpx;
  margin-bottom: $spacing-4;
  opacity: 0.5;
}

.error-title {
  font-size: $font-size-xl;
  color: $gray-8;
  margin-bottom: $spacing-2;
  font-weight: 500;
}

.error-message {
  font-size: $font-size-base;
  color: $gray-5;
  margin-bottom: $spacing-4;
  text-align: center;
}

.error-button {
  padding: $spacing-2 $spacing-4;
  background: $primary-color;
  color: $white;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  
  .button-text {
    color: $white;
  }
}
</style>
