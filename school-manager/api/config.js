// api/config.js - API配置文件
import env from '@/config/env.js'
import constant from '@/config/constant.js'

export default {
  // 基础URL
  baseURL: env.baseURL,
  
  // 请求超时时间
  timeout: constant.REQUEST_TIMEOUT,
  
  // 默认请求头
  headers: {
    'Content-Type': 'application/json'
  },
  
  // 是否显示加载提示
  showLoading: true,
  
  // 是否显示错误提示
  showError: true,
  
  // 重试配置
  retry: {
    enabled: true,
    count: 3,
    delay: 1000
  },
  
  // 请求拦截器配置
  interceptors: {
    request: true,
    response: true,
    error: true
  }
}

