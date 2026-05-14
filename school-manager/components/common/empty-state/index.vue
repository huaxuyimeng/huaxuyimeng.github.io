<template>
  <view class="empty-state">
    <image 
      v-if="image" 
      :src="image" 
      class="empty-image"
      mode="aspectFit"
    />
    <view v-else class="empty-icon">
      <text class="iconfont icon-empty">📭</text>
    </view>
    <text class="empty-description">{{ description }}</text>
    <view v-if="showButton && buttonText" class="empty-button" @click="handleClick">
      <text class="button-text">{{ buttonText }}</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: '暂无数据'
  },
  buttonText: {
    type: String,
    default: ''
  },
  showButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-8 $spacing-4;
  min-height: 400rpx;
}

.empty-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: $spacing-4;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: $spacing-4;
  opacity: 0.5;
}

.empty-description {
  font-size: $font-size-base;
  color: $gray-5;
  margin-bottom: $spacing-4;
  text-align: center;
}

.empty-button {
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
