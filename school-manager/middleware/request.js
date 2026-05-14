// middleware/request.js - 请求中间件
const middlewares = []

export default {
  // 注册中间件
  use(handler) {
    if (typeof handler === 'function') {
      middlewares.push(handler)
    }
  },
  
  // 执行中间件
  async execute(config) {
    let result = config
    
    for (const middleware of middlewares) {
      try {
        result = await middleware(result) || result
      } catch (error) {
        console.error('Request middleware error:', error)
        throw error
      }
    }
    
    return result
  },
  
  // 清除所有中间件
  clear() {
    middlewares.length = 0
  }
}

// 默认中间件：添加token
middlewares.push((config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = config.header || {}
    config.header.Authorization = `Bearer ${token}`
  }
  return config
})

// 默认中间件：添加时间戳
middlewares.push((config) => {
  if (config.method === 'GET') {
    const separator = config.url.includes('?') ? '&' : '?'
    config.url = `${config.url}${separator}_t=${Date.now()}`
  }
  return config
})

