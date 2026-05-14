<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatRelativeTime } from '@/utils/date'
import { formatNumber } from '@/utils/number'

const props = defineProps({
  newsList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['refresh', 'item-click'])

const handleItemClick = (item) => {
  emit('item-click', item)
}

const handleRefresh = () => {
  emit('refresh')
}
</script>

<template>
  <view class="related-section">
    <view class="section-header">
      <view class="section-title">
        <uni-icons type="paperplane" size="16" color="#007AFF"></uni-icons>
        <text>相关推荐</text>
      </view>
      <view class="section-refresh" @click="handleRefresh">
        <uni-icons type="refreshempty" size="16" color="#999"></uni-icons>
        <text>换一批</text>
      </view>
    </view>
    
    <view class="related-grid">
      <view 
        v-for="item in newsList" 
        :key="item.id"
        class="related-card"
        @click="handleItemClick(item)"
      >
        <view class="card-image">
          <image :src="item.cover" mode="aspectFill" />
          <view v-if="item.hot" class="hot-indicator">
            <uni-icons type="fire" size="12" color="#fff"></uni-icons>
            <text>热</text>
          </view>
        </view>
        <view class="card-content">
          <view class="card-title">{{item.title}}</view>
          <view class="card-meta">
            <text>{{formatRelativeTime(item.publishTime)}}</text>
            <text>·</text>
            <text>{{formatNumber(item.viewCount)}}阅</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.related-section {
	padding: 0 30rpx 30rpx;
	
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
		
		.section-refresh {
			display: flex;
			align-items: center;
			gap: 4rpx;
			font-size: 24rpx;
			color: $gray-6;
			
			.night-mode & {
				color: #999;
			}
			
			&:active {
				opacity: 0.7;
			}
		}
	}
	
	.related-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		
		.related-card {
			background: #fff;
			border-radius: 12rpx;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			transition: transform 0.3s ease, box-shadow 0.3s ease;
			
			.night-mode & {
				background: #2a2a2a;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
			}
			
			&:active {
				transform: translateY(-4rpx);
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
			}
			
			.card-image {
				position: relative;
				width: 100%;
				height: 200rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
				
				.hot-indicator {
					position: absolute;
					top: 8rpx;
					right: 8rpx;
					display: flex;
					align-items: center;
					gap: 2rpx;
					padding: 4rpx 8rpx;
					background: rgba(255, 59, 48, 0.8);
					color: #fff;
					border-radius: 12rpx;
					font-size: 20rpx;
					
					text {
						font-size: 20rpx;
					}
				}
			}
			
			.card-content {
				padding: 20rpx;
				
				.card-title {
					font-size: 28rpx;
					font-weight: 500;
					color: $gray-8;
					line-height: 1.4;
					margin-bottom: 10rpx;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					
					.night-mode & {
						color: #e0e0e0;
					}
				}
				
				.card-meta {
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
		}
	}
}
</style>