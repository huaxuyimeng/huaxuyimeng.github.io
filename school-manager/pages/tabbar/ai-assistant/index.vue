<template>
  <view class="ai-assistant-container">
    <!-- 聊天头部 -->
    <chat-header
      :is-online="isOnline"
      :typing="typing"
      @go-back="handleGoBack"
      @show-more="showMoreActions"
    />
    
    <!-- 消息列表 -->
    <message-list
      :messages="currentMessages"
      :show-welcome="showWelcome"
      :quick-questions="quickQuestions"
      :is-loading="loading"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      :show-new-message-tip="showNewMessageTip"
      :new-message-count="newMessageCount"
      :user-avatar="userAvatar"
      @copy="handleCopyMessage"
      @like="handleLikeMessage"
      @dislike="handleDislikeMessage"
      @retry="handleRetryMessage"
      @quick-question="handleQuickQuestion"
      @scroll="handleScroll"
      @scroll-to-bottom="scrollToBottom"
    />
    
    <!-- 输入区域 -->
    <input-area
      :input-message="inputMessage"
      :auto-focus="autoFocus"
      :is-online="isOnline"
      @input-change="handleInputChange"
      @send="handleSendMessage"
      @show-options="showInputOptions"
      @start-voice="startVoiceInput"
    />
    
    <!-- Toast提示 -->
    <view v-if="toastVisible" class="toast-message" :class="toastType">
      <view class="toast-content">
        <text :style="{ fontSize: '20px', color: toastColor }">{{ toastIcon }}</text>
        <text class="toast-text">{{ toastMessage }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import InputArea from './InputArea.vue'

export default {
  name: 'AIAssistant',
  
  components: {
    ChatHeader,
    MessageList,
    InputArea
  },
  
  data() {
    return {
      // 输入相关
      inputMessage: '',
      autoFocus: false,
      
      // 滚动相关
      scrollTop: 0,
      scrollIntoView: '',
      showNewMessageTip: false,
      newMessageCount: 0,
      
      // Toast提示
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      toastTimer: null
    }
  },
  
  computed: {
    ...mapState('aiAssistant', [
      'isOnline',
      'loading',
      'typing',
      'quickQuestions',
      'settings'
    ]),
    
    ...mapGetters('aiAssistant', [
      'currentMessages',
      'shouldShowWelcome',
      'userAvatar'
    ]),
    
    showWelcome() {
      return this.shouldShowWelcome
    },
    
    toastIcon() {
      switch (this.toastType) {
        case 'success': return 'checkmarkempty'
        case 'error': return 'closeempty'
        case 'warning': return 'info'
        default: return 'info'
      }
    },
    
    toastColor() {
      switch (this.toastType) {
        case 'success': return '#3CC51F'
        case 'error': return '#FF3B30'
        case 'warning': return '#FF9500'
        default: return '#007AFF'
      }
    }
  },
  
  onLoad() {
    this.initializeApp()
  },
  
  onShow() {
    this.autoFocus = true
    this.checkMessageStatus()
  },
  
  onHide() {
    this.saveToStorage()
  },
  
  methods: {
    ...mapActions('aiAssistant', [
      'initialize',
      'sendMessage',
      'copyMessage',
      'retryMessage',
      'rateMessage',
      'clearChatHistory',
      'saveToStorage'
    ]),
    
    // 初始化应用
    async initializeApp() {
      const success = await this.initialize()
      if (success) {
        this.scrollToBottom()
      } else {
        this.showToast('初始化失败，请检查网络', 'error')
      }
    },
    
    // 发送消息
    async handleSendMessage() {
      const content = (typeof this.inputMessage === 'string') ? this.inputMessage.trim() : String(this.inputMessage).trim()
      if (!content) {
        this.showToast('请输入问题', 'warning')
        return
      }
      
      try {
        await this.sendMessage(content)
        this.inputMessage = ''
        this.scrollToBottom()
      } catch (error) {
        console.error('发送消息失败:', error)
        this.showToast('消息发送失败，请重试', 'error')
      }
    },
    
    // 处理快捷问题
    async handleQuickQuestion(question) {
      this.inputMessage = question
      this.autoFocus = true
      
      setTimeout(async () => {
        await this.handleSendMessage()
      }, 300)
    },
    
    // 复制消息
    async handleCopyMessage(messageId) {
      const success = await this.copyMessage(messageId)
      if (success) {
        this.showToast('已复制到剪贴板', 'success')
      } else {
        this.showToast('复制失败', 'error')
      }
    },
    
    // 点赞消息
    async handleLikeMessage(messageId) {
      await this.rateMessage({ messageId, action: 'like' })
    },
    
    // 点踩消息
    async handleDislikeMessage(messageId) {
      await this.rateMessage({ messageId, action: 'dislike' })
    },
    
    // 重试消息
    async handleRetryMessage(message) {
      await this.retryMessage(message.id)
    },
    
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollIntoView = 'scroll-anchor'
        setTimeout(() => {
          this.scrollTop = 999999
          this.showNewMessageTip = false
          this.newMessageCount = 0
        }, 100)
      })
    },
    
    // 滚动事件处理
    handleScroll(e) {
      const { scrollHeight, scrollTop } = e.detail
      const viewportHeight = 600 // 可视区域高度估计值
      const distanceToBottom = scrollHeight - scrollTop - viewportHeight
      
      // 距离底部200px时认为在底部
      if (distanceToBottom > 200) {
        const newMessages = this.currentMessages.filter(msg => 
          new Date(msg.timestamp) > new Date(Date.now() - 30000)
        )
        this.newMessageCount = newMessages.length
        this.showNewMessageTip = this.newMessageCount > 0
      } else {
        this.showNewMessageTip = false
      }
    },
    
    // 输入变化处理
    handleInputChange(value) {
      this.inputMessage = value
    },
    
    // 显示更多操作
    showMoreActions() {
      uni.showActionSheet({
        itemList: ['清空聊天记录', '导出聊天记录', '帮助中心', '设置'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0:
              this.clearChatHistoryConfirm()
              break
            case 1:
              this.exportChatHistory()
              break
            case 2:
              this.goToHelp()
              break
            case 3:
              this.goToSettings()
              break
          }
        }
      })
    },
    
    // 清空聊天记录确认
    clearChatHistoryConfirm() {
      uni.showModal({
        title: '提示',
        content: '确定要清空聊天记录吗？',
        success: async (res) => {
          if (res.confirm) {
            const success = await this.clearChatHistory()
            if (success) {
              this.showToast('聊天记录已清空', 'success')
              this.scrollToBottom()
            }
          }
        }
      })
    },
    
    // 导出聊天记录
    exportChatHistory() {
      this.showToast('导出功能开发中', 'info')
    },
    
    // 前往帮助中心
    goToHelp() {
      uni.navigateTo({
        url: '/pages/help/index'
      })
    },
    
    // 前往设置
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/index'
      })
    },
    
    // 显示输入选项
    showInputOptions() {
      uni.showActionSheet({
        itemList: ['选择图片', '选择文件', '历史记录'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0:
              this.chooseImage()
              break
            case 1:
              this.chooseFile()
              break
            case 2:
              this.openHistory()
              break
          }
        }
      })
    },
    
    // 开始语音输入
    startVoiceInput() {
      this.showToast('语音输入功能开发中', 'info')
    },
    
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: () => {
          this.showToast('图片已选择', 'success')
        }
      })
    },
    
    // 选择文件
    chooseFile() {
      this.showToast('文件功能开发中', 'info')
    },
    
    // 打开历史记录
    openHistory() {
      this.showToast('历史记录页面开发中', 'info')
    },
    
    // 返回上一页
    handleGoBack() {
      uni.navigateBack()
    },
    
    // 检查消息状态
    checkMessageStatus() {
      const sendingMessages = this.currentMessages.filter(
        msg => msg.type === 'user' && msg.status === 'sending'
      )
      
      sendingMessages.forEach(msg => {
        setTimeout(() => {
          this.$store.commit('aiAssistant/UPDATE_MESSAGE', {
            id: msg.id,
            updates: { status: 'success' }
          })
        }, 1000)
      })
    },
    
    // 显示Toast
    showToast(message, type = 'info') {
      this.toastMessage = message
      this.toastType = type
      this.toastVisible = true
      
      if (this.toastTimer) {
        clearTimeout(this.toastTimer)
      }
      
      this.toastTimer = setTimeout(() => {
        this.toastVisible = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-assistant-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #f0f2f5 100%);
  position: relative;
}

.toast-message {
  position: fixed;
  top: 140rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 24rpx 48rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 60rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  z-index: 9999;
  animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 80%;
  
  .toast-content {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  
  .toast-text {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
  }
  
  &.success {
    background: rgba(232, 247, 232, 0.95);
    border: 1rpx solid rgba(60, 197, 31, 0.2);
  }
  
  &.error {
    background: rgba(255, 234, 234, 0.95);
    border: 1rpx solid rgba(255, 59, 48, 0.2);
  }
  
  &.warning {
    background: rgba(255, 249, 230, 0.95);
    border: 1rpx solid rgba(255, 149, 0, 0.2);
  }
  
  &.info {
    border: 1rpx solid rgba(0, 122, 255, 0.2);
  }
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>