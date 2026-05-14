<template>
  <view class="weather-forecast">
    <view class="forecast-header">
      <text class="header-title">天气预报</text>
    </view>
    <scroll-view class="forecast-list" scroll-x>
      <view 
        v-for="(item, index) in forecastList" 
        :key="index"
        class="forecast-item"
      >
        <text class="forecast-date">{{ formatDate(item.date) }}</text>
        <text class="forecast-icon">{{ getWeatherIcon(item.condition) }}</text>
        <text class="forecast-temp">{{ item.low }}° / {{ item.high }}°</text>
        <text class="forecast-wind">{{ item.windDirection }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const props = defineProps({
  forecastList: {
    type: Array,
    default: () => []
  }
})

const formatDate = (date) => {
  const d = new Date(date)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekday = weekdays[d.getDay()]
  
  if (isToday(d)) {
    return '今天'
  } else if (isTomorrow(d)) {
    return '明天'
  }
  return `${month}/${day} 周${weekday}`
}

const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

const isTomorrow = (date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.getDate() === tomorrow.getDate() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getFullYear() === tomorrow.getFullYear()
}

const getWeatherIcon = (condition) => {
  const iconMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '雨': '🌧️',
    '雪': '❄️',
    '雾': '🌫️'
  }
  return iconMap[condition] || '🌤️'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.weather-forecast {
  background: $white;
  border-radius: $border-radius-base;
  padding: $spacing-3;
  margin-bottom: $spacing-2;
  box-shadow: $shadow-sm;
}

.forecast-header {
  margin-bottom: $spacing-3;
  
  .header-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.forecast-list {
  white-space: nowrap;
}

.forecast-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-2;
  margin-right: $spacing-3;
  min-width: 120rpx;
  
  .forecast-date {
    font-size: $font-size-xs;
    color: $gray-6;
    margin-bottom: $spacing-1;
  }
  
  .forecast-icon {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-1;
  }
  
  .forecast-temp {
    font-size: $font-size-sm;
    color: $gray-7;
    margin-bottom: $spacing-1;
  }
  
  .forecast-wind {
    font-size: $font-size-xs;
    color: $gray-5;
  }
}
</style>
