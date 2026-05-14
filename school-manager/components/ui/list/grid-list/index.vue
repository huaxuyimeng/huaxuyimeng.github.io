<template>
  <view class="grid-list" :class="[`grid-${columns}`]">
    <view 
      v-for="(item, index) in data" 
      :key="getItemKey(item, index)"
      class="grid-item"
      @click="handleItemClick(item, index)"
    >
      <slot :item="item" :index="index">
        <text class="item-text">{{ item }}</text>
      </slot>
    </view>
    <view v-if="loading" class="grid-loading">
      <text>加载中...</text>
    </view>
    <view v-if="finished && data.length === 0" class="grid-empty">
      <text>{{ emptyText }}</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 2,
    validator: (value) => [2, 3, 4].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  },
  gap: {
    type: [String, Number],
    default: 16
  }
})

const emit = defineEmits(['load', 'item-click'])

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

.grid-list {
  display: grid;
  gap: $spacing-2;
  width: 100%;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-item {
  background: $white;
  border-radius: $border-radius-base;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-sm;
  }
}

.grid-loading,
.grid-empty {
  grid-column: 1 / -1;
  padding: $spacing-4;
  text-align: center;
  color: $gray-5;
  font-size: $font-size-sm;
}
</style>
