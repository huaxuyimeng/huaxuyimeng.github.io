<template>
  <view class="skeleton" :class="[`skeleton-${type}`]">
    <view 
      v-for="(item, index) in rows" 
      :key="index"
      class="skeleton-row"
      :style="getRowStyle(item)"
    >
      <view 
        v-for="(col, colIndex) in item.cols" 
        :key="colIndex"
        class="skeleton-col"
        :style="getColStyle(col)"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'avatar', 'image', 'button'].includes(value)
  },
  rows: {
    type: Number,
    default: 3
  },
  loading: {
    type: Boolean,
    default: true
  }
})

const defaultRows = computed(() => {
  if (props.type === 'avatar') {
    return [
      { cols: [{ width: '80rpx', height: '80rpx', circle: true }] },
      { cols: [{ width: '60%', height: '32rpx' }, { width: '30%', height: '32rpx' }] }
    ]
  }
  if (props.type === 'image') {
    return [
      { cols: [{ width: '100%', height: '400rpx' }] },
      { cols: [{ width: '100%', height: '32rpx' }, { width: '60%', height: '32rpx' }] }
    ]
  }
  if (props.type === 'button') {
    return [
      { cols: [{ width: '200rpx', height: '80rpx' }] }
    ]
  }
  // text type
  const rows = []
  for (let i = 0; i < props.rows; i++) {
    rows.push({
      cols: [
        { width: '100%', height: '32rpx' },
        ...(i === props.rows - 1 ? [] : [{ width: '80%', height: '32rpx' }])
      ]
    })
  }
  return rows
})

const getRowStyle = (item) => {
  return {
    display: 'flex',
    gap: '16rpx',
    marginBottom: '16rpx'
  }
}

const getColStyle = (col) => {
  return {
    width: col.width,
    height: col.height,
    borderRadius: col.circle ? '50%' : '8rpx',
    backgroundColor: '#f0f0f0',
    backgroundImage: props.loading 
      ? 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
      : 'none',
    backgroundSize: '200% 100%',
    animation: props.loading ? 'skeleton-loading 1.5s ease-in-out infinite' : 'none'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.skeleton {
  width: 100%;
}

.skeleton-row {
  display: flex;
  gap: $spacing-2;
  margin-bottom: $spacing-2;
}

.skeleton-col {
  background: $gray-2;
  border-radius: $border-radius-sm;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
