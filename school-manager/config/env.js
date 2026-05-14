// config/env.js
const env = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:3000/api',
    uploadURL: 'http://localhost:3000/upload',
    socketURL: 'ws://localhost:3000/ws',
    debug: true
  },
  
  // 测试环境
  test: {
    baseURL: 'https://test-api.example.com/api',
    uploadURL: 'https://test-api.example.com/upload',
    socketURL: 'wss://test-api.example.com/ws',
    debug: true
  },
  
  // 生产环境
  production: {
    baseURL: 'https://api.example.com/api',
    uploadURL: 'https://api.example.com/upload',
    socketURL: 'wss://api.example.com/ws',
    debug: false
  }
}

// 获取当前环境
const currentEnv = process.env.NODE_ENV || 'development'

export default env[currentEnv]