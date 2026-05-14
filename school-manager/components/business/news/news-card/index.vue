<template>
  <view 
    class="news-card" 
    :class="[`card-${layout}`]"
    @click="handleClick"
  >
    <view v-if="layout === 'horizontal'" class="card-cover">
      <image :src="news.cover" mode="aspectFill" class="cover-image" />
    </view>
    <view class="card-content">
      <text class="card-title">{{ news.title }}</text>
      <text v-if="news.description" class="card-description">{{ news.description }}</text>
      <view class="card-meta">
        <text class="meta-item">{{ news.author }}</text>
        <text class="meta-divider">·</text>
        <text class="meta-item">{{ formatTime(news.publishTime) }}</text>
        <text class="meta-divider">·</text>
        <text class="meta-item">{{ news.views }} 阅读</text>
      </view>
      <view v-if="showActions" class="card-actions">
        <view class="action-item" @click.stop="handleLike">
          <text class="action-icon">{{ news.isLiked ? '❤️' : '🤍' }}</text>
          <text class="action-text">{{ news.likes }}</text>
        </view>
        <view class="action-item" @click.stop="handleComment">
          <text class="action-icon">💬</text>
          <text class="action-text">{{ news.comments }}</text>
        </view>
        <view class="action-item" @click.stop="handleCollect">
          <text class="action-icon">{{ news.isCollected ? '⭐' : '☆' }}</text>
          <text class="action-text">{{ news.collects }}</text>
        </view>
      </view>
    </view>
    <view v-if="layout === 'vertical'" class="card-cover">
      <image :src="news.cover" mode="aspectFill" class="cover-image" />
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
  news: {
    type: Object,
    required: true
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'like', 'comment', 'collect'])

const handleClick = () => {
  emit('click', props.news)
}

const handleLike = () => {
  emit('like', props.news)
}

const handleComment = () => {
  emit('comment', props.news)
}

const handleCollect = () => {
  emit('collect', props.news)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-card {
  display: flex;
  background: $white;
  border-radius: $border-radius-base;
  padding: $spacing-3;
  margin-bottom: $spacing-2;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-base;
  }
  
  &.card-horizontal {
    .card-cover {
      width: 200rpx;
      height: 150rpx;
      margin-right: $spacing-3;
      flex-shrink: 0;
    }
    
    .card-content {
      flex: 1;
    }
  }
  
  &.card-vertical {
    flex-direction: column;
    
    .card-cover {
      width: 100%;
      height: 400rpx;
      margin-bottom: $spacing-2;
    }
  }
}

.card-cover {
  border-radius: $border-radius-base;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
    margin-bottom: $spacing-1;
    @include ellipsis(2);
  }
  
  .card-description {
    font-size: $font-size-sm;
    color: $gray-5;
    margin-bottom: $spacing-2;
    @include ellipsis(2);
  }
  
  .card-meta {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-2;
    font-size: $font-size-xs;
    color: $gray-4;
    
    .meta-item {
      color: $gray-4;
    }
    
    .meta-divider {
      margin: 0 $spacing-1;
      color: $gray-4;
    }
  }
  
  .card-actions {
    display: flex;
    gap: $spacing-4;
    padding-top: $spacing-2;
    border-top: 1rpx solid $gray-2;
    
    .action-item {
      display: flex;
      align-items: center;
      gap: $spacing-1;
      cursor: pointer;
      
      .action-icon {
        font-size: $font-size-base;
      }
      
      .action-text {
        font-size: $font-size-xs;
        color: $gray-5;
      }
    }
  }
}
</style>
