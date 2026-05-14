<template>
  <view class="weather-card" @click="handleClick">
    <view class="card-header">
      <text class="city-name">{{ weather.city }}</text>
      <text class="update-time">{{ formatTime(weather.updateTime) }}</text>
    </view>
    <view class="card-body">
      <view class="weather-main">
        <text class="temperature">{{ weather.temperature }}°</text>
        <view class="weather-info">
          <text class="condition">{{ weather.condition }}</text>
          <text class="wind">{{ weather.windDirection }} {{ weather.windSpeed }}级</text>
        </view>
      </view>
      <view v-if="showDetails" class="weather-details">
        <view class="detail-item">
          <text class="detail-label">湿度</text>
          <text class="detail-value">{{ weather.humidity }}%</text>
        </view>
        <view v-if="weather.airQuality" class="detail-item">
          <text class="detail-label">空气质量</text>
          <text class="detail-value">{{ weather.airQuality.level }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const formatTime = (time) => {
  return formatDateTime(time, 'HH:mm')
}

const props = defineProps({
  weather: {
    type: Object,
    required: true
  },
  showDetails: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.weather)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $border-radius-lg;
  padding: $spacing-4;
  color: $white;
  box-shadow: $shadow-base;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-3;
  
  .city-name {
    font-size: $font-size-lg;
    font-weight: 500;
  }
  
  .update-time {
    font-size: $font-size-xs;
    opacity: 0.8;
  }
}

.card-body {
  .weather-main {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-3;
    
    .temperature {
      font-size: 80rpx;
      font-weight: 300;
      margin-right: $spacing-3;
    }
    
    .weather-info {
      display: flex;
      flex-direction: column;
      
      .condition {
        font-size: $font-size-lg;
        margin-bottom: $spacing-1;
      }
      
      .wind {
        font-size: $font-size-sm;
        opacity: 0.9;
      }
    }
  }
  
  .weather-details {
    display: flex;
    gap: $spacing-4;
    padding-top: $spacing-3;
    border-top: 1rpx solid rgba(255, 255, 255, 0.3);
    
    .detail-item {
      display: flex;
      flex-direction: column;
      
      .detail-label {
        font-size: $font-size-xs;
        opacity: 0.8;
        margin-bottom: $spacing-1;
      }
      
      .detail-value {
        font-size: $font-size-base;
        font-weight: 500;
      }
    }
  }
}
</style>
