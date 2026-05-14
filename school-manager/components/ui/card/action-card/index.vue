<template>
  <view class="action-card" @click="handleClick">
    <view class="card-cover" v-if="cover">
      <image :src="cover" mode="aspectFill" class="cover-image" />
      <view v-if="badge" class="card-badge">
        <text>{{ badge }}</text>
      </view>
    </view>
    <view class="card-content">
      <text class="card-title">{{ title }}</text>
      <text v-if="description" class="card-description">{{ description }}</text>
      <view v-if="tags && tags.length" class="card-tags">
        <text 
          v-for="(tag, index) in tags" 
          :key="index"
          class="tag-item"
        >
          {{ tag }}
        </text>
      </view>
      <view v-if="showActions" class="card-actions">
        <slot name="actions"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  badge: {
    type: [String, Number],
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.action-card {
  background: $white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-base;
  }
}

.card-cover {
  position: relative;
  width: 100%;
  height: 300rpx;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
  
  .card-badge {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    padding: $spacing-1 $spacing-2;
    background: $danger-color;
    color: $white;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
  }
}

.card-content {
  padding: $spacing-3;
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
    margin-bottom: $spacing-1;
    display: block;
  }
  
  .card-description {
    font-size: $font-size-sm;
    color: $gray-5;
    line-height: 1.6;
    margin-bottom: $spacing-2;
    display: block;
    @include ellipsis(2);
  }
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-1;
    margin-bottom: $spacing-2;
    
    .tag-item {
      padding: $spacing-1 $spacing-2;
      background: $gray-2;
      color: $gray-6;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
    }
  }
  
  .card-actions {
    margin-top: $spacing-2;
    padding-top: $spacing-2;
    border-top: 1rpx solid $gray-2;
  }
}
</style>
