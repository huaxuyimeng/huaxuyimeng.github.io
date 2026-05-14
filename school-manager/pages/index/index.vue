<!--
 * 文件路径: pages/index/index.vue
 * 功能说明: 应用启动欢迎页/引导页
 * 主要功能:
 *   1. 显示应用Logo和欢迎信息
 *   2. 引导用户进入应用主界面
 *   3. 首次启动时的引导流程
 * 相关页面: pages/tabbar/index/index.vue (首页)
 -->
<template>
	<view class="welcome-page">
		<!-- Logo 区域 -->
		<view class="logo-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<view class="app-name">校园助手</view>
			<view class="app-slogan">让校园生活更便捷</view>
		</view>

		<!-- 功能特色 -->
		<view class="features-section">
			<view class="feature-item">
				<view class="feature-icon">📱</view>
				<view class="feature-text">一站式服务</view>
			</view>
			<view class="feature-item">
				<view class="feature-icon">⚡</view>
				<view class="feature-text">快速便捷</view>
			</view>
			<view class="feature-item">
				<view class="feature-icon">🎯</view>
				<view class="feature-text">精准信息</view>
			</view>
		</view>

		<!-- 版本信息 -->
		<view class="version-info">
			<text>Version 1.0.0</text>
		</view>

		<!-- 进入按钮 -->
		<view class="enter-button" @click="enterApp">
			<text>立即体验</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 是否已进入应用
const hasEntered = ref(false)

// 进入应用
const enterApp = () => {
	if (hasEntered.value) return
	
	hasEntered.value = true
	
	// 跳转到 tabbar 首页
	uni.switchTab({
		url: '/pages/tabbar/index/index',
		success: () => {
			console.log('跳转到首页成功')
		},
		fail: (err) => {
			console.error('跳转失败:', err)
			// 如果 switchTab 失败，尝试使用 navigateTo
			uni.navigateTo({
				url: '/pages/tabbar/index/index',
				fail: () => {
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					})
				}
			})
		}
	})
}

// 页面加载
onLoad(() => {
	// 检查是否已经登录或初始化
	checkAppStatus()
})

// 检查应用状态
const checkAppStatus = () => {
	// 可以在这里检查用户登录状态、应用初始化等
	// 如果已经初始化，可以自动跳转
	const isInitialized = uni.getStorageSync('appInitialized')
	
	if (isInitialized) {
		// 延迟跳转，让用户看到欢迎页
		setTimeout(() => {
			enterApp()
		}, 1500)
	} else {
		// 首次使用，标记已初始化
		uni.setStorageSync('appInitialized', true)
	}
}

// 页面显示时
onMounted(() => {
	// 可以在这里添加一些动画效果
})
</script>

<style lang="scss" scoped>
.welcome-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx;
	position: relative;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100rpx;
	animation: fadeInDown 0.8s ease-out;

	.logo {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 40rpx;
		border-radius: 40rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
	}

	.app-name {
		font-size: 48rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 16rpx;
		letter-spacing: 2rpx;
	}

	.app-slogan {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		opacity: 0.9;
	}
}

.features-section {
	display: flex;
	justify-content: space-around;
	width: 100%;
	max-width: 600rpx;
	margin-bottom: 100rpx;
	animation: fadeInUp 0.8s ease-out 0.3s both;

	.feature-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;

		.feature-icon {
			font-size: 60rpx;
			margin-bottom: 8rpx;
		}

		.feature-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.9);
		}
	}
}

.version-info {
	position: absolute;
	bottom: 120rpx;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
	animation: fadeIn 1s ease-out 0.6s both;
}

.enter-button {
	position: absolute;
	bottom: 60rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 600rpx;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	background: rgba(255, 255, 255, 0.95);
	color: #667eea;
	border-radius: 44rpx;
	font-size: 32rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
	animation: fadeInUp 0.8s ease-out 0.5s both;
	transition: all 0.3s ease;

	&:active {
		transform: translateX(-50%) scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
	}
}

// 动画定义
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>