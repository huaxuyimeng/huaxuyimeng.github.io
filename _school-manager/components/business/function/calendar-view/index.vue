<template>
  <view class="calendar-view">
    <view class="calendar-header">
      <view class="header-nav" @click="handlePrevMonth">
        <text>‹</text>
      </view>
      <text class="header-title">{{ currentMonthText }}</text>
      <view class="header-nav" @click="handleNextMonth">
        <text>›</text>
      </view>
    </view>
    <view class="calendar-weekdays">
      <text 
        v-for="(day, index) in weekdays" 
        :key="index"
        class="weekday"
      >
        {{ day }}
      </text>
    </view>
    <view class="calendar-days">
      <view 
        v-for="(day, index) in days" 
        :key="index"
        class="day-item"
        :class="[
          {
            'day-other-month': day.otherMonth,
            'day-today': day.isToday,
            'day-selected': day.isSelected,
            'day-disabled': day.disabled
          }
        ]"
        @click="handleDayClick(day)"
      >
        <text class="day-number">{{ day.date }}</text>
        <view v-if="day.hasEvent" class="day-dot"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { formatDateTime } from '@/utils/date.js'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  minDate: {
    type: [String, Date],
    default: null
  },
  maxDate: {
    type: [String, Date],
    default: null
  },
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const currentDate = ref(new Date())
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null)

const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

const isTomorrow = (date) => {
  if (!date) return false
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.getDate() === tomorrow.getDate() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getFullYear() === tomorrow.getFullYear()
}

const formatDate = (date) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  
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

const currentMonthText = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const days = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayWeek = firstDay.getDay()
  const lastDate = lastDay.getDate()
  
  const daysList = []
  
  // 上个月的日期
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    daysList.push({
      date: prevMonthLastDay - i,
      otherMonth: true,
      fullDate: new Date(year, month - 1, prevMonthLastDay - i)
    })
  }
  
  // 当前月的日期
  const today = new Date()
  for (let i = 1; i <= lastDate; i++) {
    const fullDate = new Date(year, month, i)
    const dateStr = formatDateTime(fullDate, 'YYYY-MM-DD')
    daysList.push({
      date: i,
      otherMonth: false,
      fullDate: fullDate,
      isToday: fullDate.toDateString() === today.toDateString(),
      isSelected: selectedDate.value && fullDate.toDateString() === selectedDate.value.toDateString(),
      hasEvent: props.events.some(e => e.date === dateStr),
      disabled: isDateDisabled(fullDate)
    })
  }
  
  // 下个月的日期
  const remainingDays = 42 - daysList.length
  for (let i = 1; i <= remainingDays; i++) {
    daysList.push({
      date: i,
      otherMonth: true,
      fullDate: new Date(year, month + 1, i)
    })
  }
  
  return daysList
})

const isDateDisabled = (date) => {
  if (props.minDate && date < new Date(props.minDate)) return true
  if (props.maxDate && date > new Date(props.maxDate)) return true
  return false
}

const handlePrevMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const handleNextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

const handleDayClick = (day) => {
  if (day.disabled || day.otherMonth) return
  
  selectedDate.value = day.fullDate
  emit('update:modelValue', formatDateTime(day.fullDate, 'YYYY-MM-DD'))
  emit('change', day.fullDate)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.calendar-view {
  background: $white;
  border-radius: $border-radius-base;
  padding: $spacing-3;
  box-shadow: $shadow-sm;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-3;
  
  .header-nav {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    text {
      font-size: $font-size-xl;
      color: $gray-6;
    }
  }
  
  .header-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $gray-8;
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: $spacing-2;
  
  .weekday {
    text-align: center;
    font-size: $font-size-sm;
    color: $gray-5;
    padding: $spacing-1;
  }
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: $spacing-1;
}

.day-item {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-sm;
  cursor: pointer;
  position: relative;
  transition: all $transition-duration $transition-timing;
  
  .day-number {
    font-size: $font-size-base;
    color: $gray-7;
  }
  
  .day-dot {
    position: absolute;
    bottom: 8rpx;
    width: 8rpx;
    height: 8rpx;
    background: $primary-color;
    border-radius: 50%;
  }
  
  &.day-other-month {
    .day-number {
      color: $gray-3;
    }
  }
  
  &.day-today {
    background: rgba($primary-color, 0.1);
    
    .day-number {
      color: $primary-color;
      font-weight: 500;
    }
  }
  
  &.day-selected {
    background: $primary-color;
    
    .day-number {
      color: $white;
      font-weight: 500;
    }
    
    .day-dot {
      background: $white;
    }
  }
  
  &.day-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &:active:not(.day-disabled) {
    transform: scale(0.95);
  }
}
</style>
