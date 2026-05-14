// api/request.js - uni-app请求封装
import { showToast, showLoading, hideLoading } from '@/utils/feedback.js'

// 基础URL配置
const baseURL = process.env.VUE_APP_API_BASE_URL || ''

// 请求方法
function request(options = {}) {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = {},
      params = {},
      header = {},
      showLoading: showLoad = true
    } = options
    
    // 显示加载
    if (showLoad) {
      showLoading()
    }
    
    // 添加token
    const token = uni.getStorageSync('token')
    if (token) {
      header.Authorization = `Bearer ${token}`
    }
    
    // GET请求将params拼接到url
    let requestUrl = baseURL + url
    if (method === 'GET' && Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      requestUrl += (url.includes('?') ? '&' : '?') + queryString
    }
    
    uni.request({
      url: requestUrl,
      method: method,
      data: method !== 'GET' ? data : {},
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (showLoad) {
          hideLoading()
        }
        
        const response = res.data
        
        // 处理成功响应
        if (response.code === 200 || res.statusCode === 200) {
          resolve(response.data || response)
          return
        }
        
        // 处理错误码
        handleErrorCode(response.code, response.message)
        reject(new Error(response.message || '请求失败'))
      },
      fail: (error) => {
        if (showLoad) {
          hideLoading()
        }
        
        // 处理网络错误
        handleNetworkError(error)
        reject(error)
      }
    })
  })
}

// 错误处理函数
function handleErrorCode(code, message) {
  switch (code) {
    case 401:
      // token过期
      uni.removeStorageSync('token')
      uni.reLaunch({ url: '/pages/index/index' })
      showToast('登录已过期，请重新登录')
      break
    case 403:
      // 权限不足
      showToast('权限不足')
      break
    case 404:
      // 资源不存在
      showToast('资源不存在')
      break
    case 500:
      // 服务器错误
      showToast('服务器错误')
      break
    default:
      showToast(message || '操作失败')
  }
}

// 网络错误处理
function handleNetworkError(error) {
  if (error.errMsg && error.errMsg.includes('timeout')) {
    showToast('请求超时')
  } else if (error.errMsg && error.errMsg.includes('fail')) {
    showToast('网络连接失败')
  } else {
    showToast('网络错误')
  }
}

// 导出请求方法
export default request
