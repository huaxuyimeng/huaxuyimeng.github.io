<template>
  <view v-if="visible" class="filter-overlay" @click="handleClose">
    <view class="filter-panel" @click.stop>
      <view class="filter-header">
        <text>筛选条件</text>
        <view class="filter-close" @click="handleClose">×</view>
      </view>
      
      <scroll-view class="filter-body" scroll-y>
        <!-- 时间筛选 -->
        <view class="filter-group">
          <view class="group-title">时间范围</view>
          <view class="group-options">
            <view 
              v-for="option in timeOptions" 
              :key="option.value"
              class="filter-option"
              :class="{ active: localFilters.time === option.value }"
              @click="updateFilters({ time: option.value })"
            >
              {{ option.label }}
              <view v-if="localFilters.time === option.value" class="option-check">
                <uni-icons type="checkmark" size="16" color="#007AFF"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 类型筛选 -->
        <view class="filter-group">
          <view class="group-title">资讯类型</view>
          <view class="group-options">
            <view 
              v-for="option in typeOptions" 
              :key="option.value"
              class="filter-option"
              :class="{ active: localFilters.type === option.value }"
              @click="updateFilters({ type: option.value })"
            >
              {{ option.label }}
              <view v-if="localFilters.type === option.value" class="option-check">
                <uni-icons type="checkmark" size="16" color="#007AFF"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 排序方式 -->
        <view class="filter-group">
          <view class="group-title">排序方式</view>
          <view class="group-options">
            <view 
              v-for="option in sortOptions" 
              :key="option.value"
              class="filter-option"
              :class="{ active: localSort === option.value }"
              @click="updateSort(option.value)"
            >
              {{ option.label }}
              <view v-if="localSort === option.value" class="option-check">
                <uni-icons type="checkmark" size="16" color="#007AFF"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 网格列数（仅卡片模式） -->
        <view v-if="viewMode === 'card'" class="filter-group">
          <view class="group-title">网格列数</view>
          <view class="grid-options">
            <view 
              v-for="cols in [2, 3]" 
              :key="cols"
              class="grid-option"
              :class="{ active: localGridColumns === cols }"
              @click="updateGridColumns(cols)"
            >
              <view class="grid-preview" :class="`grid-${cols}`">
                <view v-for="i in cols" :key="i" class="grid-box"></view>
              </view>
              <text class="grid-text">{{ cols }}列</text>
            </view>
          </view>
        </view>
      </scroll-view>
      
      <view class="filter-footer">
        <view class="filter-reset" @click="handleReset">重置</view>
        <view class="filter-confirm" @click="handleConfirm">确定</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  filters: {
    type: Object,
    default: () => ({ time: 'all', type: 'all' })
  },
  currentSort: {
    type: String,
    default: 'time'
  },
  viewMode: {
    type: String,
    default: 'list'
  },
  gridColumns: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits([
  'update:visible',
  'filter-change',
  'sort-change',
  'grid-change',
  'reset',
  'apply'
])

// 本地状态
const localFilters = ref({ ...props.filters })
const localSort = ref(props.currentSort)
const localGridColumns = ref(props.gridColumns)

// 监听props变化
watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

watch(() => props.currentSort, (newVal) => {
  localSort.value = newVal
})

watch(() => props.gridColumns, (newVal) => {
  localGridColumns.value = newVal
})

// 筛选选项
const timeOptions = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'week', label: '近一周' },
  { value: 'month', label: '近一个月' }
]

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'video', label: '视频资讯' },
  { value: 'pinned', label: '置顶资讯' },
  { value: 'hot', label: '热点资讯' }
]

const sortOptions = [
  { value: 'time', label: '最新发布' },
  { value: 'hot', label: '热度排序' },
  { value: 'like', label: '点赞最多' }
]

// 事件处理
const updateFilters = (newFilters) => {
  localFilters.value = { ...localFilters.value, ...newFilters }
}

const updateSort = (sort) => {
  localSort.value = sort
}

const updateGridColumns = (columns) => {
  localGridColumns.value = columns
}

const handleReset = () => {
  localFilters.value = { time: 'all', type: 'all' }
  localSort.value = 'time'
  localGridColumns.value = 2
  emit('reset')
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('filter-change', { ...localFilters.value })
  emit('sort-change', localSort.value)
  emit('grid-change', localGridColumns.value)
  emit('apply')
  handleClose()
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;

  .filter-panel {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;

    .night-mode & {
      background: #2a2a2a;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid $gray-2;

      .night-mode & {
        border-bottom-color: #444;
      }

      text {
        font-size: 32rpx;
        font-weight: bold;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }

      .filter-close {
        font-size: 40rpx;
        color: $gray-5;
        line-height: 1;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:active {
          background: rgba(0, 0, 0, 0.05);

          .night-mode & {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }
    }

    .filter-body {
      flex: 1;
      max-height: 60vh;
      padding: 30rpx;
      overflow-y: auto;
    }

    .filter-footer {
      display: flex;
      gap: 20rpx;
      padding: 20rpx 30rpx;
      border-top: 1rpx solid $gray-2;

      .night-mode & {
        border-top-color: #444;
      }

      .filter-reset,
      .filter-confirm {
        flex: 1;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .filter-reset {
        background: $gray-1;
        color: $gray-6;

        .night-mode & {
          background: #444;
          color: #999;
        }

        &:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
      }

      .filter-confirm {
        background: $primary-color;
        color: #fff;

        &:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
      }
    }
  }
}

.filter-group {
  margin-bottom: 40rpx;

  .group-title {
    font-size: 28rpx;
    font-weight: 500;
    color: $gray-8;
    margin-bottom: 20rpx;

    .night-mode & {
      color: #e0e0e0;
    }
  }

  .group-options {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .filter-option {
      position: relative;
      padding: 20rpx 30rpx;
      background: $gray-0;
      border-radius: 12rpx;
      font-size: 26rpx;
      color: $gray-6;
      border: 2rpx solid transparent;
      transition: all 0.3s ease;

      .night-mode & {
        background: #2a2a2a;
        color: #999;
      }

      &:active {
        opacity: 0.8;
        transform: scale(0.98);
      }

      &.active {
        border-color: $primary-color;
        background: rgba(0, 122, 255, 0.1);
        color: $primary-color;

        .night-mode & {
          background: rgba(0, 122, 255, 0.2);
        }

        .option-check {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          width: 20rpx;
          height: 20rpx;
        }
      }
    }
  }

  .grid-options {
    display: flex;
    gap: 30rpx;

    .grid-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      padding: 20rpx;
      border-radius: 12rpx;
      border: 2rpx solid transparent;
      transition: all 0.3s ease;

      .night-mode & {
        background: #2a2a2a;
      }

      &:active {
        opacity: 0.8;
      }

      &.active {
        border-color: $primary-color;
        background: rgba(0, 122, 255, 0.1);

        .night-mode & {
          background: rgba(0, 122, 255, 0.2);
        }
      }

      .grid-preview {
        display: flex;
        gap: 4rpx;

        &.grid-2 {
          width: 80rpx;

          .grid-box {
            flex: 1;
            height: 40rpx;
            background: $gray-4;
            border-radius: 4rpx;

            .night-mode & {
              background: #555;
            }
          }
        }

        &.grid-3 {
          width: 100rpx;

          .grid-box {
            flex: 1;
            height: 40rpx;
            background: $gray-4;
            border-radius: 4rpx;

            .night-mode & {
              background: #555;
            }
          }
        }
      }

      .grid-text {
        font-size: 24rpx;
        color: $gray-6;

        .night-mode & {
          color: #999;
        }

        .grid-option.active & {
          color: $primary-color;
        }
      }
    }
  }
}
</style>