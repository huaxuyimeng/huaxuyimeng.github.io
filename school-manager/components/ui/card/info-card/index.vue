<template>
  <view class="info-card" @click="handleClick">
    <view class="card-icon" v-if="icon">
      <text class="icon-text">{{ icon }}</text>
    </view>
    <view class="card-content">
      <text class="card-title">{{ title }}</text>
      <text v-if="subtitle" class="card-subtitle">{{ subtitle }}</text>
    </view>
    <view class="card-arrow" v-if="showArrow">
      <text class="arrow-icon">›</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.info-card {
  display: flex;
  align-items: center;
  padding: $spacing-3;
  background: $white;
  border-radius: $border-radius-base;
  margin-bottom: $spacing-2;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    background: $gray-1;
  }
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary-color, 0.1);
  border-radius: $border-radius-base;
  margin-right: $spacing-3;
  
  .icon-text {
    font-size: $font-size-xl;
  }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .card-title {
    font-size: $font-size-base;
    color: $gray-8;
    margin-bottom: $spacing-1;
  }
  
  .card-subtitle {
    font-size: $font-size-sm;
    color: $gray-5;
  }
}

.card-arrow {
  margin-left: $spacing-2;
  
  .arrow-icon {
    font-size: $font-size-xl;
    color: $gray-4;
  }
}
</style>
