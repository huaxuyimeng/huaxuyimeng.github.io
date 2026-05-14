<template>
  <view class="avatar-upload">
    <view class="upload-preview" @click="handleChoose">
      <image 
        v-if="avatarUrl" 
        :src="avatarUrl" 
        class="preview-image"
        mode="aspectFill"
      />
      <view v-else class="preview-placeholder">
        <text class="placeholder-icon">📷</text>
        <text class="placeholder-text">点击上传头像</text>
      </view>
      <view class="upload-mask">
        <text class="mask-icon">✏️</text>
      </view>
    </view>
    <view v-if="error" class="upload-error">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: 200
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: '上传失败'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'error'])

const avatarUrl = ref(props.modelValue)

const handleChoose = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      avatarUrl.value = tempFilePath
      emit('update:modelValue', tempFilePath)
      emit('change', tempFilePath)
      // 这里可以调用上传接口
    },
    fail: (err) => {
      emit('error', err)
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-preview {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 4rpx solid $gray-2;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.95);
  }
  
  .preview-image {
    width: 100%;
    height: 100%;
  }
  
  .preview-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $gray-1;
    
    .placeholder-icon {
      font-size: $font-size-3xl;
      margin-bottom: $spacing-1;
    }
    
    .placeholder-text {
      font-size: $font-size-sm;
      color: $gray-5;
    }
  }
  
  .upload-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity $transition-duration $transition-timing;
    
    .mask-icon {
      font-size: $font-size-base;
      color: $white;
    }
  }
  
  &:active .upload-mask {
    opacity: 1;
  }
}

.upload-error {
  margin-top: $spacing-2;
  font-size: $font-size-sm;
  color: $danger-color;
}
</style>
