<!--
 * 文件路径: pages/tabbar/index/news-detail/index.vue
 * 功能说明: 首页新闻详情页面
 * 主要功能:
 *   1. 显示新闻详细内容
 *   2. 点赞、收藏、分享功能
 *   3. 评论功能
 * 数据来源: API接口或本地存储
 * 相关页面: pages/tabbar/index/index.vue (首页)
 -->
<template>
  <view class="news-detail-page">
    <!-- 页面头部 -->
    <view class="news-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
        <view class="header-title">新闻详情</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="handleShare">
          <text class="iconfont">↗️</text>
        </view>
        <view class="header-icon" @click="showMoreOptions">
          <text class="iconfont">⋯</text>
        </view>
      </view>
    </view>

    <!-- 新闻内容 -->
    <scroll-view class="news-scroll" scroll-y>
      <!-- 新闻标题 -->
      <view class="news-title-section">
        <view class="news-title">{{ newsData.title }}</view>
        <view class="news-summary">{{ newsData.summary }}</view>
      </view>

      <!-- 新闻元信息 -->
      <view class="news-meta">
        <view class="meta-left">
          <view class="meta-item">
            <text class="iconfont">👤</text>
            <text>{{ newsData.author }}</text>
          </view>
          <view class="meta-item">
            <text class="iconfont">📅</text>
            <text>{{ formatTime(newsData.publishTime) }}</text>
          </view>
          <view class="meta-item">
            <text class="iconfont">👁️</text>
            <text>{{ newsData.viewCount }}</text>
          </view>
        </view>
        <view class="meta-right">
          <view class="source-tag">{{ newsData.source }}</view>
        </view>
      </view>

      <!-- 新闻封面 -->
      <view v-if="newsData.cover" class="news-cover">
        <image class="cover-image" :src="newsData.cover" mode="widthFix" />
        <view v-if="newsData.coverDesc" class="cover-desc">{{ newsData.coverDesc }}</view>
      </view>

      <!-- 新闻正文 -->
      <view class="news-content" v-html="newsData.content"></view>

      <!-- 新闻标签 -->
      <view v-if="newsData.tags && newsData.tags.length > 0" class="news-tags">
        <view 
          v-for="tag in newsData.tags" 
          :key="tag"
          class="tag-item"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </view>
      </view>

      <!-- 相关新闻 -->
      <view v-if="relatedNews.length > 0" class="related-news">
        <view class="section-title">相关新闻</view>
        <view class="related-list">
          <view 
            v-for="news in relatedNews" 
            :key="news.id"
            class="related-item"
            @click="handleRelatedNewsClick(news.id)"
          >
            <view class="related-title">{{ news.title }}</view>
            <view class="related-meta">
              <text>{{ news.source }}</text>
              <text>·</text>
              <text>{{ formatTime(news.publishTime) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="bottom-actions">
        <view class="action-buttons">
          <view 
            class="action-btn"
            :class="{ active: liked }"
            @click="handleLike"
          >
            <text v-if="liked" class="iconfont">❤️</text>
            <text v-else class="iconfont">🤍</text>
            <text class="btn-text">{{ liked ? '已赞' : '点赞' }}</text>
          </view>
          <view 
            class="action-btn"
            :class="{ active: collected }"
            @click="handleCollect"
          >
            <text v-if="collected" class="iconfont">⭐</text>
            <text v-else class="iconfont">☆</text>
            <text class="btn-text">{{ collected ? '已收藏' : '收藏' }}</text>
          </view>
          <view class="action-btn" @click="handleComment">
            <text class="iconfont">💬</text>
            <text class="btn-text">评论</text>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 分享面板 -->
    <view v-if="showSharePanel" class="share-overlay" @click="hideSharePanel">
      <view class="share-panel" @click.stop>
        <view class="share-header">分享到</view>
        <view class="share-options">
          <view class="share-option" @click="shareToWechat">
            <view class="option-icon wechat">
              <text class="iconfont">💬</text>
            </view>
            <view class="option-text">微信</view>
          </view>
          <view class="share-option" @click="shareToMoments">
            <view class="option-icon moments">
              <text class="iconfont">👥</text>
            </view>
            <view class="option-text">朋友圈</view>
          </view>
          <view class="share-option" @click="copyLink">
            <view class="option-icon link">
              <text class="iconfont">🔗</text>
            </view>
            <view class="option-text">复制链接</view>
          </view>
        </view>
        <view class="share-cancel" @click="hideSharePanel">取消</view>
      </view>
    </view>

    <!-- 更多选项菜单 -->
    <view v-if="showMoreMenu" class="menu-overlay" @click="hideMoreMenu">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="handleFontSize">
          <text class="iconfont">🔤</text>
          <text>调整字体</text>
        </view>
        <view class="menu-item" @click="handleReport">
          <text class="iconfont">🚫</text>
          <text>举报</text>
        </view>
        <view class="menu-item" @click="handleSaveImage">
          <text class="iconfont">💾</text>
          <text>保存图片</text>
        </view>
        <view class="menu-item cancel" @click="hideMoreMenu">取消</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式数据
const showSharePanel = ref(false)
const showMoreMenu = ref(false)
const liked = ref(false)
const collected = ref(false)

// 新闻数据
const newsData = ref({
  id: 1,
  title: '人工智能实验室获国家级重点项目支持',
  summary: '我校计算机学院人工智能实验室获得国家自然科学基金重点项目立项',
  author: '新闻中心',
  publishTime: '2024-12-20 10:30:00',
  viewCount: 1234,
  source: '校园新闻',
  cover: '/static/images/news1.jpg',
  coverDesc: '人工智能实验室研究人员正在进行实验',
  content: '<p>近日，我校计算机学院人工智能实验室申报的"面向复杂场景的多模态智能感知与决策"项目获得国家自然科学基金重点项目立项，资助金额达500万元。</p><p>该项目由我校特聘教授、人工智能实验室主任张伟教授牵头，联合清华大学、中科院自动化所等多家单位共同申报。项目将围绕复杂场景下的多模态信息感知、智能决策与自主控制等前沿科学问题展开研究。</p><p>张伟教授表示，该项目将面向智慧城市、智能交通、无人系统等国家重大需求，研究多模态信息融合、跨模态知识迁移、智能决策与自主控制等关键技术，为我国人工智能技术的发展贡献力量。</p><p>据悉，我校人工智能实验室近年来在计算机视觉、自然语言处理、强化学习等领域取得了系列重要成果，发表顶级期刊/会议论文100余篇，授权发明专利30余项，成果在多个行业得到应用。</p>',
  tags: ['人工智能', '科学研究', '重点项目']
})

// 相关新闻
const relatedNews = ref([
  { id: 2, title: '校园科技节盛大开幕', source: '科技协会', publishTime: '2024-12-19 14:20:00' },
  { id: 3, title: '计算机学院学子在ACM竞赛中再创佳绩', source: '计算机学院', publishTime: '2024-12-18 16:30:00' },
  { id: 4, title: '深度学习前沿讲座圆满结束', source: '学术交流处', publishTime: '2024-12-17 19:00:00' }
])

// 工具函数
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

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const handleShare = () => {
  showSharePanel.value = true
}

const hideSharePanel = () => {
  showSharePanel.value = false
}

const shareToWechat = () => {
  // #ifdef MP-WEIXIN || APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: newsData.value.title,
    summary: newsData.value.summary,
    success: () => {
      uni.showToast({ title: '已分享到微信', icon: 'success' })
      hideSharePanel()
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
  
  // #ifndef MP-WEIXIN || APP-PLUS || H5
  uni.showToast({ title: '当前平台不支持分享', icon: 'none' })
  // #endif
}

const shareToMoments = () => {
  // #ifdef MP-WEIXIN || APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneTimeline',
    type: 0,
    title: newsData.value.title,
    summary: newsData.value.summary,
    success: () => {
      uni.showToast({ title: '已分享到朋友圈', icon: 'success' })
      hideSharePanel()
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
  
  // #ifndef MP-WEIXIN || APP-PLUS || H5
  uni.showToast({ title: '当前平台不支持分享', icon: 'none' })
  // #endif
}

const copyLink = () => {
  uni.setClipboardData({
    data: `https://campus.example.com/news/${newsData.value.id}`,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
      hideSharePanel()
    }
  })
}

const showMoreOptions = () => {
  showMoreMenu.value = true
}

const hideMoreMenu = () => {
  showMoreMenu.value = false
}

const handleLike = () => {
  liked.value = !liked.value
  // 注意：点赞不应该影响浏览次数
  uni.showToast({ 
    title: liked.value ? '点赞成功' : '已取消点赞',
    icon: liked.value ? 'success' : 'none'
  })
}

const handleCollect = () => {
  collected.value = !collected.value
  uni.showToast({ 
    title: collected.value ? '已收藏' : '已取消收藏',
    icon: collected.value ? 'success' : 'none'
  })
}

const handleComment = () => {
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/comment/index?id=${newsData.value.id}`
  })
}

const handleTagClick = (tag) => {
  uni.navigateTo({
    url: `/pages/tabbar/news/list?tag=${tag}`
  })
}

const handleRelatedNewsClick = (id) => {
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/news-detail/index?id=${id}`
  })
}

const handleFontSize = () => {
  uni.showToast({ title: '字体调整功能开发中', icon: 'none' })
  hideMoreMenu()
}

const handleReport = () => {
  uni.showModal({
    title: '举报内容',
    content: '请选择举报原因',
    confirmText: '确认举报',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '举报已提交', icon: 'success' })
        hideMoreMenu()
      }
    }
  })
}

const handleSaveImage = () => {
  uni.showToast({ title: '图片保存功能开发中', icon: 'none' })
  hideMoreMenu()
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    loadNewsData(options.id)
  }
})

onShow(() => {
  // 更新浏览计数
  if (newsData.value.id) {
    updateViewCount(newsData.value.id)
  }
})

// 数据加载
const loadNewsData = (id) => {
  // 这里应该调用API获取新闻数据
  // 模拟数据加载
  uni.showLoading({ title: '加载中' })
  setTimeout(() => {
    uni.hideLoading()
  }, 500)
}

const updateViewCount = (id) => {
  // 更新浏览计数（避免重复计数）
  if (!uni.getStorageSync(`news_viewed_${id}`)) {
    newsData.value.viewCount++
    uni.setStorageSync(`news_viewed_${id}`, true)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins/function.scss';
.news-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

.news-header {
  @include page-header;
  position: sticky;
  top: 0;
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

.news-scroll {
  flex: 1;
  height: 0;
  padding: 0 30rpx 120rpx;
}

.news-title-section {
  padding: 30rpx 0;
  border-bottom: 1rpx solid $gray-2;
  
  .news-title {
    font-size: $font-size-2xl;
    font-weight: bold;
    color: $gray-8;
    line-height: 1.4;
    margin-bottom: 20rpx;
  }
  
  .news-summary {
    font-size: $font-size-base;
    color: $gray-6;
    line-height: 1.6;
  }
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $gray-2;
  
  .meta-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: $font-size-sm;
      color: $gray-5;
    }
  }
  
  .meta-right {
    .source-tag {
      padding: 8rpx 20rpx;
      background: $gray-1;
      border-radius: 20rpx;
      font-size: $font-size-xs;
      color: $gray-6;
    }
  }
}

.news-cover {
  margin: 30rpx 0;
  border-radius: 12rpx;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    display: block;
  }
  
  .cover-desc {
    padding: 20rpx;
    background: $gray-1;
    font-size: $font-size-xs;
    color: $gray-6;
    line-height: 1.4;
  }
}

.news-content {
  font-size: $font-size-base;
  color: $gray-8;
  line-height: 1.8;
  margin: 30rpx 0;
  
  ::v-deep p {
    margin-bottom: 20rpx;
  }
  
  ::v-deep h3 {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $gray-8;
    margin: 40rpx 0 20rpx;
  }
  
  ::v-deep ul, ::v-deep ol {
    padding-left: 40rpx;
    margin-bottom: 20rpx;
  }
  
  ::v-deep li {
    margin-bottom: 10rpx;
  }
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin: 30rpx 0;
  padding: 30rpx 0;
  border-top: 1rpx solid $gray-2;
  border-bottom: 1rpx solid $gray-2;
  
  .tag-item {
    padding: 12rpx 24rpx;
    background: $gray-1;
    border-radius: 20rpx;
    font-size: $font-size-sm;
    color: $gray-6;
    
    &:active {
      background: $gray-2;
    }
  }
}

.related-news {
  margin: 30rpx 0;
  padding: 30rpx 0;
  border-top: 1rpx solid $gray-2;
  
  .section-title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $gray-8;
    margin-bottom: 20rpx;
  }
  
  .related-list {
    .related-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid $gray-2;
      
      &:last-child {
        border-bottom: none;
      }
      
      .related-title {
        font-size: $font-size-base;
        color: $gray-8;
        font-weight: 500;
        margin-bottom: 8rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .related-meta {
        font-size: $font-size-xs;
        color: $gray-5;
        display: flex;
        align-items: center;
        gap: 8rpx;
      }
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $white;
  border-top: 1rpx solid $gray-2;
  padding: 20rpx 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
  
  .action-buttons {
    display: flex;
    justify-content: space-around;
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      font-size: $font-size-sm;
      color: $gray-6;
      
      &.active {
        color: $primary-color;
      }
      
      .btn-text {
        font-size: $font-size-xs;
      }
    }
  }
}

.safe-area {
  height: 120rpx;
}

.share-overlay {
  @include menu-overlay;
  
  .share-panel {
    width: 100%;
    background: $white;
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    
    .share-header {
      text-align: center;
      padding: 40rpx 0 20rpx;
      font-size: $font-size-base;
      color: $gray-8;
      font-weight: 500;
    }
    
    .share-options {
      display: flex;
      justify-content: space-around;
      padding: 40rpx 30rpx;
      
      .share-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12rpx;
        
        .option-icon {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48rpx;
          color: $white;
          
          &.wechat {
            background: #07c160;
          }
          
          &.moments {
            background: #7cbb52;
          }
          
          &.link {
            background: $primary-color;
          }
        }
        
        .option-text {
          font-size: $font-size-sm;
          color: $gray-8;
        }
      }
    }
    
    .share-cancel {
      padding: 30rpx;
      text-align: center;
      font-size: $font-size-base;
      color: $gray-8;
      border-top: 1rpx solid $gray-2;
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
        color: $danger-color;
        border-top: 1rpx solid $gray-2;
      }
    }
  }
}
</style>