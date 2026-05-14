<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  showBackTop: {
    type: Boolean,
    default: false
  },
  tocCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['back-top', 'show-toc', 'show-settings'])

const handleBackTop = () => {
  emit('back-top')
}

const handleShowToc = () => {
  emit('show-toc')
}

const handleShowSettings = () => {
  emit('show-settings')
}
</script>

<template>
  <view class="floating-actions">
    <view 
      v-if="showBackTop" 
      class="floating-btn back-to-top"
      @click="handleBackTop"
    >
      <uni-icons type="top" size="20" color="#fff"></uni-icons>
    </view>
    
    <view 
      class="floating-btn toc-btn"
      @click="handleShowToc"
      v-if="tocCount > 0"
    >
      <uni-icons type="list" size="20" color="#fff"></uni-icons>
    </view>
    
    <view 
      class="floating-btn font-btn"
      @click="handleShowSettings"
    >
      <uni-icons type="font" size="20" color="#fff"></uni-icons>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.floating-actions {
	position: fixed;
	bottom: calc(140rpx + env(safe-area-inset-bottom));
	right: 30rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	z-index: 998;
	
	.floating-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
		cursor: pointer;
		
		&:active {
			transform: scale(0.9);
		}
		
		&.back-to-top {
			background: rgba(0, 0, 0, 0.6);
			color: #fff;
			
			&:active {
				background: rgba(0, 0, 0, 0.8);
			}
		}
		
		&.toc-btn {
			background: rgba(0, 122, 255, 0.8);
			color: #fff;
			
			&:active {
				background: rgba(0, 122, 255, 1);
			}
		}
		
		&.font-btn {
			background: rgba(255, 149, 0, 0.8);
			color: #fff;
			
			&:active {
				background: rgba(255, 149, 0, 1);
			}
		}
		
		// 添加更多按钮的样式...
		&.bookmark-btn {
			background: rgba(255, 59, 48, 0.8);
			color: #fff;
			
			&:active {
				background: rgba(255, 59, 48, 1);
			}
		}
		
		&.note-btn {
			background: rgba(76, 217, 100, 0.8);
			color: #fff;
			
			&:active {
				background: rgba(76, 217, 100, 1);
			}
		}
	}
}
</style>