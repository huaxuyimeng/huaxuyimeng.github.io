// api/interceptors.js - 请求拦截器
import { getToken } from '@/utils/auth.js'
import apiConfig from '@/config/api.js'

// 请求拦截器
export const requestInterceptor = (config) => {
  // 添加token
  const token = getToken()
  if (token) {
    config.header = config.header || {}
    config.header.Authorization = `Bearer ${token}`
  }
  
  // 添加时间戳（防止缓存）
  if (config.method === 'GET') {
    config.url = config.url + (config.url.includes('?') ? '&' : '?') + `_t=${Date.now()}`
  }
  
  // 添加基础URL
  if (!config.url.startsWith('http')) {
    config.url = apiConfig.buildURL(config.url)
  }
  
  return config
}

// 响应拦截器
export const responseInterceptor = (response) => {
  const { data, statusCode } = response
  
  // HTTP状态码检查
  if (statusCode !== 200) {
    return Promise.reject(new Error(`HTTP Error: ${statusCode}`))
  }
  
  // 业务状态码检查
  if (data.code !== undefined && data.code !== 200) {
    // 处理特定错误码
    handleErrorCode(data.code, data.message)
    return Promise.reject(new Error(data.message || '请求失败'))
  }
  
  return data.data !== undefined ? data.data : data
}

// 错误拦截器
export const errorInterceptor = (error) => {
  // 网络错误处理
  if (error.errMsg) {
    if (error.errMsg.includes('timeout')) {
      uni.showToast({
        title: '请求超时',
        icon: 'none'
      })
    } else if (error.errMsg.includes('fail')) {
      uni.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    }
  }
  
  return Promise.reject(error)
}

// 错误码处理
function handleErrorCode(code, message) {
  switch (code) {
    case 401:
      // token过期，跳转登录
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({
        url: '/pages/index/index'
      })
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      break
    case 403:
      uni.showToast({
        title: '权限不足',
        icon: 'none'
      })
      break
    case 404:
      uni.showToast({
        title: '资源不存在',
        icon: 'none'
      })
      break
    case 500:
      uni.showToast({
        title: '服务器错误',
        icon: 'none'
      })
      break
    default:
      if (message) {
        uni.showToast({
          title: message,
          icon: 'none'
        })
      }
  }
}

