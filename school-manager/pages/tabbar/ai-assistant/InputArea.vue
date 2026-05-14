<template>
  <view class="input-area">
    <view class="input-container">
      <button 
        class="input-btn add-btn" 
        @click="$emit('show-options')"
        hover-class="btn-hover"
        :disabled="!isOnline"
      >
        <text class="btn-icon">＋</text>
      </button>
      
      <view class="input-wrapper">
        <input
          class="message-input"
          v-model="inputValue"
          placeholder="输入您的问题..."
          placeholder-class="input-placeholder"
          :maxlength="500"
          :adjust-position="true"
          :focus="autoFocus"
          confirm-type="send"
          @confirm="$emit('send')"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @input="handleInput"
          :disabled="!isOnline"
        />
        <view v-if="inputValue.length > 0" class="char-count">{{ inputValue.length }}/500</view>
      </view>
      
      <button
        v-if="inputValue.trim()"
        class="send-btn"
        @click="$emit('send')"
        :disabled="!isOnline"
        hover-class="btn-hover"
      >
        <text class="send-icon">✈</text>
      </button>
      <button
        v-else
        class="voice-btn"
        @click="$emit('start-voice')"
        :disabled="!isOnline"
        hover-class="btn-hover"
      >
        <text class="voice-icon">🎤</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'InputArea',
  
  props: {
    inputMessage: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    isOnline: {
      type: Boolean,
      default: true
    }
  },
  
  computed: {
    inputValue: {
      get() {
        return this.inputMessage
      },
      set(value) {
        this.$emit('input-change', value)
      }
    }
  },
  
  methods: {
    onInputFocus() {
      // 可以在这里触发滚动到底部
      setTimeout(() => {
        this.$emit('focus')
      }, 300)
    },
    
    onInputBlur() {
      this.$emit('blur')
    },
    
    handleInput(e) {
      this.$emit('input-change', e.detail.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 16rpx;
  }
  
  .add-btn {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    
    .btn-icon {
      font-size: 36rpx;
      color: #3CC51F;
      font-weight: 300;
      line-height: 1;
    }
    
    &.btn-hover:not(:disabled) {
      background: linear-gradient(135deg, #e0f5e0 0%, #d8f0d8 100%);
      transform: scale(0.95);
    }
    
    &:disabled {
      opacity: 0.5;
    }
  }
  
  .input-wrapper {
    flex: 1;
    position: relative;
    min-width: 0;
  }
  
  .message-input {
    width: 100%;
    min-height: 64rpx;
    max-height: 200rpx;
    padding: 18rpx 28rpx;
    padding-bottom: 40rpx;
    background-color: #f5f7fa;
    border-radius: 32rpx;
    font-size: 28rpx;
    line-height: 1.5;
    color: #333;
    transition: all 0.3s;
    box-sizing: border-box;
    
    &:focus {
      background-color: #fff;
      box-shadow: 0 0 0 3rpx rgba(60, 197, 31, 0.15);
    }
    
    &:disabled {
      opacity: 0.6;
      background-color: #f0f0f0;
    }
  }
  
  .input-placeholder {
    color: #999;
  }
  
  .char-count {
    position: absolute;
    right: 20rpx;
    bottom: 12rpx;
    font-size: 20rpx;
    color: #999;
    pointer-events: none;
  }
  
  .voice-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
    border-radius: 50%;
    border: none;
    flex-shrink: 0;
    transition: all 0.2s;
    
    .voice-icon {
      font-size: 32rpx;
      line-height: 1;
    }
    
    &.btn-hover:not(:disabled) {
      background: linear-gradient(135deg, #e0f5e0 0%, #d8f0d8 100%);
      transform: scale(0.95);
    }
    
    &:disabled {
      opacity: 0.5;
    }
  }
  
  .send-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3CC51F 0%, #8BC34A 100%);
    border-radius: 50%;
    border: none;
    box-shadow: 0 4rpx 16rpx rgba(60, 197, 31, 0.35);
    flex-shrink: 0;
    transition: all 0.2s;
    
    .send-icon {
      font-size: 32rpx;
      color: #fff;
      line-height: 1;
    }
    
    &.btn-hover:not(:disabled) {
      transform: scale(0.95);
      box-shadow: 0 2rpx 12rpx rgba(60, 197, 31, 0.4);
    }
    
    &:disabled {
      opacity: 0.5;
      box-shadow: none;
    }
  }
}
</style>