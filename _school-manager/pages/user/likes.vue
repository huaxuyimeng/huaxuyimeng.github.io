<!--
 * 文件路径: pages/user/likes.vue
 * 功能说明: 我的点赞页面
 * 显示用户点赞的所有内容
 -->
<template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-left" @click="handleBack">
				<view class="back-btn">
					<view class="back-btn-inner">
						<uni-icons type="left" size="20" color="#fff"></uni-icons>
					</view>
				</view>
			</view>
			<view class="navbar-title">我的点赞</view>
			<view class="navbar-right" v-if="likesList.length > 0 && !isLoading">
				<view 
					class="manage-btn-wrapper" 
					:class="{ 'active': isManageMode }"
					@click="toggleManageMode"
				>
					<text class="manage-btn">{{ isManageMode ? '完成' : '管理' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 统计信息 -->
		<view class="stats-bar" v-if="likesList.length > 0 && !isManageMode">
			<view class="stat-item">
				<uni-icons type="heart-filled" size="20" color="#ff3b30"></uni-icons>
				<text class="stat-text">共 {{ likesList.length }} 条</text>
			</view>
		</view>
		
		<!-- 骨架屏 -->
		<view class="skeleton-container" v-if="isLoading">
			<view 
				v-for="n in 3" 
				:key="n" 
				class="skeleton-item"
			>
				<view class="skeleton-content">
					<view class="skeleton-title"></view>
					<view class="skeleton-meta">
						<view class="skeleton-category"></view>
						<view class="skeleton-time"></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 点赞列表 -->
		<scroll-view 
			class="likes-container" 
			scroll-y
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			v-else
		>
			<view class="likes-list" v-if="filteredLikes.length > 0">
				<view 
					class="like-item" 
					v-for="(item, index) in filteredLikes" 
					:key="item.id"
					:class="{ 
						'selected': isManageMode && selectedIds.includes(item.id),
						'fade-in': index < 10
					}"
					:style="{ 'animation-delay': `${index * 0.05}s` }"
					@click="handleItemClick(item)"
				>
					<!-- 选中复选框 -->
					<view class="item-checkbox" v-if="isManageMode">
						<view 
							class="checkbox" 
							:class="{ 
								'checked': selectedIds.includes(item.id),
								'animating': animatingId === item.id
							}"
							@click.stop="toggleSelect(item)"
						>
							<uni-icons 
								v-if="selectedIds.includes(item.id)" 
								type="checkmarkempty" 
								size="16" 
								color="#fff"
							></uni-icons>
						</view>
					</view>
					
					<!-- 内容区域 -->
					<view class="item-content">
						<view class="content-header">
							<text class="item-title">{{ item.title }}</text>
							<view 
								class="like-btn" 
								:class="{ 'liked': true }"
								@click.stop="toggleLike(item)"
							>
								<image 
									class="like-icon" 
									src="/static/icons/action/like-active.svg"
									mode="aspectFit"
								></image>
							</view>
						</view>
						
						<view class="item-meta">
							<view class="meta-left">
								<uni-tag 
									:text="item.category || '资讯'" 
									type="primary" 
									size="small" 
									:inverted="true"
									:custom-style="{
										'background': 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
										'border': 'none',
										'color': '#fff',
										'font-weight': 500
									}"
								></uni-tag>
								<text class="meta-text" v-if="item.likeTime">{{ formatTime(item.likeTime) }}</text>
							</view>
						</view>
						
						<view v-if="item.description || item.excerpt" class="item-desc">
							<text>{{ item.description || item.excerpt }}</text>
						</view>
						
						<view class="item-thumbnail" v-if="item.cover || item.coverImage">
							<image 
								class="like-thumb" 
								:src="item.cover || item.coverImage" 
								:lazy-load="true"
								mode="aspectFill"
							></image>
						</view>
						
						<view class="item-footer">
							<view class="footer-stats">
								<view class="stat-item">
									<uni-icons type="eye" size="14" color="#999"></uni-icons>
									<text class="stat-text">{{ formatNumber(item.viewCount || 0) }}</text>
								</view>
								<view class="stat-item">
									<uni-icons type="heart-filled" size="14" color="#ff3b30"></uni-icons>
									<text class="stat-text">{{ formatNumber(item.likeCount || 0) }}</text>
								</view>
								<view class="stat-item">
									<uni-icons type="chat" size="14" color="#999"></uni-icons>
									<text class="stat-text">{{ formatNumber(item.commentCount || 0) }}</text>
								</view>
							</view>
							<view 
								class="delete-btn" 
								v-if="!isManageMode" 
								@click.stop="showDeleteDialog(item)"
							>
								<uni-icons type="trash" size="20" color="#FF3B30"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<view class="empty-animation">
					<uni-icons type="heart" size="100" color="#e8e8e8"></uni-icons>
				</view>
				<text class="empty-text">暂无点赞记录</text>
				<text class="empty-hint">你点赞的内容会在这里显示</text>
				<button 
					class="empty-btn" 
					type="primary" 
					@click="goToDiscover"
				>
					去发现
				</button>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view 
			class="bottom-bar" 
			v-if="likesList.length > 0"
		>
			<view v-if="!isManageMode" class="bottom-content normal-mode">
				<button 
					class="clear-btn" 
					type="warn" 
					@click="showClearConfirm"
				>
					清空点赞记录
				</button>
			</view>
			<view v-else class="bottom-content manage-mode">
				<view class="select-all" @click="toggleSelectAll">
					<view 
						class="checkbox" 
						:class="{ 
							'checked': selectedIds.length === filteredLikes.length && filteredLikes.length > 0
						}"
					>
						<uni-icons 
							v-if="selectedIds.length === filteredLikes.length && filteredLikes.length > 0" 
							type="checkmarkempty" 
							size="16" 
							color="#fff"
						></uni-icons>
					</view>
					<text class="select-text">全选</text>
				</view>
				
				<view class="batch-actions">
					<button 
						class="action-btn cancel" 
						@click="toggleManageMode"
					>
						取消
					</button>
					<button 
						class="action-btn delete" 
						:disabled="selectedIds.length === 0"
						:class="{ 'disabled': selectedIds.length === 0 }"
						@click="handleBatchDelete"
					>
						取消点赞({{ selectedIds.length }})
					</button>
				</view>
			</view>
		</view>
		
		<!-- 底部安全区域 -->
		<view class="safe-area"></view>
	</view>
</template>

<script>
	import storage from '@/utils/storage.js';
	import { formatRelativeTime } from '@/utils/date.js';
	import { formatNumber } from '@/utils/number.js';
	import interactionSync from '@/utils/interaction-sync.js';
	
	export default {
		data() {
			return {
				likesList: [],
				filteredLikes: [],
				isManageMode: false,
				selectedIds: [],
				isLoading: true,
				refreshing: false,
				animatingId: null
			}
		},
		onLoad() {
			this.loadLikes();
		},
		onShow() {
			const needRefresh = storage.get('needRefreshLikes');
			if (needRefresh) {
				storage.remove('needRefreshLikes');
				this.loadLikes(true);
			}
		},
		onPullDownRefresh() {
			this.onRefresh();
		},
		methods: {
			// 返回
			handleBack() {
				if (this.isManageMode) {
					this.isManageMode = false;
					this.selectedIds = [];
				} else {
					uni.navigateBack();
				}
			},
			
			// 切换管理模式
			toggleManageMode() {
				this.isManageMode = !this.isManageMode;
				if (!this.isManageMode) {
					this.selectedIds = [];
				}
			},
			
			// 处理列表项点击
			handleItemClick(item) {
				if (this.isManageMode) {
					this.toggleSelect(item);
				} else {
					this.goToDetail(item);
				}
			},
			
			// 切换选择状态
			toggleSelect(item) {
				const index = this.selectedIds.indexOf(item.id);
				if (index > -1) {
					this.selectedIds.splice(index, 1);
				} else {
					this.selectedIds.push(item.id);
					this.animatingId = item.id;
					setTimeout(() => {
						this.animatingId = null;
					}, 300);
				}
			},
			
			// 全选/取消全选
			toggleSelectAll() {
				if (this.selectedIds.length === this.filteredLikes.length) {
					this.selectedIds = [];
				} else {
					this.selectedIds = this.filteredLikes.map(item => item.id);
				}
			},
			
			// 加载点赞列表
			async loadLikes(force = false) {
				try {
					this.isLoading = true;
					
					// 获取点赞的新闻ID列表
					const likedNewsIds = storage.get('likedNews', []);
					
					if (likedNewsIds.length === 0) {
						this.likesList = [];
						this.filteredLikes = [];
						this.isLoading = false;
						return;
					}
					
					// 从mock数据中获取新闻详情
					const newsMock = await import('@/mock/modules/news.js');
					const allLikes = [];
					
					for (const newsId of likedNewsIds) {
						const newsDetail = newsMock.getNewsDetail(parseInt(newsId));
						if (newsDetail) {
							allLikes.push({
								...newsDetail,
								likeTime: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // 随机时间
							});
						}
					}
					
					// 按点赞时间倒序排列
					allLikes.sort((a, b) => (b.likeTime || 0) - (a.likeTime || 0));
					
					this.likesList = allLikes;
					this.filteredLikes = allLikes;
					
					this.isLoading = false;
					this.refreshing = false;
					uni.stopPullDownRefresh();
				} catch (error) {
					console.error('加载点赞列表失败:', error);
					this.isLoading = false;
					this.refreshing = false;
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
					uni.stopPullDownRefresh();
				}
			},
			
			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.loadLikes(true);
			},
			
			// 跳转到详情
			goToDetail(item) {
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${item.id}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 切换点赞状态
			toggleLike(item) {
				interactionSync.setNewsLikeStatus(item.id, false);
				this.likesList = this.likesList.filter(like => like.id !== item.id);
				this.filteredLikes = this.filteredLikes.filter(like => like.id !== item.id);
				
				uni.showToast({
					title: '已取消点赞',
					icon: 'success'
				});
			},
			
			// 显示删除对话框
			showDeleteDialog(item) {
				uni.showModal({
					title: '确认取消点赞',
					content: '确定要取消点赞这条内容吗？',
					success: (res) => {
						if (res.confirm) {
							this.toggleLike(item);
						}
					}
				});
			},
			
			// 批量删除
			handleBatchDelete() {
				if (this.selectedIds.length === 0) {
					uni.showToast({
						title: '请选择要取消点赞的项',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '确认取消点赞',
					content: `确定要取消选中 ${this.selectedIds.length} 条内容的点赞吗？`,
					success: (res) => {
						if (res.confirm) {
							this.deleteSelectedItems();
						}
					}
				});
			},
			
			// 删除选中项
			deleteSelectedItems() {
				this.selectedIds.forEach(id => {
					interactionSync.setNewsLikeStatus(id, false);
				});
				
				this.likesList = this.likesList.filter(item => !this.selectedIds.includes(item.id));
				this.filteredLikes = this.filteredLikes.filter(item => !this.selectedIds.includes(item.id));
				
				this.selectedIds = [];
				this.isManageMode = false;
				
				uni.showToast({
					title: '取消点赞成功',
					icon: 'success',
					mask: true
				});
			},
			
			// 显示清空确认
			showClearConfirm() {
				uni.showModal({
					title: '清空确认',
					content: '确定要清空所有点赞记录吗？此操作不可恢复',
					confirmText: '清空',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							this.handleClearAll();
						}
					}
				});
			},
			
			// 清空所有点赞
			handleClearAll() {
				try {
					const likedNewsIds = storage.get('likedNews', []);
					likedNewsIds.forEach(id => {
						interactionSync.setNewsLikeStatus(id, false);
					});
					
					this.likesList = [];
					this.filteredLikes = [];
					this.selectedIds = [];
					this.isManageMode = false;
					
					uni.showToast({
						title: '已清空',
						icon: 'success',
						mask: true
					});
				} catch (error) {
					console.error('清空失败:', error);
					uni.showToast({
						title: '清空失败',
						icon: 'none'
					});
				}
			},
			
			// 去发现页面
			goToDiscover() {
				uni.switchTab({
					url: '/pages/tabbar/news/index'
				});
			},
			
			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				return formatRelativeTime(timestamp);
			},
			
			// 格式化数字
			formatNumber: formatNumber
		}
	}
</script>

<style lang="scss" scoped>
.page {
	background: linear-gradient(180deg, #f5f7fa 0%, #f0f2f5 100%);
	min-height: 100vh;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.custom-navbar {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	padding-top: env(safe-area-inset-top);
	box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
	z-index: 300;
	border-bottom: 1rpx solid #f0f0f0;
	
	.navbar-left {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.back-btn {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: transparent;
			border-radius: 50%;
			transition: all 0.3s;
			
			.back-btn-inner {
				width: 60rpx;
				height: 60rpx;
				background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				box-shadow: 0 4rpx 12rpx rgba(255, 59, 48, 0.3);
			}
			
			&:active .back-btn-inner {
				transform: scale(0.95);
				opacity: 0.9;
			}
		}
	}
	
	.navbar-title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		color: #1a1a1a;
		letter-spacing: 0.5rpx;
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			bottom: -10rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 40rpx;
			height: 4rpx;
			background: linear-gradient(90deg, #ff3b30, #ff6b6b);
			border-radius: 2rpx;
		}
	}
	
	.navbar-right {
		width: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.manage-btn-wrapper {
			padding: 8rpx 20rpx;
			background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
			border-radius: 30rpx;
			transition: all 0.3s;
			box-shadow: 0 4rpx 15rpx rgba(255, 59, 48, 0.3);
			
			&:active {
				transform: scale(0.95);
				opacity: 0.9;
			}
			
			&.active {
				background: linear-gradient(135deg, #FF6B6B, #ee5a6f);
			}
			
			.manage-btn {
				font-size: 28rpx;
				color: #fff;
				font-weight: 600;
			}
		}
	}
}

.stats-bar {
	position: sticky;
	top: 88rpx;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 250;
	padding: 20rpx 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.stat-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 16rpx;
		background: rgba(255, 59, 48, 0.1);
		border-radius: 20rpx;
		
		.stat-text {
			font-size: 24rpx;
			color: #ff3b30;
			font-weight: 600;
		}
	}
}

.skeleton-container {
	padding: 30rpx;
	
	.skeleton-item {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		
		.skeleton-content {
			.skeleton-title {
				width: 100%;
				height: 40rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
				margin-bottom: 20rpx;
			}
			
			.skeleton-meta {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.skeleton-category {
					width: 100rpx;
					height: 30rpx;
					border-radius: 15rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
				
				.skeleton-time {
					width: 120rpx;
					height: 30rpx;
					border-radius: 8rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
			}
		}
	}
}

.likes-container {
	height: calc(100vh - 88rpx - env(safe-area-inset-top));
	padding: 0 20rpx;
	margin-top: 20rpx;
	position: relative;
	
	.likes-list {
		padding-bottom: 20rpx;
		
		.like-item {
			background: linear-gradient(135deg, #fff 0%, #fcfcfc 100%);
			border-radius: 24rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			display: flex;
			gap: 20rpx;
			box-shadow: 0 6rpx 30rpx rgba(0, 0, 0, 0.08);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			position: relative;
			overflow: hidden;
			opacity: 0;
			transform: translateY(20rpx);
			
			&.fade-in {
				animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
			}
			
			&.selected {
				background: linear-gradient(135deg, #fff0f0 0%, #ffe6e6 100%);
				border: 2rpx solid #ff3b30;
				transform: translateY(-2rpx);
				box-shadow: 0 8rpx 35rpx rgba(255, 59, 48, 0.2);
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 6rpx;
					background: linear-gradient(180deg, #ff3b30 0%, #ff6b6b 100%);
					border-radius: 24rpx 0 0 24rpx;
				}
			}
			
			.item-checkbox {
				width: 60rpx;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				padding-top: 4rpx;
				flex-shrink: 0;
				
				.checkbox {
					width: 40rpx;
					height: 40rpx;
					border: 2rpx solid #ddd;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;
					background: #fff;
					
					&.checked {
						background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
						border-color: transparent;
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
					
					&.animating {
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
				}
			}
			
			.item-content {
				flex: 1;
				min-width: 0;
				
				.content-header {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 15rpx;
					
					.item-title {
						flex: 1;
						font-size: 32rpx;
						font-weight: 600;
						color: #1a1a1a;
						line-height: 1.4;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-right: 10rpx;
					}
					
					.like-btn {
						width: 50rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						transition: all 0.3s;
						
						.like-icon {
							width: 44rpx;
							height: 44rpx;
						}
						
						&:active {
							transform: scale(0.9);
						}
					}
				}
				
				.item-meta {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 15rpx;
					
					.meta-left {
						display: flex;
						align-items: center;
						gap: 15rpx;
						
						.meta-text {
							font-size: 24rpx;
							color: #999;
						}
					}
				}
				
				.item-desc {
					font-size: 26rpx;
					color: #666;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					margin-bottom: 15rpx;
				}
				
				.item-thumbnail {
					margin-bottom: 15rpx;
					
					.like-thumb {
						width: 100%;
						height: 200rpx;
						border-radius: 12rpx;
					}
				}
				
				.item-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.footer-stats {
						display: flex;
						gap: 20rpx;
						
						.stat-item {
							display: flex;
							align-items: center;
							gap: 6rpx;
							
							.stat-text {
								font-size: 24rpx;
								color: #999;
							}
						}
					}
					
					.delete-btn {
						width: 50rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: rgba(255, 59, 48, 0.1);
						border-radius: 50%;
						transition: all 0.3s;
						
						&:active {
							transform: scale(0.9);
							background: rgba(255, 59, 48, 0.2);
						}
					}
				}
			}
		}
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 0;
		text-align: center;
		
		.empty-animation {
			margin-bottom: 40rpx;
		}
		
		.empty-text {
			font-size: 36rpx;
			font-weight: 600;
			color: #999;
			margin-bottom: 20rpx;
		}
		
		.empty-hint {
			font-size: 28rpx;
			color: #ccc;
			margin-bottom: 50rpx;
		}
		
		.empty-btn {
			width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-weight: 600;
			color: #fff;
			border: none;
			box-shadow: 0 8rpx 25rpx rgba(255, 59, 48, 0.4);
			
			&:active {
				transform: scale(0.98);
				opacity: 0.9;
			}
		}
	}
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	z-index: 99;
	
	.bottom-content {
		width: 100%;
		
		&.normal-mode {
			.clear-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				background: linear-gradient(135deg, #FF6B6B, #ee5a6f);
				color: #fff;
				border-radius: 12rpx;
				font-size: 30rpx;
				font-weight: 500;
				border: none;
				transition: all 0.3s;
				
				&:active {
					transform: scale(0.98);
					opacity: 0.9;
				}
			}
		}
		
		&.manage-mode {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20rpx;
			
			.select-all {
				display: flex;
				align-items: center;
				gap: 15rpx;
				
				.checkbox {
					width: 40rpx;
					height: 40rpx;
					border: 2rpx solid #ddd;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;
					
					&.checked {
						background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
						border-color: transparent;
					}
				}
				
				.select-text {
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
				}
			}
			
			.batch-actions {
				display: flex;
				gap: 20rpx;
				
				.action-btn {
					height: 80rpx;
					line-height: 80rpx;
					padding: 0 40rpx;
					border-radius: 12rpx;
					font-size: 30rpx;
					font-weight: 600;
					border: none;
					transition: all 0.3s;
					
					&.cancel {
						background: #f5f5f5;
						color: #666;
					}
					
					&.delete {
						background: linear-gradient(135deg, #FF6B6B, #ee5a6f);
						color: #fff;
						box-shadow: 0 8rpx 25rpx rgba(255, 107, 107, 0.4);
						
						&:active:not(.disabled) {
							transform: scale(0.98);
							opacity: 0.9;
						}
						
						&.disabled {
							background: #e0e0e0;
							color: #999;
							box-shadow: none;
						}
					}
				}
			}
		}
	}
}

.safe-area {
	height: env(safe-area-inset-bottom);
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes checkboxPop {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>
