<template>
  <view class="city-selector" @click="handleClick">
    <text class="selector-icon">📍</text>
    <text class="selector-text">{{ currentCity || '选择城市' }}</text>
    <text class="selector-arrow">›</text>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentCity: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.city-selector {
  display: flex;
  align-items: center;
  padding: $spacing-2 $spacing-3;
  background: $white;
  border-radius: $border-radius-base;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    background: $gray-1;
  }
  
  .selector-icon {
    font-size: $font-size-base;
    margin-right: $spacing-2;
  }
  
  .selector-text {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-8;
  }
  
  .selector-arrow {
    font-size: $font-size-xl;
    color: $gray-4;
    transform: rotate(90deg);
  }
}
</style>
