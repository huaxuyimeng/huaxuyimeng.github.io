<!--
 * 文件路径: pages/tabbar/profile/index.vue
 * 功能说明: 个人中心页面
 * 主要功能:
 *   1. 显示用户基本信息（头像、昵称、学号、班级）
 *   2. 数据统计（浏览历史、评论、报名、收藏数量）
 *   3. 常用功能入口
 *   4. 账号设置和应用设置
 *   5. 编辑资料、选择头像、选择学校
 * 数据来源: 本地存储 userInfo, browsingHistory, myComments, myRegistrations, myCollections
 * 相关页面:
 *   - pages/user/user.vue (用户详情/编辑)
 *   - pages/user/login.vue (登录)
 *   - pages/user/history.vue (浏览历史)
 *   - pages/user/comments.vue (我的评论)
 *   - pages/user/registrations.vue (我的报名)
 *   - pages/user/collections.vue (我的收藏)
 -->
<template>
  <view class="profile-index-page">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <!-- 背景图 -->
      <image class="header-bg" src="/static/images/profile-bg.jpg" mode="scaleToFill" />
      
      <!-- 用户信息 -->
      <view class="user-info" v-if="isLogin">
        <view class="user-avatar-section" @click="handleEditAvatar">
          <image class="user-avatar" :src="userInfo.avatar || '/static/images/生成动物写实头像.png'" mode="aspectFill" />
          <view v-if="userInfo.online" class="online-badge"></view>
          <view class="edit-avatar-btn">
            <text class="iconfont">📷</text>
          </view>
        </view>
        
        <view class="user-basic">
          <view class="user-name-section">
            <view class="user-name">{{ userInfo.nickname || userInfo.name }}</view>
            <view v-if="userInfo.vip" class="vip-badge">VIP</view>
            <view v-if="userInfo.verified" class="verify-badge">
              <text class="iconfont">✅</text>
            </view>
            <view class="edit-btn" @click="handleEditInfo">
              <text class="iconfont">✏️</text>
            </view>
          </view>
          
          <view class="user-id" v-if="userInfo.studentId">学号：{{ userInfo.studentId }}</view>
          <view class="user-id" v-if="userInfo.className">班级：{{ userInfo.className }}</view>
          
          <view class="user-tags" v-if="userInfo.tags && userInfo.tags.length > 0">
            <view v-for="tag in userInfo.tags" :key="tag" class="user-tag">{{ tag }}</view>
          </view>
          
          <view class="user-signature" v-if="userInfo.signature">{{ userInfo.signature }}</view>
        </view>
      </view>
      
      <!-- 未登录提示 -->
      <view class="user-info login-prompt" v-else @click="goToLogin">
        <view class="user-avatar-section">
          <view class="avatar-placeholder">
            <uni-icons type="person" size="40" color="#999"></uni-icons>
          </view>
        </view>
        <view class="user-basic">
          <view class="user-name-section">
            <view class="user-name">点击登录</view>
            <view class="edit-btn">
              <uni-icons type="right" size="20" color="rgba(255, 255, 255, 0.8)"></uni-icons>
            </view>
          </view>
          <view class="user-id">登录后享受更多功能</view>
        </view>
      </view>
      
      <!-- 数据统计 -->
      <view class="user-stats" v-if="isLogin">
        <view class="stat-item" @click="goToHistory">
          <view class="stat-value">{{ historyCount }}</view>
          <view class="stat-label">浏览历史</view>
        </view>
        <view class="stat-item" @click="goToLikes">
          <view class="stat-value">{{ likesCount }}</view>
          <view class="stat-label">我的点赞</view>
        </view>
        <view class="stat-item" @click="goToComments">
          <view class="stat-value">{{ commentsCount }}</view>
          <view class="stat-label">我的评论</view>
        </view>
        <view class="stat-item" @click="goToCollections">
          <view class="stat-value">{{ collectionsCount }}</view>
          <view class="stat-label">我的收藏</view>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="quick-access-section">
      <view class="section-header">
        <view class="section-title">常用功能</view>
        <view class="section-more" @click="handleCustomize">自定义</view>
      </view>
      
      <view class="access-grid">
        <view 
          v-for="item in quickAccess" 
          :key="item.id"
          class="access-item"
          @click="handleQuickAccess(item)"
        >
          <view class="access-icon" :style="{ background: item.color }">
            <text class="iconfont" :class="item.icon"></text>
            <view v-if="item.badge" class="access-badge">{{ item.badge }}</view>
          </view>
          <view class="access-text">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <!-- 我的报名 -->
    <view v-if="isLogin && myRegistrations.length > 0" class="my-registrations-section">
      <view class="section-header">
        <view class="section-title">我的报名</view>
        <view class="section-more" @click="viewAllRegistrations">全部</view>
      </view>
      
      <scroll-view class="registrations-scroll" scroll-x>
        <view 
          v-for="registration in myRegistrations" 
          :key="registration.id"
          class="registration-item"
          @click="handleRegistrationClick(registration)"
        >
          <view class="registration-img">
            <image :src="registration.cover" mode="aspectFill" />
            <view class="registration-status" :class="getRegistrationStatusClass(registration.status)">
              {{ getRegistrationStatusText(registration.status) }}
            </view>
          </view>
          <view class="registration-info">
            <view class="registration-title">{{ registration.title }}</view>
            <view class="registration-time">{{ formatTime(registration.registrationTime) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 我的活动 -->
    <view v-if="isLogin && myActivities.length > 0" class="my-activities-section">
      <view class="section-header">
        <view class="section-title">我的活动</view>
        <view class="section-more" @click="viewAllActivities">全部</view>
      </view>
      
      <scroll-view class="activities-scroll" scroll-x>
        <view 
          v-for="activity in myActivities" 
          :key="activity.id"
          class="activity-item"
          @click="handleActivityClick(activity)"
        >
          <view class="activity-img">
            <image :src="activity.cover" mode="aspectFill" />
            <view class="activity-status" :class="getActivityStatusClass(activity.status)">
              {{ getActivityStatusText(activity.status) }}
            </view>
          </view>
          <view class="activity-info">
            <view class="activity-title">{{ activity.title }}</view>
            <view class="activity-time">{{ formatTime(activity.time) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 我的资讯 -->
    <view v-if="isLogin && myNews.length > 0" class="my-news-section">
      <view class="section-header">
        <view class="section-title">我的资讯</view>
        <view class="section-more" @click="viewAllNews">全部</view>
      </view>
      
      <scroll-view class="news-scroll" scroll-x>
        <view 
          v-for="news in myNews" 
          :key="news.id"
          class="news-item"
          @click="handleNewsClick(news)"
        >
          <view class="news-img">
            <image :src="news.cover" mode="aspectFill" />
            <view v-if="news.new" class="new-badge">新</view>
          </view>
          <view class="news-info">
            <view class="news-title">{{ news.title }}</view>
            <view class="news-time">{{ formatTime(news.publishTime) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 我的收藏 -->
    <view v-if="isLogin && myFavorites.length > 0" class="my-favorites-section">
      <view class="section-header">
        <view class="section-title">我的收藏</view>
        <view class="section-more" @click="viewAllFavorites">全部</view>
      </view>
      
      <scroll-view class="favorites-scroll" scroll-x>
        <view 
          v-for="item in myFavorites" 
          :key="item.id"
          class="favorite-item"
          @click="handleFavoriteClick(item)"
        >
          <view class="favorite-img">
            <image :src="item.cover" mode="aspectFill" />
            <view class="favorite-type">{{ item.type }}</view>
          </view>
          <view class="favorite-info">
            <view class="favorite-title">{{ item.title }}</view>
            <view class="favorite-time">{{ formatTime(item.collectTime) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view 
      class="profile-scroll" 
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
    >
      <!-- 个人中心选项 -->
      <view class="profile-options">
        <!-- 账号设置 -->
        <view class="option-group">
          <view class="group-title">账号设置</view>
          <view class="group-items">
            <view class="option-item" @click="handleAccountInfo">
              <view class="option-left">
                <view class="option-icon" style="background: #007AFF;">
                  <text class="iconfont">👤</text>
                </view>
                <view class="option-text">个人信息</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleSecurity">
              <view class="option-left">
                <view class="option-icon" style="background: #4cd964;">
                  <text class="iconfont">🔒</text>
                </view>
                <view class="option-text">账号安全</view>
              </view>
              <view class="option-right">
                <view class="option-status">已保护</view>
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handlePrivacy">
              <view class="option-left">
                <view class="option-icon" style="background: #5856d6;">
                  <text class="iconfont">👁️</text>
                </view>
                <view class="option-text">隐私设置</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleNotification">
              <view class="option-left">
                <view class="option-icon" style="background: #ff9500;">
                  <text class="iconfont">🔔</text>
                </view>
                <view class="option-text">消息通知</view>
              </view>
              <view class="option-right">
                <view v-if="unreadCount > 0" class="option-badge">{{ unreadCount }}</view>
                <text class="iconfont">→</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 应用设置 -->
        <view class="option-group">
          <view class="group-title">应用设置</view>
          <view class="group-items">
            <view class="option-item" @click="handleSettings">
              <view class="option-left">
                <view class="option-icon" style="background: #5ac8fa;">
                  <text class="iconfont">⚙️</text>
                </view>
                <view class="option-text">通用设置</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleTheme">
              <view class="option-left">
                <view class="option-icon" style="background: #ff2d55;">
                  <text class="iconfont">🎨</text>
                </view>
                <view class="option-text">主题设置</view>
              </view>
              <view class="option-right">
                <view class="option-status">{{ currentTheme }}</view>
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleCache">
              <view class="option-left">
                <view class="option-icon" style="background: #8e8e93;">
                  <text class="iconfont">🗃️</text>
                </view>
                <view class="option-text">缓存管理</view>
              </view>
              <view class="option-right">
                <view class="option-status">{{ cacheSize }}</view>
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleUpdate">
              <view class="option-left">
                <view class="option-icon" style="background: #34c759;">
                  <text class="iconfont">🔄</text>
                </view>
                <view class="option-text">版本更新</view>
              </view>
              <view class="option-right">
                <view v-if="hasUpdate" class="update-badge">新版本</view>
                <text class="iconfont">→</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 支持与帮助 -->
        <view class="option-group">
          <view class="group-title">支持与帮助</view>
          <view class="group-items">
            <view class="option-item" @click="handleHelp">
              <view class="option-left">
                <view class="option-icon" style="background: #ffcc00;">
                  <text class="iconfont">❓</text>
                </view>
                <view class="option-text">帮助中心</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleFeedback">
              <view class="option-left">
                <view class="option-icon" style="background: #af52de;">
                  <text class="iconfont">💬</text>
                </view>
                <view class="option-text">反馈建议</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item" @click="handleAbout">
              <view class="option-left">
                <view class="option-icon" style="background: #ff3b30;">
                  <text class="iconfont">ℹ️</text>
                </view>
                <view class="option-text">关于我们</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 账号操作 -->
        <view class="option-group">
          <view class="group-title">账号操作</view>
          <view class="group-items">
            <view class="option-item" @click="handleSwitchAccount">
              <view class="option-left">
                <view class="option-icon" style="background: #007AFF;">
                  <text class="iconfont">🔄</text>
                </view>
                <view class="option-text">切换账号</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item logout" v-if="isLogin" @click="handleLogout">
              <view class="option-left">
                <view class="option-icon" style="background: #ff3b30;">
                  <text class="iconfont">🚪</text>
                </view>
                <view class="option-text">退出登录</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
            
            <view class="option-item cancel" @click="handleCancelAccount">
              <view class="option-left">
                <view class="option-icon" style="background: #999;">
                  <text class="iconfont">🗑️</text>
                </view>
                <view class="option-text">注销账号</view>
              </view>
              <view class="option-right">
                <text class="iconfont">→</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="bottom-tips">
        <view class="tips-content">
          <text class="iconfont">💡</text>
          <text>版本 {{ appVersion }} | 校园助手团队出品</text>
        </view>
      </view>

      <!-- 安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 编辑头像模态框 -->
    <view v-if="showAvatarModal" class="modal-overlay" @click="hideAvatarModal">
      <view class="modal-content avatar-modal" @click.stop>
        <view class="modal-header">
          <text>更换头像</text>
          <view class="modal-close" @click="hideAvatarModal">×</view>
        </view>
        
        <view class="modal-body">
          <view class="avatar-options">
            <view class="avatar-option" @click="handleTakePhoto">
              <view class="option-icon">
                <text class="iconfont">📷</text>
              </view>
              <view class="option-text">拍照</view>
            </view>
            
            <view class="avatar-option" @click="handleChooseImage">
              <view class="option-icon">
                <text class="iconfont">🖼️</text>
              </view>
              <view class="option-text">从相册选择</view>
            </view>
            
            <view class="avatar-option" @click="handleSystemAvatar">
              <view class="option-icon">
                <text class="iconfont">👤</text>
              </view>
              <view class="option-text">系统头像</view>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="hideAvatarModal">取消</view>
        </view>
      </view>
    </view>

    <!-- 编辑信息模态框 -->
    <view v-if="showEditModal" class="modal-overlay" @click="hideEditModal">
      <view class="modal-content edit-modal" @click.stop>
        <view class="modal-header">
          <text>编辑资料</text>
          <view class="modal-close" @click="hideEditModal">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="edit-form">
            <view class="form-item">
              <view class="form-label">昵称</view>
              <view class="input-wrapper">
              <input 
                class="form-input" 
                v-model="editForm.nickname" 
                placeholder="请输入昵称"
                maxlength="20"
                  placeholder-style="color: #bbb"
              />
                <view class="form-count" :class="{ 'near-limit': editForm.nickname.length >= 18 }">
                  {{ editForm.nickname.length }}/20
                </view>
              </view>
            </view>
            
            <view class="form-item">
              <view class="form-label">个性签名</view>
              <view class="textarea-wrapper">
              <textarea 
                class="form-textarea" 
                v-model="editForm.signature" 
                placeholder="请输入个性签名"
                maxlength="50"
                  placeholder-style="color: #bbb"
              />
                <view class="form-count" :class="{ 'near-limit': editForm.signature.length >= 45 }">
                  {{ editForm.signature.length }}/50
                </view>
              </view>
            </view>
            
            <view class="form-item">
              <view class="form-label">性别</view>
              <picker 
                class="form-picker" 
                mode="selector" 
                :range="genderOptions"
                :value="genderIndex"
                @change="onGenderChange"
              >
                <view class="picker-value">{{ editForm.gender }}</view>
              </picker>
            </view>
            
            <view class="form-item">
              <view class="form-label">学院</view>
              <input 
                class="form-input" 
                v-model="editForm.college" 
                placeholder="请输入学院"
              />
            </view>
            
            <view class="form-item">
              <view class="form-label">专业</view>
              <input 
                class="form-input" 
                v-model="editForm.major" 
                placeholder="请输入专业"
              />
            </view>
            
            <view class="form-item">
              <view class="form-label">入学年份</view>
              <picker 
                class="form-picker" 
                mode="selector" 
                :range="yearOptions"
                :value="yearIndex"
                @change="onYearChange"
              >
                <view class="picker-value">{{ editForm.enrollmentYear }}</view>
              </picker>
            </view>
            
            <view class="form-item">
              <view class="form-label">所在学校</view>
              <view class="school-select" @click="showSchoolSelector">
                <view class="school-value">{{ editForm.school }}</view>
                <text class="select-arrow">›</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="hideEditModal">取消</view>
          <view class="footer-btn primary" @click="saveEditInfo">保存</view>
        </view>
      </view>
    </view>

    <!-- 系统头像选择 -->
    <view v-if="showSystemAvatar" class="modal-overlay" @click="hideSystemAvatar">
      <view class="modal-content system-avatar-modal" @click.stop>
        <view class="modal-header">
          <text>选择系统头像</text>
          <view class="modal-close" @click="hideSystemAvatar">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="avatar-grid">
            <view 
              v-for="avatar in systemAvatars" 
              :key="avatar"
              class="avatar-item"
              :class="{ selected: selectedAvatar === avatar }"
              @click="selectSystemAvatar(avatar)"
            >
              <image class="avatar-img" :src="avatar" mode="aspectFill" />
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="hideSystemAvatar">取消</view>
          <view class="footer-btn primary" @click="confirmSystemAvatar">确定</view>
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
            <text class="iconfont">⚠️</text>
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

    <!-- 学校选择器模态框 -->
    <view v-if="showSchoolPicker" class="modal-overlay" @click="hideSchoolPicker">
      <view class="modal-content school-modal" @click.stop>
        <view class="modal-header">
          <text>选择学校</text>
          <view class="modal-close" @click="hideSchoolPicker">×</view>
        </view>
        
        <scroll-view class="modal-body school-list-scroll" scroll-y>
          <view class="school-list">
            <view 
              v-for="school in schoolList" 
              :key="school.id"
              class="school-item"
              :class="{ active: editForm.school === school.name }"
              @click="selectSchool(school)"
            >
              <view class="school-info">
                <text class="school-name">{{ school.name }}</text>
                <text class="school-city">{{ school.city }}</text>
              </view>
              <view v-if="editForm.school === school.name" class="check-icon">✓</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide, onPullDownRefresh } from '@dcloudio/uni-app'
import storage from '@/utils/storage.js'

// 响应式数据
const refreshing = ref(false)
const showAvatarModal = ref(false)
const showEditModal = ref(false)
const showSystemAvatar = ref(false)
const showCancelConfirm = ref(false)
const selectedAvatar = ref('')
const cancelConfirmText = ref('')
const unreadCount = ref(3)
const hasUpdate = ref(true)
const currentTheme = ref('默认')
const cacheSize = ref('12.5MB')
const appVersion = ref('2.1.0')
const genderIndex = ref(0)
const yearIndex = ref(0)
const schoolIndex = ref(0)
const showSchoolPicker = ref(false)
const isLogin = ref(false)
const historyCount = ref(0)
const likesCount = ref(0)
const commentsCount = ref(0)
const registrationsCount = ref(0)
const collectionsCount = ref(0)

// 学校列表
const schoolList = ref([
  { id: 1, name: '浙江大学', city: '杭州' },
  { id: 2, name: '清华大学', city: '北京' },
  { id: 3, name: '北京大学', city: '北京' },
  { id: 4, name: '复旦大学', city: '上海' },
  { id: 5, name: '上海交通大学', city: '上海' },
  { id: 6, name: '南京大学', city: '南京' },
  { id: 7, name: '武汉大学', city: '武汉' },
  { id: 8, name: '中山大学', city: '广州' },
  { id: 9, name: '四川大学', city: '成都' },
  { id: 10, name: '西安交通大学', city: '西安' }
])

// 用户信息
const userInfo = ref({
  id: 1001,
  nickname: '未登录',
  studentId: '',
  avatar: '/static/images/生成动物写实头像.png', // 默认狐狸头像
  online: false,
  vip: false,
  verified: false,
  signature: '',
  tags: [],
  following: 0,
  followers: 0,
  dynamicCount: 0,
  points: 0,
  gender: '男',
  college: '',
  major: '',
  enrollmentYear: '',
  school: '',
  name: '',
  className: '',
  phone: ''
})

// 编辑表单
const editForm = ref({
  nickname: '张三',
  signature: '热爱生活，热爱学习，永远保持好奇心！',
  gender: '男',
  college: '计算机学院',
  major: '计算机科学与技术',
  enrollmentYear: '2022',
  school: '浙江大学'
})

// 快速入口
const quickAccess = ref([
  { id: 1, name: '我的发布', icon: 'icon-post', color: '#007AFF', badge: null, route: null, needLogin: true },
  { id: 2, name: '我的订单', icon: 'icon-order', color: '#4cd964', badge: 0, route: null, needLogin: true },
  { id: 3, name: '我的钱包', icon: 'icon-wallet', color: '#ff9500', badge: null, route: null, needLogin: true },
  { id: 4, name: '我的收藏', icon: 'icon-favorite', color: '#5856d6', badge: 0, route: '/pages/user/collections', needLogin: true },
  { id: 5, name: '我的足迹', icon: 'icon-history', color: '#ff2d55', badge: null, route: '/pages/user/history', needLogin: true },
  { id: 6, name: '我的消息', icon: 'icon-message', color: '#5ac8fa', badge: 0, route: null, needLogin: true },
  { id: 7, name: '我的课程', icon: 'icon-course', color: '#ffcc00', badge: null, route: null, needLogin: true },
  { id: 8, name: '我的证书', icon: 'icon-certificate', color: '#af52de', badge: 0, route: null, needLogin: true }
])

// 我的报名
const myRegistrations = ref([])

// 我的活动
const myActivities = ref([])

// 我的资讯
const myNews = ref([])

// 我的收藏
const myFavorites = ref([])

// 系统头像 - 使用本地动物头像（默认头像是狐狸）
const systemAvatars = ref([
  '/static/images/生成动物写实头像.png', // 狐狸（默认头像）
  '/static/images/生成动物写实头像 (1).png', // 大象
  '/static/images/生成动物写实头像 (2).png', // 老虎
  '/static/images/生成动物写实头像 (3).png', // 狮子
  '/static/images/生成动物写实头像 (4).png', // 熊
  '/static/images/生成动物写实头像 (5).png', // 猫
  '/static/images/生成动物写实头像 (6).png', // 兔子
  '/static/images/生成动物写实头像 (7).png', // 狗
  '/static/images/生成动物写实头像 (8).png', // 熊猫
  '/static/images/生成动物写实头像 (9).png'  // 企鹅
])

// 选项
const genderOptions = ref(['男', '女', '保密'])
const yearOptions = ref(['2020', '2021', '2022', '2023', '2024'])

// 工具函数
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const getActivityStatusClass = (status) => {
  switch(status) {
    case 'registered': return 'status-registered'
    case 'participated': return 'status-participated'
    case 'finished': return 'status-finished'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

const getActivityStatusText = (status) => {
  switch(status) {
    case 'registered': return '已报名'
    case 'participated': return '已参与'
    case 'finished': return '已结束'
    case 'cancelled': return '已取消'
    default: return ''
  }
}

const getRegistrationStatusClass = (status) => {
  switch(status) {
    case 'joined': return 'status-joined'
    case 'pending': return 'status-pending'
    case 'approved': return 'status-approved'
    case 'rejected': return 'status-rejected'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

const getRegistrationStatusText = (status) => {
  switch(status) {
    case 'joined': return '已报名'
    case 'pending': return '审核中'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    case 'cancelled': return '已取消'
    default: return ''
  }
}

// 事件处理
const handleEditAvatar = () => {
  showAvatarModal.value = true
}

const hideAvatarModal = () => {
  showAvatarModal.value = false
}

const handleTakePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 这里应该上传图片到服务器
      userInfo.value.avatar = tempFilePath
      uni.showToast({ title: '头像更新成功', icon: 'success' })
      hideAvatarModal()
    }
  })
}

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 这里应该上传图片到服务器
      userInfo.value.avatar = tempFilePath
      uni.showToast({ title: '头像更新成功', icon: 'success' })
      hideAvatarModal()
    }
  })
}

const handleSystemAvatar = () => {
  showAvatarModal.value = false
  setTimeout(() => {
    showSystemAvatar.value = true
  }, 300)
}

const hideSystemAvatar = () => {
  showSystemAvatar.value = false
}

const selectSystemAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

const confirmSystemAvatar = () => {
  if (selectedAvatar.value) {
    userInfo.value.avatar = selectedAvatar.value
    uni.showToast({ title: '头像更新成功', icon: 'success' })
    hideSystemAvatar()
  }
}

const handleEditInfo = () => {
  // 同步当前用户信息到编辑表单
  editForm.value = {
    nickname: userInfo.value.nickname,
    signature: userInfo.value.signature,
    gender: userInfo.value.gender,
    college: userInfo.value.college,
    major: userInfo.value.major,
    enrollmentYear: userInfo.value.enrollmentYear,
    school: userInfo.value.school
  }
  
  // 设置选择器索引
  genderIndex.value = genderOptions.value.indexOf(userInfo.value.gender)
  yearIndex.value = yearOptions.value.indexOf(userInfo.value.enrollmentYear)
  
  showEditModal.value = true
}

const hideEditModal = () => {
  showEditModal.value = false
}

const onGenderChange = (e) => {
  genderIndex.value = e.detail.value
  editForm.value.gender = genderOptions.value[e.detail.value]
}

const onYearChange = (e) => {
  yearIndex.value = e.detail.value
  editForm.value.enrollmentYear = yearOptions.value[e.detail.value]
}

// 学校选择相关方法
const showSchoolSelector = () => {
  showSchoolPicker.value = true
}

const hideSchoolPicker = () => {
  showSchoolPicker.value = false
}

const selectSchool = (school) => {
  editForm.value.school = school.name
  // 同时更新本地存储，供首页读取
  uni.setStorageSync('userSchool', school)
  hideSchoolPicker()
  uni.showToast({ title: `已选择${school.name}`, icon: 'success' })
}

const saveEditInfo = () => {
  // 这里应该调用API保存用户信息
  userInfo.value = {
    ...userInfo.value,
    ...editForm.value
  }
  
  // 如果学校改变，更新本地存储
  const school = schoolList.value.find(s => s.name === editForm.value.school)
  if (school) {
    uni.setStorageSync('userSchool', school)
  }
  
  uni.showToast({ title: '个人信息已更新', icon: 'success' })
  hideEditModal()
}

const handleQuickAccess = (item) => {
  // 检查是否需要登录
  if (item.needLogin && !isLogin.value) {
    checkLoginRequired()
    return
  }
  
  // 如果有路由，直接跳转
  if (item.route) {
    uni.navigateTo({ url: item.route })
    return
  }
  
  // 根据ID跳转
  const routeMap = {
    1: null, // 我的发布 - 功能开发中
    2: null, // 我的订单 - 功能开发中
    3: null, // 我的钱包 - 功能开发中
    4: '/pages/user/collections', // 我的收藏
    5: '/pages/user/history', // 我的足迹
    6: null, // 我的消息 - 功能开发中
    7: null, // 我的课程 - 功能开发中
    8: null // 我的证书 - 功能开发中
  }
  
  if (routeMap[item.id]) {
    uni.navigateTo({ url: routeMap[item.id] })
  } else {
    uni.showToast({ 
      title: `${item.name}功能开发中`, 
      icon: 'none',
      duration: 2000
    })
  }
}

const handleCustomize = () => {
  uni.showToast({ 
    title: '自定义功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleRegistrationClick = (registration) => {
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/detail/index?id=${registration.newsId}`
  })
}

const viewAllRegistrations = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({ url: '/pages/user/registrations' })
}

const handleActivityClick = (activity) => {
  uni.navigateTo({
    url: `/pages/tabbar/activity/subpages/detail/index?id=${activity.id}`
  })
}

const viewAllActivities = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '我的活动功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleNewsClick = (news) => {
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/detail/index?id=${news.id}`
  })
}

const viewAllNews = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '我的资讯功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleFavoriteClick = (item) => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: `/pages/tabbar/news/subpages/detail/index?id=${item.id}`
  })
}

const viewAllFavorites = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({ url: '/pages/user/collections' })
}

const handleFollow = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '关注列表功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleFans = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '粉丝列表功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleDynamic = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '动态功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handlePoints = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '积分功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleRefresh = () => {
  refreshing.value = true
  checkLogin()
  loadStatistics()
  loadProfileData(true)
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

const handleAccountInfo = () => {
  if (!checkLoginRequired()) return
  // 显示编辑信息弹窗
  handleEditInfo()
}

const handleSecurity = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '账号安全功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handlePrivacy = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '隐私设置功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleNotification = () => {
  if (!checkLoginRequired()) return
  uni.showToast({ 
    title: '消息通知功能开发中', 
    icon: 'none',
    duration: 2000
  })
  unreadCount.value = 0
}

const handleSettings = () => {
  uni.showToast({ 
    title: '通用设置功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleTheme = () => {
  uni.showToast({ 
    title: '主题设置功能开发中', 
    icon: 'none',
    duration: 2000
  })
}

const handleCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: `当前缓存大小：${cacheSize.value}\n确定要清理所有缓存吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中...' })
        
        // 清理各种缓存数据
        try {
          // 清理图片缓存
          // #ifdef APP-PLUS
          const imgCachePath = plus.io.getFileSystemSync().getFileSystemSync().getRootPath() + '/_doc/cache/'
          // #endif
          
          // 清理本地存储的临时数据（保留必要的用户数据）
          const keys = ['tempCache', 'imageCache', 'newsCache', 'activityCache']
          keys.forEach(key => {
            storage.remove(key)
          })
          
          // 清理旧的浏览历史缓存（超过30天的）
          const history = storage.get('browsingHistory') || []
          const now = Date.now()
          const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
          const filteredHistory = history.filter(item => {
            const itemTime = item.timestamp || item.time || 0
            return itemTime > thirtyDaysAgo
          })
          storage.set('browsingHistory', filteredHistory)
          
          // 更新缓存大小显示
          cacheSize.value = '0MB'
          
          setTimeout(() => {
            uni.hideLoading()
            uni.showToast({ title: '缓存已清理', icon: 'success' })
            
            // 刷新统计数据
            loadStatistics()
          }, 800)
        } catch (error) {
          uni.hideLoading()
          console.error('清理缓存失败:', error)
          uni.showToast({ title: '清理失败，请重试', icon: 'none' })
        }
      }
    }
  })
}

const handleUpdate = () => {
  if (hasUpdate.value) {
    uni.showModal({
      title: '发现新版本',
      content: '版本2.2.0已发布，是否立即更新？',
      success: (res) => {
        if (res.confirm) {
          uni.showLoading({ title: '更新中' })
          setTimeout(() => {
            uni.hideLoading()
            hasUpdate.value = false
            appVersion.value = '2.2.0'
            uni.showToast({ title: '更新成功', icon: 'success' })
          }, 1500)
        }
      }
    })
  } else {
    uni.showToast({ title: '当前已是最新版本', icon: 'none' })
  }
}

const handleHelp = () => {
  uni.showModal({
    title: '帮助与支持',
    content: '如有问题，请联系客服\n客服电话：400-xxx-xxxx\n客服邮箱：support@example.com',
    showCancel: false
  })
}

const handleFeedback = () => {
  uni.showModal({
    title: '意见反馈',
    content: '感谢您的反馈！\n\n您可以通过以下方式联系我们：\n1. 发送邮件至 feedback@example.com\n2. 在应用内提交反馈\n\n我们会认真处理每一条反馈。',
    showCancel: false
  })
}

const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '校园资讯App v2.1.0\n\n为师生提供便捷的校园资讯服务\n\n开发者：校园资讯团队\n© 2024 校园资讯',
    showCancel: false
  })
}

const handleSwitchAccount = () => {
  if (!checkLoginRequired()) return
  uni.showModal({
    title: '切换账号',
    content: '确定要切换账号吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除当前登录状态
        storage.remove('userInfo')
        storage.remove('token')
        isLogin.value = false
        checkLogin()
        loadStatistics()
        // 跳转到登录页面
        uni.redirectTo({ url: '/pages/user/login' })
      }
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) {
          // 清除登录状态
        storage.remove('userInfo')
        storage.remove('token')
        isLogin.value = false
        checkLogin()
        loadStatistics()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}

const handleCancelAccount = () => {
  showCancelConfirm.value = true
}

const hideCancelConfirm = () => {
  showCancelConfirm.value = false
  cancelConfirmText.value = ''
}

const confirmCancelAccount = () => {
  if (cancelConfirmText.value !== '确认注销') {
    uni.showToast({ title: '请输入"确认注销"', icon: 'none' })
    return
  }
  
  uni.showModal({
    title: '确认注销账号',
    content: '账号注销后所有数据将被永久删除，此操作不可恢复！',
    confirmText: '确认注销',
    confirmColor: '#ff3b30',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '注销中' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '账号已注销', icon: 'success' })
          // 清除所有数据
          uni.clearStorageSync()
          // 跳转到登录页
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/index' })
          }, 1000)
        }, 1500)
      }
    }
  })
}

// 数据加载
const loadProfileData = (force = false) => {
  if (force) {
    uni.showLoading({ title: '加载中' })
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({ title: '数据已更新', icon: 'success' })
    }, 500)
  }
}

// 检查登录状态
const checkLogin = () => {
  const savedUserInfo = storage.get('userInfo')
  if (savedUserInfo) {
    isLogin.value = true
    userInfo.value = {
      ...userInfo.value,
      ...savedUserInfo,
      nickname: savedUserInfo.nickname || savedUserInfo.name || '用户',
      avatar: savedUserInfo.avatar || '/static/images/生成动物写实头像.png'
    }
  } else {
    isLogin.value = false
    userInfo.value = {
      id: 0,
      nickname: '未登录',
      studentId: '',
      avatar: '/static/images/生成动物写实头像.png', // 默认狐狸头像
      online: false,
      vip: false,
      verified: false,
      signature: '',
      tags: [],
      following: 0,
      followers: 0,
      dynamicCount: 0,
      points: 0,
      gender: '男',
      college: '',
      major: '',
      enrollmentYear: '',
      school: '',
      name: '',
      className: '',
      phone: ''
    }
  }
}

// 加载统计数据
const loadStatistics = () => {
  if (!isLogin.value) {
    historyCount.value = 0
    commentsCount.value = 0
    registrationsCount.value = 0
    collectionsCount.value = 0
    // 清空数据
    myRegistrations.value = []
    myFavorites.value = []
    myNews.value = []
    myActivities.value = []
    // 更新快速入口徽章
    updateQuickAccessBadges()
    return
  }
  
  const history = storage.get('browsingHistory') || []
  const likedNews = storage.get('likedNews') || []
  const comments = storage.get('myComments') || []
  const registrations = storage.get('myRegistrations') || []
  const collections = storage.get('myCollections') || []
  
  historyCount.value = history.length
  likesCount.value = likedNews.length
  commentsCount.value = comments.length
  registrationsCount.value = registrations.length
  collectionsCount.value = collections.length
  
  // 加载我的报名数据（最多显示3条）
  myRegistrations.value = registrations.slice(0, 3).map(item => ({
    id: item.id || item.newsId || item.activityId,
    title: item.title || item.activityTitle || '活动报名',
    cover: item.cover || item.coverImage || '/static/images/default-cover.jpg',
    registrationTime: item.registerTime || item.joinTime || new Date().toISOString(),
    status: item.status || 'joined',
    newsId: item.newsId || item.activityId || item.id
  }))
  
  // 加载我的收藏数据（最多显示3条）
  myFavorites.value = collections.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title,
    cover: item.cover || item.coverImage || '/static/images/default-cover.jpg',
    collectTime: item.collectTime || new Date().toISOString(),
    type: item.category || '资讯'
  }))
  
  // 更新快速入口徽章
  updateQuickAccessBadges()
}

// 更新快速入口徽章数量
const updateQuickAccessBadges = () => {
  if (!isLogin.value) {
    quickAccess.value.forEach(item => {
      if (item.id === 4) item.badge = 0 // 我的收藏
      if (item.id === 5) item.badge = null // 我的足迹
      if (item.id === 6) item.badge = 0 // 我的消息
      if (item.id === 8) item.badge = 0 // 我的证书
    })
    return
  }
  
  const collections = storage.get('myCollections') || []
  const history = storage.get('browsingHistory') || []
  
  quickAccess.value.forEach(item => {
    if (item.id === 4) { // 我的收藏
      item.badge = collections.length > 0 ? collections.length : null
    } else if (item.id === 5) { // 我的足迹
      item.badge = history.length > 0 ? history.length : null
    } else if (item.id === 6) { // 我的消息
      item.badge = 0 // 可以从消息存储中获取
    } else if (item.id === 8) { // 我的证书
      item.badge = 0 // 可以从证书存储中获取
    }
  })
}

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login'
  })
}

// 跳转到浏览历史
const goToHistory = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: '/pages/user/history'
  })
}

// 跳转到我的点赞
const goToLikes = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: '/pages/user/likes'
  })
}

// 跳转到我的评论
const goToComments = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: '/pages/user/comments'
  })
}

// 跳转到我的报名
const goToRegistrations = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: '/pages/user/registrations'
  })
}

// 跳转到我的收藏
const goToCollections = () => {
  if (!checkLoginRequired()) return
  uni.navigateTo({
    url: '/pages/user/collections'
  })
}

// 检查是否需要登录
const checkLoginRequired = () => {
  if (!isLogin.value) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          goToLogin()
        }
      }
    })
    return false
  }
  return true
}

// 生命周期
onLoad(() => {
  checkLogin()
  loadStatistics()
  loadProfileData(true)
})

onShow(() => {
  // 检查登录状态并加载数据
  checkLogin()
  loadStatistics()
  
  // 页面显示时刷新数据
  if (uni.getStorageSync('needRefreshProfile')) {
    uni.removeStorageSync('needRefreshProfile')
    loadProfileData(true)
  }
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.profile-index-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f7;
}

.user-header {
  position: relative;
  padding: 60rpx 30rpx 40rpx;
  color: #fff;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 320rpx;
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    filter: brightness(0.6);
    opacity: 0.3;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 20rpx 0 30rpx;
    position: relative;
    z-index: 1;
    
    &.login-prompt {
      gap: 25rpx;
      cursor: pointer;
      
      .avatar-placeholder {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 4rpx solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
      }
    }
    
    .user-avatar-section {
      position: relative;
      margin-right: 30rpx;
      
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
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
      
      .edit-avatar-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40rpx;
        height: 40rpx;
        background: #007AFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        border: 2rpx solid #fff;
      }
    }
    
    .user-basic {
      flex: 1;
      
      .user-name-section {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        gap: 12rpx;
        
        .user-name {
          font-size: 38rpx;
          font-weight: 600;
          letter-spacing: 0.5rpx;
        }
        
        .vip-badge {
          padding: 4rpx 12rpx;
          background: linear-gradient(45deg, #ff9500, #ff3b30);
          border-radius: 20rpx;
          font-size: 20rpx;
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
        }
        
        .edit-btn {
          width: 40rpx;
          height: 40rpx;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
        }
      }
      
      .user-id {
        font-size: 26rpx;
        opacity: 0.95;
        margin-bottom: 10rpx;
        line-height: 1.4;
      }
      
      .user-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        margin-bottom: 12rpx;
        
        .user-tag {
          padding: 6rpx 14rpx;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 20rpx;
          font-size: 22rpx;
          font-weight: 500;
        }
      }
      
      .user-signature {
        font-size: 26rpx;
        opacity: 0.95;
        line-height: 1.5;
        margin-top: 8rpx;
      }
    }
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20rpx);
    border-radius: 24rpx;
    padding: 35rpx 20rpx;
    position: relative;
    z-index: 1;
    margin-top: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.95);
      }
      
      .stat-value {
        font-size: 40rpx;
        font-weight: 700;
        color: #fff;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 24rpx;
        opacity: 0.95;
        color: rgba(255, 255, 255, 0.95);
        letter-spacing: 0.5rpx;
      }
    }
  }
}

.quick-access-section {
  background: #fff;
  border-radius: 24rpx;
  margin: 24rpx 20rpx 0;
  padding: 32rpx 28rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .section-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #007AFF;
      font-weight: 500;
    }
  }
  
  .access-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24rpx 16rpx;
    
    .access-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14rpx;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.95);
      }
      
      .access-icon {
        position: relative;
        width: 88rpx;
        height: 88rpx;
        border-radius: 22rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 44rpx;
        color: #fff;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
        
        &:active {
          transform: scale(0.9);
        }
        
        .access-badge {
          position: absolute;
          top: -6rpx;
          right: -6rpx;
          min-width: 32rpx;
          height: 32rpx;
          padding: 0 8rpx;
          background: #ff3b30;
          color: #fff;
          border-radius: 16rpx;
          font-size: 20rpx;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2rpx solid #fff;
          box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.3);
        }
      }
      
      .access-text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        line-height: 1.3;
        font-weight: 500;
        letter-spacing: 0.3rpx;
      }
    }
  }
}

.my-registrations-section,
.my-activities-section,
.my-news-section,
.my-favorites-section {
  background: #fff;
  border-radius: 24rpx;
  margin: 24rpx 20rpx 0;
  padding: 32rpx 28rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .section-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #007AFF;
      font-weight: 500;
    }
  }
  
  .registrations-scroll,
  .activities-scroll,
  .news-scroll,
  .favorites-scroll {
    white-space: nowrap;
    
      .registration-item,
    .activity-item,
    .news-item,
    .favorite-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;
      background: #f9f9f9;
        border-radius: 18rpx;
      overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
      
        &:active {
          transform: scale(0.98);
        }
        
        .registration-img,
      .activity-img,
      .news-img,
      .favorite-img {
        position: relative;
        width: 100%;
        height: 120rpx;
        
        image {
          width: 100%;
          height: 100%;
        }
        
        .registration-status,
        .activity-status,
        .new-badge,
        .favorite-type {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #fff;
        }
        
        .registration-status {
          &.status-joined {
            background: #007AFF;
          }
          
          &.status-pending {
            background: #ff9500;
          }
          
          &.status-approved {
            background: #4cd964;
          }
          
          &.status-rejected {
            background: #ff3b30;
          }
          
          &.status-cancelled {
            background: #999;
          }
        }
        
        .activity-status {
          &.status-registered {
            background: #007AFF;
          }
          
          &.status-participated {
            background: #4cd964;
          }
          
          &.status-finished {
            background: #999;
          }
        }
        
        .new-badge {
          background: #ff3b30;
        }
        
        .favorite-type {
          background: rgba(0, 0, 0, 0.6);
        }
      }
      
      .registration-info,
      .activity-info,
      .news-info,
      .favorite-info {
        padding: 20rpx;
        
        .registration-title,
        .activity-title,
        .news-title,
        .favorite-title {
          font-size: 26rpx;
          color: #1a1a1a;
          font-weight: 500;
          margin-bottom: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
        }
        
        .registration-time,
        .activity-time,
        .news-time,
        .favorite-time {
          font-size: 22rpx;
          color: #999;
          line-height: 1.3;
        }
      }
    }
  }
}

.profile-scroll {
  flex: 1;
  height: 0;
  padding: 0 0 120rpx;
}

.profile-options {
  .option-group {
    background: #fff;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
    
    .group-title {
      padding: 32rpx 30rpx 24rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .group-items {
      .option-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 28rpx 30rpx;
        border-top: 1rpx solid #f5f5f5;
        transition: background-color 0.2s;
        
        &:active {
          background-color: #f8f8f8;
        }
        
        &:first-child {
          border-top: none;
        }
        
        &.logout {
          .option-text {
            color: #ff3b30;
          }
        }
        
        &.cancel {
          .option-text {
            color: #999;
          }
        }
        
        .option-left {
          display: flex;
          align-items: center;
          gap: 24rpx;
          flex: 1;
          
          .option-icon {
            width: 64rpx;
            height: 64rpx;
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36rpx;
            color: #fff;
            flex-shrink: 0;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
          }
          
          .option-text {
            font-size: 30rpx;
            color: #1a1a1a;
            font-weight: 500;
            letter-spacing: 0.3rpx;
          }
        }
        
        .option-right {
          display: flex;
          align-items: center;
          gap: 16rpx;
          font-size: 24rpx;
          color: #999;
          
          .option-status {
            color: #4cd964;
            font-size: 26rpx;
            font-weight: 500;
          }
          
          .option-badge {
            min-width: 36rpx;
            height: 36rpx;
            padding: 0 10rpx;
            background: #ff3b30;
            color: #fff;
            border-radius: 18rpx;
            font-size: 22rpx;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.3);
          }
          
          .update-badge {
            padding: 4rpx 12rpx;
            background: #4cd964;
            color: #fff;
            border-radius: 20rpx;
            font-size: 20rpx;
          }
        }
      }
    }
  }
}

.bottom-tips {
  text-align: center;
  padding: 40rpx 0;
  
  .tips-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.safe-area {
  height: 120rpx;
}

// 模态框样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .modal-content {
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;
    width: 100%;
    max-width: 680rpx;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;
    
    @keyframes slideUp {
      from {
        transform: translateY(100rpx);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

.avatar-modal {
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
    
    .avatar-options {
      .avatar-option {
        display: flex;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .option-icon {
          width: 60rpx;
          height: 60rpx;
          border-radius: 12rpx;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32rpx;
          color: #666;
          margin-right: 20rpx;
        }
        
        .option-text {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }
  
  .modal-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .footer-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #f5f5f5;
      color: #666;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}

.edit-modal {
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48rpx 32rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
    background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
    }
    
    text {
      font-size: 36rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .modal-close {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44rpx;
      color: #666;
      border-radius: 50%;
      background: #f5f5f5;
      transition: all 0.2s;
      
      &:active {
        background: #e5e5e5;
        transform: scale(0.95);
      }
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 65vh;
    padding: 36rpx 32rpx;
    background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.2) 50%, transparent 100%);
    }
    
    .edit-form {
      .form-item {
        margin-bottom: 40rpx;
        position: relative;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        // 为每个表单项添加淡入动画
        &:nth-child(1) {
          animation: fadeInItem 0.4s ease-out 0.05s both;
        }
        &:nth-child(2) {
          animation: fadeInItem 0.4s ease-out 0.1s both;
        }
        &:nth-child(3) {
          animation: fadeInItem 0.4s ease-out 0.15s both;
        }
        &:nth-child(4) {
          animation: fadeInItem 0.4s ease-out 0.2s both;
        }
        &:nth-child(5) {
          animation: fadeInItem 0.4s ease-out 0.25s both;
        }
        &:nth-child(6) {
          animation: fadeInItem 0.4s ease-out 0.3s both;
        }
        &:nth-child(7) {
          animation: fadeInItem 0.4s ease-out 0.35s both;
        }
        &:nth-child(8) {
          animation: fadeInItem 0.4s ease-out 0.4s both;
        }
        
        @keyframes fadeInItem {
          from {
            opacity: 0;
            transform: translateY(10rpx);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-label {
          font-size: 28rpx;
          color: #1a1a1a;
          margin-bottom: 18rpx;
          font-weight: 600;
          letter-spacing: 0.3rpx;
          display: flex;
          align-items: center;
          position: relative;
          
          &::before {
            content: '';
            width: 5rpx;
            height: 26rpx;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            border-radius: 3rpx;
            margin-right: 14rpx;
            box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
            transition: all 0.3s;
          }
          
        }
        
        .form-input {
          width: 100%;
          height: 88rpx;
          padding: 0 24rpx;
          padding-right: 100rpx;
          background: #f8f9fa;
          border: 2rpx solid transparent;
          border-radius: 16rpx;
          font-size: 30rpx;
          color: #1a1a1a;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          font-weight: 500;
          
          &::placeholder {
            color: #bbb;
            font-weight: 400;
          }
          
          &:focus {
            background: #fff;
            border-color: #667eea;
            box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1), 0 4rpx 12rpx rgba(102, 126, 234, 0.08);
            transform: translateY(-1rpx);
          }
        }
        
        .form-textarea {
          width: 100%;
          min-height: 180rpx;
          padding: 24rpx;
          padding-bottom: 60rpx;
          background: #f8f9fa;
          border: 2rpx solid transparent;
          border-radius: 16rpx;
          font-size: 30rpx;
          color: #1a1a1a;
          line-height: 1.8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          font-weight: 500;
          resize: none;
          
          &::placeholder {
            color: #bbb;
            font-weight: 400;
          }
          
          &:focus {
            background: #fff;
            border-color: #667eea;
            box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1), 0 4rpx 12rpx rgba(102, 126, 234, 0.08);
            transform: translateY(-1rpx);
          }
        }
        
        .form-picker {
          .picker-value {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            padding: 0 24rpx;
            background: #f8f9fa;
            border: 2rpx solid transparent;
            border-radius: 16rpx;
            font-size: 30rpx;
            color: #1a1a1a;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            
            &::after {
              content: '›';
              font-size: 40rpx;
              color: #999;
              font-weight: 300;
              transition: transform 0.3s;
            }
            
            &:active {
              background: #f0f0f0;
              transform: scale(0.98);
              
              &::after {
                transform: translateX(4rpx);
              }
            }
          }
        }
        
        .school-select {
          width: 100%;
          height: 88rpx;
          padding: 0 24rpx;
          background: #f8f9fa;
          border: 2rpx solid transparent;
          border-radius: 16rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          
          &:active {
            background: #f0f0f0;
            transform: scale(0.98);
            
            .select-arrow {
              transform: translateX(4rpx);
            }
          }
          
          .school-value {
            flex: 1;
            font-size: 30rpx;
            color: #1a1a1a;
            font-weight: 500;
          }
          
          .select-arrow {
            font-size: 40rpx;
            color: #999;
            font-weight: 300;
            transition: transform 0.3s;
          }
        }
        
        .input-wrapper,
        .textarea-wrapper {
          position: relative;
        }
        
        .form-count {
          position: absolute;
          bottom: 20rpx;
          right: 24rpx;
          font-size: 22rpx;
          color: #999;
          background: rgba(255, 255, 255, 0.95);
          padding: 6rpx 14rpx;
          border-radius: 12rpx;
          font-weight: 500;
          backdrop-filter: blur(10rpx);
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          z-index: 1;
          pointer-events: none;
          
          &.near-limit {
            color: #ff9500;
            background: rgba(255, 149, 0, 0.15);
            font-weight: 600;
            box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.2);
          }
        }
      }
    }
  }
  
  .modal-footer {
    display: flex;
    padding: 24rpx 32rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #f5f5f5;
    gap: 20rpx;
    background: #fff;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
    }
    
    .footer-btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 600;
      transition: all 0.3s;
      letter-spacing: 0.5rpx;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
        
        &:active {
          background: #e5e5e5;
          transform: scale(0.98);
        }
      }
      
      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
        
        &:active {
          transform: scale(0.98);
          box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.25);
        }
      }
    }
  }
}

.system-avatar-modal {
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48rpx 32rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
    background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
    }
    
    text {
      font-size: 36rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .modal-close {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44rpx;
      color: #666;
      border-radius: 50%;
      background: #f5f5f5;
      transition: all 0.2s;
      
      &:active {
        background: #e5e5e5;
        transform: scale(0.95);
      }
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 24rpx 32rpx;
    
    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24rpx;
      padding: 20rpx;
      
      .avatar-item {
        aspect-ratio: 1;
        border-radius: 20rpx;
        overflow: hidden;
        border: 4rpx solid transparent;
        background: #f8f9fa;
        transition: all 0.3s;
        cursor: pointer;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        
        &:active {
          transform: scale(0.95);
        }
        
        &.selected {
          border-color: #667eea;
          box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.2), 0 4rpx 16rpx rgba(102, 126, 234, 0.15);
          transform: scale(1.05);
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  
  .modal-footer {
    display: flex;
    padding: 24rpx 32rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #f5f5f5;
    gap: 20rpx;
    background: #fff;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
    }
    
    .footer-btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 600;
      transition: all 0.3s;
      letter-spacing: 0.5rpx;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
        
        &:active {
          background: #e5e5e5;
          transform: scale(0.98);
        }
      }
      
      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
        
        &:active {
          transform: scale(0.98);
          box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.25);
        }
      }
    }
  }
}

.cancel-modal {
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
    
    .warning-icon {
      text-align: center;
      font-size: 60rpx;
      margin-bottom: 20rpx;
    }
    
    .warning-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      text-align: center;
    }
    
    .warning-list {
      margin-bottom: 30rpx;
      
      .warning-item {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
        padding-left: 20rpx;
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
      margin-top: 20rpx;
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
      
      &.danger {
        background: #ff3b30;
        color: #fff;
        
        &.disabled {
          opacity: 0.5;
        }
      }
    }
  }
}

// 学校选择器样式
.school-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  
  .school-value {
    font-size: 28rpx;
    color: #333;
  }
  
  .select-arrow {
    font-size: 32rpx;
    color: #999;
  }
}

.school-modal {
  max-height: 70vh;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48rpx 32rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
    background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rpx;
      background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
    }
    
    text {
      font-size: 36rpx;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.5rpx;
    }
    
    .modal-close {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44rpx;
      color: #666;
      border-radius: 50%;
      background: #f5f5f5;
      transition: all 0.2s;
      
      &:active {
        background: #e5e5e5;
        transform: scale(0.95);
      }
    }
  }
  
  .school-list-scroll {
    max-height: 60vh;
    padding: 0 24rpx;
  }
  
  .school-list {
    .school-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      margin-bottom: 12rpx;
      background: #f8f9fa;
      border: 2rpx solid transparent;
      border-radius: 16rpx;
      transition: all 0.3s;
      cursor: pointer;
      
      &:active {
        transform: scale(0.98);
        background: #f0f0f0;
      }
      
      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-color: #667eea;
        box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.15);
        
        .school-name {
          color: #667eea;
          font-weight: 600;
        }
        
        .check-icon {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 50%;
          font-size: 24rpx;
          font-weight: bold;
        }
      }
      
      .school-info {
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .school-name {
          font-size: 32rpx;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: 0.3rpx;
        }
        
        .school-city {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .check-icon {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: bold;
        box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}
</style>