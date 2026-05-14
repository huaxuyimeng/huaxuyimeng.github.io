<template>
  <view class="chat-history">
    <view 
      v-for="(item, index) in historyList" 
      :key="getItemKey(item, index)"
      class="history-item"
      @click="handleItemClick(item)"
    >
      <image :src="item.avatar || '/static/default-avatar.png'" class="history-avatar" mode="aspectFill" />
      <view class="history-content">
        <view class="history-header">
          <text class="history-title">{{ item.title }}</text>
          <text class="history-time">{{ formatTime(item.lastTime) }}</text>
        </view>
        <text class="history-message">{{ item.lastMessage }}</text>
      </view>
      <view v-if="item.unreadCount > 0" class="history-badge">
        <text>{{ item.unreadCount > 99 ? '99+' : item.unreadCount }}</text>
      </view>
    </view>
    <view v-if="historyList.length === 0" class="history-empty">
      <empty-state description="暂无聊天记录" />
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const formatTime = (time) => {
  return formatDateTime(time, 'MM-DD HH:mm')
}
import EmptyState from '@/components/common/empty-state/index.vue'

const props = defineProps({
  historyList: {
    type: Array,
    default: () => []
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

const handleItemClick = (item) => {
  emit('item-click', item)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chat-history {
  width: 100%;
}

.history-item {
  display: flex;
  align-items: center;
  padding: $spacing-3;
  background: $white;
  border-bottom: 1rpx solid $gray-2;
  cursor: pointer;
  transition: background $transition-duration $transition-timing;
  position: relative;
  
  &:active {
    background: $gray-1;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.history-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: $spacing-3;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-1;
    
    .history-title {
      font-size: $font-size-base;
      font-weight: 500;
      color: $gray-8;
    }
    
    .history-time {
      font-size: $font-size-xs;
      color: $gray-4;
    }
  }
  
  .history-message {
    font-size: $font-size-sm;
    color: $gray-5;
    @include ellipsis(1);
  }
}

.history-badge {
  position: absolute;
  top: $spacing-3;
  right: $spacing-3;
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
  
  text {
    color: $white;
  }
}

.history-empty {
  padding: $spacing-8 0;
}
</style>
