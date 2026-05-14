<!--
 * 文件路径: pages/user/collections.vue
 * 功能说明: 收藏页面优化版
 * 优化点：
 *   1. 提取公共样式和类名
 *   2. 优化图片懒加载
 *   3. 添加加载动画
 *   4. 优化批量删除性能
 *   5. 添加骨架屏
 *   6. 优化空状态体验
 -->
 <template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-left" @click="handleBack">
				<view class="back-btn">
					<uni-icons type="left" size="20" color="#1a1a1a"></uni-icons>
				</view>
			</view>
			<view class="navbar-title">我的收藏</view>
			<view class="navbar-right" v-if="collectionsList.length > 0 && !isLoading">
				<view 
					class="manage-btn-wrapper" 
					:class="{ 'active': isManageMode }"
					@click="toggleManageMode"
				>
					<text class="manage-btn">{{ isManageMode ? '完成' : '管理' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 骨架屏 -->
		<view class="skeleton-container" v-if="isLoading">
			<view 
				v-for="n in 3" 
				:key="n" 
				class="skeleton-item"
			>
				<view class="skeleton-thumb"></view>
				<view class="skeleton-content">
					<view class="skeleton-title"></view>
					<view class="skeleton-meta">
						<view class="skeleton-tag"></view>
						<view class="skeleton-time"></view>
					</view>
					<view class="skeleton-footer"></view>
				</view>
			</view>
		</view>
		
		<!-- 收藏列表 -->
		<scroll-view 
			class="collections-container" 
			scroll-y
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="loadMore"
			v-else
		>
			<view class="collections-list" v-if="collectionsList.length > 0">
				<view 
					class="collection-item" 
					v-for="(item, index) in collectionsList" 
					:key="item.id"
					:class="{ 
						'selected': isManageMode && selectedIds.includes(item.id),
						'fade-in': index < 10
					}"
					:style="{ 'animation-delay': `${index * 0.05}s` }"
					@click="handleItemClick(item)"
				>
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
					
					<view class="item-number" v-if="!isManageMode && showNumbers">
						<text class="number-text">{{ index + 1 }}</text>
					</view>
					
					<view class="item-media">
						<image 
							class="collection-thumb" 
							:src="item.coverImage || item.cover || '/static/images/default-cover.jpg'" 
							:lazy-load="true"
							mode="aspectFill"
							@load="onImageLoad(item.id)"
							@error="onImageError(item.id)"
						></image>
						<view v-if="item.video" class="video-badge">
							<uni-icons type="videocam" size="16" color="#fff"></uni-icons>
						</view>
					</view>
					
					<view class="item-content">
						<view class="content-header">
							<text class="collection-title">{{ item.title }}</text>
							<view 
								class="favorite-star" 
								:class="{ 'favorited': item.isFavorited }"
								@click.stop="toggleFavorite(item)"
							>
								<uni-icons 
									:type="item.isFavorited ? 'star-filled' : 'star'" 
									:size="20" 
									:color="item.isFavorited ? '#ff9500' : '#ccc'"
								></uni-icons>
							</view>
						</view>
						
						<view class="collection-meta">
							<uni-tag 
								:text="item.category || '资讯'" 
								type="primary" 
								size="small" 
								:inverted="true"
								:custom-style="{
									'background': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
									'border': 'none',
									'color': '#666',
									'font-weight': 500
								}"
							></uni-tag>
							<view class="meta-info">
								<text class="collection-time">收藏于 {{ formatTime(item.collectTime) }}</text>
								<text class="view-count">{{ item.viewCount || 0 }}浏览</text>
							</view>
						</view>
						
						<view v-if="item.description" class="collection-desc">
							<text>{{ item.description }}</text>
						</view>
						
						<view class="collection-footer">
							<view class="footer-stats">
								<view class="stat-item">
									<uni-icons type="eye" size="14" color="#999"></uni-icons>
									<text class="stat-text">{{ formatNumber(item.viewCount || 0) }}</text>
								</view>
								<view class="stat-item">
									<uni-icons type="heart" size="14" color="#999"></uni-icons>
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
					
					<!-- 滑动删除 -->
					<view 
						class="slide-delete" 
						v-if="!isManageMode && enableSwipeDelete"
						@touchstart="onTouchStart($event, index)"
						@touchmove="onTouchMove($event, index)"
						@touchend="onTouchEnd($event, index)"
					>
						<view 
							class="delete-action" 
							:style="{ transform: `translateX(${getSwipeOffsetRpx(item)}rpx)` }"
							@click.stop="showDeleteDialog(item)"
						>
							<text>删除</text>
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view class="load-more" v-if="hasMore">
					<uni-load-more :status="loadingMore ? 'loading' : 'more'"></uni-load-more>
				</view>
				<view class="no-more" v-else>
					<text>没有更多了</text>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<view class="empty-animation">
					<uni-icons type="star" size="100" color="#e8e8e8"></uni-icons>
				</view>
				<text class="empty-text">暂无收藏</text>
				<text class="empty-hint">快去收藏喜欢的资讯吧～</text>
				<button class="empty-btn" type="primary" @click="goToDiscover">去发现</button>
			</view>
		</scroll-view>
		
		<!-- 批量操作栏 -->
		<view 
			class="batch-bar" 
			v-if="isManageMode && collectionsList.length > 0"
			:class="{ 'show': isManageMode }"
		>
			<view class="batch-content">
				<view class="select-all" @click="toggleSelectAll">
					<view 
						class="checkbox" 
						:class="{ 
							'checked': selectedIds.length === collectionsList.length && collectionsList.length > 0
						}"
					>
						<uni-icons 
							v-if="selectedIds.length === collectionsList.length && collectionsList.length > 0" 
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
						删除({{ selectedIds.length }})
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
	
	export default {
		data() {
			return {
				collectionsList: [],
				isManageMode: false,
				selectedIds: [],
				isLoading: true,
				refreshing: false,
				loadingMore: false,
				hasMore: true,
				currentPage: 1,
				pageSize: 10,
				animatingId: null,
				showNumbers: true,
				enableSwipeDelete: true,
				swipeStartX: 0,
				swipeCurrentX: 0,
				activeSwipeIndex: -1,
				deleteItem: null,
				deleteType: 'single' // single or batch
			}
		},
		onLoad() {
			this.initLottie();
			this.loadCollections();
		},
		onShow() {
			// 检查是否需要刷新
			const needRefresh = storage.get('needRefreshCollections');
			if (needRefresh) {
				storage.remove('needRefreshCollections');
				this.loadCollections(true);
			}
		},
		onPullDownRefresh() {
			this.onRefresh();
		},
		methods: {
			// 初始化动画（已移除Lottie，使用默认图标）
			initLottie() {
				// Lottie动画已移除，使用默认图标
				this.showLottie = false;
			},
			
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
				if (this.selectedIds.length === this.collectionsList.length) {
					this.selectedIds = [];
				} else {
					this.selectedIds = this.collectionsList.map(item => item.id);
				}
			},
			
			// 加载收藏列表
			async loadCollections(force = false) {
				try {
					if (force) {
						this.currentPage = 1;
						this.hasMore = true;
						this.collectionsList = [];
					}
					
					if (this.currentPage === 1) {
						this.isLoading = true;
					}
					
					// 模拟API请求
					setTimeout(() => {
						const allCollections = storage.get('myCollections') || [];
						const start = (this.currentPage - 1) * this.pageSize;
						const end = start + this.pageSize;
						const pageData = allCollections.slice(start, end);
						
						if (this.currentPage === 1) {
							this.collectionsList = pageData;
						} else {
							this.collectionsList = [...this.collectionsList, ...pageData];
						}
						
						this.hasMore = pageData.length === this.pageSize;
						this.isLoading = false;
						this.refreshing = false;
						this.loadingMore = false;
						
						if (force) {
							uni.showToast({
								title: '刷新成功',
								icon: 'success'
							});
						}
					}, 500);
					
				} catch (error) {
					console.error('加载收藏失败:', error);
					this.isLoading = false;
					this.refreshing = false;
					this.loadingMore = false;
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				}
			},
			
			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.loadCollections(true);
			},
			
			// 加载更多
			loadMore() {
				if (this.loadingMore || !this.hasMore || this.isLoading) return;
				
				this.loadingMore = true;
				this.currentPage += 1;
				this.loadCollections();
			},
			
			// 跳转到详情
			goToDetail(item) {
				// 记录浏览历史
				const history = {
					id: item.id,
					title: item.title,
					cover: item.coverImage || item.cover,
					category: item.category,
					viewTime: Date.now(),
					viewCount: (item.viewCount || 0) + 1
				};
				
				let historyList = storage.get('browsingHistory') || [];
				// 去重
				historyList = historyList.filter(h => h.id !== item.id);
				historyList.unshift(history);
				storage.set('browsingHistory', historyList.slice(0, 50)); // 最多保存50条
				
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${item.id}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 显示删除对话框
			showDeleteDialog(item) {
				this.deleteItem = item;
				this.deleteType = 'single';
				uni.showModal({
					title: '确认删除',
					content: '确定要取消收藏吗？',
					success: (res) => {
						if (res.confirm) {
							this.deleteSingleItem(item.id);
						}
					}
				});
			},
			
			// 批量删除
			handleBatchDelete() {
				if (this.selectedIds.length === 0) {
					uni.showToast({
						title: '请选择要删除的项',
						icon: 'none'
					});
					return;
				}
				
				this.deleteType = 'batch';
				uni.showModal({
					title: '确认删除',
					content: `确定要删除选中的 ${this.selectedIds.length} 条收藏吗？`,
					success: (res) => {
						if (res.confirm) {
							this.deleteSelectedItems();
						}
					}
				});
			},
			
			// 删除选中项
			async deleteSelectedItems() {
				// 删除收藏记录
				let collections = storage.get('myCollections') || [];
				collections = collections.filter(item => !this.selectedIds.includes(item.id));
				storage.set('myCollections', collections);
				
				// 更新收藏ID列表
				let collectedNews = storage.get('collectedNews') || [];
				this.selectedIds.forEach(id => {
					collectedNews = collectedNews.filter(newsId => newsId !== id);
				});
				storage.set('collectedNews', collectedNews);
				
				// 更新列表
				this.collectionsList = collections;
				
				// 显示删除动画
				const tempList = [...this.collectionsList];
				this.collectionsList = [];
				setTimeout(() => {
					this.collectionsList = tempList;
				}, 50);
				
				// 重置状态
				this.selectedIds = [];
				this.isManageMode = false;
				
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					mask: true
				});
			},
			
			// 删除单条记录
			async deleteSingleItem(id) {
				let collections = storage.get('myCollections') || [];
				collections = collections.filter(item => item.id !== id);
				storage.set('myCollections', collections);
				
				let collectedNews = storage.get('collectedNews') || [];
				collectedNews = collectedNews.filter(newsId => newsId !== id);
				storage.set('collectedNews', collectedNews);
				
				// 查找要删除的项的索引
				const index = this.collectionsList.findIndex(item => item.id === id);
				if (index > -1) {
					// 添加删除动画
					const item = this.collectionsList[index];
					item.deleting = true;
					this.$set(this.collectionsList, index, item);
					
					setTimeout(() => {
						this.collectionsList = this.collectionsList.filter(item => item.id !== id);
					}, 300);
				}
				
				uni.showToast({
					title: '已取消收藏',
					icon: 'success',
					mask: true
				});
			},
			
			// 切换收藏状态
			toggleFavorite(item) {
				item.isFavorited = !item.isFavorited;
				this.$forceUpdate();
				
				uni.showToast({
					title: item.isFavorited ? '已标星' : '已取消标星',
					icon: 'success'
				});
			},
			
			// 滑动删除相关
			onTouchStart(e, index) {
				this.swipeStartX = e.touches[0].clientX;
				this.activeSwipeIndex = index;
			},
			
			onTouchMove(e, index) {
				if (this.activeSwipeIndex !== index) return;
				
				this.swipeCurrentX = e.touches[0].clientX;
				const diff = this.swipeStartX - this.swipeCurrentX;
				
				if (diff > 0) { // 向左滑动
					const item = this.collectionsList[index];
					// 将px转换为rpx（假设屏幕宽度为375px，1rpx = 0.5px）
					const maxOffset = 160; // 80rpx = 160px (在375px屏幕上)
					item.swipeOffset = Math.min(diff, maxOffset);
					this.$set(this.collectionsList, index, item);
				}
			},
			
			onTouchEnd(e, index) {
				if (this.activeSwipeIndex !== index) return;
				
				const item = this.collectionsList[index];
				const threshold = 80; // 40rpx = 80px
				if (item.swipeOffset > threshold) {
					item.swipeOffset = 160; // 80rpx = 160px
					this.$set(this.collectionsList, index, item);
				} else {
					item.swipeOffset = 0;
					this.$set(this.collectionsList, index, item);
				}
				
				this.activeSwipeIndex = -1;
			},
			
			// 图片加载完成
			onImageLoad(id) {
				const index = this.collectionsList.findIndex(item => item.id === id);
				if (index > -1) {
					this.$set(this.collectionsList[index], 'imageLoaded', true);
				}
			},
			
			// 图片加载失败
			onImageError(id) {
				const index = this.collectionsList.findIndex(item => item.id === id);
				if (index > -1) {
					this.$set(this.collectionsList[index], 'imageError', true);
				}
			},
			
			// 去发现页面
			goToDiscover() {
				uni.switchTab({
					url: '/pages/tabbar/news/index'
				});
			},
			
			// 格式化时间（相对时间）
			formatTime(timestamp) {
				if (!timestamp) return '';
				return formatRelativeTime(new Date(timestamp));
			},
			
			// 获取滑动偏移量（转换为rpx）
			getSwipeOffsetRpx(item) {
				if (!item.swipeOffset) return 0;
				const systemInfo = uni.getSystemInfoSync();
				const pxToRpx = 750 / systemInfo.windowWidth;
				return item.swipeOffset * pxToRpx;
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
	z-index: 100;
	margin: 0 -20rpx 20rpx -20rpx;
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
			background: rgba(0, 0, 0, 0.05);
			border-radius: 50%;
			transition: all 0.3s;
			border: 1rpx solid rgba(0, 0, 0, 0.1);
			
			&:active {
				background: rgba(0, 0, 0, 0.1);
				transform: scale(0.95);
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
			background: linear-gradient(90deg, #667eea, #764ba2);
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
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			border-radius: 30rpx;
			transition: all 0.3s;
			box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
			
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

// 骨架屏
.skeleton-container {
	padding: 20rpx;
	
	.skeleton-item {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		gap: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		overflow: hidden;
		
		.skeleton-thumb {
			width: 200rpx;
			height: 150rpx;
			border-radius: 12rpx;
			background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
			background-size: 200% 100%;
			animation: skeleton-loading 1.5s infinite;
		}
		
		.skeleton-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.skeleton-title {
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
				margin-bottom: 20rpx;
				
				.skeleton-tag {
					width: 100rpx;
					height: 30rpx;
					border-radius: 15rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
				
				.skeleton-time {
					width: 150rpx;
					height: 30rpx;
					border-radius: 8rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
			}
			
			.skeleton-footer {
				height: 30rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
			}
		}
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

.collections-container {
	height: calc(100vh - 88rpx - env(safe-area-inset-top));
	padding: 0 20rpx;
	
	.collections-list {
		padding-bottom: 20rpx;
		
		.collection-item {
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
			
			&:active:not(.selected) {
				transform: translateY(-2rpx) scale(0.995);
				box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.12);
			}
			
			&.selected {
				background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
				border: 2rpx solid #667eea;
				transform: translateY(-2rpx);
				box-shadow: 0 8rpx 35rpx rgba(102, 126, 234, 0.2);
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 6rpx;
					background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
					border-radius: 24rpx 0 0 24rpx;
				}
			}
			
			&.deleting {
				animation: slideOutLeft 0.3s forwards;
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
					cursor: pointer;
					
					&.checked {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						border-color: transparent;
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
					
					&.animating {
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
				}
			}
			
			.item-number {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				font-weight: 700;
				color: #667eea;
				flex-shrink: 0;
				background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
				border-radius: 12rpx;
				
				.number-text {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}
			}
			
			.item-media {
				position: relative;
				flex-shrink: 0;
				
				.collection-thumb {
					width: 200rpx;
					height: 150rpx;
					border-radius: 16rpx;
					box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
					transition: transform 0.3s;
				}
				
				.video-badge {
					position: absolute;
					bottom: 10rpx;
					right: 10rpx;
					width: 40rpx;
					height: 40rpx;
					background: rgba(0, 0, 0, 0.7);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			.item-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-width: 0;
				
				.content-header {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 15rpx;
					
					.collection-title {
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
					
					.favorite-star {
						width: 40rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						transition: all 0.3s;
						background: rgba(255, 149, 0, 0.1);
						
						&:active {
							transform: scale(0.9);
							background: rgba(255, 149, 0, 0.2);
						}
						
						&.favorited {
							animation: starPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
						}
					}
				}
				
				.collection-meta {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 15rpx;
					
					.meta-info {
						display: flex;
						align-items: center;
						gap: 15rpx;
						
						.collection-time {
							font-size: 24rpx;
							color: #999;
						}
						
						.view-count {
							font-size: 24rpx;
							color: #999;
						}
					}
				}
				
				.collection-desc {
					font-size: 26rpx;
					color: #666;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					margin-bottom: 15rpx;
				}
				
				.collection-footer {
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
			
			.slide-delete {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				pointer-events: none;
				border-radius: 24rpx;
				overflow: hidden;
				
				.delete-action {
					position: absolute;
					top: 0;
					right: -80rpx;
					bottom: 0;
					width: 80rpx;
					background: linear-gradient(135deg, #FF6B6B, #ee5a6f);
					display: flex;
					align-items: center;
					justify-content: center;
					pointer-events: auto;
					transition: transform 0.3s;
					
					text {
						color: #fff;
						font-size: 28rpx;
						font-weight: 600;
					}
				}
				
			}
		}
	}
	
	.load-more, .no-more {
		padding: 40rpx 0;
		text-align: center;
		
		text {
			font-size: 28rpx;
			color: #999;
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
		
		& > * {
			display: block;
			margin: 0 auto;
		}
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
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 40rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
		border: none;
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);
		
		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}
	}
}

.batch-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	z-index: 99;
	transform: translateY(100%);
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	
	&.show {
		transform: translateY(0);
	}
	
	.batch-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		
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
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
				border-radius: 40rpx;
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

.safe-area {
	height: env(safe-area-inset-bottom);
}

// 动画定义
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

@keyframes slideOutLeft {
	to {
		opacity: 0;
		transform: translateX(-100%);
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

@keyframes starPop {
	0% {
		transform: scale(1) rotate(0deg);
	}
	50% {
		transform: scale(1.3) rotate(180deg);
	}
	100% {
		transform: scale(1) rotate(360deg);
	}
}
</style>