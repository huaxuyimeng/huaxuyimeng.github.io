<!--
 * 文件路径: pages/tabbar/index/index.vue
 * 功能说明: 首页/主页
 * 主要功能:
 *   1. 显示校园资讯列表
 *   2. 搜索功能
 *   3. 分类筛选
 *   4. 热门推荐
 *   5. 下拉刷新、上拉加载
 * 数据来源: API接口或本地存储
 * 相关页面: pages/tabbar/news/subpages/detail/index.vue (新闻详情)
 -->
<template>
  <view class="home-index-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left">
        <view class="location-info" @click="handleLocation">
          <text class="iconfont">📍</text>
          <text class="location-text">{{ currentLocation.name }}</text>
          <text class="iconfont">▼</text>
        </view>
      </view>
      <view class="navbar-right">
        <view class="navbar-icon" @click="handleSearch">
          <text class="iconfont">🔍</text>
        </view>
        <view class="navbar-icon" @click="handleScan">
          <text class="iconfont">📷</text>
        </view>
        <view class="navbar-icon" @click="handleNotification">
          <view v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
          <text class="iconfont">🔔</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="showSearch" class="search-bar">
      <view class="search-input-wrapper">
        <text class="iconfont">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索功能、资讯、活动..." 
          v-model="searchKeyword"
          @confirm="handleSearchConfirm"
          :focus="showSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
      </view>
      <view class="search-cancel" @click="hideSearch">取消</view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view 
      class="home-scroll" 
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="handleLoadMore"
    >
      <!-- 顶部天气和日期 -->
      <view class="top-section">
        <view class="weather-info">
          <view class="weather-main">
            <view class="weather-icon">
              <text class="iconfont">{{ getWeatherIcon(weather.weather) }}</text>
            </view>
            <view class="weather-detail">
              <view class="temperature">{{ weather.temperature }}°</view>
              <view class="weather-text">{{ weather.weather }}</view>
            </view>
          </view>
          <view class="weather-extras">
            <view class="extra-item">
              <text>空气质量</text>
              <text class="aqi-value" :style="{ color: getAirQualityColor(weather.aqi) }">{{ weather.aqi }}</text>
            </view>
            <view class="extra-item">
              <text>湿度</text>
              <text>{{ weather.humidity }}%</text>
            </view>
          </view>
        </view>
        
        <view class="date-section">
          <view class="current-date">
            <view class="date-main">{{ formatDate(currentDate, 'MM月dd日') }}</view>
            <view class="date-week">{{ formatDate(currentDate, 'EEEE') }}</view>
          </view>
          <view class="calendar-btn" @click="handleCalendar">
            <text class="iconfont">📅</text>
            <text>校历</text>
          </view>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-access">
        <view class="section-header">
          <view class="section-title">快捷入口</view>
          <view class="section-more" @click="viewAllQuickAccess">更多</view>
        </view>
        
        <view class="quick-grid">
          <view 
            v-for="item in quickAccess" 
            :key="item.id"
            class="quick-item"
            @click="handleQuickAccess(item)"
          >
            <view class="quick-icon" :style="{ background: item.color }">
              <uni-icons :type="getQuickAccessIcon(item.id)" size="24" color="#fff"></uni-icons>
            </view>
            <view class="quick-text">{{ item.name }}</view>
            <view v-if="item.badge" class="quick-badge">{{ item.badge }}</view>
          </view>
        </view>
      </view>

      <!-- 轮播图 -->
      <view v-if="banners.length > 0" class="banner-section">
        <swiper
          class="home-swiper"
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          circular
        >
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <view class="swiper-item" @click="handleBannerClick(banner)">
              <image class="banner-img" :src="banner.image" mode="aspectFill" />
              <view v-if="banner.title" class="banner-title">{{ banner.title }}</view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 今日课程 -->
      <view v-if="todayCourses.length > 0" class="today-courses">
        <view class="section-header">
          <view class="section-title">
            <text class="title-icon">📚</text>
            <text>今日课程</text>
          </view>
          <view class="section-more" @click="viewTimetable">
            <text>课程表</text>
            <text class="arrow">›</text>
          </view>
        </view>
        
        <view class="courses-list">
          <view 
            v-for="course in todayCourses" 
            :key="course.id"
            class="course-item"
            :class="{ 'current': course.isCurrent, 'ended': course.isEnded, 'upcoming': !course.isCurrent && !course.isEnded }"
            @click="handleCourseClick(course)"
          >
            <view class="course-time">
              <view class="time-range">{{ course.startTime }}-{{ course.endTime }}</view>
              <view class="course-status" v-if="course.isCurrent">
                <text class="status-dot"></text>
                <text>进行中</text>
              </view>
              <view class="course-status upcoming" v-else-if="!course.isEnded">
                <text>即将开始</text>
              </view>
            </view>
            <view class="course-info">
              <view class="course-name">{{ course.name }}</view>
              <view class="course-detail">
                <view class="detail-row">
                  <text class="detail-icon">👨‍🏫</text>
                  <text class="detail-item">{{ course.teacher }}</text>
                </view>
                <view class="detail-row">
                  <text class="detail-icon">📍</text>
                  <text class="detail-item">{{ course.location }}</text>
                </view>
              </view>
            </view>
            <view class="course-action">
              <view v-if="course.isCurrent && !course.isCheckedIn" class="checkin-btn" @click.stop="handleCheckin(course.id)">
                <text class="checkin-icon">✓</text>
                <text>签到</text>
              </view>
              <view v-if="course.isCurrent && course.isCheckedIn" class="checkin-btn checked">
                <text class="checkin-icon">✓</text>
                <text>已签到</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 校园新闻 -->
      <view v-if="newsList.length > 0" class="news-section">
        <view class="section-header">
          <view class="section-title">校园新闻</view>
          <view class="section-more" @click="viewAllNews">更多</view>
        </view>
        
        <view class="news-list">
          <view 
            v-for="news in newsList" 
            :key="news.id"
            class="news-item"
            @click="handleNewsClick(news)"
          >
            <view class="news-img">
              <image :src="news.cover" mode="aspectFill" />
              <view v-if="news.hot" class="hot-tag">热</view>
              <view v-if="news.new" class="new-tag">新</view>
            </view>
            <view class="news-info">
              <view class="news-title">{{ news.title }}</view>
              <view class="news-desc">{{ news.summary }}</view>
              <view class="news-meta">
                <view class="meta-item">
                  <text class="iconfont">👁️</text>
                  <text>{{ news.viewCount }}</text>
                </view>
                <view class="meta-item">
                  <text class="iconfont">💬</text>
                  <text>{{ news.commentCount }}</text>
                </view>
                <view class="meta-item">
                  <text>{{ formatTime(news.publishTime) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 校园活动 -->
      <view v-if="activities.length > 0" class="activities-section">
        <view class="section-header">
          <view class="section-title">校园活动</view>
          <view class="section-more" @click="viewAllActivities">更多</view>
        </view>
        
        <scroll-view class="activities-scroll" scroll-x>
          <view 
            v-for="activity in activities" 
            :key="activity.id"
            class="activity-item"
            @click="handleActivityClick(activity)"
          >
            <view class="activity-img">
              <image :src="activity.cover" mode="aspectFill" />
              <view class="activity-status" :class="getActivityStatusClass(activity.status)">
                {{ getActivityStatusText(activity.status) }}
              </view>
            </view>
            <view class="activity-info">
              <view class="activity-title">{{ activity.title }}</view>
              <view class="activity-time">
                <text class="iconfont">📅</text>
                <text>{{ formatActivityTime(activity.startTime) }}</text>
              </view>
              <view class="activity-location">
                <text class="iconfont">📍</text>
                <text>{{ activity.location }}</text>
              </view>
              <view class="activity-footer">
                <view class="participants">
                  <text class="iconfont">👥</text>
                  <text>{{ activity.participantCount }}人参加</text>
                </view>
                <view v-if="activity.registered" class="registered-tag">已报名</view>
                <view v-else-if="activity.status === 'registering'" class="register-btn" @click.stop="handleActivityRegister(activity.id)">
                  报名
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 常用功能 -->
      <view class="common-functions">
        <view class="section-header">
          <view class="section-title">常用功能</view>
          <view class="section-more" @click="customizeFunctions">自定义</view>
        </view>
        
        <view class="functions-grid">
          <view 
            v-for="func in commonFunctions" 
            :key="func.id"
            class="function-item"
            @click="handleFunctionClick(func)"
          >
            <view class="function-icon" :style="{ background: func.color }">
              <uni-icons :type="getFunctionIcon(func.id)" size="24" color="#fff"></uni-icons>
            </view>
            <view class="function-text">{{ func.name }}</view>
            <view v-if="func.badge" class="function-badge">{{ func.badge }}</view>
          </view>
        </view>
      </view>

      <!-- 通知公告 -->
      <view v-if="notices.length > 0" class="notice-section">
        <view class="section-header">
          <view class="section-title">通知公告</view>
          <view class="section-more" @click="viewAllNotices">更多</view>
        </view>
        
        <view class="notice-list">
          <swiper
            class="notice-swiper"
            vertical
            :autoplay="true"
            :interval="3000"
            :duration="500"
            circular
          >
            <swiper-item v-for="notice in notices" :key="notice.id">
              <view class="notice-item" @click="handleNoticeClick(notice)">
                <view class="notice-icon" :class="getNoticeTypeClass(notice.type)">
                  <text class="iconfont">{{ getNoticeIcon(notice.type) }}</text>
                </view>
                <view class="notice-content">
                  <view class="notice-title">{{ notice.title }}</view>
                  <view class="notice-time">{{ formatTime(notice.publishTime) }}</view>
                </view>
                <view class="notice-action">
                  <text class="iconfont">→</text>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>

      <!-- 学习资源 -->
      <view v-if="learningResources.length > 0" class="learning-section">
        <view class="section-header">
          <view class="section-title">学习资源</view>
          <view class="section-more" @click="viewAllLearning">更多</view>
        </view>
        
        <view class="resources-list">
          <view 
            v-for="resource in learningResources" 
            :key="resource.id"
            class="resource-item"
            @click="handleResourceClick(resource)"
          >
            <view class="resource-icon" :style="{ background: resource.color }">
              <uni-icons :type="getResourceIcon(resource.id)" size="20" color="#fff"></uni-icons>
            </view>
            <view class="resource-info">
              <view class="resource-title">{{ resource.title }}</view>
              <view class="resource-desc">{{ resource.description }}</view>
              <view class="resource-meta">
                <text class="meta-item">{{ resource.count }}个资源</text>
                <text class="meta-item">更新于{{ formatTime(resource.updateTime) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 校园服务 -->
      <view class="service-section">
        <view class="section-header">
          <view class="section-title">校园服务</view>
        </view>
        
        <view class="service-grid">
          <view 
            v-for="service in services" 
            :key="service.id"
            class="service-item"
            @click="handleServiceClick(service)"
          >
            <view class="service-icon" :style="{ background: service.color }">
              <uni-icons :type="getServiceIcon(service.id)" size="20" color="#fff"></uni-icons>
            </view>
            <view class="service-info">
              <view class="service-name">{{ service.name }}</view>
              <view class="service-status">{{ service.status }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="bottom-tips">
        <view class="tips-content">
          <text class="iconfont">💡</text>
          <text>已加载所有内容，下拉刷新最新信息</text>
        </view>
      </view>

      <!-- 安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 浮动按钮 -->
    <view v-if="showFloatButtons" class="float-buttons">
      <view class="float-btn main-btn" @click="handleQuickAction">
        <text class="iconfont">+</text>
      </view>
      <view v-if="showAssistant" class="float-btn assistant-btn" @click.stop="handleAssistant">
        <text class="assistant-icon">🤖</text>
      </view>
      <view v-if="showFeedback" class="float-btn feedback-btn" @click="handleFeedback">
        <text class="iconfont">💬</text>
      </view>
    </view>

    <!-- 搜索面板 -->
    <view v-if="showSearchPanel" class="search-panel-overlay" @click="hideSearchPanel">
      <view class="search-panel" @click.stop>
        <view class="search-header">
          <view class="search-title">搜索</view>
          <view class="search-close" @click="hideSearchPanel">×</view>
        </view>
        
        <view class="search-history" v-if="searchHistory.length > 0">
          <view class="history-header">
            <view class="history-title">搜索历史</view>
            <view class="history-clear" @click="clearSearchHistory">清除</view>
          </view>
          <view class="history-tags">
            <view 
              v-for="item in searchHistory" 
              :key="item"
              class="history-tag"
              @click="handleHistoryTag(item)"
            >
              {{ item }}
            </view>
          </view>
        </view>
        
        <view class="search-hot">
          <view class="hot-title">热门搜索</view>
          <view class="hot-tags">
            <view 
              v-for="item in hotKeywords" 
              :key="item"
              class="hot-tag"
              @click="handleHotTag(item)"
            >
              {{ item }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 签到模态框 -->
    <view v-if="showCheckinModal" class="modal-overlay" @click="hideCheckinModal">
      <view class="modal-content checkin-modal" @click.stop>
        <view class="modal-header">
          <text>课程签到</text>
          <view class="modal-close" @click="hideCheckinModal">×</view>
        </view>
        
        <view class="modal-body">
          <view class="checkin-content">
            <view class="checkin-icon">
              <text class="iconfont">✅</text>
            </view>
            <view class="checkin-title">{{ currentCourse?.name }} 签到</view>
            <view class="checkin-info">
              <view class="info-item">
                <text>地点：</text>
                <text>{{ currentCourse?.location }}</text>
              </view>
              <view class="info-item">
                <text>教师：</text>
                <text>{{ currentCourse?.teacher }}</text>
              </view>
              <view class="info-item">
                <text>时间：</text>
                <text>{{ currentCourse?.startTime }}-{{ currentCourse?.endTime }}</text>
              </view>
            </view>
            <view class="checkin-code">
              <view class="code-title">签到码</view>
              <view class="code-value">{{ checkinCode }}</view>
              <view class="code-tip">请在老师处输入此签到码</view>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="footer-btn primary" @click="confirmCheckin">确认签到</view>
        </view>
      </view>
    </view>

    <!-- 快捷操作菜单 -->
    <view v-if="showQuickMenu" class="menu-overlay" @click="hideQuickMenu">
      <view class="menu-content quick-menu" @click.stop>
        <view class="menu-grid">
          <view 
            v-for="item in quickMenuItems" 
            :key="item.id"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <view class="menu-icon" :style="{ background: item.color }">
              <uni-icons :type="getMenuIcon(item.id)" size="20" color="#fff"></uni-icons>
            </view>
            <view class="menu-text">{{ item.name }}</view>
          </view>
        </view>
        <view class="menu-cancel" @click="hideQuickMenu">取消</view>
      </view>
    </view>

    <!-- 学校选择器 -->
    <view v-if="showSchoolPicker" class="picker-overlay" @click="hideSchoolPicker">
      <view class="picker-content school-picker" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择学校</text>
          <text class="picker-close" @click="hideSchoolPicker">×</text>
        </view>
        <scroll-view class="picker-scroll" scroll-y>
          <view class="school-list">
            <view 
              v-for="school in schoolList" 
              :key="school.id"
              class="school-item"
              :class="{ active: currentLocation.name === school.name }"
              @click="selectSchool(school)"
            >
              <view class="school-info">
                <text class="school-name">{{ school.name }}</text>
                <text class="school-city">{{ school.city }}</text>
              </view>
              <view v-if="currentLocation.name === school.name" class="check-icon">✓</view>
            </view>
          </view>
        </scroll-view>
        <view class="picker-tip">
          <text>💡 可在个人中心-个人信息中修改学校</text>
        </view>
      </view>
    </view>

    <!-- 活动通知面板 -->
    <view v-if="showNotificationPanel" class="picker-overlay" @click="hideNotificationPanel">
      <view class="picker-content notification-panel" @click.stop>
        <view class="picker-header">
          <text class="picker-title">🔔 活动通知</text>
          <view class="header-actions">
            <text class="mark-all-read" @click="markAllAsRead">全部已读</text>
            <text class="picker-close" @click="hideNotificationPanel">×</text>
          </view>
        </view>
        <scroll-view class="picker-scroll notification-scroll" scroll-y>
          <view v-if="activityNotifications.length === 0" class="empty-notifications">
            <text class="empty-icon">🔔</text>
            <text class="empty-text">暂无新通知</text>
          </view>
          <view v-else class="notification-list">
            <view 
              v-for="notification in activityNotifications" 
              :key="notification.id"
              class="notification-item"
              :class="{ unread: !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <view class="notification-icon" :class="getNotificationTypeClass(notification.type)">
                <text>{{ getNotificationIcon(notification.type) }}</text>
              </view>
              <view class="notification-content">
                <view class="notification-title">{{ notification.title }}</view>
                <view class="notification-message">{{ notification.message }}</view>
                <view class="notification-time">{{ formatNotificationTime(notification.time) }}</view>
              </view>
              <view v-if="!notification.read" class="unread-dot"></view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

// 响应式数据
const showSearch = ref(false)
const showSearchPanel = ref(false)
const showCheckinModal = ref(false)
const showQuickMenu = ref(false)
const showFloatButtons = ref(true)
const showAssistant = ref(true)
const showFeedback = ref(true)
const showSchoolPicker = ref(false)
const showNotificationPanel = ref(false)
const searchKeyword = ref('')
const refreshing = ref(false)
const loadingMore = ref(false)
const hasMoreData = ref(true)
const unreadCount = ref(3)
const currentLocation = ref({
  name: '浙江大学',
  latitude: 30.263,
  longitude: 120.105,
  city: '杭州'
})
const currentDate = ref(new Date())
const checkinCode = ref('')
const currentCourse = ref(null)
const currentPage = ref(1)
const pageSize = 20
const weatherLoading = ref(false)

// 学校列表
const schoolList = ref([
  { id: 1, name: '浙江大学', city: '杭州', latitude: 30.263, longitude: 120.105 },
  { id: 2, name: '清华大学', city: '北京', latitude: 40.002, longitude: 116.326 },
  { id: 3, name: '北京大学', city: '北京', latitude: 39.992, longitude: 116.310 },
  { id: 4, name: '复旦大学', city: '上海', latitude: 31.298, longitude: 121.504 },
  { id: 5, name: '上海交通大学', city: '上海', latitude: 31.032, longitude: 121.435 },
  { id: 6, name: '南京大学', city: '南京', latitude: 32.060, longitude: 118.802 },
  { id: 7, name: '武汉大学', city: '武汉', latitude: 30.539, longitude: 114.360 },
  { id: 8, name: '中山大学', city: '广州', latitude: 23.095, longitude: 113.297 },
  { id: 9, name: '四川大学', city: '成都', latitude: 30.635, longitude: 104.090 },
  { id: 10, name: '西安交通大学', city: '西安', latitude: 34.238, longitude: 108.945 }
])

// 活动通知列表
const activityNotifications = ref([
  {
    id: 1,
    type: 'start',
    title: '人工智能前沿讲座',
    message: '您关注的活动即将开始',
    time: '2024-12-25 14:00:00',
    activityId: 1,
    read: false
  },
  {
    id: 2,
    type: 'checkin',
    title: '校园篮球友谊赛',
    message: '活动签到已开启，请及时签到',
    time: '2024-12-22 14:50:00',
    activityId: 2,
    read: false
  },
  {
    id: 3,
    type: 'reminder',
    title: '考研经验分享会',
    message: '活动将于明天开始，请做好准备',
    time: '2024-12-27 19:00:00',
    activityId: 3,
    read: true
  },
  {
    id: 4,
    type: 'end',
    title: '编程马拉松大赛',
    message: '活动已结束，感谢您的参与',
    time: '2024-12-20 18:00:00',
    activityId: 4,
    read: true
  }
])

// 天气数据
const weather = ref({
  temperature: 20,
  weather: '晴',
  aqi: 41,
  humidity: 74,
  wind: '东北风',
  windLevel: '2级'
})

// 快捷入口
const quickAccess = ref([
  { id: 1, name: '课程表', icon: 'icon-schedule', color: '#007AFF', path: '/pages/tabbar/function/subpages/calendar/index' },
  { id: 2, name: '图书馆', icon: 'icon-library', color: '#4cd964', path: '/pages/tabbar/function/subpages/library/index' },
  { id: 3, name: '一卡通', icon: 'icon-card', color: '#ff9500', path: '/pages/tabbar/function/subpages/card/index' },
  { id: 4, name: '校园地图', icon: 'icon-map', color: '#5856d6', path: '/pages/tabbar/function/subpages/map/index' },
  { id: 5, name: '食堂菜单', icon: 'icon-canteen', color: '#ff3b30', path: '/pages/tabbar/function/subpages/canteen/index' },
  { id: 6, name: '校车查询', icon: 'icon-bus', color: '#5ac8fa', badge: '2', path: '/pages/tabbar/function/subpages/bus/index' },
  { id: 7, name: '成绩查询', icon: 'icon-score', color: '#ff2d55', path: '/pages/tabbar/function/subpages/score/index' },
  { id: 8, name: '失物招领', icon: 'icon-lost', color: '#ffcc00', path: '/pages/tabbar/function/subpages/lost/index' }
])

// 轮播图
const banners = ref([
  { id: 1, image: '/static/images/banner1.jpg', title: '校园科技节火热进行中', url: '/pages/tabbar/index/news-detail/index?id=1' },
  { id: 2, image: '/static/images/banner2.jpg', title: '冬季招聘会即将开始', url: '/pages/tabbar/activity/subpages/detail/index?id=2' },
  { id: 3, image: '/static/images/banner3.jpg', title: '图书馆新增自习室', url: '/pages/tabbar/index/news-detail/index?id=3' }
])

// 今日课程
const todayCourses = ref([
  { 
    id: 1, 
    name: '高等数学', 
    teacher: '张老师',
    location: '教学楼A101',
    startTime: '08:00',
    endTime: '09:40',
    isCurrent: true,
    isEnded: false,
    isCheckedIn: false
  },
  { 
    id: 2, 
    name: '大学物理', 
    teacher: '李老师',
    location: '实验楼302',
    startTime: '10:00',
    endTime: '11:40',
    isCurrent: false,
    isEnded: false,
    isCheckedIn: false
  },
  { 
    id: 3, 
    name: '计算机基础', 
    teacher: '王老师',
    location: '计科楼201',
    startTime: '14:00',
    endTime: '15:40',
    isCurrent: false,
    isEnded: false,
    isCheckedIn: false
  }
])

// 校园新闻
const newsList = ref([
  { 
    id: 1, 
    title: '人工智能实验室获国家级重点项目支持', 
    summary: '我校计算机学院人工智能实验室获得国家自然科学基金重点项目立项',
    cover: '/static/images/news1.jpg',
    viewCount: 1234,
    commentCount: 56,
    publishTime: '2024-12-20 10:30:00',
    hot: true,
    new: true
  },
  { 
    id: 2, 
    title: '校园歌手大赛决赛圆满落幕', 
    summary: '经过激烈角逐，计算机学院选手获得冠军',
    cover: '/static/images/news2.jpg',
    viewCount: 890,
    commentCount: 34,
    publishTime: '2024-12-19 20:15:00',
    hot: false,
    new: true
  },
  { 
    id: 3, 
    title: '冬季消防安全知识讲座通知', 
    summary: '学校将于本周五举办冬季消防安全知识讲座',
    cover: '/static/images/news3.jpg',
    viewCount: 567,
    commentCount: 12,
    publishTime: '2024-12-18 14:20:00',
    hot: false,
    new: false
  }
])

// 校园活动
const activities = ref([
  { 
    id: 1, 
    title: '人工智能前沿讲座', 
    cover: '/static/images/activity1.jpg',
    startTime: '2024-12-25 14:00:00',
    location: '学术报告厅',
    status: 'registering',
    participantCount: 45,
    registered: true
  },
  { 
    id: 2, 
    title: '校园篮球友谊赛', 
    cover: '/static/images/activity2.jpg',
    startTime: '2024-12-22 15:00:00',
    location: '体育馆',
    status: 'ongoing',
    participantCount: 120,
    registered: false
  },
  { 
    id: 3, 
    title: '考研经验分享会', 
    cover: '/static/images/activity3.jpg',
    startTime: '2024-12-28 19:00:00',
    location: '图书馆报告厅',
    status: 'registering',
    participantCount: 30,
    registered: false
  }
])

// 常用功能
const commonFunctions = ref([
  { id: 1, name: '成绩查询', icon: 'icon-score', color: '#af52de', badge: null },
  { id: 2, name: '请假申请', icon: 'icon-leave', color: '#34c759', badge: null },
  { id: 3, name: '电费充值', icon: 'icon-electricity', color: '#ff9500', badge: null },
  { id: 4, name: '网络报修', icon: 'icon-repair', color: '#007AFF', badge: null },
  { id: 5, name: '教室预约', icon: 'icon-classroom', color: '#5856d6', badge: null },
  { id: 6, name: '考试安排', icon: 'icon-exam', color: '#ff3b30', badge: '新' }
])

// 通知公告
const notices = ref([
  { 
    id: 1, 
    title: '图书馆寒假开放时间调整通知', 
    type: 'notice',
    publishTime: '2024-12-20 09:00:00'
  },
  { 
    id: 2, 
    title: '期末考试成绩查询系统开放', 
    type: 'exam',
    publishTime: '2024-12-19 15:30:00'
  },
  { 
    id: 3, 
    title: '校园一卡通系统维护通知', 
    type: 'maintenance',
    publishTime: '2024-12-18 10:00:00'
  }
])

// 学习资源
const learningResources = ref([
  { 
    id: 1, 
    title: '教学视频库', 
    description: '各学科教学视频资源',
    icon: 'icon-video',
    color: '#007AFF',
    count: 256,
    updateTime: '2024-12-20 08:00:00'
  },
  { 
    id: 2, 
    title: '电子图书馆', 
    description: '海量电子图书免费阅读',
    icon: 'icon-ebook',
    color: '#4cd964',
    count: 10000,
    updateTime: '2024-12-19 10:00:00'
  },
  { 
    id: 3, 
    title: '实验模拟', 
    description: '在线虚拟实验平台',
    icon: 'icon-experiment',
    color: '#ff9500',
    count: 45,
    updateTime: '2024-12-18 14:00:00'
  }
])

// 校园服务
const services = ref([
  { id: 1, name: '校医院', icon: 'icon-hospital', color: '#ff3b30', status: '正常开放' },
  { id: 2, name: '后勤服务', icon: 'icon-service', color: '#4cd964', status: '24小时' },
  { id: 3, name: '心理咨询', icon: 'icon-psychology', color: '#5ac8fa', status: '在线' },
  { id: 4, name: '就业指导', icon: 'icon-career', color: '#ffcc00', status: '可预约' }
])

// 搜索历史
const searchHistory = ref(['图书馆', '食堂菜单', '课程表', '成绩查询'])
const hotKeywords = ref(['考试安排', '校车时刻表', '空教室', '招聘会', '奖学金'])

// 快捷菜单
const quickMenuItems = ref([
  { id: 1, name: '发布动态', icon: 'icon-post', color: '#007AFF' },
  { id: 2, name: '发起活动', icon: 'icon-activity', color: '#4cd964' },
  { id: 3, name: '在线咨询', icon: 'icon-consult', color: '#ff9500' },
  { id: 4, name: '意见反馈', icon: 'icon-feedback', color: '#5856d6' },
  { id: 5, name: '扫一扫', icon: 'icon-scan', color: '#5ac8fa' },
  { id: 6, name: '分享应用', icon: 'icon-share', color: '#ff2d55' }
])

// 工具函数
const formatDate = (date, format = 'yyyy-MM-dd') => {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
  
  switch(format) {
    case 'MM月dd日':
      return `${month}月${day}日`
    case 'EEEE':
      return week
    default:
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const formatActivityTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getWeatherIcon = (weather) => {
  const iconMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '🌧️',
    '暴雨': '⛈️',
    '雷阵雨': '⛈️',
    '雪': '❄️',
    '雾': '🌫️',
    '霾': '😷'
  }
  return iconMap[weather] || '🌤️'
}

const getAirQualityColor = (aqi) => {
  if (aqi <= 50) return '#00E400'
  if (aqi <= 100) return '#FFFF00'
  if (aqi <= 150) return '#FF7E00'
  if (aqi <= 200) return '#FF0000'
  if (aqi <= 300) return '#99004C'
  return '#7E0023'
}

const getActivityStatusClass = (status) => {
  switch(status) {
    case 'registering': return 'status-registering'
    case 'ongoing': return 'status-ongoing'
    case 'ended': return 'status-ended'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

const getActivityStatusText = (status) => {
  switch(status) {
    case 'registering': return '报名中'
    case 'ongoing': return '进行中'
    case 'ended': return '已结束'
    case 'cancelled': return '已取消'
    default: return ''
  }
}

const getNoticeTypeClass = (type) => {
  switch(type) {
    case 'notice': return 'type-notice'
    case 'exam': return 'type-exam'
    case 'maintenance': return 'type-maintenance'
    default: return ''
  }
}

const getNoticeIcon = (type) => {
  switch(type) {
    case 'notice': return '📢'
    case 'exam': return '📝'
    case 'maintenance': return '🔧'
    default: return '📋'
  }
}

// 通知类型处理
const getNotificationTypeClass = (type) => {
  switch(type) {
    case 'start': return 'type-start'
    case 'checkin': return 'type-checkin'
    case 'reminder': return 'type-reminder'
    case 'end': return 'type-end'
    default: return ''
  }
}

const getNotificationIcon = (type) => {
  switch(type) {
    case 'start': return '🚀'
    case 'checkin': return '✅'
    case 'reminder': return '⏰'
    case 'end': return '🏁'
    default: return '🔔'
  }
}

const formatNotificationTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = date - now
  
  if (diff > 0) {
    // 未来时间
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) {
      return `${days}天后`
    } else if (hours > 0) {
      return `${hours}小时后`
    } else {
      return '即将开始'
    }
  } else {
    // 过去时间
    return formatTime(timeStr)
  }
}

const getQuickAccessIcon = (id) => {
  const iconMap = {
    1: 'calendar', // 课程表 - 日历图标
    2: 'book', // 图书馆 - 书本图标
    3: 'wallet', // 一卡通 - 钱包图标
    4: 'location-filled', // 校园地图 - 定位图标
    5: 'shop', // 食堂菜单 - 商店图标
    6: 'car', // 校车查询 - 汽车图标
    7: 'compose', // 成绩查询 - 编辑图标
    8: 'help' // 失物招领 - 帮助图标
  }
  return iconMap[id] || 'home'
}

const getFunctionIcon = (id) => {
  const iconMap = {
    1: 'compose', // 成绩查询 - 编辑图标
    2: 'calendar', // 请假申请 - 日历图标
    3: 'bolt', // 电费充值 - 闪电图标
    4: 'settings', // 网络报修 - 设置图标
    5: 'home', // 教室预约 - 房屋图标
    6: 'paperplane' // 考试安排 - 纸飞机图标
  }
  return iconMap[id] || 'home'
}

const getMenuIcon = (id) => {
  const iconMap = {
    1: 'plus', // 发布动态
    2: 'flag', // 发起活动
    3: 'chat', // 在线咨询
    4: 'help', // 意见反馈
    5: 'scan', // 扫一扫
    6: 'redo' // 分享应用
  }
  return iconMap[id] || 'home'
}

const getResourceIcon = (id) => {
  const iconMap = {
    1: 'videocam-filled', // 教学视频库
    2: 'book-filled', // 电子图书馆
    3: 'settings-filled' // 实验模拟
  }
  return iconMap[id] || 'file'
}

const getServiceIcon = (id) => {
  const iconMap = {
    1: 'heart-filled', // 校医院
    2: 'sound-filled', // 后勤服务
    3: 'chat-filled', // 心理咨询
    4: 'paperplane-filled' // 就业指导
  }
  return iconMap[id] || 'home'
}

// 事件处理
const handleLocation = () => {
  showSchoolPicker.value = true
}

const hideSchoolPicker = () => {
  showSchoolPicker.value = false
}

const selectSchool = (school) => {
  currentLocation.value = {
    name: school.name,
    latitude: school.latitude,
    longitude: school.longitude,
    city: school.city
  }
  // 保存到本地存储
  uni.setStorageSync('userSchool', school)
  hideSchoolPicker()
  uni.showToast({ title: `已切换到${school.name}`, icon: 'success' })
  // 获取新学校的天气
  fetchWeather(school.city)
}

const fetchWeather = async (city) => {
  weatherLoading.value = true
  try {
    // 模拟天气数据（实际项目中应调用天气API）
    const weatherData = {
      '杭州': { temperature: 20, weather: '晴', aqi: 41, humidity: 74 },
      '北京': { temperature: 5, weather: '多云', aqi: 85, humidity: 45 },
      '上海': { temperature: 15, weather: '阴', aqi: 65, humidity: 68 },
      '南京': { temperature: 12, weather: '小雨', aqi: 55, humidity: 82 },
      '武汉': { temperature: 10, weather: '多云', aqi: 72, humidity: 70 },
      '广州': { temperature: 25, weather: '晴', aqi: 38, humidity: 60 },
      '成都': { temperature: 14, weather: '阴', aqi: 78, humidity: 75 },
      '西安': { temperature: 8, weather: '多云', aqi: 95, humidity: 50 }
    }
    
    const data = weatherData[city] || { temperature: 18, weather: '晴', aqi: 50, humidity: 65 }
    weather.value = { ...weather.value, ...data }
  } catch (error) {
    console.error('获取天气失败:', error)
  } finally {
    weatherLoading.value = false
  }
}

const handleNotification = () => {
  showNotificationPanel.value = true
}

const hideNotificationPanel = () => {
  showNotificationPanel.value = false
}

const handleNotificationClick = (notification) => {
  // 标记为已读
  notification.read = true
  updateUnreadCount()
  
  // 跳转到活动详情
  hideNotificationPanel()
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/detail/index?id=${notification.activityId}`,
    fail: () => {
      uni.switchTab({ url: '/pages/tabbar/activity/index' })
    }
  })
}

const markAllAsRead = () => {
  activityNotifications.value.forEach(n => n.read = true)
  updateUnreadCount()
  uni.showToast({ title: '已全部标记为已读', icon: 'success' })
}

const updateUnreadCount = () => {
  unreadCount.value = activityNotifications.value.filter(n => !n.read).length
}

const handleSearch = () => {
  showSearch.value = true
}

const hideSearch = () => {
  showSearch.value = false
  searchKeyword.value = ''
}

const clearSearch = () => {
  searchKeyword.value = ''
}

const handleSearchConfirm = () => {
  if (searchKeyword.value.trim()) {
    // 保存搜索历史
    if (!searchHistory.value.includes(searchKeyword.value)) {
      searchHistory.value.unshift(searchKeyword.value)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      uni.setStorageSync('searchHistory', searchHistory.value)
    }
    
    showSearchPanel.value = false
    showSearch.value = false
    
    // 跳转到搜索结果页面（如果页面不存在，则跳转到新闻页面）
    uni.navigateTo({
      url: `/pages/tabbar/news/index?keyword=${encodeURIComponent(searchKeyword.value)}`,
      fail: () => {
        uni.switchTab({
          url: '/pages/tabbar/news/index'
        })
      }
    })
  }
}

const handleScan = () => {
  uni.scanCode({
    success: (res) => {
      console.log('扫码结果:', res)
      uni.showToast({ title: '扫码成功', icon: 'success' })
      // 根据扫码结果处理不同的业务
    }
  })
}

const handleRefresh = () => {
  refreshing.value = true
  loadHomeData(true)
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

const handleLoadMore = () => {
  if (loadingMore.value || !hasMoreData.value) return
  
  loadingMore.value = true
  
  setTimeout(() => {
    // 模拟加载更多数据
    currentPage.value++
    loadingMore.value = false
    if (currentPage.value > 3) {
      hasMoreData.value = false
    }
  }, 500)
}

const handleQuickAccess = (item) => {
  if (item.path) {
    uni.navigateTo({
      url: item.path,
      fail: () => {
        // 页面不存在时显示提示
        uni.showToast({ 
          title: `${item.name}功能开发中`, 
          icon: 'none',
          duration: 2000
        })
      }
    })
  } else {
    uni.showToast({ title: item.name, icon: 'none' })
  }
}

const viewAllQuickAccess = () => {
  // 跳转到功能中心页面（使用navigateTo因为不再是tabbar页面）
  uni.navigateTo({
    url: '/pages/tabbar/function/index',
    fail: () => {
      uni.showToast({
        title: '功能中心页面开发中',
        icon: 'none'
      })
    }
  })
}

const handleCalendar = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/calendar/index',
    fail: () => {
      uni.showToast({ 
        title: '校历功能开发中', 
        icon: 'none',
        duration: 2000
      })
    }
  })
}

const handleBannerClick = (banner) => {
  if (banner.url) {
    uni.navigateTo({
      url: banner.url,
      fail: () => {
        // 如果页面不存在，根据URL类型跳转到对应tabbar页面
        if (banner.url.includes('/news')) {
          uni.switchTab({ url: '/pages/tabbar/news/index' })
        } else if (banner.url.includes('/activity')) {
          uni.switchTab({ url: '/pages/tabbar/activity/index' })
        } else {
          uni.showToast({ 
            title: '页面开发中', 
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
}

const handleCourseClick = (course) => {
  uni.showToast({ title: `课程：${course.name}`, icon: 'none' })
}

const handleCheckin = (courseId) => {
  const course = todayCourses.value.find(c => c.id === courseId)
  if (course) {
    currentCourse.value = course
    checkinCode.value = Math.random().toString(36).substr(2, 6).toUpperCase()
    showCheckinModal.value = true
  }
}

const hideCheckinModal = () => {
  showCheckinModal.value = false
}

const confirmCheckin = () => {
  // 处理签到逻辑
  if (currentCourse.value) {
    const course = todayCourses.value.find(c => c.id === currentCourse.value.id)
    if (course) {
      course.isCheckedIn = true
      uni.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 2000
      })
    }
  }
  showCheckinModal.value = false
}

const viewTimetable = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/calendar/index',
    fail: () => {
      uni.showToast({ 
        title: '课程表功能开发中', 
        icon: 'none',
        duration: 2000
      })
    }
  })
}

const handleNewsClick = (news) => {
  // 跳转到新闻详情页（如果不存在则跳转到新闻列表页）
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/detail/index?id=${news.id}`,
    fail: () => {
      uni.switchTab({
        url: '/pages/tabbar/news/index'
      })
    }
  })
}

const viewAllNews = () => {
  uni.switchTab({
    url: '/pages/tabbar/news/index'
  })
}

const handleActivityClick = (activity) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/detail/index?id=${activity.id}`,
    fail: () => {
      // 如果详情页不存在，跳转到活动列表页
      uni.switchTab({
        url: '/pages/tabbar/activity/index'
      })
    }
  })
}

const handleActivityRegister = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity) {
    activity.registered = true
    activity.participantCount++
    uni.showToast({ title: '报名成功', icon: 'success' })
  }
}

const viewAllActivities = () => {
  uni.switchTab({
    url: '/pages/tabbar/activity/index'
  })
}

const handleFunctionClick = (func) => {
  const functionMap = {
    1: '/pages/tabbar/function/subpages/score/index',
    2: '/pages/tabbar/function/subpages/leave/index',
    3: '/pages/tabbar/function/subpages/electricity/index',
    4: '/pages/tabbar/function/subpages/repair/index',
    5: '/pages/tabbar/function/subpages/classroom/index',
    6: '/pages/tabbar/function/subpages/exam/index'
  }
  
  if (functionMap[func.id]) {
    uni.navigateTo({
      url: functionMap[func.id],
      fail: () => {
        uni.showToast({ 
          title: `${func.name}功能开发中`, 
          icon: 'none',
          duration: 2000
        })
      }
    })
  } else {
    uni.showToast({ title: func.name, icon: 'none' })
  }
}

const customizeFunctions = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/index',
    fail: () => {
      uni.showToast({ 
        title: '自定义功能开发中', 
        icon: 'none',
        duration: 2000
      })
    }
  })
}

const handleNoticeClick = (notice) => {
  uni.showToast({ title: notice.title, icon: 'none' })
}

const viewAllNotices = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const handleResourceClick = (resource) => {
  uni.showToast({ title: resource.title, icon: 'none' })
}

const viewAllLearning = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const handleServiceClick = (service) => {
  uni.showToast({ title: service.name, icon: 'none' })
}

const handleQuickAction = () => {
  showQuickMenu.value = true
}

const hideQuickMenu = () => {
  showQuickMenu.value = false
}

const handleMenuClick = (item) => {
  hideQuickMenu()
  switch(item.id) {
    case 1: // 发布动态
      uni.showToast({ title: '功能开发中', icon: 'none' })
      break
    case 2: // 发起活动
      uni.showToast({ title: '功能开发中', icon: 'none' })
      break
    case 3: // 在线咨询
      uni.navigateTo({ 
        url: '/pages/tabbar/ai-assistant/index',
        fail: () => {
          uni.showToast({ title: 'AI助手功能开发中', icon: 'none' })
        }
      })
      break
    case 4: // 意见反馈
      uni.showToast({ title: '功能开发中', icon: 'none' })
      break
    case 5: // 扫一扫
      handleScan()
      break
    case 6: // 分享应用
      // 检查是否支持分享功能
      if (typeof uni.share === 'function') {
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          type: 0,
          title: '校园助手',
          summary: '一站式校园服务平台',
          success: () => {
            uni.showToast({ title: '分享成功', icon: 'success' })
          },
          fail: () => {
            uni.showToast({ title: '分享失败', icon: 'none' })
          }
        })
      } else {
        // H5环境不支持分享，显示提示
        uni.showToast({ title: '当前环境不支持分享', icon: 'none' })
      }
      break
  }
}

const handleAssistant = () => {
  uni.navigateTo({
    url: '/pages/tabbar/ai-assistant/index',
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

const handleFeedback = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}


const hideSearchPanel = () => {
  showSearchPanel.value = false
}

const handleHistoryTag = (keyword) => {
  searchKeyword.value = keyword
  handleSearchConfirm()
}

const handleHotTag = (keyword) => {
  searchKeyword.value = keyword
  handleSearchConfirm()
}

const clearSearchHistory = () => {
  uni.showModal({
    title: '清除搜索历史',
    content: '确定要清除所有搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        uni.setStorageSync('searchHistory', [])
        uni.showToast({ title: '已清除', icon: 'success' })
      }
    }
  })
}

// 数据加载
const loadHomeData = (force = false) => {
  if (force) {
    // 刷新天气
    loadWeatherData()
    // 刷新课程
    loadTodayCourses()
    // 刷新新闻
    loadNewsData()
    // 刷新活动
    loadActivitiesData()
    
    uni.showToast({ title: '数据已刷新', icon: 'success' })
  }
}

const loadWeatherData = () => {
  // 模拟天气数据
  setTimeout(() => {
    weather.value = {
      temperature: 18 + Math.floor(Math.random() * 5),
      weather: ['晴', '多云', '阴'][Math.floor(Math.random() * 3)],
      aqi: 30 + Math.floor(Math.random() * 30),
      humidity: 60 + Math.floor(Math.random() * 20)
    }
  }, 500)
}

const loadTodayCourses = () => {
  // 模拟加载今日课程
  console.log('加载今日课程')
}

const loadNewsData = () => {
  // 模拟加载新闻
  console.log('加载新闻数据')
}

const loadActivitiesData = () => {
  // 模拟加载活动
  console.log('加载活动数据')
}

// 定时器引用
let courseTimer = null

// 生命周期
onLoad(() => {
  // 加载保存的搜索历史
  const savedHistory = uni.getStorageSync('searchHistory')
  if (savedHistory) {
    searchHistory.value = savedHistory
  }
  
  loadHomeData(true)
  
  // 启动定时器，更新当前课程状态
  courseTimer = setInterval(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    todayCourses.value.forEach(course => {
      const [startHour, startMinute] = course.startTime.split(':').map(Number)
      const [endHour, endMinute] = course.endTime.split(':').map(Number)
      
      const startTime = startHour * 60 + startMinute
      const endTime = endHour * 60 + endMinute
      const currentTime = currentHour * 60 + currentMinute
      
      course.isCurrent = currentTime >= startTime && currentTime <= endTime
      course.isEnded = currentTime > endTime
    })
  }, 60000) // 每分钟更新一次
})

onUnload(() => {
  // 清理定时器
  if (courseTimer) {
    clearInterval(courseTimer)
    courseTimer = null
  }
})

onShow(() => {
  // 页面显示时刷新数据
  if (uni.getStorageSync('needRefreshHome')) {
    uni.removeStorageSync('needRefreshHome')
    loadHomeData(true)
  }
  
  // 更新未读消息数
  updateUnreadCount()
})

onHide(() => {
  // 页面隐藏时保存数据
  uni.setStorageSync('searchHistory', searchHistory.value)
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

const updateUnreadCountMock = () => {
  // 模拟获取未读消息数
  setTimeout(() => {
    unreadCount.value = Math.floor(Math.random() * 5)
  }, 1000)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.home-index-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
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
  
  .navbar-left {
    .location-info {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 28rpx;
      color: #333;
      
      .location-text {
        max-width: 200rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .navbar-icon {
      position: relative;
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      color: #666;
      
      .badge {
        position: absolute;
        top: -4rpx;
        right: -4rpx;
        min-width: 20rpx;
        height: 20rpx;
        padding: 0 6rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 10rpx;
        font-size: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.search-bar {
  position: fixed;
  top: 90rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  z-index: 1000;
  
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

.home-scroll {
  flex: 1;
  height: 0;
  padding-top: 90rpx;
  padding-bottom: 120rpx;
}

.top-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 40rpx 30rpx 30rpx;
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 20rpx;
  
  .weather-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .weather-main {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .weather-icon {
        font-size: 60rpx;
      }
      
      .weather-detail {
        .temperature {
          font-size: 48rpx;
          font-weight: bold;
        }
        
        .weather-text {
          font-size: 24rpx;
          opacity: 0.9;
        }
      }
    }
    
    .weather-extras {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      
      .extra-item {
        display: flex;
        align-items: center;
        gap: 12rpx;
        font-size: 24rpx;
        
        .aqi-value {
          font-weight: bold;
        }
      }
    }
  }
  
  .date-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .current-date {
      .date-main {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .date-week {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
    
    .calendar-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #fff;
      
      .iconfont {
        font-size: 36rpx;
      }
    }
  }
}

.quick-access {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .quick-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      
      .quick-icon {
        position: relative;
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #fff;
        overflow: visible;
      }
      
      .quick-text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        line-height: 1.2;
      }
      
      .quick-badge {
        position: absolute;
        top: -6rpx;
        right: -6rpx;
        min-width: 32rpx;
        height: 32rpx;
        padding: 0 8rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        font-weight: bold;
        line-height: 1;
        z-index: 10;
        box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.4);
        border: 2rpx solid #fff;
        white-space: nowrap;
      }
    }
  }
}

.banner-section {
  margin: 0 20rpx 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .home-swiper {
    height: 300rpx;
    
    .swiper-item {
      position: relative;
      width: 100%;
      height: 100%;
      
      .banner-img {
        width: 100%;
        height: 100%;
      }
      
      .banner-title {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rpx 30rpx;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: #fff;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}

.today-courses {
  background: #fff;
  border-radius: 24rpx;
  margin: 0 20rpx 20rpx;
  padding: 32rpx;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.06);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 12rpx;
      font-size: 36rpx;
      font-weight: 700;
      color: #1a1a1a;
      
      .title-icon {
        font-size: 32rpx;
      }
    }
    
    .section-more {
      display: flex;
      align-items: center;
      gap: 4rpx;
      font-size: 26rpx;
      color: #667EEA;
      font-weight: 500;
      transition: all 0.3s;
      
      .arrow {
        font-size: 32rpx;
        line-height: 1;
      }
      
      &:active {
        opacity: 0.7;
        transform: translateX(4rpx);
      }
    }
  }
  
  .courses-list {
    .course-item {
      display: flex;
      align-items: flex-start;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      transition: all 0.3s;
      border-radius: 16rpx;
      margin-bottom: 12rpx;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      &.current {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%);
        border: 2rpx solid rgba(102, 126, 234, 0.2);
        padding: 24rpx 20rpx;
        margin: 0 -20rpx 12rpx;
        box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.12);
      }
      
      &.upcoming {
        background: #fafafa;
      }
      
      &.ended {
        opacity: 0.5;
        background: #f9f9f9;
      }
      
      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
      
      .course-time {
        width: 160rpx;
        padding-right: 24rpx;
        border-right: 2rpx solid #f0f0f0;
        flex-shrink: 0;
        
        .time-range {
          font-size: 26rpx;
          color: #333;
          font-weight: 600;
          margin-bottom: 12rpx;
          line-height: 1.4;
        }
        
        .course-status {
          display: inline-flex;
          align-items: center;
          gap: 6rpx;
          padding: 6rpx 14rpx;
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          color: #fff;
          border-radius: 20rpx;
          font-size: 20rpx;
          font-weight: 500;
          
          .status-dot {
            width: 8rpx;
            height: 8rpx;
            background: #fff;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          &.upcoming {
            background: #FFA726;
            font-size: 20rpx;
          }
        }
      }
      
      .course-info {
        flex: 1;
        padding: 0 20rpx;
        min-width: 0;
        
        .course-name {
          font-size: 30rpx;
          color: #1a1a1a;
          font-weight: 700;
          margin-bottom: 12rpx;
          line-height: 1.4;
        }
        
        .course-detail {
          display: flex;
          flex-direction: column;
          gap: 8rpx;
          
          .detail-row {
            display: flex;
            align-items: center;
            gap: 8rpx;
            
            .detail-icon {
              font-size: 22rpx;
              opacity: 0.7;
            }
            
            .detail-item {
              font-size: 24rpx;
              color: #666;
              line-height: 1.5;
            }
          }
        }
      }
      
      .course-action {
        flex-shrink: 0;
        
        .checkin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6rpx;
          padding: 14rpx 28rpx;
          background: linear-gradient(135deg, #4cd964 0%, #34c759 100%);
          color: #fff;
          border-radius: 24rpx;
          font-size: 26rpx;
          font-weight: 600;
          box-shadow: 0 4rpx 12rpx rgba(76, 217, 100, 0.3);
          transition: all 0.3s;
          
          .checkin-icon {
            font-size: 24rpx;
            font-weight: bold;
          }
          
          &:active {
            transform: scale(0.95);
            box-shadow: 0 2rpx 8rpx rgba(76, 217, 100, 0.4);
          }
          
          &.checked {
            background: linear-gradient(135deg, #8E8E93 0%, #6D6D70 100%);
            box-shadow: 0 4rpx 12rpx rgba(142, 142, 147, 0.2);
            cursor: default;
            
            &:active {
              transform: none;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.news-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .news-list {
    .news-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .news-img {
        position: relative;
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        overflow: hidden;
        margin-right: 20rpx;
        
        image {
          width: 100%;
          height: 100%;
        }
        
        .hot-tag, .new-tag {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #fff;
        }
        
        .hot-tag {
          background: #ff3b30;
        }
        
        .new-tag {
          background: #007AFF;
        }
      }
      
      .news-info {
        flex: 1;
        
        .news-title {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .news-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .news-meta {
          display: flex;
          align-items: center;
          gap: 20rpx;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 4rpx;
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
  }
}

.activities-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .activities-scroll {
    white-space: nowrap;
    
    .activity-item {
      display: inline-block;
      width: 300rpx;
      margin-right: 20rpx;
      background: #f9f9f9;
      border-radius: 16rpx;
      overflow: hidden;
      
      .activity-img {
        position: relative;
        width: 100%;
        height: 150rpx;
        
        image {
          width: 100%;
          height: 100%;
        }
        
        .activity-status {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #fff;
          
          &.status-registering {
            background: #4cd964;
          }
          
          &.status-ongoing {
            background: #007AFF;
          }
          
          &.status-ended {
            background: #999;
          }
        }
      }
      
      .activity-info {
        padding: 20rpx;
        
        .activity-title {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 12rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .activity-time, .activity-location {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .activity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12rpx;
          
          .participants {
            display: flex;
            align-items: center;
            gap: 4rpx;
            font-size: 20rpx;
            color: #666;
          }
          
          .register-btn, .registered-tag {
            padding: 8rpx 20rpx;
            border-radius: 20rpx;
            font-size: 20rpx;
          }
          
          .register-btn {
            background: #007AFF;
            color: #fff;
          }
          
          .registered-tag {
            background: #f5f5f5;
            color: #999;
          }
        }
      }
    }
  }
}

.common-functions {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .functions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    
    .function-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      
      .function-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #fff;
      }
      
      .function-text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        line-height: 1.2;
      }
      
      .function-badge {
        position: absolute;
        top: -8rpx;
        right: 8rpx;
        padding: 4rpx 12rpx;
        background: #ff3b30;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
    }
  }
}

.notice-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .notice-list {
    .notice-swiper {
      height: 120rpx;
      
      .notice-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        
        .notice-icon {
          width: 60rpx;
          height: 60rpx;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32rpx;
          color: #fff;
          margin-right: 20rpx;
          
          &.type-notice {
            background: #007AFF;
          }
          
          &.type-exam {
            background: #ff3b30;
          }
          
          &.type-maintenance {
            background: #ff9500;
          }
        }
        
        .notice-content {
          flex: 1;
          
          .notice-title {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .notice-time {
            font-size: 20rpx;
            color: #999;
          }
        }
        
        .notice-action {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.learning-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .resources-list {
    .resource-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .resource-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
        margin-right: 20rpx;
      }
      
      .resource-info {
        flex: 1;
        
        .resource-title {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 8rpx;
        }
        
        .resource-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .resource-meta {
          display: flex;
          gap: 20rpx;
          
          .meta-item {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
  }
}

.service-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
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
  
  .service-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .service-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #f9f9f9;
      border-radius: 12rpx;
      
      .service-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
        margin-right: 20rpx;
      }
      
      .service-info {
        flex: 1;
        
        .service-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }
        
        .service-status {
          font-size: 20rpx;
          color: #666;
        }
      }
    }
  }
}

.bottom-tips {
  text-align: center;
  padding: 40rpx 0;
  
  .tips-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
    font-size: $font-size-sm;
    color: $gray-5;
  }
}

.safe-area {
  height: 120rpx;
}

.float-buttons {
  position: fixed;
  bottom: 120rpx;
  right: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  z-index: 1000;
  
  .float-btn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #fff;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
    
    &.main-btn {
      background: #007AFF;
    }
    
    &.assistant-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
      transition: all 0.3s;
      
      .assistant-icon {
        font-size: 40rpx;
        line-height: 1;
        display: block;
      }
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 12rpx rgba(102, 126, 234, 0.4);
      }
    }
    
    &.feedback-btn {
      background: #ff9500;
    }
  }
}

.search-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  
  .search-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    
    .search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 30rpx 20rpx;
      border-bottom: 1rpx solid #e5e5e5;
      
      .search-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .search-close {
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .search-history {
      padding: 30rpx;
      border-bottom: 1rpx solid #e5e5e5;
      
      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .history-title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
        
        .history-clear {
          font-size: 24rpx;
          color: #007AFF;
        }
      }
      
      .history-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .history-tag {
          padding: 12rpx 24rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .search-hot {
      padding: 30rpx;
      
      .hot-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 20rpx;
      }
      
      .hot-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .hot-tag {
          padding: 12rpx 24rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
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
  
  .modal-content {
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    width: 600rpx;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }
}

.checkin-modal {
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
    padding: 20rpx 30rpx;
    
    .checkin-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20rpx;
      
      .checkin-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: rgba(76, 217, 100, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 60rpx;
        color: #4cd964;
      }
      
      .checkin-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        text-align: center;
      }
      
      .checkin-info {
        width: 100%;
        background: #f9f9f9;
        border-radius: 12rpx;
        padding: 20rpx;
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 12rpx;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          text {
            font-size: 24rpx;
            color: #666;
            
            &:first-child {
              width: 100rpx;
              color: #999;
            }
            
            &:last-child {
              flex: 1;
              color: #333;
            }
          }
        }
      }
      
      .checkin-code {
        width: 100%;
        text-align: center;
        padding: 20rpx;
        background: #f9f9f9;
        border-radius: 12rpx;
        
        .code-title {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 12rpx;
        }
        
        .code-value {
          font-size: 48rpx;
          font-weight: bold;
          color: #007AFF;
          margin-bottom: 12rpx;
        }
        
        .code-tip {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }
  
  .modal-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .footer-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #007AFF;
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
    background: $white;
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    
    &.quick-menu {
      .menu-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20rpx;
        padding: 40rpx 30rpx;
        
        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12rpx;
          
          .menu-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40rpx;
            color: #fff;
          }
          
          .menu-text {
            font-size: 24rpx;
            color: #333;
            text-align: center;
            line-height: 1.2;
          }
        }
      }
    }
    
    .menu-cancel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30rpx;
      border-top: 1rpx solid #f0f0f0;
      font-size: 28rpx;
      color: #333;
    }
  }
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 学校选择器和通知面板样式
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 3000;
  
  .picker-content {
    width: 100%;
    background: #fff;
    border-radius: 30rpx 30rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    
    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .picker-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .mark-all-read {
          font-size: 26rpx;
          color: #007AFF;
        }
      }
      
      .picker-close {
        font-size: 48rpx;
        color: #999;
        line-height: 1;
      }
    }
    
    .picker-scroll {
      flex: 1;
      max-height: 60vh;
    }
    
    .picker-tip {
      padding: 20rpx 30rpx;
      background: #f8f9fa;
      
      text {
        font-size: 24rpx;
        color: #888;
      }
    }
  }
}

// 学校选择器
.school-picker {
  .school-list {
    padding: 0 20rpx;
    
    .school-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.active {
        background: rgba(0, 122, 255, 0.05);
        
        .school-name {
          color: #007AFF;
        }
      }
      
      .school-info {
        display: flex;
        flex-direction: column;
        gap: 6rpx;
        
        .school-name {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
        }
        
        .school-city {
          font-size: 24rpx;
          color: #888;
        }
      }
      
      .check-icon {
        width: 44rpx;
        height: 44rpx;
        border-radius: 50%;
        background: #007AFF;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}

// 活动通知面板
.notification-panel {
  .notification-scroll {
    min-height: 300rpx;
  }
  
  .empty-notifications {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
    
    .empty-icon {
      font-size: 80rpx;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .notification-list {
    padding: 0 20rpx;
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 24rpx 16rpx;
      border-bottom: 1rpx solid #f5f5f5;
      position: relative;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.unread {
        background: rgba(0, 122, 255, 0.03);
      }
      
      .notification-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        
        &.type-start {
          background: rgba(0, 122, 255, 0.1);
        }
        
        &.type-checkin {
          background: rgba(76, 217, 100, 0.1);
        }
        
        &.type-reminder {
          background: rgba(255, 149, 0, 0.1);
        }
        
        &.type-end {
          background: rgba(142, 142, 147, 0.1);
        }
      }
      
      .notification-content {
        flex: 1;
        min-width: 0;
        
        .notification-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 6rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .notification-message {
          font-size: 26rpx;
          color: #666;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .notification-time {
          font-size: 22rpx;
          color: #999;
        }
      }
      
      .unread-dot {
        position: absolute;
        top: 28rpx;
        right: 16rpx;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #ff3b30;
      }
    }
  }
}
</style>