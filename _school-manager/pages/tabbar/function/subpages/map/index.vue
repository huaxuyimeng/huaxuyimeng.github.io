<!--
 * 文件路径: pages/tabbar/function/subpages/map/index.vue
 * 功能说明: 校园地图页面
 * 主要功能:
 *   1. 显示校园地图
 *   2. 地点搜索和定位
 *   3. 路线规划
 *   4. 建筑物信息展示
 * 数据来源: 地图API或本地数据
 * 相关页面: pages/tabbar/function/index.vue (功能中心)
 -->
<template>
  <view class="campus-map-page">
    <!-- 页面头部 -->
    <view class="map-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
        <view class="header-title">校园地图</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="toggleMapType">
          <text class="iconfont">{{ mapType === 'normal' ? '🗺️' : '📡' }}</text>
        </view>
        <view class="header-icon" @click="showSearch = true">
          <text class="iconfont">🔍</text>
        </view>
        <view class="header-icon" @click="showMenu = true">
          <text class="iconfont">⋯</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="showSearch" class="search-bar">
      <view class="search-input-wrapper">
        <text class="iconfont">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索地点、建筑..." 
          v-model="searchKeyword"
          @confirm="handleSearchConfirm"
          :focus="showSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
      </view>
      <view class="search-cancel" @click="hideSearch">取消</view>
    </view>

    <!-- 地图容器 -->
    <view class="map-container">
      <map
        id="campusMap"
        style="width: 100%; height: 100%;"
        :latitude="currentLocation.latitude"
        :longitude="currentLocation.longitude"
        :scale="scale"
        :markers="markers"
        :polyline="polylines"
        :circles="circles"
        :controls="controls"
        :include-points="includePoints"
        :show-location="showUserLocation"
        :enable-traffic="showTraffic"
        :enable-3D="enable3D"
        :enable-rotate="enableRotate"
        :enable-overlooking="enableOverlooking"
        :enable-zoom="enableZoom"
        :enable-scroll="enableScroll"
        :enable-satellite="mapType === 'satellite'"
        @regionchange="onRegionChange"
        @callouttap="onCalloutTap"
        @markertap="onMarkerTap"
        @controltap="onControlTap"
      />
    </view>

    <!-- 位置信息 -->
    <view v-if="currentAddress" class="location-info">
      <view class="location-icon">
        <text class="iconfont">📍</text>
      </view>
      <view class="location-detail">
        <view class="location-address">{{ currentAddress }}</view>
        <view class="location-coords">
          {{ currentLocation.latitude.toFixed(6) }}, {{ currentLocation.longitude.toFixed(6) }}
        </view>
      </view>
    </view>

    <!-- 功能面板 -->
    <view class="function-panel">
      <!-- 地图控制 -->
      <view class="map-controls">
        <view class="control-group">
          <view class="control-btn" @click="zoomIn">
            <text class="iconfont">+</text>
          </view>
          <view class="control-btn" @click="zoomOut">
            <text class="iconfont">-</text>
          </view>
        </view>
        
        <view class="control-group">
          <view 
            class="control-btn" 
            :class="{ active: showUserLocation }"
            @click="toggleUserLocation"
          >
            <text class="iconfont">📍</text>
          </view>
          <view 
            class="control-btn" 
            :class="{ active: showTraffic }"
            @click="toggleTraffic"
          >
            <text class="iconfont">🚦</text>
          </view>
        </view>
        
        <view class="control-btn locate-btn" @click="locateUser">
          <text class="iconfont">📍</text>
        </view>
      </view>

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
        
        <scroll-view class="search-results" scroll-y>
          <view 
            v-for="result in searchResults" 
            :key="result.id"
            class="search-result-item"
            @click="handleSearchResultClick(result)"
          >
            <view class="result-icon">
              <text class="iconfont" :class="result.icon"></text>
            </view>
            <view class="result-info">
              <view class="result-name">{{ result.name }}</view>
              <view class="result-desc">{{ result.description }}</view>
              <view class="result-distance">{{ result.distance }}</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 建筑分类 -->
      <view class="building-categories">
        <scroll-view class="categories-scroll" scroll-x>
          <view 
            v-for="category in buildingCategories" 
            :key="category.value"
            class="category-item"
            :class="{ active: currentCategory === category.value }"
            @click="handleCategoryChange(category.value)"
          >
            <view class="category-icon" :style="{ background: category.color }">
              <text class="iconfont" :class="category.icon"></text>
            </view>
            <text class="category-text">{{ category.label }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 导航面板 -->
      <view v-if="showNavigation" class="navigation-panel">
        <view class="navigation-header">
          <view class="navigation-title">路径规划</view>
          <view class="navigation-close" @click="clearNavigation">×</view>
        </view>
        
        <view class="navigation-info">
          <view class="route-info">
            <view class="route-item">
              <text class="label">起点</text>
              <text class="value">{{ navigation.from.name }}</text>
            </view>
            <view class="route-item">
              <text class="label">终点</text>
              <text class="value">{{ navigation.to.name }}</text>
            </view>
            <view class="route-item">
              <text class="label">距离</text>
              <text class="value">{{ navigation.distance }}米</text>
            </view>
            <view class="route-item">
              <text class="label">用时</text>
              <text class="value">{{ navigation.duration }}分钟</text>
            </view>
          </view>
          
          <view class="route-actions">
            <view class="action-btn" @click="startNavigation">
              <text class="iconfont">🚶</text>
              <text>开始导航</text>
            </view>
            <view class="action-btn" @click="shareRoute">
              <text class="iconfont">↗️</text>
              <text>分享路线</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 建筑详情 -->
    <view v-if="showBuildingDetail" class="modal-overlay" @click="showBuildingDetail = false">
      <view class="modal-content building-detail" @click.stop>
        <view class="modal-header">
          <view class="building-header">
            <view class="building-icon" :style="{ background: selectedBuilding.color || '#007AFF' }">
              <text class="iconfont" :class="selectedBuilding.icon || ''"></text>
            </view>
            <view class="building-title">
              <view class="building-name">{{ selectedBuilding.name || '' }}</view>
              <view class="building-english">{{ selectedBuilding.englishName || '' }}</view>
            </view>
          </view>
          <view class="modal-close" @click="showBuildingDetail = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="detail-content">
            <!-- 基本信息 -->
            <view class="detail-section">
              <view class="section-title">基本信息</view>
              <view class="section-content">
                <view class="info-item">
                  <text class="label">地址：</text>
                  <text class="value">{{ selectedBuilding.address || '' }}</text>
                </view>
                <view class="info-item">
                  <text class="label">建筑编号：</text>
                  <text class="value">{{ selectedBuilding.code || '' }}</text>
                </view>
                <view class="info-item">
                  <text class="label">建成时间：</text>
                  <text class="value">{{ selectedBuilding.builtYear || '' }}</text>
                </view>
              </view>
            </view>
            
            <!-- 楼层信息 -->
            <view v-if="selectedBuilding.floors && selectedBuilding.floors.length > 0" class="detail-section">
              <view class="section-title">楼层导航</view>
              <scroll-view class="floors-scroll" scroll-x>
                <view 
                  v-for="floor in selectedBuilding.floors" 
                  :key="floor.level"
                  class="floor-item"
                  :class="{ active: currentFloor === floor.level }"
                  @click="currentFloor = floor.level"
                >
                  <view class="floor-level">{{ floor.level }}</view>
                  <view class="floor-name">{{ floor.name }}</view>
                </view>
              </scroll-view>
            </view>
            
            <!-- 房间列表 -->
            <view v-if="currentFloorRooms.length > 0" class="detail-section">
              <view class="section-title">房间列表</view>
              <view class="rooms-list">
                <view 
                  v-for="room in currentFloorRooms" 
                  :key="room.number"
                  class="room-item"
                  @click="handleRoomClick(room)"
                >
                  <view class="room-number">{{ room.number }}</view>
                  <view class="room-info">
                    <view class="room-name">{{ room.name }}</view>
                    <view class="room-desc">{{ room.description }}</view>
                  </view>
                  <view class="room-distance">{{ room.distance }}米</view>
                </view>
              </view>
            </view>
            
            <!-- 开放时间 -->
            <view v-if="selectedBuilding.openHours" class="detail-section">
              <view class="section-title">开放时间</view>
              <view class="hours-list">
                <view 
                  v-for="hours in selectedBuilding.openHours" 
                  :key="hours.day"
                  class="hours-item"
                >
                  <view class="day">{{ hours.day }}</view>
                  <view class="time">{{ hours.time }}</view>
                </view>
              </view>
            </view>
            
            <!-- 联系方式 -->
            <view v-if="selectedBuilding.contact" class="detail-section">
              <view class="section-title">联系方式</view>
              <view class="contact-info">
                <view v-if="selectedBuilding.contact.phone" class="contact-item">
                  <text class="iconfont">📞</text>
                  <text class="value">{{ selectedBuilding.contact.phone }}</text>
                  <text class="action" @click="handleCall(selectedBuilding.contact.phone)">拨打</text>
                </view>
                <view v-if="selectedBuilding.contact.email" class="contact-item">
                  <text class="iconfont">📧</text>
                  <text class="value">{{ selectedBuilding.contact.email }}</text>
                  <text class="action" @click="handleEmail(selectedBuilding.contact.email)">发送</text>
                </view>
                <view v-if="selectedBuilding.contact.website" class="contact-item">
                  <text class="iconfont">🌐</text>
                  <text class="value">{{ selectedBuilding.contact.website }}</text>
                  <text class="action" @click="handleWebsite(selectedBuilding.contact.website)">访问</text>
                </view>
              </view>
            </view>
            
            <!-- 特色服务 -->
            <view v-if="selectedBuilding.features && selectedBuilding.features.length > 0" class="detail-section">
              <view class="section-title">特色服务</view>
              <view class="features-list">
                <view 
                  v-for="feature in selectedBuilding.features" 
                  :key="feature"
                  class="feature-item"
                >
                  <text class="feature-icon">✓</text>
                  <text class="feature-text">{{ feature }}</text>
                </view>
              </view>
            </view>
            
            <!-- 用户评价 -->
            <view v-if="selectedBuilding.reviews && selectedBuilding.reviews.length > 0" class="detail-section">
              <view class="section-title">用户评价</view>
              <view class="reviews-list">
                <view 
                  v-for="review in selectedBuilding.reviews.slice(0, 3)" 
                  :key="review.id"
                  class="review-item"
                >
                  <view class="review-header">
                    <image class="review-avatar" :src="review.avatar" />
                    <view class="review-user">
                      <view class="review-name">{{ review.name }}</view>
                      <view class="review-time">{{ formatReviewTime(review.time) }}</view>
                    </view>
                    <view class="review-rating">
                      <text v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">★</text>
                    </view>
                  </view>
                  <view class="review-content">{{ review.content }}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-actions">
            <view class="action-btn" @click="handleNavigateToBuilding">
              <text class="iconfont">📍</text>
              <text>导航到这里</text>
            </view>
            <view class="action-btn" @click="handleShareBuilding">
              <text class="iconfont">↗️</text>
              <text>分享</text>
            </view>
            <view class="action-btn" @click="handleAddFavorite">
              <text v-if="selectedBuilding.favorite" class="iconfont">❤️</text>
              <text v-else class="iconfont">🤍</text>
              <text>收藏</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作菜单 -->
    <view v-if="showMenu" class="menu-overlay" @click="showMenu = false">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="handleIndoorMap">
          <text class="iconfont">🏢</text>
          <text>室内地图</text>
        </view>
        <view class="menu-item" @click="handleARNavigation">
          <text class="iconfont">👁️</text>
          <text>AR导航</text>
        </view>
        <view class="menu-item" @click="handleShareLocation">
          <text class="iconfont">📍</text>
          <text>分享位置</text>
        </view>
        <view class="menu-item" @click="handleFeedback">
          <text class="iconfont">💬</text>
          <text>地图反馈</text>
        </view>
        <view class="menu-item" @click="showCampusTour = true">
          <text class="iconfont">🚶</text>
          <text>校园导览</text>
        </view>
        <view class="menu-item cancel" @click="showMenu = false">
          取消
        </view>
      </view>
    </view>

    <!-- 校园导览 -->
    <view v-if="showCampusTour" class="modal-overlay" @click="showCampusTour = false">
      <view class="modal-content campus-tour" @click.stop>
        <view class="modal-header">
          <text>校园导览</text>
          <view class="modal-close" @click="showCampusTour = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="tour-options">
            <view 
              v-for="tour in campusTours" 
              :key="tour.id"
              class="tour-option"
              @click="handleStartTour(tour)"
            >
              <view class="tour-icon" :style="{ background: tour.color }">
                <text class="iconfont" :class="tour.icon"></text>
              </view>
              <view class="tour-info">
                <view class="tour-name">{{ tour.name }}</view>
                <view class="tour-desc">{{ tour.description }}</view>
                <view class="tour-duration">约{{ tour.duration }}分钟</view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="showCampusTour = false">取消</view>
          <view class="footer-btn primary" @click="handleRandomTour">随机导览</view>
        </view>
      </view>
    </view>

    <!-- 实时位置共享 -->
    <view v-if="sharingLocation" class="location-sharing">
      <view class="sharing-header">
        <text class="iconfont">📍</text>
        <text>位置共享中</text>
        <view class="sharing-close" @click="stopSharingLocation">×</view>
      </view>
      <view class="sharing-info">
        <text>已共享{{ sharingDuration }}秒</text>
        <text class="sharing-link" @click="copySharingLink">复制链接</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'

// 响应式数据
const showSearch = ref(false)
const showSearchPanel = ref(false)
const showBuildingDetail = ref(false)
const showNavigation = ref(false)
const showMenu = ref(false)
const showCampusTour = ref(false)
const sharingLocation = ref(false)
const searchKeyword = ref('')
const currentSearchTab = ref('all')
const currentCategory = ref('all')
const mapType = ref('normal')
const showUserLocation = ref(true)
const showTraffic = ref(false)
const scale = ref(16)
const currentFloor = ref('1F')
const sharingDuration = ref(0)
const sharingTimer = ref(null)
const enable3D = ref(false)
const enableRotate = ref(false)
const enableOverlooking = ref(false)
const enableZoom = ref(true)
const enableScroll = ref(true)

// 地图中心位置（示例：某大学坐标）
const currentLocation = ref({
  latitude: 30.263,
  longitude: 120.105
})

// 当前地址
const currentAddress = ref('浙江省杭州市某大学')

// 选中的建筑
const selectedBuilding = ref({})

// 导航信息
const navigation = ref({
  from: { name: '当前位置', latitude: 30.263, longitude: 120.105 },
  to: { name: '', latitude: 0, longitude: 0 },
  distance: 0,
  duration: 0
})

// 搜索标签
const searchTabs = ref([
  { label: '全部', value: 'all' },
  { label: '教学楼', value: 'teaching' },
  { label: '宿舍', value: 'dormitory' },
  { label: '食堂', value: 'canteen' },
  { label: '图书馆', value: 'library' }
])

// 建筑分类
const buildingCategories = ref([
  { label: '全部', value: 'all', icon: 'icon-all', color: '#007AFF' },
  { label: '教学楼', value: 'teaching', icon: 'icon-teaching', color: '#4cd964' },
  { label: '办公楼', value: 'office', icon: 'icon-office', color: '#ff9500' },
  { label: '宿舍楼', value: 'dormitory', icon: 'icon-dormitory', color: '#ff3b30' },
  { label: '图书馆', value: 'library', icon: 'icon-library', color: '#5856d6' },
  { label: '食堂', value: 'canteen', icon: 'icon-canteen', color: '#ff2d55' },
  { label: '体育场馆', value: 'sports', icon: 'icon-sports', color: '#5ac8fa' },
  { label: '实验室', value: 'lab', icon: 'icon-lab', color: '#34c759' }
])

// 校园建筑数据
const campusBuildings = ref([
  { 
    id: 1,
    name: '主教学楼',
    englishName: 'Main Teaching Building',
    icon: 'icon-teaching',
    color: '#4cd964',
    category: 'teaching',
    latitude: 30.2635,
    longitude: 120.1055,
    address: '学校中心区1号',
    code: 'A-001',
    builtYear: '2005年',
    floors: [
      { level: '1F', name: '一层教室' },
      { level: '2F', name: '二层教室' },
      { level: '3F', name: '三层实验室' },
      { level: '4F', name: '四层办公室' }
    ],
    rooms: [
      { number: '101', name: '多媒体教室', description: '可容纳100人', floor: '1F', distance: 50 },
      { number: '102', name: '计算机教室', description: '60台电脑', floor: '1F', distance: 55 },
      { number: '201', name: '阶梯教室', description: '可容纳200人', floor: '2F', distance: 60 },
      { number: '301', name: '物理实验室', description: '基础物理实验', floor: '3F', distance: 65 }
    ],
    openHours: [
      { day: '周一至周五', time: '8:00-22:00' },
      { day: '周末', time: '9:00-21:00' }
    ],
    contact: {
      phone: '0571-12345678',
      email: 'teaching@university.edu.cn',
      website: 'https://teaching.university.edu.cn'
    },
    features: ['多媒体教室', 'WIFI覆盖', '空调', '电梯', '无障碍设施'],
    reviews: [
      { id: 1, name: '张三', avatar: '/static/avatars/user1.jpg', content: '设施完善，学习环境很好', time: '2024-12-20 10:30:00', rating: 5 },
      { id: 2, name: '李四', avatar: '/static/avatars/user2.jpg', content: '教室干净整洁，就是有点旧了', time: '2024-12-19 14:20:00', rating: 4 }
    ],
    favorite: false
  },
  { 
    id: 2,
    name: '图书馆',
    englishName: 'Library',
    icon: 'icon-library',
    color: '#5856d6',
    category: 'library',
    latitude: 30.2628,
    longitude: 120.1048,
    address: '学校中心区2号',
    code: 'B-001',
    builtYear: '2010年',
    floors: [
      { level: '1F', name: '借阅大厅' },
      { level: '2F', name: '自习区' },
      { level: '3F', name: '阅览室' },
      { level: '4F', name: '电子阅览室' }
    ],
    openHours: [
      { day: '周一至周五', time: '8:00-22:00' },
      { day: '周末', time: '9:00-21:00' }
    ],
    contact: {
      phone: '0571-87654321',
      email: 'library@university.edu.cn',
      website: 'https://library.university.edu.cn'
    },
    features: ['自习座位', '图书借阅', '电子资源', '研讨室', '咖啡厅'],
    reviews: [
      { id: 3, name: '王五', avatar: '/static/avatars/user3.jpg', content: '学习氛围很好，座位充足', time: '2024-12-20 15:30:00', rating: 5 }
    ],
    favorite: true
  },
  { 
    id: 3,
    name: '学生食堂',
    englishName: 'Student Canteen',
    icon: 'icon-canteen',
    color: '#ff2d55',
    category: 'canteen',
    latitude: 30.2632,
    longitude: 120.1035,
    address: '生活区1号',
    code: 'C-001',
    builtYear: '2015年',
    openHours: [
      { day: '早餐', time: '6:30-9:00' },
      { day: '午餐', time: '11:00-13:30' },
      { day: '晚餐', time: '17:00-19:30' }
    ],
    contact: {
      phone: '0571-11112222',
      email: 'canteen@university.edu.cn'
    },
    features: ['多样菜品', '清真窗口', '快餐区', '饮料区'],
    reviews: [
      { id: 4, name: '赵六', avatar: '/static/avatars/user4.jpg', content: '菜品丰富，价格实惠', time: '2024-12-20 12:30:00', rating: 4 }
    ],
    favorite: false
  }
])

// 地图标记
const markers = ref([
  {
    id: 1,
    latitude: 30.2635,
    longitude: 120.1055,
    title: '主教学楼',
    iconPath: '/static/icons/building-teaching.png',
    width: 40,
    height: 40,
    callout: {
      content: '主教学楼\n点击查看详情',
      color: '#333',
      fontSize: 12,
      borderRadius: 4,
      bgColor: '#fff',
      padding: 8,
      display: 'ALWAYS'
    }
  },
  {
    id: 2,
    latitude: 30.2628,
    longitude: 120.1048,
    title: '图书馆',
    iconPath: '/static/icons/building-library.png',
    width: 40,
    height: 40,
    callout: {
      content: '图书馆\n点击查看详情',
      color: '#333',
      fontSize: 12,
      borderRadius: 4,
      bgColor: '#fff',
      padding: 8,
      display: 'ALWAYS'
    }
  },
  {
    id: 3,
    latitude: 30.2632,
    longitude: 120.1035,
    title: '学生食堂',
    iconPath: '/static/icons/building-canteen.png',
    width: 40,
    height: 40,
    callout: {
      content: '学生食堂\n点击查看详情',
      color: '#333',
      fontSize: 12,
      borderRadius: 4,
      bgColor: '#fff',
      padding: 8,
      display: 'ALWAYS'
    }
  }
])

// 折线（用于导航路径）
const polylines = ref([])

// 圆形覆盖物
const circles = ref([])

// 控件
const controls = ref([
  {
    id: 1,
    position: { left: 20, top: 100, width: 40, height: 40 },
    iconPath: '/static/icons/locate.png',
    clickable: true
  }
])

// 包含的点
const includePoints = ref([
  { latitude: 30.2625, longitude: 120.103 },
  { latitude: 30.264, longitude: 120.106 }
])

// 搜索结果
const searchResults = ref([])

// 校园导览
const campusTours = ref([
  { id: 1, name: '新生报到路线', description: '从校门口到各报到点的路线', duration: 20, icon: 'icon-gate', color: '#007AFF' },
  { id: 2, name: '学习路线', description: '主要教学楼和图书馆', duration: 30, icon: 'icon-study', color: '#4cd964' },
  { id: 3, name: '生活路线', description: '食堂、宿舍、超市等', duration: 25, icon: 'icon-life', color: '#ff9500' },
  { id: 4, name: '运动路线', description: '体育场馆和操场', duration: 15, icon: 'icon-sports', color: '#ff3b30' }
])

// 计算属性
const currentFloorRooms = computed(() => {
  if (!selectedBuilding.value.rooms) return []
  return selectedBuilding.value.rooms.filter(room => room.floor === currentFloor.value)
})

const filteredBuildings = computed(() => {
  if (currentCategory.value === 'all') {
    return campusBuildings.value
  }
  return campusBuildings.value.filter(building => building.category === currentCategory.value)
})

// 工具函数
const formatReviewTime = (timeStr) => {
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

// 地图事件
const onRegionChange = (e) => {
  console.log('地图区域变化:', e)
}

const onCalloutTap = (e) => {
  console.log('点击标记:', e)
  const markerId = e.markerId
  const building = campusBuildings.value.find(b => b.id === markerId)
  if (building) {
    selectedBuilding.value = building
    showBuildingDetail.value = true
  }
}

const onMarkerTap = (e) => {
  console.log('点击标记:', e)
  const markerId = e.markerId
  const building = campusBuildings.value.find(b => b.id === markerId)
  if (building) {
    selectedBuilding.value = building
    showBuildingDetail.value = true
  }
}

const onControlTap = (e) => {
  console.log('点击控件:', e)
  if (e.controlId === 1) {
    locateUser()
  }
}

// 地图控制
const zoomIn = () => {
  scale.value = Math.min(scale.value + 1, 20)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 1, 3)
}

const toggleMapType = () => {
  mapType.value = mapType.value === 'normal' ? 'satellite' : 'normal'
}

const toggleUserLocation = () => {
  showUserLocation.value = !showUserLocation.value
  if (showUserLocation.value) {
    locateUser()
  }
}

const toggleTraffic = () => {
  showTraffic.value = !showTraffic.value
}

const locateUser = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      currentLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
      
      // 逆地理编码获取地址
      uni.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?key=YOUR_KEY&location=${res.longitude},${res.latitude}`,
        success: (addressRes) => {
          if (addressRes.data.status === '1') {
            currentAddress.value = addressRes.data.regeocode.formatted_address
          }
        }
      })
    },
    fail: (err) => {
      console.error('获取位置失败:', err)
      uni.showToast({ title: '获取位置失败', icon: 'none' })
    }
  })
}

// 搜索功能
const handleSearch = () => {
  showSearch.value = true
}

const hideSearch = () => {
  showSearch.value = false
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
  showSearch.value = false
  
  // 模拟搜索
  const keyword = searchKeyword.value.toLowerCase()
  searchResults.value = campusBuildings.value.filter(building => 
    building.name.toLowerCase().includes(keyword) ||
    (building.englishName && building.englishName.toLowerCase().includes(keyword))
  ).map(building => ({
    id: building.id,
    name: building.name,
    description: building.address,
    distance: '约500米',
    icon: building.icon
  }))
}

const handleSearchResultClick = (result) => {
  const building = campusBuildings.value.find(b => b.id === result.id)
  if (building) {
    selectedBuilding.value = building
    showBuildingDetail.value = true
    showSearchPanel.value = false
    
    // 移动到该位置
    currentLocation.value = {
      latitude: building.latitude,
      longitude: building.longitude
    }
  }
}

// 建筑分类
const handleCategoryChange = (category) => {
  currentCategory.value = category
  
  // 根据分类显示对应的建筑
  const filtered = filteredBuildings.value
  markers.value = filtered.map(building => ({
    id: building.id,
    latitude: building.latitude,
    longitude: building.longitude,
    title: building.name,
    iconPath: `/static/icons/building-${building.category}.png`,
    width: 40,
    height: 40,
    callout: {
      content: `${building.name}\n点击查看详情`,
      color: '#333',
      fontSize: 12,
      borderRadius: 4,
      bgColor: '#fff',
      padding: 8,
      display: 'ALWAYS'
    }
  }))
}

// 导航功能
const handleNavigateToBuilding = () => {
  if (!selectedBuilding.value) return
  
  navigation.value.to = {
    name: selectedBuilding.value.name,
    latitude: selectedBuilding.value.latitude,
    longitude: selectedBuilding.value.longitude
  }
  
  // 计算距离和用时
  const latDiff = Math.abs(navigation.value.to.latitude - navigation.value.from.latitude)
  const lngDiff = Math.abs(navigation.value.to.longitude - navigation.value.from.longitude)
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000 // 转换为米
  
  navigation.value.distance = Math.round(distance)
  navigation.value.duration = Math.round(distance / 80) // 假设步行速度80米/分钟
  
  showNavigation.value = true
  showBuildingDetail.value = false
  
  // 绘制导航路径
  drawNavigationPath()
}

const drawNavigationPath = () => {
  polylines.value = [{
    points: [
      { latitude: navigation.value.from.latitude, longitude: navigation.value.from.longitude },
      { latitude: navigation.value.to.latitude, longitude: navigation.value.to.longitude }
    ],
    color: '#007AFF',
    width: 6,
    dottedLine: false
  }]
}

const startNavigation = () => {
  uni.showModal({
    title: '开始导航',
    content: '是否开始导航？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '导航开始', icon: 'success' })
        // 这里可以调用第三方导航应用
      }
    }
  })
}

const clearNavigation = () => {
  showNavigation.value = false
  polylines.value = []
}

const shareRoute = () => {
  const routeInfo = `从${navigation.value.from.name}到${navigation.value.to.name}，距离${navigation.value.distance}米，预计用时${navigation.value.duration}分钟`
  // #ifdef MP-WEIXIN
  uni.shareAppMessage({
    title: '校园路线分享',
    path: '/pages/tabbar/function/subpages/map/index',
    imageUrl: ''
  })
  // #endif
  
  // #ifdef APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: '校园路线分享',
    summary: routeInfo,
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
}

// 建筑详情功能
const handleRoomClick = (room) => {
  uni.showToast({ 
    title: `房间：${room.number} ${room.name}`,
    icon: 'none'
  })
}

const handleCall = (phone) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

const handleEmail = (email) => {
  uni.setClipboardData({
    data: email,
    success: () => {
      uni.showToast({ title: '邮箱已复制', icon: 'success' })
    }
  })
}

const handleWebsite = (url) => {
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '网址已复制', icon: 'success' })
    }
  })
}

const handleShareBuilding = () => {
  const building = selectedBuilding.value
  if (!building || !building.name) {
    uni.showToast({ title: '建筑信息错误', icon: 'none' })
    return
  }
  const shareInfo = `位置：${building.name}（${building.address || ''}）`
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: building.name,
    summary: shareInfo,
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
}

const handleAddFavorite = () => {
  if (!selectedBuilding.value) {
    uni.showToast({ title: '建筑信息错误', icon: 'none' })
    return
  }
  selectedBuilding.value.favorite = !selectedBuilding.value.favorite
  uni.showToast({ 
    title: selectedBuilding.value.favorite ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

// 菜单功能
const handleBack = () => {
  uni.navigateBack()
}

const handleIndoorMap = () => {
  if (!selectedBuilding.value) {
    uni.showToast({ title: '请先选择一栋建筑', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/tabbar/function/subpages/map/indoor?buildingId=${selectedBuilding.value.id}`
  })
  showMenu.value = false
}

const handleARNavigation = () => {
  uni.showToast({ title: 'AR导航功能开发中', icon: 'none' })
  showMenu.value = false
}

const handleShareLocation = () => {
  sharingLocation.value = true
  // 开始计时
  if (sharingTimer.value) {
    clearInterval(sharingTimer.value)
  }
  sharingTimer.value = setInterval(() => {
    sharingDuration.value++
  }, 1000)
  showMenu.value = false
}

const copySharingLink = () => {
  const link = `https://map.university.edu.cn/share?lat=${currentLocation.value.latitude}&lng=${currentLocation.value.longitude}`
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
    }
  })
}

const stopSharingLocation = () => {
  sharingLocation.value = false
  sharingDuration.value = 0
  if (sharingTimer.value) {
    clearInterval(sharingTimer.value)
    sharingTimer.value = null
  }
}

const handleFeedback = () => {
  uni.navigateTo({
    url: '/pages/common/feedback?type=map'
  })
  showMenu.value = false
}

// 校园导览
const handleStartTour = (tour) => {
  uni.showToast({ title: `开始${tour.name}`, icon: 'success' })
  showCampusTour.value = false
  // 开始导览逻辑
}

const handleRandomTour = () => {
  const randomTour = campusTours.value[Math.floor(Math.random() * campusTours.value.length)]
  handleStartTour(randomTour)
}

// 生命周期
onLoad(() => {
  // 获取用户位置
  locateUser()
  
  // 加载地图数据
  loadMapData()
})

onShow(() => {
  // 刷新地图数据
  refreshMapData()
})

onHide(() => {
  // 停止位置共享
  if (sharingLocation.value) {
    stopSharingLocation()
  }
})

onUnload(() => {
  // 清理资源
  if (sharingLocation.value) {
    stopSharingLocation()
  }
})

// 数据加载
const loadMapData = () => {
  // 模拟加载地图数据
  setTimeout(() => {
    uni.showToast({ title: '地图数据加载完成', icon: 'success' })
  }, 500)
}

const refreshMapData = () => {
  // 刷新地图数据逻辑
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins/function.scss';
.campus-map-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.map-header {
  @include page-header;
  z-index: 100;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .back-btn {
      font-size: $font-size-2xl;
      color: $gray-8;
    }
    
    .header-title {
      font-size: $font-size-xl;
      font-weight: bold;
      color: $gray-8;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 30rpx;
    
    .header-icon {
      font-size: $font-size-xl;
      color: $gray-6;
    }
  }
}

.search-bar {
  position: absolute;
  top: 90rpx;
  left: 0;
  right: 0;
  @include search-bar;
  z-index: 200;
  
  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    height: 70rpx;
    background: $gray-1;
    border-radius: 35rpx;
    
    .search-input {
      flex: 1;
      height: 100%;
      padding: 0 20rpx;
      font-size: $font-size-base;
    }
    
    .clear-btn {
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 32rpx;
      color: $gray-5;
    }
  }
  
  .search-cancel {
    margin-left: 20rpx;
    font-size: $font-size-base;
    color: $primary-color;
  }
}

.map-container {
  flex: 1;
  position: relative;
  z-index: 1;
}

.location-info {
  position: absolute;
  bottom: 200rpx;
  left: 30rpx;
  right: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  z-index: 100;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .location-icon {
    font-size: 40rpx;
    color: #007AFF;
  }
  
  .location-detail {
    flex: 1;
    
    .location-address {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
    }
    
    .location-coords {
      font-size: 20rpx;
      color: #999;
    }
  }
}

.function-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.map-controls {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .control-group {
    display: flex;
    gap: 20rpx;
    
    .control-btn {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #fff;
      border: 1rpx solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #333;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      
      &.active {
        background: #007AFF;
        color: #fff;
        border-color: #007AFF;
      }
    }
  }
  
  .locate-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #fff;
    border: 1rpx solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  }
}

.search-panel {
  .search-tabs {
    display: flex;
    padding: 20rpx 30rpx 0;
    
    .search-tab {
      flex: 1;
      text-align: center;
      padding: 20rpx 0;
      font-size: 24rpx;
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
          width: 40rpx;
          height: 4rpx;
          background: #007AFF;
          border-radius: 2rpx;
        }
      }
    }
  }
  
  .search-results {
    max-height: 300rpx;
    padding: 20rpx 30rpx;
    
    .search-result-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .result-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
        background: #007AFF;
        margin-right: 20rpx;
      }
      
      .result-info {
        flex: 1;
        
        .result-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .result-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .result-distance {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }
}

.building-categories {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .categories-scroll {
    white-space: nowrap;
    
    .category-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40rpx;
      
      &:last-child {
        margin-right: 0;
      }
      
      &.active {
        .category-icon {
          transform: scale(1.1);
        }
        
        .category-text {
          color: #007AFF;
          font-weight: bold;
        }
      }
      
      .category-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #fff;
        margin-bottom: 12rpx;
        transition: transform 0.2s ease;
      }
      
      .category-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.navigation-panel {
  padding: 20rpx 30rpx;
  
  .navigation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .navigation-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .navigation-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .navigation-info {
    .route-info {
      margin-bottom: 20rpx;
      
      .route-item {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        
        .label {
          width: 100rpx;
          font-size: 24rpx;
          color: #666;
        }
        
        .value {
          flex: 1;
          font-size: 28rpx;
          color: #333;
        }
      }
    }
    
    .route-actions {
      display: flex;
      gap: 20rpx;
      
      .action-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rpx;
        padding: 20rpx 0;
        background: #007AFF;
        color: #fff;
        border-radius: 40rpx;
        font-size: 28rpx;
      }
    }
  }
}

.modal-overlay {
  @include modal-overlay;
}

.building-detail {
  @include modal-content;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid $gray-2;
    
    .building-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .building-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
      }
      
      .building-title {
        .building-name {
          font-size: $font-size-lg;
          font-weight: bold;
          color: $gray-8;
          margin-bottom: 4rpx;
        }
        
        .building-english {
          font-size: $font-size-xs;
          color: $gray-6;
        }
      }
    }
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .detail-content {
      .detail-section {
        margin-bottom: 30rpx;
        
        .section-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
        }
        
        .section-content {
          .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12rpx;
            
            .label {
              width: 120rpx;
              font-size: 24rpx;
              color: #666;
            }
            
            .value {
              flex: 1;
              font-size: 28rpx;
              color: #333;
            }
          }
        }
        
        .floors-scroll {
          white-space: nowrap;
          margin-bottom: 20rpx;
          
          .floor-item {
            display: inline-block;
            padding: 20rpx;
            margin-right: 20rpx;
            border: 1rpx solid #e5e5e5;
            border-radius: 12rpx;
            
            &.active {
              border-color: #007AFF;
              background: rgba(0, 122, 255, 0.1);
            }
            
            .floor-level {
              font-size: 28rpx;
              font-weight: bold;
              color: #333;
              margin-bottom: 8rpx;
            }
            
            .floor-name {
              font-size: 24rpx;
              color: #666;
            }
          }
        }
        
        .rooms-list {
          .room-item {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .room-number {
              width: 80rpx;
              font-size: 28rpx;
              font-weight: bold;
              color: #333;
              margin-right: 20rpx;
            }
            
            .room-info {
              flex: 1;
              
              .room-name {
                font-size: 28rpx;
                color: #333;
                margin-bottom: 8rpx;
              }
              
              .room-desc {
                font-size: 24rpx;
                color: #666;
              }
            }
            
            .room-distance {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
        
        .hours-list {
          .hours-item {
            display: flex;
            justify-content: space-between;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .day {
              font-size: 28rpx;
              color: #333;
            }
            
            .time {
              font-size: 28rpx;
              color: #333;
            }
          }
        }
        
        .contact-info {
          .contact-item {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .iconfont {
              width: 40rpx;
              font-size: 24rpx;
              color: #666;
              margin-right: 20rpx;
            }
            
            .value {
              flex: 1;
              font-size: 28rpx;
              color: #333;
            }
            
            .action {
              padding: 8rpx 20rpx;
              background: #007AFF;
              color: #fff;
              border-radius: 20rpx;
              font-size: 20rpx;
            }
          }
        }
        
        .features-list {
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12rpx;
            
            .feature-icon {
              color: #4cd964;
              margin-right: 12rpx;
              font-size: 24rpx;
            }
            
            .feature-text {
              font-size: 28rpx;
              color: #666;
            }
          }
        }
        
        .reviews-list {
          .review-item {
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .review-header {
              display: flex;
              align-items: center;
              margin-bottom: 20rpx;
              
              .review-avatar {
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                margin-right: 20rpx;
              }
              
              .review-user {
                flex: 1;
                
                .review-name {
                  font-size: 28rpx;
                  color: #333;
                  font-weight: 500;
                  margin-bottom: 4rpx;
                }
                
                .review-time {
                  font-size: 24rpx;
                  color: #999;
                }
              }
              
              .review-rating {
                .star {
                  font-size: 20rpx;
                  color: #ccc;
                  
                  &.active {
                    color: #ff9500;
                  }
                }
              }
            }
            
            .review-content {
              font-size: 28rpx;
              color: #333;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
  
  .modal-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .footer-actions {
      display: flex;
      justify-content: space-between;
      
      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.menu-overlay {
  @include menu-overlay;
  
  .menu-content {
    width: 100%;
    background: $white;
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 30rpx;
      border-bottom: 1rpx solid $gray-2;
      font-size: $font-size-base;
      color: $gray-8;
      
      &.cancel {
        justify-content: center;
        color: $danger-color;
      }
    }
  }
}

.campus-tour {
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
    
    .tour-options {
      .tour-option {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .tour-icon {
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40rpx;
          color: #fff;
          margin-right: 20rpx;
        }
        
        .tour-info {
          flex: 1;
          
          .tour-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 8rpx;
          }
          
          .tour-desc {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 8rpx;
          }
          
          .tour-duration {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
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
      background: #f5f5f5;
      color: #666;
      
      &.primary {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}

.location-sharing {
  position: absolute;
  top: 100rpx;
  left: 30rpx;
  right: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  z-index: 100;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .sharing-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 28rpx;
    color: #333;
    
    .sharing-close {
      margin-left: auto;
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .sharing-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24rpx;
    color: #666;
    
    .sharing-link {
      color: #007AFF;
    }
  }
}
</style>