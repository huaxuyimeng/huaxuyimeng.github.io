<template>
  <view 
    class="icon-button" 
    :class="[
      `icon-button-${size}`,
      {
        'icon-button-disabled': disabled,
        'icon-button-round': round
      }
    ]"
    :style="buttonStyle"
    @click="handleClick"
  >
    <text class="icon-button-icon">{{ icon }}</text>
    <text v-if="text" class="icon-button-text">{{ text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: '#333'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonStyle = computed(() => {
  return {
    color: props.color
  }
})

const handleClick = (e) => {
  if (props.disabled) {
    return
  }
  emit('click', e)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active:not(.icon-button-disabled) {
    opacity: 0.7;
    transform: scale(0.95);
  }
  
  &.icon-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.icon-button-round {
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
  }
}

.icon-button-small {
  padding: $spacing-1;
  font-size: $font-size-base;
  
  .icon-button-icon {
    font-size: $font-size-base;
  }
  
  .icon-button-text {
    font-size: $font-size-sm;
    margin-left: $spacing-1;
  }
}

.icon-button-medium {
  padding: $spacing-2;
  font-size: $font-size-lg;
  
  .icon-button-icon {
    font-size: $font-size-lg;
  }
  
  .icon-button-text {
    font-size: $font-size-base;
    margin-left: $spacing-2;
  }
}

.icon-button-large {
  padding: $spacing-3;
  font-size: $font-size-xl;
  
  .icon-button-icon {
    font-size: $font-size-xl;
  }
  
  .icon-button-text {
    font-size: $font-size-lg;
    margin-left: $spacing-2;
  }
}
</style>
