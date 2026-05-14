<template>
  <view class="news-comment">
    <view class="comment-header">
      <image :src="comment.avatar" class="comment-avatar" mode="aspectFill" />
      <view class="comment-info">
        <text class="comment-username">{{ comment.username }}</text>
        <text class="comment-time">{{ formatTime(comment.createTime) }}</text>
      </view>
      <view v-if="showActions" class="comment-actions">
        <view class="action-item" @click="handleLike">
          <text class="action-icon">{{ comment.isLiked ? '❤️' : '🤍' }}</text>
          <text v-if="comment.likes > 0" class="action-count">{{ comment.likes }}</text>
        </view>
      </view>
    </view>
    <view class="comment-content">
      <text v-if="comment.replyTo" class="reply-to">@{{ comment.replyToUsername }}</text>
      <text class="comment-text">{{ comment.content }}</text>
    </view>
    <view v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
      <view 
        v-for="(reply, index) in comment.replies" 
        :key="index"
        class="reply-item"
      >
        <news-comment 
          :comment="reply" 
          :show-actions="showActions"
          @like="handleReplyLike"
        />
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
  comment: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['like', 'reply', 'delete'])

const handleLike = () => {
  emit('like', props.comment)
}

const handleReplyLike = (reply) => {
  emit('like', reply)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-comment {
  padding: $spacing-3;
  background: $white;
  border-radius: $border-radius-base;
  margin-bottom: $spacing-2;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-2;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: $spacing-2;
}

.comment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .comment-username {
    font-size: $font-size-base;
    color: $gray-8;
    font-weight: 500;
    margin-bottom: $spacing-1;
  }
  
  .comment-time {
    font-size: $font-size-xs;
    color: $gray-4;
  }
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  
  .action-item {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    cursor: pointer;
    
    .action-icon {
      font-size: $font-size-base;
    }
    
    .action-count {
      font-size: $font-size-xs;
      color: $gray-5;
    }
  }
}

.comment-content {
  margin-bottom: $spacing-2;
  line-height: 1.6;
  
  .reply-to {
    color: $primary-color;
    margin-right: $spacing-1;
  }
  
  .comment-text {
    font-size: $font-size-base;
    color: $gray-7;
  }
}

.comment-replies {
  margin-top: $spacing-2;
  padding-left: $spacing-4;
  border-left: 2rpx solid $gray-2;
  
  .reply-item {
    margin-bottom: $spacing-2;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
