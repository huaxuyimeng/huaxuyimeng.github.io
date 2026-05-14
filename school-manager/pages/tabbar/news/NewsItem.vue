<template>
  <view 
    class="news-item" 
    :class="[viewMode, { 
      'pinned': news.pinned, 
      'hot': news.hot, 
      'new': news.new,
      'video': news.video
    }]"
    @click="$emit('click', news)"
  >
    <!-- 列表视图 -->
    <template v-if="viewMode === 'list'">
      <view class="item-header">
        <view v-if="news.tag" class="item-tag">{{ news.tag }}</view>
        <view v-if="getNewsStatusTag" class="item-badge" :class="getNewsStatusTagClass">
          <text class="badge-dot"></text>
          <text>{{ getNewsStatusTag }}</text>
        </view>
        <view v-if="news.enableJoin" class="join-badge">
          <uni-icons type="calendar" size="12" color="#007AFF"></uni-icons>
          <text>可报名</text>
          <view v-if="news.isJoined" class="joined-indicator">已报名</view>
        </view>
      </view>
      
      <view class="item-content">
        <view class="content-left">
          <view class="news-title">{{ news.title }}</view>
          <view class="news-summary">{{ news.summary }}</view>
          <view class="news-meta">
            <view class="meta-item">
              <uni-icons type="person" size="12" color="#999"></uni-icons>
              <text>{{ news.author }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="calendar" size="12" color="#999"></uni-icons>
              <text>{{ formatTime(news.publishTime) }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="eye" size="12" color="#999"></uni-icons>
              <text>{{ formatNumber(news.viewCount) }}</text>
            </view>
          </view>
        </view>
        <view v-if="news.cover" class="content-right">
          <image class="news-img" :src="news.cover" mode="aspectFill" />
          <view v-if="news.hot" class="hot-overlay">🔥</view>
          <view v-if="news.video" class="video-overlay">
            <uni-icons type="videocam" size="16" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
      
      <view class="item-footer">
        <view class="footer-left">
          <view class="source-tag">{{ news.source }}</view>
          <view v-if="news.category !== 'all'" class="category-tag">
            {{ getCategoryName(news.category) }}
          </view>
        </view>
        <view class="footer-right">
          <view 
            class="action-btn like"
            :class="{ liked: news.liked }"
            @click.stop="$emit('like', news.id)"
          >
            <uni-icons :type="news.liked ? 'heart-filled' : 'heart'" :size="16" :color="news.liked ? '#ff3b30' : '#999'"></uni-icons>
            <text>{{ formatNumber(news.likeCount) }}</text>
          </view>
          <view 
            v-if="viewMode === 'list'"
            class="action-btn comment"
            @click.stop="$emit('comment', news)"
          >
            <uni-icons type="chat" size="16" color="#999"></uni-icons>
            <text>{{ formatNumber(news.commentCount) }}</text>
          </view>
        </view>
      </view>
    </template>

    <!-- 卡片视图 -->
    <template v-else>
      <view class="card-header">
        <image class="card-img" :src="news.cover" mode="aspectFill" />
        <view v-if="getNewsStatusTag" class="card-badge" :class="getNewsStatusTagClass">
          {{ getNewsStatusTag }}
        </view>
        <view v-if="news.video" class="video-badge">
          <uni-icons type="videocam" size="12" color="#fff"></uni-icons>
        </view>
        <view v-if="news.tag" class="card-tag">{{ news.tag }}</view>
        <view v-if="news.enableJoin" class="card-join-badge">
          <uni-icons type="calendar" size="12" color="#fff"></uni-icons>
          <text>{{ news.isJoined ? '已报名' : '可报名' }}</text>
        </view>
      </view>
      
      <view class="card-body">
        <view class="card-title">{{ news.title }}</view>
        <view class="card-summary">{{ news.summary }}</view>
        
        <view class="card-meta">
          <view class="meta-item">
            <uni-icons type="calendar" size="12" color="#999"></uni-icons>
            <text>{{ formatTime(news.publishTime) }}</text>
          </view>
          <view class="meta-item">
            <uni-icons type="eye" size="12" color="#999"></uni-icons>
            <text>{{ formatNumber(news.viewCount) }}</text>
          </view>
        </view>
      </view>
      
      <view class="card-footer">
        <view class="footer-left">
          <view class="source-tag">{{ news.source }}</view>
        </view>
        <view class="footer-right">
          <view 
            class="action-btn like"
            :class="{ liked: news.liked }"
            @click.stop="$emit('like', news.id)"
          >
            <uni-icons :type="news.liked ? 'heart-filled' : 'heart'" :size="16" :color="news.liked ? '#ff3b30' : '#999'"></uni-icons>
            <text>{{ formatNumber(news.likeCount) }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { formatRelativeTime } from '@/utils/date'
import { formatNumber as formatNum } from '@/utils/number'

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'list' // 'list' or 'card'
  }
})

const emit = defineEmits(['click', 'like', 'comment'])

// 计算属性
const getNewsStatusTag = computed(() => {
  if (props.news.pinned) return '置顶'
  if (props.news.hot) return '热门'
  if (props.news.new) return '最新'
  return null
})

const getNewsStatusTagClass = computed(() => {
  if (props.news.pinned) return 'pinned'
  if (props.news.hot) return 'hot'
  if (props.news.new) return 'new'
  return ''
})

const getCategoryName = (category) => {
  const categoryMap = {
    'all': '全部',
    'notice': '通知公告',
    'campus': '校园要闻',
    'activity': '学生活动',
    'academic': '学术动态',
    'policy': '政策文件'
  }
  return categoryMap[category] || '资讯'
}

const formatTime = (timeStr) => {
  return formatRelativeTime(timeStr)
}

const formatNumber = (num) => {
  return formatNum(num)
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-item {
  &.list {
    .item-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12rpx;
      margin-bottom: 16rpx;

      .item-tag {
        padding: 4rpx 12rpx;
        background: $primary-color;
        color: #fff;
        border-radius: 12rpx;
        font-size: 20rpx;
      }

      .item-badge {
        display: flex;
        align-items: center;
        gap: 4rpx;
        padding: 4rpx 8rpx;
        border-radius: 12rpx;
        font-size: 20rpx;

        .badge-dot {
          width: 8rpx;
          height: 8rpx;
          border-radius: 50%;
        }

        &.pinned {
          background: rgba(0, 122, 255, 0.1);
          color: $primary-color;

          .badge-dot {
            background: $primary-color;
          }
        }

        &.hot {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;

          .badge-dot {
            background: #ff3b30;
          }
        }

        &.new {
          background: rgba(52, 199, 89, 0.1);
          color: #34c759;

          .badge-dot {
            background: #34c759;
          }
        }
      }

      .join-badge {
        display: flex;
        align-items: center;
        gap: 4rpx;
        padding: 4rpx 12rpx;
        background: rgba(0, 122, 255, 0.1);
        border-radius: 12rpx;
        font-size: 20rpx;
        color: $primary-color;

        .joined-indicator {
          margin-left: 8rpx;
          padding: 2rpx 6rpx;
          background: rgba(76, 217, 100, 0.2);
          color: #4cd964;
          border-radius: 8rpx;
          font-size: 18rpx;
        }
      }
    }

    .item-content {
      display: flex;
      gap: 20rpx;
      margin-bottom: 20rpx;

      .content-left {
        flex: 1;

        .news-title {
          font-size: 32rpx;
          font-weight: bold;
          color: $gray-8;
          line-height: 1.4;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          .night-mode & {
            color: #e0e0e0;
          }
        }

        .news-summary {
          font-size: 26rpx;
          color: $gray-6;
          line-height: 1.5;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          .night-mode & {
            color: #999;
          }
        }

        .news-meta {
          display: flex;
          align-items: center;
          gap: 20rpx;

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

      .content-right {
        position: relative;
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        overflow: hidden;

        .news-img {
          width: 100%;
          height: 100%;
        }

        .hot-overlay {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          font-size: 24rpx;
          animation: pulse 1.5s infinite;
        }

        .video-overlay {
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
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .footer-left {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .source-tag {
          padding: 4rpx 12rpx;
          background: $gray-1;
          color: $gray-6;
          border-radius: 12rpx;
          font-size: 20rpx;

          .night-mode & {
            background: #333;
            color: #999;
          }
        }

        .category-tag {
          padding: 4rpx 12rpx;
          background: $gray-0;
          color: $gray-6;
          border-radius: 12rpx;
          font-size: 20rpx;

          .night-mode & {
            background: #2a2a2a;
            color: #999;
          }
        }
      }

      .footer-right {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4rpx;
          padding: 8rpx;
          border-radius: 8rpx;
          transition: all 0.3s ease;

          &:active {
            background: $gray-1;

            .night-mode & {
              background: #333;
            }
          }

          text {
            font-size: 22rpx;
            color: $gray-5;

            .night-mode & {
              color: #999;
            }
          }

          &.like.liked {
            text {
              color: #ff3b30;
            }
          }
        }
      }
    }
  }

  &.card {
    .card-header {
      position: relative;
      height: 200rpx;

      .card-img {
        width: 100%;
        height: 100%;
      }

      .card-badge {
        position: absolute;
        top: 12rpx;
        left: 12rpx;
        padding: 4rpx 12rpx;
        color: #fff;
        border-radius: 12rpx;
        font-size: 20rpx;
        font-weight: 500;

        &.pinned {
          background: $primary-color;
        }

        &.hot {
          background: #ff3b30;
        }

        &.new {
          background: #34c759;
        }
      }

      .video-badge {
        position: absolute;
        top: 12rpx;
        right: 12rpx;
        width: 30rpx;
        height: 30rpx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-tag {
        position: absolute;
        bottom: 12rpx;
        left: 12rpx;
        padding: 4rpx 12rpx;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        border-radius: 12rpx;
        font-size: 20rpx;
      }

      .card-join-badge {
        position: absolute;
        bottom: 12rpx;
        right: 12rpx;
        display: flex;
        align-items: center;
        gap: 4rpx;
        padding: 4rpx 12rpx;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        border-radius: 12rpx;
        font-size: 20rpx;
      }
    }

    .card-body {
      padding: 20rpx;

      .card-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $gray-8;
        line-height: 1.4;
        margin-bottom: 12rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        .night-mode & {
          color: #e0e0e0;
        }
      }

      .card-summary {
        font-size: 24rpx;
        color: $gray-6;
        line-height: 1.5;
        margin-bottom: 12rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        .night-mode & {
          color: #999;
        }
      }

      .card-meta {
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

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      border-top: 1rpx solid $gray-2;

      .night-mode & {
        border-top-color: #444;
      }

      .footer-left {
        .source-tag {
          padding: 4rpx 12rpx;
          background: $gray-1;
          color: $gray-6;
          border-radius: 12rpx;
          font-size: 20rpx;

          .night-mode & {
            background: #333;
            color: #999;
          }
        }
      }

      .footer-right {
        .action-btn {
          display: flex;
          align-items: center;
          gap: 4rpx;
          padding: 8rpx;
          border-radius: 8rpx;
          transition: all 0.3s ease;

          &:active {
            background: $gray-1;

            .night-mode & {
              background: #333;
            }
          }

          text {
            font-size: 22rpx;
            color: $gray-5;

            .night-mode & {
              color: #999;
            }
          }

          &.like.liked {
            text {
              color: #ff3b30;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>