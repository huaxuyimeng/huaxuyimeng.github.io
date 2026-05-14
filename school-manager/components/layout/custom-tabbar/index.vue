<template>
  <view class="custom-tabbar" :style="{ backgroundColor: theme.backgroundColor }">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ 'active': item.pagePath === currentPage }"
      @click="switchTab(item)"
    >
      <view class="tab-icon">
        <tabbar-icon :type="item.type" :is-active="item.pagePath === currentPage" />
      </view>
      <text 
        class="tab-text"
        :style="{ color: item.pagePath === currentPage ? theme.activeColor : theme.inactiveColor }"
      >
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TabbarIcon from '@/components/common/tabbar-icon/index.vue'

// 获取当前页面路径
const currentPage = ref('')
const router = getCurrentPages()

// 监听路由变化
const updateCurrentPage = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentRoute = pages[pages.length - 1].route
    // 移除开头的"/"以匹配配置的路径
    currentPage.value = currentRoute.startsWith('/') ? currentRoute.substring(1) : currentRoute
  }
}

// 监听路由变化
onMounted(() => {
  updateCurrentPage()
  // 监听路由变化
  uni.$on('route-change', updateCurrentPage)
})

// 底部导航栏配置
const tabList = ref([
  {
    pagePath: 'pages/tabbar/index/index',
    type: 'home',
    text: '首页'
  },
  {
    pagePath: 'pages/tabbar/function/index',
    type: 'function',
    text: '功能'
  },
  {
    pagePath: 'pages/tabbar/activity/index',
    type: 'activity',
    text: '活动'
  },
  {
    pagePath: 'pages/tabbar/news/index',
    type: 'news',
    text: '资讯'
  },
  {
    pagePath: 'pages/tabbar/profile/index',
    type: 'profile',
    text: '我的'
  }
])

// 主题配置
const theme = computed(() => {
  const currentTheme = uni.getStorageSync('theme') || 'light'
  if (currentTheme === 'dark') {
    return {
      backgroundColor: '#1C1C1E',
      activeColor: '#0A84FF',
      inactiveColor: '#A3A3A3'
    }
  } else {
    return {
      backgroundColor: '#FFFFFF',
      activeColor: '#007AFF',
      inactiveColor: '#8E8E93'
    }
  }
})

// 切换标签页
const switchTab = (item) => {
  if (currentPage.value === item.pagePath) return
  
  try {
    uni.switchTab({
      url: '/' + item.pagePath
    })
  } catch (error) {
    // 如果switchTab失败，尝试reLaunch到目标页面
    uni.reLaunch({
      url: '/' + item.pagePath
    })
  }
}

// 组件卸载时移除监听器
onUnmounted(() => {
  uni.$off('route-change', updateCurrentPage)
})
</script>

<style lang="scss" scoped>
.custom-tabbar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 120rpx;
  padding: 16rpx 0 8rpx;
  background: linear-gradient(180deg, var(--tabbar-top-color, #FFFFFF) 0%, var(--tabbar-bottom-color, #F8F9FA) 100%);
  border-top: 1rpx solid var(--tabbar-border-color, #E5E5E5);
  position: relative;
  z-index: 100;
  box-sizing: border-box;
  
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    padding: 8rpx 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    // 活跃状态指示器
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 60%;
      height: 4rpx;
      background: transparent;
      border-radius: 2rpx;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    &.active {
      &::after {
        background: var(--tabbar-active-color, #007AFF);
      }
      
      .tab-icon {
        transform: scale(1.15);
      }
      
      .tab-text {
        font-weight: 600;
        transform: scale(1.05);
      }
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    .tab-icon {
      width: 52rpx;
      height: 52rpx;
      margin-bottom: 6rpx;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 2;
    }
    
    .tab-text {
      font-size: 24rpx;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 2;
      
      &.active {
        font-weight: 600;
      }
    }
  }
  
  // 深色模式样式
  &.dark-mode {
    background: linear-gradient(180deg, var(--tabbar-top-color, #1C1C1E) 0%, var(--tabbar-bottom-color, #121212) 100%);
    border-top: 1rpx solid var(--tabbar-border-color, #404040);
  }
}

// 添加动画效果
@keyframes tabActive {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.tab-item {
  &.animate {
    animation: tabActive 0.3s ease;
  }
}
</style>