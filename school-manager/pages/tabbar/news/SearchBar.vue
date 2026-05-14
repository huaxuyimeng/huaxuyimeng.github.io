<template>
  <view v-if="visible" class="search-overlay" @click="handleClose">
    <view class="search-bar" @click.stop>
      <view class="search-input-wrapper">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <input 
          class="search-input" 
          placeholder="搜索新闻、公告、活动..." 
          :value="keyword"
          @input="handleInput"
          @confirm="handleSearch"
          :focus="visible"
        />
        <view v-if="keyword" class="clear-btn" @click="handleClear">
          <uni-icons type="clear" size="16" color="#999"></uni-icons>
        </view>
      </view>
      <view class="search-cancel" @click="handleClose">取消</view>
    </view>
    
    <!-- 搜索历史 -->
    <view v-if="history.length > 0 && !results.length" class="search-history">
      <view class="history-header">
        <text class="history-title">搜索历史</text>
        <view class="history-clear" @click="$emit('clear-history')">
          <uni-icons type="trash" size="16" color="#999"></uni-icons>
        </view>
      </view>
      <view class="history-tags">
        <view 
          v-for="(item, index) in history.slice(0, 5)" 
          :key="index"
          class="history-tag"
          @click="$emit('history-click', item)"
        >
          {{ item }}
        </view>
      </view>
    </view>
    
    <!-- 热搜榜 -->
    <view v-if="!keyword && hotList.length > 0" class="hot-search">
      <view class="hot-header">
        <text class="hot-title">热搜榜</text>
      </view>
      <view class="hot-list">
        <view 
          v-for="(item, index) in hotList" 
          :key="item.id"
          class="hot-item"
          @click="$emit('hot-click', item.keyword)"
        >
          <view class="hot-rank" :class="getRankClass(index)">{{ index + 1 }}</view>
          <view class="hot-content">
            <view class="hot-keyword">
              <text>{{ item.keyword }}</text>
              <view v-if="item.tag" class="hot-tag" :class="item.tag.type">
                {{ item.tag.text }}
              </view>
            </view>
            <view class="hot-count">{{ item.count }} 搜索</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 搜索结果 -->
    <view v-if="results.length > 0" class="search-results">
      <view class="results-header">
        <text class="results-title">搜索结果 ({{ results.length }})</text>
      </view>
      <view class="results-list">
        <view 
          v-for="item in results" 
          :key="item.id"
          class="result-item"
          @click="$emit('result-click', item)"
        >
          <view class="result-content">
            <view class="result-title">{{ item.title }}</view>
            <view class="result-summary">{{ item.summary }}</view>
            <view class="result-meta">
              <text>{{ formatTime(item.publishTime) }}</text>
              <text>·</text>
              <text>{{ item.source }}</text>
            </view>
          </view>
          <image v-if="item.cover" class="result-img" :src="item.cover" mode="aspectFill" />
        </view>
      </view>
    </view>
    
    <!-- 空搜索状态 -->
    <view v-if="keyword && !results.length" class="search-empty">
      <image class="empty-icon" src="/static/images/search-empty.png" mode="aspectFit" />
      <view class="empty-text">没有找到相关资讯</view>
      <view class="empty-suggest">换个关键词试试吧</view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatRelativeTime } from '@/utils/date'

const props = defineProps({
  visible: Boolean,
  keyword: String,
  history: {
    type: Array,
    default: () => []
  },
  hotList: {
    type: Array,
    default: () => []
  },
  results: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:visible',
  'update:keyword',
  'search',
  'clear',
  'clear-history',
  'history-click',
  'hot-click',
  'result-click'
])

const handleInput = (e) => {
  emit('update:keyword', e.detail.value)
}

const handleSearch = () => {
  emit('search')
}

const handleClear = () => {
  emit('clear')
}

const handleClose = () => {
  emit('update:visible', false)
}

const getRankClass = (index) => {
  if (index < 3) return `rank-${index + 1}`
  return ''
}

const formatTime = (timeStr) => {
  return formatRelativeTime(timeStr)
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 2000;
  padding-top: env(safe-area-inset-top);
  overflow-y: auto;

  .night-mode & {
    background: #1a1a1a;
  }

  .search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid $gray-2;

    .night-mode & {
      border-bottom-color: #444;
    }

    .search-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      height: 70rpx;
      background: $gray-0;
      border-radius: 35rpx;

      .night-mode & {
        background: #2a2a2a;
      }

      .search-input {
        flex: 1;
        height: 100%;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }

      .clear-btn {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:active {
          background: $gray-2;

          .night-mode & {
            background: #3a3a3a;
          }
        }
      }
    }

    .search-cancel {
      margin-left: 20rpx;
      font-size: 28rpx;
      color: $primary-color;
      padding: 10rpx 20rpx;
      transition: all 0.3s ease;

      &:active {
        opacity: 0.7;
        transform: scale(0.95);
      }
    }
  }

  .search-history {
    padding: 30rpx;

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .history-title {
        font-size: 28rpx;
        font-weight: 500;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }

      .history-clear {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:active {
          background: $gray-1;

          .night-mode & {
            background: #333;
          }
        }
      }
    }

    .history-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .history-tag {
        padding: 12rpx 20rpx;
        background: $gray-0;
        border-radius: 40rpx;
        font-size: 24rpx;
        color: $gray-6;
        transition: all 0.3s ease;

        .night-mode & {
          background: #2a2a2a;
          color: #999;
        }

        &:active {
          background: $gray-2;
          transform: scale(0.95);

          .night-mode & {
            background: #3a3a3a;
          }
        }
      }
    }
  }

  .hot-search {
    padding: 30rpx;

    .hot-header {
      margin-bottom: 20rpx;

      .hot-title {
        font-size: 28rpx;
        font-weight: 500;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }
    }

    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid $gray-2;

        .night-mode & {
          border-bottom-color: #444;
        }

        &:last-child {
          border-bottom: none;
        }

        .hot-rank {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          font-weight: bold;
          margin-right: 20rpx;

          &.rank-1 {
            color: #ff3b30;
          }

          &.rank-2 {
            color: #ff9500;
          }

          &.rank-3 {
            color: #ffcc00;
          }
        }

        .hot-content {
          flex: 1;

          .hot-keyword {
            display: flex;
            align-items: center;
            gap: 12rpx;
            margin-bottom: 8rpx;

            text {
              font-size: 26rpx;
              color: $gray-8;

              .night-mode & {
                color: #e0e0e0;
              }
            }

            .hot-tag {
              padding: 4rpx 8rpx;
              border-radius: 8rpx;
              font-size: 18rpx;

              &.hot {
                background: rgba(255, 59, 48, 0.1);
                color: #ff3b30;
              }

              &.new {
                background: rgba(0, 122, 255, 0.1);
                color: $primary-color;
              }
            }
          }

          .hot-count {
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

  .search-results {
    padding: 30rpx;

    .results-header {
      margin-bottom: 20rpx;

      .results-title {
        font-size: 28rpx;
        font-weight: 500;
        color: $gray-8;

        .night-mode & {
          color: #e0e0e0;
        }
      }
    }

    .results-list {
      .result-item {
        display: flex;
        padding: 20rpx 0;
        border-bottom: 1rpx solid $gray-2;

        .night-mode & {
          border-bottom-color: #444;
        }

        &:last-child {
          border-bottom: none;
        }

        .result-content {
          flex: 1;
          padding-right: 20rpx;

          .result-title {
            font-size: 28rpx;
            font-weight: 500;
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

            .highlight {
              color: $primary-color;
              font-weight: bold;
              background: rgba(0, 122, 255, 0.1);
              padding: 0 4rpx;
              border-radius: 4rpx;

              .night-mode & {
                background: rgba(0, 122, 255, 0.2);
              }
            }
          }

          .result-summary {
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

            .highlight {
              color: $primary-color;
              font-weight: bold;
              background: rgba(0, 122, 255, 0.1);
              padding: 0 4rpx;
              border-radius: 4rpx;

              .night-mode & {
                background: rgba(0, 122, 255, 0.2);
              }
            }
          }

          .result-meta {
            display: flex;
            align-items: center;
            gap: 8rpx;
            font-size: 22rpx;
            color: $gray-5;

            .night-mode & {
              color: #999;
            }
          }
        }

        .result-img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
        }
      }
    }
  }

  .search-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 30rpx;

    .empty-icon {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
      opacity: 0.6;
    }

    .empty-text {
      font-size: 28rpx;
      color: $gray-5;
      margin-bottom: 12rpx;

      .night-mode & {
        color: #999;
      }
    }

    .empty-suggest {
      font-size: 24rpx;
      color: $gray-5;

      .night-mode & {
        color: #999;
      }
    }
  }
}
</style>