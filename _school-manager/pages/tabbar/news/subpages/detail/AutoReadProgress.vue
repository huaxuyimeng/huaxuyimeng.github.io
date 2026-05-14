<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  progress: {
    type: Number,
    default: 0
  },
  paused: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['speed-decrease', 'speed-increase', 'toggle', 'close'])

const handleSpeedDecrease = () => {
  emit('speed-decrease')
}

const handleSpeedIncrease = () => {
  emit('speed-increase')
}

const handleToggle = () => {
  emit('toggle')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <view class="auto-read-progress">
    <view class="progress-bar">
      <view 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></view>
    </view>
    <view class="progress-controls">
      <view class="control-btn" @click="handleSpeedDecrease">
        <uni-icons type="minus" size="16" color="#fff"></uni-icons>
      </view>
      <view class="control-btn" @click="handleToggle">
        <uni-icons :type="paused ? 'play-filled' : 'pause'" size="16" color="#fff"></uni-icons>
      </view>
      <view class="control-btn" @click="handleSpeedIncrease">
        <uni-icons type="plus" size="16" color="#fff"></uni-icons>
      </view>
      <view class="control-btn close-btn" @click="handleClose">
        <uni-icons type="close" size="16" color="#fff"></uni-icons>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.auto-read-progress {
	position: fixed;
	bottom: calc(140rpx + env(safe-area-inset-bottom));
	left: 30rpx;
	right: 30rpx;
	background: rgba(0, 0, 0, 0.8);
	border-radius: 20rpx;
	padding: 20rpx;
	z-index: 998;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	
	.progress-bar {
		width: 100%;
		height: 6rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3rpx;
		overflow: hidden;
		
		.progress-fill {
			height: 100%;
			background: $primary-color;
			border-radius: 3rpx;
			transition: width 0.3s ease;
		}
	}
	
	.progress-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.control-btn {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			cursor: pointer;
			transition: all 0.3s ease;
			
			&:active {
				background: rgba(255, 255, 255, 0.3);
				transform: scale(0.95);
			}
			
			&.close-btn {
				background: rgba(255, 59, 48, 0.8);
				
				&:active {
					background: rgba(255, 59, 48, 1);
				}
			}
		}
	}
	
	// 速度指示器
	.speed-indicator {
		text-align: center;
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
	}
}
</style>