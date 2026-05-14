<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:visible',
  'share-wechat',
  'share-moment',
  'copy-link'
])

const handleClose = () => {
  emit('update:visible', false)
}

const handleShareWechat = () => {
  emit('share-wechat')
}

const handleShareMoment = () => {
  emit('share-moment')
}

const handleCopyLink = () => {
  emit('copy-link')
}
</script>

<template>
  <view v-if="visible" class="share-overlay" @click="handleClose">
    <view class="share-panel" @click.stop>
      <view class="share-header">
        <text>分享到</text>
        <view class="share-close" @click="handleClose">×</view>
      </view>
      <view class="share-options">
        <view class="share-option" @click="handleShareWechat">
          <view class="option-icon wechat">💬</view>
          <text>微信好友</text>
        </view>
        <view class="share-option" @click="handleShareMoment">
          <view class="option-icon moment">📱</view>
          <text>朋友圈</text>
        </view>
        <view class="share-option" @click="handleCopyLink">
          <view class="option-icon link">🔗</view>
          <text>复制链接</text>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.share-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	display: flex;
	align-items: flex-end;
	
	.share-panel {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		
		.night-mode & {
			background: #2a2a2a;
		}
		
		.share-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid $gray-2;
			
			.night-mode & {
				border-bottom-color: #444;
			}
			
			text {
				font-size: 32rpx;
				font-weight: bold;
				color: $gray-8;
				
				.night-mode & {
					color: #e0e0e0;
				}
			}
			
			.share-close {
				font-size: 40rpx;
				color: $gray-5;
				line-height: 1;
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all 0.3s;
				
				&:active {
					background: rgba(0, 0, 0, 0.05);
					
					.night-mode & {
						background: rgba(255, 255, 255, 0.05);
					}
				}
			}
		}
		
		.share-options {
			display: flex;
			justify-content: space-around;
			padding: 40rpx 30rpx;
			
			.share-option {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 15rpx;
				
				.option-icon {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 50rpx;
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.95);
					}
					
					&.wechat {
						background: #07C160;
					}
					
					&.moment {
						background: #7BBA3A;
					}
					
					&.link {
						background: $primary-color;
					}
				}
				
				text {
					font-size: 24rpx;
					color: $gray-6;
					
					.night-mode & {
						color: #999;
					}
				}
			}
		}
	}
}
</style>