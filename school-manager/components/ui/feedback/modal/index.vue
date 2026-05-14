<template>
  <view class="modal" v-if="visible" @click="handleOverlayClick">
    <view class="modal-overlay"></view>
    <view class="modal-content" @click.stop>
      <view v-if="title" class="modal-header">
        <text class="modal-title">{{ title }}</text>
      </view>
      <view class="modal-body">
        <slot>
          <text class="modal-text">{{ content }}</text>
        </slot>
      </view>
      <view class="modal-footer">
        <view 
          v-if="showCancel" 
          class="modal-button cancel" 
          @click="handleCancel"
        >
          <text>{{ cancelText }}</text>
        </view>
        <view 
          class="modal-button confirm" 
          @click="handleConfirm"
        >
          <text>{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: $white;
  border-radius: $border-radius-lg;
  width: 600rpx;
  max-width: 90vw;
  overflow: hidden;
  animation: modal-fade-in $transition-duration $transition-timing;
}

.modal-header {
  padding: $spacing-4;
  text-align: center;
  border-bottom: 1rpx solid $gray-2;
  
  .modal-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.modal-body {
  padding: $spacing-4;
  min-height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-text {
    font-size: $font-size-base;
    color: $gray-7;
    text-align: center;
    line-height: 1.6;
  }
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid $gray-2;
}

.modal-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3;
  font-size: $font-size-base;
  cursor: pointer;
  
  &.cancel {
    border-right: 1rpx solid $gray-2;
    color: $gray-7;
  }
  
  &.confirm {
    color: $primary-color;
    font-weight: 500;
  }
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
