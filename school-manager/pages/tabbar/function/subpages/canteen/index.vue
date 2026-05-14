<!--
 * 文件路径: pages/tabbar/function/subpages/canteen/index.vue
 * 功能说明: 食堂页面
 * 主要功能:
 *   1. 显示食堂菜单和菜品
 *   2. 菜品搜索和筛选
 *   3. 查看菜品详情和价格
 *   4. 食堂营业时间显示
 * 数据来源: API接口或本地存储
 * 相关页面: pages/tabbar/function/index.vue (功能中心)
 -->
<template>
  <view class="canteen-page">
    <!-- 页面头部 -->
    <view class="canteen-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
        <view class="header-title">校园食堂</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="toggleViewMode">
          <text class="iconfont">{{ viewMode === 'list' ? '📄' : '🗺️' }}</text>
        </view>
        <view class="header-icon" @click="showFilter = true">
          <text class="iconfont">⚙️</text>
        </view>
        <view class="header-icon" @click="handleSearch">
          <text class="iconfont">🔍</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="showSearch" class="search-bar">
      <view class="search-input-wrapper">
        <text class="iconfont">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索菜品..." 
          v-model="searchKeyword"
          @confirm="handleSearchConfirm"
          :focus="showSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
      </view>
      <view class="search-cancel" @click="hideSearch">取消</view>
    </view>

    <!-- 食堂分类 -->
    <view class="canteen-tabs">
      <scroll-view class="tabs-scroll" scroll-x>
        <view 
          class="tab-item" 
          :class="{ active: currentCanteen === item.id }"
          v-for="item in canteens" 
          :key="item.id"
          @click="handleCanteenChange(item.id)"
        >
          <view class="tab-icon">
            <text class="iconfont" :class="item.icon"></text>
          </view>
          <text class="tab-text">{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 时间选择 -->
    <view class="time-selection">
      <view class="time-tabs">
        <view 
          class="time-tab" 
          :class="{ active: currentTime === item.value }"
          v-for="item in timeOptions" 
          :key="item.value"
          @click="currentTime = item.value"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="canteen-scroll" scroll-y>
      <!-- 今日推荐 -->
      <view v-if="todayRecommend.length > 0" class="today-recommend">
        <view class="section-header">
          <view class="section-title">今日推荐</view>
          <view class="section-more" @click="viewAllRecommend">
            更多推荐
          </view>
        </view>
        
        <scroll-view class="recommend-scroll" scroll-x>
          <view 
            v-for="item in todayRecommend" 
            :key="item.id"
            class="recommend-item"
            @click="handleFoodClick(item)"
          >
            <image class="recommend-img" :src="item.image" mode="aspectFill" />
            <view class="recommend-info">
              <view class="recommend-title">{{ item.name }}</view>
              <view class="recommend-price">¥{{ item.price }}</view>
              <view class="recommend-tags">
                <view v-if="item.hot" class="tag hot">热销</view>
                <view v-if="item.discount" class="tag discount">{{ item.discount }}折</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 食堂列表/地图视图 -->
      <view v-if="viewMode === 'list'" class="canteen-list">
        <view 
          v-for="canteen in filteredCanteens" 
          :key="canteen.id"
          class="canteen-item"
          @click="handleCanteenDetail(canteen.id)"
        >
          <image class="canteen-img" :src="canteen.image" mode="aspectFill" />
          <view class="canteen-info">
            <view class="canteen-header">
              <view class="canteen-name">{{ canteen.name }}</view>
              <view class="canteen-distance">{{ canteen.distance }}</view>
            </view>
            <view class="canteen-desc">{{ canteen.description }}</view>
            <view class="canteen-details">
              <view class="detail-item">
                <text class="iconfont">⏰</text>
                <text>{{ canteen.openTime }}</text>
              </view>
              <view class="detail-item">
                <text class="iconfont">💳</text>
                <text>{{ canteen.paymentMethods }}</text>
              </view>
            </view>
            <view class="canteen-rating">
              <view class="rating-stars">
                <text v-for="star in 5" :key="star" class="star" :class="{ active: star <= canteen.rating }">★</text>
              </view>
              <text class="rating-score">{{ canteen.rating.toFixed(1) }}</text>
              <text class="rating-count">({{ canteen.reviewCount }}条评价)</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 地图视图 -->
      <view v-else class="canteen-map">
        <map 
          id="canteenMap"
          style="width: 100%; height: 500rpx;"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :markers="mapMarkers"
          :show-location="true"
        />
        
        <view class="map-legend">
          <view class="legend-item">
            <view class="legend-color" style="background: #007AFF;"></view>
            <text>一食堂</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background: #4cd964;"></view>
            <text>二食堂</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background: #ff9500;"></view>
            <text>特色餐厅</text>
          </view>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view v-if="currentMenu.length > 0" class="menu-section">
        <view class="section-header">
          <view class="section-title">今日菜单</view>
          <view class="section-date">{{ formatDate(today) }}</view>
        </view>
        
        <view class="category-tabs">
          <view 
            v-for="category in menuCategories" 
            :key="category.value"
            class="category-tab"
            :class="{ active: currentCategory === category.value }"
            @click="currentCategory = category.value"
          >
            {{ category.label }}
          </view>
        </view>
        
        <view class="menu-list">
          <view 
            v-for="item in filteredMenu" 
            :key="item.id"
            class="menu-item"
            @click="handleFoodClick(item)"
          >
            <image class="menu-img" :src="item.image" mode="aspectFill" />
            <view class="menu-info">
              <view class="menu-header">
                <view class="menu-name">{{ item.name }}</view>
                <view class="menu-price">¥{{ item.price }}</view>
              </view>
              <view class="menu-desc">{{ item.description }}</view>
              <view class="menu-details">
                <view class="detail-item">
                  <text class="iconfont">🔥</text>
                  <text>{{ item.calories }}卡路里</text>
                </view>
                <view class="detail-item">
                  <text class="iconfont">⏱️</text>
                  <text>约{{ item.cookTime }}分钟</text>
                </view>
              </view>
              <view class="menu-tags">
                <view v-for="tag in item.tags" :key="tag" class="menu-tag">{{ tag }}</view>
              </view>
            </view>
            <view class="menu-action">
              <view 
                class="add-btn"
                :class="{ added: item.added }"
                @click.stop="toggleAddToCart(item)"
              >
                {{ item.added ? '已添加' : '加入' }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 排队信息 -->
      <view v-if="currentCanteenInfo" class="queue-info">
        <view class="section-header">
          <view class="section-title">实时排队</view>
          <view class="refresh-btn" @click="refreshQueueInfo">
            <text class="iconfont">🔄</text>
            <text>刷新</text>
          </view>
        </view>
        
        <view class="queue-status">
          <view class="queue-item">
            <view class="queue-label">当前排队人数</view>
            <view class="queue-value">{{ currentCanteenInfo.queueCount }}人</view>
            <view class="queue-progress">
              <view 
                class="progress-bar" 
                :style="{ width: Math.min(currentCanteenInfo.queueCount / 100 * 100, 100) + '%' }"
              ></view>
            </view>
          </view>
          <view class="queue-item">
            <view class="queue-label">预计等待时间</view>
            <view class="queue-value">{{ currentCanteenInfo.waitTime }}分钟</view>
          </view>
        </view>
      </view>

      <!-- 评价区域 -->
      <view v-if="reviews.length > 0" class="reviews-section">
        <view class="section-header">
          <view class="section-title">最新评价</view>
          <view class="section-more" @click="viewAllReviews">
            查看全部
          </view>
        </view>
        
        <view class="reviews-list">
          <view 
            v-for="review in reviews.slice(0, 3)" 
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
            <view v-if="review.images" class="review-images">
              <image 
                v-for="(img, index) in review.images" 
                :key="index"
                class="review-img"
                :src="img"
                mode="aspectFill"
                @click="previewReviewImages(index, review.images)"
              />
            </view>
            <view class="review-actions">
              <view class="action-item" @click="toggleLikeReview(review.id)">
                <text class="iconfont">❤️</text>
                <text>{{ review.likes || 0 }}</text>
              </view>
              <view class="action-item" @click="replyReview(review.id)">
                <text class="iconfont">💬</text>
                <text>回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 购物车 -->
    <view v-if="cartItems.length > 0" class="cart-bar">
      <view class="cart-info">
        <view class="cart-icon">
          <text class="iconfont">🛒</text>
          <view v-if="cartItems.length > 0" class="cart-count">{{ cartItems.length }}</view>
        </view>
        <view class="cart-total">
          <view class="total-label">合计</view>
          <view class="total-price">¥{{ totalPrice }}</view>
        </view>
      </view>
      <view class="cart-action" @click="handleCheckout">去结算</view>
    </view>

    <!-- 菜品详情 -->
    <view v-if="showFoodDetail" class="modal-overlay" @click="showFoodDetail = false">
      <view class="modal-content food-detail" @click.stop>
        <view class="modal-header">
          <view class="food-header">
            <image class="food-img" :src="selectedFood.image || ''" mode="aspectFill" />
            <view class="food-basic">
              <view class="food-name">{{ selectedFood.name || '' }}</view>
              <view class="food-price">¥{{ selectedFood.price || 0 }}</view>
              <view class="food-rating">
                <text v-for="star in 5" :key="star" class="star" :class="{ active: star <= (selectedFood.rating || 0) }">★</text>
                <text class="rating-text">{{ (selectedFood.rating || 0).toFixed(1) }}</text>
              </view>
            </view>
          </view>
          <view class="modal-close" @click="showFoodDetail = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="detail-content">
            <view class="detail-section">
              <view class="section-title">菜品介绍</view>
              <view class="section-content">{{ selectedFood.description || '' }}</view>
            </view>
            
            <view v-if="selectedFood.nutrition" class="detail-section">
              <view class="section-title">营养成分</view>
              <view class="nutrition-grid">
                <view class="nutrition-item">
                  <view class="nutrition-value">{{ selectedFood.nutrition.calories || 0 }}</view>
                  <view class="nutrition-label">卡路里</view>
                </view>
                <view class="nutrition-item">
                  <view class="nutrition-value">{{ selectedFood.nutrition.protein || 0 }}g</view>
                  <view class="nutrition-label">蛋白质</view>
                </view>
                <view class="nutrition-item">
                  <view class="nutrition-value">{{ selectedFood.nutrition.fat || 0 }}g</view>
                  <view class="nutrition-label">脂肪</view>
                </view>
                <view class="nutrition-item">
                  <view class="nutrition-value">{{ selectedFood.nutrition.carb || 0 }}g</view>
                  <view class="nutrition-label">碳水</view>
                </view>
              </view>
            </view>
            
            <view v-if="selectedFood.ingredients" class="detail-section">
              <view class="section-title">主要食材</view>
              <view class="ingredients-list">
                <view 
                  v-for="(ing, index) in selectedFood.ingredients" 
                  :key="index"
                  class="ingredient-item"
                >
                  <text class="ingredient-icon">•</text>
                  <text class="ingredient-text">{{ ing }}</text>
                </view>
              </view>
            </view>
            
            <view v-if="selectedFood.tags" class="detail-section">
              <view class="section-title">菜品标签</view>
              <view class="tags-container">
                <view 
                  v-for="tag in selectedFood.tags" 
                  :key="tag"
                  class="tag-item"
                >
                  {{ tag }}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="quantity-selector">
            <view class="quantity-btn" @click="decreaseQuantity">-</view>
            <view class="quantity-value">{{ foodQuantity }}</view>
            <view class="quantity-btn" @click="increaseQuantity">+</view>
          </view>
          <view class="add-to-cart" @click="addToCart">加入购物车 ¥{{ (selectedFood.price || 0) * foodQuantity }}</view>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilter" class="modal-overlay" @click="showFilter = false">
      <view class="modal-content filter-modal" @click.stop>
        <view class="modal-header">
          <text>筛选</text>
          <view class="header-actions">
            <text class="reset-btn" @click="resetFilters">重置</text>
            <text class="modal-close" @click="showFilter = false">完成</text>
          </view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <!-- 价格筛选 -->
          <view class="filter-section">
            <view class="section-title">价格范围</view>
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
          
          <!-- 口味筛选 -->
          <view class="filter-section">
            <view class="section-title">口味偏好</view>
            <view class="taste-options">
              <view 
                v-for="taste in tasteOptions" 
                :key="taste.value"
                class="taste-option"
                :class="{ active: filters.taste === taste.value }"
                @click="filters.taste = taste.value"
              >
                {{ taste.label }}
              </view>
            </view>
          </view>
          
          <!-- 评分筛选 -->
          <view class="filter-section">
            <view class="section-title">最低评分</view>
            <view class="rating-options">
              <view 
                v-for="rating in ratingOptions" 
                :key="rating.value"
                class="rating-option"
                :class="{ active: filters.minRating === rating.value }"
                @click="filters.minRating = rating.value"
              >
                <text v-for="star in 5" :key="star" class="star" :class="{ active: star <= rating.value }">★</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

// 响应式数据
const showSearch = ref(false)
const showFoodDetail = ref(false)
const showFilter = ref(false)
const viewMode = ref('list')
const searchKeyword = ref('')
const currentCanteen = ref('all')
const currentTime = ref('breakfast')
const currentCategory = ref('all')
const foodQuantity = ref(1)
const today = new Date()

// 选中的菜品
const selectedFood = ref({})

// 购物车
const cartItems = ref([
  { id: 1, name: '宫保鸡丁', price: 18, quantity: 1, image: '/static/images/food1.jpg' },
  { id: 2, name: '麻婆豆腐', price: 12, quantity: 2, image: '/static/images/food2.jpg' }
])

// 筛选条件
const filters = ref({
  minPrice: null,
  maxPrice: null,
  taste: 'all',
  minRating: 0
})

// 食堂数据
const canteens = ref([
  { id: 'canteen1', name: '一食堂', icon: 'icon-restaurant', image: '/static/images/canteen1.jpg', description: '主食堂，种类齐全', distance: '500m', openTime: '6:30-19:30', paymentMethods: '校园卡/移动支付', rating: 4.5, reviewCount: 234 },
  { id: 'canteen2', name: '二食堂', icon: 'icon-restaurant', image: '/static/images/canteen2.jpg', description: '特色美食广场', distance: '800m', openTime: '10:00-21:00', paymentMethods: '校园卡/移动支付', rating: 4.7, reviewCount: 156 },
  { id: 'canteen3', name: '清真食堂', icon: 'icon-restaurant', image: '/static/images/canteen3.jpg', description: '清真风味', distance: '600m', openTime: '6:30-20:00', paymentMethods: '校园卡/现金', rating: 4.3, reviewCount: 89 },
  { id: 'canteen4', name: '教工食堂', icon: 'icon-restaurant', image: '/static/images/canteen4.jpg', description: '教工专用，学生可进', distance: '1200m', openTime: '11:00-13:30', paymentMethods: '校园卡', rating: 4.6, reviewCount: 67 }
])

// 当前食堂信息
const currentCanteenInfo = ref({
  queueCount: 35,
  waitTime: 15
})

// 时间选项
const timeOptions = [
  { label: '早餐', value: 'breakfast' },
  { label: '午餐', value: 'lunch' },
  { label: '晚餐', value: 'dinner' },
  { label: '夜宵', value: 'night' }
]

// 今日推荐
const todayRecommend = ref([
  { id: 1, name: '特价套餐', price: 12, image: '/static/images/food1.jpg', hot: true, discount: 8.8 },
  { id: 2, name: '招牌牛肉面', price: 18, image: '/static/images/food2.jpg', hot: true },
  { id: 3, name: '营养沙拉', price: 15, image: '/static/images/food3.jpg', discount: 9 },
  { id: 4, name: '水果拼盘', price: 8, image: '/static/images/food4.jpg' }
])

// 菜单分类
const menuCategories = [
  { label: '全部', value: 'all' },
  { label: '热菜', value: 'hot' },
  { label: '凉菜', value: 'cold' },
  { label: '主食', value: 'staple' },
  { label: '汤类', value: 'soup' },
  { label: '饮料', value: 'drink' }
]

// 菜单数据
const menuList = ref([
  { 
    id: 1, 
    name: '宫保鸡丁', 
    price: 18, 
    image: '/static/images/food1.jpg',
    description: '传统川菜，麻辣鲜香，鸡肉嫩滑',
    calories: 350,
    cookTime: 10,
    category: 'hot',
    rating: 4.5,
    tags: ['热销', '川菜', '辣'],
    added: false,
    nutrition: { calories: 350, protein: 25, fat: 12, carb: 20 },
    ingredients: ['鸡胸肉', '花生', '干辣椒', '花椒']
  },
  { 
    id: 2, 
    name: '麻婆豆腐', 
    price: 12, 
    image: '/static/images/food2.jpg',
    description: '经典川菜，麻辣烫嫩，豆腐入味',
    calories: 280,
    cookTime: 8,
    category: 'hot',
    rating: 4.7,
    tags: ['经典', '川菜', '辣'],
    added: true,
    nutrition: { calories: 280, protein: 15, fat: 8, carb: 25 },
    ingredients: ['豆腐', '牛肉末', '豆瓣酱', '花椒']
  }
])

// 评价数据
const reviews = ref([
  { 
    id: 1, 
    name: '张三', 
    avatar: '/static/avatars/user1.jpg',
    content: '宫保鸡丁很好吃，鸡肉很嫩，味道正宗！',
    time: '2024-12-20 12:30:00',
    rating: 5,
    likes: 12,
    images: ['/static/images/food1.jpg', '/static/images/food2.jpg']
  },
  { 
    id: 2, 
    name: '李四', 
    avatar: '/static/avatars/user2.jpg',
    content: '环境干净，服务不错，就是价格有点贵',
    time: '2024-12-20 11:45:00',
    rating: 4,
    likes: 8
  }
])

// 地图数据
const mapCenter = ref({
  latitude: 30.263,
  longitude: 120.105
})

const mapMarkers = ref([
  { id: 1, latitude: 30.263, longitude: 120.105, title: '一食堂', iconPath: '/static/icons/canteen1.png' },
  { id: 2, latitude: 30.262, longitude: 120.106, title: '二食堂', iconPath: '/static/icons/canteen2.png' },
  { id: 3, latitude: 30.264, longitude: 120.104, title: '清真食堂', iconPath: '/static/icons/canteen3.png' }
])

// 筛选选项
const tasteOptions = [
  { label: '全部', value: 'all' },
  { label: '辣', value: 'spicy' },
  { label: '甜', value: 'sweet' },
  { label: '咸', value: 'salty' },
  { label: '清淡', value: 'light' }
]

const ratingOptions = [
  { label: '4.5分以上', value: 4.5 },
  { label: '4.0分以上', value: 4.0 },
  { label: '3.5分以上', value: 3.5 },
  { label: '3.0分以上', value: 3.0 }
]

// 计算属性
const filteredCanteens = computed(() => {
  return canteens.value.filter(canteen => {
    if (currentCanteen.value !== 'all' && canteen.id !== currentCanteen.value) {
      return false
    }
    return true
  })
})

const currentMenu = computed(() => {
  if (currentCanteen.value === 'all') {
    return menuList.value
  }
  return menuList.value
})

const filteredMenu = computed(() => {
  let result = [...currentMenu.value]
  
  // 按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(item => item.category === currentCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword)))
    )
  }
  
  // 按价格筛选
  if (filters.value.minPrice != null) {
    result = result.filter(item => item.price >= filters.value.minPrice)
  }
  if (filters.value.maxPrice != null) {
    result = result.filter(item => item.price <= filters.value.maxPrice)
  }
  
  // 按口味筛选
  if (filters.value.taste !== 'all') {
    result = result.filter(item => 
      item.tags && item.tags.includes(filters.value.taste === 'spicy' ? '辣' : 
      filters.value.taste === 'sweet' ? '甜' : 
      filters.value.taste === 'salty' ? '咸' : '清淡')
    )
  }
  
  // 按评分筛选
  if (filters.value.minRating > 0) {
    result = result.filter(item => item.rating >= filters.value.minRating)
  }
  
  return result
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 工具函数
const formatDate = (date) => {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

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

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'map' : 'list'
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
  handleSearchConfirm()
}

const handleSearchConfirm = () => {
  showSearch.value = false
  // 搜索逻辑
}

const handleCanteenChange = (canteenId) => {
  currentCanteen.value = canteenId
}

const handleCanteenDetail = (canteenId) => {
  uni.navigateTo({
    url: `/pages/tabbar/function/subpages/canteen/detail?id=${canteenId}`
  })
}

const handleFoodClick = (food) => {
  selectedFood.value = food
  showFoodDetail.value = true
  foodQuantity.value = 1
}

const toggleAddToCart = (food) => {
  const index = cartItems.value.findIndex(item => item.id === food.id)
  if (index === -1) {
    cartItems.value.push({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image
    })
    food.added = true
  } else {
    cartItems.value.splice(index, 1)
    food.added = false
  }
}

const increaseQuantity = () => {
  foodQuantity.value++
}

const decreaseQuantity = () => {
  if (foodQuantity.value > 1) {
    foodQuantity.value--
  }
}

const addToCart = () => {
  const food = selectedFood.value
  if (!food || !food.id) {
    uni.showToast({
      title: '菜品信息错误',
      icon: 'none'
    })
    return
  }
  
  const index = cartItems.value.findIndex(item => item.id === food.id)
  
  if (index === -1) {
    cartItems.value.push({
      id: food.id,
      name: food.name || '',
      price: food.price || 0,
      quantity: foodQuantity.value,
      image: food.image || ''
    })
  } else {
    cartItems.value[index].quantity += foodQuantity.value
  }
  
  // 更新菜单项的 added 状态
  const menuItem = menuList.value.find(item => item.id === food.id)
  if (menuItem) {
    menuItem.added = true
  }
  
  showFoodDetail.value = false
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

const handleCheckout = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/canteen/checkout'
  })
}

const refreshQueueInfo = () => {
  uni.showLoading({ title: '刷新中...' })
  setTimeout(() => {
    currentCanteenInfo.value.queueCount = Math.floor(Math.random() * 100)
    currentCanteenInfo.value.waitTime = Math.floor(currentCanteenInfo.value.queueCount * 0.5)
    uni.hideLoading()
    uni.showToast({ title: '已更新排队信息', icon: 'success' })
  }, 1000)
}

const previewReviewImages = (index, images) => {
  uni.previewImage({
    current: index,
    urls: images
  })
}

const toggleLikeReview = (reviewId) => {
  const review = reviews.value.find(r => r.id === reviewId)
  if (review) {
    review.likes = (review.likes || 0) + 1
  }
}

const replyReview = (reviewId) => {
  uni.showToast({ title: '回复功能开发中', icon: 'none' })
}

const viewAllRecommend = () => {
  uni.showToast({ title: '查看所有推荐', icon: 'none' })
}

const viewAllReviews = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/canteen/reviews'
  })
}

const resetFilters = () => {
  filters.value = {
    minPrice: null,
    maxPrice: null,
    taste: 'all',
    minRating: 0
  }
}

// 生命周期
onLoad(() => {
  // 加载食堂数据
  loadCanteenData()
})

onShow(() => {
  // 刷新数据
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
  loadMoreData()
})

// 数据加载
const loadCanteenData = () => {
  // 模拟加载数据
  setTimeout(() => {
    uni.showToast({ title: '数据加载完成', icon: 'success' })
  }, 500)
}

const refreshData = () => {
  refreshQueueInfo()
}

const loadMoreData = () => {
  // 加载更多数据逻辑
}
</script>

<style lang="scss" scoped>
.canteen-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.canteen-header {
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

.canteen-tabs {
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  padding: 20rpx 0;
  
  .tabs-scroll {
    white-space: nowrap;
    
    .tab-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 0 30rpx;
      gap: 12rpx;
      
      .tab-icon {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        color: #666;
      }
      
      .tab-text {
        font-size: 24rpx;
        color: #666;
      }
      
      &.active {
        .tab-icon {
          color: #007AFF;
        }
        
        .tab-text {
          color: #007AFF;
          font-weight: bold;
        }
      }
    }
  }
}

.time-selection {
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  padding: 20rpx 30rpx;
  
  .time-tabs {
    display: flex;
    gap: 20rpx;
    
    .time-tab {
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #666;
      
      &.active {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}

.canteen-scroll {
  flex: 1;
  height: 0;
  padding: 20rpx 30rpx 120rpx;
}

.today-recommend {
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
      width: 250rpx;
      margin-right: 20rpx;
      border-radius: 16rpx;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      
      .recommend-img {
        width: 100%;
        height: 150rpx;
      }
      
      .recommend-info {
        padding: 20rpx;
        
        .recommend-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .recommend-price {
          font-size: 28rpx;
          color: #ff3b30;
          font-weight: bold;
          margin-bottom: 8rpx;
        }
        
        .recommend-tags {
          display: flex;
          gap: 8rpx;
          
          .tag {
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            color: #fff;
            
            &.hot {
              background: #ff3b30;
            }
            
            &.discount {
              background: #4cd964;
            }
          }
        }
      }
    }
  }
}

.canteen-list {
  .canteen-item {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    
    .canteen-img {
      width: 100%;
      height: 200rpx;
    }
    
    .canteen-info {
      padding: 20rpx;
      
      .canteen-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;
        
        .canteen-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        
        .canteen-distance {
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .canteen-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
      }
      
      .canteen-details {
        display: flex;
        gap: 20rpx;
        margin-bottom: 12rpx;
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .canteen-rating {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        .rating-stars {
          .star {
            font-size: 24rpx;
            color: #ccc;
            
            &.active {
              color: #ff9500;
            }
          }
        }
        
        .rating-score {
          font-size: 24rpx;
          color: #ff9500;
        }
        
        .rating-count {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }
}

.canteen-map {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .map-legend {
    display: flex;
    justify-content: space-around;
    padding: 20rpx;
    background: #fff;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #666;
      
      .legend-color {
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
      }
    }
  }
}

.menu-section {
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
    
    .section-date {
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .category-tab {
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #666;
      
      &.active {
        background: #007AFF;
        color: #fff;
      }
    }
  }
  
  .menu-list {
    .menu-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .menu-img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }
      
      .menu-info {
        flex: 1;
        
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;
          
          .menu-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
          }
          
          .menu-price {
            font-size: 28rpx;
            color: #ff3b30;
            font-weight: bold;
          }
        }
        
        .menu-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .menu-details {
          display: flex;
          gap: 20rpx;
          margin-bottom: 8rpx;
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            font-size: 20rpx;
            color: #999;
          }
        }
        
        .menu-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8rpx;
          
          .menu-tag {
            padding: 4rpx 12rpx;
            background: #f5f5f5;
            border-radius: 12rpx;
            font-size: 20rpx;
            color: #666;
          }
        }
      }
      
      .menu-action {
        .add-btn {
          padding: 12rpx 24rpx;
          background: #007AFF;
          color: #fff;
          border-radius: 20rpx;
          font-size: 24rpx;
          
          &.added {
            background: #4cd964;
          }
        }
      }
    }
  }
}

.queue-info {
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
    
    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .queue-status {
    .queue-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
      
      .queue-label {
        font-size: 28rpx;
        color: #333;
      }
      
      .queue-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #007AFF;
      }
      
      .queue-progress {
        flex: 1;
        height: 8rpx;
        background: #f0f0f0;
        border-radius: 4rpx;
        margin: 0 20rpx;
        overflow: hidden;
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4cd964, #007AFF);
          border-radius: 4rpx;
        }
      }
    }
  }
}

.reviews-section {
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
            font-size: 24rpx;
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
        margin-bottom: 20rpx;
      }
      
      .review-images {
        display: flex;
        gap: 20rpx;
        margin-bottom: 20rpx;
        
        .review-img {
          width: 150rpx;
          height: 150rpx;
          border-radius: 8rpx;
        }
      }
      
      .review-actions {
        display: flex;
        gap: 20rpx;
        
        .action-item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.safe-area {
  height: 120rpx;
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
  
  .cart-info {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .cart-icon {
      position: relative;
      
      .iconfont {
        font-size: 40rpx;
        color: #333;
      }
      
      .cart-count {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
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
    
    .cart-total {
      .total-label {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 4rpx;
      }
      
      .total-price {
        font-size: 32rpx;
        color: #ff3b30;
        font-weight: bold;
      }
    }
  }
  
  .cart-action {
    padding: 20rpx 40rpx;
    background: #007AFF;
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
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

.food-detail {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    .food-header {
      display: flex;
      
      .food-img {
        width: 200rpx;
        height: 200rpx;
      }
      
      .food-basic {
        flex: 1;
        padding: 20rpx;
        
        .food-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .food-price {
          font-size: 40rpx;
          color: #ff3b30;
          font-weight: bold;
          margin-bottom: 12rpx;
        }
        
        .food-rating {
          display: flex;
          align-items: center;
          gap: 8rpx;
          
          .star {
            font-size: 24rpx;
            color: #ccc;
            
            &.active {
              color: #ff9500;
            }
          }
          
          .rating-text {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
    
    .modal-close {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
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
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
        
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20rpx;
          
          .nutrition-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .nutrition-value {
              font-size: 28rpx;
              font-weight: bold;
              color: #333;
              margin-bottom: 8rpx;
            }
            
            .nutrition-label {
              font-size: 24rpx;
              color: #666;
            }
          }
        }
        
        .ingredients-list {
          .ingredient-item {
            display: flex;
            align-items: center;
            margin-bottom: 12rpx;
            
            .ingredient-icon {
              color: #007AFF;
              margin-right: 12rpx;
              font-size: 24rpx;
            }
            
            .ingredient-text {
              font-size: 28rpx;
              color: #666;
            }
          }
        }
        
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12rpx;
          
          .tag-item {
            padding: 8rpx 20rpx;
            background: #f5f5f5;
            border-radius: 20rpx;
            font-size: 24rpx;
            color: #666;
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
    
    .quantity-selector {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 40rpx;
      
      .quantity-btn {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #333;
      }
      
      .quantity-value {
        width: 60rpx;
        text-align: center;
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .add-to-cart {
      flex: 1;
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

.filter-modal {
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
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
    padding: 20rpx 30rpx;
    
    .filter-section {
      margin-bottom: 40rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 20rpx;
      }
      
      .price-range {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .price-input {
          flex: 1;
          height: 70rpx;
          padding: 0 20rpx;
          border: 1rpx solid #e5e5e5;
          border-radius: 8rpx;
          font-size: 28rpx;
          background: #fafafa;
        }
        
        .price-separator {
          color: #999;
        }
      }
      
      .taste-options,
      .rating-options {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .taste-option,
        .rating-option {
          padding: 12rpx 24rpx;
          background: #f5f5f5;
          border-radius: 40rpx;
          font-size: 24rpx;
          color: #666;
          
          &.active {
            background: #007AFF;
            color: #fff;
          }
        }
        
        .rating-option {
          .star {
            font-size: 20rpx;
            color: #ccc;
            
            &.active {
              color: #ff9500;
            }
          }
        }
      }
    }
  }
}
</style>