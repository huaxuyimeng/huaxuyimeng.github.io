<template>
  <view class="security-form">
    <view class="form-item">
      <text class="form-label">当前密码</text>
      <input 
        v-model="formData.oldPassword" 
        type="password"
        class="form-input"
        placeholder="请输入当前密码"
      />
    </view>
    <view class="form-item">
      <text class="form-label">新密码</text>
      <input 
        v-model="formData.newPassword" 
        type="password"
        class="form-input"
        placeholder="请输入新密码"
      />
    </view>
    <view class="form-item">
      <text class="form-label">确认新密码</text>
      <input 
        v-model="formData.confirmPassword" 
        type="password"
        class="form-input"
        placeholder="请再次输入新密码"
      />
    </view>
    <view class="form-actions">
      <base-button type="primary" block @click="handleSubmit">确认修改</base-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import BaseButton from '@/components/ui/button/base-button/index.vue'

const emit = defineEmits(['submit'])

const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (!formData.value.oldPassword) {
    uni.showToast({ title: '请输入当前密码', icon: 'none' })
    return
  }
  
  if (!formData.value.newPassword) {
    uni.showToast({ title: '请输入新密码', icon: 'none' })
    return
  }
  
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
    return
  }
  
  if (formData.value.newPassword.length < 6) {
    uni.showToast({ title: '密码长度至少6位', icon: 'none' })
    return
  }
  
  emit('submit', formData.value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.security-form {
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
  
  .form-input {
    width: 100%;
    padding: $spacing-2 $spacing-3;
    border: 1rpx solid $gray-3;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    background: $white;
    box-sizing: border-box;
  }
}

.form-actions {
  margin-top: $spacing-6;
}
</style>
