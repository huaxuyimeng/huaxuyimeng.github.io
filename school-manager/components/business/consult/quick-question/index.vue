<template>
  <view class="quick-question">
    <view class="question-header">
      <text class="header-title">常见问题</text>
    </view>
    <view class="question-list">
      <view 
        v-for="(item, index) in questions" 
        :key="index"
        class="question-item"
        @click="handleQuestionClick(item)"
      >
        <text class="question-text">{{ item }}</text>
        <text class="question-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    default: () => [
      '如何注册账号？',
      '如何修改密码？',
      '如何联系客服？',
      '如何申请退款？'
    ]
  }
})

const emit = defineEmits(['question-click'])

const handleQuestionClick = (question) => {
  emit('question-click', question)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.quick-question {
  background: $white;
  border-radius: $border-radius-base;
  padding: $spacing-3;
  margin-bottom: $spacing-2;
  box-shadow: $shadow-sm;
}

.question-header {
  margin-bottom: $spacing-3;
  
  .header-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.question-list {
  display: flex;
  flex-direction: column;
}

.question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-2 0;
  border-bottom: 1rpx solid $gray-2;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: $gray-1;
    margin: 0 -$spacing-3;
    padding-left: $spacing-3;
    padding-right: $spacing-3;
  }
  
  .question-text {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-7;
  }
  
  .question-arrow {
    font-size: $font-size-xl;
    color: $gray-4;
    transform: rotate(90deg);
  }
}
</style>
