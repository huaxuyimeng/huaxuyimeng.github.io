// config/api.js - API配置
import env from './env.js'

export default {
  // 基础URL
  baseURL: env.baseURL,
  
  // 请求超时时间
  timeout: 30000,
  
  // 请求头
  headers: {
    'Content-Type': 'application/json'
  },
  
  // API版本
  version: 'v1',
  
  // 接口路径前缀
  prefix: '/api',
  
  // 完整URL构建
  buildURL(path) {
    return `${this.baseURL}${this.prefix}${path}`
  },
  
  // 文件上传配置
  upload: {
    url: env.uploadURL,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    fieldName: 'file'
  },
  
  // WebSocket配置
  websocket: {
    url: env.socketURL,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5
  }
}

