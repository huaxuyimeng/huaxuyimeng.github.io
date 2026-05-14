<template>
  <view class="setting-item" @click="handleClick">
    <view class="item-left">
      <text v-if="icon" class="item-icon">{{ icon }}</text>
      <text class="item-label">{{ label }}</text>
    </view>
    <view class="item-right">
      <text v-if="value" class="item-value">{{ value }}</text>
      <view v-if="badge" class="item-badge">
        <text>{{ badge }}</text>
      </view>
      <text v-if="showArrow" class="item-arrow">›</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  badge: {
    type: [String, Number],
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

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-3;
  background: $white;
  border-bottom: 1rpx solid $gray-2;
  cursor: pointer;
  transition: background $transition-duration $transition-timing;
  
  &:active {
    background: $gray-1;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
  
  .item-icon {
    font-size: $font-size-lg;
    margin-right: $spacing-2;
  }
  
  .item-label {
    font-size: $font-size-base;
    color: $gray-8;
  }
}

.item-right {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  
  .item-value {
    font-size: $font-size-sm;
    color: $gray-5;
    margin-right: $spacing-1;
  }
  
  .item-badge {
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 $spacing-1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $danger-color;
    color: $white;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
  }
  
  .item-arrow {
    font-size: $font-size-xl;
    color: $gray-4;
    transform: rotate(90deg);
  }
}
</style>
