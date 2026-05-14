<script setup>
import { defineProps, defineEmits } from 'vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      hot: 0,
      new: 0,
      author: 0
    })
  },
  comments: {
    type: Array,
    default: () => []
  },
  sortOptions: {
    type: Array,
    default: () => [
      { value: 'hot', label: '热门' },
      { value: 'time', label: '最新' },
      { value: 'author', label: '作者' }
    ]
  },
  currentSort: {
    type: String,
    default: 'hot'
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'sort-change',
  'comment-like',
  'comment-reply',
  'comment-share',
  'user-click',
  'image-preview',
  'view-replies',
  'load-more',
  'post-comment'
])

const handleSortChange = (sort) => {
  emit('sort-change', sort)
}

const handleCommentLike = (comment) => {
  emit('comment-like', comment)
}

const handleCommentReply = (comment) => {
  emit('comment-reply', comment)
}

const handleCommentShare = (comment) => {
  emit('comment-share', comment)
}

const handleUserClick = (userId) => {
  emit('user-click', userId)
}

const handleImagePreview = (images, index) => {
  emit('image-preview', images, index)
}

const handleViewReplies = (comment) => {
  emit('view-replies', comment)
}

const handleLoadMore = () => {
  emit('load-more')
}

const handlePostComment = () => {
  emit('post-comment')
}
</script>

<template>
  <view id="comment-section" class="comment-section">
    <view class="section-header">
      <view class="section-title">
        <uni-icons type="chatboxes" size="16" color="#007AFF"></uni-icons>
        <text>评论 ({{stats.total}})</text>
      </view>
      <view class="comment-filter">
        <view 
          v-for="sort in sortOptions" 
          :key="sort.value"
          class="filter-item"
          :class="{ active: currentSort === sort.value }"
          @click="handleSortChange(sort.value)"
        >
          {{sort.label}}
        </view>
      </view>
    </view>
    
    <!-- 评论统计 -->
    <view class="comment-stats">
      <view class="stat-item">
        <text class="stat-value">{{stats.hot}}</text>
        <text class="stat-label">热门</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{stats.new}}</text>
        <text class="stat-label">最新</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{stats.author}}</text>
        <text class="stat-label">作者</text>
      </view>
    </view>
    
    <!-- 评论列表 -->
    <view class="comment-list" v-if="comments.length > 0">
      <comment-item 
        v-for="comment in comments" 
        :key="comment.id"
        :comment="comment"
        @like="handleCommentLike"
        @reply="handleCommentReply"
        @share="handleCommentShare"
        @user-click="handleUserClick"
        @image-preview="handleImagePreview"
        @view-replies="handleViewReplies"
      />
    </view>
    
    <!-- 空状态 -->
    <view v-else class="empty-comment">
      <image class="empty-icon" src="/static/images/empty-comment.png" mode="aspectFit" />
      <view class="empty-text">还没有评论，快来发表第一条评论吧～</view>
      <view class="empty-action" @click="handlePostComment">
        发表评论
      </view>
    </view>
    
    <!-- 加载更多 -->
    <view v-if="hasMore" class="load-more" @click="handleLoadMore">
      <uni-load-more 
        :status="loading ? 'loading' : 'more'" 
        :content-text="{
          contentdown: '点击加载更多',
          contentrefresh: '正在加载',
          contentnomore: '没有更多了'
        }"
      ></uni-load-more>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.comment-section {
	margin: 0 30rpx 30rpx;
	padding: 30rpx;
	background: $gray-0;
	border-radius: 16rpx;
	
	.night-mode & {
		background: #2a2a2a;
	}
	
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
			font-weight: 500;
			color: $gray-8;
			
			.night-mode & {
				color: #e0e0e0;
			}
		}
		
		.comment-filter {
			display: flex;
			align-items: center;
			gap: 10rpx;
			
			.filter-item {
				padding: 6rpx 12rpx;
				font-size: 24rpx;
				color: $gray-6;
				border-radius: 20rpx;
				background: $gray-1;
				transition: all 0.3s ease;
				
				.night-mode & {
					background: #3a3a3a;
					color: #999;
				}
				
				&.active {
					background: $primary-color;
					color: #fff;
					
					.night-mode & {
						background: $primary-color;
					}
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
	}
	
	.comment-stats {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 30rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		
		.night-mode & {
			background: #333;
		}
		
		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8rpx;
			
			.stat-value {
				font-size: 32rpx;
				font-weight: bold;
				color: $primary-color;
			}
			
			.stat-label {
				font-size: 24rpx;
				color: $gray-6;
				
				.night-mode & {
					color: #999;
				}
			}
		}
	}
	
	.empty-comment {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 0;
		
		.empty-icon {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
		}
		
		.empty-text {
			font-size: 28rpx;
			color: $gray-6;
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
			
			&:active {
				opacity: 0.8;
			}
		}
	}
	
	.load-more {
		margin-top: 30rpx;
		text-align: center;
	}
}
</style>