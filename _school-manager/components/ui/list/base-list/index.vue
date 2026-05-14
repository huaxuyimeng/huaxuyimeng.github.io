<template>
  <view class="base-list">
    <view 
      v-for="(item, index) in data" 
      :key="getItemKey(item, index)"
      class="list-item"
      @click="handleItemClick(item, index)"
    >
      <slot :item="item" :index="index">
        <text class="item-text">{{ item }}</text>
      </slot>
    </view>
    <view v-if="loading" class="list-loading">
      <text>加载中...</text>
    </view>
    <view v-if="finished && data.length === 0" class="list-empty">
      <text>{{ emptyText }}</text>
    </view>
    <view v-if="error" class="list-error">
      <text>加载失败，请重试</text>
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
  loading: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  },
  error: {
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
  }
})

const emit = defineEmits(['load', 'refresh', 'item-click'])

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

.base-list {
  width: 100%;
}

.list-item {
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

.list-loading,
.list-empty,
.list-error {
  padding: $spacing-4;
  text-align: center;
  color: $gray-5;
  font-size: $font-size-sm;
}
</style>
