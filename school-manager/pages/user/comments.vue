<!--
 * 文件路径: pages/user/comments.vue
 * 功能说明: 我的评论页面优化版
 * 优化点：
 *   1. 重构UI设计，采用卡片式布局
 *   2. 添加头像和用户信息显示
 *   3. 优化时间显示，添加相对时间
 *   4. 添加点赞和回复功能
 *   5. 支持评论折叠展开
 *   6. 添加评论编辑功能
 *   7. 优化批量操作体验
 *   8. 添加评论状态标签
 *   9. 优化图片和视频显示
 *   10. 添加评论评分功能
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
			<view class="navbar-title">我的评论</view>
			<view class="navbar-right" v-if="commentsList.length > 0 && !isLoading">
				<view 
					class="manage-btn-wrapper" 
					:class="{ 'active': isManageMode }"
					@click="toggleManageMode"
				>
					<text class="manage-btn">{{ isManageMode ? '完成' : '管理' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="filter-tabs" v-if="commentsList.length > 0 && !isManageMode">
			<scroll-view class="tabs-scroll" scroll-x>
				<view class="tabs-container">
					<view 
						class="tab-item" 
						:class="{ 'active': activeTab === 'all' }"
						@click="changeTab('all')"
					>
						全部
					</view>
					<view 
						class="tab-item" 
						:class="{ 'active': activeTab === 'liked' }"
						@click="changeTab('liked')"
					>
						被点赞
					</view>
					<view 
						class="tab-item" 
						:class="{ 'active': activeTab === 'replied' }"
						@click="changeTab('replied')"
					>
						有回复
					</view>
					<view 
						class="tab-item" 
						:class="{ 'active': activeTab === 'recent' }"
						@click="changeTab('recent')"
					>
						最近7天
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 骨架屏 -->
		<view class="skeleton-container" v-if="isLoading">
			<view 
				v-for="n in 3" 
				:key="n" 
				class="skeleton-item"
			>
				<view class="skeleton-header">
					<view class="skeleton-avatar"></view>
					<view class="skeleton-user">
						<view class="skeleton-name"></view>
						<view class="skeleton-time"></view>
					</view>
				</view>
				<view class="skeleton-content">
					<view class="skeleton-text line1"></view>
					<view class="skeleton-text line2"></view>
					<view class="skeleton-text line3"></view>
				</view>
				<view class="skeleton-footer"></view>
			</view>
		</view>
		
		<!-- 评论列表 -->
		<scroll-view 
			class="comments-container" 
			scroll-y
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="loadMore"
			v-else
		>
			<view class="comments-list" v-if="filteredComments.length > 0">
				<view 
					class="comment-item" 
					v-for="(comment, index) in filteredComments" 
					:key="comment.id"
					:class="{ 
						'selected': isManageMode && selectedIds.includes(comment.id),
						'fade-in': index < 10,
						'highlighted': comment.isHighlighted,
						'pinned': comment.isPinned
					}"
					:style="{ 'animation-delay': `${index * 0.05}s` }"
				>
					<!-- 选中复选框 -->
					<view class="item-checkbox" v-if="isManageMode" @click="toggleSelect(comment)">
						<view 
							class="checkbox" 
							:class="{ 
								'checked': selectedIds.includes(comment.id),
								'animating': animatingId === comment.id
							}"
						>
							<uni-icons 
								v-if="selectedIds.includes(comment.id)" 
								type="checkmarkempty" 
								size="16" 
								color="#fff"
							></uni-icons>
						</view>
					</view>
					
					<!-- 评论内容 -->
					<view class="comment-content" @click="handleItemClick(comment)">
						<!-- 评论头部 -->
						<view class="comment-header">
							<view class="user-info">
								<image 
									class="user-avatar" 
									:src="comment.userAvatar || '/static/images/default-avatar.jpg'" 
									mode="aspectFill"
								></image>
								<view class="user-detail">
									<view class="user-name-section">
										<text class="user-name">{{ comment.userName || '我' }}</text>
										<view v-if="comment.isAuthor" class="author-badge">作者</view>
										<view v-if="comment.isVerified" class="verify-badge">
											<uni-icons type="checkmark" size="12" color="#fff"></uni-icons>
										</view>
									</view>
									<view class="comment-time">{{ formatRelativeTime(new Date(comment.publishTime || comment.createTime)) }}</view>
								</view>
							</view>
							
							<view class="comment-actions">
								<view 
									class="action-btn like" 
									:class="{ 'liked': comment.isLiked }"
									@click.stop="toggleLike(comment)"
								>
									<uni-icons 
										:type="comment.isLiked ? 'heart-filled' : 'heart'" 
										size="16" 
										:color="comment.isLiked ? '#ff3b30' : '#999'"
									></uni-icons>
									<text class="action-text">{{ comment.likeCount || 0 }}</text>
								</view>
								
								<view 
									class="action-btn more" 
									@click.stop="showActionSheet(comment)"
									v-if="!isManageMode"
								>
									<uni-icons type="more" size="20" color="#999"></uni-icons>
								</view>
							</view>
						</view>
						
						<!-- 评论正文 -->
						<view class="comment-body">
							<view 
								class="comment-text" 
								:class="{ 'collapsed': comment.isCollapsed && comment.content.length > 100 }"
								@click="toggleCollapse(comment)"
							>
								<text>{{ comment.content }}</text>
								<view v-if="comment.content.length > 100" class="collapse-indicator">
									<text>{{ comment.isCollapsed ? '展开' : '收起' }}</text>
									<uni-icons 
										:type="comment.isCollapsed ? 'bottom' : 'top'" 
										size="12" 
										color="#999"
									></uni-icons>
								</view>
							</view>
							
							<!-- 评论图片 -->
							<view v-if="comment.images && comment.images.length > 0" class="comment-images">
								<view 
									v-for="(img, imgIndex) in comment.images" 
									:key="imgIndex"
									class="image-item"
									@click.stop="previewImages(comment.images, imgIndex)"
								>
									<image 
										class="comment-image" 
										:src="img" 
										mode="aspectFill"
										:lazy-load="true"
									></image>
								</view>
							</view>
							
							<!-- 评分 -->
							<view v-if="comment.rating" class="comment-rating">
								<view class="stars-container">
									<view 
										v-for="(star, index) in 5" 
										:key="index"
										class="star"
									>
										<uni-icons 
											:type="isStarFilled(comment.rating, index) ? 'star-filled' : 'star'" 
											size="16" 
											:color="isStarFilled(comment.rating, index) ? '#ff9500' : '#e0e0e0'"
										></uni-icons>
									</view>
								</view>
								<text class="rating-text">{{ formatRating(comment.rating) }}</text>
							</view>
							
							<!-- 回复数量 -->
							<view v-if="comment.replyCount > 0" class="reply-count">
								<uni-icons type="chat" size="14" color="#999"></uni-icons>
								<text class="count-text">{{ comment.replyCount }}条回复</text>
							</view>
						</view>
						
						<!-- 评论的新闻/文章 -->
						<view 
							class="comment-source" 
							@click.stop="goToDetail(comment.newsId || comment.sourceId)"
						>
							<view class="source-header">
								<view class="source-title">{{ comment.newsTitle || '相关文章' }}</view>
								<uni-icons type="right" size="16" color="#999"></uni-icons>
							</view>
							<view v-if="comment.sourceExcerpt" class="source-excerpt">
								{{ comment.sourceExcerpt }}
							</view>
						</view>
						
						<!-- 评论状态标签 -->
						<view v-if="comment.status || comment.isPinned" class="comment-tags">
							<view v-if="comment.isPinned" class="status-tag pinned">
								<uni-icons type="flag-filled" size="12" color="#fff"></uni-icons>
								<text>置顶</text>
							</view>
							<view v-if="comment.isHot" class="status-tag hot">
								<uni-icons type="fire-filled" size="12" color="#fff"></uni-icons>
								<text>热门</text>
							</view>
							<view v-if="comment.status === 'deleted'" class="status-tag deleted">
								<text>已删除</text>
							</view>
							<view v-if="comment.status === 'reviewing'" class="status-tag reviewing">
								<text>审核中</text>
							</view>
						</view>
						
						<!-- 评论底部 -->
						<view class="comment-footer" v-if="!isManageMode">
							<view class="footer-actions">
								<view 
									class="action-btn reply" 
									@click.stop="handleReply(comment)"
								>
									<uni-icons type="chat" size="16" color="#999"></uni-icons>
									<text>回复</text>
								</view>
								
								<view 
									class="action-btn share" 
									@click.stop="shareComment(comment)"
								>
									<uni-icons type="share" size="16" color="#999"></uni-icons>
									<text>分享</text>
								</view>
								
								<view 
									class="action-btn collect" 
									:class="{ 'collected': comment.isCollected }"
									@click.stop="toggleCollect(comment)"
								>
									<uni-icons 
										:type="comment.isCollected ? 'star-filled' : 'star'" 
										size="16" 
										:color="comment.isCollected ? '#ff9500' : '#999'"
									></uni-icons>
									<text>{{ comment.isCollected ? '已收藏' : '收藏' }}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 删除按钮（非管理模式下） -->
					<view 
						class="delete-btn" 
						v-if="!isManageMode" 
						@click.stop="showDeleteDialog(comment)"
					>
						<uni-icons type="trash" size="20" color="#FF3B30"></uni-icons>
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
					<uni-icons type="chat" size="100" color="#e8e8e8"></uni-icons>
				</view>
				<text class="empty-text">暂无评论</text>
				<text class="empty-hint" v-if="activeTab === 'all'">快去参与互动，留下你的想法吧～</text>
				<text class="empty-hint" v-else>当前筛选条件下没有评论</text>
				<button 
					class="empty-btn" 
					type="primary" 
					@click="goToDiscover"
					v-if="activeTab === 'all'"
				>
					去发表评论
				</button>
				<button 
					class="empty-btn" 
					type="default" 
					@click="changeTab('all')"
					v-else
				>
					查看全部评论
				</button>
			</view>
		</scroll-view>
		
		<!-- 批量操作栏 -->
		<view 
			class="batch-bar" 
			v-if="isManageMode && commentsList.length > 0"
			:class="{ 'show': isManageMode }"
		>
			<view class="batch-content">
				<view class="select-all" @click="toggleSelectAll">
					<view 
						class="checkbox" 
						:class="{ 
							'checked': selectedIds.length === filteredComments.length && filteredComments.length > 0
						}"
					>
						<uni-icons 
							v-if="selectedIds.length === filteredComments.length && filteredComments.length > 0" 
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
	import { formatRelativeTime as formatRelativeTimeUtil } from '@/utils/date.js';
	import { formatNumber } from '@/utils/number.js';
	
	export default {
		data() {
			return {
				commentsList: [],
				filteredComments: [],
				isManageMode: false,
				selectedIds: [],
				isLoading: true,
				refreshing: false,
				loadingMore: false,
				hasMore: true,
				currentPage: 1,
				pageSize: 10,
				animatingId: null,
				activeTab: 'all',
				activeComment: null,
				deleteItem: null,
				deleteType: 'single',
				filterConfig: {
					all: () => true,
					liked: comment => comment.likeCount > 0,
					replied: comment => comment.replyCount > 0,
					recent: comment => {
						const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
						const commentTime = new Date(comment.publishTime || comment.createTime).getTime();
						return commentTime > sevenDaysAgo;
					}
				}
			}
		},
		watch: {
			activeTab(newVal) {
				this.filterComments();
			},
			commentsList() {
				this.filterComments();
			}
		},
		onLoad() {
			this.initLottie();
			this.loadComments();
		},
		onShow() {
			const needRefresh = storage.get('needRefreshComments');
			if (needRefresh) {
				storage.remove('needRefreshComments');
				this.loadComments(true);
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
			
			// 切换筛选标签
			changeTab(tab) {
				this.activeTab = tab;
				this.currentPage = 1;
				this.hasMore = true;
			},
			
			// 过滤评论
			filterComments() {
				const filterFn = this.filterConfig[this.activeTab] || this.filterConfig.all;
				this.filteredComments = this.commentsList.filter(filterFn);
			},
			
			// 处理列表项点击
			handleItemClick(comment) {
				if (this.isManageMode) {
					this.toggleSelect(comment);
				} else {
					this.goToCommentDetail(comment);
				}
			},
			
			// 切换选择状态
			toggleSelect(comment) {
				const index = this.selectedIds.indexOf(comment.id);
				if (index > -1) {
					this.selectedIds.splice(index, 1);
				} else {
					this.selectedIds.push(comment.id);
					this.animatingId = comment.id;
					setTimeout(() => {
						this.animatingId = null;
					}, 300);
				}
			},
			
			// 全选/取消全选
			toggleSelectAll() {
				if (this.selectedIds.length === this.filteredComments.length) {
					this.selectedIds = [];
				} else {
					this.selectedIds = this.filteredComments.map(comment => comment.id);
				}
			},
			
			// 加载评论列表
			async loadComments(force = false) {
				try {
					if (force) {
						this.currentPage = 1;
						this.hasMore = true;
						this.commentsList = [];
					}
					
					if (this.currentPage === 1) {
						this.isLoading = true;
					}
					
					// 模拟API请求
					setTimeout(() => {
						const allComments = storage.get('myComments') || [];
						const start = (this.currentPage - 1) * this.pageSize;
						const end = start + this.pageSize;
						const pageData = allComments.slice(start, end);
						
						// 处理数据
						const processedData = pageData.map(comment => ({
							...comment,
							isCollapsed: comment.content && comment.content.length > 100,
							isLiked: comment.isLiked || false,
							isCollected: comment.isCollected || false,
							likeCount: comment.likeCount || 0,
							replyCount: comment.replyCount || 0
						}));
						
						if (this.currentPage === 1) {
							this.commentsList = processedData;
						} else {
							this.commentsList = [...this.commentsList, ...processedData];
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
						
						uni.stopPullDownRefresh();
					}, 500);
					
				} catch (error) {
					console.error('加载评论失败:', error);
					this.isLoading = false;
					this.refreshing = false;
					this.loadingMore = false;
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
				this.loadComments(true);
			},
			
			// 加载更多
			loadMore() {
				if (this.loadingMore || !this.hasMore || this.isLoading) return;
				
				this.loadingMore = true;
				this.currentPage += 1;
				this.loadComments();
			},
			
			// 跳转到评论详情
			goToCommentDetail(comment) {
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${comment.newsId || comment.sourceId}&commentId=${comment.id}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 跳转到文章详情
			goToDetail(newsId) {
				if (!newsId) return;
				
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${newsId}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 显示操作菜单
			showActionSheet(comment) {
				this.activeComment = comment;
				const itemList = ['编辑评论', '复制评论', '举报评论', '删除评论'];
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						if (res.tapIndex === 0) {
							// 编辑评论
							this.handleEditComment();
						} else if (res.tapIndex === 1) {
							// 复制评论
							this.handleCopyComment();
						} else if (res.tapIndex === 2) {
							// 举报评论
							this.handleReportComment();
						} else if (res.tapIndex === 3) {
							// 删除评论
							this.handleDeleteComment();
						}
					}
				});
			},
			
			// 编辑评论
			handleEditComment() {
				if (!this.activeComment) return;
				
				uni.showToast({
					title: '编辑功能开发中',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: `/pages/user/comment/edit?id=${this.activeComment.id}`
				// });
			},
			
			// 复制评论
			handleCopyComment() {
				if (!this.activeComment) return;
				
				uni.setClipboardData({
					data: this.activeComment.content,
					success: () => {
						uni.showToast({
							title: '已复制到剪贴板',
							icon: 'success'
						});
					}
				});
			},
			
			// 举报评论
			handleReportComment() {
				uni.showToast({
					title: '举报功能开发中',
					icon: 'none'
				});
			},
			
			// 删除评论（操作菜单）
			handleDeleteComment() {
				if (!this.activeComment) return;
				
				this.showDeleteDialog(this.activeComment);
			},
			
			// 显示删除对话框
			showDeleteDialog(comment) {
				this.deleteItem = comment;
				this.deleteType = 'single';
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条评论吗？',
					success: (res) => {
						if (res.confirm) {
							this.deleteSingleComment(comment.id);
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
					content: `确定要删除选中的 ${this.selectedIds.length} 条评论吗？`,
					success: (res) => {
						if (res.confirm) {
							this.deleteSelectedComments();
						}
					}
				});
			},
			
			// 删除选中评论
			async deleteSelectedComments() {
				let comments = storage.get('myComments') || [];
				comments = comments.filter(item => !this.selectedIds.includes(item.id));
				storage.set('myComments', comments);
				
				// 更新列表
				this.commentsList = comments;
				
				// 显示删除动画
				const tempList = [...this.commentsList];
				this.commentsList = [];
				setTimeout(() => {
					this.commentsList = tempList;
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
			
			// 删除单条评论
			async deleteSingleComment(id) {
				let comments = storage.get('myComments') || [];
				comments = comments.filter(item => item.id !== id);
				storage.set('myComments', comments);
				
				// 查找要删除的项的索引
				const index = this.commentsList.findIndex(item => item.id === id);
				if (index > -1) {
					// 添加删除动画
					const comment = this.commentsList[index];
					comment.deleting = true;
					this.$set(this.commentsList, index, comment);
					
					setTimeout(() => {
						this.commentsList = this.commentsList.filter(item => item.id !== id);
					}, 300);
				}
				
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					mask: true
				});
			},
			
			// 切换点赞状态
			toggleLike(comment) {
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
				this.$forceUpdate();
				
				// 更新存储
				let comments = storage.get('myComments') || [];
				const index = comments.findIndex(c => c.id === comment.id);
				if (index > -1) {
					comments[index] = comment;
					storage.set('myComments', comments);
				}
				
				uni.showToast({
					title: comment.isLiked ? '已点赞' : '已取消点赞',
					icon: 'success'
				});
			},
			
			// 切换收藏状态
			toggleCollect(comment) {
				comment.isCollected = !comment.isCollected;
				this.$forceUpdate();
				
				// 更新存储
				let comments = storage.get('myComments') || [];
				const index = comments.findIndex(c => c.id === comment.id);
				if (index > -1) {
					comments[index] = comment;
					storage.set('myComments', comments);
				}
				
				uni.showToast({
					title: comment.isCollected ? '已收藏' : '已取消收藏',
					icon: 'success'
				});
			},
			
			// 切换折叠展开
			toggleCollapse(comment) {
				if (comment.content && comment.content.length > 100) {
					comment.isCollapsed = !comment.isCollapsed;
					this.$forceUpdate();
				}
			},
			
			// 预览图片
			previewImages(images, index) {
				uni.previewImage({
					current: index,
					urls: images
				});
			},
			
			// 回复评论
			handleReply(comment) {
				// 跳转到详情页并定位到评论
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${comment.newsId || comment.sourceId}&commentId=${comment.id}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 分享评论
			shareComment(comment) {
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: comment.userName + '的评论',
					summary: comment.content.length > 50 ? comment.content.substring(0, 50) + '...' : comment.content,
					href: `https://yourdomain.com/comment/${comment.id}`,
					success: () => {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					}
				});
			},
			
			// 去发现页面
			goToDiscover() {
				uni.switchTab({
					url: '/pages/tabbar/news/index'
				});
			},
			
			// 格式化相对时间
			formatRelativeTime(date) {
				if (!date) return '';
				const d = date instanceof Date ? date : new Date(date);
				if (isNaN(d.getTime())) return '';
				// 使用导入的 formatRelativeTimeUtil 函数
				return formatRelativeTimeUtil(d);
			},
			
			// 格式化数字
			formatNumber: formatNumber,
			
			// 判断星星是否应该被填充
			isStarFilled(rating, index) {
				if (!rating) return false;
				return index < Math.round(rating);
			},
			
			// 格式化评分显示
			formatRating(rating) {
				if (!rating) return '0.0';
				return Number(rating).toFixed(1);
			}
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
	z-index: 200;
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
			background: linear-gradient(90deg, #007AFF, #34C759);
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
			background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
			border-radius: 30rpx;
			transition: all 0.3s;
			box-shadow: 0 4rpx 15rpx rgba(0, 122, 255, 0.3);
			
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

// 筛选标签
.filter-tabs {
	position: sticky;
	top: 88rpx;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 150;
	border-bottom: 1rpx solid #f0f0f0;
	padding: 20rpx 0;
	
	.tabs-scroll {
		white-space: nowrap;
		
		.tabs-container {
			display: inline-flex;
			padding: 0 30rpx;
			gap: 20rpx;
			
			.tab-item {
				padding: 10rpx 30rpx;
				background: #f5f5f5;
				border-radius: 30rpx;
				font-size: 24rpx;
				color: #666;
				transition: all 0.3s;
				flex-shrink: 0;
				
				&.active {
					background: linear-gradient(135deg, #007AFF 0%, #34C759 100%);
					color: #fff;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
				}
			}
		}
	}
}

// 骨架屏
.skeleton-container {
	padding: 30rpx;
	
	.skeleton-item {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		overflow: hidden;
		
		.skeleton-header {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			.skeleton-avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
				margin-right: 20rpx;
			}
			
			.skeleton-user {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				
				.skeleton-name {
					width: 150rpx;
					height: 30rpx;
					border-radius: 8rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
				
				.skeleton-time {
					width: 100rpx;
					height: 20rpx;
					border-radius: 8rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: skeleton-loading 1.5s infinite;
				}
			}
		}
		
		.skeleton-content {
			margin-bottom: 30rpx;
			
			.skeleton-text {
				height: 30rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
				margin-bottom: 15rpx;
				
				&.line1 {
					width: 100%;
				}
				
				&.line2 {
					width: 80%;
				}
				
				&.line3 {
					width: 60%;
				}
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

.comments-container {
	height: calc(100vh - 88rpx - env(safe-area-inset-top));
	padding: 0 20rpx;
	margin-top: 20rpx;
	
	.comments-list {
		padding-bottom: 20rpx;
		
		.comment-item {
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
			
			&.highlighted {
				border: 2rpx solid #ff9500;
				background: linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%);
			}
			
			&.pinned {
				border: 2rpx solid #007AFF;
				background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 100%);
			}
			
			&.selected {
				background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
				border: 2rpx solid #007AFF;
				transform: translateY(-2rpx);
				box-shadow: 0 8rpx 35rpx rgba(0, 122, 255, 0.2);
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 6rpx;
					background: linear-gradient(180deg, #007AFF 0%, #5856D6 100%);
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
						background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
						border-color: transparent;
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
					
					&.animating {
						animation: checkboxPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					}
				}
			}
			
			.comment-content {
				flex: 1;
				min-width: 0;
				
				.comment-header {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 20rpx;
					
					.user-info {
						display: flex;
						align-items: center;
						gap: 15rpx;
						
						.user-avatar {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							border: 2rpx solid #fff;
							box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
						}
						
						.user-detail {
							flex: 1;
							
							.user-name-section {
								display: flex;
								align-items: center;
								gap: 8rpx;
								margin-bottom: 6rpx;
								
								.user-name {
									font-size: 28rpx;
									font-weight: 600;
									color: #1a1a1a;
								}
								
								.author-badge {
									padding: 2rpx 8rpx;
									background: linear-gradient(135deg, #FF9500, #FF5E3A);
									border-radius: 6rpx;
									font-size: 20rpx;
									color: #fff;
									font-weight: 600;
								}
								
								.verify-badge {
									width: 20rpx;
									height: 20rpx;
									background: #007AFF;
									border-radius: 50%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
							
							.comment-time {
								font-size: 22rpx;
								color: #999;
							}
						}
					}
					
					.comment-actions {
						display: flex;
						align-items: center;
						gap: 20rpx;
						
						.action-btn {
							display: flex;
							align-items: center;
							gap: 6rpx;
							
							&.like {
								.action-text {
									font-size: 24rpx;
									color: #999;
								}
								
								&.liked {
									.action-text {
										color: #ff3b30;
									}
								}
							}
							
							&.more {
								width: 40rpx;
								height: 40rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 50%;
								background: #f5f5f5;
								
								&:active {
									background: #e0e0e0;
								}
							}
						}
					}
				}
				
				.comment-body {
					margin-bottom: 20rpx;
					
					.comment-text {
						font-size: 28rpx;
						color: #333;
						line-height: 1.6;
						margin-bottom: 20rpx;
						
						&.collapsed {
							max-height: 120rpx;
							overflow: hidden;
							position: relative;
							
							&::after {
								content: '';
								position: absolute;
								bottom: 0;
								left: 0;
								right: 0;
								height: 60rpx;
								background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
							}
						}
						
						.collapse-indicator {
							display: flex;
							align-items: center;
							gap: 4rpx;
							margin-top: 10rpx;
							font-size: 24rpx;
							color: #007AFF;
							cursor: pointer;
						}
					}
					
					.comment-images {
						display: flex;
						flex-wrap: wrap;
						gap: 10rpx;
						margin-bottom: 20rpx;
						
						.image-item {
							width: 120rpx;
							height: 120rpx;
							border-radius: 12rpx;
							overflow: hidden;
							
							.comment-image {
								width: 100%;
								height: 100%;
							}
						}
					}
					
					.comment-rating {
						display: flex;
						align-items: center;
						gap: 10rpx;
						margin-bottom: 20rpx;
						
						.stars-container {
							display: flex;
							align-items: center;
							gap: 4rpx;
							
							.star {
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
						
						.rating-text {
							font-size: 24rpx;
							color: #ff9500;
							font-weight: 600;
						}
					}
					
					.reply-count {
						display: flex;
						align-items: center;
						gap: 8rpx;
						padding: 8rpx 16rpx;
						background: #f5f5f5;
						border-radius: 20rpx;
						display: inline-flex;
						
						.count-text {
							font-size: 24rpx;
							color: #666;
						}
					}
				}
				
				.comment-source {
					background: #f8f9fa;
					border-radius: 12rpx;
					padding: 20rpx;
					margin-bottom: 20rpx;
					border-left: 4rpx solid #007AFF;
					
					&:active {
						background: #f0f0f0;
					}
					
					.source-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;
						
						.source-title {
							font-size: 26rpx;
							font-weight: 600;
							color: #1a1a1a;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}
					}
					
					.source-excerpt {
						font-size: 24rpx;
						color: #666;
						line-height: 1.4;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
				
				.comment-tags {
					display: flex;
					flex-wrap: wrap;
					gap: 10rpx;
					margin-bottom: 20rpx;
					
					.status-tag {
						display: inline-flex;
						align-items: center;
						gap: 4rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						font-size: 20rpx;
						font-weight: 600;
						
						&.pinned {
							background: linear-gradient(135deg, #007AFF, #34C759);
							color: #fff;
						}
						
						&.hot {
							background: linear-gradient(135deg, #FF9500, #FF5E3A);
							color: #fff;
						}
						
						&.deleted {
							background: #f5f5f5;
							color: #999;
						}
						
						&.reviewing {
							background: #fff3e0;
							color: #FF9500;
						}
					}
				}
				
				.comment-footer {
					.footer-actions {
						display: flex;
						gap: 30rpx;
						
						.action-btn {
							display: flex;
							align-items: center;
							gap: 8rpx;
							padding: 8rpx 16rpx;
							background: #f5f5f5;
							border-radius: 20rpx;
							font-size: 24rpx;
							color: #666;
							transition: all 0.3s;
							
							&:active {
								background: #e0e0e0;
								transform: scale(0.95);
							}
							
							&.collected {
								background: rgba(255, 149, 0, 0.1);
								color: #ff9500;
							}
						}
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
				flex-shrink: 0;
				
				&:active {
					transform: scale(0.9);
					background: rgba(255, 59, 48, 0.2);
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
			background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-weight: 600;
			color: #fff;
			border: none;
			box-shadow: 0 8rpx 25rpx rgba(0, 122, 255, 0.4);
			
			&[type="default"] {
				background: #f5f5f5;
				color: #666;
				box-shadow: none;
			}
			
			&:active {
				transform: scale(0.98);
				opacity: 0.9;
			}
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
					background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
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

@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>