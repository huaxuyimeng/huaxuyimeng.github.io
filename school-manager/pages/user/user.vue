<!--
 * 文件路径: pages/user/user.vue
 * 功能说明: 用户详情/编辑页面
 * 主要功能:
 *   1. 显示和编辑用户详细信息
 *   2. 修改头像、昵称、签名等
 *   3. 选择学校、系统头像
 *   4. 保存用户信息到本地存储
 * 数据来源: 本地存储 userInfo
 * 相关页面: pages/tabbar/profile/index.vue (个人中心)
 -->
<template>
  <view class="user-detail-page">
    <!-- 页面头部 -->
    <view class="user-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <uni-icons type="left" size="24" color="#1a1a1a"></uni-icons>
        </view>
        <view class="header-title">用户详情</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="handleMore">
          <uni-icons type="more" size="24" color="#666"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 用户信息 -->
    <view class="user-content">
      <!-- 用户信息卡片 -->
      <view class="user-info-card">
        <!-- 背景图 -->
        <image class="user-bg" :src="userInfo.background" mode="widthFix" />
        
        <view class="user-main">
          <view class="user-avatar-section">
            <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill" />
            <view v-if="userInfo.online" class="online-badge"></view>
            <view v-if="userInfo.vip" class="vip-badge">VIP</view>
          </view>
          
          <view class="user-basic">
            <view class="user-name-section">
              <view class="user-name">{{ userInfo.nickname }}</view>
              <view v-if="userInfo.gender === '男'" class="gender-badge male">
                <uni-icons type="person" size="16" color="#fff"></uni-icons>
              </view>
              <view v-else-if="userInfo.gender === '女'" class="gender-badge female">
                <uni-icons type="person" size="16" color="#fff"></uni-icons>
              </view>
              <view v-if="userInfo.verified" class="verify-badge">
                <uni-icons type="checkmarkempty" size="16" color="#fff"></uni-icons>
              </view>
            </view>
            
            <view class="user-id">学号：{{ userInfo.studentId }}</view>
            
            <view class="user-school">{{ userInfo.school }} · {{ userInfo.college }} · {{ userInfo.major }}</view>
            
            <view class="user-tags">
              <view v-for="tag in userInfo.tags" :key="tag" class="user-tag">{{ tag }}</view>
            </view>
            
            <view class="user-signature">{{ userInfo.signature }}</view>
            
            <view class="user-stats">
              <view class="stat-item" @click="handleFollowing">
                <view class="stat-value">{{ userInfo.following }}</view>
                <view class="stat-label">关注</view>
              </view>
              <view class="stat-item" @click="handleFollowers">
                <view class="stat-value">{{ userInfo.followers }}</view>
                <view class="stat-label">粉丝</view>
              </view>
              <view class="stat-item" @click="handleDynamic">
                <view class="stat-value">{{ userInfo.dynamicCount }}</view>
                <view class="stat-label">动态</view>
              </view>
              <view class="stat-item" @click="handleVisit">
                <view class="stat-value">{{ userInfo.visitCount }}</view>
                <view class="stat-label">来访</view>
              </view>
            </view>
            
            <!-- 操作按钮 -->
            <view class="user-actions">
              <view v-if="userInfo.isFollowing" class="action-btn follow" @click="handleUnfollow">
                <uni-icons type="checkmarkempty" size="18" color="#666"></uni-icons>
                <text>已关注</text>
              </view>
              <view v-else class="action-btn follow primary" @click="handleFollow">
                <uni-icons type="plus" size="18" color="#fff"></uni-icons>
                <text>关注</text>
              </view>
              
              <view class="action-btn message" @click="handleMessage">
                <uni-icons type="chat" size="18" color="#666"></uni-icons>
                <text>私信</text>
              </view>
              
              <view class="action-btn more" @click="handleMoreActions">
                <uni-icons type="more" size="18" color="#666"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 用户相册 -->
      <view v-if="userGallery.length > 0" class="user-gallery">
        <view class="section-header">
          <view class="section-title">相册（{{ userGallery.length }}）</view>
          <view class="section-more" @click="viewAllPhotos">更多</view>
        </view>
        
        <scroll-view class="gallery-scroll" scroll-x>
          <view 
            v-for="(photo, index) in userGallery" 
            :key="index"
            class="photo-item"
            @click="handlePhotoClick(photo, index)"
          >
            <image class="photo-img" :src="photo.url" mode="aspectFill" />
            <view v-if="photo.type === 'video'" class="photo-type">视频</view>
          </view>
        </scroll-view>
      </view>

      <!-- 用户动态 -->
      <view class="user-dynamic">
        <view class="section-header">
          <view class="section-title">用户动态</view>
          <view class="section-tabs">
            <view 
              class="tab-item" 
              :class="{ active: currentTab === 'all' }"
              @click="currentTab = 'all'"
            >
              全部
            </view>
            <view 
              class="tab-item" 
              :class="{ active: currentTab === 'original' }"
              @click="currentTab = 'original'"
            >
              原创
            </view>
            <view 
              class="tab-item" 
              :class="{ active: currentTab === 'share' }"
              @click="currentTab = 'share'"
            >
              分享
            </view>
          </view>
        </view>
        
        <!-- 动态列表 -->
        <view v-if="userDynamic.length > 0" class="dynamic-list">
          <view 
            v-for="dynamic in currentDynamic" 
            :key="dynamic.id"
            class="dynamic-item"
          >
            <!-- 动态头部 -->
            <view class="dynamic-header">
              <image class="user-avatar" :src="dynamic.avatar" mode="aspectFill" />
              <view class="user-info">
                <view class="user-name">{{ dynamic.nickname }}</view>
                <view class="dynamic-time">{{ formatTime(dynamic.createTime) }}</view>
              </view>
              <view class="dynamic-actions">
                <view class="action-btn" @click="handleDynamicMore(dynamic)">
                  <uni-icons type="more" size="20" color="#999"></uni-icons>
                </view>
              </view>
            </view>
            
            <!-- 动态内容 -->
            <view class="dynamic-content">
              <view class="dynamic-text">{{ dynamic.content }}</view>
              
              <!-- 动态图片 -->
              <view v-if="dynamic.images && dynamic.images.length > 0" class="dynamic-images">
                <view 
                  v-for="(img, index) in dynamic.images" 
                  :key="index"
                  class="image-item"
                  :class="getImageClass(dynamic.images.length)"
                  @click="handleImageClick(dynamic.images, index)"
                >
                  <image class="image" :src="img" mode="aspectFill" />
                </view>
              </view>
              
              <!-- 动态视频 -->
              <view v-if="dynamic.video" class="dynamic-video" @click="handleVideoClick(dynamic.video)">
                <view class="video-wrapper">
                  <image class="video-cover" :src="dynamic.video.cover" mode="aspectFill" />
                  <view class="video-play">
                    <uni-icons type="play-filled" size="30" color="#fff"></uni-icons>
                  </view>
                  <view class="video-duration">{{ formatDuration(dynamic.video.duration) }}</view>
                </view>
              </view>
              
              <!-- 分享的动态 -->
              <view v-if="dynamic.share" class="dynamic-share" @click="handleShareClick(dynamic.share)">
                <view class="share-content">
                  <view class="share-title">{{ dynamic.share.title }}</view>
                  <view class="share-desc">{{ dynamic.share.description }}</view>
                  <view v-if="dynamic.share.cover" class="share-cover">
                    <image :src="dynamic.share.cover" mode="aspectFill" />
                  </view>
                </view>
              </view>
            </view>
            
            <!-- 动态底部 -->
            <view class="dynamic-footer">
              <view class="footer-actions">
                <view 
                  class="action-btn like"
                  :class="{ liked: dynamic.liked }"
                  @click="handleDynamicLike(dynamic)"
                >
                  <uni-icons 
                    :type="dynamic.liked ? 'heart-filled' : 'heart'" 
                    size="18" 
                    :color="dynamic.liked ? '#ff3b30' : '#999'"
                  ></uni-icons>
                  <text>{{ dynamic.likeCount }}</text>
                </view>
                
                <view 
                  class="action-btn comment"
                  @click="handleDynamicComment(dynamic)"
                >
                  <uni-icons type="chat" size="18" color="#999"></uni-icons>
                  <text>{{ dynamic.commentCount }}</text>
                </view>
                
                <view 
                  class="action-btn share"
                  @click="handleDynamicShare(dynamic)"
                >
                  <uni-icons type="share" size="18" color="#999"></uni-icons>
                  <text>{{ dynamic.shareCount }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-else class="empty-dynamic">
          <image class="empty-img" src="/static/images/empty-dynamic.png" />
          <view class="empty-text">用户还没有发布任何动态</view>
        </view>
      </view>

      <!-- 用户信息卡片 -->
      <view class="user-info-section">
        <view class="section-header">
          <view class="section-title">用户信息</view>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <view class="info-label">注册时间</view>
            <view class="info-value">{{ formatDate(userInfo.registerTime) }}</view>
          </view>
          
          <view class="info-item">
            <view class="info-label">最后登录</view>
            <view class="info-value">{{ formatTime(userInfo.lastLoginTime) }}</view>
          </view>
          
          <view class="info-item">
            <view class="info-label">活跃时间</view>
            <view class="info-value">{{ userInfo.activeTime }}</view>
          </view>
          
          <view class="info-item">
            <view class="info-label">个人简介</view>
            <view class="info-value">{{ userInfo.description }}</view>
          </view>
          
          <view class="info-item">
            <view class="info-label">兴趣爱好</view>
            <view class="info-value">{{ userInfo.hobbies }}</view>
          </view>
          
          <view class="info-item">
            <view class="info-label">加入的社团</view>
            <view class="info-value">
              <view v-for="club in userInfo.clubs" :key="club" class="club-tag">{{ club }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 账号管理 -->
      <view class="account-section">
        <view class="section-header">
          <view class="section-title">账号管理</view>
        </view>
        
        <view class="account-options">
          <view class="account-item logout" @click="handleLogout">
            <view class="account-left">
              <view class="account-icon" style="background: #ff3b30;">
                <uni-icons type="close" size="20" color="#fff"></uni-icons>
              </view>
              <view class="account-text">退出登录</view>
            </view>
            <view class="account-right">
              <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
          </view>
          
          <view class="account-item cancel" @click="handleCancelAccount">
            <view class="account-left">
              <view class="account-icon" style="background: #999;">
                <uni-icons type="trash" size="20" color="#fff"></uni-icons>
              </view>
              <view class="account-text">注销账号</view>
            </view>
            <view class="account-right">
              <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </view>

    <!-- 更多操作菜单 -->
    <view v-if="showMoreMenu" class="menu-overlay" @click="hideMoreMenu">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="handleReport">
          <uni-icons type="flag" size="20" color="#666"></uni-icons>
          <text>举报用户</text>
        </view>
        <view class="menu-item" @click="handleBlock">
          <uni-icons type="locked" size="20" color="#666"></uni-icons>
          <text>加入黑名单</text>
        </view>
        <view class="menu-item" @click="handleShareUser">
          <uni-icons type="share" size="20" color="#666"></uni-icons>
          <text>分享用户</text>
        </view>
        <view class="menu-item cancel" @click="hideMoreMenu">取消</view>
      </view>
    </view>

    <!-- 图片预览 -->
    <view v-if="showImagePreview" class="preview-overlay" @click="hideImagePreview">
      <swiper 
        class="preview-swiper" 
        :current="currentImageIndex"
        :indicator-dots="true"
        @change="onImageChange"
      >
        <swiper-item v-for="(img, index) in previewImages" :key="index">
          <view class="swiper-item">
            <image class="preview-img" :src="img" mode="aspectFit" @click.stop />
            <view class="preview-index">{{ currentImageIndex + 1 }}/{{ previewImages.length }}</view>
          </view>
        </swiper-item>
      </swiper>
      <view class="preview-close" @click="hideImagePreview">×</view>
    </view>

    <!-- 举报面板 -->
    <view v-if="showReportPanel" class="modal-overlay" @click="hideReportPanel">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text>举报用户</text>
          <view class="modal-close" @click="hideReportPanel">×</view>
        </view>
        
        <view class="modal-body">
          <view class="modal-title">请选择举报原因</view>
          <view class="report-options">
            <view 
              v-for="option in reportOptions" 
              :key="option.value"
              class="report-option"
              :class="{ active: reportReason === option.value }"
              @click="reportReason = option.value"
            >
              {{ option.label }}
            </view>
          </view>
          
          <view class="report-textarea">
            <textarea 
              placeholder="补充说明（选填）" 
              v-model="reportContent"
              maxlength="200"
            />
            <view class="textarea-count">{{ reportContent.length }}/200</view>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="hideReportPanel">取消</view>
          <view class="footer-btn primary" @click="handleReportSubmit">提交举报</view>
        </view>
      </view>
    </view>

    <!-- 注销账号确认 -->
    <view v-if="showCancelConfirm" class="modal-overlay" @click="hideCancelConfirm">
      <view class="modal-content cancel-modal" @click.stop>
        <view class="modal-header">
          <text>注销账号</text>
          <view class="modal-close" @click="hideCancelConfirm">×</view>
        </view>
        
        <view class="modal-body">
          <view class="warning-icon">
            <uni-icons type="info" size="40" color="#ff3b30"></uni-icons>
          </view>
          <view class="warning-title">账号注销后，您将：</view>
          <view class="warning-list">
            <view class="warning-item">• 无法登录和使用该账号</view>
            <view class="warning-item">• 个人资料、活动记录将被删除</view>
            <view class="warning-item">• 收藏、发布的内容将被清空</view>
            <view class="warning-item">• 此操作不可恢复，请谨慎操作</view>
          </view>
          
          <input 
            class="confirm-input" 
            v-model="cancelConfirmText" 
            placeholder="请输入'确认注销'以继续"
          />
        </view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="hideCancelConfirm">取消</view>
          <view class="footer-btn danger" 
            :class="{ disabled: cancelConfirmText !== '确认注销' }"
            @click="confirmCancelAccount"
          >
            确认注销
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import storage from '@/utils/storage.js';
import { formatDateTime, formatDate, formatTime } from '@/utils/date.js';
import { formatRelativeTime } from '@/utils/date.js';

export default {
	data() {
		return {
			refreshing: false,
			showMoreMenu: false,
			showImagePreview: false,
			showReportPanel: false,
			showCancelConfirm: false,
			currentTab: 'all',
			currentImageIndex: 0,
			reportReason: '',
			reportContent: '',
			cancelConfirmText: '',
			previewImages: [],

			userInfo: {
				id: 1002,
				nickname: '李四',
				studentId: '2022012346',
				avatar: '/static/images/生成动物写实头像.png',
				background: '/static/images/user-bg.jpg',
				online: true,
				vip: true,
				verified: true,
				gender: '女',
				school: '浙江大学',
				college: '计算机学院',
				major: '软件工程',
				signature: '热爱编程，热爱生活，永远保持学习的心态！',
				description: '前端开发爱好者，喜欢分享技术，热爱开源',
				hobbies: '编程、摄影、旅行、阅读',
				tags: ['前端开发', '摄影爱好者', '旅行达人'],
				following: 56,
				followers: 128,
				dynamicCount: 24,
				visitCount: 345,
				isFollowing: false,
				registerTime: '2022-09-01',
				lastLoginTime: '2024-12-20 14:30:00',
				activeTime: '通常在晚上活跃',
				clubs: ['计算机协会', '摄影社', '志愿者协会']
			},
			
			userGallery: [
				{ id: 1, url: '/static/images/photo1.jpg', type: 'image' },
				{ id: 2, url: '/static/images/photo2.jpg', type: 'image' },
				{ id: 3, url: '/static/images/photo3.jpg', type: 'video' },
				{ id: 4, url: '/static/images/photo4.jpg', type: 'image' },
				{ id: 5, url: '/static/images/photo5.jpg', type: 'image' }
			],
			
			userDynamic: [
				{ 
					id: 1, 
					nickname: '李四',
					avatar: '/static/images/生成动物写实头像.png',
					createTime: '2024-12-20 14:30:00',
					content: '今天学习了Vue3 Composition API，感觉比Options API更加灵活！',
					images: [
						'/static/images/dynamic1.jpg',
						'/static/images/dynamic2.jpg'
					],
					liked: false,
					likeCount: 24,
					commentCount: 8,
					shareCount: 3,
					type: 'original'
				},
				{ 
					id: 2, 
					nickname: '李四',
					avatar: '/static/images/生成动物写实头像.png',
					createTime: '2024-12-19 20:15:00',
					content: '分享一个很棒的JavaScript教程网站，对初学者很有帮助',
					share: {
						title: '现代JavaScript教程',
						description: '从基础到高级的完整JavaScript教程',
						cover: '/static/images/share1.jpg',
						url: 'https://javascript.info'
					},
					liked: true,
					likeCount: 15,
					commentCount: 5,
					shareCount: 2,
					type: 'share'
				},
				{ 
					id: 3, 
					nickname: '李四',
					avatar: '/static/images/生成动物写实头像.png',
					createTime: '2024-12-18 16:45:00',
					content: '周末去了西湖，天气真好，拍了好多照片~',
					images: [
						'/static/images/dynamic3.jpg',
						'/static/images/dynamic4.jpg',
						'/static/images/dynamic5.jpg'
					],
					liked: false,
					likeCount: 36,
					commentCount: 12,
					shareCount: 4,
					type: 'original'
				},
				{ 
					id: 4, 
					nickname: '李四',
					avatar: '/static/images/生成动物写实头像.png',
					createTime: '2024-12-17 10:20:00',
					content: '最近在做一个校园助手项目，欢迎大家提建议~',
					video: {
						cover: '/static/images/video1.jpg',
						url: 'https://example.com/video1.mp4',
						duration: 120
					},
					liked: false,
					likeCount: 42,
					commentCount: 18,
					shareCount: 6,
					type: 'original'
				}
			],
			
			reportOptions: [
				{ label: '发布垃圾信息', value: 'spam' },
				{ label: '发布不实信息', value: 'false' },
				{ label: '人身攻击/骚扰', value: 'harassment' },
				{ label: '发布不当内容', value: 'inappropriate' },
				{ label: '冒充他人', value: 'impersonation' },
				{ label: '其他原因', value: 'other' }
			]
		}
	},
	computed: {
		currentDynamic() {
			if (this.currentTab === 'all') {
				return this.userDynamic;
			} else {
				return this.userDynamic.filter(d => d.type === this.currentTab);
			}
		}
	},
	onLoad(options) {
		if (options.id) {
			// 根据用户ID加载用户信息
			this.loadUserData(true);
		} else {
			// 如果没有传入ID，尝试从存储中加载当前用户信息
			const currentUser = storage.get('userInfo');
			if (currentUser) {
				this.userInfo = { ...this.userInfo, ...currentUser };
			}
		}
	},
	onShow() {
		// 页面显示时更新数据
		const needRefresh = storage.get('needRefreshUser');
		if (needRefresh) {
			storage.remove('needRefreshUser');
			this.loadUserData(true);
		}
	},
	onPullDownRefresh() {
		this.handleRefresh();
	},
	methods: {
		// 工具函数
		formatTime(timeStr) {
			if (!timeStr) return '';
			const date = new Date(timeStr);
			if (isNaN(date.getTime())) return '';
			return formatRelativeTime(date);
		},
		
		formatDate: formatDate,
		
		formatDuration(seconds) {
			if (!seconds) return '0:00';
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${minutes}:${secs.toString().padStart(2, '0')}`;
		},
		
		getImageClass(count) {
			if (count === 1) return 'single';
			if (count === 2) return 'double';
			if (count === 3) return 'triple';
			if (count === 4) return 'quad';
			return 'multi';
		},
		
		// 事件处理
		handleBack() {
			uni.navigateBack();
		},
		
		handleMore() {
			this.showMoreMenu = true;
		},
		
		hideMoreMenu() {
			this.showMoreMenu = false;
		},
		
		handleRefresh() {
			this.loadUserData(true);
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
		handleFollowing() {
			uni.showToast({ title: '查看关注列表', icon: 'none' });
		},
		
		handleFollowers() {
			uni.showToast({ title: '查看粉丝列表', icon: 'none' });
		},
		
		handleDynamic() {
			uni.showToast({ title: '查看用户动态', icon: 'none' });
		},
		
		handleVisit() {
			uni.showToast({ title: '查看来访记录', icon: 'none' });
		},
		
		handleFollow() {
			this.userInfo.isFollowing = true;
			this.userInfo.followers++;
			uni.showToast({ title: '关注成功', icon: 'success' });
		},
		
		handleUnfollow() {
			uni.showModal({
				title: '取消关注',
				content: '确定不再关注此用户吗？',
				success: (res) => {
					if (res.confirm) {
						this.userInfo.isFollowing = false;
						this.userInfo.followers = Math.max(0, this.userInfo.followers - 1);
						uni.showToast({ title: '已取消关注', icon: 'success' });
					}
				}
			});
		},
		
		handleMessage() {
			uni.showToast({ title: '私信功能开发中', icon: 'none' });
			// uni.navigateTo({
			// 	url: `/pages/message/chat?userId=${this.userInfo.id}`
			// });
		},
		
		handleMoreActions() {
			this.showMoreMenu = true;
		},
		
		viewAllPhotos() {
			uni.showToast({ title: '查看全部相册', icon: 'none' });
		},
		
		handlePhotoClick(photo, index) {
			if (photo.type === 'image') {
				this.previewImages = this.userGallery
					.filter(p => p.type === 'image')
					.map(p => p.url);
				this.currentImageIndex = index;
				this.showImagePreview = true;
			} else {
				uni.showToast({ title: '播放视频', icon: 'none' });
			}
		},
		
		hideImagePreview() {
			this.showImagePreview = false;
			this.previewImages = [];
		},
		
		onImageChange(e) {
			this.currentImageIndex = e.detail.current;
		},
		
		handleImageClick(images, index) {
			this.previewImages = images;
			this.currentImageIndex = index;
			this.showImagePreview = true;
		},
		
		handleVideoClick(video) {
			uni.showToast({ title: '播放视频', icon: 'none' });
		},
		
		handleShareClick(share) {
			uni.showToast({ title: '查看分享内容', icon: 'none' });
		},
		
		handleDynamicMore(dynamic) {
			uni.showActionSheet({
				itemList: ['删除动态', '设为私密', '复制链接', '举报动态'],
				success: (res) => {
					if (res.tapIndex === 0) {
						this.handleDeleteDynamic(dynamic.id);
					} else if (res.tapIndex === 1) {
						this.handlePrivateDynamic(dynamic.id);
					} else if (res.tapIndex === 2) {
						this.handleCopyDynamicLink(dynamic.id);
					} else if (res.tapIndex === 3) {
						this.handleReportDynamic(dynamic.id);
					}
				}
			});
		},
		
		handleDeleteDynamic(id) {
			uni.showModal({
				title: '删除动态',
				content: '确定要删除这条动态吗？',
				success: (res) => {
					if (res.confirm) {
						this.userDynamic = this.userDynamic.filter(d => d.id !== id);
						uni.showToast({ title: '删除成功', icon: 'success' });
					}
				}
			});
		},
		
		handlePrivateDynamic(id) {
			uni.showToast({ title: '已设为私密', icon: 'success' });
		},
		
		handleCopyDynamicLink(id) {
			uni.setClipboardData({
				data: `https://campus.example.com/dynamic/${id}`,
				success: () => {
					uni.showToast({ title: '链接已复制', icon: 'success' });
				}
			});
		},
		
		handleReportDynamic(id) {
			uni.showToast({ title: '举报动态', icon: 'none' });
		},
		
		handleDynamicLike(dynamic) {
			dynamic.liked = !dynamic.liked;
			dynamic.likeCount += dynamic.liked ? 1 : -1;
			uni.showToast({ 
				title: dynamic.liked ? '点赞成功' : '已取消点赞',
				icon: 'success'
			});
		},
		
		handleDynamicComment(dynamic) {
			uni.showToast({ title: '评论动态', icon: 'none' });
		},
		
		handleDynamicShare(dynamic) {
			uni.showActionSheet({
				itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
				success: (res) => {
					if (res.tapIndex === 0) {
						this.shareToWechat(dynamic);
					} else if (res.tapIndex === 1) {
						this.shareToMoments(dynamic);
					} else if (res.tapIndex === 2) {
						this.handleCopyDynamicLink(dynamic.id);
					}
				}
			});
		},
		
		shareToWechat(dynamic) {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				title: dynamic.content.substring(0, 30) + '...',
				summary: '来自校园助手的分享',
				success: () => {
					dynamic.shareCount++;
					uni.showToast({ title: '分享成功', icon: 'success' });
				}
			});
		},
		
		shareToMoments(dynamic) {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneTimeline',
				type: 0,
				title: dynamic.content.substring(0, 30) + '...',
				summary: '来自校园助手的分享',
				success: () => {
					dynamic.shareCount++;
					uni.showToast({ title: '分享成功', icon: 'success' });
				}
			});
		},
		
		handleReport() {
			this.showReportPanel = true;
			this.hideMoreMenu();
		},
		
		handleBlock() {
			uni.showModal({
				title: '加入黑名单',
				content: '加入黑名单后，你将不再收到此用户的消息和动态',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '已加入黑名单', icon: 'success' });
						this.hideMoreMenu();
					}
				}
			});
		},
		
		handleShareUser() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				title: `推荐用户：${this.userInfo.nickname}`,
				summary: this.userInfo.signature,
				success: () => {
					uni.showToast({ title: '分享成功', icon: 'success' });
					this.hideMoreMenu();
				}
			});
		},
		
		hideReportPanel() {
			this.showReportPanel = false;
			this.reportReason = '';
			this.reportContent = '';
		},
		
		handleReportSubmit() {
			if (!this.reportReason) {
				uni.showToast({ title: '请选择举报原因', icon: 'none' });
				return;
			}
			
			uni.showToast({ title: '举报已提交，感谢您的反馈', icon: 'success' });
			this.hideReportPanel();
		},
		
		// 退出登录
		handleLogout() {
			uni.showModal({
				title: '退出登录',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除登录状态
						storage.remove('token');
						storage.remove('userInfo');
						uni.showToast({ title: '已退出登录', icon: 'success' });
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/user/login'
							});
						}, 1000);
					}
				}
			});
		},
		
		// 注销账号
		handleCancelAccount() {
			this.showCancelConfirm = true;
		},
		
		hideCancelConfirm() {
			this.showCancelConfirm = false;
			this.cancelConfirmText = '';
		},
		
		confirmCancelAccount() {
			if (this.cancelConfirmText !== '确认注销') {
				uni.showToast({ title: '请输入"确认注销"', icon: 'none' });
				return;
			}
			
			uni.showModal({
				title: '确认注销账号',
				content: '账号注销后所有数据将被永久删除，此操作不可恢复！',
				confirmText: '确认注销',
				confirmColor: '#ff3b30',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '注销中' });
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({ title: '账号已注销', icon: 'success' });
							// 清除所有数据
							uni.clearStorageSync();
							// 跳转到登录页
							setTimeout(() => {
								uni.reLaunch({ url: '/pages/user/login' });
							}, 1000);
						}, 1500);
					}
				}
			});
		},
		
		// 数据加载
		loadUserData(force = false) {
			if (force) {
				uni.showLoading({ title: '加载中' });
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({ title: '用户信息已更新', icon: 'success' });
				}, 500);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.user-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
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
    
    .header-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .header-right {
    .header-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 50%;
      transition: all 0.3s;
      
      &:active {
        background: rgba(0, 0, 0, 0.1);
        transform: scale(0.95);
      }
    }
  }
}

.user-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  // 固定高度，使用原生滚动，性能更好
  height: calc(100vh - 90rpx);
  // 优化滚动性能
  will-change: scroll-position;
}

.user-info-card {
  position: relative;
  background: #fff;
  border-radius: 0 0 30rpx 30rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  
  .user-bg {
    width: 100%;
    height: 300rpx;
    filter: brightness(0.7);
  }
  
  .user-main {
    position: relative;
    padding: 0 30rpx 30rpx;
    margin-top: -60rpx;
    
    .user-avatar-section {
      position: relative;
      display: inline-block;
      
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
      }
      
      .online-badge {
        position: absolute;
        bottom: 8rpx;
        right: 8rpx;
        width: 20rpx;
        height: 20rpx;
        background: #4cd964;
        border: 2rpx solid #fff;
        border-radius: 50%;
      }
      
      .vip-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 4rpx 12rpx;
        background: linear-gradient(45deg, #ff9500, #ff3b30);
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
        transform: translateX(50%);
      }
    }
    
    .user-basic {
      margin-top: 20rpx;
      
      .user-name-section {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        gap: 12rpx;
        
        .user-name {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
        }
        
        .gender-badge {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20rpx;
          color: #fff;
          
          &.male {
            background: #5ac8fa;
          }
          
          &.female {
            background: #ff2d55;
          }
        }
        
        .verify-badge {
          width: 30rpx;
          height: 30rpx;
          background: #007AFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20rpx;
          color: #fff;
        }
      }
      
      .user-id {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .user-school {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
      }
      
      .user-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        margin-bottom: 12rpx;
        
        .user-tag {
          padding: 4rpx 12rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #666;
        }
      }
      
      .user-signature {
        font-size: 24rpx;
        color: #333;
        line-height: 1.4;
        margin-bottom: 20rpx;
      }
      
      .user-stats {
        display: flex;
        justify-content: space-around;
        background: #f9f9f9;
        border-radius: 20rpx;
        padding: 20rpx 0;
        margin-bottom: 20rpx;
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8rpx;
          
          .stat-value {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
          }
          
          .stat-label {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
      
      .user-actions {
        display: flex;
        gap: 20rpx;
        
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8rpx;
          height: 70rpx;
          border-radius: 35rpx;
          font-size: 28rpx;
          color: #333;
          background: #f5f5f5;
          
          &.primary {
            background: #007AFF;
            color: #fff;
          }
          
          &.message {
            flex: 2;
          }
          
          &.more {
            flex: 0.5;
          }
        }
      }
    }
  }
}

.user-gallery {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .gallery-scroll {
    white-space: nowrap;
    
    .photo-item {
      display: inline-block;
      width: 120rpx;
      height: 120rpx;
      margin-right: 20rpx;
      border-radius: 12rpx;
      overflow: hidden;
      position: relative;
      
      .photo-img {
        width: 100%;
        height: 100%;
      }
      
      .photo-type {
        position: absolute;
        bottom: 8rpx;
        right: 8rpx;
        padding: 4rpx 12rpx;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
      }
    }
  }
}

.user-dynamic {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-tabs {
      display: flex;
      gap: 20rpx;
      
      .tab-item {
        padding: 8rpx 20rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        font-size: 24rpx;
        color: #666;
        
        &.active {
          background: #007AFF;
          color: #fff;
        }
      }
    }
  }
  
  .dynamic-list {
    .dynamic-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .dynamic-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .user-avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .user-info {
          flex: 1;
          
          .user-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 4rpx;
          }
          
          .dynamic-time {
            font-size: 20rpx;
            color: #999;
          }
        }
        
        .dynamic-actions {
          .action-btn {
            width: 40rpx;
            height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            color: #999;
          }
        }
      }
      
      .dynamic-content {
        margin-bottom: 20rpx;
        
        .dynamic-text {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 20rpx;
        }
        
        .dynamic-images {
          display: grid;
          gap: 10rpx;
          margin-bottom: 20rpx;
          
          &.single {
            grid-template-columns: 1fr;
            
            .image-item {
              aspect-ratio: 16/9;
            }
          }
          
          &.double {
            grid-template-columns: repeat(2, 1fr);
            
            .image-item {
              aspect-ratio: 1;
            }
          }
          
          &.triple {
            grid-template-columns: repeat(3, 1fr);
            
            .image-item {
              aspect-ratio: 1;
            }
          }
          
          &.quad {
            grid-template-columns: repeat(2, 1fr);
            
            .image-item {
              aspect-ratio: 1;
            }
          }
          
          &.multi {
            grid-template-columns: repeat(3, 1fr);
            
            .image-item {
              aspect-ratio: 1;
            }
          }
          
          .image-item {
            border-radius: 12rpx;
            overflow: hidden;
            
            .image {
              width: 100%;
              height: 100%;
            }
          }
        }
        
        .dynamic-video {
          margin-bottom: 20rpx;
          
          .video-wrapper {
            position: relative;
            aspect-ratio: 16/9;
            border-radius: 12rpx;
            overflow: hidden;
            
            .video-cover {
              width: 100%;
              height: 100%;
            }
            
            .video-play {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 80rpx;
              height: 80rpx;
              background: rgba(0, 0, 0, 0.6);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40rpx;
              color: #fff;
            }
            
            .video-duration {
              position: absolute;
              bottom: 12rpx;
              right: 12rpx;
              padding: 4rpx 12rpx;
              background: rgba(0, 0, 0, 0.6);
              color: #fff;
              border-radius: 20rpx;
              font-size: 20rpx;
            }
          }
        }
        
        .dynamic-share {
          background: #f9f9f9;
          border-radius: 12rpx;
          overflow: hidden;
          
          .share-content {
            padding: 20rpx;
            
            .share-title {
              font-size: 28rpx;
              font-weight: bold;
              color: #333;
              margin-bottom: 8rpx;
            }
            
            .share-desc {
              font-size: 24rpx;
              color: #666;
              margin-bottom: 12rpx;
            }
            
            .share-cover {
              aspect-ratio: 16/9;
              border-radius: 8rpx;
              overflow: hidden;
              
              image {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      
      .dynamic-footer {
        .footer-actions {
          display: flex;
          gap: 40rpx;
          
          .action-btn {
            display: flex;
            align-items: center;
            gap: 8rpx;
            font-size: 24rpx;
            color: #999;
            
            &.like.liked {
              color: #ff3b30;
            }
          }
        }
      }
    }
  }
  
  .empty-dynamic {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    
    .empty-img {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.user-info-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .info-list {
    .info-item {
      display: flex;
      align-items: flex-start;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .info-label {
        width: 200rpx;
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
      
      .info-value {
        flex: 1;
        font-size: 28rpx;
        color: #666;
        
        .club-tag {
          display: inline-block;
          padding: 4rpx 12rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #666;
          margin-right: 8rpx;
          margin-bottom: 8rpx;
        }
      }
    }
  }
}

.account-section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .account-options {
    .account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .account-left {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        .account-icon {
          width: 60rpx;
          height: 60rpx;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .account-text {
          font-size: 28rpx;
          color: #333;
          
          .logout & {
            color: #ff3b30;
          }
          
          .cancel & {
            color: #999;
          }
        }
      }
      
      .account-right {
        display: flex;
        align-items: center;
      }
    }
  }
}

.safe-area {
  height: 120rpx;
}

// 菜单样式
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
  
  .menu-content {
    width: 100%;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      font-size: 28rpx;
      color: #333;
      
      &.cancel {
        color: #ff3b30;
        border-top: 1rpx solid #f0f0f0;
      }
    }
  }
}

// 图片预览样式
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  
  .preview-swiper {
    width: 100%;
    height: 100%;
    
    .swiper-item {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .preview-img {
        width: 100%;
        height: 100%;
      }
      
      .preview-index {
        position: absolute;
        top: 100rpx;
        right: 30rpx;
        padding: 8rpx 20rpx;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 20rpx;
        font-size: 24rpx;
      }
    }
  }
  
  .preview-close {
    position: absolute;
    top: 60rpx;
    right: 30rpx;
    width: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 50%;
    font-size: 40rpx;
  }
}

// 模态框样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  
  .modal-content {
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    width: 600rpx;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40rpx 30rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .modal-close {
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .modal-body {
      padding: 20rpx 30rpx;
      
      .modal-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .report-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20rpx;
        margin-bottom: 30rpx;
        
        .report-option {
          padding: 20rpx;
          background: #f5f5f5;
          border-radius: 12rpx;
          font-size: 24rpx;
          color: #666;
          text-align: center;
          
          &.active {
            background: #007AFF;
            color: #fff;
          }
        }
      }
      
      .report-textarea {
        position: relative;
        
        textarea {
          width: 100%;
          min-height: 150rpx;
          padding: 20rpx;
          background: #f5f5f5;
          border-radius: 12rpx;
          font-size: 28rpx;
          color: #333;
        }
        
        .textarea-count {
          position: absolute;
          bottom: 12rpx;
          right: 20rpx;
          font-size: 20rpx;
          color: #999;
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
        
        &.cancel {
          background: #f5f5f5;
          color: #666;
        }
        
        &.primary {
          background: #007AFF;
          color: #fff;
        }
      }
    }
  }
}

// 注销账号模态框样式
.cancel-modal {
  .modal-body {
    text-align: center;
    padding: 40rpx 30rpx;
    
    .warning-icon {
      margin-bottom: 30rpx;
    }
    
    .warning-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 30rpx;
    }
    
    .warning-list {
      text-align: left;
      margin-bottom: 40rpx;
      
      .warning-item {
        font-size: 26rpx;
        color: #666;
        line-height: 1.8;
        margin-bottom: 12rpx;
      }
    }
    
    .confirm-input {
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .footer-btn {
    &.danger {
      background: #ff3b30;
      color: #fff;
      
      &.disabled {
        background: #e0e0e0;
        color: #999;
      }
    }
  }
}
</style>