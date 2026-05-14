<!--
 * 文件路径: pages/tabbar/function/index.vue
 * 功能说明: 功能中心页面
 * 主要功能:
 *   1. 显示校园功能入口（天气、课程表、图书馆、食堂、地图等）
 *   2. 功能分类展示
 *   3. 快捷功能入口
 * 相关页面:
 *   - pages/tabbar/function/subpages/weather/index.vue (天气)
 *   - pages/tabbar/function/subpages/calendar/index.vue (课程表)
 *   - pages/tabbar/function/subpages/library/index.vue (图书馆)
 *   - pages/tabbar/function/subpages/canteen/index.vue (食堂)
 *   - pages/tabbar/function/subpages/map/index.vue (校园地图)
 -->
<template>
  <view class="function-container">
    <!-- 功能头部 -->
    <view class="function-header">
      <view class="header-content">
        <view class="header-left">
          <view class="header-title">功能中心</view>
          <view class="header-subtitle">一站式校园服务</view>
        </view>
        <view class="header-right">
          <view class="header-icon" @click="handleSearch">
            <text class="iconfont">🔍</text>
          </view>
          <view class="header-icon" @click="showSettings = true">
            <text class="iconfont">⚙️</text>
          </view>
          <view class="header-icon" @click="handleAdd">
            <text class="iconfont">+</text>
          </view>
        </view>
      </view>
      
      <!-- 搜索框 -->
      <view v-if="showSearch" class="search-bar">
        <view class="search-input-wrapper">
          <text class="iconfont">🔍</text>
          <input 
            class="search-input" 
            placeholder="搜索功能..." 
            v-model="searchKeyword"
            @confirm="handleSearchConfirm"
            :focus="showSearch"
          />
          <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</view>
        </view>
        <view class="search-cancel" @click="hideSearch">取消</view>
      </view>
    </view>

    <!-- 功能分类 -->
    <scroll-view class="category-tabs" scroll-x>
      <view 
        class="tab-item" 
        :class="{ active: currentCategory === item.value }"
        v-for="item in categories" 
        :key="item.value"
        @click="handleCategoryChange(item.value)"
      >
        <view class="tab-icon">
          <text class="iconfont" :class="item.icon"></text>
        </view>
        <text class="tab-text">{{ item.label }}</text>
      </view>
    </scroll-view>

    <!-- 功能内容区域 -->
    <scroll-view 
      class="function-scroll"
      scroll-y
      @scrolltolower="handleLoadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
    >
      <!-- 常用功能 -->
      <view v-if="commonFunctions.length > 0" class="section-common">
        <view class="section-header">
          <view class="section-title">常用功能</view>
          <view class="section-more" @click="goToCommon">
            <text>管理</text>
            <text class="iconfont">→</text>
          </view>
        </view>
        <view class="common-grid">
          <view 
            v-for="item in commonFunctions" 
            :key="item.id"
            class="common-item"
            @click="handleFunctionClick(item)"
          >
            <view class="common-icon" :style="{ background: item.color }">
              <text class="iconfont" :class="item.icon"></text>
            </view>
            <view class="common-text">{{ item.name }}</view>
          </view>
        </view>
      </view>

      <!-- 推荐功能 -->
      <view v-if="recommendFunctions.length > 0" class="section-recommend">
        <view class="section-header">
          <view class="section-title">为你推荐</view>
          <view class="section-more" @click="goToRecommend">
            <text>查看更多</text>
            <text class="iconfont">→</text>
          </view>
        </view>
        <scroll-view class="recommend-scroll" scroll-x>
          <view 
            v-for="item in recommendFunctions" 
            :key="item.id"
            class="recommend-item"
            @click="handleFunctionClick(item)"
          >
            <image class="recommend-img" :src="item.image" mode="aspectFill" />
            <view class="recommend-info">
              <view class="recommend-title">{{ item.name }}</view>
              <view class="recommend-desc">{{ item.description }}</view>
              <view class="recommend-tags">
                <view v-for="tag in item.tags" :key="tag" class="recommend-tag">{{ tag }}</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 最近使用 -->
      <view v-if="recentFunctions.length > 0" class="section-recent">
        <view class="section-header">
          <view class="section-title">最近使用</view>
          <view class="section-more" @click="clearRecent">
            <text>清空</text>
          </view>
        </view>
        <view class="recent-list">
          <view 
            v-for="item in recentFunctions" 
            :key="item.id"
            class="recent-item"
            @click="handleFunctionClick(item)"
          >
            <view class="recent-icon" :style="{ background: item.color }">
              <text class="iconfont" :class="item.icon"></text>
            </view>
            <view class="recent-info">
              <view class="recent-name">{{ item.name }}</view>
              <view class="recent-time">{{ formatRecentTime(item.lastUseTime) }}</view>
            </view>
            <view class="recent-action" @click.stop="removeRecent(item.id)">
              <text class="iconfont">×</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能网格 -->
      <view class="section-grid">
        <view class="section-header">
          <view class="section-title">{{ getCategoryName(currentCategory) }}</view>
          <view class="section-count">{{ filteredFunctions.length }}个功能</view>
        </view>
        
        <!-- 排序选项 -->
        <view v-if="filteredFunctions.length > 0" class="sort-options">
          <view 
            v-for="option in sortOptions" 
            :key="option.value"
            class="sort-option"
            :class="{ active: currentSort === option.value }"
            @click="handleSortChange(option.value)"
          >
            {{ option.label }}
          </view>
        </view>

        <!-- 网格布局 -->
        <view class="function-grid">
          <view 
            v-for="item in filteredFunctions" 
            :key="item.id"
            class="grid-item"
            :class="{ disabled: !item.enabled, favorite: item.favorite }"
            @click="handleFunctionClick(item)"
            @longpress="handleShowFunctionMenu(item.id)"
          >
            <view class="item-header">
              <view v-if="item.hot" class="item-badge hot">热门</view>
              <view v-if="item.new" class="item-badge new">NEW</view>
              <view v-if="item.favorite" class="item-favorite" @click.stop="toggleFavorite(item.id)">
                <text class="iconfont">❤️</text>
              </view>
            </view>
            
            <view class="item-icon" :style="{ background: item.color }">
              <text class="iconfont" :class="item.icon"></text>
            </view>
            
            <view class="item-info">
              <view class="item-name">{{ item.name }}</view>
              <view class="item-desc">{{ item.description }}</view>
              <view class="item-stats">
                <view class="stat-item">
                  <text class="iconfont">👁️</text>
                  <text>{{ item.viewCount || 0 }}</text>
                </view>
                <view class="stat-item">
                  <text class="iconfont">❤️</text>
                  <text>{{ item.likeCount || 0 }}</text>
                </view>
              </view>
            </view>
            
            <view v-if="item.enabled" class="item-action" @click.stop="handleQuickAction(item)">
              <text class="iconfont">▶️</text>
            </view>
            <view v-else class="item-action disabled" @click.stop="handleEnable(item)">
              <text class="iconfont">🔒</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="filteredFunctions.length === 0" class="empty-grid">
          <image class="empty-img" src="/static/images/empty-function.png" />
          <view class="empty-text">暂无相关功能</view>
          <view v-if="searchKeyword" class="empty-action" @click="clearSearch">清空搜索</view>
          <view v-else class="empty-action" @click="handleAdd">添加功能</view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading && filteredFunctions.length > 0" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 没有更多 -->
      <view v-if="!hasMore && filteredFunctions.length > 0" class="no-more">
        <text>— 已加载全部功能 —</text>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 功能详情弹窗 -->
    <view v-if="showDetail" class="modal-overlay" @click="showDetail = false">
      <view class="modal-content detail-modal" @click.stop>
        <view class="modal-header">
          <view class="detail-header">
            <view class="detail-icon" :style="{ background: currentFunction.color }">
              <text class="iconfont" :class="currentFunction.icon"></text>
            </view>
            <view class="detail-title">
              <view class="detail-name">{{ currentFunction.name }}</view>
              <view class="detail-category">{{ getCategoryLabel(currentFunction.category) }}</view>
            </view>
          </view>
          <view class="modal-close" @click="showDetail = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="detail-content">
            <view class="detail-section">
              <view class="section-title">功能描述</view>
              <view class="section-content">{{ currentFunction.description }}</view>
            </view>
            
            <view v-if="currentFunction.features" class="detail-section">
              <view class="section-title">主要功能</view>
              <view class="features-list">
                <view 
                  v-for="(feature, index) in currentFunction.features" 
                  :key="index"
                  class="feature-item"
                >
                  <text class="feature-icon">✓</text>
                  <text class="feature-text">{{ feature }}</text>
                </view>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">使用统计</view>
              <view class="stats-grid">
                <view class="stat-item">
                  <text class="stat-number">{{ currentFunction.viewCount || 0 }}</text>
                  <text class="stat-label">浏览</text>
                </view>
                <view class="stat-item">
                  <text class="stat-number">{{ currentFunction.useCount || 0 }}</text>
                  <text class="stat-label">使用</text>
                </view>
                <view class="stat-item">
                  <text class="stat-number">{{ currentFunction.likeCount || 0 }}</text>
                  <text class="stat-label">喜欢</text>
                </view>
                <view class="stat-item">
                  <text class="stat-number">{{ currentFunction.shareCount || 0 }}</text>
                  <text class="stat-label">分享</text>
                </view>
              </view>
            </view>
            
            <view v-if="currentFunction.tags && currentFunction.tags.length > 0" class="detail-section">
              <view class="section-title">功能标签</view>
              <view class="tags-container">
                <view 
                  v-for="tag in currentFunction.tags" 
                  :key="tag"
                  class="tag-item"
                >
                  {{ tag }}
                </view>
              </view>
            </view>
            
            <view v-if="currentFunction.updateTime" class="detail-section">
              <view class="section-title">更新信息</view>
              <view class="update-info">
                <text>最后更新：{{ formatUpdateTime(currentFunction.updateTime) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="detail-actions">
            <view 
              class="action-btn favorite-btn" 
              :class="{ active: currentFunction.favorite }"
              @click="toggleFavorite(currentFunction.id)"
            >
              <text v-if="currentFunction.favorite" class="iconfont">❤️</text>
              <text v-else class="iconfont">🤍</text>
              <text class="btn-text">收藏</text>
            </view>
            <view class="action-btn share-btn" @click="handleShare(currentFunction)">
              <text class="iconfont">↗️</text>
              <text class="btn-text">分享</text>
            </view>
            <view 
              v-if="currentFunction.enabled"
              class="action-btn primary"
              @click="executeFunction(currentFunction)"
            >
              立即使用
            </view>
            <view 
              v-else
              class="action-btn enable-btn"
              @click="handleEnable(currentFunction)"
            >
              启用功能
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能设置弹窗 -->
    <view v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <view class="modal-content settings-modal" @click.stop>
        <view class="modal-header">
          <text>功能设置</text>
          <view class="modal-close" @click="showSettings = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <!-- 显示设置 -->
          <view class="settings-section">
            <view class="section-title">显示设置</view>
            <view class="setting-item">
              <view class="setting-label">显示常用功能</view>
              <switch 
                :checked="settings.showCommon" 
                @change="toggleShowCommon"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">显示推荐功能</view>
              <switch 
                :checked="settings.showRecommend" 
                @change="toggleShowRecommend"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">显示最近使用</view>
              <switch 
                :checked="settings.showRecent" 
                @change="toggleShowRecent"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">网格显示数量</view>
              <slider 
                :value="settings.gridColumns" 
                :min="3" 
                :max="5" 
                :step="1"
                @changing="onGridColumnsChange"
                activeColor="#007AFF"
              />
              <view class="slider-value">{{ settings.gridColumns }}列</view>
            </view>
          </view>
          
          <!-- 排序设置 -->
          <view class="settings-section">
            <view class="section-title">排序设置</view>
            <view class="setting-item">
              <view class="setting-label">默认排序方式</view>
              <picker 
                class="setting-picker" 
                mode="selector" 
                :range="sortOptions" 
                :value="sortIndex"
                @change="onDefaultSortChange"
              >
                <view class="picker-value">
                  {{ sortOptions[sortIndex].label }}
                </view>
              </picker>
            </view>
            <view class="setting-item">
              <view class="setting-label">记住排序选择</view>
              <switch 
                :checked="settings.rememberSort" 
                @change="toggleRememberSort"
                color="#007AFF"
              />
            </view>
          </view>
          
          <!-- 数据管理 -->
          <view class="settings-section">
            <view class="section-title">数据管理</view>
            <view class="setting-actions">
              <view class="setting-action" @click="handleClearCache">
                <text class="iconfont">🗑️</text>
                <view class="action-info">
                  <text class="action-title">清除缓存</text>
                  <text class="action-desc">清理临时数据，释放空间</text>
                </view>
              </view>
              <view class="setting-action" @click="handleExportData">
                <text class="iconfont">📤</text>
                <view class="action-info">
                  <text class="action-title">导出数据</text>
                  <text class="action-desc">备份功能使用数据</text>
                </view>
              </view>
              <view class="setting-action" @click="handleSyncData">
                <text class="iconfont">🔄</text>
                <view class="action-info">
                  <text class="action-title">同步数据</text>
                  <text class="action-desc">与云端同步功能数据</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 权限管理 -->
          <view class="settings-section">
            <view class="section-title">权限管理</view>
            <view class="setting-item">
              <view class="setting-label">位置权限</view>
              <switch 
                :checked="settings.locationPermission" 
                @change="toggleLocationPermission"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">相机权限</view>
              <switch 
                :checked="settings.cameraPermission" 
                @change="toggleCameraPermission"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">通知权限</view>
              <switch 
                :checked="settings.notificationPermission" 
                @change="toggleNotificationPermission"
                color="#007AFF"
              />
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="showSettings = false">取消</view>
          <view class="footer-btn primary" @click="saveSettings">保存设置</view>
        </view>
      </view>
    </view>

    <!-- 添加功能弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <view class="modal-content add-modal" @click.stop>
        <view class="modal-header">
          <text>添加功能</text>
          <view class="modal-close" @click="showAddModal = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="add-search">
            <view class="search-input-wrapper">
              <text class="iconfont">🔍</text>
              <input 
                class="search-input" 
                placeholder="搜索可用功能..." 
                v-model="addSearchKeyword"
              />
            </view>
          </view>
          
          <view class="add-categories">
            <view 
              v-for="cat in addCategories" 
              :key="cat.value"
              class="add-category"
              :class="{ active: addCurrentCategory === cat.value }"
              @click="addCurrentCategory = cat.value"
            >
              {{ cat.label }}
            </view>
          </view>
          
          <view class="add-list">
            <view 
              v-for="item in addFunctions" 
              :key="item.id"
              class="add-item"
              :class="{ added: item.added }"
              @click="toggleAddFunction(item)"
            >
              <view class="add-icon" :style="{ background: item.color }">
                <text class="iconfont" :class="item.icon"></text>
              </view>
              <view class="add-info">
                <view class="add-name">{{ item.name }}</view>
                <view class="add-desc">{{ item.description }}</view>
              </view>
              <view class="add-action">
                <view v-if="item.added" class="added-text">已添加</view>
                <view v-else class="add-btn">添加</view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn cancel" @click="showAddModal = false">取消</view>
          <view class="footer-btn primary" @click="confirmAdd">完成</view>
        </view>
      </view>
    </view>

    <!-- 排序管理弹窗 -->
    <view v-if="showSortModal" class="modal-overlay" @click="showSortModal = false">
      <view class="modal-content sort-modal" @click.stop>
        <view class="modal-header">
          <text>排序管理</text>
          <view class="header-actions">
            <view class="reset-btn" @click="handleResetSort">重置</view>
            <view class="modal-close" @click="showSortModal = false">完成</view>
          </view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="sort-list">
            <view 
              v-for="(item, index) in sortableFunctions" 
              :key="item.id"
              class="sort-item"
            >
              <view class="sort-icon">
                <text class="iconfont">⋮⋮</text>
              </view>
              <view class="sort-content">
                <view class="sort-icon-box" :style="{ background: item.color }">
                  <text class="iconfont" :class="item.icon"></text>
                </view>
                <view class="sort-info">
                  <view class="sort-name">{{ item.name }}</view>
                  <view class="sort-category">{{ getCategoryLabel(item.category) }}</view>
                </view>
              </view>
              <view class="sort-actions">
                <view class="sort-up" @click="moveSortItem(index, -1)">
                  <text class="iconfont">↑</text>
                </view>
                <view class="sort-down" @click="moveSortItem(index, 1)">
                  <text class="iconfont">↓</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-tip">长按拖动可调整顺序</view>
      </view>
    </view>

    <!-- 分组管理弹窗 -->
    <view v-if="showGroupModal" class="modal-overlay" @click="showGroupModal = false">
      <view class="modal-content group-modal" @click.stop>
        <view class="modal-header">
          <text>分组管理</text>
          <view class="modal-close" @click="showGroupModal = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="group-list">
            <view 
              v-for="group in groups" 
              :key="group.id"
              class="group-item"
            >
              <view class="group-header">
                <view class="group-info">
                  <view class="group-name">{{ group.name }}</view>
                  <view class="group-count">{{ group.functions.length }}个功能</view>
                </view>
                <view class="group-actions">
                  <view class="group-icon" @click="handleEditGroup(group)">
                    <text class="iconfont">✏️</text>
                  </view>
                  <view class="group-icon" @click="handleDeleteGroup(group.id)">
                    <text class="iconfont">🗑️</text>
                  </view>
                </view>
              </view>
              
              <view class="group-functions">
                <view 
                  v-for="func in group.functions" 
                  :key="func.id"
                  class="group-function"
                >
                  <view class="func-icon" :style="{ background: func.color }">
                    <text class="iconfont" :class="func.icon"></text>
                  </view>
                  <view class="func-name">{{ func.name }}</view>
                  <view class="func-remove" @click="removeFromGroup(group.id, func.id)">
                    <text class="iconfont">×</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="handleNewGroup">新建分组</view>
          <view class="footer-btn primary" @click="saveGroups">保存分组</view>
        </view>
      </view>
    </view>

    <!-- 功能操作菜单 -->
    <view v-if="showFunctionMenu" class="menu-overlay" @click="showFunctionMenu = false">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="handleMenuFavorite">
          <text class="iconfont">❤️</text>
          <text>{{ selectedFunction.favorite ? '取消收藏' : '收藏功能' }}</text>
        </view>
        <view class="menu-item" @click="handleMenuHide">
          <text class="iconfont">👁️</text>
          <text>隐藏功能</text>
        </view>
        <view class="menu-item" @click="handleMenuGroup">
          <text class="iconfont">📁</text>
          <text>加入分组</text>
        </view>
        <view class="menu-item" @click="handleMenuShare">
          <text class="iconfont">↗️</text>
          <text>分享功能</text>
        </view>
        <view class="menu-item cancel" @click="showFunctionMenu = false">
          取消
        </view>
      </view>
    </view>

    <!-- 操作提示 -->
    <view v-if="showToast" class="toast-message" :class="toastType">
      <text class="toast-text">{{ toastMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

// 响应式数据
const showSearch = ref(false)
const showDetail = ref(false)
const showSettings = ref(false)
const showAddModal = ref(false)
const showSortModal = ref(false)
const showGroupModal = ref(false)
const showFunctionMenu = ref(false)
const showToast = ref(false)
const refreshing = ref(false)
const loading = ref(false)
const hasMore = ref(true)
const currentCategory = ref('all')
const currentSort = ref('default')
const searchKeyword = ref('')
const addSearchKeyword = ref('')
const addCurrentCategory = ref('all')
const page = ref(1)
const pageSize = 20
const toastMessage = ref('')
const toastType = ref('info')

// 功能数据
const allFunctions = ref([
  {
    id: 1,
    name: '校园日历',
    description: '查看课程安排、考试时间、节假日',
    icon: 'icon-calendar',
    color: '#FF9500',
    category: 'study',
    enabled: true,
    favorite: false,
    hot: true,
    new: false,
    viewCount: 1234,
    useCount: 567,
    likeCount: 89,
    shareCount: 34,
    features: ['课程表查询', '考试安排', '假期日历', '提醒功能'],
    tags: ['学习', '时间管理', '课程'],
    updateTime: '2024-12-20 10:30:00',
    lastUseTime: Date.now() - 3600000
  },
  {
    id: 2,
    name: '图书馆',
    description: '查询图书、预约座位、续借服务',
    icon: 'icon-library',
    color: '#34C759',
    category: 'study',
    enabled: true,
    favorite: true,
    hot: true,
    new: false,
    viewCount: 2345,
    useCount: 890,
    likeCount: 123,
    shareCount: 45,
    features: ['图书检索', '座位预约', '借阅记录', '续借服务'],
    tags: ['学习', '图书', '自习'],
    updateTime: '2024-12-15 14:20:00',
    lastUseTime: Date.now() - 7200000
  },
  {
    id: 3,
    name: '食堂菜单',
    description: '查看今日菜品、价格、评价',
    icon: 'icon-canteen',
    color: '#FF3B30',
    category: 'life',
    enabled: true,
    favorite: false,
    hot: false,
    new: true,
    viewCount: 3456,
    useCount: 1200,
    likeCount: 234,
    shareCount: 67,
    features: ['每日菜单', '价格查询', '用户评价', '营养信息'],
    tags: ['饮食', '食堂', '餐饮'],
    updateTime: '2024-12-19 08:15:00',
    lastUseTime: Date.now() - 1800000
  },
  {
    id: 4,
    name: '校园地图',
    description: '导航定位、建筑查询、路线规划',
    icon: 'icon-map',
    color: '#007AFF',
    category: 'campus',
    enabled: true,
    favorite: false,
    hot: true,
    new: false,
    viewCount: 4567,
    useCount: 1500,
    likeCount: 345,
    shareCount: 78,
    features: ['实时定位', '建筑查询', '路线规划', '校内导航'],
    tags: ['导航', '位置', '地图'],
    updateTime: '2024-12-18 16:45:00',
    lastUseTime: Date.now() - 86400000
  },
  {
    id: 5,
    name: '天气服务',
    description: '查看天气、温度、空气质量',
    icon: 'icon-weather',
    color: '#5AC8FA',
    category: 'life',
    enabled: true,
    favorite: true,
    hot: false,
    new: false,
    viewCount: 5678,
    useCount: 1800,
    likeCount: 456,
    shareCount: 89,
    features: ['实时天气', '天气预报', '空气质量', '生活指数'],
    tags: ['天气', '生活', '环境'],
    updateTime: '2024-12-20 06:30:00',
    lastUseTime: Date.now() - 28800000
  },
  {
    id: 6,
    name: '成绩查询',
    description: '查看考试成绩、绩点排名',
    icon: 'icon-score',
    color: '#FF2D55',
    category: 'study',
    enabled: true,
    favorite: false,
    hot: false,
    new: true,
    viewCount: 789,
    useCount: 300,
    likeCount: 56,
    shareCount: 12,
    features: ['成绩查询', '绩点计算', '排名查看', '成绩分析'],
    tags: ['学习', '成绩', '考试'],
    updateTime: '2024-12-17 12:20:00',
    lastUseTime: Date.now() - 43200000
  },
  {
    id: 7,
    name: '校园公告',
    description: '查看学校通知、新闻、公告',
    icon: 'icon-notice',
    color: '#5856D6',
    category: 'campus',
    enabled: true,
    favorite: false,
    hot: true,
    new: false,
    viewCount: 9876,
    useCount: 2500,
    likeCount: 567,
    shareCount: 90,
    features: ['通知公告', '校园新闻', '活动通知', '重要提醒'],
    tags: ['通知', '新闻', '公告'],
    updateTime: '2024-12-20 09:00:00',
    lastUseTime: Date.now() - 14400000
  },
  {
    id: 8,
    name: '一卡通',
    description: '余额查询、消费记录、充值服务',
    icon: 'icon-card',
    color: '#FFCC00',
    category: 'life',
    enabled: true,
    favorite: false,
    hot: false,
    new: false,
    viewCount: 8765,
    useCount: 3200,
    likeCount: 678,
    shareCount: 101,
    features: ['余额查询', '消费记录', '在线充值', '挂失服务'],
    tags: ['校园卡', '支付', '消费'],
    updateTime: '2024-12-19 15:30:00',
    lastUseTime: Date.now() - 21600000
  }
])

// 当前选中的功能
const currentFunction = ref({})
const selectedFunction = ref({})

// 分类选项
const categories = ref([
  { label: '全部', value: 'all', icon: 'icon-all' },
  { label: '学习', value: 'study', icon: 'icon-study' },
  { label: '生活', value: 'life', icon: 'icon-life' },
  { label: '校园', value: 'campus', icon: 'icon-campus' },
  { label: '工具', value: 'tools', icon: 'icon-tools' },
  { label: '娱乐', value: 'entertainment', icon: 'icon-entertainment' },
  { label: '社交', value: 'social', icon: 'icon-social' }
])

// 排序选项
const sortOptions = ref([
  { label: '默认排序', value: 'default' },
  { label: '最近使用', value: 'recent' },
  { label: '热门推荐', value: 'hot' },
  { label: '最新添加', value: 'new' },
  { label: '名称排序', value: 'name' }
])

// 设置
const settings = ref({
  showCommon: true,
  showRecommend: true,
  showRecent: true,
  gridColumns: 4,
  rememberSort: true,
  locationPermission: true,
  cameraPermission: true,
  notificationPermission: true
})

// 添加功能相关
const addCategories = ref([
  { label: '全部', value: 'all' },
  { label: '学习工具', value: 'study' },
  { label: '生活服务', value: 'life' },
  { label: '校园服务', value: 'campus' }
])

const addFunctions = ref([
  { id: 101, name: '课程表', description: '查看个人课程安排', icon: 'icon-schedule', color: '#FF9500', category: 'study', added: false },
  { id: 102, name: '考试安排', description: '查看考试时间地点', icon: 'icon-exam', color: '#FF3B30', category: 'study', added: false },
  { id: 103, name: '校园网', description: '校园网络服务', icon: 'icon-wifi', color: '#007AFF', category: 'campus', added: false },
  { id: 104, name: '校车时刻', description: '校车时间表查询', icon: 'icon-bus', color: '#34C759', category: 'campus', added: false }
])

// 分组管理
const groups = ref([
  { id: 1, name: '学习工具', functions: [1, 2, 6] },
  { id: 2, name: '生活服务', functions: [3, 5, 8] }
])

// 计算属性
const commonFunctions = computed(() => {
  return allFunctions.value
    .filter(func => func.favorite || func.useCount > 100)
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || b.useCount - a.useCount)
    .slice(0, 8)
})

const recommendFunctions = computed(() => {
  return allFunctions.value
    .filter(func => func.hot || func.new)
    .slice(0, 4)
})

const recentFunctions = computed(() => {
  return allFunctions.value
    .filter(func => func.lastUseTime)
    .sort((a, b) => b.lastUseTime - a.lastUseTime)
    .slice(0, 5)
})

const filteredFunctions = computed(() => {
  let result = allFunctions.value
  
  // 按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(func => func.category === currentCategory.value)
  }
  
  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(func => 
      func.name.toLowerCase().includes(keyword) ||
      func.description.toLowerCase().includes(keyword) ||
      (func.tags && func.tags.some(tag => tag.toLowerCase().includes(keyword)))
    )
  }
  
  // 排序
  result = [...result].sort((a, b) => {
    switch(currentSort.value) {
      case 'recent':
        return (b.lastUseTime || 0) - (a.lastUseTime || 0)
      case 'hot':
        return b.viewCount - a.viewCount
      case 'new':
        return (b.updateTime || '').localeCompare(a.updateTime || '')
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
  
  return result
})

const sortableFunctions = computed(() => {
  return [...filteredFunctions.value]
})

const sortIndex = computed(() => {
  return sortOptions.value.findIndex(opt => opt.value === currentSort.value)
})

// 工具函数
const getCategoryName = (value) => {
  const category = categories.value.find(cat => cat.value === value)
  return category ? category.label : '全部'
}

const getCategoryLabel = (value) => {
  return getCategoryName(value)
}

const formatRecentTime = (timestamp) => {
  if (!timestamp) return '从未使用'
  const now = Date.now()
  const diff = now - timestamp
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    return '刚刚'
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${Math.floor(hours / 24)}天前`
  }
}

const formatUpdateTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const showToastMessage = (message, type = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 事件处理
const handleSearch = () => {
  showSearch.value = true
}

const hideSearch = () => {
  showSearch.value = false
  searchKeyword.value = ''
}

const clearSearch = () => {
  searchKeyword.value = ''
  handleSearchConfirm()
}

const handleSearchConfirm = () => {
  loadFunctions(true)
  if (showSearch.value) {
    showSearch.value = false
  }
}

const handleCategoryChange = (category) => {
  currentCategory.value = category
  loadFunctions(true)
}

const handleSortChange = (sort) => {
  currentSort.value = sort
  loadFunctions(true)
}

const handleLoadMore = () => {
  if (!loading.value && hasMore.value) {
    loadFunctions(false)
  }
}

const handleRefresh = () => {
  refreshing.value = true
  loadFunctions(true)
}

const loadFunctions = async (reset = false) => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    if (reset) {
      page.value = 1
      hasMore.value = true
    }
    
    if (!hasMore.value) {
      return
    }
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (reset) {
      // 重置数据逻辑
    } else {
      page.value++
    }
    
    // 模拟没有更多数据
    if (page.value >= 3) {
      hasMore.value = false
    }
    
  } catch (error) {
    console.error('加载功能失败:', error)
    showToastMessage('加载失败，请重试', 'error')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const handleFunctionClick = (func) => {
  currentFunction.value = func
  showDetail.value = true
  
  // 记录浏览
  func.viewCount = (func.viewCount || 0) + 1
  func.lastUseTime = Date.now()
}

const executeFunction = (func) => {
  // 记录使用
  func.useCount = (func.useCount || 0) + 1
  func.lastUseTime = Date.now()
  
  showDetail.value = false
  showToastMessage(`正在打开${func.name}`, 'success')
  
  // 根据功能ID跳转到对应页面
  switch(func.id) {
    case 1: // 校园日历
      uni.navigateTo({
        url: '/pages/tabbar/function/subpages/calendar/index'
      })
      break
    case 2: // 图书馆
      uni.navigateTo({
        url: '/pages/tabbar/function/subpages/library/index'
      })
      break
    case 3: // 食堂菜单
      uni.navigateTo({
        url: '/pages/tabbar/function/subpages/canteen/index'
      })
      break
    case 4: // 校园地图
      uni.navigateTo({
        url: '/pages/tabbar/function/subpages/map/index'
      })
      break
    case 5: // 天气服务
      uni.navigateTo({
        url: '/pages/tabbar/function/subpages/weather/index'
      })
      break
    default:
      showToastMessage('功能正在开发中', 'info')
  }
}

const handleQuickAction = (func) => {
  executeFunction(func)
}

const handleEnable = (func) => {
  func.enabled = true
  showToastMessage(`${func.name}已启用`, 'success')
}

const toggleFavorite = (id) => {
  const func = allFunctions.value.find(f => f.id === id)
  if (func) {
    func.favorite = !func.favorite
    showToastMessage(func.favorite ? '已收藏' : '已取消收藏', 'success')
  }
}

const handleShowFunctionMenu = (id) => {
  const func = allFunctions.value.find(f => f.id === id)
  if (func) {
    selectedFunction.value = func
    showFunctionMenu.value = true
  }
}

const handleMenuFavorite = () => {
  toggleFavorite(selectedFunction.value.id)
  showFunctionMenu.value = false
}

const handleMenuHide = () => {
  selectedFunction.value.enabled = false
  showToastMessage(`${selectedFunction.value.name}已隐藏`, 'success')
  showFunctionMenu.value = false
}

const handleMenuGroup = () => {
  showGroupModal.value = true
  showFunctionMenu.value = false
}

const handleMenuShare = () => {
  const func = selectedFunction.value
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: func.name,
    summary: func.description,
    success: () => {
      showToastMessage('分享成功', 'success')
      func.shareCount = (func.shareCount || 0) + 1
    }
  })
  showFunctionMenu.value = false
}

const goToCommon = () => {
  showToastMessage('常用功能管理', 'info')
}

const goToRecommend = () => {
  showToastMessage('查看更多推荐', 'info')
}

const clearRecent = () => {
  allFunctions.value.forEach(func => {
    func.lastUseTime = null
  })
  showToastMessage('最近使用已清空', 'success')
}

const removeRecent = (id) => {
  const func = allFunctions.value.find(f => f.id === id)
  if (func) {
    func.lastUseTime = null
    showToastMessage('已从最近使用移除', 'success')
  }
}

const handleAdd = () => {
  showAddModal.value = true
}

const toggleAddFunction = (func) => {
  func.added = !func.added
  showToastMessage(func.added ? '已添加' : '已移除', 'success')
}

const confirmAdd = () => {
  const addedFunctions = addFunctions.value.filter(func => func.added)
  if (addedFunctions.length > 0) {
    // 将添加的功能合并到主列表
    addedFunctions.forEach(func => {
      if (!allFunctions.value.some(f => f.id === func.id)) {
        allFunctions.value.push({
          ...func,
          enabled: true,
          favorite: false,
          viewCount: 0,
          useCount: 0,
          likeCount: 0,
          shareCount: 0,
          lastUseTime: null
        })
      }
    })
    showToastMessage(`成功添加${addedFunctions.length}个功能`, 'success')
  }
  showAddModal.value = false
  addFunctions.value.forEach(func => func.added = false)
}

const handleShare = (func) => {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: func.name,
    summary: func.description,
    success: () => {
      showToastMessage('分享成功', 'success')
      func.shareCount = (func.shareCount || 0) + 1
    }
  })
}

// 设置处理
const toggleShowCommon = (e) => {
  settings.value.showCommon = e.detail.value
}

const toggleShowRecommend = (e) => {
  settings.value.showRecommend = e.detail.value
}

const toggleShowRecent = (e) => {
  settings.value.showRecent = e.detail.value
}

const onGridColumnsChange = (e) => {
  settings.value.gridColumns = e.detail.value
}

const onDefaultSortChange = (e) => {
  currentSort.value = sortOptions.value[e.detail.value].value
}

const toggleRememberSort = (e) => {
  settings.value.rememberSort = e.detail.value
}

const toggleLocationPermission = (e) => {
  settings.value.locationPermission = e.detail.value
}

const toggleCameraPermission = (e) => {
  settings.value.cameraPermission = e.detail.value
}

const toggleNotificationPermission = (e) => {
  settings.value.notificationPermission = e.detail.value
}

const handleClearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除缓存数据吗？',
    success: (res) => {
      if (res.confirm) {
        showToastMessage('缓存已清除', 'success')
      }
    }
  })
}

const handleExportData = () => {
  showToastMessage('数据导出功能开发中', 'info')
}

const handleSyncData = () => {
  showToastMessage('数据同步功能开发中', 'info')
}

const saveSettings = () => {
  uni.setStorageSync('functionSettings', settings.value)
  showSettings.value = false
  showToastMessage('设置已保存', 'success')
}

// 排序管理
const handleResetSort = () => {
  currentSort.value = 'default'
  showToastMessage('排序已重置', 'success')
}

const moveSortItem = (index, direction) => {
  if (index + direction >= 0 && index + direction < sortableFunctions.value.length) {
    const [item] = sortableFunctions.value.splice(index, 1)
    sortableFunctions.value.splice(index + direction, 0, item)
    showToastMessage('顺序已调整', 'success')
  }
}

// 分组管理
const handleNewGroup = () => {
  uni.showModal({
    title: '新建分组',
    content: '请输入分组名称',
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        const newGroup = {
          id: Date.now(),
          name: res.content,
          functions: []
        }
        groups.value.push(newGroup)
        showToastMessage('分组创建成功', 'success')
      }
    }
  })
}

const handleEditGroup = (group) => {
  uni.showModal({
    title: '编辑分组',
    content: '请输入新名称',
    editable: true,
    placeholderText: group.name,
    success: (res) => {
      if (res.confirm && res.content) {
        group.name = res.content
        showToastMessage('分组已重命名', 'success')
      }
    }
  })
}

const handleDeleteGroup = (groupId) => {
  uni.showModal({
    title: '删除分组',
    content: '确定要删除这个分组吗？',
    success: (res) => {
      if (res.confirm) {
        groups.value = groups.value.filter(g => g.id !== groupId)
        showToastMessage('分组已删除', 'success')
      }
    }
  })
}

const removeFromGroup = (groupId, funcId) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    group.functions = group.functions.filter(id => id !== funcId)
    showToastMessage('已从分组移除', 'success')
  }
}

const saveGroups = () => {
  uni.setStorageSync('functionGroups', groups.value)
  showGroupModal.value = false
  showToastMessage('分组已保存', 'success')
}

// 生命周期
onLoad(() => {
  // 加载设置
  const savedSettings = uni.getStorageSync('functionSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...savedSettings }
  }
  
  // 加载分组
  const savedGroups = uni.getStorageSync('functionGroups')
  if (savedGroups) {
    groups.value = savedGroups
  }
  
  loadFunctions(true)
})

onShow(() => {
  // 页面显示时刷新数据
  if (uni.getStorageSync('needRefreshFunction')) {
    uni.removeStorageSync('needRefreshFunction')
    loadFunctions(true)
  }
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

onReachBottom(() => {
  handleLoadMore()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins/function.scss';
.function-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.function-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 0 30rpx;
  position: relative;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    
    .header-left {
      .header-title {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .header-subtitle {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 30rpx;
      
      .header-icon {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
      }
    }
  }
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 0 30rpx;
  
  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    height: 70rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 35rpx;
    
    .search-input {
      flex: 1;
      height: 100%;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
    
    .clear-btn {
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 32rpx;
      color: #999;
    }
  }
  
  .search-cancel {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #fff;
  }
}

.category-tabs {
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  padding: 20rpx 0;
  white-space: nowrap;
  
  .tab-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30rpx;
    gap: 12rpx;
    
    .tab-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      color: #666;
    }
    
    .tab-text {
      font-size: 24rpx;
      color: #666;
    }
    
    &.active {
      .tab-icon {
        color: #007AFF;
      }
      
      .tab-text {
        color: #007AFF;
        font-weight: bold;
      }
      
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -20rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

.function-scroll {
  flex: 1;
  height: 0;
  padding: 0 30rpx 40rpx;
}

.section-common {
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx 0;
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
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .common-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .common-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      
      .common-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48rpx;
        color: #fff;
      }
      
      .common-text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        line-height: 1.2;
      }
    }
  }
}

.section-recommend {
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx 0;
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
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .recommend-scroll {
    white-space: nowrap;
    
    .recommend-item {
      display: inline-block;
      width: 300rpx;
      margin-right: 20rpx;
      border-radius: 16rpx;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      
      .recommend-img {
        width: 100%;
        height: 150rpx;
      }
      
      .recommend-info {
        padding: 20rpx;
        
        .recommend-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .recommend-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .recommend-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8rpx;
          
          .recommend-tag {
            padding: 4rpx 12rpx;
            background: #f5f5f5;
            border-radius: 12rpx;
            font-size: 20rpx;
            color: #666;
          }
        }
      }
    }
  }
}

.section-recent {
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx 0;
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
      color: #999;
    }
  }
  
  .recent-list {
    .recent-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .recent-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
        margin-right: 20rpx;
      }
      
      .recent-info {
        flex: 1;
        
        .recent-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .recent-time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .recent-action {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #999;
      }
    }
  }
}

.section-grid {
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx 0;
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
    
    .section-count {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .sort-options {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .sort-option {
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
  
  .function-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .grid-item {
      position: relative;
      background: #fff;
      border-radius: 16rpx;
      padding: 20rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      border: 1rpx solid #f0f0f0;
      
      &.disabled {
        opacity: 0.6;
      }
      
      &.favorite {
        border-color: #ff3b30;
      }
      
      .item-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .item-badge {
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          font-size: 20rpx;
          color: #fff;
          margin-right: 8rpx;
          
          &.hot {
            background: #ff3b30;
          }
          
          &.new {
            background: #007AFF;
          }
        }
        
        .item-favorite {
          margin-left: auto;
          color: #ff3b30;
        }
      }
      
      .item-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #fff;
        margin-bottom: 20rpx;
      }
      
      .item-info {
        .item-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .item-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 12rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .item-stats {
          display: flex;
          align-items: center;
          gap: 20rpx;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 4rpx;
            font-size: 20rpx;
            color: #999;
          }
        }
      }
      
      .item-action {
        position: absolute;
        bottom: 20rpx;
        right: 20rpx;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #007AFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #fff;
        
        &.disabled {
          background: #cccccc;
        }
      }
    }
  }
  
  .empty-grid {
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
      margin-bottom: 40rpx;
    }
    
    .empty-action {
      padding: 20rpx 40rpx;
      background: #007AFF;
      color: #fff;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  
  .loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid #f3f3f3;
    border-top: 4rpx solid #007AFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  text {
    font-size: 24rpx;
    color: #999;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-more {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #999;
}

.safe-area {
  height: 120rpx;
}

.modal-overlay {
  @include modal-overlay;
}

.modal-content {
  @include modal-content;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid $gray-2;
    
    .detail-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .detail-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
      }
      
      .detail-title {
        .detail-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 4rpx;
        }
        
        .detail-category {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .reset-btn {
        color: #666;
        font-size: 28rpx;
      }
    }
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
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
      background: #f5f5f5;
      color: #666;
      
      &.primary {
        background: #007AFF;
        color: #fff;
      }
      
      &.delete {
        background: #ff3b30;
        color: #fff;
      }
    }
    
    .detail-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 20rpx;
      
      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #666;
        
        &.favorite-btn.active {
          color: #ff3b30;
        }
        
        &.primary {
          flex: 1;
          padding: 20rpx 0;
          background: #007AFF;
          color: #fff;
          border-radius: 40rpx;
          font-size: 28rpx;
        }
        
        &.enable-btn {
          flex: 1;
          padding: 20rpx 0;
          background: #4cd964;
          color: #fff;
          border-radius: 40rpx;
          font-size: 28rpx;
        }
      }
    }
  }
}

.detail-modal {
  .detail-content {
    .detail-section {
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .section-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
      
      .features-list {
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12rpx;
          
          .feature-icon {
            color: #4cd964;
            margin-right: 12rpx;
            font-size: 24rpx;
          }
          
          .feature-text {
            font-size: 28rpx;
            color: #666;
            line-height: 1.4;
          }
        }
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20rpx;
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .stat-number {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 8rpx;
          }
          
          .stat-label {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
      
      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        
        .tag-item {
          padding: 8rpx 20rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.settings-modal {
  .settings-section {
    margin-bottom: 40rpx;
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      .setting-label {
        font-size: 28rpx;
        color: #333;
      }
      
      .setting-picker {
        .picker-value {
          color: #007AFF;
        }
      }
      
      .slider-value {
        font-size: 24rpx;
        color: #666;
        margin-top: 12rpx;
      }
    }
  }
}

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
        justify-content: center;
        color: #ff3b30;
        font-weight: 500;
      }
    }
  }
}

.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  z-index: 3000;
  max-width: 500rpx;
  
  &.success {
    background: rgba(76, 217, 100, 0.9);
  }
  
  &.error {
    background: rgba(255, 59, 48, 0.9);
  }
  
  &.info {
    background: rgba(0, 122, 255, 0.9);
  }
  
  .toast-text {
    color: #fff;
    text-align: center;
  }
}
</style>