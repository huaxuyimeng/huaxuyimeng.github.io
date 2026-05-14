<script setup>
import { defineProps } from 'vue'

defineProps({
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <view class="interaction-stats">
    <view class="stat-item">
      <text class="stat-value">{{likeCount}}</text>
      <text class="stat-label">点赞</text>
    </view>
    <view class="stat-item">
      <text class="stat-value">{{commentCount}}</text>
      <text class="stat-label">评论</text>
    </view>
    <view class="stat-item">
      <text class="stat-value">{{shareCount}}</text>
      <text class="stat-label">分享</text>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.interaction-stats {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 30rpx;
	margin: 0 30rpx 30rpx;
	background: $gray-0;
	border-radius: 16rpx;
	
	.night-mode & {
		background: #2a2a2a;
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
</style>