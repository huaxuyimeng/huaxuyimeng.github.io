// middleware/auth.js - 认证中间件
import { getToken, removeToken } from '@/utils/auth.js'

const middlewares = []

export default {
  // 注册中间件
  use(handler) {
    if (typeof handler === 'function') {
      middlewares.push(handler)
    }
  },
  
  // 检查是否已登录
  isAuthenticated() {
    const token = getToken()
    
    // 执行自定义中间件
    for (const middleware of middlewares) {
      const result = middleware(token)
      if (result !== undefined) {
        return result
      }
    }
    
    // 默认检查：是否有token
    return !!token
  },
  
  // 要求登录（未登录则跳转）
  requireAuth(options = {}) {
    if (!this.isAuthenticated()) {
      const { redirect = '/pages/index/index', showToast = true } = options
      
      if (showToast) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
      
      setTimeout(() => {
        uni.reLaunch({ url: redirect })
      }, 1500)
      
      return false
    }
    
    return true
  },
  
  // 登出
  logout() {
    removeToken()
    uni.removeStorageSync('userInfo')
    
    // 执行登出中间件
    for (const middleware of middlewares) {
      if (middleware.onLogout) {
        middleware.onLogout()
      }
    }
    
    uni.reLaunch({
      url: '/pages/index/index'
    })
  },
  
  // 清除所有中间件
  clear() {
    middlewares.length = 0
  }
}

