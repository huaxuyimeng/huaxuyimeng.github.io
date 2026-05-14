<template>
  <view class="form-upload">
    <view v-if="label" class="upload-label">
      <text>{{ label }}</text>
      <text v-if="required" class="required-mark">*</text>
    </view>
    <view class="upload-list">
      <view 
        v-for="(item, index) in fileList" 
        :key="index"
        class="upload-item"
      >
        <image 
          v-if="isImage(item)" 
          :src="getFileUrl(item)" 
          mode="aspectFill"
          class="upload-image"
          @click="handlePreview(item, index)"
        />
        <view v-else class="upload-file">
          <text class="file-icon">📄</text>
          <text class="file-name">{{ getFileName(item) }}</text>
        </view>
        <view v-if="!disabled" class="upload-delete" @click="handleDelete(index)">
          <text class="delete-icon">✕</text>
        </view>
      </view>
      <view 
        v-if="!disabled && (!maxCount || fileList.length < maxCount)"
        class="upload-add"
        @click="handleChoose"
      >
        <text class="add-icon">+</text>
        <text v-if="!preview" class="add-text">{{ uploadText }}</text>
      </view>
    </view>
    <view v-if="error && errorMessage" class="upload-error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxCount: {
    type: Number,
    default: 9
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  accept: {
    type: String,
    default: 'image'
  },
  preview: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  uploadText: {
    type: String,
    default: '上传'
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'preview', 'delete', 'error'])

const fileList = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
})

const isImage = (file) => {
  if (typeof file === 'string') {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  }
  return file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || file.url || '')
}

const getFileUrl = (file) => {
  if (typeof file === 'string') return file
  return file.url || file.path || file.tempFilePath || ''
}

const getFileName = (file) => {
  if (typeof file === 'string') {
    return file.split('/').pop() || '文件'
  }
  return file.name || file.fileName || '文件'
}

const handleChoose = () => {
  if (props.disabled) return
  
  const count = props.maxCount - fileList.value.length
  if (count <= 0) return
  
  const chooseOptions = {
    count: props.multiple ? count : 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera']
  }
  
  if (props.accept === 'image') {
    uni.chooseImage({
      ...chooseOptions,
      success: (res) => {
        handleUploadSuccess(res.tempFilePaths)
      },
      fail: (err) => {
        emit('error', err)
      }
    })
  } else if (props.accept === 'video') {
    uni.chooseVideo({
      ...chooseOptions,
      success: (res) => {
        handleUploadSuccess([res.tempFilePath])
      },
      fail: (err) => {
        emit('error', err)
      }
    })
  } else {
    uni.chooseFile({
      count: chooseOptions.count,
      success: (res) => {
        handleUploadSuccess(res.tempFiles.map(f => f.path))
      },
      fail: (err) => {
        emit('error', err)
      }
    })
  }
}

const handleUploadSuccess = (files) => {
  const newFiles = files.map(file => ({
    url: file,
    path: file,
    tempFilePath: file
  }))
  
  const updatedList = [...fileList.value, ...newFiles]
  fileList.value = updatedList
  emit('change', updatedList)
}

const handleDelete = (index) => {
  const newList = fileList.value.filter((_, i) => i !== index)
  fileList.value = newList
  emit('delete', index)
  emit('change', newList)
}

const handlePreview = (file, index) => {
  if (isImage(file)) {
    const urls = fileList.value
      .filter(f => isImage(f))
      .map(f => getFileUrl(f))
    
    uni.previewImage({
      urls: urls,
      current: getFileUrl(file)
    })
  }
  emit('preview', file, index)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.form-upload {
  width: 100%;
  margin-bottom: $spacing-3;
}

.upload-label {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-1;
  font-size: $font-size-base;
  color: $gray-7;
  
  .required-mark {
    color: $danger-color;
    margin-left: $spacing-1;
  }
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.upload-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: $border-radius-base;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.upload-file {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $gray-1;
  border: 1rpx solid $gray-2;
  
  .file-icon {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-1;
  }
  
  .file-name {
    font-size: $font-size-xs;
    color: $gray-6;
    padding: 0 $spacing-1;
    @include ellipsis(1);
  }
}

.upload-delete {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $danger-color;
  color: $white;
  border-radius: 50%;
  z-index: 10;
  cursor: pointer;
  
  .delete-icon {
    font-size: $font-size-sm;
  }
}

.upload-add {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed $gray-3;
  border-radius: $border-radius-base;
  background: $gray-1;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
  }
  
  .add-icon {
    font-size: $font-size-3xl;
    color: $gray-5;
    margin-bottom: $spacing-1;
  }
  
  .add-text {
    font-size: $font-size-sm;
    color: $gray-5;
  }
}

.upload-error-message {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: $danger-color;
}
</style>
