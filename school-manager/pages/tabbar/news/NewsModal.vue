<template>
  <view v-if="visible" class="detail-overlay" @click="handleClose">
    <view class="detail-modal" @click.stop>
      <view class="detail-header">
        <view class="detail-back" @click="handleClose">
          <uni-icons type="left" size="24" color="#333"></uni-icons>
        </view>
        <view class="detail-title">资讯详情</view>
        <view class="detail-actions">
          <view class="action-btn" @click="$emit('share')">
            <uni-icons type="redo" size="20" color="#666"></uni-icons>
          </view>
          <view class="action-btn" @click="$emit('favorite')">
            <uni-icons :type="news?.favorited ? 'star-filled' : 'star'" :size="20" :color="news?.favorited ? '#ffd700' : '#666'"></uni-icons>
          </view>
        </view>
      </view>
      
      <scroll-view class="detail-body" scroll-y>
        <view v-if="news" class="detail-content">
          <!-- 标题 -->
          <view class="modal-title">{{ news.title }}</view>
          
          <!-- 元信息 -->
          <view class="modal-meta">
            <view class="meta-item">
              <uni-icons type="person" size="14" color="#999"></uni-icons>
              <text>{{ news.author || news.source }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="calendar" size="14" color="#999"></uni-icons>
              <text>{{ formatTime(news.publishTime) }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="eye" size="14" color="#999"></uni-icons>
              <text>{{ formatNumber(news.viewCount) }}</text>
            </view>
          </view>
          
          <!-- 封面图 -->
          <image v-if="news.cover" class="modal-cover" :src="news.cover" mode="widthFix" />
          
          <!-- 内容 -->
          <view class="modal-text">{{ news.summary || '暂无详细内容' }}</view>
          
          <!-- 标签 -->
          <view v-if="news.tag" class="modal-tags">
            <uni-tag :text="news.tag" type="primary" size="small" />
          </view>
        </view>
      </scroll-view>
      
      <view class="detail-footer">
        <view 
          class="footer-btn like"
          :class="{ liked: news?.liked }"
          @click="$emit('like')"
        >
          <uni-icons :type="news?.liked ? 'heart-filled' : 'heart'" :size="20" :color="news?.liked ? '#ff3b30' : '#666'"></uni-icons>
          <text>{{ news?.likeCount || 0 }}</text>
        </view>
        <view class="footer-btn comment" @click="$emit('comment')">
          <uni-icons type="chat" size="20" color="#666"></uni-icons>
          <text>{{ news?.commentCount || 0 }}</text>
        </view>
        <view class="footer-btn share" @click="$emit('share')">
          <uni-icons type="redo" size="20" color="#666"></uni-icons>
          <text>分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatRelativeTime } from '@/utils/date'
import { formatNumber as formatNum } from '@/utils/number'

const props = defineProps({
  visible: Boolean,
  news: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'update:visible',
  'share',
  'favorite',
  'like',
  'comment'
])

const handleClose = () => {
  emit('update:visible', false)
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

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;

  .detail-modal {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;

    .night-mode & {
      background: #2a2a2a;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid $gray-2;

      .night-mode & {
        border-bottom-color: #444;
      }

      .detail-back {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:active {
          background: rgba(0, 0, 0, 0.05);

          .night-mode & {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }

      .detail-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }

      .detail-actions {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .action-btn {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;

          &:active {
            background: rgba(0, 0, 0, 0.05);

            .night-mode & {
              background: rgba(255, 255, 255, 0.05);
            }
          }
        }
      }
    }

    .detail-body {
      flex: 1;
      padding: 30rpx;
      overflow-y: auto;

      .detail-content {
        .modal-title {
          font-size: 36rpx;
          font-weight: bold;
          color: $gray-8;
          line-height: 1.4;
          margin-bottom: 20rpx;

          .night-mode & {
            color: #e0e0e0;
          }
        }

        .modal-meta {
          display: flex;
          align-items: center;
          gap: 20rpx;
          margin-bottom: 30rpx;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            font-size: 24rpx;
            color: $gray-5;

            .night-mode & {
              color: #999;
            }
          }
        }

        .modal-cover {
          width: 100%;
          border-radius: 16rpx;
          margin-bottom: 30rpx;
        }

        .modal-text {
          font-size: 28rpx;
          line-height: 1.8;
          color: $gray-8;
          margin-bottom: 30rpx;

          .night-mode & {
            color: #e0e0e0;
          }
        }

        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12rpx;
        }
      }
    }

    .detail-footer {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20rpx 30rpx;
      border-top: 1rpx solid $gray-2;

      .night-mode & {
        border-top-color: #444;
      }

      .footer-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
        padding: 20rpx;
        border-radius: 12rpx;
        transition: all 0.3s ease;

        &:active {
          background: rgba(0, 0, 0, 0.05);

          .night-mode & {
            background: rgba(255, 255, 255, 0.05);
          }
        }

        text {
          font-size: 24rpx;
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
</style>