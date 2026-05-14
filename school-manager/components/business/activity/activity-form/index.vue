<template>
  <view class="activity-form">
    <view class="form-item">
      <text class="form-label">活动标题 *</text>
      <input 
        v-model="formData.title" 
        class="form-input"
        placeholder="请输入活动标题"
      />
    </view>
    <view class="form-item">
      <text class="form-label">活动描述</text>
      <textarea 
        v-model="formData.description" 
        class="form-textarea"
        placeholder="请输入活动描述"
        :maxlength="500"
      />
    </view>
    <view class="form-item">
      <text class="form-label">活动封面</text>
      <upload 
        v-model="formData.cover"
        :max-count="1"
        accept="image"
      />
    </view>
    <view class="form-item">
      <text class="form-label">开始时间 *</text>
      <date-picker 
        v-model="formData.startTime"
        type="datetime"
        placeholder="请选择开始时间"
      />
    </view>
    <view class="form-item">
      <text class="form-label">结束时间 *</text>
      <date-picker 
        v-model="formData.endTime"
        type="datetime"
        placeholder="请选择结束时间"
      />
    </view>
    <view class="form-item">
      <text class="form-label">活动地点 *</text>
      <input 
        v-model="formData.location" 
        class="form-input"
        placeholder="请输入活动地点"
      />
    </view>
    <view class="form-item">
      <text class="form-label">最大参与人数</text>
      <input 
        v-model.number="formData.maxParticipants" 
        class="form-input"
        type="number"
        placeholder="不限制请留空"
      />
    </view>
    <view class="form-actions">
      <base-button type="default" @click="handleCancel">取消</base-button>
      <base-button type="primary" @click="handleSubmit">提交</base-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'
import DatePicker from '@/components/ui/form/date-picker/index.vue'
import Upload from '@/components/ui/form/upload/index.vue'
import BaseButton from '@/components/ui/button/base-button/index.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  title: props.initialData.title || '',
  description: props.initialData.description || '',
  cover: props.initialData.cover || [],
  startTime: props.initialData.startTime || '',
  endTime: props.initialData.endTime || '',
  location: props.initialData.location || '',
  maxParticipants: props.initialData.maxParticipants || null
})

const handleSubmit = () => {
  emit('submit', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.activity-form {
  padding: $spacing-3;
  background: $white;
}

.form-item {
  margin-bottom: $spacing-4;
  
  .form-label {
    display: block;
    font-size: $font-size-base;
    color: $gray-7;
    margin-bottom: $spacing-1;
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
    padding: $spacing-2 $spacing-3;
    border: 1rpx solid $gray-3;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    background: $white;
    box-sizing: border-box;
  }
  
  .form-textarea {
    min-height: 200rpx;
    resize: none;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-2;
  margin-top: $spacing-6;
  
  .base-button {
    flex: 1;
  }
}
</style>
