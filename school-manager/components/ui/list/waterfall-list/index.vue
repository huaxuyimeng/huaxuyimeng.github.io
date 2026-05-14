<template>
  <view class="waterfall-list">
    <view class="waterfall-column" v-for="(column, colIndex) in waterfallColumns" :key="colIndex">
      <view 
        v-for="(item, index) in column" 
        :key="getItemKey(item, colIndex * column.length + index)"
        class="waterfall-item"
        @click="handleItemClick(item, colIndex * column.length + index)"
      >
        <slot :item="item" :index="colIndex * column.length + index">
          <text class="item-text">{{ item }}</text>
        </slot>
      </view>
    </view>
    <view v-if="loading" class="waterfall-loading">
      <text>加载中...</text>
    </view>
    <view v-if="finished && data.length === 0" class="waterfall-empty">
      <text>{{ emptyText }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 2
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

const columns = computed(() => {
  const cols = Array(props.columns).fill(null).map(() => [])
  const heights = Array(props.columns).fill(0)
  
  props.data.forEach((item, index) => {
    // 找到高度最小的列
    const minHeightIndex = heights.indexOf(Math.min(...heights))
    cols[minHeightIndex].push(item)
    // 这里可以根据实际内容高度更新，简化处理
    heights[minHeightIndex] += 1
  })
  
  return cols
})

const columns = computed(() => {
  return props.columns
})

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

.waterfall-list {
  display: flex;
  gap: $spacing-2;
  width: 100%;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.waterfall-item {
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

.waterfall-loading,
.waterfall-empty {
  width: 100%;
  padding: $spacing-4;
  text-align: center;
  color: $gray-5;
  font-size: $font-size-sm;
}
</style>
