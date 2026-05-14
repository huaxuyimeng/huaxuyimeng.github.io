<template>
  <view 
    class="modal-container" 
    v-if="visible"
    @click="handleOverlayClick"
  >
    <view class="modal-overlay"></view>
    <view 
      class="modal-content" 
      :class="[
        `modal-${position}`
      ]"
      @click.stop
    >
      <view v-if="showClose" class="modal-close" @click="handleClose">
        <text class="close-icon">✕</text>
      </view>
      <view v-if="title" class="modal-header">
        <text class="modal-title">{{ title }}</text>
      </view>
      <view class="modal-body">
        <slot></slot>
      </view>
      <view v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <view class="footer-buttons">
            <view class="footer-button cancel" @click="handleCancel">
              <text>{{ cancelText }}</text>
            </view>
            <view class="footer-button confirm" @click="handleConfirm">
              <text>{{ confirmText }}</text>
            </view>
          </view>
        </slot>
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
    default: ''
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'top', 'bottom'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  closeOnClickOverlay: {
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
  width: {
    type: [String, Number],
    default: '600rpx'
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
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

.modal-container {
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
  overflow: hidden;
  width: 600rpx;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: modal-fade-in $transition-duration $transition-timing;
}

.modal-center {
  // 居中显示
}

.modal-top {
  align-self: flex-start;
  margin-top: 20vh;
}

.modal-bottom {
  align-self: flex-end;
  margin-bottom: 20vh;
}

.modal-close {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  
  .close-icon {
    font-size: $font-size-xl;
    color: $gray-5;
    font-weight: 300;
  }
}

.modal-header {
  padding: $spacing-4 $spacing-4 $spacing-2;
  border-bottom: 1rpx solid $gray-2;
  
  .modal-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.modal-body {
  flex: 1;
  padding: $spacing-4;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-footer {
  padding: $spacing-2 $spacing-4 $spacing-4;
  border-top: 1rpx solid $gray-2;
}

.footer-buttons {
  display: flex;
  gap: $spacing-2;
}

.footer-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  cursor: pointer;
  
  &.cancel {
    background: $gray-2;
    color: $gray-7;
  }
  
  &.confirm {
    background: $primary-color;
    color: $white;
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
