<!--
 * 文件路径: pages/tabbar/function/subpages/library/index.vue
 * 功能说明: 图书馆页面
 * 主要功能:
 *   1. 图书搜索和查询
 *   2. 借阅记录查询
 *   3. 图书预约功能
 *   4. 图书馆座位预约
 * 数据来源: 图书馆API接口或本地存储
 * 相关页面: pages/tabbar/function/index.vue (功能中心)
 -->
<template>
  <view class="library-page">
    <!-- 页面头部 -->
    <view class="library-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
        <view class="header-title">校园图书馆</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="handleSearch">
          <text class="iconfont">🔍</text>
        </view>
        <view class="header-icon" @click="showUserCenter = true">
          <text class="iconfont">👤</text>
        </view>
        <view class="header-icon" @click="showMenu = true">
          <text class="iconfont">⋯</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="showSearchBar" class="search-bar">
      <view class="search-input-wrapper">
        <text class="iconfont">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索图书、期刊、论文..." 
          v-model="searchKeyword"
          @confirm="handleSearchConfirm"
          :focus="showSearchBar"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
      </view>
      <view class="search-cancel" @click="hideSearch">取消</view>
    </view>

    <!-- 图书馆概览 -->
    <scroll-view class="library-scroll" scroll-y>
      <!-- 快速服务 -->
      <view class="quick-services">
        <view class="service-grid">
          <view 
            v-for="service in quickServices" 
            :key="service.id"
            class="service-item"
            @click="handleServiceClick(service)"
          >
            <view class="service-icon" :style="{ background: service.color }">
              <text class="iconfont" :class="service.icon"></text>
            </view>
            <view class="service-text">{{ service.name }}</view>
            <view v-if="service.badge" class="service-badge">{{ service.badge }}</view>
          </view>
        </view>
      </view>

      <!-- 借阅信息 -->
      <view v-if="borrowInfo.items.length > 0" class="borrow-section">
        <view class="section-header">
          <view class="section-title">我的借阅</view>
          <view class="section-more" @click="viewAllBorrow">
            查看全部
          </view>
        </view>
        
        <view class="borrow-list">
          <view 
            v-for="item in borrowInfo.items.slice(0, 3)" 
            :key="item.id"
            class="borrow-item"
            :class="{ overdue: item.isOverdue }"
            @click="handleBorrowClick(item)"
          >
            <image class="book-cover" :src="item.cover" mode="aspectFill" />
            <view class="book-info">
              <view class="book-title">{{ item.title }}</view>
              <view class="book-details">
                <view class="detail-item">
                  <text class="iconfont">📅</text>
                  <text>应还日期：{{ item.dueDate }}</text>
                </view>
                <view class="detail-item">
                  <text class="iconfont">⏱️</text>
                  <text>剩余天数：{{ item.remainingDays }}天</text>
                </view>
              </view>
              <view v-if="item.isOverdue" class="overdue-warning">已逾期</view>
            </view>
            <view class="book-action">
              <view class="renew-btn" @click.stop="handleRenew(item.id)">续借</view>
            </view>
          </view>
        </view>
        
        <view class="borrow-summary">
          <view class="summary-item">
            <text class="summary-label">在借图书</text>
            <text class="summary-value">{{ borrowInfo.totalBorrowed }}本</text>
          </view>
          <view class="summary-item">
            <text class="summary-label">即将到期</text>
            <text class="summary-value">{{ borrowInfo.expiringSoon }}本</text>
          </view>
          <view class="summary-item">
            <text class="summary-label">已逾期</text>
            <text class="summary-value">{{ borrowInfo.overdue }}本</text>
          </view>
        </view>
      </view>

      <!-- 图书推荐 -->
      <view v-if="bookRecommendations.length > 0" class="recommend-section">
        <view class="section-header">
          <view class="section-title">为你推荐</view>
          <view class="section-more" @click="viewAllRecommendations">
            更多推荐
          </view>
        </view>
        
        <scroll-view class="recommend-scroll" scroll-x>
          <view 
            v-for="book in bookRecommendations" 
            :key="book.id"
            class="recommend-item"
            @click="handleBookClick(book)"
          >
            <image class="recommend-cover" :src="book.cover" mode="aspectFill" />
            <view class="recommend-info">
              <view class="recommend-title">{{ book.title }}</view>
              <view class="recommend-author">{{ book.author }}</view>
              <view class="recommend-rating">
                <text v-for="star in 5" :key="star" class="star" :class="{ active: star <= book.rating }">★</text>
                <text class="rating-text">{{ book.rating.toFixed(1) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 座位预约 -->
      <view class="seat-section">
        <view class="section-header">
          <view class="section-title">自习室座位</view>
          <view class="section-status">
            <text class="status-dot" :style="{ background: seatStatus.color }"></text>
            <text class="status-text">{{ seatStatus.text }}</text>
          </view>
        </view>
        
        <view class="seat-info">
          <view class="seat-stats">
            <view class="stat-item">
              <text class="stat-number">{{ seatInfo.totalSeats }}</text>
              <text class="stat-label">总座位</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ seatInfo.availableSeats }}</text>
              <text class="stat-label">可用座位</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ seatInfo.utilizationRate }}%</text>
              <text class="stat-label">使用率</text>
            </view>
          </view>
          
          <view v-if="hasReservation" class="current-reservation">
            <view class="reservation-header">
              <text class="iconfont">💺</text>
              <text>当前预约</text>
            </view>
            <view class="reservation-details">
              <view class="detail-item">
                <text>座位号：</text>
                <text class="detail-value">{{ currentReservation.seatNumber }}</text>
              </view>
              <view class="detail-item">
                <text>区域：</text>
                <text class="detail-value">{{ currentReservation.area }}</text>
              </view>
              <view class="detail-item">
                <text>时间：</text>
                <text class="detail-value">{{ currentReservation.time }}</text>
              </view>
            </view>
            <view class="reservation-actions">
              <view class="action-btn" @click="handleExtendReservation">延长时间</view>
              <view class="action-btn cancel" @click="handleCancelReservation">取消预约</view>
            </view>
          </view>
          <view v-else class="seat-action">
            <view class="action-btn primary" @click="handleReserveSeat">立即预约</view>
            <view class="action-btn" @click="handleViewSeatMap">查看座位图</view>
          </view>
        </view>
      </view>

      <!-- 热门图书 -->
      <view v-if="hotBooks.length > 0" class="hot-books-section">
        <view class="section-header">
          <view class="section-title">热门图书</view>
          <view class="section-more" @click="viewAllHotBooks">
            排行榜
          </view>
        </view>
        
        <view class="hot-books-list">
          <view 
            v-for="(book, index) in hotBooks" 
            :key="book.id"
            class="hot-book-item"
            @click="handleBookClick(book)"
          >
            <view class="book-rank">{{ index + 1 }}</view>
            <image class="book-cover" :src="book.cover" mode="aspectFill" />
            <view class="book-info">
              <view class="book-title">{{ book.title }}</view>
              <view class="book-author">{{ book.author }}</view>
              <view class="book-meta">
                <text class="meta-item">借阅 {{ book.borrowCount }}次</text>
                <text class="meta-item">收藏 {{ book.favoriteCount }}</text>
              </view>
            </view>
            <view class="book-status" :class="{ available: book.available }">
              {{ book.available ? '可借' : '已借出' }}
            </view>
          </view>
        </view>
      </view>

      <!-- 开馆时间 -->
      <view class="hours-section">
        <view class="section-header">
          <view class="section-title">开馆时间</view>
        </view>
        
        <view class="hours-list">
          <view 
            v-for="hours in openingHours" 
            :key="hours.day"
            class="hours-item"
            :class="{ today: hours.isToday }"
          >
            <view class="day">{{ hours.day }}</view>
            <view class="time">{{ hours.time }}</view>
            <view v-if="hours.isToday" class="today-tag">今日</view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 搜索面板 -->
    <view v-if="showSearchPanel" class="search-panel">
      <view class="search-tabs">
        <view 
          v-for="tab in searchTabs" 
          :key="tab.value"
          class="search-tab"
          :class="{ active: currentSearchTab === tab.value }"
          @click="currentSearchTab = tab.value"
        >
          {{ tab.label }}
        </view>
      </view>
      
      <scroll-view class="search-results" scroll-y v-if="searchResults.length > 0">
        <view 
          v-for="result in searchResults" 
          :key="result.id"
          class="search-result-item"
          @click="handleSearchResultClick(result)"
        >
          <view class="result-type">{{ getResultTypeText(result.type) }}</view>
          <view class="result-title">{{ result.title }}</view>
          <view v-if="result.author" class="result-author">{{ result.author }}</view>
          <view class="result-meta">
            <text v-if="result.year" class="meta-item">{{ result.year }}</text>
            <text v-if="result.publisher" class="meta-item">{{ result.publisher }}</text>
            <text v-if="result.available" class="meta-item available">可借</text>
            <text v-else class="meta-item unavailable">已借出</text>
          </view>
        </view>
      </scroll-view>
      
      <view v-else class="no-results">
        <text class="iconfont">📚</text>
        <text class="no-results-text">暂无搜索结果</text>
      </view>
    </view>

    <!-- 用户中心 -->
    <view v-if="showUserCenter" class="modal-overlay" @click="showUserCenter = false">
      <view class="modal-content user-center" @click.stop>
        <view class="modal-header">
          <text>个人中心</text>
          <view class="modal-close" @click="showUserCenter = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="user-info">
            <image class="user-avatar" :src="userInfo.avatar" />
            <view class="user-detail">
              <view class="user-name">{{ userInfo.name }}</view>
              <view class="user-id">学号：{{ userInfo.studentId }}</view>
              <view class="user-department">{{ userInfo.department }}</view>
            </view>
          </view>
          
          <view class="user-stats">
            <view class="stat-item">
              <text class="stat-number">{{ userStats.borrowedBooks }}</text>
              <text class="stat-label">在借图书</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ userStats.totalBorrowed }}</text>
              <text class="stat-label">累计借阅</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ userStats.overdueTimes }}</text>
              <text class="stat-label">逾期次数</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ userStats.fines }}</text>
              <text class="stat-label">欠费(元)</text>
            </view>
          </view>
          
          <view class="user-actions">
            <view class="action-item" @click="handleMyBorrow">
              <text class="iconfont">📚</text>
              <text>我的借阅</text>
            </view>
            <view class="action-item" @click="handleMyFavorites">
              <text class="iconfont">❤️</text>
              <text>我的收藏</text>
            </view>
            <view class="action-item" @click="handleMyReservations">
              <text class="iconfont">💺</text>
              <text>我的预约</text>
            </view>
            <view class="action-item" @click="handleMyHistory">
              <text class="iconfont">📋</text>
              <text>借阅历史</text>
            </view>
          </view>
          
          <view class="user-settings">
            <view class="setting-item">
              <text>消息通知</text>
              <switch :checked="settings.notifications" @change="toggleNotifications" />
            </view>
            <view class="setting-item">
              <text>自动续借</text>
              <switch :checked="settings.autoRenew" @change="toggleAutoRenew" />
            </view>
            <view class="setting-item" @click="handleChangePassword">
              <text>修改密码</text>
              <text class="iconfont">→</text>
            </view>
            <view class="setting-item" @click="handleFeedback">
              <text>意见反馈</text>
              <text class="iconfont">→</text>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="logout-btn" @click="handleLogout">退出登录</view>
        </view>
      </view>
    </view>

    <!-- 操作菜单 -->
    <view v-if="showMenu" class="menu-overlay" @click="showMenu = false">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="handleScanBook">
          <text class="iconfont">📷</text>
          <text>扫码查书</text>
        </view>
        <view class="menu-item" @click="handleLocation">
          <text class="iconfont">📍</text>
          <text>图书馆导航</text>
        </view>
        <view class="menu-item" @click="handleRules">
          <text class="iconfont">📄</text>
          <text>借阅规则</text>
        </view>
        <view class="menu-item" @click="handleContact">
          <text class="iconfont">📞</text>
          <text>联系我们</text>
        </view>
        <view class="menu-item cancel" @click="showMenu = false">
          取消
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

// 响应式数据
const showSearchBar = ref(false)
const showSearchPanel = ref(false)
const showUserCenter = ref(false)
const showMenu = ref(false)
const searchKeyword = ref('')
const currentSearchTab = ref('book')
const hasReservation = ref(true)

// 用户信息
const userInfo = ref({
  name: '张三',
  studentId: '20210001',
  department: '计算机学院',
  avatar: '/static/avatars/user1.jpg'
})

const userStats = ref({
  borrowedBooks: 3,
  totalBorrowed: 45,
  overdueTimes: 2,
  fines: 0
})

// 设置
const settings = ref({
  notifications: true,
  autoRenew: false
})

// 快速服务
const quickServices = ref([
  { id: 1, name: '图书检索', icon: 'icon-search', color: '#007AFF' },
  { id: 2, name: '座位预约', icon: 'icon-seat', color: '#4cd964' },
  { id: 3, name: '电子资源', icon: 'icon-ebook', color: '#ff9500' },
  { id: 4, name: '我的借阅', icon: 'icon-borrow', color: '#ff3b30', badge: 3 },
  { id: 5, name: '馆藏目录', icon: 'icon-catalog', color: '#5856d6' },
  { id: 6, name: '论文查重', icon: 'icon-paper', color: '#ff2d55' },
  { id: 7, name: '学术讲座', icon: 'icon-lecture', color: '#5ac8fa' },
  { id: 8, name: '空间预约', icon: 'icon-room', color: '#34c759' }
])

// 借阅信息
const borrowInfo = ref({
  items: [
    { 
      id: 1, 
      title: 'JavaScript高级程序设计', 
      cover: '/static/images/book1.jpg',
      dueDate: '2024-12-25',
      remainingDays: 5,
      isOverdue: false
    },
    { 
      id: 2, 
      title: '算法导论', 
      cover: '/static/images/book2.jpg',
      dueDate: '2024-12-20',
      remainingDays: 0,
      isOverdue: true
    },
    { 
      id: 3, 
      title: '人工智能：一种现代的方法', 
      cover: '/static/images/book3.jpg',
      dueDate: '2024-12-28',
      remainingDays: 8,
      isOverdue: false
    }
  ],
  totalBorrowed: 3,
  expiringSoon: 1,
  overdue: 1
})

// 图书推荐
const bookRecommendations = ref([
  { 
    id: 4, 
    title: '深入浅出Node.js', 
    author: '朴灵', 
    cover: '/static/images/book4.jpg',
    rating: 4.8
  },
  { 
    id: 5, 
    title: 'Python编程：从入门到实践', 
    author: 'Eric Matthes', 
    cover: '/static/images/book5.jpg',
    rating: 4.6
  },
  { 
    id: 6, 
    title: '计算机网络：自顶向下方法', 
    author: 'James F. Kurose', 
    cover: '/static/images/book6.jpg',
    rating: 4.7
  },
  { 
    id: 7, 
    title: '设计模式：可复用面向对象软件的基础', 
    author: 'Erich Gamma', 
    cover: '/static/images/book7.jpg',
    rating: 4.9
  }
])

// 座位信息
const seatStatus = ref({
  color: '#4cd964',
  text: '座位充足'
})

const seatInfo = ref({
  totalSeats: 1200,
  availableSeats: 856,
  utilizationRate: 28
})

const currentReservation = ref({
  seatNumber: 'A-203',
  area: '三楼阅览区',
  time: '14:00-18:00'
})

// 热门图书
const hotBooks = ref([
  { 
    id: 8, 
    title: '活着', 
    author: '余华', 
    cover: '/static/images/book8.jpg',
    borrowCount: 156,
    favoriteCount: 234,
    available: true
  },
  { 
    id: 9, 
    title: '百年孤独', 
    author: '加西亚·马尔克斯', 
    cover: '/static/images/book9.jpg',
    borrowCount: 134,
    favoriteCount: 189,
    available: false
  },
  { 
    id: 10, 
    title: '三体', 
    author: '刘慈欣', 
    cover: '/static/images/book10.jpg',
    borrowCount: 178,
    favoriteCount: 267,
    available: true
  }
])

// 开馆时间
const openingHours = ref([
  { day: '周一', time: '8:00-22:00', isToday: false },
  { day: '周二', time: '8:00-22:00', isToday: false },
  { day: '周三', time: '8:00-22:00', isToday: false },
  { day: '周四', time: '8:00-22:00', isToday: true },
  { day: '周五', time: '8:00-22:00', isToday: false },
  { day: '周六', time: '9:00-21:00', isToday: false },
  { day: '周日', time: '9:00-21:00', isToday: false }
])

// 搜索标签
const searchTabs = ref([
  { label: '图书', value: 'book' },
  { label: '期刊', value: 'journal' },
  { label: '论文', value: 'paper' },
  { label: '电子资源', value: 'digital' }
])

// 搜索结果
const searchResults = ref([])

// 计算属性
const getResultTypeText = (type) => {
  switch(type) {
    case 'book': return '图书'
    case 'journal': return '期刊'
    case 'paper': return '论文'
    case 'digital': return '电子资源'
    default: return '图书'
  }
}

// 工具函数
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const handleSearch = () => {
  showSearchBar.value = true
}

const hideSearch = () => {
  showSearchBar.value = false
  searchKeyword.value = ''
  showSearchPanel.value = false
}

const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
}

const handleSearchConfirm = () => {
  if (!searchKeyword.value.trim()) {
    uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
    return
  }
  
  showSearchPanel.value = true
  showSearchBar.value = false
  
  // 模拟搜索
  searchResults.value = [
    { 
      id: 1, 
      type: 'book', 
      title: 'JavaScript高级程序设计（第4版）',
      author: '[美] 马特·弗里斯比',
      year: '2020',
      publisher: '人民邮电出版社',
      available: true
    },
    { 
      id: 2, 
      type: 'book', 
      title: '深入理解ES6',
      author: '[美] 尼古拉斯·C·扎卡斯',
      year: '2017',
      publisher: '电子工业出版社',
      available: false
    }
  ]
}

const handleServiceClick = (service) => {
  switch(service.id) {
    case 1: // 图书检索
      handleSearch()
      break
    case 2: // 座位预约
      handleReserveSeat()
      break
    case 3: // 电子资源
      uni.showToast({ title: '电子资源', icon: 'none' })
      break
    case 4: // 我的借阅
      handleMyBorrow()
      break
    default:
      uni.showToast({ title: service.name, icon: 'none' })
  }
}

const handleBorrowClick = (item) => {
  uni.navigateTo({
    url: `/pages/tabbar/function/subpages/library/book-detail?id=${item.id}`
  })
}

const handleRenew = (bookId) => {
  uni.showModal({
    title: '续借图书',
    content: '确定要续借这本图书吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '续借中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '续借成功', icon: 'success' })
        }, 1000)
      }
    }
  })
}

const viewAllBorrow = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/my-borrow'
  })
}

const handleBookClick = (book) => {
  uni.navigateTo({
    url: `/pages/tabbar/function/subpages/library/book-detail?id=${book.id}`
  })
}

const viewAllRecommendations = () => {
  uni.showToast({ title: '更多推荐', icon: 'none' })
}

const handleReserveSeat = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/seat-reserve'
  })
}

const handleExtendReservation = () => {
  uni.showModal({
    title: '延长预约',
    content: '延长1小时？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已延长预约', icon: 'success' })
      }
    }
  })
}

const handleCancelReservation = () => {
  uni.showModal({
    title: '取消预约',
    content: '确定要取消当前预约吗？',
    success: (res) => {
      if (res.confirm) {
        hasReservation.value = false
        uni.showToast({ title: '已取消预约', icon: 'success' })
      }
    }
  })
}

const handleViewSeatMap = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/seat-map'
  })
}

const viewAllHotBooks = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/rankings'
  })
}

const handleSearchResultClick = (result) => {
  if (result.type === 'book') {
    uni.navigateTo({
      url: `/pages/tabbar/function/subpages/library/book-detail?id=${result.id}`
    })
  }
}

// 用户中心功能
const toggleNotifications = (e) => {
  settings.value.notifications = e.detail.value
}

const toggleAutoRenew = (e) => {
  settings.value.autoRenew = e.detail.value
}

const handleMyBorrow = () => {
  viewAllBorrow()
  showUserCenter.value = false
}

const handleMyFavorites = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/my-favorites'
  })
  showUserCenter.value = false
}

const handleMyReservations = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/my-reservations'
  })
  showUserCenter.value = false
}

const handleMyHistory = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/history'
  })
  showUserCenter.value = false
}

const handleChangePassword = () => {
  uni.showToast({ title: '修改密码', icon: 'none' })
  showUserCenter.value = false
}

const handleFeedback = () => {
  uni.navigateTo({
    url: '/pages/common/feedback?type=library'
  })
  showUserCenter.value = false
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录', icon: 'success' })
        showUserCenter.value = false
      }
    }
  })
}

// 菜单功能
const handleScanBook = () => {
  uni.scanCode({
    success: (res) => {
      console.log('扫码结果:', res)
      uni.showToast({ title: '扫码成功', icon: 'success' })
    }
  })
  showMenu.value = false
}

const handleLocation = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/location'
  })
  showMenu.value = false
}

const handleRules = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/rules'
  })
  showMenu.value = false
}

const handleContact = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/library/contact'
  })
  showMenu.value = false
}

// 生命周期
onLoad(() => {
  loadLibraryData()
})

onShow(() => {
  refreshData()
})

onPullDownRefresh(() => {
  refreshData()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

onReachBottom(() => {
  // 加载更多
})

// 数据加载
const loadLibraryData = () => {
  // 模拟加载数据
  setTimeout(() => {
    uni.showToast({ title: '数据加载完成', icon: 'success' })
  }, 500)
}

const refreshData = () => {
  // 刷新数据逻辑
  uni.showToast({ title: '数据已刷新', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.library-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .back-btn {
      font-size: 40rpx;
      color: #333;
    }
    
    .header-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 30rpx;
    
    .header-icon {
      font-size: 36rpx;
      color: #666;
    }
  }
}

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

.library-scroll {
  flex: 1;
  height: 0;
  padding: 20rpx 30rpx 120rpx;
}

.quick-services {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .service-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .service-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #fff;
        margin-bottom: 12rpx;
      }
      
      .service-text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        line-height: 1.2;
      }
      
      .service-badge {
        position: absolute;
        top: -8rpx;
        right: 8rpx;
        width: 30rpx;
        height: 30rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
      }
    }
  }
}

.borrow-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .borrow-list {
    .borrow-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &.overdue {
        border-left: 4rpx solid #ff3b30;
        padding-left: 16rpx;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .book-cover {
        width: 100rpx;
        height: 140rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }
      
      .book-info {
        flex: 1;
        
        .book-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .book-details {
          display: flex;
          flex-direction: column;
          gap: 8rpx;
          margin-bottom: 12rpx;
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            font-size: 24rpx;
            color: #666;
          }
        }
        
        .overdue-warning {
          display: inline-block;
          padding: 4rpx 12rpx;
          background: #ff3b30;
          color: #fff;
          border-radius: 20rpx;
          font-size: 20rpx;
        }
      }
      
      .book-action {
        .renew-btn {
          padding: 12rpx 24rpx;
          background: #007AFF;
          color: #fff;
          border-radius: 20rpx;
          font-size: 24rpx;
        }
      }
    }
  }
  
  .borrow-summary {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0 0;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 20rpx;
    
    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .summary-label {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .summary-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
}

.recommend-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .recommend-scroll {
    white-space: nowrap;
    
    .recommend-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;
      
      .recommend-cover {
        width: 100%;
        height: 280rpx;
        border-radius: 8rpx;
        margin-bottom: 12rpx;
      }
      
      .recommend-info {
        .recommend-title {
          font-size: 24rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .recommend-author {
          font-size: 20rpx;
          color: #666;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .recommend-rating {
          display: flex;
          align-items: center;
          gap: 4rpx;
          
          .star {
            font-size: 20rpx;
            color: #ccc;
            
            &.active {
              color: #ff9500;
            }
          }
          
          .rating-text {
            font-size: 20rpx;
            color: #999;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}

.seat-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-status {
      display: flex;
      align-items: center;
      gap: 8rpx;
      
      .status-dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
      }
      
      .status-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
  
  .seat-info {
    .seat-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-number {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .stat-label {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .current-reservation {
      .reservation-header {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .reservation-details {
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        margin-bottom: 20rpx;
        
        .detail-item {
          font-size: 24rpx;
          color: #666;
          
          .detail-value {
            color: #333;
            font-weight: 500;
          }
        }
      }
      
      .reservation-actions {
        display: flex;
        gap: 20rpx;
        
        .action-btn {
          flex: 1;
          padding: 20rpx 0;
          text-align: center;
          border-radius: 40rpx;
          font-size: 28rpx;
          background: #f5f5f5;
          color: #666;
          
          &.cancel {
            background: #ff3b30;
            color: #fff;
          }
        }
      }
    }
    
    .seat-action {
      display: flex;
      gap: 20rpx;
      
      .action-btn {
        flex: 1;
        padding: 20rpx 0;
        text-align: center;
        border-radius: 40rpx;
        font-size: 28rpx;
        background: #f5f5f5;
        color: #666;
        
        &.primary {
          background: #007AFF;
          color: #fff;
        }
      }
    }
  }
}

.hot-books-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .hot-books-list {
    .hot-book-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .book-rank {
        width: 40rpx;
        text-align: center;
        font-size: 28rpx;
        font-weight: bold;
        color: #999;
        margin-right: 20rpx;
      }
      
      .book-cover {
        width: 80rpx;
        height: 110rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }
      
      .book-info {
        flex: 1;
        
        .book-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .book-author {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .book-meta {
          display: flex;
          gap: 20rpx;
          
          .meta-item {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
      
      .book-status {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        color: #fff;
        background: #999;
        
        &.available {
          background: #4cd964;
        }
      }
    }
  }
}

.hours-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .hours-list {
    .hours-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &.today {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 8rpx;
        padding: 20rpx;
        margin: 0 -20rpx;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .day {
        font-size: 28rpx;
        color: #333;
        width: 100rpx;
      }
      
      .time {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
      
      .today-tag {
        padding: 4rpx 12rpx;
        background: #007AFF;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
    }
  }
}

.safe-area {
  height: 120rpx;
}

.search-panel {
  position: fixed;
  top: 90rpx;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  .search-tabs {
    display: flex;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #e5e5e5;
    
    .search-tab {
      flex: 1;
      text-align: center;
      padding: 20rpx 0;
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
          width: 40rpx;
          height: 4rpx;
          background: #007AFF;
          border-radius: 2rpx;
        }
      }
    }
  }
  
  .search-results {
    flex: 1;
    padding: 20rpx 30rpx;
    
    .search-result-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .result-type {
        display: inline-block;
        padding: 4rpx 12rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        font-size: 20rpx;
        color: #666;
        margin-bottom: 12rpx;
      }
      
      .result-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .result-author {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .result-meta {
        display: flex;
        gap: 20rpx;
        
        .meta-item {
          font-size: 20rpx;
          color: #999;
          
          &.available {
            color: #4cd964;
          }
          
          &.unavailable {
            color: #ff3b30;
          }
        }
      }
    }
  }
  
  .no-results {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 100rpx;
      color: #ccc;
      margin-bottom: 20rpx;
    }
    
    .no-results-text {
      font-size: 28rpx;
      color: #999;
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

.user-center {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 30rpx;
      
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
      
      .user-detail {
        .user-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .user-id {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .user-department {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .user-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      margin-bottom: 30rpx;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx;
        background: #f5f5f5;
        border-radius: 12rpx;
        
        .stat-number {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .stat-label {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .user-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      margin-bottom: 30rpx;
      
      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rpx;
        padding: 20rpx;
        background: #f5f5f5;
        border-radius: 12rpx;
        font-size: 24rpx;
        color: #333;
      }
    }
    
    .user-settings {
      .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        font-size: 28rpx;
        color: #333;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  
  .modal-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .logout-btn {
      width: 100%;
      padding: 20rpx 0;
      text-align: center;
      background: #ff3b30;
      color: #fff;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
  
  .menu-content {
    width: 100%;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      font-size: 28rpx;
      color: #333;
      
      &.cancel {
        justify-content: center;
        color: #ff3b30;
      }
    }
  }
}
</style>