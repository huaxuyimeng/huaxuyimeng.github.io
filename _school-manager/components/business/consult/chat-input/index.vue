<template>
  <view class="chat-input">
    <view class="input-wrapper">
      <input 
        v-model="inputValue"
        class="input-field"
        placeholder="输入消息..."
        :adjust-position="true"
        @confirm="handleSend"
      />
      <view class="input-actions">
        <view v-if="inputValue" class="action-button send" @click="handleSend">
          <text>发送</text>
        </view>
        <view v-else class="action-button emoji" @click="handleEmoji">
          <text>😊</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['send'])

const inputValue = ref('')

const handleSend = () => {
  if (!inputValue.value.trim()) return
  
  emit('send', inputValue.value)
  inputValue.value = ''
}

const handleEmoji = () => {
  // 处理表情选择
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chat-input {
  padding: $spacing-2 $spacing-3;
  background: $white;
  border-top: 1rpx solid $gray-2;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  
  .input-field {
    flex: 1;
    padding: $spacing-2 $spacing-3;
    border: 1rpx solid $gray-3;
    border-radius: $border-radius-full;
    font-size: $font-size-base;
    background: $gray-1;
  }
  
  .input-actions {
    .action-button {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all $transition-duration $transition-timing;
      
      &.send {
        background: $primary-color;
        color: $white;
        
        text {
          font-size: $font-size-sm;
        }
      }
      
      &.emoji {
        background: $gray-2;
        
        text {
          font-size: $font-size-lg;
        }
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
}
</style>
