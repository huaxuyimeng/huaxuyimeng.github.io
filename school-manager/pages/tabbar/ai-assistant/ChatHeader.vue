<template>
  <view class="chat-header">
    <view class="header-left">
      <button class="header-btn back-btn" @click="$emit('go-back')" hover-class="btn-hover">
        <text class="icon-text">←</text>
      </button>
      <view class="chat-title">
        <view class="ai-icon">
          <text class="ai-text">AI</text>
        </view>
        <view class="title-content">
          <view class="title-text">校园AI助手</view>
          <view class="live-status">
            <view class="status-dot" :class="{ online: isOnline }"></view>
            <text class="status-text">{{ isOnline ? '在线' : '离线' }}</text>
          </view>
        </view>
      </view>
      <view v-if="typing" class="typing-indicator">
        <view class="typing-dot"></view>
        <view class="typing-dot"></view>
        <view class="typing-dot"></view>
        <text class="typing-text">AI正在思考...</text>
      </view>
    </view>
    <button class="header-btn more-btn" @click="$emit('show-more')" hover-class="btn-hover">
      <text class="icon-text">⋯</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'ChatHeader',
  
  props: {
    isOnline: {
      type: Boolean,
      default: true
    },
    typing: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 24rpx;
    flex: 1;
    min-width: 0;
  }
  
  .header-btn {
    background: none;
    border: none;
    padding: 16rpx;
    border-radius: 12rpx;
    transition: all 0.2s;
    flex-shrink: 0;
    
    .icon-text {
      font-size: 36rpx;
      color: #333;
      font-weight: 300;
      line-height: 1;
    }
    
    &.btn-hover {
      background-color: rgba(0, 0, 0, 0.04);
      transform: scale(0.95);
    }
  }
  
  .chat-title {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }
  
  .ai-icon {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.35);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shine 3s infinite;
    }
    
    .ai-text {
      color: white;
      font-weight: bold;
      font-size: 26rpx;
      position: relative;
      z-index: 1;
    }
  }
  
  .title-content {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;
    flex: 1;
  }
  
  .title-text {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
    line-height: 1.2;
  }
  
  .live-status {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }
  
  .status-dot {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    background-color: #ccc;
    position: relative;
    flex-shrink: 0;
    
    &.online {
      background-color: #3CC51F;
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #3CC51F;
        animation: pulse 2s infinite;
      }
    }
  }
  
  .status-text {
    font-size: 22rpx;
    color: #999;
    line-height: 1;
  }
  
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-left: 20rpx;
    padding: 8rpx 16rpx;
    background: rgba(102, 126, 234, 0.08);
    border-radius: 20rpx;
    flex-shrink: 0;
    
    .typing-dot {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background-color: #667eea;
      animation: typing 1.4s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
    
    .typing-text {
      font-size: 22rpx;
      color: #667eea;
      font-weight: 500;
    }
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

@keyframes typing {
  0%, 60%, 100% { 
    transform: translateY(0); 
    opacity: 0.6;
  }
  30% { 
    transform: translateY(-8rpx); 
    opacity: 1;
  }
}

@keyframes shine {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>