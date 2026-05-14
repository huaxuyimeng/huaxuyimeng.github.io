<template>
  <view class="user-card" @click="handleClick">
    <view class="card-background"></view>
    <view class="card-content">
      <image :src="user.avatar" class="user-avatar" mode="aspectFill" />
      <view class="user-info">
        <text class="user-name">{{ user.nickname || user.username }}</text>
        <text v-if="user.signature" class="user-signature">{{ user.signature }}</text>
      </view>
      <view v-if="showActions" class="user-actions">
        <slot name="actions"></slot>
      </view>
    </view>
    <view v-if="showStats" class="user-stats">
      <view class="stat-item" v-for="(stat, index) in stats" :key="index">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showStats: {
    type: Boolean,
    default: false
  },
  stats: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.user)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.user-card {
  position: relative;
  background: linear-gradient(135deg, $primary-color 0%, lighten($primary-color, 10%) 100%);
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $shadow-base;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
  }
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: url('data:image/svg+xml,...');
}

.card-content {
  position: relative;
  display: flex;
  align-items: center;
  padding: $spacing-4;
  color: $white;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: $spacing-3;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-size: $font-size-xl;
    font-weight: 500;
    margin-bottom: $spacing-1;
    color: $white;
  }
  
  .user-signature {
    font-size: $font-size-sm;
    opacity: 0.9;
    @include ellipsis(1);
  }
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding: $spacing-3;
  background: rgba(255, 255, 255, 0.1);
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-value {
      font-size: $font-size-lg;
      font-weight: 500;
      color: $white;
      margin-bottom: $spacing-1;
    }
    
    .stat-label {
      font-size: $font-size-xs;
      opacity: 0.8;
      color: $white;
    }
  }
}
</style>
