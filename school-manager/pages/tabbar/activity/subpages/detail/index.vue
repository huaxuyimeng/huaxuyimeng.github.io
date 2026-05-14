<!--
 * 文件路径: pages/tabbar/activity/subpages/detail/index.vue
 * 功能说明: 活动详情页面
 * 主要功能:
 *   1. 显示活动详细信息（时间、地点、内容等）
 *   2. 活动报名功能
 *   3. 查看报名情况
 *   4. 取消报名
 *   5. 收藏、分享功能
 * 数据来源: API接口或本地存储
 * 相关页面: pages/user/registrations.vue (我的报名)
 -->
<template>
  <view class="activity-detail-container">
    <!-- 自定义导航栏 -->
    <view class="detail-navbar">
      <view class="navbar-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
      </view>
      <view class="navbar-title">活动详情</view>
      <view class="navbar-right">
        <view class="nav-icon" @click="handleShare">
          <text class="iconfont">↗️</text>
        </view>
        <view class="nav-icon" @click="showMoreMenu = true">
          <text class="iconfont">⋯</text>
        </view>
      </view>
    </view>

    <!-- 活动内容 -->
    <scroll-view 
      class="detail-scroll" 
      scroll-y 
      :scroll-top="scrollTop"
      @scroll="handleScroll"
    >
      <!-- 活动头部 -->
      <view class="detail-header">
        <!-- 轮播图 -->
        <swiper 
          v-if="activity.images && activity.images.length > 0"
          class="detail-swiper" 
          :indicator-dots="activity.images.length > 1"
          :autoplay="true"
          :interval="3000"
          :duration="500"
        >
          <swiper-item v-for="(img, index) in activity.images" :key="index">
            <image 
              class="swiper-img" 
              :src="img" 
              mode="aspectFill"
              @click="previewImages(index)"
            />
          </swiper-item>
        </swiper>
        
        <!-- 单张图片 -->
        <view v-else class="single-cover">
          <image 
            class="cover-img" 
            :src="activity.cover" 
            mode="aspectFill"
            @click="previewImages(0)"
          />
        </view>

        <!-- 活动状态 -->
        <view class="header-status">
          <view class="status-tag" :class="activity.status">
            {{ getStatusText(activity.status) }}
          </view>
          <view v-if="activity.isFree" class="free-tag">免费</view>
          <view v-if="activity.isHot" class="hot-tag">热门</view>
        </view>
      </view>

      <!-- 活动基本信息 -->
      <view class="basic-info">
        <view class="info-title">{{ activity.title }}</view>
        
        <!-- 关键信息 -->
        <view class="key-info-list">
          <view class="key-info-item">
            <text class="key-icon">⏰</text>
            <text class="key-label">活动时间：</text>
            <text class="key-value">{{ formatDateTime(activity.startTime) }}</text>
          </view>
          <view class="key-info-item">
            <text class="key-icon">📍</text>
            <text class="key-label">活动地点：</text>
            <text class="key-value">{{ activity.location }}</text>
          </view>
          <view class="key-info-item">
            <text class="key-icon">👥</text>
            <text class="key-label">报名情况：</text>
            <text class="key-value">{{ activity.participants || 0 }}/{{ activity.capacity || 0 }}人</text>
          </view>
          <view class="key-info-item">
            <text class="key-icon">📌</text>
            <text class="key-label">活动状态：</text>
            <view class="status-badge" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 活动详情卡片 -->
      <view class="detail-card">
        <!-- 时间地点 -->
        <view class="detail-section">
          <view class="section-title">
            <text class="iconfont">⏰</text>
            <text>时间地点</text>
          </view>
          <view class="section-content">
            <view class="time-item">
              <text class="time-label">开始时间：</text>
              <text class="time-value">{{ formatDateTime(activity.startTime) }}</text>
            </view>
            <view v-if="activity.endTime" class="time-item">
              <text class="time-label">结束时间：</text>
              <text class="time-value">{{ formatDateTime(activity.endTime) }}</text>
            </view>
            <view class="location-item">
              <text class="location-label">活动地点：</text>
              <text class="location-value">{{ activity.location }}</text>
            </view>
            <view v-if="activity.address" class="address-item">
              <text class="address-label">详细地址：</text>
              <text class="address-value">{{ activity.address }}</text>
            </view>
            <view class="map-container" v-if="showMap">
              <map 
                id="detailMap"
                style="width: 100%; height: 200rpx;"
                :latitude="mapLocation.latitude"
                :longitude="mapLocation.longitude"
                :markers="mapMarkers"
              />
            </view>
          </view>
        </view>

        <!-- 活动详情 -->
        <view class="detail-section">
          <view class="section-title">
            <text class="iconfont">📋</text>
            <text>活动详情</text>
          </view>
          <view class="section-content">
            <rich-text :nodes="parseContent(activity.content)" />
          </view>
        </view>

        <!-- 参与要求 -->
        <view v-if="activity.requirements" class="detail-section">
          <view class="section-title">
            <text class="iconfont">✅</text>
            <text>参与要求</text>
          </view>
          <view class="section-content">
            <view class="requirements-list">
              <view 
                v-for="(req, index) in activity.requirements" 
                :key="index"
                class="requirement-item"
              >
                <text class="req-icon">•</text>
                <text class="req-text">{{ req }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 联系方式 -->
        <view v-if="activity.contact" class="detail-section">
          <view class="section-title">
            <text class="iconfont">📞</text>
            <text>联系方式</text>
          </view>
          <view class="section-content contact-info">
            <view v-if="activity.contact.name" class="contact-item">
              <text class="contact-label">联系人：</text>
              <text class="contact-value">{{ activity.contact.name }}</text>
            </view>
            <view v-if="activity.contact.phone" class="contact-item">
              <text class="contact-label">联系电话：</text>
              <text class="contact-value phone" @click="makePhoneCall">
                {{ activity.contact.phone }}
              </text>
            </view>
            <view v-if="activity.contact.wechat" class="contact-item">
              <text class="contact-label">微信：</text>
              <text class="contact-value wechat" @click="copyWechat">
                {{ activity.contact.wechat }}
                <text class="copy-tip">(点击复制)</text>
              </text>
            </view>
          </view>
        </view>

        <!-- 标签 -->
        <view v-if="activity.tags && activity.tags.length > 0" class="detail-section">
          <view class="section-title">
            <text class="iconfont">🏷️</text>
            <text>活动标签</text>
          </view>
          <view class="section-content tags-container">
            <view 
              v-for="tag in activity.tags" 
              :key="tag"
              class="tag-item"
            >
              {{ tag }}
            </view>
          </view>
        </view>
      </view>


      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="detail-footer">
      <view class="footer-info">
        <text class="footer-text">已报名 {{ activity.participants || 0 }}/{{ activity.capacity || 0 }}人</text>
      </view>
      <view class="footer-action">
        <view 
          v-if="activity.status === 'upcoming'"
          class="join-btn"
          :class="{ 'joined': joinStatus === 'joined' }"
          @click="handleJoin"
        >
          {{ joinStatus === 'joined' ? '取消报名' : '立即报名' }}
        </view>
        <view 
          v-else-if="activity.status === 'ongoing'"
          class="join-btn ongoing"
        >
          进行中
        </view>
        <view 
          v-else
          class="join-btn ended"
        >
          已结束
        </view>
      </view>
    </view>

    <!-- 报名弹窗 -->
    <view v-if="showJoinModal" class="modal-overlay" @click="showJoinModal = false">
      <view class="modal-content join-modal" @click.stop>
        <view class="modal-header">
          <text>报名信息</text>
          <text class="modal-close" @click="showJoinModal = false">×</text>
        </view>
        <scroll-view class="modal-body" scroll-y>
          <view class="form-item">
            <view class="item-label">姓名</view>
            <input 
              class="item-input" 
              v-model="joinForm.name"
              placeholder="请输入真实姓名"
            />
          </view>
          <view class="form-item">
            <view class="item-label">学号</view>
            <input 
              class="item-input" 
              v-model="joinForm.studentId"
              placeholder="请输入学号"
            />
          </view>
          <view class="form-item">
            <view class="item-label">手机号</view>
            <input 
              class="item-input" 
              v-model="joinForm.phone"
              placeholder="请输入手机号"
              type="number"
            />
          </view>
          <view class="form-item">
            <view class="item-label">备注</view>
            <textarea 
              class="item-textarea" 
              v-model="joinForm.remark"
              placeholder="请输入备注信息（选填）"
            />
          </view>
        </scroll-view>
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="showJoinModal = false">取消</view>
          <view class="footer-btn confirm" @click="confirmJoin">确认报名</view>
        </view>
      </view>
    </view>

    <!-- 更多菜单 -->
    <view v-if="showMoreMenu" class="modal-overlay" @click="showMoreMenu = false">
      <view class="more-menu" @click.stop>
        <view class="menu-item" @click="handleReport">
          <text class="iconfont">⚠️</text>
          <text>举报活动</text>
        </view>
        <view v-if="isOrganizer" class="menu-item" @click="handleEdit">
          <text class="iconfont">✏️</text>
          <text>编辑活动</text>
        </view>
        <view v-if="isOrganizer" class="menu-item" @click="handleCancel">
          <text class="iconfont">❌</text>
          <text>取消活动</text>
        </view>
        <view class="menu-item cancel" @click="showMoreMenu = false">
          取消
        </view>
      </view>
    </view>

    <!-- 分享面板 -->
    <view v-if="showSharePanel" class="modal-overlay" @click="showSharePanel = false">
      <view class="share-panel" @click.stop>
        <view class="share-title">分享到</view>
        <view class="share-options">
          <view class="share-option" @click="shareToWechat">
            <view class="option-icon wechat">
              <text class="iconfont">💬</text>
            </view>
            <text class="option-text">微信好友</text>
          </view>
          <view class="share-option" @click="shareToMoment">
            <view class="option-icon moment">
              <text class="iconfont">📱</text>
            </view>
            <text class="option-text">朋友圈</text>
          </view>
          <view class="share-option" @click="shareToQQ">
            <view class="option-icon qq">
              <text class="iconfont">💬</text>
            </view>
            <text class="option-text">QQ好友</text>
          </view>
          <view class="share-option" @click="copyLink">
            <view class="option-icon link">
              <text class="iconfont">🔗</text>
            </view>
            <text class="option-text">复制链接</text>
          </view>
        </view>
        <view class="share-cancel" @click="showSharePanel = false">取消</view>
      </view>
    </view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式数据
const activity = ref({})
const joinStatus = ref('')
const isFavorite = ref(false)
const isFollowing = ref(false)
const scrollTop = ref(0)
const showJoinModal = ref(false)
const showMoreMenu = ref(false)
const showSharePanel = ref(false)
const showMap = ref(false)
const activityId = ref('')

// 报名表单
const joinForm = ref({
  name: '',
  studentId: '',
  phone: '',
  remark: ''
})

// 地图数据
const mapLocation = ref({
  latitude: 30.263,
  longitude: 120.105
})

const mapMarkers = ref([{
  id: 1,
  latitude: 30.263,
  longitude: 120.105,
  title: '活动地点',
  iconPath: '/static/icons/marker.png',
  width: 30,
  height: 30
}])

// 模拟活动数据
const mockActivity = {
  id: 1,
  title: '校园音乐节 - 青春不散场',
  cover: '/static/images/activity1.jpg',
  images: [
    '/static/images/activity1-1.jpg',
    '/static/images/activity1-2.jpg',
    '/static/images/activity1-3.jpg'
  ],
  category: 'culture',
  status: 'upcoming',
  isFree: true,
  isHot: true,
  price: 0,
  originalPrice: 50,
  startTime: '2024-12-25 19:00:00',
  endTime: '2024-12-25 22:00:00',
  location: '学校大礼堂',
  address: '大礼堂一层主会场',
  viewCount: 1234,
  likeCount: 567,
  participants: 150,
  capacity: 200,
  organizerName: '校学生会',
  organizerAvatar: '/static/avatars/org1.jpg',
  organizerVerified: true,
  organizerScore: 4.8,
  content: '# 活动详情\n\n## 活动介绍\n\n校园音乐节是由校学生会主办的年度文艺盛事，旨在丰富校园文化生活，展现学生艺术才华。\n\n## 活动流程\n\n1. 19:00-19:30 开幕式表演\n2. 19:30-20:30 乐队演出\n3. 20:30-21:30 互动环节\n4. 21:30-22:00 颁奖典礼\n\n## 注意事项\n\n- 请提前30分钟入场\n- 凭票入场，一票一人\n- 禁止携带食品饮料入场',
  requirements: ['本校学生', '凭学生证入场', '着装得体'],
  contact: {
    name: '张老师',
    phone: '13800138000',
    wechat: 'zhanglaoshi'
  },
  tags: ['音乐', '演出', '校园文化', '免费']
}

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    name: '张三',
    avatar: '/static/logo.png',
    content: '很期待这次音乐节，去年就参加过，现场气氛超棒！',
    time: '2024-12-20 10:30:00',
    likes: 12,
    isLiked: false
  },
  {
    id: 2,
    name: '李四',
    avatar: '/static/logo.png',
    content: '有没有一起去的同学？可以结伴前往~',
    time: '2024-12-20 11:45:00',
    likes: 8,
    isLiked: false
  },
  {
    id: 3,
    name: '王五',
    avatar: '/static/logo.png',
    content: '已经报名了，期待见到喜欢的乐队！',
    time: '2024-12-20 14:20:00',
    likes: 5,
    isLiked: false
  }
]

// 计算属性
const isOrganizer = computed(() => {
  // 判断当前用户是否是活动组织者
  return false
})

// 工具函数
const formatDateTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatCommentTime = (timeStr) => {
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

const parseContent = (content) => {
  if (!content) return ''
  
  // 简单的Markdown解析，注意XSS安全
  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/# (.*?)\n/g, '<h1>$1</h1>')
    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
  
  // 恢复已转义的HTML标签中的内容（仅用于格式化标签）
  html = html
    .replace(/&lt;h1&gt;(.*?)&lt;\/h1&gt;/g, '<h1>$1</h1>')
    .replace(/&lt;h2&gt;(.*?)&lt;\/h2&gt;/g, '<h2>$1</h2>')
    .replace(/&lt;h3&gt;(.*?)&lt;\/h3&gt;/g, '<h3>$1</h3>')
    .replace(/&lt;strong&gt;(.*?)&lt;\/strong&gt;/g, '<strong>$1</strong>')
    .replace(/&lt;em&gt;(.*?)&lt;\/em&gt;/g, '<em>$1</em>')
    .replace(/&lt;br\/&gt;/g, '<br/>')
  
  return html
}

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const handleScroll = (e) => {
  scrollTop.value = e.detail.scrollTop
}

const previewImages = (index) => {
  if (activity.value.images && activity.value.images.length > 0) {
    uni.previewImage({
      current: index,
      urls: activity.value.images,
      fail: (err) => {
        console.error('预览图片失败:', err)
      }
    })
  } else if (activity.value.cover) {
    uni.previewImage({
      current: activity.value.cover,
      urls: [activity.value.cover],
      fail: (err) => {
        console.error('预览图片失败:', err)
      }
    })
  }
}

const goToOrganizer = () => {
  uni.navigateTo({
    url: `/pages/user/profile?id=${activity.value.organizerId}`
  })
}

const toggleFollow = async () => {
  try {
    const oldStatus = isFollowing.value
    isFollowing.value = !isFollowing.value
    
    // 这里应该调用真实的API
    // await store.dispatch('user/followOrganizer', activity.value.organizerId)
    
    uni.showToast({
      title: isFollowing.value ? '关注成功' : '已取消关注',
      icon: 'success'
    })
  } catch (error) {
    // 失败时回滚状态
    isFollowing.value = !isFollowing.value
    console.error('关注操作失败:', error)
    uni.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    })
  }
}

const toggleFavorite = async () => {
  try {
    const oldStatus = isFavorite.value
    isFavorite.value = !isFavorite.value
    
    // 这里应该调用真实的API
    // if (isFavorite.value) {
    //   await store.dispatch('activity/favoriteActivity', activityId.value)
    // } else {
    //   await store.dispatch('activity/unfavoriteActivity', activityId.value)
    // }
    
    uni.showToast({
      title: isFavorite.value ? '收藏成功' : '已取消收藏',
      icon: 'success'
    })
  } catch (error) {
    // 失败时回滚状态
    isFavorite.value = !isFavorite.value
    console.error('收藏操作失败:', error)
    uni.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    })
  }
}

const scrollToComment = () => {
  // 计算评论区域的scrollTop值
  const query = uni.createSelectorQuery()
  query.select('#commentSection').boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec((res) => {
    if (res[0]) {
      const top = res[0].top + (res[1]?.scrollTop || 0)
      scrollTop.value = top - 90 // 减去导航栏高度
    }
  })
  
  // 如果pageScrollTo可用（H5），使用它
  // #ifdef H5
  uni.pageScrollTo({
    scrollTop: 1000,
    duration: 300
  })
  // #endif
}

const focusCommentInput = () => {
  commentInputFocused.value = true
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}

const publishComment = () => {
  if (!commentContent.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    })
    return
  }
  
  const newComment = {
    id: Date.now(),
    name: '我',
    avatar: '/static/logo.png',
    content: commentContent.value,
    time: new Date().toISOString(),
    likes: 0,
    isLiked: false
  }
  
  commentList.value.unshift(newComment)
  commentContent.value = ''
  
  uni.showToast({
    title: '评论成功',
    icon: 'success'
  })
  
  // 滚动到底部
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}

const scrollToBottom = () => {
  uni.pageScrollTo({
    scrollTop: 9999,
    duration: 300
  })
}

const handleJoin = async () => {
  if (joinStatus.value === 'joined') {
    uni.showModal({
      title: '取消报名',
      content: '确定要取消报名吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            uni.showLoading({ title: '取消中...' })
            
            // 这里应该调用真实的API
            // await store.dispatch('activity/cancelJoin', activityId.value)
            
            // 模拟API请求
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            joinStatus.value = ''
            activity.value.participants = Math.max((activity.value.participants || 0) - 1, 0)
            
            uni.hideLoading()
            uni.showToast({
              title: '已取消报名',
              icon: 'success'
            })
          } catch (error) {
            uni.hideLoading()
            console.error('取消报名失败:', error)
            uni.showToast({
              title: error.message || '取消失败',
              icon: 'none'
            })
          }
        }
      }
    })
  } else {
    // 检查活动状态
    if (activity.value.status !== 'upcoming') {
      uni.showToast({
        title: '活动已开始或已结束，无法报名',
        icon: 'none'
      })
      return
    }
    
    // 检查人数是否已满
    if (activity.value.capacity && activity.value.participants >= activity.value.capacity) {
      uni.showToast({
        title: '活动人数已满',
        icon: 'none'
      })
      return
    }
    
    showJoinModal.value = true
  }
}

const confirmJoin = async () => {
  if (!joinForm.value.name || !joinForm.value.name.trim()) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!joinForm.value.studentId || !joinForm.value.studentId.trim()) {
    uni.showToast({ title: '请输入学号', icon: 'none' })
    return
  }
  if (!joinForm.value.phone || !joinForm.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  
  // 手机号格式验证
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(joinForm.value.phone.trim())) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '报名中...' })
    
    // 这里应该调用真实的API
    // await store.dispatch('activity/joinActivity', {
    //   id: activityId.value,
    //   ...joinForm.value
    // })
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    joinStatus.value = 'joined'
    activity.value.participants = (activity.value.participants || 0) + 1
    showJoinModal.value = false
    
    // 重置表单
    joinForm.value = {
      name: '',
      studentId: '',
      phone: '',
      remark: ''
    }
    
    uni.hideLoading()
    uni.showToast({
      title: '报名成功',
      icon: 'success'
    })
  } catch (error) {
    uni.hideLoading()
    console.error('报名失败:', error)
    uni.showToast({
      title: error.message || '报名失败，请重试',
      icon: 'none'
    })
  }
}

const handleShare = () => {
  showSharePanel.value = true
}

const shareToWechat = () => {
  // #ifdef MP-WEIXIN
  uni.shareAppMessage({
    title: activity.value.title,
    path: `/pages/tabbar/activity/subpages/detail/index?id=${activityId.value}`,
    imageUrl: activity.value.cover || activity.value.images?.[0]
  })
  // #endif
  
  // #ifdef APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: activity.value.title,
    summary: activity.value.description || activity.value.title,
    imageUrl: activity.value.cover || activity.value.images?.[0],
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
      showSharePanel.value = false
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
}

const shareToMoment = () => {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '小程序暂不支持分享到朋友圈', icon: 'none' })
  // #endif
  
  // #ifdef APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneTimeline',
    type: 0,
    title: activity.value.title,
    imageUrl: activity.value.cover || activity.value.images?.[0],
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
      showSharePanel.value = false
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
}

const shareToQQ = () => {
  // #ifdef MP-WEIXIN || H5
  uni.showToast({ title: '当前平台不支持QQ分享', icon: 'none' })
  // #endif
  
  // #ifdef APP-PLUS
  uni.share({
    provider: 'qq',
    scene: 'WXSenceTimeline',
    type: 0,
    title: activity.value.title,
    summary: activity.value.description || activity.value.title,
    imageUrl: activity.value.cover || activity.value.images?.[0],
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
      showSharePanel.value = false
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
}

const copyLink = () => {
  // 构建活动链接
  let link = ''
  // #ifdef H5
  link = `${window.location.origin}/#/pages/tabbar/activity/subpages/detail/index?id=${activityId.value}`
  // #endif
  // #ifndef H5
  // 小程序和App中使用分享参数或固定域名
  const baseUrl = 'https://example.com' // 替换为实际的域名
  link = `${baseUrl}/pages/tabbar/activity/subpages/detail/index?id=${activityId.value}`
  // #endif
  
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
      showSharePanel.value = false
    },
    fail: (err) => {
      console.error('复制失败:', err)
      uni.showToast({ title: '复制失败', icon: 'none' })
    }
  })
}

const makePhoneCall = () => {
  if (activity.value.contact && activity.value.contact.phone) {
    uni.makePhoneCall({
      phoneNumber: activity.value.contact.phone
    })
  }
}

const copyWechat = () => {
  if (activity.value.contact && activity.value.contact.wechat) {
    uni.setClipboardData({
      data: activity.value.contact.wechat,
      success: () => {
        uni.showToast({ title: '微信号已复制', icon: 'success' })
      }
    })
  }
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    activity.value.likeCount = (activity.value.likeCount || 0) + 1
    uni.showToast({
      title: '点赞成功',
      icon: 'success',
      duration: 1000
    })
  } else {
    activity.value.likeCount = Math.max((activity.value.likeCount || 0) - 1, 0)
  }
}

const handleReport = () => {
  uni.navigateTo({
    url: `/pages/common/report?type=activity&id=${activityId.value}`
  })
  showMoreMenu.value = false
}

const handleEdit = () => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/create/index?id=${activityId.value}&mode=edit`
  })
  showMoreMenu.value = false
}

const handleCancel = async () => {
  uni.showModal({
    title: '取消活动',
    content: '确定要取消这个活动吗？此操作不可撤销。',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '取消中...' })
          
          // 这里应该调用真实的API
          // await store.dispatch('activity/cancelActivity', activityId.value)
          
          // 模拟API请求
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          activity.value.status = 'cancelled'
          showMoreMenu.value = false
          
          uni.hideLoading()
          uni.showToast({ title: '活动已取消', icon: 'success' })
        } catch (error) {
          uni.hideLoading()
          console.error('取消活动失败:', error)
          uni.showToast({
            title: error.message || '取消失败，请重试',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    activityId.value = options.id
    loadActivityDetail(options.id)
  } else {
    uni.showToast({
      title: '活动ID不存在',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  }
  
  // 检查是否支持地图组件
  // #ifdef MP-WEIXIN || APP-PLUS
  showMap.value = uni.canIUse('createMapContext')
  // #endif
  // #ifndef MP-WEIXIN || APP-PLUS
  showMap.value = false
  // #endif
})

onShow(() => {
  // 检查报名状态
  checkJoinStatus()
  // 检查收藏状态
  checkFavoriteStatus()
})

// API调用
const loadActivityDetail = async (id) => {
  try {
    uni.showLoading({ title: '加载中...' })
    
    // 这里应该调用真实的API
    // const res = await store.dispatch('activity/fetchActivityDetail', id)
    // activity.value = res
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    activity.value = { ...mockActivity, id }
    
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    console.error('加载活动详情失败:', error)
    uni.showToast({
      title: error.message || '加载失败，请重试',
      icon: 'none'
    })
    // 加载失败时返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  }
}

const checkJoinStatus = async () => {
  try {
    // 这里应该调用真实的API检查报名状态
    // const res = await store.dispatch('activity/checkJoinStatus', activityId.value)
    // joinStatus.value = res.status
    
    // 模拟检查
    joinStatus.value = ''
  } catch (error) {
    console.error('检查报名状态失败:', error)
  }
}

const checkFavoriteStatus = async () => {
  try {
    // 这里应该调用真实的API检查收藏状态
    // const res = await store.dispatch('activity/checkFavoriteStatus', activityId.value)
    // isFavorite.value = res.isFavorite
    
    // 模拟检查
    isFavorite.value = false
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.activity-detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.detail-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  .navbar-left,
  .navbar-right {
    width: 120rpx;
  }
  
  .navbar-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .nav-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
  }
}

.detail-scroll {
  flex: 1;
  height: 0;
  padding-top: 90rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.detail-header {
  position: relative;
  
  .detail-swiper {
    height: 500rpx;
    
    .swiper-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .single-cover {
    height: 500rpx;
    
    .cover-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .header-status {
    position: absolute;
    top: 30rpx;
    left: 30rpx;
    display: flex;
    gap: 20rpx;
    
    .status-tag {
      padding: 8rpx 20rpx;
      background: rgba(0, 122, 255, 0.9);
      color: #fff;
      border-radius: 20rpx;
      font-size: 24rpx;
      
      &.ongoing {
        background: rgba(76, 217, 100, 0.9);
      }
      
      &.ended {
        background: rgba(153, 153, 153, 0.9);
      }
      
      &.cancelled {
        background: rgba(255, 59, 48, 0.9);
      }
    }
    
    .free-tag {
      padding: 8rpx 20rpx;
      background: rgba(76, 217, 100, 0.9);
      color: #fff;
      border-radius: 20rpx;
      font-size: 24rpx;
    }
    
    .hot-tag {
      padding: 8rpx 20rpx;
      background: rgba(255, 149, 0, 0.9);
      color: #fff;
      border-radius: 20rpx;
      font-size: 24rpx;
    }
  }
}

.basic-info {
  padding: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
  
  .info-title {
    font-size: 44rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    line-height: 1.5;
  }
  
  .key-info-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    
    .key-info-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      font-size: 28rpx;
      
      .key-icon {
        font-size: 32rpx;
        width: 40rpx;
        text-align: center;
      }
      
      .key-label {
        color: #666;
        min-width: 140rpx;
      }
      
      .key-value {
        color: #333;
        flex: 1;
      }
      
      .status-badge {
        padding: 6rpx 20rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        color: #fff;
        background: #007AFF;
        
        &.ongoing {
          background: #4cd964;
        }
        
        &.ended {
          background: #999;
        }
        
        &.cancelled {
          background: #ff3b30;
        }
      }
    }
  }
}

.detail-card {
  margin: 0 30rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.detail-section {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .section-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    
    .time-item,
    .location-item,
    .address-item {
      margin-bottom: 10rpx;
    }
    
    .time-label,
    .location-label,
    .address-label {
      color: #999;
    }
  }
  
  .map-container {
    margin-top: 20rpx;
    border-radius: 8rpx;
    overflow: hidden;
  }
  
  .requirements-list {
    .requirement-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10rpx;
      
      .req-icon {
        color: #007AFF;
        margin-right: 10rpx;
      }
    }
  }
  
  .contact-info {
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      
      .contact-label {
        color: #999;
        width: 120rpx;
      }
      
      .phone,
      .wechat {
        color: #007AFF;
        
        .copy-tip {
          font-size: 24rpx;
          color: #999;
          margin-left: 10rpx;
        }
      }
    }
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .tag-item {
      padding: 8rpx 20rpx;
      background: #f5f5f5;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #666;
    }
  }
}


.safe-area {
  height: 120rpx;
}

.detail-footer {
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
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 100;
  
  .footer-info {
    flex: 1;
    
    .footer-text {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .footer-action {
    .join-btn {
      padding: 20rpx 50rpx;
      border-radius: 50rpx;
      font-size: 30rpx;
      color: #fff;
      background: linear-gradient(135deg, #FF9500 0%, #FF6B35 100%);
      transition: all 0.3s;
      
      &.joined {
        background: #f5f5f5;
        color: #666;
      }
      
      &.ongoing {
        background: #4cd964;
      }
      
      &.ended {
        background: #cccccc;
      }
      
      &:active {
        transform: scale(0.95);
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
}

.join-modal {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
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

.more-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  
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

.share-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  
  .share-title {
    text-align: center;
    padding: 40rpx 0 20rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .share-options {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0 40rpx;
    
    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20rpx;
      
      .option-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50rpx;
        
        &.wechat {
          background: #07C160;
          color: #fff;
        }
        
        &.moment {
          background: #7BBA3A;
          color: #fff;
        }
        
        &.qq {
          background: #12B7F5;
          color: #fff;
        }
        
        &.link {
          background: #007AFF;
          color: #fff;
        }
      }
      
      .option-text {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
  
  .share-cancel {
    padding: 30rpx;
    text-align: center;
    font-size: 28rpx;
    color: #007AFF;
    border-top: 1rpx solid #f0f0f0;
  }
}

.form-item {
  margin-bottom: 30rpx;
  
  .item-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .item-input,
  .item-textarea {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
    background: #fafafa;
  }
  
  .item-textarea {
    height: 150rpx;
  }
}
</style>
</style>
</style>
</style>
</style>