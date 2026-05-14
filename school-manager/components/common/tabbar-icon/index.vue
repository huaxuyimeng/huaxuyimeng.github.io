<template>
  <view class="tabbar-icon">
    <view class="icon-svg" :class="{ active: isActive }">
      <!-- 首页图标 -->
      <view v-if="type === 'home'" class="icon-home">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 22V12H15V22" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      
      <!-- 功能图标 -->
      <view v-if="type === 'function'" class="icon-function">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="14" y="3" width="7" height="7" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="3" y="14" width="7" height="7" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="14" y="14" width="7" height="7" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      
      <!-- 活动图标 -->
      <view v-if="type === 'activity'" class="icon-activity">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      
      <!-- 资讯图标 -->
      <view v-if="type === 'news'" class="icon-news">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2H8C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22H4Z" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6H18" :stroke="iconColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 10H18" :stroke="iconColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 14H14" :stroke="iconColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </view>
      
      <!-- 我的图标 -->
      <view v-if="type === 'profile'" class="icon-profile">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" :stroke="iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['home', 'function', 'activity', 'news', 'profile'].includes(value)
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const iconColor = computed(() => {
  return props.isActive ? '#667EEA' : '#8E8E93'
})
</script>

<style lang="scss" scoped>
.tabbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon-svg {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.active {
      transform: scale(1.1);
    }
    
    svg {
      width: 100%;
      height: 100%;
    }
    
    .icon-home,
    .icon-function,
    .icon-activity,
    .icon-news,
    .icon-profile {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
