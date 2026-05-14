<template>
  <view class="weather-detail">
    <weather-card :weather="weather" :show-details="true" />
    <weather-forecast :forecast-list="forecastList" />
    <view v-if="weather.airQuality" class="air-quality">
      <view class="quality-header">
        <text class="quality-title">空气质量</text>
        <text class="quality-level" :class="`level-${getQualityLevel(weather.airQuality.aqi)}`">
          {{ weather.airQuality.level }}
        </text>
      </view>
      <view class="quality-details">
        <view class="quality-item">
          <text class="quality-label">AQI</text>
          <text class="quality-value">{{ weather.airQuality.aqi }}</text>
        </view>
        <view v-if="weather.airQuality.pm25" class="quality-item">
          <text class="quality-label">PM2.5</text>
          <text class="quality-value">{{ weather.airQuality.pm25 }}</text>
        </view>
        <view v-if="weather.airQuality.pm10" class="quality-item">
          <text class="quality-label">PM10</text>
          <text class="quality-value">{{ weather.airQuality.pm10 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'
import WeatherCard from '../weather-card/index.vue'
import WeatherForecast from '../weather-forecast/index.vue'

const props = defineProps({
  weather: {
    type: Object,
    required: true
  },
  forecastList: {
    type: Array,
    default: () => []
  }
})

const getQualityLevel = (aqi) => {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  return 'hazardous'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.weather-detail {
  padding: $spacing-3;
}

.air-quality {
  background: $white;
  border-radius: $border-radius-base;
  padding: $spacing-3;
  margin-top: $spacing-2;
  box-shadow: $shadow-sm;
  
  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-3;
    
    .quality-title {
      font-size: $font-size-lg;
      font-weight: 500;
      color: $gray-8;
    }
    
    .quality-level {
      padding: $spacing-1 $spacing-2;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      
      &.level-good {
        background: rgba($success-color, 0.1);
        color: $success-color;
      }
      
      &.level-moderate {
        background: rgba($warning-color, 0.1);
        color: $warning-color;
      }
      
      &.level-unhealthy,
      &.level-hazardous {
        background: rgba($danger-color, 0.1);
        color: $danger-color;
      }
    }
  }
  
  .quality-details {
    display: flex;
    gap: $spacing-4;
    
    .quality-item {
      display: flex;
      flex-direction: column;
      
      .quality-label {
        font-size: $font-size-xs;
        color: $gray-5;
        margin-bottom: $spacing-1;
      }
      
      .quality-value {
        font-size: $font-size-lg;
        font-weight: 500;
        color: $gray-8;
      }
    }
  }
}
</style>
