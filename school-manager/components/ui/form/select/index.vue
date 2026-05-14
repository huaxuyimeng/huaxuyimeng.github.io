<template>
  <view class="form-select" @click="handleClick">
    <view v-if="label" class="select-label">
      <text>{{ label }}</text>
      <text v-if="required" class="required-mark">*</text>
    </view>
    <view class="select-input" :class="{ 'select-disabled': disabled, 'select-error': error }">
      <text v-if="displayText" class="select-value">{{ displayText }}</text>
      <text v-else class="select-placeholder">{{ placeholder }}</text>
      <text class="select-icon">›</text>
    </view>
    <picker
      v-if="!disabled"
      :mode="multiple ? 'multiSelector' : 'selector'"
      :range="options"
      :range-key="optionLabel"
      :value="pickerValue"
      @change="handlePickerChange"
    >
      <view class="picker-trigger"></view>
    </picker>
    <view v-if="error && errorMessage" class="select-error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
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

const pickerValue = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue)) return []
    return props.modelValue.map(val => {
      return props.options.findIndex(opt => opt[props.optionValue] === val)
    })
  } else {
    if (props.modelValue === null || props.modelValue === undefined) return 0
    return props.options.findIndex(opt => opt[props.optionValue] === props.modelValue)
  }
})

const displayText = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) return ''
    const selected = props.options.filter(opt => props.modelValue.includes(opt[props.optionValue]))
    return selected.map(opt => opt[props.optionLabel]).join(', ')
  } else {
    if (props.modelValue === null || props.modelValue === undefined) return ''
    const selected = props.options.find(opt => opt[props.optionValue] === props.modelValue)
    return selected ? selected[props.optionLabel] : ''
  }
})

const handleClick = () => {
  if (props.disabled) return
}

const handlePickerChange = (e) => {
  const index = e.detail.value
  let value = null
  
  if (props.multiple) {
    value = index.map(i => props.options[i][props.optionValue])
  } else {
    value = props.options[index][props.optionValue]
  }
  
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.form-select {
  width: 100%;
  margin-bottom: $spacing-3;
}

.select-label {
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

.select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-2 $spacing-3;
  background: $white;
  border: 1rpx solid $gray-3;
  border-radius: $border-radius-base;
  min-height: 80rpx;
  transition: all $transition-duration $transition-timing;
  
  &:active:not(.select-disabled) {
    border-color: $primary-color;
  }
  
  &.select-error {
    border-color: $danger-color;
  }
  
  &.select-disabled {
    background: $gray-1;
    opacity: 0.6;
  }
}

.select-value {
  flex: 1;
  font-size: $font-size-base;
  color: $gray-8;
}

.select-placeholder {
  flex: 1;
  font-size: $font-size-base;
  color: $gray-4;
}

.select-icon {
  font-size: $font-size-xl;
  color: $gray-4;
  transform: rotate(90deg);
}

.picker-trigger {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}

.select-error-message {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: $danger-color;
}
</style>
