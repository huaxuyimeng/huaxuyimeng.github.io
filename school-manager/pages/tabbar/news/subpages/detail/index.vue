<template>
	<view class="page">
		<!-- 返回按钮 -->
		<view class="back-button" @click="handleBack">
			<view class="back-button-inner">
				<uni-icons type="left" size="20" color="#fff"></uni-icons>
			</view>
		</view>
		
		<!-- 详情容器 -->
		<view class="detail-container" v-if="newsDetail">
			<!-- 封面图 -->
			<image 
				v-if="newsDetail.cover" 
				:src="newsDetail.cover" 
				class="cover-image" 
				mode="aspectFill"
			></image>
			
			<!-- 信息卡片 -->
			<view class="info-card">
				<view class="news-title">{{ newsDetail.title || '资讯详情' }}</view>
				
				<!-- 标签和状态 -->
				<view class="tags-row" v-if="newsDetail.tag || newsDetail.category">
					<view v-if="newsDetail.tag" class="tag-badge" :class="getTagClass(newsDetail.tag)">
						<uni-icons :type="getTagIcon(newsDetail.tag)" size="14" color="#fff"></uni-icons>
						<text>{{ newsDetail.tag }}</text>
					</view>
					<uni-tag 
						v-if="newsDetail.category" 
						:text="getCategoryName(newsDetail.category)" 
						:type="getCategoryType(newsDetail.category)" 
						size="small"
					></uni-tag>
					<view v-if="newsDetail.isTop || newsDetail.pinned" class="status-tag top">
						<uni-icons type="top" size="12" color="#fff"></uni-icons>
						<text>置顶</text>
					</view>
					<view v-if="newsDetail.isHot || newsDetail.hot" class="status-tag hot">
						<uni-icons type="fire" size="12" color="#fff"></uni-icons>
						<text>热门</text>
					</view>
					<view v-if="newsDetail.isNew || newsDetail.new" class="status-tag new">
						<uni-icons type="sparkles" size="12" color="#fff"></uni-icons>
						<text>最新</text>
					</view>
				</view>
				
				<!-- 信息列表 -->
				<view class="info-list">
					<view class="info-row" v-if="newsDetail.author">
						<text class="info-label">作者</text>
						<view class="info-value">
							<uni-icons type="person" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ newsDetail.author }}</text>
						</view>
					</view>
					<view class="info-row" v-if="newsDetail.publishTime">
						<text class="info-label">发布时间</text>
						<view class="info-value">
							<uni-icons type="calendar" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ formatRelativeTime(newsDetail.publishTime) }}</text>
						</view>
					</view>
					<view class="info-row" v-if="newsDetail.source">
						<text class="info-label">来源</text>
						<view class="info-value">
							<uni-icons type="flag" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ newsDetail.source }}</text>
						</view>
					</view>
					<view class="info-row">
						<text class="info-label">阅读量</text>
						<view class="info-value">
							<uni-icons type="eye" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ formatNumber(newsDetail.viewCount || 0) }}</text>
						</view>
					</view>
					<view class="info-row">
						<text class="info-label">评论数</text>
						<view class="info-value">
							<uni-icons type="chat" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ formatNumber(newsDetail.commentCount || 0) }}</text>
						</view>
					</view>
					<view class="info-row" v-if="newsDetail.likeCount !== undefined">
						<text class="info-label">点赞数</text>
						<view class="info-value">
							<uni-icons type="heart" size="16" color="#666"></uni-icons>
							<text style="margin-left: 10rpx;">{{ formatNumber(newsDetail.likeCount || 0) }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 详情内容 -->
			<view class="description-card" v-if="newsDetail.content">
				<view class="card-title">资讯详情</view>
				<view class="content-body">
					<rich-text 
						:nodes="newsDetail.content" 
						:selectable="true"
					></rich-text>
				</view>
			</view>
			
			<!-- 相关推荐 -->
			<view class="related-card" v-if="relatedNews && relatedNews.length > 0">
				<view class="card-title">相关推荐</view>
				<view class="related-list">
					<view 
						v-for="item in relatedNews" 
						:key="item.id"
						class="related-item"
						@click="navigateToRelated(item.id)"
					>
						<image 
							v-if="item.cover" 
							:src="item.cover" 
							class="related-image" 
							mode="aspectFill"
						></image>
						<view class="related-content">
							<view class="related-title">{{ item.title || '相关资讯' }}</view>
							<view class="related-meta">
								<text v-if="item.publishTime">{{ formatRelativeTime(item.publishTime) }}</text>
								<text v-if="item.publishTime && item.viewCount"> · </text>
								<text v-if="item.viewCount">{{ formatNumber(item.viewCount) }}阅读</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 评论区 -->
			<view class="comment-card">
				<view class="card-title">评论 ({{ commentStats.total || 0 }})</view>
				
				<!-- 评论排序 -->
				<view class="comment-sort">
					<view 
						v-for="sort in sortOptions" 
						:key="sort.value"
						class="sort-item"
						:class="{ active: currentSort === sort.value }"
						@click="changeSort(sort.value)"
					>
						{{ sort.label }}
					</view>
				</view>
				
				<!-- 评论列表 -->
				<view class="comment-list" v-if="comments && comments.length > 0">
					<view 
						v-for="comment in comments" 
						:key="comment.id"
						class="comment-item"
						:class="{ 
							'hot-comment': comment.isHot,
							'author-comment': comment.isAuthor
						}"
					>
						<view class="comment-main">
							<image 
								:src="comment.avatar || '/static/images/avatar-default.png'" 
								class="comment-avatar"
								mode="aspectFill"
							/>
							<view class="comment-content">
								<view class="comment-header">
									<view class="user-info">
										<text class="username">{{ comment.username || '匿名用户' }}</text>
										<view v-if="comment.isAuthor" class="user-badge author">作者</view>
										<view v-if="comment.isHot" class="user-badge hot">热评</view>
										<view v-if="comment.isTop" class="user-badge top">置顶</view>
									</view>
									<view class="comment-meta">
										<text class="comment-time" v-if="comment.createTime">
											{{ formatRelativeTime(comment.createTime) }}
										</text>
										<text v-if="comment.floor" class="comment-floor">#{{ comment.floor }}</text>
									</view>
								</view>
								
								<view class="comment-text">{{ comment.content || '暂无内容' }}</view>
								
								<!-- 评论操作 -->
								<view class="comment-actions">
									<view 
										class="action-btn like"
										:class="{ liked: comment.liked }"
										@click="toggleCommentLike(comment)"
									>
										<uni-icons 
											:type="comment.liked ? 'heart-filled' : 'heart'" 
											size="16" 
											:color="comment.liked ? '#ff3b30' : '#999'"
										></uni-icons>
										<text class="action-count">{{ comment.likeCount || 0 }}</text>
									</view>
									<view class="action-btn reply" @click="handleReply(comment)">
										<uni-icons type="chat" size="16" color="#999"></uni-icons>
										<text class="action-count">{{ comment.replyCount || 0 }}</text>
									</view>
									<view class="action-btn report" @click="handleReport(comment)">
										<uni-icons type="flag" size="16" color="#999"></uni-icons>
										<text class="action-count">举报</text>
									</view>
								</view>
								
								<!-- 回复列表 -->
								<view v-if="comment.replies && comment.replies.length > 0" class="reply-list">
									<view 
										v-for="reply in comment.replies" 
										:key="reply.id"
										class="reply-item"
									>
										<text class="reply-name">{{ reply.username }}</text>
										<text v-if="reply.isAuthor" class="reply-badge">作者</text>
										<text class="reply-text">：{{ reply.content }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 空状态 -->
				<view v-else class="empty-comments">
					<uni-icons type="chatbubble" size="60" color="#ccc"></uni-icons>
					<text class="empty-text">暂无评论，快来发表第一条评论吧～</text>
				</view>
			</view>
		</view>
		
		<!-- 加载失败提示 -->
		<view v-if="!newsDetail && !loading" class="error-container">
			<uni-icons type="info" size="60" color="#ccc"></uni-icons>
			<text class="error-text">加载失败，请稍后重试</text>
			<button class="retry-btn" @click="loadNewsDetail">重新加载</button>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar" v-if="newsDetail">
			<!-- 操作按钮组 -->
			<view class="action-buttons">
				<view 
					class="action-btn like"
					:class="{ liked: isLiked }"
					@click="handleLike"
				>
					<image 
						class="action-icon" 
						:src="isLiked ? '/static/icons/action/like-active.svg' : '/static/icons/action/like.svg'"
						mode="aspectFit"
					></image>
					<text class="action-label">{{ newsDetail.likeCount || 0 }}</text>
				</view>
				<view 
					class="action-btn comment"
					@click="scrollToComments"
				>
					<image 
						class="action-icon" 
						src="/static/icons/action/comment.svg"
						mode="aspectFit"
					></image>
					<text class="action-label">评论 {{ newsDetail.commentCount || 0 }}</text>
				</view>
				<view 
					class="action-btn collect"
					:class="{ collected: isCollected }"
					@click="handleCollect"
				>
					<image 
						class="action-icon" 
						:src="isCollected ? '/static/icons/action/collect-active.svg' : '/static/icons/action/collect.svg'"
						mode="aspectFit"
					></image>
					<text class="action-label">收藏</text>
				</view>
				<view class="action-btn share" @click="handleShare">
					<image 
						class="action-icon" 
						src="/static/icons/action/share.svg"
						mode="aspectFit"
					></image>
					<text class="action-label">分享</text>
				</view>
			</view>
			
			<!-- 评论输入区域 -->
			<view class="comment-input-area">
				<view class="input-wrapper" @click="showCommentInput = true">
					<uni-icons type="compose" size="18" color="#999"></uni-icons>
					<text class="input-placeholder">写评论...</text>
				</view>
				<button 
					class="send-btn" 
					@click="showCommentInput = true"
					:disabled="!newsDetail"
				>
					发送
				</button>
			</view>
		</view>
		
		<!-- 评论输入框 -->
		<CommentInput 
			v-model:visible="showCommentInput"
			:replyComment="replyComment"
			@submit="handleCommentSubmit"
			@cancel-reply="replyComment = null"
		/>
	</view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { formatRelativeTime as formatTime } from '@/utils/date'
import { formatNumber as formatNum } from '@/utils/number'
import interactionSync, { getAvatarByUserId } from '@/utils/interaction-sync.js'
import CommentInput from './CommentInput.vue'

export default {
	components: {
		CommentInput
	},
	setup() {
		const newsId = ref('')
		const newsDetail = ref(null)
		const relatedNews = ref([])
		const loading = ref(false)
		const isLiked = ref(false)
		const isCollected = ref(false)
		const showCommentInput = ref(false)
		const comments = ref([])
		const commentStats = ref({ total: 0, hot: 0, new: 0, author: 0 })
		const currentSort = ref('hot')
		const replyComment = ref(null)
		const sortOptions = [
			{ value: 'hot', label: '热门' },
			{ value: 'time', label: '最新' },
			{ value: 'author', label: '作者' }
		]
		
		// 加载新闻详情
		const loadNewsDetail = async () => {
			try {
				loading.value = true
				uni.showLoading({ title: '加载中...' })
				
				// 直接使用 mock 数据
				const newsMock = await import('@/mock/modules/news.js')
				const detail = newsMock.getNewsDetail(parseInt(newsId.value))
				
				if (detail) {
					newsDetail.value = detail
					
					// 从 storage 读取点赞和收藏状态
					isLiked.value = interactionSync.getNewsLikeStatus(parseInt(newsId.value))
					isCollected.value = interactionSync.getNewsCollectStatus(parseInt(newsId.value))
					
					// 读取存储的点赞数和评论数
					const storedLikeCount = interactionSync.getNewsLikeCount(parseInt(newsId.value))
					const storedCommentCount = interactionSync.getNewsCommentCount(parseInt(newsId.value))
					if (storedLikeCount > 0) {
						newsDetail.value.likeCount = storedLikeCount
					}
					if (storedCommentCount > 0) {
						newsDetail.value.commentCount = storedCommentCount
					}
					
					// 记录浏览历史
					interactionSync.addToHistory(detail)
				} else {
					throw new Error('数据不存在')
				}
				
				uni.hideLoading()
			} catch (error) {
				console.error('加载失败:', error)
				uni.hideLoading()
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				loading.value = false
			}
		}
		
		// 加载相关推荐
		const loadRelatedNews = async () => {
			try {
				const newsMock = await import('@/mock/modules/news.js')
				const response = newsMock.getRelatedNews(parseInt(newsId.value))
				relatedNews.value = response.list || []
			} catch (error) {
				console.error('加载相关推荐失败:', error)
				relatedNews.value = []
			}
		}
		
		
		// 点赞
		const handleLike = async () => {
			if (!newsDetail.value) return
			
			try {
				const originalLiked = isLiked.value
				const originalCount = newsDetail.value.likeCount || 0
				
				// 乐观更新
				isLiked.value = !isLiked.value
				newsDetail.value.likeCount = originalCount + (isLiked.value ? 1 : -1)
				
				// 同步到 storage
				interactionSync.setNewsLikeStatus(parseInt(newsId.value), isLiked.value)
				interactionSync.updateNewsLikeCount(parseInt(newsId.value), isLiked.value ? 1 : -1)
				
				// 调用 mock API
				try {
					const newsMock = await import('@/mock/modules/news.js')
					if (isLiked.value && newsMock.likeNews) {
						await newsMock.likeNews(parseInt(newsId.value))
					} else if (!isLiked.value && newsMock.unlikeNews) {
						await newsMock.unlikeNews(parseInt(newsId.value))
					}
				} catch (error) {
					console.warn('点赞 API 调用失败:', error)
				}
				
				uni.showToast({
					title: isLiked.value ? '已点赞' : '已取消点赞',
					icon: 'success'
				})
			} catch (error) {
				console.error('点赞失败:', error)
				// 回滚状态
				isLiked.value = !isLiked.value
				newsDetail.value.likeCount = (newsDetail.value.likeCount || 0) + (isLiked.value ? -1 : 1)
			}
		}
		
		// 收藏
		const handleCollect = async () => {
			if (!newsDetail.value) return
			
			const originalCollected = isCollected.value
			isCollected.value = !isCollected.value
			
			// 同步到 storage
			interactionSync.setNewsCollectStatus(parseInt(newsId.value), isCollected.value)
			
			if (isCollected.value) {
				// 添加到收藏列表
				interactionSync.addToCollections(newsDetail.value)
			} else {
				// 从收藏列表移除
				interactionSync.removeFromCollections(parseInt(newsId.value))
			}
			
			// 调用 mock API
			try {
				const newsMock = await import('@/mock/modules/news.js')
				if (isCollected.value && newsMock.favoriteNews) {
					newsMock.favoriteNews(parseInt(newsId.value))
				} else if (!isCollected.value && newsMock.unfavoriteNews) {
					newsMock.unfavoriteNews(parseInt(newsId.value))
				}
			} catch (error) {
				console.warn('收藏 API 调用失败:', error)
			}
			
			uni.showToast({
				title: isCollected.value ? '已收藏' : '已取消收藏',
				icon: 'success'
			})
		}
		
		// 分享
		const handleShare = () => {
			uni.showToast({
				title: '分享功能',
				icon: 'none'
			})
		}
		
		// 加载评论
		const loadComments = async () => {
			try {
				// 优先从 storage 读取评论
				let storedComments = interactionSync.getNewsComments(parseInt(newsId.value))
				
				// 如果 storage 中没有，从 mock 加载
				if (!storedComments || storedComments.length === 0) {
					const newsMock = await import('@/mock/modules/news.js')
					const response = newsMock.getComments(parseInt(newsId.value))
					
					if (response && response.list) {
						storedComments = response.list
						// 为每个评论设置点赞状态
						storedComments.forEach(comment => {
							comment.liked = interactionSync.getCommentLikeStatus(comment.id)
						})
						// 保存到 storage
						interactionSync.saveNewsComments(parseInt(newsId.value), storedComments)
					}
				} else {
					// 从 storage 读取时，确保点赞状态正确
					storedComments.forEach(comment => {
						comment.liked = interactionSync.getCommentLikeStatus(comment.id)
					})
				}
				
				if (storedComments && storedComments.length > 0) {
					// 根据排序方式处理
					let sortedComments = [...storedComments]
					if (currentSort.value === 'hot') {
						sortedComments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
					} else if (currentSort.value === 'time') {
						sortedComments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
					} else if (currentSort.value === 'author') {
						sortedComments = sortedComments.filter(c => c.isAuthor)
					}
					
					comments.value = sortedComments
					commentStats.value = {
						total: storedComments.length,
						hot: storedComments.filter(c => c.isHot).length,
						new: storedComments.filter(c => !c.isHot && !c.isAuthor).length,
						author: storedComments.filter(c => c.isAuthor).length
					}
				} else {
					comments.value = []
					commentStats.value = { total: 0, hot: 0, new: 0, author: 0 }
				}
			} catch (error) {
				console.error('加载评论失败:', error)
				comments.value = []
			}
		}
		
		// 切换排序
		const changeSort = (sort) => {
			currentSort.value = sort
			loadComments()
		}
		
		// 提交评论
		const handleCommentSubmit = async (content) => {
			if (!content || !content.trim()) return
			
			try {
				// 获取当前用户信息
				const userInfo = uni.getStorageSync('userInfo') || {}
				
				// 创建新评论
				const newComment = {
					id: Date.now(),
					newsId: parseInt(newsId.value),
					userId: userInfo.id || 'currentUser',
					username: userInfo.nickname || userInfo.username || '我',
					avatar: userInfo.avatar || getAvatarByUserId(userInfo.id || 'currentUser'),
					content: content.trim(),
					createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
					likeCount: 0,
					replyCount: 0,
					liked: false,
					isHot: false,
					isAuthor: false,
					isTop: false,
					floor: comments.value.length + 1,
					newsTitle: newsDetail.value?.title || '',
					sourceId: parseInt(newsId.value)
				}
				
				// 如果是回复，添加到父评论的回复列表
				if (replyComment.value) {
					const parentComment = comments.value.find(c => c.id === replyComment.value.id)
					if (parentComment) {
						if (!parentComment.replies) {
							parentComment.replies = []
						}
						parentComment.replies.push(newComment)
						parentComment.replyCount = (parentComment.replyCount || 0) + 1
					}
					replyComment.value = null
				} else {
					// 添加到评论列表开头
					comments.value.unshift(newComment)
				}
				
				// 保存到 storage
				interactionSync.addComment(parseInt(newsId.value), newComment)
				
				// 更新评论数
				newsDetail.value.commentCount = (newsDetail.value.commentCount || 0) + 1
				commentStats.value.total = (commentStats.value.total || 0) + 1
				interactionSync.updateNewsCommentCount(parseInt(newsId.value), 1)
				
				uni.showToast({
					title: '评论成功',
					icon: 'success'
				})
				showCommentInput.value = false
			} catch (error) {
				console.error('评论失败:', error)
				uni.showToast({
					title: '评论失败',
					icon: 'none'
				})
			}
		}
		
		// 点赞评论
		const toggleCommentLike = (comment) => {
			if (!comment) return
			
			const originalLiked = comment.liked
			const originalCount = comment.likeCount || 0
			
			// 乐观更新
			comment.liked = !comment.liked
			comment.likeCount = originalCount + (comment.liked ? 1 : -1)
			
			// 同步到 storage
			interactionSync.setCommentLikeStatus(comment.id, comment.liked)
			interactionSync.updateCommentLike(comment.id, comment.liked, parseInt(newsId.value))
			
			uni.showToast({
				title: comment.liked ? '已点赞' : '已取消点赞',
				icon: 'success',
				duration: 1000
			})
		}
		
		// 回复评论
		const handleReply = (comment) => {
			replyComment.value = comment
			showCommentInput.value = true
		}
		
		// 举报评论
		const handleReport = (comment) => {
			uni.showModal({
				title: '举报评论',
				content: '确定要举报这条评论吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '举报成功',
							icon: 'success'
						})
					}
				}
			})
		}
		
		// 导航到相关新闻
		const navigateToRelated = (id) => {
			uni.navigateTo({
				url: `/pages/tabbar/news/subpages/detail/index?id=${id}`
			})
		}
		
		// 返回
		const handleBack = () => {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({ url: '/pages/tabbar/news' })
			}
		}
		
		// 滚动到评论区
		const scrollToComments = () => {
			uni.pageScrollTo({
				selector: '.comment-card',
				duration: 300
			})
		}
		
		// 格式化时间
		const formatRelativeTime = (timeStr) => {
			if (!timeStr) return ''
			// 如果已经是完整日期格式（如 "2024-03-15 12:30"），直接返回
			if (typeof timeStr === 'string' && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(timeStr)) {
				return timeStr
			}
			// 否则使用相对时间格式化
			return formatTime(timeStr)
		}
		
		// 格式化数字
		const formatNumber = (num) => {
			return formatNum(num)
		}
		
		// 获取标签样式类
		const getTagClass = (tag) => {
			const tagClasses = {
				'通知': 'tag-notice',
				'科研': 'tag-research',
				'活动': 'tag-activity',
				'招聘': 'tag-recruit',
				'重要': 'tag-important'
			}
			return tagClasses[tag] || 'tag-default'
		}
		
		// 获取标签图标
		const getTagIcon = (tag) => {
			const tagIcons = {
				'通知': 'sound',
				'科研': 'compose',
				'活动': 'calendar',
				'招聘': 'person',
				'重要': 'flag'
			}
			return tagIcons[tag] || 'info'
		}
		
		// 获取分类名称
		const getCategoryName = (category) => {
			const categoryNames = {
				'notice': '通知公告',
				'academic': '学术科研',
				'activity': '校园活动',
				'recruit': '招聘信息',
				'news': '新闻'
			}
			return categoryNames[category] || category
		}
		
		// 获取分类类型
		const getCategoryType = (category) => {
			const categoryTypes = {
				'notice': 'primary',
				'academic': 'success',
				'activity': 'warning',
				'recruit': 'error',
				'news': 'default'
			}
			return categoryTypes[category] || 'default'
		}
		
		// 页面加载
		onLoad((options) => {
			if (options && options.id) {
				newsId.value = options.id
			} else {
				newsId.value = '1'
			}
			loadNewsDetail()
			loadRelatedNews()
			loadComments()
		})
		
		return {
			newsId,
			newsDetail,
			relatedNews,
			loading,
			isLiked,
			isCollected,
			showCommentInput,
			comments,
			commentStats,
			currentSort,
			sortOptions,
			replyComment,
			loadNewsDetail,
			loadComments,
			handleLike,
			handleCollect,
			handleShare,
			handleCommentSubmit,
			toggleCommentLike,
			handleReply,
			handleReport,
			changeSort,
			navigateToRelated,
			handleBack,
			scrollToComments,
			formatRelativeTime,
			formatNumber,
			getTagClass,
			getTagIcon,
			getCategoryName,
			getCategoryType
		}
	}
}
</script>

<style scoped>
.page {
	background: linear-gradient(to bottom, #f8f9fa 0%, #f5f5f5 100%);
	padding-bottom: 120rpx;
	min-height: 100vh;
	position: relative;
}

.back-button {
	position: fixed;
	top: 0;
	left: 0;
	width: 88rpx;
	height: 88rpx;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding-top: env(safe-area-inset-top);
	transition: all 0.3s;
}

.back-button-inner {
	width: 60rpx;
	height: 60rpx;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.back-button:active .back-button-inner {
	background: rgba(0, 0, 0, 0.6);
	transform: scale(0.95);
}

.detail-container {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.cover-image {
	width: 100%;
	height: 400rpx;
	background: #f5f5f5;
}

.info-card {
	padding: 30rpx;
}

.news-title {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
	line-height: 1.4;
}

.tags-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-bottom: 30rpx;
}

.tag-badge {
	display: inline-flex;
	align-items: center;
	gap: 4rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	color: #fff;
}

.tag-badge.tag-notice {
	background: linear-gradient(135deg, #007AFF, #5AC8FA);
}

.tag-badge.tag-research {
	background: linear-gradient(135deg, #34C759, #4cd964);
}

.tag-badge.tag-activity {
	background: linear-gradient(135deg, #FF9500, #FFB347);
}

.tag-badge.tag-recruit {
	background: linear-gradient(135deg, #FF3B30, #FF6B6B);
}

.tag-badge.tag-important {
	background: linear-gradient(135deg, #AF52DE, #C77DFF);
}

.tag-badge.tag-default {
	background: linear-gradient(135deg, #8E8E93, #AEAEB2);
}

.status-tag {
	display: inline-flex;
	align-items: center;
	gap: 4rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	color: #fff;
}

.status-tag.top {
	background: linear-gradient(135deg, #ff3b30, #ff6b6b);
}

.status-tag.hot {
	background: linear-gradient(135deg, #ff9500, #ffb347);
}

.status-tag.new {
	background: linear-gradient(135deg, #007AFF, #5AC8FA);
}

.info-list {
	
}

.info-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 25rpx 0;
	border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	font-size: 28rpx;
	color: #666;
	width: 150rpx;
	font-weight: 500;
}

.info-value {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	display: flex;
	align-items: center;
}

.description-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 0 20rpx 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
	padding-bottom: 15rpx;
	border-bottom: 2px solid #007AFF;
}

.content-body {
	font-size: 28rpx;
	line-height: 1.8;
	color: #666;
}

.content-body :deep(p) {
	margin-bottom: 20rpx;
}

.content-body :deep(h2),
.content-body :deep(h3) {
	margin: 30rpx 0 20rpx;
	font-weight: bold;
	color: #333;
}

.related-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 0 20rpx 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.related-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.related-item {
	display: flex;
	gap: 20rpx;
	padding: 20rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
	transition: all 0.3s;
}

.related-item:active {
	background: #f0f0f0;
	transform: scale(0.98);
}

.related-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	flex-shrink: 0;
	background: #f5f5f5;
}

.related-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.related-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.related-meta {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 40rpx;
}

.error-text {
	font-size: 28rpx;
	color: #999;
	margin: 30rpx 0;
}

.retry-btn {
	margin-top: 30rpx;
	padding: 20rpx 40rpx;
	background: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 28rpx;
	border: none;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	border-top: 1px solid #f0f0f0;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	z-index: 1000;
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	flex: 1;
	padding: 10rpx 0;
	transition: all 0.3s;
}

.action-btn:active {
	opacity: 0.7;
	transform: scale(0.95);
}

.action-icon {
	width: 88rpx;
	height: 88rpx;
	transition: all 0.3s;
}

.action-btn.liked .action-label {
	color: #ff3b30;
	font-weight: 500;
}

.action-btn.collected .action-label {
	color: #ffd700;
	font-weight: 500;
}

.action-label {
	font-size: 22rpx;
	color: #666;
	margin-top: 4rpx;
	line-height: 1;
}

.comment-input-area {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 30rpx;
}

.input-wrapper {
	flex: 1;
	height: 70rpx;
	background: #f5f5f5;
	border-radius: 35rpx;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	transition: all 0.3s;
}

.input-wrapper:active {
	background: #eeeeee;
}

.input-placeholder {
	font-size: 28rpx;
	color: #999;
}

.send-btn {
	height: 70rpx;
	padding: 0 40rpx;
	background: #007AFF;
	color: #fff;
	border-radius: 35rpx;
	font-size: 28rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s;
}

.send-btn:active {
	background: #0051D5;
	transform: scale(0.98);
}

.send-btn:disabled {
	background: #ccc;
	opacity: 0.6;
}

.comment-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin: 0 20rpx 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.comment-sort {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #f0f0f0;
}

.sort-item {
	padding: 8rpx 20rpx;
	font-size: 26rpx;
	color: #666;
	border-radius: 20rpx;
	background: #f5f5f5;
	transition: all 0.3s;
}

.sort-item.active {
	background: #007AFF;
	color: #fff;
}

.comment-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.comment-item {
	padding-bottom: 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.comment-item.hot-comment {
	background: linear-gradient(90deg, rgba(255, 149, 0, 0.05) 0%, rgba(255, 149, 0, 0) 100%);
	border-left: 4rpx solid #ff9500;
	padding-left: 16rpx;
	margin-left: -16rpx;
}

.comment-item.author-comment {
	background: linear-gradient(90deg, rgba(0, 122, 255, 0.05) 0%, rgba(0, 122, 255, 0) 100%);
	border-left: 4rpx solid #007AFF;
	padding-left: 16rpx;
	margin-left: -16rpx;
}

.comment-main {
	display: flex;
	gap: 20rpx;
}

.comment-avatar {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	flex-shrink: 0;
	background: #f5f5f5;
	border: 2rpx solid #f0f0f0;
	overflow: hidden;
}

.comment-content {
	flex: 1;
}

.comment-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.user-info {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8rpx;
	flex: 1;
}

.username {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
}

.comment-meta {
	display: flex;
	align-items: center;
	gap: 8rpx;
	flex-shrink: 0;
}

.user-badge {
	padding: 2rpx 8rpx;
	border-radius: 12rpx;
	font-size: 20rpx;
	color: #fff;
}

.user-badge.author {
	background: #007AFF;
}

.user-badge.hot {
	background: #ff9500;
}

.user-badge.top {
	background: #ff3b30;
}

.comment-time {
	font-size: 24rpx;
	color: #999;
	white-space: nowrap;
}

.comment-floor {
	font-size: 24rpx;
	color: #007AFF;
	margin-left: 4rpx;
}

.comment-text {
	font-size: 28rpx;
	line-height: 1.6;
	color: #666;
	margin-bottom: 12rpx;
}

.comment-actions {
	display: flex;
	align-items: center;
	gap: 30rpx;
	margin-top: 12rpx;
}

.comment-actions .action-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 0;
	transition: all 0.3s;
	cursor: pointer;
}

.comment-actions .action-btn:active {
	opacity: 0.7;
	transform: scale(0.95);
}

.comment-actions .action-btn.liked {
	/* 点赞状态特殊样式 */
}

.comment-actions .action-btn.liked uni-icons {
	animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
}

.comment-actions .action-count {
	font-size: 24rpx;
	color: #999;
	line-height: 1;
	font-weight: normal;
}

.comment-actions .action-btn.liked .action-count {
	color: #ff3b30;
	font-weight: 500;
}

.reply-list {
	margin-top: 20rpx;
	padding: 20rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
}

.reply-item {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 12rpx;
	font-size: 26rpx;
	line-height: 1.6;
}

.reply-item:last-child {
	margin-bottom: 0;
}

.reply-name {
	color: #007AFF;
	font-weight: 500;
}

.reply-badge {
	padding: 2rpx 6rpx;
	background: #007AFF;
	color: #fff;
	border-radius: 8rpx;
	font-size: 20rpx;
	margin-left: 8rpx;
}

.reply-text {
	color: #666;
}

.empty-comments {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 40rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin-top: 20rpx;
}
</style>
