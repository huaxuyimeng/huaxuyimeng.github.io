<template>
  <view class="news-detail">
    <view class="detail-header">
      <text class="detail-title">{{ news.title }}</text>
      <view class="detail-meta">
        <text class="meta-item">{{ news.author }}</text>
        <text class="meta-divider">·</text>
        <text class="meta-item">{{ formatTime(news.publishTime) }}</text>
        <text class="meta-divider">·</text>
        <text class="meta-item">{{ news.views }} 阅读</text>
      </view>
    </view>
    <view v-if="news.cover" class="detail-cover">
      <image :src="news.cover" mode="aspectFill" class="cover-image" />
    </view>
    <view class="detail-content">
      <rich-text :nodes="news.content" />
    </view>
    <view v-if="showActions" class="detail-actions">
      <view class="action-item" @click="handleLike">
        <text class="action-icon">{{ news.isLiked ? '❤️' : '🤍' }}</text>
        <text class="action-text">{{ news.likes }}</text>
      </view>
      <view class="action-item" @click="handleComment">
        <text class="action-icon">💬</text>
        <text class="action-text">{{ news.comments }}</text>
      </view>
      <view class="action-item" @click="handleCollect">
        <text class="action-icon">{{ news.isCollected ? '⭐' : '☆' }}</text>
        <text class="action-text">{{ news.collects }}</text>
      </view>
      <view class="action-item" @click="handleShare">
        <text class="action-icon">📤</text>
        <text class="action-text">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const formatTime = (time) => {
  return formatDateTime(time, 'YYYY-MM-DD HH:mm')
}

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['like', 'comment', 'collect', 'share'])

const handleLike = () => {
  emit('like', props.news)
}

const handleComment = () => {
  emit('comment', props.news)
}

const handleCollect = () => {
  emit('collect', props.news)
}

const handleShare = () => {
  emit('share', props.news)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-detail {
  background: $white;
  padding: $spacing-4;
}

.detail-header {
  margin-bottom: $spacing-3;
  
  .detail-title {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $gray-8;
    line-height: 1.5;
    margin-bottom: $spacing-2;
    display: block;
  }
  
  .detail-meta {
    display: flex;
    align-items: center;
    font-size: $font-size-sm;
    color: $gray-5;
    
    .meta-item {
      color: $gray-5;
    }
    
    .meta-divider {
      margin: 0 $spacing-1;
      color: $gray-4;
    }
  }
}

.detail-cover {
  width: 100%;
  height: 400rpx;
  border-radius: $border-radius-base;
  overflow: hidden;
  margin-bottom: $spacing-3;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
}

.detail-content {
  margin-bottom: $spacing-4;
  line-height: 1.8;
  font-size: $font-size-base;
  color: $gray-7;
}

.detail-actions {
  display: flex;
  justify-content: space-around;
  padding: $spacing-3 0;
  border-top: 1rpx solid $gray-2;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-1;
    cursor: pointer;
    
    .action-icon {
      font-size: $font-size-xl;
    }
    
    .action-text {
      font-size: $font-size-xs;
      color: $gray-6;
    }
  }
}
</style>
