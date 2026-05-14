<template>
  <view 
    class="app-header" 
    :class="[
      {
        'header-fixed': fixed,
        'header-transparent': transparent
      }
    ]"
    :style="headerStyle"
  >
    <view class="header-content">
      <view class="header-left" @click="handleLeftClick">
        <slot name="left">
          <text v-if="showBack" class="header-back">‹</text>
          <text v-if="leftIcon" class="header-icon">{{ leftIcon }}</text>
        </slot>
      </view>
      <view class="header-center">
        <slot>
          <text class="header-title">{{ title }}</text>
        </slot>
      </view>
      <view class="header-right" @click="handleRightClick">
        <slot name="right">
          <text v-if="rightIcon" class="header-icon">{{ rightIcon }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  fixed: {
    type: Boolean,
    default: true
  },
  transparent: {
    type: Boolean,
    default: false
  },
  showBack: {
    type: Boolean,
    default: true
  },
  leftIcon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: '#fff'
  },
  color: {
    type: String,
    default: '#333'
  }
})

const emit = defineEmits(['left-click', 'right-click'])

const headerStyle = computed(() => {
  return {
    backgroundColor: props.transparent ? 'transparent' : props.backgroundColor,
    color: props.color
  }
})

const handleLeftClick = () => {
  if (props.showBack) {
    uni.navigateBack()
  }
  emit('left-click')
}

const handleRightClick = () => {
  emit('right-click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-header {
  width: 100%;
  background: $white;
  border-bottom: 1rpx solid $gray-2;
  
  &.header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  
  &.header-transparent {
    background: transparent;
    border-bottom: none;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 $spacing-3;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  min-width: 80rpx;
  height: 100%;
  cursor: pointer;
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header-title {
  font-size: $font-size-lg;
  font-weight: 500;
  color: inherit;
}

.header-back {
  font-size: $font-size-3xl;
  font-weight: 300;
  color: inherit;
  line-height: 1;
}

.header-icon {
  font-size: $font-size-xl;
  color: inherit;
}
</style>
