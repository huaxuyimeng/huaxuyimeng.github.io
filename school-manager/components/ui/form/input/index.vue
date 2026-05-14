<template>
  <view class="form-input" :class="[`input-${size}`, { 'input-error': error, 'input-disabled': disabled }]">
    <view v-if="label" class="input-label">
      <text>{{ label }}</text>
      <text v-if="required" class="required-mark">*</text>
    </view>
    <view class="input-wrapper">
      <view v-if="prefixIcon" class="input-prefix">
        <text class="prefix-icon">{{ prefixIcon }}</text>
      </view>
      <input
        class="input-field"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :password="type === 'password' && !showPassword"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <view v-if="clearable && modelValue && !disabled" class="input-suffix" @click="handleClear">
        <text class="suffix-icon">✕</text>
      </view>
      <view v-else-if="suffixIcon" class="input-suffix">
        <text class="suffix-icon">{{ suffixIcon }}</text>
      </view>
      <view v-else-if="type === 'password'" class="input-suffix" @click="togglePassword">
        <text class="suffix-icon">{{ showPassword ? '👁' : '👁‍🗨' }}</text>
      </view>
    </view>
    <view v-if="error && errorMessage" class="input-error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number', 'password', 'textarea'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: -1
  },
  clearable: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
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
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'clear'])

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return 'text'
  }
  return props.type
})

const handleInput = (e) => {
  emit('update:modelValue', e.detail.value)
  emit('input', e.detail.value)
}

const handleFocus = (e) => {
  emit('focus', e)
}

const handleBlur = (e) => {
  emit('blur', e)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.form-input {
  width: 100%;
  margin-bottom: $spacing-3;
}

.input-label {
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

.input-wrapper {
  display: flex;
  align-items: center;
  background: $white;
  border: 1rpx solid $gray-3;
  border-radius: $border-radius-base;
  transition: all $transition-duration $transition-timing;
  
  &:focus-within {
    border-color: $primary-color;
  }
  
  .input-error & {
    border-color: $danger-color;
  }
  
  .input-disabled & {
    background: $gray-1;
    opacity: 0.6;
  }
}

.input-field {
  flex: 1;
  padding: $spacing-2 $spacing-3;
  font-size: $font-size-base;
  color: $gray-8;
  background: transparent;
  border: none;
  outline: none;
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  padding: 0 $spacing-2;
  color: $gray-5;
  
  .prefix-icon,
  .suffix-icon {
    font-size: $font-size-lg;
  }
}

.input-suffix {
  cursor: pointer;
}

.input-error-message {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: $danger-color;
}

.input-small {
  .input-field {
    padding: $spacing-1 $spacing-2;
    font-size: $font-size-sm;
  }
}

.input-large {
  .input-field {
    padding: $spacing-3 $spacing-4;
    font-size: $font-size-lg;
  }
}
</style>
