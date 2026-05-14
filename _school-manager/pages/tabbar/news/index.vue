<!--
 * 文件路径: pages/tabbar/news/index.vue
 * 功能说明: 资讯列表页面
 -->
<template>
	<view class="news-index-page" :class="{ 'night-mode': nightMode }">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-left">
				<view class="location-info" @click="handleLocation">
					<uni-icons type="location-filled" size="20" color="#007AFF"></uni-icons>
					<text class="nav-title">校园资讯</text>
					<uni-icons type="bottom" size="12" color="#666"></uni-icons>
				</view>
			</view>
			<view class="navbar-right">
				<view class="navbar-icon" @click="handleSearch">
					<uni-icons type="search" size="20" color="#666"></uni-icons>
				</view>
				<view class="navbar-icon" @click="handleNotification">
					<uni-icons type="notification-filled" size="20" color="#666"></uni-icons>
					<view v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
				</view>
				<view class="navbar-icon" @click="handleFilter">
					<uni-icons type="more-filled" size="20" color="#666"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 搜索栏组件 -->
		<search-bar 
			v-model:visible="showSearchBar"
			v-model:keyword="searchKeyword"
			:history="searchHistory"
			:hot-list="hotSearchList"
			:results="searchResults"
			@search="handleSearchConfirm"
			@clear="clearSearch"
			@clear-history="clearSearchHistory"
			@history-click="handleHistoryClick"
			@hot-click="handleHotSearchClick"
			@result-click="handleSearchResultClick"
		/>

		<!-- 资讯分类 -->
		<view class="news-tabs">
			<scroll-view 
				class="tabs-scroll" 
				scroll-x 
				:scroll-left="tabsScrollLeft"
				scroll-with-animation
			>
				<view 
					class="tab-item" 
					:class="{ active: currentTab === item.value }"
					v-for="item in newsTabs" 
					:key="item.value"
					:id="'tab-' + item.value"
					@click="handleTabChange(item.value)"
				>
					<view class="tab-icon">
						<uni-icons :type="item.icon" size="20" :color="currentTab === item.value ? '#007AFF' : '#666'"></uni-icons>
					</view>
					<text class="tab-text">{{ item.label }}</text>
					<view v-if="item.badge" class="tab-badge">{{ item.badge }}</view>
				</view>
			</scroll-view>
		</view>

		<!-- 主内容区域 -->
		<scroll-view 
			ref="scrollView"
			class="news-scroll" 
			scroll-y
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="handleRefresh"
			@scrolltolower="handleLoadMore"
			@scroll="onScroll"
			:scroll-top="scrollTop"
			scroll-with-animation
		>
			<!-- 今日要闻 -->
			<view v-if="todayNews.length > 0 && currentTab === 'all'" class="today-news">
				<view class="section-header">
					<view class="section-title">今日要闻</view>
					<view class="section-time">{{ formatDate(new Date(), 'HH:mm') }} 更新</view>
				</view>
				
				<swiper
					class="today-swiper"
					:indicator-dots="todayNews.length > 1"
					:autoplay="true"
					:interval="4000"
					:duration="500"
					circular
					@change="onTodaySwiperChange"
				>
					<swiper-item v-for="news in todayNews" :key="news.id">
						<view class="today-item" @click="handleNewsClick(news)">
							<image class="today-img" :src="news.cover" mode="aspectFill" />
							<view class="today-overlay">
								<view v-if="news.tag" class="today-tag">{{ news.tag }}</view>
								<view class="today-title">{{ news.title }}</view>
								<view class="today-meta">
									<text class="meta-item">{{ news.source }}</text>
									<text class="meta-item">·</text>
									<text class="meta-item">{{ formatTime(news.publishTime) }}</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				
				<view class="today-indicator">
					<view 
						v-for="(news, index) in todayNews" 
						:key="news.id"
						class="indicator-dot"
						:class="{ active: currentTodayIndex === index }"
					></view>
				</view>
			</view>

			<!-- 置顶资讯 -->
			<view v-if="pinnedNews.length > 0 && currentTab === 'all'" class="pinned-section">
        <view class="section-header">
          <view class="section-title">置顶资讯</view>
        </view>
              
        <view class="section-subtitle">
          <view class="subtitle-text">重要资讯，长期有效</view>
        </view>
        
        <swiper
          class="pinned-swiper"
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          circular
        >
          <swiper-item v-for="news in pinnedNews" :key="news.id">
            <view class="pinned-item" @click="handleNewsClick(news)">
              <image class="pinned-img" :src="news.cover" mode="aspectFill" />
              <view class="pinned-overlay">
                <view v-if="news.tag" class="pinned-tag">{{ news.tag }}</view>
                <view class="pinned-title">{{ news.title }}</view>
                <view class="pinned-meta">
                  <text class="meta-item">{{ news.source }}</text>
                  <text class="meta-item">·</text>
                  <text class="meta-item">{{ formatTime(news.publishTime) }}</text>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

			<!-- 热点资讯 -->
			<view v-if="hotNews.length > 0 && currentTab === 'all'" class="hot-section">
				<view class="section-header">
					<view class="section-title">
						<uni-icons type="fire" size="16" color="#ff3b30"></uni-icons>
						<text>热点资讯</text>
					</view>
					<view class="section-more" @click="viewAllHot">
						<text>更多</text>
						<uni-icons type="right" size="12" color="#999"></uni-icons>
					</view>
				</view>
				
				<scroll-view class="hot-scroll" scroll-x>
					<view 
						v-for="news in hotNews" 
						:key="news.id"
						class="hot-item"
						@click="handleNewsClick(news)"
					>
						<view class="hot-img">
							<image :src="news.cover" mode="aspectFill" />
							<view class="hot-badge">热</view>
							<view v-if="news.video" class="video-icon">
								<uni-icons type="videocam" size="16" color="#fff"></uni-icons>
							</view>
						</view>
						<view class="hot-info">
							<view class="hot-title">{{ news.title }}</view>
							<view class="hot-meta">
								<view class="meta-item">
									<uni-icons type="eye" size="12" color="#999"></uni-icons>
									<text>{{ formatNumber(news.viewCount) }}</text>
								</view>
								<view class="meta-item">
									<uni-icons type="chat" size="12" color="#999"></uni-icons>
									<text>{{ formatNumber(news.commentCount) }}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 资讯列表头部 -->
			<view class="news-list-header">
				<view class="header-left">
					<view class="list-title">{{ getTabTitle() }}</view>
					<view class="list-count">{{ filteredNews.length }}条资讯</view>
				</view>
				<view class="header-right">
					<view 
						class="filter-btn" 
						:class="{ active: hasActiveFilters }"
						@click="handleFilter"
					>
						<uni-icons type="filters" size="16" :color="hasActiveFilters ? '#007AFF' : '#666'"></uni-icons>
						<text>筛选</text>
					</view>
					<view 
						class="view-mode-btn" 
						:class="{ active: viewMode === 'list' }"
						@click="viewMode = 'list'"
					>
						<uni-icons type="bars" size="16" :color="viewMode === 'list' ? '#007AFF' : '#666'"></uni-icons>
					</view>
					<view 
						class="view-mode-btn" 
						:class="{ active: viewMode === 'card' }"
						@click="viewMode = 'card'"
					>
						<uni-icons type="grid" size="16" :color="viewMode === 'card' ? '#007AFF' : '#666'"></uni-icons>
					</view>
				</view>
			</view>
        
			<!-- 列表视图 -->
			<view v-if="viewMode === 'list'" class="list-view">
				<news-item 
					v-for="news in currentPageNews" 
					:key="news.id"
					:news="news"
					:view-mode="'list'"
					@click="handleNewsClick(news)"
					@like="handleLike(news.id)"
					@comment="handleCommentClick(news)"
				/>
			</view>
        
			<!-- 卡片视图 -->
			<view v-else class="card-view">
				<view class="card-grid" :class="`grid-${gridColumns}`">
					<news-item 
						v-for="news in currentPageNews" 
						:key="news.id"
						:news="news"
						:view-mode="'card'"
						@click="handleNewsClick(news)"
						@like="handleLike(news.id)"
					/>
				</view>
			</view>
        
			<!-- 空状态 -->
			<view v-if="filteredNews.length === 0" class="empty-list">
				<image class="empty-img" src="/static/images/empty-news.png" mode="aspectFit" />
				<view class="empty-text">{{ emptyText }}</view>
				<view v-if="userRole === 'editor' || userRole === 'admin'" class="empty-action" @click="handlePublish">
					<uni-icons type="plus" size="20" color="#fff"></uni-icons>
					<text>发布资讯</text>
				</view>
				<view v-else-if="currentTab !== 'all'" class="empty-action" @click="currentTab = 'all'">
					查看全部资讯
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="loadingMore" class="loading-more">
				<uni-load-more 
					status="loading" 
					:content-text="{ contentdown: '上拉加载更多', contentrefresh: '正在加载...', contentnomore: '没有更多了' }"
				></uni-load-more>
			</view>
			<view v-if="!hasMoreData && filteredNews.length > 0" class="no-more">
				<text>没有更多了</text>
			</view>

			<!-- 为你推荐 -->
			<view v-if="recommendColumns.length > 0 && currentTab === 'all' && !searchKeyword" class="recommend-section">
				<view class="section-header">
					<view class="section-title">为你推荐</view>
					<view class="section-refresh" @click="refreshRecommend">
						<uni-icons type="refreshempty" size="16" color="#999"></uni-icons>
						<text>换一换</text>
					</view>
				</view>
				
				<view class="columns-grid">
					<view 
						v-for="column in recommendColumns" 
						:key="column.id"
						class="column-item"
						@click="handleColumnClick(column)"
					>
						<view class="column-icon" :style="{ background: column.color }">
							<uni-icons :type="column.icon" size="20" color="#fff"></uni-icons>
						</view>
						<view class="column-info">
							<view class="column-name">{{ column.name }}</view>
							<view class="column-count">{{ column.count }}篇</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部提示 -->
			<view v-if="!searchKeyword && filteredNews.length > 0" class="bottom-tips">
				<view class="tips-content">
					<uni-icons type="info" size="16" color="#999"></uni-icons>
					<text>已加载所有资讯，下拉刷新最新内容</text>
				</view>
			</view>

			<!-- 安全区域 -->
			<view class="safe-area"></view>
		</scroll-view>
		
		<!-- 回到顶部按钮 -->
		<view v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
			<uni-icons type="top" size="20" color="#fff"></uni-icons>
		</view>

		<!-- 筛选面板 -->
		<filter-panel 
			v-model:visible="showFilterPanel"
			:filters="filters"
			:current-sort="currentSort"
			:view-mode="viewMode"
			:grid-columns="gridColumns"
			@filter-change="filters = $event"
			@sort-change="currentSort = $event"
			@grid-change="gridColumns = $event"
			@reset="resetFilters"
			@apply="applyFilters"
		/>

		<!-- 详情模态框 -->
		<news-modal 
			v-model:visible="showNewsDetail"
			:news="selectedNews"
			@share="handleDetailShare"
			@favorite="handleDetailFavorite"
			@like="handleDetailLike"
			@comment="handleDetailComment"
		/>

		<!-- 发布按钮 -->
		<view v-if="userRole === 'editor' || userRole === 'admin'" class="publish-btn" @click="handlePublish">
			<uni-icons type="plus" size="24" color="#fff"></uni-icons>
		</view>
		
		<!-- 夜间模式蒙层 -->
		<view v-if="nightMode" class="night-mode-overlay"></view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { onLoad, onShow, onHide, onPullDownRefresh, onReachBottom, onPageScroll } from '@dcloudio/uni-app'

// 导入组件
import SearchBar from './SearchBar.vue'
import NewsItem from './NewsItem.vue'
import FilterPanel from './FilterPanel.vue'
import NewsModal from './NewsModal.vue'
// 导入工具函数
import { formatRelativeTime } from '@/utils/date'
import { formatNumber as formatNum } from '@/utils/number'

// 响应式数据
const nightMode = ref(false)
const showSearchBar = ref(false)
const showFilterPanel = ref(false)
const showNewsDetail = ref(false)
const showBackToTop = ref(false)
const refreshing = ref(false)
const loadingMore = ref(false)

const currentTab = ref('all')
const viewMode = ref('list') // 'list' or 'card'
const gridColumns = ref(2)
const tabsScrollLeft = ref(0)
const scrollTop = ref(0)
const isNavigating = ref(false) // 标记是否正在跳转

const searchKeyword = ref('')
const searchHistory = ref([])
const hotSearchList = ref([])
const searchResults = ref([])

const filters = ref({
  time: 'all',
  type: 'all'
})
const currentSort = ref('time')

// 数据相关
const newsTabs = ref([
  { value: 'all', label: '全部', icon: 'home', badge: 0 },
  { value: 'notice', label: '通知公告', icon: 'notification', badge: 3 },
  { value: 'campus', label: '校园要闻', icon: 'newspaper', badge: 0 },
  { value: 'activity', label: '学生活动', icon: 'calendar', badge: 5 },
  { value: 'academic', label: '学术动态', icon: 'education', badge: 0 },
  { value: 'policy', label: '政策文件', icon: 'document', badge: 2 }
])
const todayNews = ref([])
const pinnedNews = ref([])
const hotNews = ref([])
const allNews = ref([])
const recommendColumns = ref([])
const currentTodayIndex = ref(0)

const userRole = ref('user')
const unreadCount = ref(3)
const selectedNews = ref(null)

// 计算属性
const filteredNews = computed(() => {
  // 根据当前标签和筛选条件过滤新闻
  let filtered = allNews.value
  
  // 按标签过滤
  if (currentTab.value !== 'all') {
    filtered = filtered.filter(news => news.category === currentTab.value)
  }
  
  // 按时间筛选
  if (filters.value.time !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (filters.value.time) {
      case 'today':
        filtered = filtered.filter(news => new Date(news.publishTime) >= today)
        break
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(news => new Date(news.publishTime) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(news => new Date(news.publishTime) >= monthAgo)
        break
    }
  }
  
  // 按类型筛选
  if (filters.value.type !== 'all') {
    filtered = filtered.filter(news => {
      if (filters.value.type === 'video') return news.video
      if (filters.value.type === 'pinned') return news.pinned
      if (filters.value.type === 'hot') return news.hot
      return true
    })
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (currentSort.value) {
      case 'time':
        return new Date(b.publishTime) - new Date(a.publishTime)
      case 'hot':
        return b.viewCount - a.viewCount
      case 'like':
        return b.likeCount - a.likeCount
      default:
        return new Date(b.publishTime) - new Date(a.publishTime)
    }
  })
  
  return filtered
})

const currentPageNews = computed(() => {
  // 简单分页实现，实际项目应该配合分页参数
  return filteredNews.value.slice(0, 20)
})

const hasActiveFilters = computed(() => {
  return filters.value.time !== 'all' || filters.value.type !== 'all'
})

const hasMoreData = computed(() => {
  return currentPageNews.value.length < filteredNews.value.length
})

const emptyText = computed(() => {
  if (searchKeyword.value) return `未找到"${searchKeyword.value}"相关资讯`
  return currentTab.value === 'all' ? '暂无资讯' : `暂无${getTabTitle()}相关资讯`
})

// 方法
const getTabTitle = () => {
  const tab = newsTabs.value.find(t => t.value === currentTab.value)
  return tab?.label || '资讯'
}

// 事件处理
const handleSearch = () => {
  showSearchBar.value = true
}

const handleFilter = () => {
  showFilterPanel.value = true
}

const handleNotification = () => {
  uni.navigateTo({
    url: '/pages/user/notifications'
  })
}

const handleLocation = () => {
  // 处理位置选择
}

const handleSearchConfirm = () => {
  // 实际项目中应该调用搜索API
  if (searchKeyword.value.trim()) {
    // 添加到搜索历史
    if (!searchHistory.value.includes(searchKeyword.value)) {
      searchHistory.value.unshift(searchKeyword.value)
      // 最多保留10条
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
    }
    
    // 模拟搜索结果
    searchResults.value = allNews.value.filter(news => 
      news.title.includes(searchKeyword.value) || 
      news.summary.includes(searchKeyword.value)
    )
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
}

const clearSearchHistory = () => {
  searchHistory.value = []
}

const handleHistoryClick = (keyword) => {
  searchKeyword.value = keyword
  handleSearchConfirm()
}

const handleHotSearchClick = (keyword) => {
  searchKeyword.value = keyword
  handleSearchConfirm()
}

const handleSearchResultClick = (item) => {
  handleNewsClick(item)
  showSearchBar.value = false
}

const handleTabChange = (tab) => {
  currentTab.value = tab
  // 滚动到当前标签
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select(`#tab-${tab}`).boundingClientRect((rect) => {
      if (rect) {
        tabsScrollLeft.value = rect.left - 30
      }
    }).exec()
  })
  loadNewsData()
}

const handleNewsClick = (news) => {
  // 防止在跳转时触发 scroll 事件导致的错误
  if (isNavigating.value) return
  
  isNavigating.value = true
  try {
    uni.navigateTo({
      url: `/pages/tabbar/news/subpages/detail/index?id=${news.id}`,
      success: () => {
        // 跳转成功后重置标记
        setTimeout(() => {
          isNavigating.value = false
        }, 100)
      },
      fail: (err) => {
        console.error('页面跳转失败:', err)
        isNavigating.value = false
      }
    })
  } catch (error) {
    console.error('跳转错误:', error)
    isNavigating.value = false
  }
}

const handleLike = (newsId) => {
  // 处理点赞
  const news = allNews.value.find(n => n.id === newsId)
  if (news) {
    news.liked = !news.liked
    news.likeCount += news.liked ? 1 : -1
  }
}

const handleCommentClick = (news) => {
  selectedNews.value = news
  showNewsDetail.value = true
}

const handlePublish = () => {
  uni.navigateTo({
    url: '/pages/tabbar/news/subpages/publish/index'
  })
}

const viewAllHot = () => {
  currentTab.value = 'hot'
}

const refreshRecommend = () => {
  // 刷新推荐
}

const handleColumnClick = (column) => {
  // 处理专栏点击
}

const handleRefresh = () => {
  refreshing.value = true
  loadNewsData().finally(() => {
    refreshing.value = false
  })
}

const handleLoadMore = () => {
  if (loadingMore.value || !hasMoreData.value) return
  
  loadingMore.value = true
  // 模拟加载更多
  setTimeout(() => {
    loadingMore.value = false
  }, 1000)
}

const scrollToTop = () => {
  scrollTop.value = 0
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}

const onScroll = (e) => {
  // 如果正在跳转，忽略 scroll 事件
  if (isNavigating.value) return
  
  try {
    if (e && e.detail && typeof e.detail.scrollTop === 'number') {
      scrollTop.value = e.detail.scrollTop
      showBackToTop.value = e.detail.scrollTop > 300
    }
  } catch (error) {
    // 静默处理 scroll 事件错误，避免影响页面跳转
    console.warn('Scroll event error:', error)
  }
}

const onTodaySwiperChange = (e) => {
  currentTodayIndex.value = e.detail.current
}

const resetFilters = () => {
  filters.value = { time: 'all', type: 'all' }
  currentSort.value = 'time'
}

const applyFilters = () => {
  showFilterPanel.value = false
}

const handleDetailShare = () => {
  // 分享处理
}

const handleDetailFavorite = () => {
  // 收藏处理
}

const handleDetailLike = () => {
  // 详情页点赞
  if (selectedNews.value) {
    handleLike(selectedNews.value.id)
  }
}

const handleDetailComment = () => {
  // 详情页评论
}

// 数据加载
const loadNewsData = async () => {
  try {
    // 使用 mock 数据
    let mockData = []
    
    // 尝试从 mock 模块获取数据
    try {
      const newsMock = await import('@/mock/modules/news.js')
      const newsListRes = newsMock.getNewsList()
      mockData = newsListRes.list || []
      
      // 加载各类新闻
      const hotRes = newsMock.getHotNews()
      hotNews.value = hotRes.list || []
      
      const pinnedRes = newsMock.getPinnedNews()
      pinnedNews.value = pinnedRes.list || []
      
      const todayRes = newsMock.getTodayNews()
      todayNews.value = todayRes.list || []
      
      // 加载热搜榜
      const hotSearchRes = newsMock.getHotSearch()
      hotSearchList.value = hotSearchRes || []
    } catch (error) {
      console.warn('使用 mock 数据失败，使用默认数据:', error)
      // 如果 mock 导入失败，使用默认数据
      mockData = [
        {
          id: 1,
          title: '关于开展2024年春季学期开学工作的通知',
          summary: '根据学校工作安排，现将2024年春季学期开学工作有关事项通知如下...',
          cover: '/static/images/news1.jpg',
          tag: '通知',
          source: '校办',
          author: '校长办公室',
          publishTime: '2024-02-25 09:00:00',
          viewCount: 1250,
          likeCount: 86,
          commentCount: 24,
          category: 'notice',
          pinned: true,
          hot: false,
          liked: false,
          video: false,
          enableJoin: false
        }
      ]
      todayNews.value = mockData.slice(0, 3)
      pinnedNews.value = mockData.filter(n => n.pinned)
      hotNews.value = mockData.filter(n => n.hot)
    }
    
    allNews.value = mockData
    
    // 热搜榜已在上面加载，如果没有则使用默认数据
    if (!hotSearchList.value || hotSearchList.value.length === 0) {
      hotSearchList.value = [
        { id: 1, keyword: '开学通知', count: 1250, tag: { text: '热', type: 'hot' } },
        { id: 2, keyword: '考研复试', count: 980, tag: { text: '新', type: 'new' } },
        { id: 3, keyword: '校园招聘', count: 756, tag: null },
        { id: 4, keyword: '奖学金评选', count: 654, tag: null },
      ]
    }
    
    // 模拟推荐栏目
    recommendColumns.value = [
      { id: 1, name: '学术讲座', icon: 'mic', color: '#007AFF', count: 12 },
      { id: 2, name: '校园活动', icon: 'calendar', color: '#34C759', count: 8 },
      { id: 3, name: '招聘信息', icon: 'person', color: '#FF9500', count: 15 },
      { id: 4, name: '科研成果', icon: 'compose', color: '#FF3B30', count: 6 },
    ]
    
  } catch (error) {
    console.error('加载新闻数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

// 辅助函数
const formatDate = (date, format = 'YYYY-MM-DD') => {
  // 简单格式化日期
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  
  if (format === 'HH:mm') return `${hours}:${minutes}`
  return `${year}-${month}-${day}`
}

const formatTime = (timeStr) => {
  return formatRelativeTime(timeStr)
}

const formatNumber = (num) => {
  return formatNum(num)
}

// 生命周期
onLoad(() => {
  loadNewsData()
})

onShow(() => {
  // 页面显示时的逻辑
})

onHide(() => {
  // 页面隐藏时的逻辑
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

onReachBottom(() => {
  handleLoadMore()
})

onPageScroll((e) => {
  try {
    if (e && typeof e.scrollTop === 'number') {
      showBackToTop.value = e.scrollTop > 300
    }
  } catch (error) {
    console.warn('Page scroll error:', error)
  }
})
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-index-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  position: relative;
  transition: all 0.3s ease;

  &.night-mode {
    background: #1a1a1a;
    color: #e0e0e0;
  }
}

.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1rpx solid rgba(229, 229, 229, 0.8);

  .night-mode & {
    background: rgba(26, 26, 26, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .navbar-left {
    .location-info {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background: rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      .night-mode & {
        background: rgba(255, 255, 255, 0.1);
      }

      &:active {
        opacity: 0.7;
        transform: scale(0.98);
      }

      .nav-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .navbar-icon {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .badge {
        position: absolute;
        top: -4rpx;
        right: -4rpx;
        min-width: 16rpx;
        height: 16rpx;
        padding: 0 4rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 8rpx;
        font-size: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1rpx solid #fff;

        .night-mode & {
          border-color: #1a1a1a;
        }
      }
    }
  }
}

.news-tabs {
  position: fixed;
  top: 90rpx;
  left: 0;
  right: 0;
  height: 80rpx;
  background: #fff;
  border-bottom: 1rpx solid $gray-2;
  z-index: 900;

  .night-mode & {
    background: #1a1a1a;
    border-bottom-color: #444;
  }

  .tabs-scroll {
    white-space: nowrap;
    height: 100%;
    padding: 0 30rpx;

    .tab-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 20rpx;
      position: relative;
      transition: all 0.3s ease;

      &:active {
        opacity: 0.7;
      }

      &.active {
        .tab-text {
          color: $primary-color;
          font-weight: bold;
        }
      }

      .tab-icon {
        margin-right: 8rpx;
      }

      .tab-text {
        font-size: 26rpx;
        color: $gray-6;
        transition: color 0.3s;

        .night-mode & {
          color: #999;
        }
      }

      .tab-badge {
        position: absolute;
        top: 12rpx;
        right: 4rpx;
        min-width: 20rpx;
        height: 20rpx;
        padding: 0 4rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 10rpx;
        font-size: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.news-scroll {
  flex: 1;
  height: 0;
  padding-top: 170rpx; /* 90rpx导航栏 + 80rpx标签栏 */
  padding-bottom: 40rpx;
}

.today-news {
  padding: 0 30rpx 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $gray-8;

      .night-mode & {
        color: #e0e0e0;
      }
    }

    .section-time {
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }
    }
  }

  .today-swiper {
    height: 300rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .today-item {
      position: relative;
      width: 100%;
      height: 100%;

      .today-img {
        width: 100%;
        height: 100%;
      }

      .today-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30rpx;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));

        .today-tag {
          display: inline-block;
          padding: 4rpx 12rpx;
          background: $primary-color;
          color: #fff;
          border-radius: 12rpx;
          font-size: 20rpx;
          margin-bottom: 12rpx;
        }

        .today-title {
          font-size: 30rpx;
          font-weight: bold;
          color: #fff;
          line-height: 1.4;
          margin-bottom: 8rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .today-meta {
          display: flex;
          align-items: center;
          gap: 12rpx;
          font-size: 22rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .today-indicator {
    display: flex;
    justify-content: center;
    gap: 8rpx;
    margin-top: 16rpx;

    .indicator-dot {
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background: $gray-3;
      transition: all 0.3s ease;

      .night-mode & {
        background: #444;
      }

      &.active {
        width: 24rpx;
        background: $primary-color;
        border-radius: 4rpx;
      }
    }
  }
}

.pinned-section {
  padding: 0 30rpx 30rpx;

  .section-header {
    margin-bottom: 16rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $gray-8;

      .night-mode & {
        color: #e0e0e0;
      }
    }
  }

  .section-subtitle {
    margin-bottom: 20rpx;

    .subtitle-text {
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }
    }
  }

  .pinned-swiper {
    height: 250rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .pinned-item {
      position: relative;
      width: 100%;
      height: 100%;

      .pinned-img {
        width: 100%;
        height: 100%;
      }

      .pinned-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rpx;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));

        .pinned-tag {
          display: inline-block;
          padding: 4rpx 12rpx;
          background: #ff3b30;
          color: #fff;
          border-radius: 12rpx;
          font-size: 20rpx;
          margin-bottom: 8rpx;
        }

        .pinned-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #fff;
          line-height: 1.4;
          margin-bottom: 8rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pinned-meta {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 20rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}

.hot-section {
  padding: 0 30rpx 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: $gray-8;

      .night-mode & {
        color: #e0e0e0;
      }
    }

    .section-more {
      display: flex;
      align-items: center;
      gap: 4rpx;
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }

  .hot-scroll {
    white-space: nowrap;

    .hot-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;

      &:last-child {
        margin-right: 0;
      }

      .hot-img {
        position: relative;
        width: 200rpx;
        height: 120rpx;
        border-radius: 12rpx;
        overflow: hidden;
        margin-bottom: 12rpx;

        image {
          width: 100%;
          height: 100%;
        }

        .hot-badge {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          padding: 4rpx 8rpx;
          background: #ff3b30;
          color: #fff;
          border-radius: 12rpx;
          font-size: 18rpx;
        }

        .video-icon {
          position: absolute;
          bottom: 8rpx;
          right: 8rpx;
          width: 30rpx;
          height: 30rpx;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .hot-info {
        .hot-title {
          font-size: 26rpx;
          font-weight: 500;
          color: $gray-8;
          line-height: 1.4;
          margin-bottom: 8rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: normal;

          .night-mode & {
            color: #e0e0e0;
          }
        }

        .hot-meta {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4rpx;
            font-size: 22rpx;
            color: $gray-5;

            .night-mode & {
              color: #999;
            }
          }
        }
      }
    }
  }
}

.news-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid $gray-2;

  .night-mode & {
    background: #1a1a1a;
    border-bottom-color: #444;
  }

  .header-left {
    .list-title {
      font-size: 30rpx;
      font-weight: bold;
      color: $gray-8;
      margin-bottom: 4rpx;

      .night-mode & {
        color: #e0e0e0;
      }
    }

    .list-count {
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .filter-btn,
    .view-mode-btn {
      display: flex;
      align-items: center;
      gap: 4rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background: $gray-1;
      transition: all 0.3s ease;

      .night-mode & {
        background: #2a2a2a;
      }

      &.active {
        background: rgba(0, 122, 255, 0.1);
        color: $primary-color;

        .night-mode & {
          background: rgba(0, 122, 255, 0.2);
        }
      }

      &:active {
        opacity: 0.7;
        transform: scale(0.95);
      }
    }

    .view-mode-btn {
      padding: 8rpx;
    }
  }
}

.list-view {
  .news-item {
    padding: 30rpx;
    border-bottom: 1rpx solid $gray-2;
    background: #fff;
    transition: all 0.3s ease;

    .night-mode & {
      background: #1a1a1a;
      border-bottom-color: #444;
    }

    &:active {
      background: $gray-0;

      .night-mode & {
        background: #222;
      }
    }

    &.pinned {
      background: linear-gradient(90deg, rgba(0, 122, 255, 0.05) 0%, rgba(0, 122, 255, 0) 100%);
      border-left: 4rpx solid $primary-color;

      .night-mode & {
        background: linear-gradient(90deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0) 100%);
      }
    }

    &.hot {
      background: linear-gradient(90deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 59, 48, 0) 100%);
      border-left: 4rpx solid #ff3b30;

      .night-mode & {
        background: linear-gradient(90deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 59, 48, 0) 100%);
      }
    }
  }
}

.card-view {
  padding: 20rpx 30rpx;

  .card-grid {
    display: grid;
    gap: 20rpx;

    &.grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    &.grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .news-card {
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      .night-mode & {
        background: #2a2a2a;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: translateY(-4rpx);
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
      }

      &.pinned {
        border: 2rpx solid $primary-color;
      }

      &.hot {
        border: 2rpx solid #ff3b30;
      }
    }
  }
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 30rpx;

  .empty-img {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 28rpx;
    color: $gray-5;
    margin-bottom: 30rpx;

    .night-mode & {
      color: #999;
    }
  }

  .empty-action {
    padding: 20rpx 40rpx;
    background: $primary-color;
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }
}

.loading-more,
.no-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;

  .no-more {
    font-size: 24rpx;
    color: $gray-5;

    .night-mode & {
      color: #999;
    }
  }
}

.recommend-section {
  padding: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: $gray-8;

      .night-mode & {
        color: #e0e0e0;
      }
    }

    .section-refresh {
      display: flex;
      align-items: center;
      gap: 4rpx;
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }

  .columns-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .column-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: $gray-0;
      border-radius: 12rpx;
      transition: all 0.3s ease;

      .night-mode & {
        background: #2a2a2a;
      }

      &:active {
        opacity: 0.7;
        transform: scale(0.98);
      }

      .column-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
      }

      .column-info {
        flex: 1;

        .column-name {
          font-size: 26rpx;
          font-weight: 500;
          color: $gray-8;
          margin-bottom: 4rpx;

          .night-mode & {
            color: #e0e0e0;
          }
        }

        .column-count {
          font-size: 22rpx;
          color: $gray-5;

          .night-mode & {
            color: #999;
          }
        }
      }
    }
  }
}

.bottom-tips {
  padding: 30rpx;
  text-align: center;

  .tips-content {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: $gray-5;

    .night-mode & {
      color: #999;
    }
  }
}

.safe-area {
  height: 120rpx;
}

.back-to-top {
  position: fixed;
  bottom: calc(140rpx + env(safe-area-inset-bottom));
  right: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
  transition: all 0.3s ease;

  &:active {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(0.95);
  }
}

.publish-btn {
  position: fixed;
  bottom: calc(140rpx + env(safe-area-inset-bottom));
  left: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background: $primary-color;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
  transition: all 0.3s ease;

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.night-mode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9998;
  pointer-events: none;
}
</style>