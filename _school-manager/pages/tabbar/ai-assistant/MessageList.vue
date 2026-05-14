<template>
  <scroll-view 
    class="message-list" 
    scroll-y 
    :scroll-top="scrollTop"
    :scroll-into-view="scrollIntoView"
    @scroll="$emit('scroll', $event)"
    :enable-back-to-top="true"
  >
    <view class="message-list-content">
      <!-- 欢迎界面 -->
      <view v-if="showWelcome && messages.length <= 1" class="welcome-section">
        <view class="welcome-content">
          <view class="welcome-avatar">
            <view class="avatar-icon">🤖</view>
          </view>
          <view class="welcome-title">校园AI助手</view>
          <view class="welcome-desc">我可以帮您解答校园生活问题、功能使用指导等</view>
          
          <!-- 快捷问题 -->
          <view v-if="quickQuestions && quickQuestions.length > 0" class="quick-questions">
            <view class="quick-title">常见问题</view>
            <view class="quick-list">
              <view 
                v-for="(item, idx) in quickQuestions" 
                :key="idx"
                class="quick-item"
                @click="$emit('quick-question', item.text)"
              >
                <text class="quick-icon">{{ item.icon || '💬' }}</text>
                <text class="quick-text">{{ item.text }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <view v-for="(message, index) in messages" :key="message.id" class="message-item" :id="message.id === scrollIntoView ? 'scroll-anchor' : ''">
        <!-- 时间分隔 -->
        <view v-if="showTimeDivider(index)" class="message-time-divider">
          <view class="time-line"></view>
          <text class="time-text">{{ formatTime(message.timestamp) }}</text>
          <view class="time-line"></view>
        </view>
        
        <!-- AI消息 -->
        <view v-if="message.type === 'ai' || message.role === 'assistant'" class="message-wrapper ai-message-wrapper">
          <view class="message-content ai-message">
            <view class="avatar ai-avatar">
              <view class="avatar-bg">AI</view>
            </view>
            <view class="message-bubble ai-bubble">
              <view class="message-text" v-html="formatMessageContent(message.content)"></view>
              <view class="message-footer">
                <view class="message-time">{{ formatTime(message.timestamp) }}</view>
                <view class="message-actions">
                  <view 
                    class="action-btn" 
                    @click.stop="$emit('copy', message.id)"
                    hover-class="action-btn-hover"
                  >
                    <text class="action-icon">📋</text>
                  </view>
                  <view 
                    v-if="message.isError"
                    class="action-btn" 
                    @click.stop="$emit('retry', message)"
                    hover-class="action-btn-hover"
                  >
                    <text class="action-icon">🔄</text>
                  </view>
                  <view 
                    class="action-btn" 
                    @click.stop="$emit('like', message.id)"
                    :class="{ active: message.liked }"
                    hover-class="action-btn-hover"
                  >
                    <text class="action-icon">{{ message.liked ? '👍' : '👍' }}</text>
                  </view>
                  <view 
                    class="action-btn" 
                    @click.stop="$emit('dislike', message.id)"
                    :class="{ active: message.disliked }"
                    hover-class="action-btn-hover"
                  >
                    <text class="action-icon">{{ message.disliked ? '👎' : '👎' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view v-else class="message-wrapper user-message-wrapper">
          <view class="message-content user-message">
            <view class="message-bubble user-bubble">
              <view class="message-text">{{ message.content }}</view>
              <view class="message-footer">
                <view class="message-status">
                  <text v-if="message.status === 'sending'" class="status-icon">⏳</text>
                  <text v-else-if="message.status === 'error'" class="status-icon error">❌</text>
                  <text v-else class="status-icon success">✓</text>
                </view>
                <view class="message-time">{{ formatTime(message.timestamp) }}</view>
              </view>
            </view>
            <view class="avatar user-avatar">
              <image 
                v-if="userAvatar && userAvatar !== '/static/default-avatar.png'" 
                :src="userAvatar" 
                mode="aspectFill"
                class="avatar-img"
              />
              <text v-else class="avatar-text">{{ getUserInitial() }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading-indicator">
        <view class="typing-indicator">
          <view class="typing-dot"></view>
          <view class="typing-dot"></view>
          <view class="typing-dot"></view>
        </view>
        <text class="loading-text">AI正在思考...</text>
      </view>

      <!-- 滚动到底部锚点 -->
      <view id="scroll-anchor" class="scroll-anchor"></view>
    </view>

    <!-- 新消息提示 -->
    <view 
      v-if="showNewMessageTip" 
      class="new-message-tip"
      @click="$emit('scroll-to-bottom')"
    >
      <text class="tip-text">有{{ newMessageCount }}条新消息</text>
      <text class="tip-icon">↓</text>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'MessageList',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    showWelcome: {
      type: Boolean,
      default: false
    },
    quickQuestions: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    scrollIntoView: {
      type: String,
      default: ''
    },
    showNewMessageTip: {
      type: Boolean,
      default: false
    },
    newMessageCount: {
      type: Number,
      default: 0
    },
    userAvatar: {
      type: String,
      default: '/static/default-avatar.png'
    }
  },
  methods: {
    formatTime(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const now = new Date()
      const diff = now - d
      
      // 今天
      if (diff < 24 * 60 * 60 * 1000 && d.getDate() === now.getDate()) {
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
      }
      
      // 昨天
      if (diff < 48 * 60 * 60 * 1000) {
        return `昨天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
      }
      
      // 更早
      return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    },
    
    showTimeDivider(index) {
      if (!this.messages || index === 0) return false
      const prev = this.messages[index - 1]
      const cur = this.messages[index]
      if (!prev || !cur) return false
      const prevTime = new Date(prev.timestamp).getTime()
      const curTime = new Date(cur.timestamp).getTime()
      return Math.abs(curTime - prevTime) > 5 * 60 * 1000 // 5分钟间隔
    },
    
    formatMessageContent(content) {
      if (!content) return ''
      // 将换行符转换为<br>
      return content.replace(/\n/g, '<br/>')
    },
    
    getUserInitial() {
      // 从userAvatar或其他地方获取用户首字母
      return '我'
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  flex: 1;
  height: 0;
  background: linear-gradient(180deg, #f5f7fa 0%, #f0f2f5 100%);
  position: relative;
}

.message-list-content {
  padding: 30rpx 30rpx 120rpx;
  min-height: 100%;
}

// 欢迎界面
.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0 40rpx;
  animation: fadeInDown 0.5s ease;
}

.welcome-content {
  text-align: center;
  max-width: 600rpx;
}

.welcome-avatar {
  margin-bottom: 30rpx;
  
  .avatar-icon {
    font-size: 120rpx;
    display: inline-block;
    animation: bounce 2s infinite;
  }
}

.welcome-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.welcome-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 50rpx;
}

.quick-questions {
  margin-top: 60rpx;
  text-align: left;
}

.quick-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  text-align: center;
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.quick-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .quick-icon {
    font-size: 36rpx;
    margin-right: 20rpx;
  }
  
  .quick-text {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
  }
}

// 时间分隔
.message-time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx 0;
  gap: 20rpx;
  
  .time-line {
    flex: 1;
    height: 1rpx;
    background: #e0e0e0;
  }
  
  .time-text {
    font-size: 24rpx;
    color: #999;
    padding: 0 20rpx;
  }
}

// 消息项
.message-item {
  margin-bottom: 30rpx;
  animation: fadeInUp 0.3s ease;
}

.message-wrapper {
  display: flex;
  margin-bottom: 20rpx;
}

// AI消息
.ai-message-wrapper {
  justify-content: flex-start;
}

.ai-message {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  max-width: 85%;
}

.ai-avatar {
  width: 64rpx;
  height: 64rpx;
  flex-shrink: 0;
  
  .avatar-bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  }
}

.ai-bubble {
  background: #fff;
  border-radius: 20rpx 20rpx 20rpx 4rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -12rpx;
    top: 20rpx;
    width: 0;
    height: 0;
    border: 12rpx solid transparent;
    border-right-color: #fff;
  }
}

// 用户消息
.user-message-wrapper {
  justify-content: flex-end;
}

.user-message {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  max-width: 85%;
  flex-direction: row-reverse;
}

.user-avatar {
  width: 64rpx;
  height: 64rpx;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #3CC51F 0%, #8BC34A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(60, 197, 31, 0.3);
  
  .avatar-img {
    width: 100%;
    height: 100%;
  }
  
  .avatar-text {
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.user-bubble {
  background: linear-gradient(135deg, #3CC51F 0%, #8BC34A 100%);
  border-radius: 20rpx 20rpx 4rpx 20rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(60, 197, 31, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -12rpx;
    top: 20rpx;
    width: 0;
    height: 0;
    border: 12rpx solid transparent;
    border-left-color: #3CC51F;
  }
  
  .message-text {
    color: #fff;
  }
}

// 消息内容
.message-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
  white-space: pre-wrap;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  gap: 16rpx;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  flex-shrink: 0;
}

.user-bubble .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-status {
  display: flex;
  align-items: center;
  
  .status-icon {
    font-size: 20rpx;
    
    &.success {
      color: #3CC51F;
    }
    
    &.error {
      color: #FF3B30;
    }
  }
}

// 消息操作
.message-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.ai-bubble:active .message-actions {
  opacity: 1;
}

.action-btn {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  
  &.active {
    background: rgba(60, 197, 31, 0.15);
    
    .action-icon {
      transform: scale(1.1);
    }
  }
  
  .action-icon {
    font-size: 28rpx;
    transition: transform 0.2s;
  }
}

.action-btn-hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

// 加载指示器
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 40rpx 0;
}

.typing-indicator {
  display: flex;
  gap: 8rpx;
}

.typing-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

// 新消息提示
.new-message-tip {
  position: fixed;
  bottom: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 16rpx 32rpx;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  z-index: 100;
  animation: bounceIn 0.3s ease;
  
  .tip-icon {
    font-size: 28rpx;
    animation: bounceVertical 1s infinite;
  }
}

.scroll-anchor {
  height: 1rpx;
}

// 动画
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10rpx);
    opacity: 1;
  }
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

@keyframes bounceVertical {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8rpx);
  }
}
</style>