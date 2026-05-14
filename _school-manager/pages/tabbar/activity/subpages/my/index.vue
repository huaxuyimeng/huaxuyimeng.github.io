<!--
 * 文件路径: pages/tabbar/activity/subpages/my/index.vue
 * 功能说明: 我的活动页面
 * 主要功能:
 *   1. 显示我创建的活动列表
 *   2. 显示我报名的活动列表
 *   3. 管理我创建的活动
 *   4. 查看活动详情和报名情况
 * 数据来源: 本地存储或API接口
 * 相关页面: pages/tabbar/activity/subpages/detail/index.vue (活动详情)
 -->
<template>
  <view class="my-activity-container">
    <!-- 自定义导航栏 -->
    <view class="my-header">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont">←</text>
      </view>
      <view class="header-title">我的活动</view>
      <view class="header-actions">
        <view class="header-icon" @click="handleSearch">
          <text class="iconfont">🔍</text>
        </view>
        <view class="header-icon" @click="handleFilter">
          <text class="iconfont">⚙️</text>
        </view>
      </view>
    </view>

    <!-- 用户信息概览 -->
    <view class="user-overview">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo.avatar" />
        <view class="user-detail">
          <view class="user-name">{{ userInfo.name }}</view>
          <view class="user-stats">
            <view class="stat-item">
              <text class="stat-number">{{ stats.createdCount }}</text>
              <text class="stat-label">创建</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ stats.joinedCount }}</text>
              <text class="stat-label">参与</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ stats.favoriteCount }}</text>
              <text class="stat-label">收藏</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ stats.historyCount }}</text>
              <text class="stat-label">足迹</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动类型标签 -->
    <view class="type-tabs">
      <scroll-view class="tabs-scroll" scroll-x>
        <view 
          class="tab-item" 
          :class="{ active: currentTab === item.value }"
          v-for="item in tabOptions" 
          :key="item.value"
          @click="handleTabChange(item.value)"
        >
          <text class="tab-text">{{ item.label }}</text>
          <view v-if="item.badge" class="tab-badge">{{ item.badge }}</view>
        </view>
      </scroll-view>
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
      <!-- 空状态提示 -->
      <view v-if="currentList.length === 0 && !loading" class="empty-state">
        <image class="empty-img" :src="getEmptyImage(currentTab)" />
        <view class="empty-text">{{ getEmptyText(currentTab) }}</view>
        <view class="empty-action" @click="handleEmptyAction">
          {{ getEmptyActionText(currentTab) }}
        </view>
      </view>

      <!-- 活动列表 -->
      <view v-else class="activity-list">
        <!-- 创建的活动 -->
        <template v-if="currentTab === 'created'">
          <view 
            v-for="item in currentList" 
            :key="item.id"
            class="activity-item created"
          >
            <view class="item-header">
              <view class="item-status">
                <view class="status-badge" :class="item.status">
                  {{ getStatusText(item.status) }}
                </view>
                <view v-if="item.needReview" class="review-badge">待审核</view>
              </view>
              <view class="item-actions">
                <view class="action-btn edit" @click="handleEdit(item.id)">编辑</view>
                <view class="action-btn manage" @click="handleManage(item.id)">管理</view>
              </view>
            </view>
            
            <view class="item-content" @click="goToDetail(item.id)">
              <image class="item-cover" :src="item.cover" mode="aspectFill" />
              <view class="item-info">
                <view class="item-title">{{ item.title }}</view>
                <view class="item-meta">
                  <view class="meta-item">
                    <text class="iconfont">⏰</text>
                    <text>{{ formatTime(item.startTime) }}</text>
                  </view>
                  <view class="meta-item">
                    <text class="iconfont">👥</text>
                    <text>{{ item.participants }}/{{ item.capacity || '不限' }}人</text>
                  </view>
                </view>
              </view>
            </view>
            
            <view class="item-footer">
              <view class="footer-stats">
                <view class="stat">
                  <text class="iconfont">👁️</text>
                  <text>{{ item.viewCount || 0 }}浏览</text>
                </view>
                <view class="stat">
                  <text class="iconfont">💬</text>
                  <text>{{ item.commentCount || 0 }}评论</text>
                </view>
                <view class="stat">
                  <text class="iconfont">❤️</text>
                  <text>{{ item.likeCount || 0 }}喜欢</text>
                </view>
              </view>
              <view class="footer-time">
                创建于 {{ formatCreateTime(item.createTime) }}
              </view>
            </view>
          </view>
        </template>

        <!-- 参与的活动 -->
        <template v-else-if="currentTab === 'joined'">
          <view 
            v-for="item in currentList" 
            :key="item.id"
            class="activity-item joined"
            :class="{ 'pending': item.signupStatus === 'pending' }"
          >
            <view class="item-header">
              <view class="item-status">
                <view class="status-badge" :class="item.status">
                  {{ getStatusText(item.status) }}
                </view>
                <view v-if="item.signupStatus === 'pending'" class="review-badge">审核中</view>
                <view v-else-if="item.signupStatus === 'rejected'" class="reject-badge">已拒绝</view>
                <view v-else-if="item.signupStatus === 'approved'" class="approved-badge">已通过</view>
              </view>
              <view class="item-actions">
                <view v-if="item.canCancel" class="action-btn cancel" @click="handleCancelJoin(item.id)">
                  取消报名
                </view>
                <view v-if="item.canReview" class="action-btn review" @click="goToReview(item.id)">
                  去评价
                </view>
              </view>
            </view>
            
            <view class="item-content" @click="goToDetail(item.id)">
              <image class="item-cover" :src="item.cover" mode="aspectFill" />
              <view class="item-info">
                <view class="item-title">{{ item.title }}</view>
                <view class="item-meta">
                  <view class="meta-item">
                    <text class="iconfont">⏰</text>
                    <text>{{ formatTime(item.startTime) }}</text>
                  </view>
                  <view class="meta-item">
                    <text class="iconfont">📍</text>
                    <text>{{ item.location }}</text>
                  </view>
                </view>
                <view class="item-organizer">
                  <image class="organizer-avatar" :src="item.organizerAvatar" />
                  <text class="organizer-name">{{ item.organizerName }}</text>
                </view>
              </view>
            </view>
            
            <view class="item-footer">
              <view class="footer-info">
                <view class="info-item">
                  <text class="label">报名时间：</text>
                  <text class="value">{{ formatSignupTime(item.signupTime) }}</text>
                </view>
                <view v-if="item.signupRemark" class="info-item">
                  <text class="label">报名备注：</text>
                  <text class="value">{{ item.signupRemark }}</text>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 收藏的活动 -->
        <template v-else-if="currentTab === 'favorite'">
          <view 
            v-for="item in currentList" 
            :key="item.id"
            class="activity-item favorite"
          >
            <view class="item-header">
              <view class="item-status">
                <view class="status-badge" :class="item.status">
                  {{ getStatusText(item.status) }}
                </view>
              </view>
              <view class="item-actions">
                <view class="action-btn unfavorite" @click="handleUnfavorite(item.id)">
                  取消收藏
                </view>
              </view>
            </view>
            
            <view class="item-content" @click="goToDetail(item.id)">
              <image class="item-cover" :src="item.cover" mode="aspectFill" />
              <view class="item-info">
                <view class="item-title">{{ item.title }}</view>
                <view class="item-meta">
                  <view class="meta-item">
                    <text class="iconfont">⏰</text>
                    <text>{{ formatTime(item.startTime) }}</text>
                  </view>
                  <view class="meta-item">
                    <text class="iconfont">📍</text>
                    <text>{{ item.location }}</text>
                  </view>
                </view>
                <view class="item-tags">
                  <view v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</view>
                </view>
              </view>
            </view>
            
            <view class="item-footer">
              <view class="footer-time">
                收藏于 {{ formatFavoriteTime(item.favoriteTime) }}
              </view>
            </view>
          </view>
        </template>

        <!-- 历史记录 -->
        <template v-else-if="currentTab === 'history'">
          <view 
            v-for="item in currentList" 
            :key="item.id"
            class="activity-item history"
          >
            <view class="item-content" @click="goToDetail(item.id)">
              <image class="item-cover" :src="item.cover" mode="aspectFill" />
              <view class="item-info">
                <view class="item-title">{{ item.title }}</view>
                <view class="item-meta">
                  <view class="meta-item">
                    <text class="iconfont">⏰</text>
                    <text>{{ formatTime(item.startTime) }}</text>
                  </view>
                  <view class="meta-item">
                    <text class="iconfont">📍</text>
                    <text>{{ item.location }}</text>
                  </view>
                </view>
                <view class="item-view-time">
                  <text class="iconfont">👁️</text>
                  <text>浏览于 {{ formatViewTime(item.viewTime) }}</text>
                </view>
              </view>
            </view>
            
            <view class="item-actions">
              <view class="action-btn delete" @click="handleDeleteHistory(item.id)">
                删除记录
              </view>
            </view>
          </view>
        </template>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading && currentList.length > 0" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 没有更多 -->
      <view v-if="!hasMore && currentList.length > 0" class="no-more">
        <text>— 没有更多了 —</text>
      </view>
    </scroll-view>

    <!-- 操作菜单 -->
    <view v-if="showActionMenu" class="action-menu">
      <view class="menu-item" @click="handleCreateActivity">
        <view class="menu-icon create">+</view>
        <text class="menu-text">创建活动</text>
      </view>
      <view class="menu-item" @click="handleScanJoin">
        <view class="menu-icon scan">📷</view>
        <text class="menu-text">扫码加入</text>
      </view>
      <view class="menu-item" @click="handleImportActivity">
        <view class="menu-icon import">📥</view>
        <text class="menu-text">导入活动</text>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterModal" class="modal-overlay" @click="showFilterModal = false">
      <view class="modal-content filter-modal" @click.stop>
        <view class="modal-header">
          <text>筛选</text>
          <view class="header-actions">
            <text class="reset-btn" @click="resetFilters">重置</text>
            <text class="modal-close" @click="showFilterModal = false">完成</text>
          </view>
        </view>
        <scroll-view class="modal-body" scroll-y>
          <!-- 时间筛选 -->
          <view class="filter-section">
            <text class="section-title">时间范围</text>
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

          <!-- 状态筛选 -->
          <view class="filter-section">
            <text class="section-title">活动状态</text>
            <view class="status-options">
              <view 
                v-for="item in statusOptions"
                :key="item.value"
                class="status-option"
                :class="{ active: filters.status === item.value }"
                @click="filters.status = item.value"
              >
                {{ item.label }}
              </view>
            </view>
          </view>

          <!-- 排序方式 -->
          <view class="filter-section">
            <text class="section-title">排序方式</text>
            <view class="sort-options">
              <view 
                v-for="item in sortOptions"
                :key="item.value"
                class="sort-option"
                :class="{ active: filters.sort === item.value }"
                @click="filters.sort = item.value"
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

    <!-- 搜索框 -->
    <view v-if="showSearch" class="search-overlay">
      <view class="search-container">
        <view class="search-input-wrapper">
          <text class="iconfont">🔍</text>
          <input 
            class="search-input" 
            placeholder="搜索我的活动..." 
            v-model="searchKeyword"
            @confirm="handleSearchConfirm"
            :focus="showSearch"
          />
          <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
        </view>
        <view class="search-cancel" @click="hideSearch">取消</view>
      </view>
    </view>

    <!-- 操作确认弹窗 -->
    <view v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <view class="confirm-modal" @click.stop>
        <view class="confirm-title">{{ confirmData.title }}</view>
        <view class="confirm-content">{{ confirmData.content }}</view>
        <view class="confirm-actions">
          <view class="confirm-btn cancel" @click="showConfirmModal = false">取消</view>
          <view class="confirm-btn confirm" @click="executeConfirmAction">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式数据
const currentTab = ref('created')
const showSearch = ref(false)
const showFilterModal = ref(false)
const showActionMenu = ref(false)
const showConfirmModal = ref(false)
const refreshing = ref(false)
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 10
const searchKeyword = ref('')

// 筛选数据
const filters = ref({
  time: 'all',
  status: 'all',
  sort: 'time'
})

// 确认弹窗数据
const confirmData = ref({
  title: '',
  content: '',
  type: '',
  id: null
})

// 用户信息
const userInfo = ref({
  name: '张三',
  avatar: '/static/avatars/user1.jpg'
})

// 统计数据
const stats = ref({
  createdCount: 5,
  joinedCount: 12,
  favoriteCount: 8,
  historyCount: 24
})

// 标签选项
const tabOptions = ref([
  { label: '我创建的', value: 'created', badge: 0 },
  { label: '我参与的', value: 'joined', badge: 0 },
  { label: '我收藏的', value: 'favorite', badge: 0 },
  { label: '浏览记录', value: 'history', badge: 0 }
])

// 筛选选项
const timeOptions = [
  { label: '全部时间', value: 'all' },
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' },
  { label: '最近三月', value: '3month' },
  { label: '今年内', value: 'year' }
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '即将开始', value: 'upcoming' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' },
  { label: '已取消', value: 'cancelled' }
]

const sortOptions = [
  { label: '按时间排序', value: 'time' },
  { label: '按热度排序', value: 'hot' },
  { label: '按状态排序', value: 'status' }
]

// 模拟数据
const mockCreatedActivities = [
  {
    id: 1,
    title: '校园音乐节策划会议',
    cover: '/static/images/activity1.jpg',
    status: 'upcoming',
    needReview: false,
    startTime: '2024-12-20 19:00:00',
    participants: 15,
    capacity: 20,
    viewCount: 156,
    commentCount: 12,
    likeCount: 45,
    createTime: '2024-12-10 14:30:00'
  },
  {
    id: 2,
    title: '志愿者培训活动',
    cover: '/static/images/activity4.jpg',
    status: 'ongoing',
    needReview: true,
    startTime: '2024-12-18 09:00:00',
    participants: 8,
    capacity: 10,
    viewCount: 89,
    commentCount: 5,
    likeCount: 23,
    createTime: '2024-12-05 10:20:00'
  }
]

const mockJoinedActivities = [
  {
    id: 3,
    title: '人工智能前沿讲座',
    cover: '/static/images/activity2.jpg',
    status: 'upcoming',
    signupStatus: 'approved',
    canCancel: true,
    canReview: false,
    startTime: '2024-12-20 14:00:00',
    location: '信息楼报告厅',
    organizerName: '计算机学院',
    organizerAvatar: '/static/avatars/org2.jpg',
    signupTime: '2024-12-15 16:30:00',
    signupRemark: '希望能学到AI最新技术'
  },
  {
    id: 4,
    title: '冬季校园马拉松',
    cover: '/static/images/activity3.jpg',
    status: 'upcoming',
    signupStatus: 'pending',
    canCancel: true,
    canReview: false,
    startTime: '2024-12-22 08:00:00',
    location: '学校操场',
    organizerName: '体育部',
    organizerAvatar: '/static/avatars/org3.jpg',
    signupTime: '2024-12-12 09:15:00',
    signupRemark: ''
  }
]

const mockFavoriteActivities = [
  {
    id: 5,
    title: '创业分享会',
    cover: '/static/images/activity5.jpg',
    status: 'upcoming',
    startTime: '2024-12-28 15:00:00',
    location: '创业园报告厅',
    tags: ['创业', '分享', '投资'],
    favoriteTime: '2024-12-10 11:20:00'
  }
]

const mockHistoryActivities = [
  {
    id: 6,
    title: '英语角活动',
    cover: '/static/images/activity6.jpg',
    status: 'ended',
    startTime: '2024-12-15 19:00:00',
    location: '外语学院',
    viewTime: '2024-12-16 10:30:00'
  }
]

// 活动列表数据（实际应该从API获取）
const createdActivities = ref([...mockCreatedActivities])
const joinedActivities = ref([...mockJoinedActivities])
const favoriteActivities = ref([...mockFavoriteActivities])
const historyActivities = ref([...mockHistoryActivities])

// 计算属性
const currentList = computed(() => {
  switch (currentTab.value) {
    case 'created': return createdActivities.value
    case 'joined': return joinedActivities.value
    case 'favorite': return favoriteActivities.value
    case 'history': return historyActivities.value
    default: return []
  }
})

// 工具函数
const formatTime = (timeStr) => {
  if (!timeStr) return ''
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

const formatCreateTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatSignupTime = (timeStr) => {
  return formatCreateTime(timeStr)
}

const formatFavoriteTime = (timeStr) => {
  return formatCreateTime(timeStr)
}

const formatViewTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    return '刚刚'
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${Math.floor(hours / 24)}天前`
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 'upcoming': return '即将开始'
    case 'ongoing': return '进行中'
    case 'ended': return '已结束'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

const getEmptyImage = (tab) => {
  switch(tab) {
    case 'created': return '/static/images/empty-created.png'
    case 'joined': return '/static/images/empty-joined.png'
    case 'favorite': return '/static/images/empty-favorite.png'
    case 'history': return '/static/images/empty-history.png'
    default: return '/static/images/empty.png'
  }
}

const getEmptyText = (tab) => {
  switch(tab) {
    case 'created': return '你还没有创建过活动'
    case 'joined': return '你还没有参与过活动'
    case 'favorite': return '你还没有收藏过活动'
    case 'history': return '你还没有浏览记录'
    default: return '暂无数据'
  }
}

const getEmptyActionText = (tab) => {
  switch(tab) {
    case 'created': return '去创建活动'
    case 'joined': return '去发现活动'
    case 'favorite': return '去发现活动'
    case 'history': return '去发现活动'
    default: return '去逛逛'
  }
}

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const handleTabChange = (tab) => {
  currentTab.value = tab
  loadData(true)
}

const handleSearch = () => {
  showSearch.value = true
}

const hideSearch = () => {
  showSearch.value = false
  searchKeyword.value = ''
  loadData(true)
}

const clearSearch = () => {
  searchKeyword.value = ''
  handleSearchConfirm()
}

const handleSearchConfirm = () => {
  loadData(true)
  showSearch.value = false
}

const handleFilter = () => {
  showFilterModal.value = true
}

const resetFilters = () => {
  filters.value = {
    time: 'all',
    status: 'all',
    sort: 'time'
  }
}

const applyFilters = () => {
  loadData(true)
  showFilterModal.value = false
}

const handleLoadMore = () => {
  if (!loading.value && hasMore.value) {
    loadData(false)
  }
}

const handleRefresh = () => {
  refreshing.value = true
  loadData(true).finally(() => {
    refreshing.value = false
  })
}

const loadData = async (reset = false) => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    if (reset) {
      page.value = 1
      hasMore.value = true
    }
    
    if (!hasMore.value && !reset) {
      loading.value = false
      return
    }
    
    // 这里应该调用真实的API
    // const res = await store.dispatch('activity/getMyActivities', {
    //   type: currentTab.value,
    //   page: page.value,
    //   pageSize: pageSize,
    //   keyword: searchKeyword.value,
    //   ...filters.value
    // })
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据不同类型加载数据（实际应该从API获取）
    // 这里只是模拟，实际应该更新对应的列表数据
    
    if (!reset) {
      page.value++
    }
    
    // 模拟没有更多数据
    if (page.value >= 3) {
      hasMore.value = false
    }
    
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: error.message || '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const handleEmptyAction = () => {
  switch(currentTab.value) {
    case 'created':
      handleCreateActivity()
      break
    default:
      uni.switchTab({
        url: '/pages/tabbar/activity/index'
      })
      break
  }
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/detail/index?id=${id}`
  })
  // 记录浏览历史（如果不是从历史记录进入）
  if (currentTab.value !== 'history') {
    // 这里应该调用API记录浏览历史
    // store.dispatch('activity/addViewHistory', id)
  }
}

const handleEdit = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/create/index?id=${id}&mode=edit`
  })
}

const handleManage = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/manage/index?id=${id}`
  })
}

const handleCancelJoin = (id) => {
  showConfirm({
    title: '取消报名',
    content: '确定要取消报名吗？取消后需要重新报名。',
    type: 'cancelJoin',
    id
  })
}

const goToReview = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/review/index?id=${id}`
  })
}

const handleUnfavorite = (id) => {
  showConfirm({
    title: '取消收藏',
    content: '确定要取消收藏这个活动吗？',
    type: 'unfavorite',
    id
  })
}

const handleDeleteHistory = (id) => {
  showConfirm({
    title: '删除记录',
    content: '确定要删除这条浏览记录吗？',
    type: 'deleteHistory',
    id
  })
}

const showConfirm = (data) => {
  confirmData.value = data
  showConfirmModal.value = true
}

const executeConfirmAction = async () => {
  const { type, id } = confirmData.value
  
  try {
    showConfirmModal.value = false
    uni.showLoading({ title: '处理中...' })
    
    switch(type) {
      case 'cancelJoin':
        // 这里应该调用真实的API
        // await store.dispatch('activity/cancelJoin', id)
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 从列表中移除或更新状态
        if (currentTab.value === 'joined') {
          const index = joinedActivities.value.findIndex(item => item.id === id)
          if (index !== -1) {
            joinedActivities.value.splice(index, 1)
            stats.value.joinedCount = Math.max(stats.value.joinedCount - 1, 0)
            updateStats()
          }
        }
        
        uni.hideLoading()
        uni.showToast({ title: '已取消报名', icon: 'success' })
        break
        
      case 'unfavorite':
        // 这里应该调用真实的API
        // await store.dispatch('activity/unfavorite', id)
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 从列表中移除
        if (currentTab.value === 'favorite') {
          const index = favoriteActivities.value.findIndex(item => item.id === id)
          if (index !== -1) {
            favoriteActivities.value.splice(index, 1)
            stats.value.favoriteCount = Math.max(stats.value.favoriteCount - 1, 0)
            updateStats()
          }
        }
        
        uni.hideLoading()
        uni.showToast({ title: '已取消收藏', icon: 'success' })
        break
        
      case 'deleteHistory':
        // 这里应该调用真实的API
        // await store.dispatch('activity/deleteHistory', id)
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 从列表中移除
        if (currentTab.value === 'history') {
          const index = historyActivities.value.findIndex(item => item.id === id)
          if (index !== -1) {
            historyActivities.value.splice(index, 1)
            stats.value.historyCount = Math.max(stats.value.historyCount - 1, 0)
            updateStats()
          }
        }
        
        uni.hideLoading()
        uni.showToast({ title: '已删除记录', icon: 'success' })
        break
    }
  } catch (error) {
    uni.hideLoading()
    console.error('操作失败:', error)
    uni.showToast({
      title: error.message || '操作失败，请重试',
      icon: 'none'
    })
  }
}

const handleCreateActivity = () => {
  uni.navigateTo({
    url: '/pages/tabbar/activity/subpages/create/index'
  })
}

const handleScanJoin = () => {
  uni.scanCode({
    success: (res) => {
      console.log('扫描结果:', res)
      // 解析二维码内容并跳转到活动详情
      try {
        const result = JSON.parse(res.result)
        if (result.type === 'activity' && result.id) {
          uni.navigateTo({
            url: `/pages/tabbar/activity/subpages/detail/index?id=${result.id}`
          })
        } else {
          uni.showToast({ title: '无效的活动二维码', icon: 'none' })
        }
      } catch (e) {
        // 如果不是JSON格式，尝试直接作为ID处理
        if (res.result) {
          uni.navigateTo({
            url: `/pages/tabbar/activity/subpages/detail/index?id=${res.result}`
          })
        } else {
          uni.showToast({ title: '扫码失败', icon: 'none' })
        }
      }
    },
    fail: (err) => {
      console.error('扫码失败:', err)
      uni.showToast({ title: '扫码失败', icon: 'none' })
    }
  })
}

const handleImportActivity = () => {
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success: (res) => {
      console.log('选择文件:', res)
      // 处理导入逻辑
      uni.showToast({ title: '导入功能开发中', icon: 'none' })
    },
    fail: (err) => {
      console.error('选择文件失败:', err)
      uni.showToast({ title: '选择文件失败', icon: 'none' })
    }
  })
  // #endif
  
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '当前平台不支持导入功能', icon: 'none' })
  // #endif
}

// 生命周期
onLoad(() => {
  loadData(true)
})

onShow(() => {
  // 更新统计数据
  updateStats()
  // 如果从其他页面返回需要刷新
  if (uni.getStorageSync('needRefreshMyActivity')) {
    uni.removeStorageSync('needRefreshMyActivity')
    loadData(true)
  }
})

// 更新统计数据
const updateStats = async () => {
  try {
    // 这里应该调用API获取最新统计数据
    // const res = await store.dispatch('activity/getMyActivityStats')
    // stats.value = res
    
    // 模拟API请求
    // await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新徽章数量
    tabOptions.value.forEach(tab => {
      switch(tab.value) {
        case 'created':
          tab.badge = stats.value.createdCount > 0 ? stats.value.createdCount : 0
          break
        case 'joined':
          tab.badge = stats.value.joinedCount > 0 ? stats.value.joinedCount : 0
          break
        case 'favorite':
          tab.badge = stats.value.favoriteCount > 0 ? stats.value.favoriteCount : 0
          break
        case 'history':
          tab.badge = stats.value.historyCount > 0 ? stats.value.historyCount : 0
          break
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.my-activity-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.my-header {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .back-btn {
    font-size: 40rpx;
    color: #333;
  }
  
  .header-title {
    flex: 1;
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
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

.user-overview {
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 30rpx;
    
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }
    
    .user-detail {
      flex: 1;
      
      .user-name {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
      }
      
      .user-stats {
        display: flex;
        justify-content: space-between;
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .stat-number {
            font-size: 36rpx;
            font-weight: bold;
            margin-bottom: 8rpx;
          }
          
          .stat-label {
            font-size: 24rpx;
            opacity: 0.9;
          }
        }
      }
    }
  }
}

.type-tabs {
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
      .tabs-scroll {
    white-space: nowrap;
    height: 80rpx;
  }
  
  .tab-item {
    display: inline-flex;
    align-items: center;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #007AFF;
      font-weight: bold;
      
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
    
    .tab-badge {
      margin-left: 8rpx;
      padding: 4rpx 12rpx;
      background: #ff3b30;
      color: #fff;
      font-size: 20rpx;
      border-radius: 20rpx;
      min-width: 12rpx;
      text-align: center;
    }
  }
}

.activity-list-scroll {
  flex: 1;
  height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 30rpx;
  text-align: center;
  
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
  
  .empty-action {
    padding: 20rpx 40rpx;
    background: #007AFF;
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
}

.activity-list {
  padding: 20rpx 30rpx 120rpx;
}

.activity-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  &.pending {
    opacity: 0.7;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .item-status {
      display: flex;
      align-items: center;
      gap: 10rpx;
      
      .status-badge {
        padding: 6rpx 12rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        color: #fff;
        
        &.upcoming {
          background: #007AFF;
        }
        
        &.ongoing {
          background: #4cd964;
        }
        
        &.ended {
          background: #cccccc;
        }
        
        &.cancelled {
          background: #ff3b30;
        }
      }
      
      .review-badge {
        padding: 6rpx 12rpx;
        background: #ff9500;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
      
      .reject-badge {
        padding: 6rpx 12rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
      
      .approved-badge {
        padding: 6rpx 12rpx;
        background: #4cd964;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
    }
    
    .item-actions {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .action-btn {
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        
        &.edit {
          border: 1rpx solid #007AFF;
          color: #007AFF;
        }
        
        &.manage {
          background: #007AFF;
          color: #fff;
        }
        
        &.cancel {
          border: 1rpx solid #ff3b30;
          color: #ff3b30;
        }
        
        &.review {
          background: #4cd964;
          color: #fff;
        }
        
        &.unfavorite {
          border: 1rpx solid #999;
          color: #999;
        }
        
        &.delete {
          border: 1rpx solid #ff3b30;
          color: #ff3b30;
        }
      }
    }
  }
  
  .item-content {
    display: flex;
    padding: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .item-cover {
      width: 200rpx;
      height: 150rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }
    
    .item-info {
      flex: 1;
      
      .item-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .item-meta {
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        margin-bottom: 10rpx;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .item-organizer {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        .organizer-avatar {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
        }
        
        .organizer-name {
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .item-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        margin-top: 10rpx;
        
        .tag {
          padding: 4rpx 12rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #666;
        }
      }
      
      .item-view-time {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
  }
  
  .item-footer {
    padding: 20rpx;
    
    .footer-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 10rpx;
      
      .stat {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .footer-time {
      font-size: 24rpx;
      color: #999;
      text-align: center;
    }
    
    .footer-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        
        .label {
          font-size: 24rpx;
          color: #999;
          min-width: 120rpx;
        }
        
        .value {
          font-size: 24rpx;
          color: #333;
          flex: 1;
        }
      }
    }
  }
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  
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

.no-more {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #999;
}

.action-menu {
  position: fixed;
  bottom: 120rpx;
  right: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 1000;
  
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    
    .menu-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 48rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
      
      &.create {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      &.scan {
        background: #4cd964;
      }
      
      &.import {
        background: #ff9500;
      }
    }
    
    .menu-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

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
  z-index: 2000;
}

.filter-modal {
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
      
      .modal-close {
        font-size: 28rpx;
        color: #007AFF;
      }
    }
  }
  
  .modal-body {
    max-height: 60vh;
    padding: 20rpx 30rpx;
  }
  
  .modal-footer {
    display: flex;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    gap: 20rpx;
    
    .footer-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
      }
      
      &.confirm {
        background: #007AFF;
        color: #fff;
      }
    }
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
  
  .time-options,
  .status-options,
  .sort-options {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .time-option,
    .status-option,
    .sort-option {
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

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 2000;
  padding-top: var(--status-bar-height);
  
  .search-container {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
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
}

.confirm-modal {
  width: 500rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  
  .confirm-title {
    padding: 40rpx 30rpx 0;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
  
  .confirm-content {
    padding: 20rpx 30rpx 40rpx;
    font-size: 28rpx;
    color: #666;
    text-align: center;
    line-height: 1.5;
  }
  
  .confirm-actions {
    display: flex;
    border-top: 1rpx solid #f0f0f0;
    
    .confirm-btn {
      flex: 1;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      font-size: 28rpx;
      
      &.cancel {
        color: #666;
        border-right: 1rpx solid #f0f0f0;
      }
      
      &.confirm {
        color: #007AFF;
        font-weight: bold;
      }
    }
  }
}
</style>