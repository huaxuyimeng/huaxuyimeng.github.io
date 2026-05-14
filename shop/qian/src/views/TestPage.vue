<template>
  <div class="test-page">
    <el-card>
      <template #header>
        <h2>系统测试页面</h2>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>API测试</h3>
            </template>
            
            <el-button @click="testUserAPI" :loading="userLoading" :disabled="userLoading">
              测试用户API
            </el-button>
            
            <el-button @click="testProductAPI" :loading="productLoading" :disabled="productLoading">
              测试商品API
            </el-button>
            
            <el-button @click="testMerchantAPI" :loading="merchantLoading" :disabled="merchantLoading">
              测试商家API
            </el-button>
            
            <el-button @click="testOrderAPI" :loading="orderLoading" :disabled="orderLoading">
              测试订单API
            </el-button>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>认证测试</h3>
            </template>
            
            <el-button @click="testAuth" :loading="authLoading" :disabled="authLoading">
              测试认证状态
            </el-button>
            
            <el-button @click="testToken" :loading="tokenLoading" :disabled="tokenLoading">
              测试Token
            </el-button>
            
            <el-button @click="clearStorage">
              清除本地存储
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      
      <el-card style="margin-top: 20px;">
        <template #header>
          <h3>测试结果</h3>
        </template>
        
        <el-alert
          v-if="testResults.length === 0"
          title="暂无测试结果"
          type="info"
          :closable="false"
        />
        
        <div v-else>
          <div
            v-for="(result, index) in testResults"
            :key="index"
            class="test-result"
            :style="{ borderColor: result.success ? '#e1f3d8' : '#fde2e2', background: result.success ? '#f6ffed' : '#fff1f0' }"
          >
            <el-tag :type="result.success ? 'success' : 'danger'">
              {{ result.success ? '成功' : '失败' }}
            </el-tag>
            <span class="test-name">{{ result.name }}</span>
            <span class="test-message" :style="{ color: result.success ? '#666' : '#d03050' }">{{ result.message }}</span>
            <span class="test-time">{{ result.time }}</span>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { isAuthenticated, getUserInfo } from '@/utils/auth'
import userApi from '@/api/user'
import productApi from '@/api/product'
import merchantApi from '@/api/merchant'
import orderApi from '@/api/order'

const userLoading = ref(false)
const productLoading = ref(false)
const merchantLoading = ref(false)
const orderLoading = ref(false)
const authLoading = ref(false)
const tokenLoading = ref(false)
const testResults = ref([])

const addTestResult = (name, success, message) => {
  testResults.value.unshift({
    name,
    success,
    message,
    time: new Date().toLocaleTimeString()
  })
}

const testUserAPI = async () => {
  if (userLoading.value) return
  userLoading.value = true
  try {
    const response = await userApi.getUserInfo()
    addTestResult('用户API', true, '获取用户信息成功')
    console.log('用户API响应:', response)
  } catch (error) {
    addTestResult('用户API', false, `错误: ${error.message}`)
    console.error('用户API错误:', error)
  } finally {
    userLoading.value = false
  }
}

const testProductAPI = async () => {
  if (productLoading.value) return
  productLoading.value = true
  try {
    const response = await productApi.getProducts()
    addTestResult('商品API', true, '获取商品列表成功')
    console.log('商品API响应:', response)
  } catch (error) {
    addTestResult('商品API', false, `错误: ${error.message}`)
    console.error('商品API错误:', error)
  } finally {
    productLoading.value = false
  }
}

const testMerchantAPI = async () => {
  if (merchantLoading.value) return
  merchantLoading.value = true
  try {
    const response = await merchantApi.getMerchants()
    addTestResult('商家API', true, '获取商家列表成功')
    console.log('商家API响应:', response)
  } catch (error) {
    addTestResult('商家API', false, `错误: ${error.message}`)
    console.error('商家API错误:', error)
  } finally {
    merchantLoading.value = false
  }
}

const testOrderAPI = async () => {
  if (orderLoading.value) return
  orderLoading.value = true
  try {
    const response = await orderApi.getOrders()
    addTestResult('订单API', true, '获取订单列表成功')
    console.log('订单API响应:', response)
  } catch (error) {
    addTestResult('订单API', false, `错误: ${error.message}`)
    console.error('订单API错误:', error)
  } finally {
    orderLoading.value = false
  }
}

const testAuth = () => {
  if (authLoading.value) return
  authLoading.value = true
  setTimeout(() => {
    const authenticated = isAuthenticated()
    const userInfo = getUserInfo()
    addTestResult('认证状态', authenticated, `已登录: ${authenticated}, 用户: ${userInfo.username || '未知'}`)
    authLoading.value = false
  }, 500)
}

const testToken = async () => {
  if (tokenLoading.value) return
  tokenLoading.value = true
  try {
    const userInfo = getUserInfo()
    if (userInfo.token) {
      const response = await userApi.validateToken(userInfo.token)
      addTestResult('Token验证', true, 'Token有效')
      console.log('Token验证响应:', response)
    } else {
      addTestResult('Token验证', false, 'Token不存在')
    }
  } catch (error) {
    addTestResult('Token验证', false, `错误: ${error.message}`)
    console.error('Token验证错误:', error)
  } finally {
    tokenLoading.value = false
  }
}

const clearStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
  testResults.value = []
  ElMessage.success('本地存储已清除')
  setTimeout(() => window.location.reload(), 600)
}
</script>

<style scoped>
.test-page {
  padding: 20px;
}

.test-result {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.test-name {
  font-weight: bold;
  min-width: 100px;
}

.test-message {
  flex: 1;
  color: #666;
}

.test-time {
  color: #999;
  font-size: 12px;
}
</style> 