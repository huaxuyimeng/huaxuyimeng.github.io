<template>
  <view class="activity-card" @click="handleClick">
    <view class="card-cover">
      <image :src="activity.cover" mode="aspectFill" class="cover-image" />
      <view v-if="showStatus" class="card-status">
        <text class="status-text">{{ getStatusText(activity.status) }}</text>
      </view>
    </view>
    <view class="card-content">
      <text class="card-title">{{ activity.title }}</text>
      <text v-if="activity.description" class="card-description">{{ activity.description }}</text>
      <view class="card-info">
        <view class="info-item">
          <text class="info-icon">📅</text>
          <text class="info-text">{{ formatTime(activity.startTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-icon">📍</text>
          <text class="info-text">{{ activity.location }}</text>
        </view>
        <view class="info-item">
          <text class="info-icon">👥</text>
          <text class="info-text">{{ activity.participants }}/{{ activity.maxParticipants || '∞' }}</text>
        </view>
      </view>
      <view v-if="showActions" class="card-actions">
        <slot name="actions">
          <view class="action-button" @click.stop="handleJoin">
            <text>参与</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const formatTime = (time) => {
  return formatDateTime(time, 'MM-DD HH:mm')
}

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  showStatus: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'join'])

const getStatusText = (status) => {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

const handleClick = () => {
  emit('click', props.activity)
}

const handleJoin = () => {
  emit('join', props.activity)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.activity-card {
  background: $white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-2;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-base;
  }
}

.card-cover {
  position: relative;
  width: 100%;
  height: 400rpx;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
  
  .card-status {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    padding: $spacing-1 $spacing-2;
    background: rgba(0, 0, 0, 0.6);
    color: $white;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
  }
}

.card-content {
  padding: $spacing-3;
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
    margin-bottom: $spacing-1;
    display: block;
  }
  
  .card-description {
    font-size: $font-size-sm;
    color: $gray-5;
    margin-bottom: $spacing-2;
    @include ellipsis(2);
  }
  
  .card-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-1;
    margin-bottom: $spacing-2;
    
    .info-item {
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      color: $gray-6;
      
      .info-icon {
        margin-right: $spacing-1;
      }
    }
  }
  
  .card-actions {
    margin-top: $spacing-2;
    padding-top: $spacing-2;
    border-top: 1rpx solid $gray-2;
    
    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-2;
      background: $primary-color;
      color: $white;
      border-radius: $border-radius-base;
      font-size: $font-size-base;
      cursor: pointer;
    }
  }
}
</style>
