<template>
  <view class="function-grid" :class="[`grid-${columns}`]">
    <view 
      v-for="(item, index) in menuList" 
      :key="getItemKey(item, index)"
      class="grid-item"
      @click="handleItemClick(item, index)"
    >
      <view class="item-icon">
        <text class="icon-text">{{ item.icon || '📱' }}</text>
      </view>
      <text class="item-label">{{ item.label }}</text>
      <view v-if="item.badge" class="item-badge">
        <text>{{ item.badge }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  menuList: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 4,
    validator: (value) => [3, 4, 5].includes(value)
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits(['item-click'])

const getItemKey = (item, index) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

const handleItemClick = (item, index) => {
  emit('item-click', item, index)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.function-grid {
  display: grid;
  gap: $spacing-3;
  padding: $spacing-3;
  background: $white;
  border-radius: $border-radius-base;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.95);
  }
  
  .item-icon {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius-base;
    margin-bottom: $spacing-1;
    
    .icon-text {
      font-size: $font-size-2xl;
    }
  }
  
  .item-label {
    font-size: $font-size-sm;
    color: $gray-7;
    text-align: center;
  }
  
  .item-badge {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
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
}
</style>
