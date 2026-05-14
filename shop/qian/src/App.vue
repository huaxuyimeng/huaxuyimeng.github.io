<template>
  <div>
    <!-- 顶部导航栏 -->
    <el-menu :default-active="activeMenu" mode="horizontal" class="main-nav" background-color="#fff" text-color="#333"
      active-text-color="#5e35b1">
      <div class="nav-left">
        <el-menu-item index="/product" @click="go('/product')">
          <el-icon><Goods /></el-icon>
          商品管理
        </el-menu-item>
        <el-menu-item index="/order" @click="go('/order')">
          <el-icon><Document /></el-icon>
          订单管理
        </el-menu-item>
        <el-menu-item index="/user-center" @click="go('/user-center')">
          <el-icon><User /></el-icon>
          用户中心
        </el-menu-item>
        <el-menu-item v-if="canAccess('merchant-manage')" index="/merchant-manage" @click="go('/merchant-manage')">
          <el-icon><Shop /></el-icon>
          商家管理
        </el-menu-item>
        <el-menu-item v-if="canAccess('dashboard')" index="/dashboard" @click="go('/dashboard')">
          <el-icon><DataAnalysis /></el-icon>
          数据大屏
        </el-menu-item>
        <el-menu-item v-if="canAccess('user-manage')" index="/user-manage" @click="go('/user-manage')">
          <el-icon><UserFilled /></el-icon>
          用户管理
        </el-menu-item>
      </div>
      
      <div class="nav-right">
        <!-- 用户信息下拉菜单 -->
        <el-dropdown @command="handleUserCommand" trigger="click">
          <div class="user-info">
            <el-avatar :size="32" :src="userAvatar">
              {{ userDisplayName.charAt(0).toUpperCase() }}
            </el-avatar>
            <span class="username">{{ userDisplayName }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="history">
                <el-icon><Clock /></el-icon>
                访问历史
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>

    <!-- 面包屑导航 -->
    <div class="breadcrumb-container" v-if="showBreadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbItems" 
          :key="index"
          :class="{ 'clickable': item.path && index < breadcrumbItems.length - 1 }"
          @click="item.path && index < breadcrumbItems.length - 1 ? go(item.path) : null"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主要内容区域 -->
    <div class="app-container">
      <router-view />
    </div>

    <!-- 访问历史对话框 -->
    <el-dialog v-model="historyDialogVisible" title="访问历史" width="500px">
      <div class="history-list">
        <div 
          v-for="(visit, index) in visitHistory" 
          :key="index"
          class="history-item"
          @click="goToHistory(visit.path)"
        >
          <div class="history-title">{{ visit.title }}</div>
          <div class="history-time">{{ formatVisitTime(visit.timestamp) }}</div>
        </div>
        <div v-if="visitHistory.length === 0" class="no-history">
          暂无访问记录
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Goods, Document, User, Shop, DataAnalysis, UserFilled, 
  ArrowDown, Clock, SwitchButton
} from '@element-plus/icons-vue'
import { 
  getUserInfo, 
  isAdmin, 
  canAccess, 
  getUserDisplayName, 
  getUserAvatar, 
  getVisitHistory, 
  formatVisitTime,
  logout as authLogout
} from '@/utils/auth'

const router = useRouter()
const route = useRoute()

// 响应式数据
const userInfo = ref(getUserInfo())
const historyDialogVisible = ref(false)
const visitHistory = ref([])

// 计算属性
const isAdminUser = computed(() => isAdmin())
const activeMenu = computed(() => route.path.split('?')[0])
const userAvatar = computed(() => getUserAvatar())
const userDisplayName = computed(() => getUserDisplayName())

// 面包屑导航
const showBreadcrumb = computed(() => route.path !== '/login')
const breadcrumbItems = computed(() => {
  const items = []
  const currentRoute = router.currentRoute.value
  
  // 添加首页
  items.push({ title: '首页', path: '/product' })
  
  // 添加当前页面
  if (currentRoute.meta.title) {
    items.push({ 
      title: currentRoute.meta.title, 
      path: currentRoute.path 
    })
  }
  
  return items
})

// 监听用户信息变化
watch(() => getUserInfo(), (newUserInfo) => {
  userInfo.value = newUserInfo
}, { deep: true })

// 方法
function go(path) {
  if (!path || path === router.currentRoute.value.path) return // 防止重复跳转
  if (path === 'logout') return
  router.push(path)
}

function handleUserCommand(command) {
  switch (command) {
    case 'profile':
      go('/user-center')
      break
    case 'history':
      showHistoryDialog()
      break
    case 'logout':
      handleLogout()
      break
  }
}

function showHistoryDialog() {
  visitHistory.value = getVisitHistory().filter(item => item.path !== '/login')
  historyDialogVisible.value = true
}

function goToHistory(path) {
  if (!path || path === router.currentRoute.value.path) return // 当前页不跳转
  router.push(path)
  historyDialogVisible.value = false
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 使用认证工具进行登出
    if (authLogout()) {
      ElMessage.success('已安全退出')
      router.push('/login')
    } else {
      ElMessage.error('退出失败，请重试')
    }
  } catch {
    // 用户取消退出
  }
}

// 组件挂载时更新用户信息
onMounted(() => {
  userInfo.value = getUserInfo()
})
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f7fa;
}

.app-container {
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.main-nav {
  box-shadow: 0 2px 8px rgba(94, 53, 177, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f0f2f5;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #333;
}

.breadcrumb-container {
  background-color: #fff;
  padding: 12px 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 0;
}

.clickable {
  cursor: pointer;
  color: #5e35b1;
}

.clickable:hover {
  color: #7c4dff;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-menu-item:hover {
  background-color: #f0f2f5 !important;
}

.el-menu-item.is-active {
  background-color: #e3f2fd !important;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-item:hover {
  background-color: #f5f7fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-title {
  font-weight: 500;
  color: #333;
}

.history-time {
  font-size: 12px;
  color: #999;
}

.no-history {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-nav {
    padding: 0 10px;
  }
  
  .username {
    display: none;
  }
  
  .app-container {
    padding: 10px;
  }
}
</style>