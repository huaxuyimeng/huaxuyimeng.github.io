<template>
  <view class="search-bar">
    <view class="search-input-wrapper">
      <text class="search-icon">🔍</text>
      <input 
        v-model="searchValue"
        class="search-input"
        placeholder="搜索..."
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
      />
      <view v-if="searchValue" class="search-clear" @click="handleClear">
        <text>✕</text>
      </view>
    </view>
    <view v-if="showCancel" class="search-cancel" @click="handleCancel">
      <text>取消</text>
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
  placeholder: {
    type: String,
    default: '搜索...'
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'confirm', 'cancel', 'clear'])

const searchValue = ref(props.modelValue)

const handleInput = (e) => {
  searchValue.value = e.detail.value
  emit('update:modelValue', searchValue.value)
  emit('input', searchValue.value)
}

const handleFocus = (e) => {
  emit('focus', e)
}

const handleBlur = (e) => {
  emit('blur', e)
}

const handleConfirm = () => {
  emit('confirm', searchValue.value)
}

const handleClear = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.search-bar {
  display: flex;
  align-items: center;
  padding: $spacing-2 $spacing-3;
  background: $white;
  border-bottom: 1rpx solid $gray-2;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  padding: $spacing-1 $spacing-3;
  background: $gray-1;
  border-radius: $border-radius-full;
  
  .search-icon {
    font-size: $font-size-base;
    color: $gray-5;
    margin-right: $spacing-2;
  }
  
  .search-input {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-8;
    background: transparent;
    border: none;
    outline: none;
  }
  
  .search-clear {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    text {
      font-size: $font-size-sm;
      color: $gray-5;
    }
  }
}

.search-cancel {
  margin-left: $spacing-2;
  padding: $spacing-1 $spacing-2;
  font-size: $font-size-base;
  color: $primary-color;
  cursor: pointer;
}
</style>
