<script setup>
// 应用生命周期
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
	console.log('App Launch')
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/styles/index.scss';
	
	/* 自定义 TabBar 样式 */
	:deep(.uni-tabbar) {
		box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.08);
		border-top: none;
		background: #FFFFFF !important;
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
	}
	
	:deep(.uni-tabbar__item) {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		
		&.uni-tabbar__item--active {
			.uni-tabbar__icon {
				transform: scale(1.1);
			}
			
			.uni-tabbar__text {
				font-weight: 600;
				transform: scale(1.05);
			}
		}
	}
	
	:deep(.uni-tabbar__icon) {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	:deep(.uni-tabbar__text) {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 22rpx;
		letter-spacing: 0.5rpx;
	}
</style>
