<!--
 * 文件路径: pages/user/history.vue
 * 功能说明: 浏览历史页面优化版
 * 优化点：
 *   1. 重构UI设计，采用时间轴布局
 *   2. 添加今日/昨日/更早分组
 *   3. 优化图片懒加载和占位图
 *   4. 添加浏览时长统计
 *   5. 支持搜索历史记录
 *   6. 添加批量导出功能
 *   7. 优化清空历史的确认流程
 *   8. 添加数据统计信息
 *   9. 支持按时间筛选
 *   10. 添加滑动置顶功能
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
			<view class="navbar-title">浏览历史</view>
			<view class="navbar-right" v-if="historyList.length > 0 && !isLoading">
				<view 
					class="manage-btn-wrapper" 
					:class="{ 'active': isManageMode }"
					@click="toggleManageMode"
				>
					<text class="manage-btn">{{ isManageMode ? '完成' : '管理' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 统计信息和搜索栏 -->
		<view class="stats-search-bar" v-if="historyList.length > 0 && !isManageMode">
			<view class="stats-info">
				<view class="stat-item" @click="showFilterPanel">
					<uni-icons type="calendar" size="20" color="#666"></uni-icons>
					<text class="stat-text">{{ formatDateRange }}</text>
					<uni-icons type="bottom" size="12" color="#999"></uni-icons>
				</view>
				<view class="stat-item" @click="showStatsDetail">
					<uni-icons type="eye" size="20" color="#666"></uni-icons>
					<text class="stat-text">{{ totalViewTime }}</text>
				</view>
			</view>
			
			<view class="search-box" v-if="showSearch">
				<uni-search-bar 
					placeholder="搜索浏览历史" 
					v-model="searchKeyword"
					:radius="30"
					@confirm="handleSearch"
					@clear="clearSearch"
					cancel-button="none"
				></uni-search-bar>
				<view class="search-btn" @click="toggleSearch">
					<uni-icons type="close" size="20" color="#999"></uni-icons>
				</view>
			</view>
			
			<view class="quick-actions" v-else>
				<view class="action-btn" @click="toggleSearch">
					<uni-icons type="search" size="20" color="#666"></uni-icons>
				</view>
				<view class="action-btn" @click="showFilterPanel">
					<uni-icons type="filters" size="20" color="#666"></uni-icons>
				</view>
				<view class="action-btn" @click="handleExport">
					<uni-icons type="download" size="20" color="#666"></uni-icons>
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
				<view class="skeleton-time"></view>
				<view class="skeleton-content">
					<view class="skeleton-title"></view>
					<view class="skeleton-meta">
						<view class="skeleton-category"></view>
						<view class="skeleton-duration"></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 历史列表 -->
		<scroll-view 
			class="history-container" 
			scroll-y
			:scroll-top="scrollTop"
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scroll="onScroll"
			@scrolltolower="loadMore"
			v-else
		>
			<!-- 返回顶部按钮 -->
			<view 
				class="back-to-top" 
				v-if="showBackToTop"
				@click="scrollToTop"
			>
				<uni-icons type="top" size="20" color="#fff"></uni-icons>
			</view>
			
			<view class="history-list" v-if="filteredHistory.length > 0">
				<!-- 分组显示 -->
				<block v-for="(group, groupIndex) in groupedHistory" :key="group.date">
					<view class="history-group">
						<view class="group-header" :class="{ 'sticky': activeGroup === group.date }">
							<view class="group-date">
								<text class="date-label">{{ formatGroupDate(group.date) }}</text>
								<text class="count-badge">{{ group.items.length }}条</text>
							</view>
							<view 
								class="group-clear" 
								@click="clearGroupHistory(group.date)"
								v-if="!isManageMode"
							>
								清空
							</view>
						</view>
						
						<view 
							class="history-item" 
							v-for="(item, index) in group.items" 
							:key="item.id"
							:class="{ 
								'selected': isManageMode && selectedIds.includes(item.id),
								'fade-in': index < 10,
								'visited': item.viewDuration > 30
							}"
							:style="{ 'animation-delay': `${index * 0.05}s` }"
							@click="handleItemClick(item)"
						>
							<!-- 时间轴 -->
							<view class="timeline" v-if="!isManageMode">
								<view class="timeline-dot"></view>
								<view class="timeline-line" v-if="index < group.items.length - 1"></view>
							</view>
							
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
							
							<!-- 序号 -->
							<view class="item-number" v-if="!isManageMode && showNumbers">
								<text class="number-text">{{ groupIndex * 20 + index + 1 }}</text>
							</view>
							
							<!-- 内容区域 -->
							<view class="item-content">
								<view class="content-header">
									<text class="item-title">{{ item.title }}</text>
									<view 
										class="favorite-btn" 
										:class="{ 'favorited': item.isCollected }"
										@click.stop="toggleCollection(item)"
									>
										<uni-icons 
											:type="item.isCollected ? 'star-filled' : 'star'" 
											:size="20" 
											:color="item.isCollected ? '#ff9500' : '#ccc'"
										></uni-icons>
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
												'background': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
												'border': 'none',
												'color': '#666',
												'font-weight': 500
											}"
										></uni-tag>
										<text class="meta-text">{{ formatTime(item.viewTime) }}</text>
									</view>
									<view class="meta-right">
										<view class="duration-badge" v-if="item.viewDuration">
											<uni-icons type="clock" size="12" color="#999"></uni-icons>
											<text>{{ formatDuration(item.viewDuration) }}</text>
										</view>
									</view>
								</view>
								
								<view v-if="item.description || item.excerpt" class="item-desc">
									<text>{{ item.description || item.excerpt }}</text>
								</view>
								
								<view class="item-thumbnail" v-if="item.cover || item.coverImage">
									<image 
										class="history-thumb" 
										:src="item.cover || item.coverImage" 
										:lazy-load="true"
										mode="aspectFill"
										@load="onImageLoad(item.id)"
										@error="onImageError(item.id)"
									></image>
									<view v-if="item.video" class="video-badge">
										<uni-icons type="videocam" size="12" color="#fff"></uni-icons>
									</view>
								</view>
								
								<view class="item-footer">
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
								@touchstart="onTouchStart($event, index, group.date)"
								@touchmove="onTouchMove($event, index, group.date)"
								@touchend="onTouchEnd($event, index, group.date)"
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
					</view>
				</block>
				
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
					<uni-icons type="eye" size="100" color="#e8e8e8"></uni-icons>
				</view>
				<text class="empty-text">暂无浏览记录</text>
				<text class="empty-hint" v-if="!searchKeyword">你的浏览足迹会在这里呈现</text>
				<text class="empty-hint" v-else>没有找到相关浏览记录</text>
				<button 
					class="empty-btn" 
					type="primary" 
					@click="goToDiscover"
					v-if="!searchKeyword"
				>
					去发现
				</button>
				<button 
					class="empty-btn" 
					type="default" 
					@click="clearSearch"
					v-else
				>
					清除搜索
				</button>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view 
			class="bottom-bar" 
			v-if="historyList.length > 0"
		>
			<view v-if="!isManageMode" class="bottom-content normal-mode">
				<button 
					class="clear-btn" 
					type="warn" 
					@click="showClearConfirm"
				>
					清空历史记录
				</button>
			</view>
			<view v-else class="bottom-content manage-mode">
				<view class="select-all" @click="toggleSelectAll">
					<view 
						class="checkbox" 
						:class="{ 
							'checked': selectedIds.length === filteredHistory.length && filteredHistory.length > 0
						}"
					>
						<uni-icons 
							v-if="selectedIds.length === filteredHistory.length && filteredHistory.length > 0" 
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
		
		<!-- 筛选面板 -->
		<view 
			class="filter-panel-overlay" 
			v-if="showFilterPanel"
			@click="closeFilterPanel"
		>
			<view class="filter-panel" @click.stop>
				<view class="panel-header">
					<text class="panel-title">筛选浏览历史</text>
					<view class="panel-close" @click="closeFilterPanel">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>
				
				<view class="panel-content">
					<view class="filter-section">
						<view class="section-title">时间范围</view>
						<view class="time-options">
							<view 
								class="time-option" 
								:class="{ 'active': filterTime === 'all' }"
								@click="setFilterTime('all')"
							>
								全部时间
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filterTime === 'today' }"
								@click="setFilterTime('today')"
							>
								今天
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filterTime === 'week' }"
								@click="setFilterTime('week')"
							>
								最近7天
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filterTime === 'month' }"
								@click="setFilterTime('month')"
							>
								最近30天
							</view>
						</view>
					</view>
					
					<view class="filter-section">
						<view class="section-title">内容类型</view>
						<view class="type-options">
							<view 
								class="type-option" 
								:class="{ 'active': filterType === 'all' }"
								@click="setFilterType('all')"
							>
								全部类型
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filterType === 'news' }"
								@click="setFilterType('news')"
							>
								资讯
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filterType === 'video' }"
								@click="setFilterType('video')"
							>
								视频
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filterType === 'article' }"
								@click="setFilterType('article')"
							>
								文章
							</view>
						</view>
					</view>
					
					<view class="filter-section">
						<view class="section-title">排序方式</view>
						<view class="sort-options">
							<view 
								class="sort-option" 
								:class="{ 'active': sortBy === 'time' }"
								@click="setSortBy('time')"
							>
								按时间排序
							</view>
							<view 
								class="sort-option" 
								:class="{ 'active': sortBy === 'duration' }"
								@click="setSortBy('duration')"
							>
								按浏览时长排序
							</view>
							<view 
								class="sort-option" 
								:class="{ 'active': sortBy === 'view' }"
								@click="setSortBy('view')"
							>
								按浏览次数排序
							</view>
						</view>
					</view>
				</view>
				
				<view class="panel-footer">
					<view class="footer-btn reset" @click="resetFilters">重置</view>
					<view class="footer-btn confirm" @click="applyFilters">应用筛选</view>
				</view>
			</view>
		</view>
		
		<!-- 统计详情 -->
		<view 
			class="stats-overlay" 
			v-if="showStatsDetail"
			@click="closeStatsDetail"
		>
			<view class="stats-detail" @click.stop>
				<view class="stats-header">
					<text class="stats-title">浏览统计</text>
					<view class="stats-close" @click="closeStatsDetail">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>
				
				<view class="stats-content">
					<view class="stat-card">
						<view class="stat-icon">
							<uni-icons type="calendar" size="30" color="#007AFF"></uni-icons>
						</view>
						<view class="stat-info">
							<text class="stat-label">累计浏览天数</text>
							<text class="stat-value">{{ stats.days }}天</text>
						</view>
					</view>
					
					<view class="stat-card">
						<view class="stat-icon">
							<uni-icons type="eye" size="30" color="#34C759"></uni-icons>
						</view>
						<view class="stat-info">
							<text class="stat-label">总浏览记录</text>
							<text class="stat-value">{{ stats.total }}条</text>
						</view>
					</view>
					
					<view class="stat-card">
						<view class="stat-icon">
							<uni-icons type="clock" size="30" color="#FF9500"></uni-icons>
						</view>
						<view class="stat-info">
							<text class="stat-label">总浏览时长</text>
							<text class="stat-value">{{ formatTotalDuration(stats.totalDuration) }}</text>
						</view>
					</view>
					
					<view class="stat-card">
						<view class="stat-icon">
							<uni-icons type="star" size="30" color="#FF3B30"></uni-icons>
						</view>
						<view class="stat-info">
							<text class="stat-label">已收藏</text>
							<text class="stat-value">{{ stats.collected }}条</text>
						</view>
					</view>
				</view>
				
				<view class="stats-footer">
					<view class="footer-btn confirm" @click="closeStatsDetail">知道了</view>
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
	import { debounce } from '@/utils/debounce.js';
	
	export default {
		data() {
			return {
				historyList: [],
				filteredHistory: [],
				isManageMode: false,
				selectedIds: [],
				isLoading: true,
				refreshing: false,
				loadingMore: false,
				hasMore: true,
				currentPage: 1,
				pageSize: 20,
				animatingId: null,
				showNumbers: true,
				enableSwipeDelete: true,
				swipeStartX: 0,
				swipeCurrentX: 0,
				activeSwipeIndex: -1,
				activeSwipeGroup: '',
				deleteItem: null,
				deleteType: 'single',
				showSearch: false,
				searchKeyword: '',
				showBackToTop: false,
				scrollTop: 0,
				oldScrollTop: 0,
				activeGroup: '',
				filterTime: 'all',
				filterType: 'all',
				sortBy: 'time',
				showFilterPanel: false,
				showStatsDetail: false,
				stats: {
					days: 0,
					total: 0,
					totalDuration: 0,
					collected: 0
				},
				groupedHistory: []
			}
		},
		computed: {
			
			totalViewTime() {
				const totalMinutes = Math.floor(this.stats.totalDuration / 60);
				if (totalMinutes < 60) {
					return `${totalMinutes}分钟`;
				} else if (totalMinutes < 1440) {
					return `${Math.floor(totalMinutes / 60)}小时`;
				} else {
					return `${Math.floor(totalMinutes / 1440)}天`;
				}
			},
			
			formatDateRange() {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				
				switch (this.filterTime) {
					case 'today':
						return '今天';
					case 'week':
						return '最近7天';
					case 'month':
						return '最近30天';
					default:
						return '全部时间';
				}
			}
		},
		watch: {
			filteredHistory: {
				handler() {
					this.groupHistory();
					this.calculateStats();
				},
				immediate: false
			},
			
			filterTime() {
				this.filterHistory();
			},
			
			filterType() {
				this.filterHistory();
			},
			
			sortBy() {
				this.sortHistory();
			},
			
			searchKeyword(newVal) {
				if (newVal) {
					this.debouncedSearch();
				} else {
					this.filterHistory();
				}
			},
			
			historyList: {
				handler() {
					// 当历史列表变化时，重新过滤
					if (this.historyList.length > 0) {
						this.filterHistory();
					} else {
						this.filteredHistory = [];
						this.groupedHistory = [];
						this.calculateStats();
					}
				},
				immediate: false
			}
		},
		created() {
			// 防抖搜索
			this.debouncedSearch = debounce(this.handleSearch, 500);
		},
		onLoad() {
			this.initLottie();
			this.loadHistory();
		},
		onShow() {
			const needRefresh = storage.get('needRefreshHistory');
			if (needRefresh) {
				storage.remove('needRefreshHistory');
				this.loadHistory(true);
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
					return;
				}
				
				// 检查页面栈
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					});
				} else {
					// 如果没有页面栈，跳转到首页
					uni.switchTab({
						url: '/pages/tabbar/profile/index'
					});
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
				if (this.selectedIds.length === this.filteredHistory.length) {
					this.selectedIds = [];
				} else {
					this.selectedIds = this.filteredHistory.map(item => item.id);
				}
			},
			
			// 加载浏览历史
			async loadHistory(force = false) {
				try {
					if (force) {
						this.currentPage = 1;
						this.hasMore = true;
						this.historyList = [];
						this.filteredHistory = [];
						this.groupedHistory = [];
					}
					
					if (this.currentPage === 1) {
						this.isLoading = true;
					}
					
					// 获取所有浏览历史
					const allHistory = storage.get('browsingHistory') || [];
					
					// 按时间倒序排列（最新的在前）
					allHistory.sort((a, b) => {
						const timeA = typeof a.viewTime === 'number' ? a.viewTime : new Date(a.viewTime).getTime();
						const timeB = typeof b.viewTime === 'number' ? b.viewTime : new Date(b.viewTime).getTime();
						return timeB - timeA;
					});
					
					// 分页处理
					const start = (this.currentPage - 1) * this.pageSize;
					const end = start + this.pageSize;
					const pageData = allHistory.slice(start, end);
					
					if (this.currentPage === 1) {
						this.historyList = pageData;
					} else {
						this.historyList = [...this.historyList, ...pageData];
					}
					
					this.hasMore = pageData.length === this.pageSize && end < allHistory.length;
					
					// 初始化过滤后的历史记录
					if (this.currentPage === 1) {
						this.filterHistory();
					} else {
						// 加载更多时，需要重新过滤和分组
						this.filterHistory();
					}
					
					this.isLoading = false;
					this.refreshing = false;
					this.loadingMore = false;
					
					if (force && this.historyList.length > 0) {
						uni.showToast({
							title: '刷新成功',
							icon: 'success',
							duration: 1500
						});
					}
					
					uni.stopPullDownRefresh();
				} catch (error) {
					console.error('加载历史记录失败:', error);
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
				this.loadHistory(true);
			},
			
			// 加载更多
			loadMore() {
				if (this.loadingMore || !this.hasMore || this.isLoading) return;
				
				this.loadingMore = true;
				this.currentPage += 1;
				this.loadHistory();
			},
			
			// 过滤历史记录
			filterHistory() {
				let filtered = [...this.historyList];
				
				// 时间筛选
				const now = Date.now();
				switch (this.filterTime) {
					case 'today':
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						filtered = filtered.filter(item => {
							const viewTime = typeof item.viewTime === 'number' ? item.viewTime : new Date(item.viewTime).getTime();
							return viewTime >= today.getTime();
						});
						break;
					case 'week':
						const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
						filtered = filtered.filter(item => {
							const viewTime = typeof item.viewTime === 'number' ? item.viewTime : new Date(item.viewTime).getTime();
							return viewTime >= weekAgo;
						});
						break;
					case 'month':
						const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
						filtered = filtered.filter(item => {
							const viewTime = typeof item.viewTime === 'number' ? item.viewTime : new Date(item.viewTime).getTime();
							return viewTime >= monthAgo;
						});
						break;
				}
				
				// 类型筛选
				if (this.filterType !== 'all') {
					filtered = filtered.filter(item => {
						// 支持多种类型字段
						return item.type === this.filterType || 
							   item.category === this.filterType ||
							   (this.filterType === 'news' && !item.type && !item.category);
					});
				}
				
				this.filteredHistory = filtered;
				this.sortHistory();
			},
			
			// 排序历史记录
			sortHistory() {
				const sorted = [...this.filteredHistory];
				
				switch (this.sortBy) {
					case 'time':
						sorted.sort((a, b) => {
							const timeA = typeof a.viewTime === 'number' ? a.viewTime : new Date(a.viewTime).getTime();
							const timeB = typeof b.viewTime === 'number' ? b.viewTime : new Date(b.viewTime).getTime();
							return timeB - timeA; // 最新的在前
						});
						break;
					case 'duration':
						sorted.sort((a, b) => (b.viewDuration || 0) - (a.viewDuration || 0));
						break;
					case 'view':
						sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
						break;
				}
				
				this.filteredHistory = sorted;
			},
			
			// 搜索历史记录
			handleSearch() {
				if (!this.searchKeyword) {
					this.filterHistory();
					return;
				}
				
				const keyword = this.searchKeyword.toLowerCase();
				const results = this.historyList.filter(item => 
					item.title.toLowerCase().includes(keyword) ||
					(item.description && item.description.toLowerCase().includes(keyword)) ||
					(item.category && item.category.toLowerCase().includes(keyword))
				);
				
				this.filteredHistory = results;
			},
			
			// 清除搜索
			clearSearch() {
				this.searchKeyword = '';
				this.showSearch = false;
				this.filterHistory();
			},
			
			// 切换搜索框
			toggleSearch() {
				this.showSearch = !this.showSearch;
				if (!this.showSearch) {
					this.searchKeyword = '';
					this.filterHistory();
				}
			},
			
			// 跳转到详情
			goToDetail(item) {
				// 更新浏览时间
				const now = Date.now();
				const history = storage.get('browsingHistory') || [];
				const index = history.findIndex(h => h.id === item.id);
				if (index > -1) {
					history[index].viewTime = now;
					history[index].viewCount = (history[index].viewCount || 0) + 1;
					storage.set('browsingHistory', history);
				}
				
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
					content: '确定要删除这条历史记录吗？',
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
					content: `确定要删除选中的 ${this.selectedIds.length} 条历史记录吗？`,
					success: (res) => {
						if (res.confirm) {
							this.deleteSelectedItems();
						}
					}
				});
			},
			
			// 删除选中项
			async deleteSelectedItems() {
				let history = storage.get('browsingHistory') || [];
				const deleteCount = this.selectedIds.length;
				history = history.filter(item => !this.selectedIds.includes(item.id));
				storage.set('browsingHistory', history);
				
				// 更新列表
				this.historyList = this.historyList.filter(item => !this.selectedIds.includes(item.id));
				
				// 重新过滤和分组
				this.filterHistory();
				
				// 重置状态
				this.selectedIds = [];
				this.isManageMode = false;
				
				uni.showToast({
					title: `已删除${deleteCount}条记录`,
					icon: 'success',
					duration: 1500
				});
			},
			
			// 删除单条记录
			async deleteSingleItem(id) {
				let history = storage.get('browsingHistory') || [];
				history = history.filter(item => item.id !== id);
				storage.set('browsingHistory', history);
				
				// 从列表中移除
				this.historyList = this.historyList.filter(item => item.id !== id);
				
				// 重新过滤和分组
				this.filterHistory();
				
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500
				});
			},
			
			// 显示清空确认
			showClearConfirm() {
				uni.showModal({
					title: '清空确认',
					content: '确定要清空所有浏览历史吗？此操作不可恢复',
					confirmText: '清空',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							this.handleClearAll();
						}
					}
				});
			},
			
			// 清空所有历史
			handleClearAll() {
				try {
					storage.set('browsingHistory', []);
					this.historyList = [];
					this.filteredHistory = [];
					this.groupedHistory = [];
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
			
			// 清空分组历史
			clearGroupHistory(date) {
				uni.showModal({
					title: '确认清空',
					content: `确定要清空${date}的浏览历史吗？`,
					success: (res) => {
						if (res.confirm) {
							let history = storage.get('browsingHistory') || [];
							history = history.filter(item => {
								// 处理时间戳
								let viewTime;
								if (typeof item.viewTime === 'number') {
									viewTime = new Date(item.viewTime);
								} else if (item.viewTime instanceof Date) {
									viewTime = item.viewTime;
								} else {
									viewTime = new Date(item.viewTime);
								}
								
								if (isNaN(viewTime.getTime())) {
									return true; // 保留无效时间的记录
								}
								
								const itemDate = this.getDateGroup(viewTime);
								return itemDate !== date;
							});
							storage.set('browsingHistory', history);
							
							// 重新加载历史记录
							this.loadHistory(true);
							
							uni.showToast({
								title: '已清空',
								icon: 'success',
								duration: 1500
							});
						}
					}
				});
			},
			
			// 切换收藏状态
			toggleCollection(item) {
				item.isCollected = !item.isCollected;
				this.$forceUpdate();
				
				// 更新存储
				let history = storage.get('browsingHistory') || [];
				const index = history.findIndex(h => h.id === item.id);
				if (index > -1) {
					history[index] = item;
					storage.set('browsingHistory', history);
				}
				
				// 更新收藏列表
				if (item.isCollected) {
					let collections = storage.get('myCollections') || [];
					const exists = collections.find(c => c.id === item.id);
					if (!exists) {
						collections.unshift({
							...item,
							collectTime: Date.now()
						});
						storage.set('myCollections', collections);
					}
				} else {
					let collections = storage.get('myCollections') || [];
					collections = collections.filter(c => c.id !== item.id);
					storage.set('myCollections', collections);
				}
				
				uni.showToast({
					title: item.isCollected ? '已收藏' : '已取消收藏',
					icon: 'success'
				});
			},
			
			// 滑动删除相关
			onTouchStart(e, index, group) {
				this.swipeStartX = e.touches[0].clientX;
				this.activeSwipeIndex = index;
				this.activeSwipeGroup = group;
			},
			
			onTouchMove(e, index, group) {
				if (this.activeSwipeIndex !== index || this.activeSwipeGroup !== group) return;
				
				this.swipeCurrentX = e.touches[0].clientX;
				const diff = this.swipeStartX - this.swipeCurrentX;
				
				if (diff > 0) { // 向左滑动
					const item = this.findHistoryItem(index, group);
					if (item) {
						// 获取系统信息，将px转换为rpx
						const systemInfo = uni.getSystemInfoSync();
						const pxToRpx = 750 / systemInfo.windowWidth;
						const maxOffsetRpx = 80; // 最大滑动80rpx
						const maxOffsetPx = maxOffsetRpx / pxToRpx;
						
						// 存储px值，在模板中转换为rpx
						item.swipeOffset = Math.min(diff, maxOffsetPx);
						this.updateHistoryItem(item, index, group);
					}
				}
			},
			
			onTouchEnd(e, index, group) {
				if (this.activeSwipeIndex !== index || this.activeSwipeGroup !== group) return;
				
				const item = this.findHistoryItem(index, group);
				if (item) {
					const systemInfo = uni.getSystemInfoSync();
					const pxToRpx = 750 / systemInfo.windowWidth;
					const thresholdPx = 40 / pxToRpx; // 40rpx的阈值
					
					if (item.swipeOffset > thresholdPx) {
						// 保持滑动状态
						const maxOffsetRpx = 80;
						item.swipeOffset = maxOffsetRpx / pxToRpx;
						this.updateHistoryItem(item, index, group);
					} else {
						// 恢复原状
						item.swipeOffset = 0;
						this.updateHistoryItem(item, index, group);
					}
				}
				
				this.activeSwipeIndex = -1;
				this.activeSwipeGroup = '';
			},
			
			// 获取滑动偏移量（转换为rpx）
			getSwipeOffsetRpx(item) {
				if (!item || !item.swipeOffset) return 0;
				const systemInfo = uni.getSystemInfoSync();
				const pxToRpx = 750 / systemInfo.windowWidth;
				return item.swipeOffset * pxToRpx;
			},
			
			// 查找历史记录项
			findHistoryItem(index, group) {
				const groupObj = this.groupedHistory.find(g => g.date === group);
				if (groupObj && groupObj.items[index]) {
					return groupObj.items[index];
				}
				return null;
			},
			
			// 更新历史记录项
			updateHistoryItem(item, index, group) {
				const groupIndex = this.groupedHistory.findIndex(g => g.date === group);
				if (groupIndex > -1) {
					this.$set(this.groupedHistory[groupIndex].items, index, item);
				}
			},
			
			// 图片加载完成
			onImageLoad(id) {
				// 可以在这里添加图片加载完成的处理
			},
			
			// 图片加载失败
			onImageError(id) {
				// 可以在这里添加图片加载失败的处理
			},
			
			// 去发现页面
			goToDiscover() {
				uni.switchTab({
					url: '/pages/tabbar/news/index'
				});
			},
			
			// 显示筛选面板
			showFilterPanel() {
				this.showFilterPanel = true;
			},
			
			// 关闭筛选面板
			closeFilterPanel() {
				this.showFilterPanel = false;
			},
			
			// 设置时间筛选
			setFilterTime(time) {
				this.filterTime = time;
			},
			
			// 设置类型筛选
			setFilterType(type) {
				this.filterType = type;
			},
			
			// 设置排序方式
			setSortBy(sort) {
				this.sortBy = sort;
			},
			
			// 重置筛选
			resetFilters() {
				this.filterTime = 'all';
				this.filterType = 'all';
				this.sortBy = 'time';
			},
			
			// 应用筛选
			applyFilters() {
				this.filterHistory();
				this.closeFilterPanel();
			},
			
			// 显示统计详情
			showStatsDetail() {
				this.showStatsDetail = true;
			},
			
			// 关闭统计详情
			closeStatsDetail() {
				this.showStatsDetail = false;
			},
			
			// 计算统计信息
			calculateStats() {
				const stats = {
					days: 0,
					total: this.filteredHistory.length,
					totalDuration: 0,
					collected: 0
				};
				
				const dates = new Set();
				this.filteredHistory.forEach(item => {
					// 处理时间戳
					let viewTime;
					if (typeof item.viewTime === 'number') {
						viewTime = new Date(item.viewTime);
					} else if (item.viewTime instanceof Date) {
						viewTime = item.viewTime;
					} else {
						viewTime = new Date(item.viewTime);
					}
					
					if (!isNaN(viewTime.getTime())) {
						const dateStr = viewTime.toDateString();
						dates.add(dateStr);
					}
					
					if (item.viewDuration) {
						stats.totalDuration += item.viewDuration;
					}
					
					if (item.isCollected) {
						stats.collected += 1;
					}
				});
				
				stats.days = dates.size;
				this.stats = stats;
			},
			
			// 导出历史记录
			handleExport() {
				uni.showLoading({ title: '导出中...' });
				
				setTimeout(() => {
					uni.hideLoading();
					
					const exportData = {
						exportTime: new Date().toISOString(),
						total: this.filteredHistory.length,
						data: this.filteredHistory
					};
					
					const content = JSON.stringify(exportData, null, 2);
					const fileName = `浏览历史_${new Date().getTime()}.json`;
					
					uni.downloadFile({
						url: 'data:text/json;charset=utf-8,' + encodeURIComponent(content),
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (saveRes) => {
										uni.showToast({
											title: '导出成功',
											icon: 'success'
										});
									}
								});
							}
						}
					});
				}, 1000);
			},
			
			// 滚动事件
			onScroll(e) {
				const scrollTop = e.detail.scrollTop;
				
				// 显示/隐藏返回顶部按钮
				if (scrollTop > 300 && !this.showBackToTop) {
					this.showBackToTop = true;
				} else if (scrollTop <= 300 && this.showBackToTop) {
					this.showBackToTop = false;
				}
				
				// 检测当前活动分组
				if (this.groupedHistory.length > 0) {
					let active = '';
					for (let i = 0; i < this.groupedHistory.length; i++) {
						// 这里需要根据实际情况计算分组位置
						if (i === 0) {
							active = this.groupedHistory[0].date;
						}
					}
					this.activeGroup = active;
				}
				
				this.oldScrollTop = scrollTop;
			},
			
			// 滚动到顶部
			scrollToTop() {
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0;
				});
			},
			
			// 分组历史记录
			groupHistory() {
				const groups = {};
				
				this.filteredHistory.forEach(item => {
					// 处理时间戳
					let viewTime;
					if (typeof item.viewTime === 'number') {
						viewTime = new Date(item.viewTime);
					} else if (item.viewTime instanceof Date) {
						viewTime = item.viewTime;
					} else {
						viewTime = new Date(item.viewTime);
					}
					
					// 如果时间无效，跳过
					if (isNaN(viewTime.getTime())) {
						return;
					}
					
					const date = this.getDateGroup(viewTime);
					if (!groups[date]) {
						groups[date] = [];
					}
					groups[date].push(item);
				});
				
				// 转换为数组并按日期排序
				this.groupedHistory = Object.keys(groups)
					.map(date => ({
						date,
						items: groups[date]
					}))
					.sort((a, b) => {
						// 今天 > 昨天 > 更早
						const dateOrder = { '今天': 0, '昨天': 1 };
						const orderA = dateOrder[a.date] !== undefined ? dateOrder[a.date] : 2;
						const orderB = dateOrder[b.date] !== undefined ? dateOrder[b.date] : 2;
						
						if (orderA !== orderB) {
							return orderA - orderB;
						}
						
						// 如果都是更早的日期，按日期倒序排列
						if (orderA === 2 && orderB === 2) {
							// 提取日期中的月份和日期进行比较
							const matchA = a.date.match(/(\d+)月(\d+)日/);
							const matchB = b.date.match(/(\d+)月(\d+)日/);
							if (matchA && matchB) {
								const monthA = parseInt(matchA[1]);
								const dayA = parseInt(matchA[2]);
								const monthB = parseInt(matchB[1]);
								const dayB = parseInt(matchB[2]);
								if (monthA !== monthB) {
									return monthB - monthA; // 月份倒序
								}
								return dayB - dayA; // 日期倒序
							}
						}
						
						return 0;
					});
			},
			
			// 获取日期分组
			getDateGroup(date) {
				if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
					return '更早';
				}
				
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);
				
				const dateOnly = new Date(date);
				dateOnly.setHours(0, 0, 0, 0);
				
				if (dateOnly.getTime() === today.getTime()) {
					return '今天';
				} else if (dateOnly.getTime() === yesterday.getTime()) {
					return '昨天';
				} else {
					// 格式化日期
					const month = date.getMonth() + 1;
					const day = date.getDate();
					return `${month}月${day}日`;
				}
			},
			
			// 格式化分组日期
			formatGroupDate(date) {
				if (date === '今天' || date === '昨天') {
					return date;
				}
				return date;
			},
			
			// 格式化总时长
			formatTotalDuration(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				
				if (hours > 0) {
					return `${hours}小时${minutes}分钟`;
				} else {
					return `${minutes}分钟`;
				}
			},
			
			// 格式化时间（相对时间）
			formatTime(timestamp) {
				if (!timestamp) return '';
				const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
				if (isNaN(d.getTime())) return '';
				return formatRelativeTime(d);
			},
			
			// 格式化数字
			formatNumber: formatNumber,
			
			// 格式化时长
			formatDuration(seconds) {
				if (!seconds || seconds < 0) return '0秒';
				if (seconds < 60) {
					return `${seconds}秒`;
				} else if (seconds < 3600) {
					return `${Math.floor(seconds / 60)}分钟`;
				} else {
					const hours = Math.floor(seconds / 3600);
					const minutes = Math.floor((seconds % 3600) / 60);
					if (minutes > 0) {
						return `${hours}小时${minutes}分钟`;
					}
					return `${hours}小时`;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
// CSS变量定义（在scoped中需要使用:deep或全局定义）
// 注意：在scoped样式中，:root可能不生效，使用page作为根选择器
.page {
	--primary-gradient: linear-gradient(135deg, #FF9500 0%, #FF5E3A 100%);
	--danger-gradient: linear-gradient(135deg, #FF6B6B, #ee5a6f);
	--success-gradient: linear-gradient(135deg, #34C759 0%, #32D74B 100%);
	--nav-height: 88rpx;
	--stats-bar-height: 120rpx;
	--bottom-bar-height: 120rpx;
	
	background: linear-gradient(180deg, #f5f7fa 0%, #f0f2f5 100%);
	min-height: 100vh;
	padding-bottom: calc(var(--bottom-bar-height) + env(safe-area-inset-bottom));
}

.custom-navbar {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	height: var(--nav-height);
	background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	padding-top: env(safe-area-inset-top);
	box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
	z-index: 300; // 最高层级：导航栏
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
				background: rgba(0, 0, 0, 0.4);
				backdrop-filter: blur(10rpx);
				-webkit-backdrop-filter: blur(10rpx);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
			}
			
			&:active .back-btn-inner {
				background: rgba(0, 0, 0, 0.6);
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
			background: var(--primary-gradient);
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
			background: var(--primary-gradient);
			border-radius: 30rpx;
			transition: all 0.3s;
			box-shadow: 0 4rpx 15rpx rgba(255, 149, 0, 0.3);
			
			&:active {
				transform: scale(0.95);
				opacity: 0.9;
			}
			
			&.active {
				background: var(--danger-gradient);
			}
			
			.manage-btn {
				font-size: 28rpx;
				color: #fff;
				font-weight: 600;
			}
		}
	}
}

// 统计和搜索栏
.stats-search-bar {
	position: sticky;
	top: var(--nav-height);
	left: 0;
	right: 0;
	background: #fff;
	z-index: 250; // 第二层级：统计栏
	padding: 20rpx 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.stats-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.stat-item {
			display: flex;
			align-items: center;
			gap: 8rpx;
			padding: 8rpx 16rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			
			.stat-text {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
	
	.search-box {
		display: flex;
		align-items: center;
		gap: 20rpx;
		
		::v-deep .uni-searchbar {
			flex: 1;
		}
		
		.search-btn {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f5f5f5;
			border-radius: 50%;
			
			&:active {
				background: #e0e0e0;
			}
		}
	}
	
	.quick-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 20rpx;
		
		.action-btn {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f5f5f5;
			border-radius: 50%;
			
			&:active {
				background: #e0e0e0;
				transform: scale(0.95);
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
		
		.skeleton-time {
			width: 150rpx;
			height: 30rpx;
			border-radius: 8rpx;
			background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
			background-size: 200% 100%;
			animation: history-skeleton-loading 1.5s infinite;
			margin-bottom: 20rpx;
		}
		
		.skeleton-content {
			.skeleton-title {
				width: 100%;
				height: 40rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: history-skeleton-loading 1.5s infinite;
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
					animation: history-skeleton-loading 1.5s infinite;
				}
				
				.skeleton-duration {
					width: 80rpx;
					height: 30rpx;
					border-radius: 8rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: history-skeleton-loading 1.5s infinite;
				}
			}
		}
	}
}

.history-container {
	height: calc(100vh - var(--nav-height) - var(--stats-bar-height) - var(--bottom-bar-height) - env(safe-area-inset-top));
	padding: 0 20rpx;
	margin-top: 20rpx;
	position: relative;
	// 确保 sticky 定位正常工作
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	
	.back-to-top {
		position: fixed;
		bottom: 200rpx;
		right: 40rpx;
		width: 80rpx;
		height: 80rpx;
		background: var(--primary-gradient);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 25rpx rgba(255, 149, 0, 0.4);
		z-index: 180; // 浮动按钮层级（高于分组标题，低于统计栏）
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.95);
			opacity: 0.9;
		}
	}
	
	.history-list {
		padding-bottom: 20rpx;
		// 确保 sticky 定位的父容器正确
		position: relative;
		
		.history-group {
			margin-bottom: 30rpx;
			// 确保分组容器不会影响 sticky 定位
			position: relative;
			
			.group-header {
				position: sticky;
				top: calc(var(--nav-height) + var(--stats-bar-height)); // 导航栏 + 统计栏高度
				left: 0;
				right: 0;
				background: #fff;
				z-index: 200; // 第三层级：分组标题
				padding: 20rpx 0;
				margin: 0 -20rpx;
				margin-bottom: 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				transition: all 0.3s;
				// 确保始终固定在顶部
				will-change: transform;
				backdrop-filter: blur(10rpx);
				-webkit-backdrop-filter: blur(10rpx);
				// 确保在所有情况下都能固定
				position: -webkit-sticky; // Safari 兼容
				position: sticky;
				
				&.sticky {
					background: rgba(255, 255, 255, 0.98);
					box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
					padding: 20rpx 20rpx;
					margin: 0 -20rpx;
					border-bottom: 2rpx solid #f0f0f0;
				}
				
				.group-date {
					display: flex;
					align-items: center;
					gap: 12rpx;
					flex: 0 1 auto;
					min-width: 0;
					margin-left: 20rpx;
					
					.date-label {
						font-size: 32rpx;
						font-weight: 700;
						color: #1a1a1a;
						line-height: 1.2;
						white-space: nowrap;
						flex-shrink: 0;
					}
					
					.count-badge {
						padding: 4rpx 12rpx;
						background: var(--primary-gradient);
						border-radius: 20rpx;
						font-size: 20rpx;
						color: #fff;
						font-weight: 600;
						line-height: 1.2;
						white-space: nowrap;
						flex-shrink: 0;
					}
				}
				
				.group-clear {
					font-size: 24rpx;
					color: #FF3B30;
					padding: 8rpx 16rpx;
					background: rgba(255, 59, 48, 0.1);
					border-radius: 20rpx;
					flex-shrink: 0;
					white-space: nowrap;
					margin-right: 20rpx;
					
					&:active {
						background: rgba(255, 59, 48, 0.2);
						transform: scale(0.95);
					}
				}
			}
			
			.history-item {
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
				min-height: 200rpx; // 确保最小高度
				
				&.fade-in {
					animation: history-fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				}
				
				&.visited {
					background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
				}
				
				&.selected {
					background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
					border: 2rpx solid #FF9500;
					transform: translateY(-2rpx);
					box-shadow: 0 8rpx 35rpx rgba(255, 149, 0, 0.2);
					
					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						bottom: 0;
						width: 6rpx;
						background: var(--primary-gradient);
						border-radius: 24rpx 0 0 24rpx;
					}
				}
				
				.timeline {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 40rpx;
					flex-shrink: 0;
					
					.timeline-dot {
						width: 12rpx;
						height: 12rpx;
						background: var(--primary-gradient);
						border-radius: 50%;
						border: 2rpx solid #fff;
						box-shadow: 0 0 0 2rpx rgba(255, 149, 0, 0.2);
					}
					
				.timeline-line {
					flex: 1;
					width: 2rpx;
					background: linear-gradient(180deg, rgba(255, 149, 0, 0.6), transparent);
					margin-top: 10rpx;
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
						cursor: pointer;
						
						&.checked {
							background: var(--primary-gradient);
							border-color: transparent;
							animation: history-checkbox-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
						}
						
						&.animating {
							animation: history-checkbox-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
					color: #FF9500;
					flex-shrink: 0;
					background: linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 94, 58, 0.1) 100%);
					border-radius: 12rpx;
					
					.number-text {
						background: var(--primary-gradient);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
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
							line-clamp: 2; // 标准属性，兼容性
							overflow: hidden;
							margin-right: 10rpx;
						}
						
						.favorite-btn {
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
								animation: history-star-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
						
						.meta-right {
							.duration-badge {
								display: flex;
								align-items: center;
								gap: 4rpx;
								padding: 4rpx 12rpx;
								background: #f5f5f5;
								border-radius: 20rpx;
								font-size: 20rpx;
								color: #666;
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
						line-clamp: 2; // 标准属性，兼容性
						overflow: hidden;
						margin-bottom: 15rpx;
					}
					
					.item-thumbnail {
						position: relative;
						margin-bottom: 15rpx;
						
						.history-thumb {
							width: 100%;
							height: 200rpx;
							border-radius: 12rpx;
						}
						
						.video-badge {
							position: absolute;
							top: 10rpx;
							right: 10rpx;
							padding: 4rpx 8rpx;
							background: rgba(0, 0, 0, 0.7);
							border-radius: 4rpx;
							color: #fff;
							font-size: 20rpx;
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
						background: var(--danger-gradient);
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
					background: var(--primary-gradient);
					border-radius: 40rpx;
					font-size: 30rpx;
					font-weight: 600;
					color: #fff;
					border: none;
					box-shadow: 0 8rpx 25rpx rgba(255, 149, 0, 0.4);
					
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
			z-index: 150; // 底部操作栏层级（高于分组标题，低于统计栏）
			
			.bottom-content {
				width: 100%;
				
				&.normal-mode {
					.clear-btn {
						width: 100%;
						height: 80rpx;
						line-height: 80rpx;
						background: var(--danger-gradient);
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
								background: var(--primary-gradient);
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
								background: var(--danger-gradient);
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
		
		// 筛选面板遮罩
		.filter-panel-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 1000;
			display: flex;
			align-items: flex-end;
			animation: panel-fade-in 0.3s;
		}
		
		// 筛选面板
		.filter-panel {
			background: #fff;
			border-radius: 20rpx 20rpx 0 0;
			padding-bottom: env(safe-area-inset-bottom);
			width: 100%;
			max-height: 70vh; // 减少高度，避免遮挡导航栏
			overflow-y: auto;
			animation: panel-slide-up 0.3s;
			
			.panel-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40rpx 30rpx 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				
				.panel-title {
					font-size: 36rpx;
					font-weight: 700;
					color: #333;
				}
				
				.panel-close {
					width: 40rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background: #f5f5f5;
				}
			}
			
			.panel-content {
				padding: 30rpx;
				
				.filter-section {
					margin-bottom: 40rpx;
					
					.section-title {
						font-size: 28rpx;
						font-weight: 600;
						color: #333;
						margin-bottom: 20rpx;
					}
					
					.time-options, .type-options, .sort-options {
						display: flex;
						flex-wrap: wrap;
						gap: 20rpx;
						
						.time-option, .type-option, .sort-option {
							padding: 12rpx 24rpx;
							background: #f5f5f5;
							border-radius: 20rpx;
							font-size: 24rpx;
							color: #666;
							transition: all 0.3s;
							
							&.active {
								background: var(--primary-gradient);
								color: #fff;
								font-weight: 600;
							}
						}
					}
				}
			}
			
			.panel-footer {
				display: flex;
				padding: 20rpx 30rpx;
				border-top: 1rpx solid #f0f0f0;
				gap: 20rpx;
				
				.footer-btn {
					flex: 1;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					border-radius: 40rpx;
					font-size: 28rpx;
					font-weight: 600;
					
					&.reset {
						background: #f5f5f5;
						color: #666;
					}
					
					&.confirm {
						background: var(--primary-gradient);
						color: #fff;
					}
				}
			}
		}
		
		// 统计详情遮罩
		.stats-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;
			animation: panel-fade-in 0.3s;
		}
		
		// 统计详情
		.stats-detail {
			background: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			width: 600rpx;
			animation: panel-scale-in 0.3s;
			
			.stats-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40rpx 30rpx 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				
				.stats-title {
					font-size: 36rpx;
					font-weight: 700;
					color: #333;
				}
				
				.stats-close {
					width: 40rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background: #f5f5f5;
				}
			}
			
			.stats-content {
				padding: 30rpx;
				
				.stat-card {
					display: flex;
					align-items: center;
					gap: 20rpx;
					padding: 30rpx;
					background: #f9f9f9;
					border-radius: 20rpx;
					margin-bottom: 20rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.stat-icon {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #fff;
						border-radius: 50%;
						box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
					}
					
					.stat-info {
						flex: 1;
						
						.stat-label {
							display: block;
							font-size: 24rpx;
							color: #999;
							margin-bottom: 8rpx;
						}
						
						.stat-value {
							font-size: 36rpx;
							font-weight: 700;
							color: #333;
						}
					}
				}
			}
			
			.stats-footer {
				padding: 20rpx 30rpx;
				border-top: 1rpx solid #f0f0f0;
				
				.footer-btn {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background: var(--primary-gradient);
					color: #fff;
					border-radius: 40rpx;
					font-size: 28rpx;
					font-weight: 600;
				}
			}
		}
		
		.safe-area {
			height: env(safe-area-inset-bottom);
		}
		
		// 动画定义（添加前缀避免冲突）
		@keyframes history-fade-in-up {
			from {
				opacity: 0;
				transform: translateY(20rpx);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
		
		@keyframes history-slide-out-left {
			to {
				opacity: 0;
				transform: translateX(-100%);
			}
		}
		
		@keyframes history-checkbox-pop {
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
		
		@keyframes history-star-pop {
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
		
		@keyframes history-skeleton-loading {
			0% {
				background-position: 200% 0;
			}
			100% {
				background-position: -200% 0;
			}
		}
		
		@keyframes panel-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
		
		@keyframes panel-slide-up {
			from {
				transform: translateY(100%);
			}
			to {
				transform: translateY(0);
			}
		}
		
		@keyframes panel-scale-in {
			from {
				transform: scale(0.9);
				opacity: 0;
			}
			to {
				transform: scale(1);
				opacity: 1;
			}
		}
		
		// 响应式设计
		@media (max-width: 375px) {
			.history-item {
				padding: 20rpx;
			}
			
			.item-title {
				font-size: 28rpx;
			}
			
			.group-header {
				padding: 15rpx 0;
				
				.group-date {
					margin-left: 15rpx;
					
					.date-label {
						font-size: 28rpx;
					}
					
					.count-badge {
						font-size: 18rpx;
						padding: 3rpx 10rpx;
					}
				}
				
				.group-clear {
					margin-right: 15rpx;
					font-size: 22rpx;
					padding: 6rpx 12rpx;
				}
			}
		}
	</style>