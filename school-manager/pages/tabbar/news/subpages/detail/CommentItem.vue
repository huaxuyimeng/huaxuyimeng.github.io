

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatRelativeTime } from '@/utils/date'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like', 'reply', 'share', 'user-click', 'image-preview', 'view-replies'])

const handleLike = () => {
  emit('like', props.comment)
}

const handleReply = () => {
  emit('reply', props.comment)
}

const handleShare = () => {
  emit('share', props.comment)
}

const handleUserClick = () => {
  emit('user-click', props.comment.userId)
}

const handleImagePreview = (index) => {
  emit('image-preview', props.comment.images, index)
}

const handleViewReplies = () => {
  emit('view-replies', props.comment)
}
</script>

<template>
  <view 
    class="comment-item"
    :class="{ 
      'hot-comment': comment.isHot,
      'author-comment': comment.isAuthor 
    }"
  >
    <view class="comment-main">
      <image 
        :src="comment.avatar || '/static/images/avatar-default.png'" 
        class="comment-avatar"
        @click="handleUserClick"
      />
      <view class="comment-content">
        <view class="comment-header">
          <view class="user-info">
            <text class="username">{{comment.username}}</text>
            <view v-if="comment.isAuthor" class="user-badge author">作者</view>
            <view v-if="comment.isHot" class="user-badge hot">热评</view>
            <view v-if="comment.isTop" class="user-badge top">置顶</view>
          </view>
          <view class="comment-time">
            {{formatRelativeTime(comment.createTime)}}
            <text v-if="comment.floor">#{{comment.floor}}</text>
          </view>
        </view>
        
        <view class="comment-text">{{comment.content}}</view>
        
        <!-- 评论图片 -->
        <view v-if="comment.images && comment.images.length > 0" class="comment-images">
          <image 
            v-for="(img, index) in comment.images.slice(0, 3)" 
            :key="index"
            :src="img" 
            mode="aspectFill"
            @click="handleImagePreview(index)"
          />
          <view v-if="comment.images.length > 3" class="more-images">
            +{{comment.images.length - 3}}
          </view>
        </view>
        
        <view class="comment-actions">
          <view 
            class="action-btn like" 
            :class="{ liked: comment.liked }"
            @click="handleLike"
          >
            <uni-icons 
              :type="comment.liked ? 'heart-filled' : 'heart'" 
              :size="16" 
              :color="comment.liked ? '#ff3b30' : '#999'"
            ></uni-icons>
            <text>{{comment.likeCount}}</text>
          </view>
          
          <view 
            class="action-btn reply" 
            @click="handleReply"
          >
            <uni-icons type="chat" size="16" color="#999"></uni-icons>
            <text>{{comment.replyCount || 0}}</text>
          </view>
          
          <view 
            class="action-btn share" 
            @click="handleShare"
          >
            <uni-icons type="redo" size="16" color="#999"></uni-icons>
          </view>
        </view>
        
        <!-- 回复列表 -->
        <view v-if="comment.replies && comment.replies.length > 0" class="reply-list">
          <view 
            v-for="reply in comment.replies" 
            :key="reply.id"
            class="reply-item"
          >
            <view class="reply-user" @click="$emit('user-click', reply.userId)">
              <text class="reply-name">{{reply.username}}</text>
              <text v-if="reply.isAuthor" class="reply-badge">作者</text>
            </view>
            <text class="reply-text">：{{reply.content}}</text>
          </view>
          <view 
            v-if="comment.replyCount > 2" 
            class="view-all-reply"
            @click="handleViewReplies"
          >
            查看全部{{comment.replyCount}}条回复
            <uni-icons type="arrowright" size="12" color="#007AFF"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.comment-item {
	padding: 20rpx 0;
	border-bottom: 1rpx solid $gray-2;
	
	.night-mode & {
		border-bottom-color: #444;
	}
	
	&:last-child {
		border-bottom: none;
	}
	
	&.hot-comment {
		background: linear-gradient(90deg, rgba(255, 149, 0, 0.05) 0%, rgba(255, 149, 0, 0) 100%);
		border-left: 4rpx solid #ff9500;
		padding-left: 16rpx;
	}
	
	&.author-comment {
		background: linear-gradient(90deg, rgba(0, 122, 255, 0.05) 0%, rgba(0, 122, 255, 0) 100%);
		border-left: 4rpx solid $primary-color;
		padding-left: 16rpx;
	}
	
	.comment-main {
		display: flex;
		gap: 20rpx;
		
		.comment-avatar {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}
		
		.comment-content {
			flex: 1;
			
			.comment-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 12rpx;
				
				.user-info {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 8rpx;
					
					.username {
						font-size: 28rpx;
						font-weight: 500;
						color: $gray-8;
						
						.night-mode & {
							color: #e0e0e0;
						}
					}
					
					.user-badge {
						padding: 2rpx 8rpx;
						border-radius: 12rpx;
						font-size: 20rpx;
						color: #fff;
						
						&.author {
							background: $primary-color;
						}
						
						&.hot {
							background: #ff9500;
						}
						
						&.top {
							background: #ff3b30;
						}
					}
				}
				
				.comment-time {
					font-size: 24rpx;
					color: $gray-5;
					
					.night-mode & {
						color: #999;
					}
					
					text {
						color: $primary-color;
						margin-left: 4rpx;
					}
				}
			}
			
			.comment-text {
				font-size: 28rpx;
				line-height: 1.6;
				color: $gray-8;
				margin-bottom: 12rpx;
				
				.night-mode & {
					color: #e0e0e0;
				}
			}
			
			.comment-images {
				display: flex;
				gap: 8rpx;
				margin-bottom: 12rpx;
				flex-wrap: wrap;
				
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
				}
				
				.more-images {
					width: 120rpx;
					height: 120rpx;
					background: rgba(0, 0, 0, 0.5);
					color: #fff;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
				}
			}
			
			.comment-actions {
				display: flex;
				align-items: center;
				gap: 20rpx;
				margin-top: 12rpx;
				
				.action-btn {
					display: flex;
					align-items: center;
					gap: 4rpx;
					padding: 6rpx 12rpx;
					border-radius: 8rpx;
					transition: all 0.3s ease;
					
					&:active {
						background: $gray-1;
						
						.night-mode & {
							background: #3a3a3a;
						}
					}
					
					&.liked {
						background: rgba(255, 59, 48, 0.1);
						color: #ff3b30;
						
						.night-mode & {
							background: rgba(255, 59, 48, 0.2);
						}
					}
					
					text {
						font-size: 24rpx;
						color: $gray-6;
						
						.night-mode & {
							color: #999;
						}
					}
					
					&.liked {
						text {
							color: #ff3b30;
						}
					}
				}
			}
			
			.reply-list {
				margin-top: 20rpx;
				padding: 20rpx;
				background: $gray-0;
				border-radius: 12rpx;
				
				.night-mode & {
					background: #333;
				}
				
				.reply-item {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: 12rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.reply-user {
						display: flex;
						align-items: center;
						gap: 4rpx;
						
						.reply-name {
							font-size: 24rpx;
							color: $primary-color;
							font-weight: 500;
						}
						
						.reply-badge {
							padding: 2rpx 6rpx;
							background: $primary-color;
							color: #fff;
							border-radius: 8rpx;
							font-size: 20rpx;
						}
					}
					
					.reply-text {
						font-size: 24rpx;
						color: $gray-8;
						line-height: 1.6;
						
						.night-mode & {
							color: #e0e0e0;
						}
					}
				}
				
				.view-all-reply {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 4rpx;
					padding: 8rpx 0;
					color: $primary-color;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>