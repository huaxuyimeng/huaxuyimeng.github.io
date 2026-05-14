<template>
  <view 
    class="base-card" 
    :class="[
      {
        'card-shadow': shadow,
        'card-border': border,
        'card-no-padding': !padding
      }
    ]"
  >
    <view v-if="cover" class="card-cover">
      <image :src="cover" mode="aspectFill" class="cover-image" />
    </view>
    <view v-if="title || subtitle || $slots.header" class="card-header">
      <slot name="header">
        <text v-if="title" class="card-title">{{ title }}</text>
        <text v-if="subtitle" class="card-subtitle">{{ subtitle }}</text>
      </slot>
    </view>
    <view class="card-body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  shadow: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.base-card {
  background: $white;
  border-radius: $border-radius-base;
  overflow: hidden;
  
  &.card-shadow {
    box-shadow: $shadow-sm;
  }
  
  &.card-border {
    border: 1rpx solid $gray-2;
  }
  
  &.card-no-padding {
    .card-header,
    .card-body,
    .card-footer {
      padding: 0;
    }
  }
}

.card-cover {
  width: 100%;
  height: 400rpx;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
}

.card-header {
  padding: $spacing-3;
  border-bottom: 1rpx solid $gray-2;
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
    display: block;
    margin-bottom: $spacing-1;
  }
  
  .card-subtitle {
    font-size: $font-size-sm;
    color: $gray-5;
    display: block;
  }
}

.card-body {
  padding: $spacing-3;
}

.card-footer {
  padding: $spacing-3;
  border-top: 1rpx solid $gray-2;
}
</style>
