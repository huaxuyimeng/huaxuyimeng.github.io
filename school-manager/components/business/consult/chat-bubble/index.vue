<template>
  <view 
    class="chat-bubble" 
    :class="[
      `bubble-${message.type}`,
      { 'bubble-show-time': showTime }
    ]"
  >
    <view v-if="showTime" class="bubble-time">
      <text>{{ formatTime(message.timestamp) }}</text>
    </view>
    <view class="bubble-content">
      <image 
        v-if="showAvatar && message.type === 'user'" 
        :src="message.avatar" 
        class="bubble-avatar"
        mode="aspectFill"
      />
      <view class="bubble-message">
        <text class="message-text">{{ message.content }}</text>
      </view>
      <image 
        v-if="showAvatar && message.type === 'system'" 
        :src="message.avatar || '/static/default-avatar.png'" 
        class="bubble-avatar"
        mode="aspectFill"
      />
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const formatTime = (time) => {
  return formatDateTime(time, 'HH:mm')
}

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showTime: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chat-bubble {
  margin-bottom: $spacing-2;
  
  .bubble-time {
    text-align: center;
    margin-bottom: $spacing-1;
    
    text {
      font-size: $font-size-xs;
      color: $gray-4;
    }
  }
  
  .bubble-content {
    display: flex;
    align-items: flex-end;
    gap: $spacing-2;
    
    .bubble-avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .bubble-message {
      max-width: 60%;
      padding: $spacing-2 $spacing-3;
      border-radius: $border-radius-base;
      
      .message-text {
        font-size: $font-size-base;
        line-height: 1.5;
        word-wrap: break-word;
      }
    }
  }
  
  &.bubble-user {
    .bubble-content {
      flex-direction: row-reverse;
      
      .bubble-message {
        background: $primary-color;
        
        .message-text {
          color: $white;
        }
      }
    }
  }
  
  &.bubble-system {
    .bubble-content {
      .bubble-message {
        background: $gray-2;
	       
        .message-text {
          color: $gray-8;
        }
      }
    }
  }
}
</style>
