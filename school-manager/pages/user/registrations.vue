<!--
 * 文件路径: pages/user/registrations.vue
 * 功能说明: 我的报名页面优化版
 * 优化点：
 *   1. 重构UI设计，采用状态卡片布局
 *   2. 添加报名状态标签和进度指示
 *   3. 支持搜索和筛选报名记录
 *   4. 添加报名详情弹窗
 *   5. 优化取消报名流程
 *   6. 添加报名提醒功能
 *   7. 支持导出报名信息
 *   8. 添加活动日历视图
 *   9. 优化空状态和操作引导
 *   10. 添加分享报名功能
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
			<view class="navbar-title">我的报名</view>
			<view class="navbar-right" v-if="registrationsList.length > 0 && !isLoading">
				<view 
					class="view-toggle" 
					@click="toggleViewMode"
				>
					<uni-icons 
						:type="viewMode === 'list' ? 'calendar' : 'list'" 
						size="20" 
						color="#666"
					></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 搜索和筛选栏 -->
		<view class="search-filter-bar" v-if="registrationsList.length > 0">
			<view class="search-box" v-if="showSearch">
				<uni-search-bar 
					placeholder="搜索报名记录" 
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
			
			<view class="filter-bar" v-else>
				<view class="filter-actions">
					<view class="action-btn" @click="toggleSearch">
						<uni-icons type="search" size="20" color="#666"></uni-icons>
					</view>
					<view class="action-btn" @click="showFilterPanel">
						<uni-icons type="filters" size="20" color="#666"></uni-icons>
						<view class="filter-badge" v-if="activeFilterCount > 0">{{ activeFilterCount }}</view>
					</view>
					<view class="action-btn" @click="handleExport">
						<uni-icons type="download" size="20" color="#666"></uni-icons>
					</view>
				</view>
				
				<view class="status-tabs">
					<scroll-view class="tabs-scroll" scroll-x>
						<view class="tabs-container">
							<view 
								class="tab-item" 
								:class="{ 'active': activeStatus === 'all' }"
								@click="changeStatus('all')"
							>
								全部
							</view>
							<view 
								class="tab-item" 
								:class="{ 'active': activeStatus === 'pending' }"
								@click="changeStatus('pending')"
							>
								待审核
							</view>
							<view 
								class="tab-item" 
								:class="{ 'active': activeStatus === 'approved' }"
								@click="changeStatus('approved')"
							>
								已通过
							</view>
							<view 
								class="tab-item" 
								:class="{ 'active': activeStatus === 'rejected' }"
								@click="changeStatus('rejected')"
							>
								未通过
							</view>
							<view 
								class="tab-item" 
								:class="{ 'active': activeStatus === 'completed' }"
								@click="changeStatus('completed')"
							>
								已结束
							</view>
						</view>
					</scroll-view>
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
				<view class="skeleton-header">
					<view class="skeleton-title"></view>
					<view class="skeleton-status"></view>
				</view>
				<view class="skeleton-content">
					<view class="skeleton-row"></view>
					<view class="skeleton-row"></view>
					<view class="skeleton-row"></view>
				</view>
				<view class="skeleton-footer"></view>
			</view>
		</view>
		
		<!-- 列表视图 -->
		<scroll-view 
			class="registrations-container" 
			scroll-y
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="loadMore"
			v-if="viewMode === 'list' && !isLoading"
		>
			<view class="registrations-list" v-if="filteredRegistrations.length > 0">
				<view 
					class="registration-card" 
					v-for="(item, index) in filteredRegistrations" 
					:key="item.id"
					:class="{
						'fade-in': index < 10,
						[`status-${item.status}`]: true
					}"
					:style="{ 'animation-delay': `${index * 0.05}s` }"
				>
					<!-- 状态标签 -->
					<view class="status-indicator" :class="item.status">
						<view class="status-dot"></view>
						<text class="status-text">{{ getStatusText(item.status) }}</text>
					</view>
					
					<view class="card-header" @click="showDetail(item)">
						<view class="activity-info">
							<view class="activity-title-section">
								<text class="activity-title">{{ item.activityTitle || item.title }}</text>
								<view v-if="item.isFeatured" class="featured-badge">推荐</view>
								<view v-if="item.isHot" class="hot-badge">热门</view>
							</view>
							
							<view class="activity-meta">
								<view class="meta-item">
									<uni-icons type="calendar" size="16" color="#999"></uni-icons>
									<text class="meta-text">{{ formatDate(item.activityTime) }}</text>
								</view>
								<view class="meta-item">
									<uni-icons type="location" size="16" color="#999"></uni-icons>
									<text class="meta-text">{{ item.activityLocation || item.location || '待定' }}</text>
								</view>
							</view>
						</view>
						
						<view class="activity-cover" v-if="item.cover || item.coverImage">
							<image 
								class="cover-image" 
								:src="item.cover || item.coverImage" 
								mode="aspectFill"
								:lazy-load="true"
							></image>
						</view>
					</view>
					
					<!-- 进度条（审核中） -->
					<view v-if="item.status === 'pending'" class="progress-section">
						<view class="progress-header">
							<text class="progress-text">审核进度</text>
							<text class="progress-percent">50%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: '50%' }"></view>
						</view>
						<view class="progress-hint">预计1-2个工作日内完成审核</view>
					</view>
					
					<view class="card-body">
						<view class="info-grid">
							<view class="info-item">
								<view class="info-label">报名时间</view>
								<view class="info-value">{{ formatDateTime(item.registerTime || item.joinTime) }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">报名编号</view>
								<view class="info-value code">{{ item.registrationCode || 'N/A' }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">报名人</view>
								<view class="info-value">{{ item.name }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">联系方式</view>
								<view class="info-value">{{ formatPhone(item.phone) }}</view>
							</view>
							<view class="info-item" v-if="item.className">
								<view class="info-label">班级</view>
								<view class="info-value">{{ item.className }}</view>
							</view>
							<view class="info-item" v-if="item.studentId">
								<view class="info-label">学号</view>
								<view class="info-value">{{ item.studentId }}</view>
							</view>
						</view>
						
						<!-- 额外信息 -->
						<view v-if="item.extraInfo" class="extra-info">
							<view class="extra-label">补充信息</view>
							<view class="extra-content">{{ item.extraInfo }}</view>
						</view>
						
						<!-- 审核意见 -->
						<view v-if="item.reviewComment && item.status === 'rejected'" class="review-comment">
							<view class="comment-label">审核意见</view>
							<view class="comment-content">{{ item.reviewComment }}</view>
						</view>
					</view>
					
					<view class="card-footer">
						<view class="footer-actions">
							<button 
								class="action-btn detail" 
								type="primary" 
								size="mini" 
								@click="viewActivity(item.activityId || item.newsId || item.id)"
							>
								<uni-icons type="eye" size="16" color="#fff"></uni-icons>
								查看活动
							</button>
							
							<button 
								class="action-btn share" 
								type="default" 
								size="mini" 
								@click="shareRegistration(item)"
							>
								<uni-icons type="share" size="16" color="#666"></uni-icons>
								分享
							</button>
							
							<button 
								class="action-btn cancel" 
								type="warn" 
								size="mini" 
								@click="showCancelDialog(item)"
								v-if="item.status === 'pending' || item.status === 'approved'"
							>
								<uni-icons type="close" size="16" color="#fff"></uni-icons>
								取消报名
							</button>
							
							<button 
								class="action-btn remind" 
								type="default" 
								size="mini" 
								@click="setReminder(item)"
								v-if="item.status === 'approved'"
							>
								<uni-icons 
									:type="item.hasReminder ? 'notification-filled' : 'notification'" 
									:size="16" 
									:color="item.hasReminder ? '#FF9500' : '#666'"
								></uni-icons>
								{{ item.hasReminder ? '取消提醒' : '设置提醒' }}
							</button>
							
							<button 
								class="action-btn feedback" 
								type="default" 
								size="mini" 
								@click="giveFeedback(item)"
								v-if="item.status === 'completed'"
							>
								<uni-icons type="chat" size="16" color="#666"></uni-icons>
								评价
							</button>
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
					<uni-icons type="calendar" size="100" color="#e8e8e8"></uni-icons>
				</view>
				<text class="empty-text">暂无报名记录</text>
				<text class="empty-hint" v-if="activeStatus === 'all'">快去报名参加有趣的活动吧！</text>
				<text class="empty-hint" v-else>当前筛选条件下没有报名记录</text>
				<view class="empty-actions">
					<button 
						class="empty-btn" 
						type="primary" 
						@click="goToActivities"
						v-if="activeStatus === 'all'"
					>
						<uni-icons type="plus" size="20" color="#fff"></uni-icons>
						去报名
					</button>
					<button 
						class="empty-btn" 
						type="default" 
						@click="changeStatus('all')"
						v-else
					>
						查看全部
					</button>
				</view>
			</view>
		</scroll-view>
		
		<!-- 日历视图 -->
		<view class="calendar-container" v-if="viewMode === 'calendar' && !isLoading">
			<view class="calendar-header">
				<view class="calendar-title">报名日历</view>
				<view class="calendar-controls">
					<view class="control-btn" @click="prevMonth">
						<uni-icons type="left" size="20" color="#666"></uni-icons>
					</view>
					<view class="current-month">{{ calendar.currentYear }}年{{ calendar.currentMonth }}月</view>
					<view class="control-btn" @click="nextMonth">
						<uni-icons type="right" size="20" color="#666"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="calendar-body">
				<view class="weekdays">
					<view class="weekday" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">{{ day }}</view>
				</view>
				
				<view class="calendar-days">
					<view 
						v-for="(day, index) in calendar.days" 
						:key="index"
						class="calendar-day"
						:class="{
							'current-month': day.isCurrentMonth,
							'today': day.isToday,
							'has-event': day.hasEvent,
							'selected': day.isSelected
						}"
						@click="selectDay(day)"
					>
						<view class="day-number">{{ day.date.getDate() }}</view>
						<view v-if="day.hasEvent" class="event-dots">
							<view 
								v-for="event in day.events" 
								:key="event.id"
								class="event-dot"
								:class="`status-${event.status}`"
							></view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="calendar-events" v-if="selectedDay && selectedDay.events.length > 0">
				<view class="events-title">{{ formatDate(selectedDay.date) }} 的报名</view>
				<view class="events-list">
					<view 
						v-for="event in selectedDay.events" 
						:key="event.id"
						class="event-item"
						@click="showDetail(event)"
					>
						<view class="event-time">{{ formatTime(event.activityTime) }}</view>
						<view class="event-info">
							<view class="event-title">{{ event.activityTitle }}</view>
							<view class="event-status" :class="event.status">{{ getStatusText(event.status) }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="calendar-empty" v-else-if="selectedDay">
				<uni-icons type="calendar" size="60" color="#ccc"></uni-icons>
				<text class="empty-text">这一天没有报名活动</text>
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
					<text class="panel-title">筛选报名</text>
					<view class="panel-close" @click="closeFilterPanel">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>
				
				<view class="panel-content">
					<view class="filter-section">
						<view class="section-title">活动类型</view>
						<view class="type-options">
							<view 
								class="type-option" 
								:class="{ 'active': filters.activityType === 'all' }"
								@click="setFilter('activityType', 'all')"
							>
								全部类型
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filters.activityType === 'lecture' }"
								@click="setFilter('activityType', 'lecture')"
							>
								讲座
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filters.activityType === 'competition' }"
								@click="setFilter('activityType', 'competition')"
							>
								比赛
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filters.activityType === 'party' }"
								@click="setFilter('activityType', 'party')"
							>
								聚会
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': filters.activityType === 'volunteer' }"
								@click="setFilter('activityType', 'volunteer')"
							>
								志愿活动
							</view>
						</view>
					</view>
					
					<view class="filter-section">
						<view class="section-title">时间范围</view>
						<view class="time-options">
							<view 
								class="time-option" 
								:class="{ 'active': filters.timeRange === 'all' }"
								@click="setFilter('timeRange', 'all')"
							>
								全部时间
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filters.timeRange === 'week' }"
								@click="setFilter('timeRange', 'week')"
							>
								本周
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filters.timeRange === 'month' }"
								@click="setFilter('timeRange', 'month')"
							>
								本月
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filters.timeRange === 'future' }"
								@click="setFilter('timeRange', 'future')"
							>
								未来活动
							</view>
							<view 
								class="time-option" 
								:class="{ 'active': filters.timeRange === 'past' }"
								@click="setFilter('timeRange', 'past')"
							>
								已结束
							</view>
						</view>
					</view>
					
					<view class="filter-section">
						<view class="section-title">排序方式</view>
						<view class="sort-options">
							<view 
								class="sort-option" 
								:class="{ 'active': filters.sortBy === 'time' }"
								@click="setFilter('sortBy', 'time')"
							>
								按报名时间
							</view>
							<view 
								class="sort-option" 
								:class="{ 'active': filters.sortBy === 'activityTime' }"
								@click="setFilter('sortBy', 'activityTime')"
							>
								按活动时间
							</view>
							<view 
								class="sort-option" 
								:class="{ 'active': filters.sortBy === 'status' }"
								@click="setFilter('sortBy', 'status')"
							>
								按状态排序
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
		
		<!-- 报名详情弹窗 -->
		<view 
			class="detail-overlay" 
			v-if="showDetailModal"
			@click="closeDetail"
		>
			<view class="detail-modal" v-if="selectedRegistration" @click.stop>
				<view class="modal-header">
					<text class="modal-title">报名详情</text>
					<view class="modal-close" @click="closeDetail">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>
				
				<scroll-view class="modal-content" scroll-y>
					<view class="detail-section">
						<view class="section-title">活动信息</view>
						<view class="activity-card">
							<image 
								v-if="selectedRegistration.cover" 
								class="activity-cover" 
								:src="selectedRegistration.cover" 
								mode="aspectFill"
							></image>
							<view class="activity-info">
								<view class="activity-title">{{ selectedRegistration.activityTitle }}</view>
								<view class="activity-meta">
									<view class="meta-item">
										<uni-icons type="calendar" size="16" color="#666"></uni-icons>
										<text>{{ formatDateTime(selectedRegistration.activityTime) }}</text>
									</view>
									<view class="meta-item">
										<uni-icons type="location" size="16" color="#666"></uni-icons>
										<text>{{ selectedRegistration.activityLocation || '待定' }}</text>
									</view>
									<view class="meta-item">
										<uni-icons type="person" size="16" color="#666"></uni-icons>
										<text>{{ selectedRegistration.organizer || '未知主办方' }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="detail-section">
						<view class="section-title">报名信息</view>
						<view class="info-grid">
							<view class="info-item">
								<view class="info-label">报名状态</view>
								<view class="info-value">
									<view class="status-badge" :class="selectedRegistration.status">
										{{ getStatusText(selectedRegistration.status) }}
									</view>
								</view>
							</view>
							<view class="info-item">
								<view class="info-label">报名编号</view>
								<view class="info-value code">{{ selectedRegistration.registrationCode }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">报名时间</view>
								<view class="info-value">{{ formatDateTime(selectedRegistration.registerTime) }}</view>
							</view>
						</view>
					</view>
					
					<view class="detail-section">
						<view class="section-title">个人信息</view>
						<view class="info-grid">
							<view class="info-item">
								<view class="info-label">姓名</view>
								<view class="info-value">{{ selectedRegistration.name }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">学号</view>
								<view class="info-value">{{ selectedRegistration.studentId }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">班级</view>
								<view class="info-value">{{ selectedRegistration.className }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">联系方式</view>
								<view class="info-value">{{ selectedRegistration.phone }}</view>
							</view>
							<view class="info-item">
								<view class="info-label">邮箱</view>
								<view class="info-value">{{ selectedRegistration.email || '未填写' }}</view>
							</view>
						</view>
					</view>
					
					<view v-if="selectedRegistration.extraInfo" class="detail-section">
						<view class="section-title">补充信息</view>
						<view class="extra-content">{{ selectedRegistration.extraInfo }}</view>
					</view>
					
					<view v-if="selectedRegistration.reviewComment" class="detail-section">
						<view class="section-title">审核意见</view>
						<view class="review-content">{{ selectedRegistration.reviewComment }}</view>
					</view>
				</scroll-view>
				
				<view class="modal-footer">
					<button 
						class="footer-btn secondary" 
						@click="closeDetail"
					>
						关闭
					</button>
					<button 
						class="footer-btn primary" 
						@click="viewActivity(selectedRegistration.activityId)"
					>
						查看活动详情
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
	import { formatDateTime, formatDate, formatTime } from '@/utils/date.js';
	import { debounce } from '@/utils/debounce.js';
	
	export default {
		data() {
			return {
				registrationsList: [],
				filteredRegistrations: [],
				isLoading: true,
				refreshing: false,
				loadingMore: false,
				hasMore: true,
				currentPage: 1,
				pageSize: 10,
				showSearch: false,
				searchKeyword: '',
				viewMode: 'list', // list or calendar
				activeStatus: 'all',
				selectedRegistration: null,
				cancelItem: null,
				showFilterPanel: false,
				showDetailModal: false,
				filters: {
					activityType: 'all',
					timeRange: 'all',
					sortBy: 'time'
				},
				calendar: {
					currentYear: new Date().getFullYear(),
					currentMonth: new Date().getMonth() + 1,
					days: [],
					events: {}
				},
				selectedDay: null,
				statusConfig: {
					pending: { text: '待审核', color: '#FF9500', bgColor: '#fff3e0' },
					approved: { text: '已通过', color: '#34C759', bgColor: '#e8f5e9' },
					rejected: { text: '未通过', color: '#FF3B30', bgColor: '#ffebee' },
					completed: { text: '已结束', color: '#8E8E93', bgColor: '#f5f5f5' },
					cancelled: { text: '已取消', color: '#8E8E93', bgColor: '#f5f5f5' }
				}
			}
		},
		computed: {
			activeFilterCount() {
				let count = 0;
				if (this.filters.activityType !== 'all') count++;
				if (this.filters.timeRange !== 'all') count++;
				if (this.filters.sortBy !== 'time') count++;
				return count;
			}
		},
		watch: {
			activeStatus(newVal) {
				this.filterRegistrations();
			},
			
			searchKeyword(newVal) {
				if (newVal) {
					this.debouncedSearch();
				} else {
					this.filterRegistrations();
				}
			},
			
			registrationsList() {
				this.filterRegistrations();
				if (this.viewMode === 'calendar') {
					this.updateCalendar();
				}
			},
			
			viewMode(newVal) {
				if (newVal === 'calendar') {
					this.updateCalendar();
				}
			}
		},
		created() {
			this.debouncedSearch = debounce(this.handleSearch, 500);
		},
		onLoad() {
			this.initLottie();
			this.loadRegistrations();
		},
		onShow() {
			const needRefresh = storage.get('needRefreshRegistrations');
			if (needRefresh) {
				storage.remove('needRefreshRegistrations');
				this.loadRegistrations(true);
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
				uni.navigateBack();
			},
			
			// 切换视图模式
			toggleViewMode() {
				this.viewMode = this.viewMode === 'list' ? 'calendar' : 'list';
			},
			
			// 切换搜索框
			toggleSearch() {
				this.showSearch = !this.showSearch;
				if (!this.showSearch) {
					this.searchKeyword = '';
					this.filterRegistrations();
				}
			},
			
			// 切换状态筛选
			changeStatus(status) {
				this.activeStatus = status;
			},
			
			// 加载报名记录
			async loadRegistrations(force = false) {
				try {
					if (force) {
						this.currentPage = 1;
						this.hasMore = true;
						this.registrationsList = [];
					}
					
					if (this.currentPage === 1) {
						this.isLoading = true;
					}
					
					// 模拟API请求
					setTimeout(() => {
						const allRegistrations = storage.get('myRegistrations') || [];
						
						// 如果没有数据，生成一些示例数据
						if (allRegistrations.length === 0) {
							this.generateSampleData();
						} else {
							const start = (this.currentPage - 1) * this.pageSize;
							const end = start + this.pageSize;
							const pageData = allRegistrations.slice(start, end);
							
							if (this.currentPage === 1) {
								this.registrationsList = pageData;
							} else {
								this.registrationsList = [...this.registrationsList, ...pageData];
							}
							
							this.hasMore = pageData.length === this.pageSize;
						}
						
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
					console.error('加载报名记录失败:', error);
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
			
			// 生成示例数据
			generateSampleData() {
				const sampleData = [
					{
						id: 1,
						activityId: 101,
						activityTitle: '校园科技节开幕式',
						activityTime: '2024-12-25 14:00:00',
						activityLocation: '学校大礼堂',
						cover: '/static/images/event1.jpg',
						status: 'approved',
						registerTime: '2024-12-20 10:30:00',
						registrationCode: 'REG20241220001',
						name: '张三',
						className: '计算机科学与技术2101班',
						phone: '13800138000',
						studentId: '2021210001',
						organizer: '计算机学院',
						isFeatured: true,
						extraInfo: '我对人工智能特别感兴趣，希望能了解更多相关知识。',
						hasReminder: true
					},
					{
						id: 2,
						activityId: 102,
						activityTitle: '创新创业大赛',
						activityTime: '2024-12-28 09:00:00',
						activityLocation: '创新创业中心',
						cover: '/static/images/event2.jpg',
						status: 'pending',
						registerTime: '2024-12-22 15:20:00',
						registrationCode: 'REG20241222001',
						name: '张三',
						className: '计算机科学与技术2101班',
						phone: '13800138000',
						studentId: '2021210001',
						organizer: '创新创业学院',
						isHot: true
					},
					{
						id: 3,
						activityId: 103,
						activityTitle: '志愿者招募 - 敬老院活动',
						activityTime: '2024-12-30 08:00:00',
						activityLocation: '阳光敬老院',
						cover: '/static/images/event3.jpg',
						status: 'rejected',
						registerTime: '2024-12-18 11:15:00',
						registrationCode: 'REG20241218001',
						name: '张三',
						className: '计算机科学与技术2101班',
						phone: '13800138000',
						studentId: '2021210001',
						organizer: '青年志愿者协会',
						reviewComment: '报名人数已满，欢迎参加下次活动'
					},
					{
						id: 4,
						activityId: 104,
						activityTitle: '英语演讲比赛',
						activityTime: '2024-12-15 13:30:00',
						activityLocation: '外语学院报告厅',
						cover: '/static/images/event4.jpg',
						status: 'completed',
						registerTime: '2024-12-10 09:45:00',
						registrationCode: 'REG20241210001',
						name: '张三',
						className: '计算机科学与技术2101班',
						phone: '13800138000',
						studentId: '2021210001',
						organizer: '外国语学院',
						extraInfo: '我有3年英语学习经验，希望挑战自我'
					},
					{
						id: 5,
						activityId: 105,
						activityTitle: '校园篮球联赛',
						activityTime: '2024-12-29 16:00:00',
						activityLocation: '学校体育馆',
						cover: '/static/images/event5.jpg',
						status: 'approved',
						registerTime: '2024-12-23 14:30:00',
						registrationCode: 'REG20241223001',
						name: '张三',
						className: '计算机科学与技术2101班',
						phone: '13800138000',
						studentId: '2021210001',
						organizer: '体育部',
						hasReminder: false
					}
				];
				
				storage.set('myRegistrations', sampleData);
				this.registrationsList = sampleData;
				this.hasMore = false;
			},
			
			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.loadRegistrations(true);
			},
			
			// 加载更多
			loadMore() {
				if (this.loadingMore || !this.hasMore || this.isLoading) return;
				
				this.loadingMore = true;
				this.currentPage += 1;
				this.loadRegistrations();
			},
			
			// 过滤报名记录
			filterRegistrations() {
				let filtered = [...this.registrationsList];
				
				// 状态筛选
				if (this.activeStatus !== 'all') {
					filtered = filtered.filter(item => item.status === this.activeStatus);
				}
				
				// 搜索筛选
				if (this.searchKeyword) {
					const keyword = this.searchKeyword.toLowerCase();
					filtered = filtered.filter(item => 
						item.activityTitle.toLowerCase().includes(keyword) ||
						(item.organizer && item.organizer.toLowerCase().includes(keyword)) ||
						(item.registrationCode && item.registrationCode.toLowerCase().includes(keyword))
					);
				}
				
				// 应用其他筛选条件
				filtered = this.applyFiltersToData(filtered);
				
				// 排序
				filtered = this.sortRegistrations(filtered);
				
				this.filteredRegistrations = filtered;
			},
			
			// 应用筛选条件
			applyFiltersToData(data) {
				let filtered = [...data];
				const now = new Date();
				
				// 时间范围筛选
				if (this.filters.timeRange !== 'all') {
					switch (this.filters.timeRange) {
						case 'week':
							const weekAgo = new Date(now);
							weekAgo.setDate(weekAgo.getDate() - 7);
							filtered = filtered.filter(item => 
								new Date(item.activityTime) >= weekAgo
							);
							break;
						case 'month':
							const monthAgo = new Date(now);
							monthAgo.setMonth(monthAgo.getMonth() - 1);
							filtered = filtered.filter(item => 
								new Date(item.activityTime) >= monthAgo
							);
							break;
						case 'future':
							filtered = filtered.filter(item => 
								new Date(item.activityTime) >= now
							);
							break;
						case 'past':
							filtered = filtered.filter(item => 
								new Date(item.activityTime) < now
							);
							break;
					}
				}
				
				return filtered;
			},
			
			// 排序报名记录
			sortRegistrations(data) {
				const sorted = [...data];
				
				switch (this.filters.sortBy) {
					case 'time':
						sorted.sort((a, b) => new Date(b.registerTime) - new Date(a.registerTime));
						break;
					case 'activityTime':
						sorted.sort((a, b) => new Date(a.activityTime) - new Date(b.activityTime));
						break;
					case 'status':
						const statusOrder = { 'pending': 0, 'approved': 1, 'rejected': 2, 'completed': 3, 'cancelled': 4 };
						sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
						break;
				}
				
				return sorted;
			},
			
			// 搜索处理
			handleSearch() {
				if (!this.searchKeyword) {
					this.filterRegistrations();
					return;
				}
				
				const keyword = this.searchKeyword.toLowerCase();
				const results = this.registrationsList.filter(item => 
					item.activityTitle.toLowerCase().includes(keyword) ||
					(item.organizer && item.organizer.toLowerCase().includes(keyword)) ||
					(item.registrationCode && item.registrationCode.toLowerCase().includes(keyword))
				);
				
				this.filteredRegistrations = this.applyFiltersToData(results);
			},
			
			// 清除搜索
			clearSearch() {
				this.searchKeyword = '';
				this.showSearch = false;
				this.filterRegistrations();
			},
			
			// 显示筛选面板
			showFilterPanel() {
				this.showFilterPanel = true;
			},
			
			// 关闭筛选面板
			closeFilterPanel() {
				this.showFilterPanel = false;
			},
			
			// 设置筛选条件
			setFilter(key, value) {
				this.filters[key] = value;
			},
			
			// 重置筛选
			resetFilters() {
				this.filters = {
					activityType: 'all',
					timeRange: 'all',
					sortBy: 'time'
				};
			},
			
			// 应用筛选
			applyFilters() {
				this.filterRegistrations();
				this.closeFilterPanel();
			},
			
			// 显示详情
			showDetail(item) {
				this.selectedRegistration = item;
				this.showDetailModal = true;
			},
			
			// 关闭详情
			closeDetail() {
				this.showDetailModal = false;
				this.selectedRegistration = null;
			},
			
			// 查看活动
			viewActivity(activityId) {
				if (!activityId) return;
				
				uni.navigateTo({
					url: `/pages/tabbar/news/subpages/detail/index?id=${activityId}`,
					animationType: 'slide-in-right',
					animationDuration: 300
				});
			},
			
			// 显示取消对话框
			showCancelDialog(item) {
				this.cancelItem = item;
				uni.showModal({
					title: '取消报名',
					content: `确定要取消报名 "${item.activityTitle || item.title}" 吗？`,
					confirmText: '取消报名',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							this.confirmCancel();
						} else {
							this.cancelItem = null;
						}
					}
				});
			},
			
			// 确认取消报名
			async confirmCancel() {
				try {
					if (!this.cancelItem) {
						return;
					}
					
					let registrations = storage.get('myRegistrations') || [];
					const index = registrations.findIndex(item => 
						(item.activityId && item.activityId === this.cancelItem.activityId) ||
						(item.newsId && item.newsId === this.cancelItem.newsId) ||
						(item.id && item.id === this.cancelItem.id)
					);
					
					if (index > -1) {
						// 更新状态为已取消
						registrations[index].status = 'cancelled';
						registrations[index].cancelledTime = new Date().toISOString();
						storage.set('myRegistrations', registrations);
						
						// 更新列表
						this.registrationsList = registrations;
						
						// 显示成功消息
						uni.showToast({
							title: '已取消报名',
							icon: 'success',
							mask: true
						});
					}
					
					this.cancelItem = null;
				} catch (error) {
					console.error('取消报名失败:', error);
					uni.showToast({
						title: '取消报名失败',
						icon: 'none'
					});
					this.cancelItem = null;
				}
			},
			
			// 分享报名
			shareRegistration(item) {
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: `我报名了：${item.activityTitle}`,
					summary: `活动时间：${formatDate(item.activityTime)}`,
					href: `https://yourdomain.com/activity/${item.activityId}`,
					success: () => {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					}
				});
			},
			
			// 设置提醒
			setReminder(item) {
				item.hasReminder = !item.hasReminder;
				this.$forceUpdate();
				
				// 更新存储
				let registrations = storage.get('myRegistrations') || [];
				const index = registrations.findIndex(r => r.id === item.id);
				if (index > -1) {
					registrations[index] = item;
					storage.set('myRegistrations', registrations);
				}
				
				uni.showToast({
					title: item.hasReminder ? '已设置提醒' : '已取消提醒',
					icon: 'success'
				});
				
				// 实际应该调用系统日历API
				if (item.hasReminder) {
					uni.showModal({
						title: '设置提醒',
						content: '将在活动开始前1小时提醒您',
						showCancel: false
					});
				}
			},
			
			// 评价活动
			giveFeedback(item) {
				uni.showToast({
					title: '评价功能开发中',
					icon: 'none'
				});
			},
			
			// 导出报名记录
			handleExport() {
				uni.showLoading({ title: '导出中...' });
				
				setTimeout(() => {
					uni.hideLoading();
					
					const exportData = {
						exportTime: new Date().toISOString(),
						total: this.filteredRegistrations.length,
						data: this.filteredRegistrations
					};
					
					const content = JSON.stringify(exportData, null, 2);
					const fileName = `报名记录_${new Date().getTime()}.json`;
					
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
			
			// 去活动页面
			goToActivities() {
				uni.switchTab({
					url: '/pages/tabbar/news/index'
				});
			},
			
			// 更新日历
			updateCalendar() {
				const year = this.calendar.currentYear;
				const month = this.calendar.currentMonth;
				
				// 生成日历天数
				const firstDay = new Date(year, month - 1, 1);
				const lastDay = new Date(year, month, 0);
				const daysInMonth = lastDay.getDate();
				const firstDayOfWeek = firstDay.getDay();
				
				const days = [];
				
				// 添加上个月的日期
				const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
				for (let i = firstDayOfWeek - 1; i >= 0; i--) {
					const date = new Date(year, month - 2, prevMonthLastDay - i);
					days.push({
						date,
						isCurrentMonth: false,
						isToday: false,
						hasEvent: false,
						events: []
					});
				}
				
				// 添加当前月的日期
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				
				for (let i = 1; i <= daysInMonth; i++) {
					const date = new Date(year, month - 1, i);
					const dateKey = this.formatDateKey(date);
					const events = this.getEventsForDate(date);
					
					days.push({
						date,
						isCurrentMonth: true,
						isToday: date.getTime() === today.getTime(),
						hasEvent: events.length > 0,
						events: events
					});
				}
				
				// 添加下个月的日期
				const totalCells = 42; // 6行 * 7列
				const nextMonthDays = totalCells - days.length;
				for (let i = 1; i <= nextMonthDays; i++) {
					const date = new Date(year, month, i);
					days.push({
						date,
						isCurrentMonth: false,
						isToday: false,
						hasEvent: false,
						events: []
					});
				}
				
				this.calendar.days = days;
			},
			
			// 获取指定日期的活动
			getEventsForDate(date) {
				const dateKey = this.formatDateKey(date);
				const events = [];
				
				this.filteredRegistrations.forEach(registration => {
					if (!registration.activityTime) return;
					
					const eventDate = new Date(registration.activityTime);
					const eventDateKey = this.formatDateKey(eventDate);
					
					if (eventDateKey === dateKey) {
						events.push(registration);
					}
				});
				
				return events;
			},
			
			// 格式化日期键
			formatDateKey(date) {
				return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
			},
			
			// 上个月
			prevMonth() {
				if (this.calendar.currentMonth === 1) {
					this.calendar.currentYear -= 1;
					this.calendar.currentMonth = 12;
				} else {
					this.calendar.currentMonth -= 1;
				}
				this.updateCalendar();
			},
			
			// 下个月
			nextMonth() {
				if (this.calendar.currentMonth === 12) {
					this.calendar.currentYear += 1;
					this.calendar.currentMonth = 1;
				} else {
					this.calendar.currentMonth += 1;
				}
				this.updateCalendar();
			},
			
			// 选择日期
			selectDay(day) {
				this.selectedDay = day;
			},
			
			// 获取状态文本
			getStatusText(status) {
				return this.statusConfig[status]?.text || status;
			},
			
			// 格式化手机号
			formatPhone(phone) {
				if (!phone) return '';
				return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
			
			// 工具函数
			formatDateTime,
			formatDate,
			formatTime
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
			background: linear-gradient(90deg, #34C759, #5AC8FA);
			border-radius: 2rpx;
		}
	}
	
	.navbar-right {
		width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.view-toggle {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			transition: all 0.3s;
			
			&:active {
				background: #f5f5f5;
				transform: scale(0.95);
			}
		}
	}
}

// 搜索和筛选栏
.search-filter-bar {
	position: sticky;
	top: 88rpx;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 250;
	border-bottom: 1rpx solid #f0f0f0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.search-box {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
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
	
	.filter-bar {
		padding: 20rpx 30rpx;
		
		.filter-actions {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 20rpx;
			margin-bottom: 20rpx;
			
			.action-btn {
				position: relative;
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f5f5f5;
				border-radius: 50%;
				
				.filter-badge {
					position: absolute;
					top: -5rpx;
					right: -5rpx;
					min-width: 20rpx;
					height: 20rpx;
					padding: 0 6rpx;
					background: #FF3B30;
					color: #fff;
					border-radius: 10rpx;
					font-size: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				&:active {
					background: #e0e0e0;
					transform: scale(0.95);
				}
			}
		}
		
		.status-tabs {
			.tabs-scroll {
				white-space: nowrap;
				
				.tabs-container {
					display: inline-flex;
					gap: 20rpx;
					padding-bottom: 10rpx;
					
					.tab-item {
						padding: 12rpx 24rpx;
						background: #f5f5f5;
						border-radius: 30rpx;
						font-size: 24rpx;
						color: #666;
						transition: all 0.3s;
						flex-shrink: 0;
						
						&.active {
							background: linear-gradient(135deg, #34C759, #5AC8FA);
							color: #fff;
							font-weight: 600;
							box-shadow: 0 4rpx 12rpx rgba(52, 199, 89, 0.3);
						}
					}
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
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.skeleton-title {
				width: 60%;
				height: 40rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
			}
			
			.skeleton-status {
				width: 80rpx;
				height: 30rpx;
				border-radius: 15rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
			}
		}
		
		.skeleton-content {
			margin-bottom: 20rpx;
			
			.skeleton-row {
				height: 30rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: skeleton-loading 1.5s infinite;
				margin-bottom: 15rpx;
				
				&:last-child {
					width: 80%;
				}
			}
		}
		
		.skeleton-footer {
			height: 40rpx;
			border-radius: 8rpx;
			background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
			background-size: 200% 100%;
			animation: skeleton-loading 1.5s infinite;
		}
	}
}

.registrations-container {
	height: calc(100vh - 88rpx - env(safe-area-inset-top));
	padding: 0 20rpx;
	margin-top: 20rpx;
	
	.registrations-list {
		padding-bottom: 20rpx;
		
		.registration-card {
			background: linear-gradient(135deg, #fff 0%, #fcfcfc 100%);
			border-radius: 24rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 6rpx 30rpx rgba(0, 0, 0, 0.08);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			position: relative;
			overflow: hidden;
			opacity: 0;
			transform: translateY(20rpx);
			
			&.fade-in {
				animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
			}
			
			// 状态样式
			&.status-pending {
				border-left: 6rpx solid #FF9500;
			}
			
			&.status-approved {
				border-left: 6rpx solid #34C759;
			}
			
			&.status-rejected {
				border-left: 6rpx solid #FF3B30;
			}
			
			&.status-completed {
				border-left: 6rpx solid #8E8E93;
			}
			
			.status-indicator {
				position: absolute;
				top: 30rpx;
				right: 30rpx;
				display: flex;
				align-items: center;
				gap: 8rpx;
				padding: 6rpx 12rpx;
				border-radius: 20rpx;
				font-size: 20rpx;
				font-weight: 600;
				z-index: 1;
				
				.status-dot {
					width: 8rpx;
					height: 8rpx;
					border-radius: 50%;
				}
				
				.status-text {
					font-size: 20rpx;
				}
				
				&.pending {
					background: rgba(255, 149, 0, 0.1);
					
					.status-dot {
						background: #FF9500;
					}
					
					.status-text {
						color: #FF9500;
					}
				}
				
				&.approved {
					background: rgba(52, 199, 89, 0.1);
					
					.status-dot {
						background: #34C759;
					}
					
					.status-text {
						color: #34C759;
					}
				}
				
				&.rejected {
					background: rgba(255, 59, 48, 0.1);
					
					.status-dot {
						background: #FF3B30;
					}
					
					.status-text {
						color: #FF3B30;
					}
				}
				
				&.completed, &.cancelled {
					background: #f5f5f5;
					
					.status-dot {
						background: #8E8E93;
					}
					
					.status-text {
						color: #8E8E93;
					}
				}
			}
			
			.card-header {
				margin-bottom: 20rpx;
				cursor: pointer;
				
				.activity-info {
					flex: 1;
					
					.activity-title-section {
						display: flex;
						align-items: center;
						gap: 10rpx;
						margin-bottom: 15rpx;
						
						.activity-title {
							flex: 1;
							font-size: 32rpx;
							font-weight: 700;
							color: #1a1a1a;
							line-height: 1.4;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.featured-badge, .hot-badge {
							padding: 4rpx 12rpx;
							border-radius: 6rpx;
							font-size: 20rpx;
							font-weight: 600;
							color: #fff;
							
							&.featured-badge {
								background: linear-gradient(135deg, #FF9500, #FF5E3A);
							}
							
							&.hot-badge {
								background: linear-gradient(135deg, #FF3B30, #FF3750);
							}
						}
					}
					
					.activity-meta {
						display: flex;
						flex-direction: column;
						gap: 8rpx;
						
						.meta-item {
							display: flex;
							align-items: center;
							gap: 8rpx;
							
							.meta-text {
								font-size: 24rpx;
								color: #666;
							}
						}
					}
				}
				
				.activity-cover {
					width: 120rpx;
					height: 120rpx;
					border-radius: 12rpx;
					overflow: hidden;
					margin-left: 20rpx;
					flex-shrink: 0;
					
					.cover-image {
						width: 100%;
						height: 100%;
					}
				}
			}
			
			.progress-section {
				background: #f8f9fa;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
				
				.progress-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					
					.progress-text {
						font-size: 24rpx;
						color: #666;
					}
					
					.progress-percent {
						font-size: 24rpx;
						color: #FF9500;
						font-weight: 600;
					}
				}
				
				.progress-bar {
					height: 8rpx;
					background: #e0e0e0;
					border-radius: 4rpx;
					overflow: hidden;
					margin-bottom: 8rpx;
					
					.progress-fill {
						height: 100%;
						background: linear-gradient(90deg, #FF9500, #FF5E3A);
						border-radius: 4rpx;
						transition: width 0.3s;
					}
				}
				
				.progress-hint {
					font-size: 20rpx;
					color: #999;
				}
			}
			
			.card-body {
				margin-bottom: 20rpx;
				
				.info-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 15rpx;
					margin-bottom: 20rpx;
					
					.info-item {
						.info-label {
							font-size: 22rpx;
							color: #999;
							margin-bottom: 4rpx;
						}
						
						.info-value {
							font-size: 24rpx;
							color: #333;
							font-weight: 500;
							
							&.code {
								font-family: 'Courier New', monospace;
								color: #666;
								background: #f5f5f5;
								padding: 4rpx 8rpx;
								border-radius: 4rpx;
								display: inline-block;
							}
						}
					}
				}
				
				.extra-info, .review-comment {
					background: #f8f9fa;
					border-radius: 12rpx;
					padding: 20rpx;
					margin-top: 15rpx;
					
					.extra-label, .comment-label {
						font-size: 22rpx;
						color: #666;
						margin-bottom: 8rpx;
						font-weight: 600;
					}
					
					.extra-content, .comment-content {
						font-size: 24rpx;
						color: #333;
						line-height: 1.4;
					}
					
					.comment-content {
						color: #FF3B30;
					}
				}
			}
			
			.card-footer {
				.footer-actions {
					display: flex;
					flex-wrap: wrap;
					gap: 10rpx;
					
					.action-btn {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 6rpx;
						height: 60rpx;
						line-height: 60rpx;
						padding: 0 20rpx;
						border-radius: 30rpx;
						font-size: 24rpx;
						font-weight: 500;
						border: none;
						transition: all 0.3s;
						
						&:active {
							transform: scale(0.95);
						}
						
						&.detail {
							background: linear-gradient(135deg, #34C759, #5AC8FA);
							color: #fff;
						}
						
						&.share {
							background: #f5f5f5;
							color: #666;
						}
						
						&.cancel {
							background: linear-gradient(135deg, #FF6B6B, #ee5a6f);
							color: #fff;
						}
						
						&.remind, &.feedback {
							background: #f5f5f5;
							color: #666;
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
		
		.empty-actions {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			
			.empty-btn {
				width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				font-size: 30rpx;
				font-weight: 600;
				color: #fff;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10rpx;
				
				&[type="primary"] {
					background: linear-gradient(135deg, #34C759, #5AC8FA);
					box-shadow: 0 8rpx 25rpx rgba(52, 199, 89, 0.4);
				}
				
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
}

// 日历视图
.calendar-container {
	padding: 30rpx;
	
	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		
		.calendar-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #1a1a1a;
		}
		
		.calendar-controls {
			display: flex;
			align-items: center;
			gap: 20rpx;
			
			.control-btn {
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
			
			.current-month {
				font-size: 28rpx;
				font-weight: 600;
				color: #333;
				min-width: 200rpx;
				text-align: center;
			}
		}
	}
	
	.calendar-body {
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		
		.weekdays {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			text-align: center;
			margin-bottom: 20rpx;
			
			.weekday {
				font-size: 24rpx;
				color: #666;
				font-weight: 500;
				padding: 10rpx 0;
			}
		}
		
		.calendar-days {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			gap: 10rpx;
			
			.calendar-day {
				aspect-ratio: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 12rpx;
				cursor: pointer;
				transition: all 0.3s;
				
				&.current-month {
					background: #fff;
					
					.day-number {
						color: #333;
					}
				}
				
				&:not(.current-month) {
					background: #f9f9f9;
					
					.day-number {
						color: #ccc;
					}
				}
				
				&.today {
					background: linear-gradient(135deg, #34C759, #5AC8FA);
					
					.day-number {
						color: #fff;
						font-weight: 700;
					}
				}
				
				&.has-event {
					border: 2rpx solid #34C759;
				}
				
				&.selected {
					background: linear-gradient(135deg, #FF9500, #FF5E3A);
					
					.day-number {
						color: #fff;
						font-weight: 700;
					}
				}
				
				&:active {
					transform: scale(0.95);
				}
				
				.day-number {
					font-size: 28rpx;
					font-weight: 500;
				}
				
				.event-dots {
					display: flex;
					justify-content: center;
					gap: 4rpx;
					margin-top: 5rpx;
					
					.event-dot {
						width: 8rpx;
						height: 8rpx;
						border-radius: 50%;
						
						&.status-pending {
							background: #FF9500;
						}
						
						&.status-approved {
							background: #34C759;
						}
						
						&.status-rejected {
							background: #FF3B30;
						}
						
						&.status-completed {
							background: #8E8E93;
						}
					}
				}
			}
		}
	}
	
	.calendar-events {
		margin-top: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		
		.events-title {
			font-size: 28rpx;
			font-weight: 700;
			color: #1a1a1a;
			margin-bottom: 20rpx;
		}
		
		.events-list {
			.event-item {
				display: flex;
				align-items: center;
				padding: 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				cursor: pointer;
				transition: background-color 0.3s;
				
				&:last-child {
					border-bottom: none;
				}
				
				&:active {
					background: #f9f9f9;
				}
				
				.event-time {
					width: 120rpx;
					font-size: 24rpx;
					color: #666;
				}
				
				.event-info {
					flex: 1;
					
					.event-title {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 8rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					
					.event-status {
						display: inline-block;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						font-size: 20rpx;
						font-weight: 600;
						
						&.pending {
							background: rgba(255, 149, 0, 0.1);
							color: #FF9500;
						}
						
						&.approved {
							background: rgba(52, 199, 89, 0.1);
							color: #34C759;
						}
						
						&.rejected {
							background: rgba(255, 59, 48, 0.1);
							color: #FF3B30;
						}
						
						&.completed {
							background: #f5f5f5;
							color: #8E8E93;
						}
					}
				}
			}
		}
	}
	
	.calendar-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
		text-align: center;
		
		.empty-text {
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #ccc;
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
	animation: fadeIn 0.3s;
}

// 筛选面板
.filter-panel {
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	width: 100%;
	max-height: 80vh;
	animation: slideUp 0.3s;
	
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
						background: linear-gradient(135deg, #34C759, #5AC8FA);
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
				background: linear-gradient(135deg, #34C759, #5AC8FA);
				color: #fff;
			}
		}
	}
}

// 详情弹窗遮罩
.detail-overlay {
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
	animation: fadeIn 0.3s;
}

// 详情弹窗
.detail-modal {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	width: 650rpx;
	max-height: 80vh;
	animation: scaleIn 0.3s;
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.modal-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #333;
		}
		
		.modal-close {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #f5f5f5;
		}
	}
	
	.modal-content {
		max-height: 50vh;
		padding: 0 30rpx;
		
		.detail-section {
			margin: 30rpx 0;
			
			.section-title {
				font-size: 28rpx;
				font-weight: 700;
				color: #1a1a1a;
				margin-bottom: 20rpx;
				padding-bottom: 10rpx;
				border-bottom: 2rpx solid #f0f0f0;
			}
			
			.activity-card {
				background: #f8f9fa;
				border-radius: 12rpx;
				overflow: hidden;
				
				.activity-cover {
					width: 100%;
					height: 200rpx;
				}
				
				.activity-info {
					padding: 20rpx;
					
					.activity-title {
						font-size: 28rpx;
						font-weight: 700;
						color: #333;
						margin-bottom: 15rpx;
					}
					
					.activity-meta {
						display: flex;
						flex-direction: column;
						gap: 8rpx;
						
						.meta-item {
							display: flex;
							align-items: center;
							gap: 8rpx;
							font-size: 24rpx;
							color: #666;
						}
					}
				}
			}
			
			.info-grid {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20rpx;
				
				.info-item {
					.info-label {
						font-size: 24rpx;
						color: #999;
						margin-bottom: 8rpx;
					}
					
					.info-value {
						font-size: 24rpx;
						color: #333;
						font-weight: 500;
						
						.code {
							font-family: 'Courier New', monospace;
							background: #f5f5f5;
							padding: 4rpx 8rpx;
							border-radius: 4rpx;
							display: inline-block;
						}
						
						.status-badge {
							display: inline-block;
							padding: 6rpx 12rpx;
							border-radius: 20rpx;
							font-size: 20rpx;
							font-weight: 600;
							
							&.pending {
								background: rgba(255, 149, 0, 0.1);
								color: #FF9500;
							}
							
							&.approved {
								background: rgba(52, 199, 89, 0.1);
								color: #34C759;
							}
							
							&.rejected {
								background: rgba(255, 59, 48, 0.1);
								color: #FF3B30;
							}
							
							&.completed, &.cancelled {
								background: #f5f5f5;
								color: #8E8E93;
							}
						}
					}
				}
			}
			
			.extra-content, .review-content {
				background: #f8f9fa;
				border-radius: 12rpx;
				padding: 20rpx;
				font-size: 24rpx;
				color: #333;
				line-height: 1.4;
			}
			
			.review-content {
				color: #FF3B30;
			}
		}
	}
	
	.modal-footer {
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
			border: none;
			
			&.secondary {
				background: #f5f5f5;
				color: #666;
			}
			
			&.primary {
				background: linear-gradient(135deg, #34C759, #5AC8FA);
				color: #fff;
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

@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
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

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

@keyframes scaleIn {
	from {
		transform: scale(0.9);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}
</style>