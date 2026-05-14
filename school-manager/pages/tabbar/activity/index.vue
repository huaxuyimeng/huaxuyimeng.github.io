<!--
 * 文件路径: pages/tabbar/activity/index.vue
 * 功能说明: 活动列表页面
 * 主要功能:
 *   1. 显示校园活动列表
 *   2. 活动分类筛选
 *   3. 搜索活动
 *   4. 排序和筛选功能
 *   5. 推荐活动展示
 *   6. 下拉刷新、上拉加载更多
 * 数据来源: API接口或本地存储
 * 相关页面: pages/tabbar/activity/subpages/detail/index.vue (活动详情)
 -->
<template>
  <view class="activity-container">
    <!-- 头部区域 -->
    <view class="activity-header">
      <view class="header-title">校园活动</view>
      <view class="header-actions">
        <view class="header-icon" @click="toggleSearch">
          <text class="iconfont">🔍</text>
        </view>
        <view class="header-icon" @click="showSortModal = true">
          <text class="iconfont">排序</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="showSearch" class="search-bar">
      <view class="search-input-wrapper">
        <text class="iconfont">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索活动..." 
          v-model="searchKeyword"
          @confirm="handleSearch"
          :focus="showSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
      </view>
      <view class="search-cancel" @click="cancelSearch">取消</view>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-tabs" scroll-x>
      <view 
        class="tab-item" 
        :class="{ active: currentCategory === item.value }"
        v-for="item in categories" 
        :key="item.value"
        @click="handleCategoryChange(item.value)"
      >
        {{ item.label }}
      </view>
    </scroll-view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @click="showFilterModal = true">
        <text>筛选</text>
        <text class="iconfont">⚙️</text>
      </view>
      <view class="filter-item" @click="showSortModal = true">
        <text>{{ getSortLabel() }}</text>
        <text class="iconfont">▼</text>
      </view>
    </view>

    <!-- 活动列表 -->
    <scroll-view 
      class="activity-list-scroll"
      scroll-y
      @scrolltolower="handleLoadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
    >
      <!-- 推荐活动 -->
      <view v-if="recommendedActivities.length > 0" class="recommend-section">
        <view class="section-title">推荐活动</view>
        <scroll-view class="recommend-scroll" scroll-x>
          <view 
            v-for="item in recommendedActivities" 
            :key="item.id"
            class="recommend-item"
            @click="goToDetail(item.id)"
          >
            <image class="recommend-img" :src="item.cover" mode="aspectFill" />
            <view class="recommend-info">
              <view class="recommend-title">{{ item.title }}</view>
              <view class="recommend-time">{{ formatTime(item.startTime) }}</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 活动列表 -->
      <view class="activity-list">
        <view 
          v-for="item in activityList" 
          :key="item.id"
          class="activity-item"
          @click="goToDetail(item.id)"
        >
          <!-- 活动封面 -->
          <view class="activity-cover">
            <image class="cover-img" :src="item.cover" mode="aspectFill" />
            <view v-if="item.status === 'upcoming'" class="status-tag upcoming">即将开始</view>
            <view v-else-if="item.status === 'ongoing'" class="status-tag ongoing">进行中</view>
            <view v-if="item.isFree" class="free-tag">免费</view>
          </view>

          <!-- 活动信息 -->
          <view class="activity-info">
            <view class="info-header">
              <view class="activity-category">{{ getCategoryLabel(item.category) }}</view>
              <view class="activity-title">{{ item.title }}</view>
            </view>

            <view class="info-detail">
              <view class="detail-item">
                <text class="iconfont">⏰</text>
                <text>{{ formatTime(item.startTime) }}</text>
              </view>
              <view class="detail-item">
                <text class="iconfont">📍</text>
                <text>{{ item.location }}</text>
              </view>
            </view>

            <view class="info-footer">
              <view class="price-section">
                <text v-if="item.price === 0" class="price-free">免费</text>
                <text v-else class="price-normal">¥{{ item.price }}</text>
              </view>
              <view class="action-section">
                <view 
                  class="action-btn favorite-btn" 
                  :class="{ active: item.isFavorite }"
                  @click.stop="toggleFavorite(item)"
                >
                  <text v-if="item.isFavorite" class="iconfont">❤️</text>
                  <text v-else class="iconfont">🤍</text>
                </view>
                <view class="action-btn share-btn" @click.stop="handleShare(item)">
                  <text class="iconfont">↗️</text>
                </view>
              </view>
            </view>

            <!-- 组织者信息 -->
            <view class="organizer-info">
              <image class="organizer-avatar" :src="item.organizerAvatar" />
              <text class="organizer-name">{{ item.organizerName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 没有更多 -->
      <view v-if="!hasMore && activityList.length > 0" class="no-more">
        <text>— 没有更多了 —</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && activityList.length === 0" class="empty-state">
        <image class="empty-img" src="/static/images/empty.png" />
        <text class="empty-text">暂无活动</text>
        <view class="empty-btn" @click="handleCreate">发布活动</view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view class="action-btn" @click="goToMyActivities">我的活动</view>
      <view class="action-btn primary" @click="handleCreate">发布活动</view>
    </view>

    <!-- 排序弹窗 -->
    <view v-if="showSortModal" class="modal-overlay" @click="showSortModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text>排序方式</text>
          <text class="modal-close" @click="showSortModal = false">×</text>
        </view>
        <view class="modal-body">
          <view 
            v-for="item in sortOptions"
            :key="item.value"
            class="sort-option"
            :class="{ active: currentSort === item.value }"
            @click="handleSortSelect(item.value)"
          >
            <text>{{ item.label }}</text>
            <text v-if="currentSort === item.value" class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterModal" class="modal-overlay" @click="showFilterModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text>筛选条件</text>
          <view class="header-actions">
            <text class="reset-btn" @click="resetFilters">重置</text>
            <text class="modal-close" @click="showFilterModal = false">完成</text>
          </view>
        </view>
        <scroll-view class="modal-body" scroll-y>
          <!-- 活动状态 -->
          <view class="filter-section">
            <text class="section-title">活动状态</text>
            <view class="filter-tags">
              <view 
                v-for="item in statusOptions"
                :key="item.value"
                class="filter-tag"
                :class="{ active: filters.status === item.value }"
                @click="filters.status = item.value"
              >
                {{ item.label }}
              </view>
            </view>
          </view>

          <!-- 价格范围 -->
          <view class="filter-section">
            <text class="section-title">价格范围</text>
            <view class="price-range">
              <input 
                type="number" 
                class="price-input" 
                placeholder="最低价"
                :value="filters.minPrice || ''"
                @input="filters.minPrice = $event.detail.value ? Number($event.detail.value) : null"
              />
              <text class="price-separator">-</text>
              <input 
                type="number" 
                class="price-input" 
                placeholder="最高价"
                :value="filters.maxPrice || ''"
                @input="filters.maxPrice = $event.detail.value ? Number($event.detail.value) : null"
              />
            </view>
          </view>

          <!-- 时间筛选 -->
          <view class="filter-section">
            <text class="section-title">活动时间</text>
            <view class="time-options">
              <view 
                v-for="item in timeOptions"
                :key="item.value"
                class="time-option"
                :class="{ active: filters.time === item.value }"
                @click="filters.time = item.value"
              >
                {{ item.label }}
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="showFilterModal = false">取消</view>
          <view class="footer-btn confirm" @click="applyFilters">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'

// 响应式数据
const showSearch = ref(false)
const searchKeyword = ref('')
const currentCategory = ref('all')
const currentSort = ref('time')
const showSortModal = ref(false)
const showFilterModal = ref(false)
const refreshing = ref(false)
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 10

// 筛选数据
const filters = ref({
  status: 'all',
  minPrice: null,
  maxPrice: null,
  time: 'all'
})

// 分类选项
const categories = [
  { label: '全部', value: 'all' },
  { label: '学术讲座', value: 'academic' },
  { label: '体育赛事', value: 'sport' },
  { label: '文艺演出', value: 'culture' },
  { label: '社交活动', value: 'social' },
  { label: '志愿服务', value: 'volunteer' }
]

// 排序选项
const sortOptions = [
  { label: '最新发布', value: 'time' },
  { label: '最热活动', value: 'hot' },
  { label: '即将开始', value: 'upcoming' },
  { label: '距离最近', value: 'distance' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' }
]

// 状态选项
const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '即将开始', value: 'upcoming' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' }
]

// 时间选项
const timeOptions = [
  { label: '全部时间', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '未来三天', value: '3days' }
]

// 模拟活动数据
const activityList = ref([
  {
    id: 1,
    title: '校园音乐节 - 青春不散场',
    cover: '/static/images/activity1.jpg',
    category: 'culture',
    startTime: '2024-12-25 19:00:00',
    location: '学校大礼堂',
    price: 0,
    isFree: true,
    status: 'upcoming',
    isFavorite: false,
    organizerName: '校学生会',
    organizerAvatar: '/static/avatars/org1.jpg'
  },
  {
    id: 2,
    title: '人工智能前沿技术讲座',
    cover: '/static/images/activity2.jpg',
    category: 'academic',
    startTime: '2024-12-20 14:00:00',
    location: '信息楼报告厅',
    price: 20,
    isFree: false,
    status: 'upcoming',
    isFavorite: true,
    organizerName: '计算机学院',
    organizerAvatar: '/static/avatars/org2.jpg'
  },
  {
    id: 3,
    title: '冬季校园马拉松比赛',
    cover: '/static/images/activity3.jpg',
    category: 'sport',
    startTime: '2024-12-22 08:00:00',
    location: '学校操场',
    price: 0,
    isFree: true,
    status: 'ongoing',
    isFavorite: false,
    organizerName: '体育部',
    organizerAvatar: '/static/avatars/org3.jpg'
  },
  {
    id: 4,
    title: '志愿者环保公益活动',
    cover: '/static/images/activity4.jpg',
    category: 'volunteer',
    startTime: '2024-12-18 09:00:00',
    location: '校园公园',
    price: 0,
    isFree: true,
    status: 'ended',
    isFavorite: false,
    organizerName: '环保协会',
    organizerAvatar: '/static/avatars/org4.jpg'
  }
])

// 推荐活动
const recommendedActivities = computed(() => {
  return activityList.value
    .filter(item => item.status === 'upcoming')
    .slice(0, 3)
})

// 工具函数
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = date - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (days === 1) {
    return `明天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

const getCategoryLabel = (category) => {
  const found = categories.find(item => item.value === category)
  return found ? found.label : '其他'
}

const getSortLabel = () => {
  const found = sortOptions.find(item => item.value === currentSort.value)
  return found ? found.label : '排序'
}

// 搜索功能
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchKeyword.value = ''
    handleSearch()
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  handleSearch()
}

const cancelSearch = () => {
  showSearch.value = false
  searchKeyword.value = ''
  handleSearch()
}

const handleSearch = () => {
  loadActivities(true)
}

// 分类切换
const handleCategoryChange = (category) => {
  currentCategory.value = category
  loadActivities(true)
}

// 排序处理
const handleSortSelect = (sort) => {
  currentSort.value = sort
  loadActivities(true)
  showSortModal.value = false
}

// 筛选处理
const resetFilters = () => {
  filters.value = {
    status: 'all',
    minPrice: null,
    maxPrice: null,
    time: 'all'
  }
}

const applyFilters = () => {
  showFilterModal.value = false
  loadActivities(true)
}

// 加载活动列表
const loadActivities = async (reset = false) => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    if (reset) {
      page.value = 1
      hasMore.value = true
      // 重置时清空列表（实际项目中应该调用API获取新数据）
      // activityList.value = []
    }
    
    if (!hasMore.value && !reset) {
      loading.value = false
      return
    }
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该调用真实的API
    // const response = await api.getActivities({
    //   page: page.value,
    //   pageSize,
    //   category: currentCategory.value !== 'all' ? currentCategory.value : undefined,
    //   sort: currentSort.value,
    //   keyword: searchKeyword.value || undefined,
    //   status: filters.value.status !== 'all' ? filters.value.status : undefined,
    //   minPrice: filters.value.minPrice || undefined,
    //   maxPrice: filters.value.maxPrice || undefined,
    //   time: filters.value.time !== 'all' ? filters.value.time : undefined
    // })
    
    // 模拟返回数据
    // if (reset) {
    //   activityList.value = response.list || []
    // } else {
    //   activityList.value.push(...(response.list || []))
    // }
    
    if (!reset) {
      page.value++
    }
    
    // 模拟没有更多数据
    if (page.value >= 3) {
      hasMore.value = false
    }
    
  } catch (error) {
    console.error('加载活动失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const handleRefresh = () => {
  refreshing.value = true
  loadActivities(true).finally(() => {
    uni.stopPullDownRefresh()
  })
}

// 上拉加载更多
const handleLoadMore = () => {
  if (!loading.value && hasMore.value) {
    loadActivities(false)
  }
}

// 跳转到详情页
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/detail/index?id=${id}`,
    fail: () => {
      uni.showToast({ 
        title: '活动详情页开发中', 
        icon: 'none',
        duration: 2000
      })
    }
  })
}

// 收藏活动
const toggleFavorite = (activity) => {
  const index = activityList.value.findIndex(item => item.id === activity.id)
  if (index !== -1) {
    activityList.value[index].isFavorite = !activityList.value[index].isFavorite
    
    uni.showToast({
      title: activityList.value[index].isFavorite ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    })
  }
}

// 分享活动
const handleShare = (activity) => {
  // #ifdef MP-WEIXIN
  uni.shareAppMessage({
    title: activity.title,
    path: `/pages/tabbar/activity/subpages/detail/index?id=${activity.id}`,
    imageUrl: activity.cover
  })
  // #endif
  
  // #ifdef APP-PLUS
  if (typeof uni.share === 'function') {
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 0,
      title: activity.title,
      summary: `${getCategoryLabel(activity.category)} | ${formatTime(activity.startTime)}`,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: (err) => {
        console.error('分享失败:', err)
        uni.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  } else {
    uni.showToast({
      title: '当前环境不支持分享',
      icon: 'none',
      duration: 1500
    })
  }
  // #endif
  
  // #ifdef H5
  uni.showToast({
    title: 'H5环境暂不支持分享',
    icon: 'none',
    duration: 1500
  })
  // #endif
}

// 创建活动
const handleCreate = () => {
  uni.navigateTo({
    url: '/pages/tabbar/activity/subpages/create/index'
  })
}

// 我的活动
const goToMyActivities = () => {
  uni.navigateTo({
    url: '/pages/tabbar/activity/subpages/my/index'
  })
}

// 生命周期
onLoad(() => {
  loadActivities(true)
})

onPullDownRefresh(() => {
  handleRefresh()
})

onReachBottom(() => {
  handleLoadMore()
})

onShow(() => {
  // 页面显示时刷新数据
  if (uni.getStorageSync('needRefreshActivity')) {
    uni.removeStorageSync('needRefreshActivity')
    loadActivities(true)
  }
})
</script>

<style lang="scss" scoped>
.activity-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

// 头部样式
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 30rpx;
    
    .header-icon {
      font-size: 36rpx;
      color: #666;
    }
  }
}

// 搜索框
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    height: 70rpx;
    background: #f5f5f5;
    border-radius: 35rpx;
    
    .search-input {
      flex: 1;
      height: 100%;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
    
    .clear-btn {
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 32rpx;
      color: #999;
    }
  }
  
  .search-cancel {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #007AFF;
  }
}

// 分类标签
.category-tabs {
  white-space: nowrap;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  height: 80rpx;
  
  .tab-item {
    display: inline-block;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    
    &.active {
      color: #007AFF;
      font-weight: bold;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

// 筛选栏
.filter-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .filter-item {
    display: flex;
    align-items: center;
    margin-right: 40rpx;
    font-size: 28rpx;
    color: #666;
    
    .iconfont {
      margin-left: 8rpx;
      font-size: 24rpx;
    }
  }
}

// 推荐活动
.recommend-section {
  background: #fff;
  margin: 20rpx 0;
  padding: 20rpx 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .recommend-scroll {
    white-space: nowrap;
    height: 280rpx;
  }
  
  .recommend-item {
    display: inline-block;
    width: 400rpx;
    margin-right: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    
    .recommend-img {
      width: 100%;
      height: 200rpx;
    }
    
    .recommend-info {
      padding: 20rpx;
      
      .recommend-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .recommend-time {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 活动列表
.activity-list-scroll {
  flex: 1;
  height: 0;
}

.activity-list {
  padding: 0 30rpx 120rpx;
}

.activity-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .activity-cover {
    position: relative;
    height: 300rpx;
    
    .cover-img {
      width: 100%;
      height: 100%;
    }
    
    .status-tag {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      padding: 8rpx 16rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 20rpx;
      
      &.upcoming {
        background: rgba(0, 122, 255, 0.8);
      }
      
      &.ongoing {
        background: rgba(76, 217, 100, 0.8);
      }
    }
    
    .free-tag {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      padding: 8rpx 16rpx;
      background: rgba(76, 217, 100, 0.8);
      color: #fff;
      font-size: 24rpx;
      border-radius: 20rpx;
    }
  }
  
  .activity-info {
    padding: 20rpx;
    
    .info-header {
      margin-bottom: 20rpx;
      
      .activity-category {
        font-size: 24rpx;
        color: #007AFF;
        margin-bottom: 10rpx;
      }
      
      .activity-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    
    .info-detail {
      display: flex;
      flex-direction: column;
      gap: 12rpx;
      margin-bottom: 20rpx;
      
      .detail-item {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;
        
        .iconfont {
          margin-right: 8rpx;
        }
      }
    }
    
    .info-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price-section {
        .price-free {
          font-size: 32rpx;
          color: #4cd964;
          font-weight: bold;
        }
        
        .price-normal {
          font-size: 32rpx;
          color: #ff3b30;
          font-weight: bold;
        }
      }
      
      .action-section {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .action-btn {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          
          &.favorite-btn {
            &.active {
              background: rgba(255, 59, 48, 0.1);
              color: #ff3b30;
            }
          }
          
          &.share-btn {
            background: #007AFF;
            color: #fff;
          }
        }
      }
    }
    
    .organizer-info {
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;
      
      .organizer-avatar {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
      
      .organizer-name {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 加载状态
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  
  .loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid #f3f3f3;
    border-top: 4rpx solid #007AFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  text {
    font-size: 24rpx;
    color: #999;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 没有更多
.no-more {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #999;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  
  .empty-img {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .empty-btn {
    padding: 20rpx 40rpx;
    background: #007AFF;
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
}

// 底部操作栏
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    background: #f5f5f5;
    border-radius: 40rpx;
    
    &.primary {
      background: #007AFF;
      color: #fff;
      margin-left: 20rpx;
    }
  }
}

// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 600rpx;
  max-height: 80vh;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 30rpx;
      
      .reset-btn {
        color: #666;
        font-size: 28rpx;
      }
    }
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .sort-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &.active {
        color: #007AFF;
      }
      
      .check-icon {
        color: #007AFF;
        font-size: 32rpx;
      }
    }
    
    .filter-section {
      margin-bottom: 40rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 20rpx;
      }
      
      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .filter-tag {
          padding: 12rpx 24rpx;
          background: #f5f5f5;
          color: #666;
          border-radius: 40rpx;
          font-size: 24rpx;
          
          &.active {
            background: #007AFF;
            color: #fff;
          }
        }
      }
      
      .price-range {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .price-input {
          flex: 1;
          height: 70rpx;
          padding: 0 20rpx;
          background: #f5f5f5;
          border-radius: 8rpx;
          font-size: 28rpx;
        }
        
        .price-separator {
          color: #999;
        }
      }
      
      .time-options {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .time-option {
          padding: 12rpx 24rpx;
          background: #f5f5f5;
          color: #666;
          border-radius: 40rpx;
          font-size: 24rpx;
          
          &.active {
            background: #007AFF;
            color: #fff;
          }
        }
      }
    }
  }
  
  .modal-footer {
    display: flex;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .footer-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      border-radius: 40rpx;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
        margin-right: 20rpx;
      }
      
      &.confirm {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}
</style>