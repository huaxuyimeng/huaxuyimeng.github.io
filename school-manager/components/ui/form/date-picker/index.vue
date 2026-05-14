<template>
  <view class="date-picker" @click="handleClick">
    <view v-if="label" class="picker-label">
      <text>{{ label }}</text>
      <text v-if="required" class="required-mark">*</text>
    </view>
    <view class="picker-input" :class="{ 'picker-disabled': disabled, 'picker-error': error }">
      <text v-if="displayValue" class="picker-value">{{ displayValue }}</text>
      <text v-else class="picker-placeholder">{{ placeholder }}</text>
      <text class="picker-icon">📅</text>
    </view>
    <picker
      v-if="!disabled"
      :mode="pickerMode"
      :value="pickerValue"
      :start="minDate"
      :end="maxDate"
      :fields="fields"
      @change="handlePickerChange"
    >
      <view class="picker-trigger"></view>
    </picker>
    <view v-if="error && errorMessage" class="picker-error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  },
  type: {
    type: String,
    default: 'date',
    validator: (value) => ['date', 'datetime', 'time', 'year-month'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择日期'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  minDate: {
    type: String,
    default: ''
  },
  maxDate: {
    type: String,
    default: ''
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

const emit = defineEmits(['update:modelValue', 'change'])

const pickerMode = computed(() => {
  const modeMap = {
    'date': 'date',
    'datetime': 'multiSelector',
    'time': 'time',
    'year-month': 'date'
  }
  return modeMap[props.type] || 'date'
})

const fields = computed(() => {
  if (props.type === 'year-month') {
    return 'month'
  }
  return 'day'
})

const pickerValue = computed(() => {
  if (!props.modelValue) return 0
  const date = new Date(props.modelValue)
  return date.getTime()
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue)
  if (props.type === 'date') {
    return formatDateTime(date, 'YYYY-MM-DD')
  } else if (props.type === 'datetime') {
    return formatDateTime(date, 'YYYY-MM-DD HH:mm')
  } else if (props.type === 'time') {
    return formatDateTime(date, 'HH:mm')
  } else if (props.type === 'year-month') {
    return formatDateTime(date, 'YYYY-MM')
  }
  return formatDateTime(date)
})

const handleClick = () => {
  if (props.disabled) return
}

const handlePickerChange = (e) => {
  const value = e.detail.value
  let dateValue = ''
  
  if (props.type === 'date' || props.type === 'year-month') {
    dateValue = value
  } else if (props.type === 'datetime') {
    // 处理多列选择器
    dateValue = `${value[0]} ${value[1]}`
  } else if (props.type === 'time') {
    dateValue = value
  }
  
  emit('update:modelValue', dateValue)
  emit('change', dateValue)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.date-picker {
  width: 100%;
  margin-bottom: $spacing-3;
}

.picker-label {
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

.picker-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-2 $spacing-3;
  background: $white;
  border: 1rpx solid $gray-3;
  border-radius: $border-radius-base;
  min-height: 80rpx;
  transition: all $transition-duration $transition-timing;
  
  &:active:not(.picker-disabled) {
    border-color: $primary-color;
  }
  
  &.picker-error {
    border-color: $danger-color;
  }
  
  &.picker-disabled {
    background: $gray-1;
    opacity: 0.6;
  }
}

.picker-value {
  flex: 1;
  font-size: $font-size-base;
  color: $gray-8;
}

.picker-placeholder {
  flex: 1;
  font-size: $font-size-base;
  color: $gray-4;
}

.picker-icon {
  font-size: $font-size-lg;
  color: $gray-5;
}

.picker-trigger {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}

.picker-error-message {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: $danger-color;
}
</style>
