// mock/server.js - Mock服务器
// 注意：uni-app中Mock通常通过拦截请求实现，而不是真正的服务器

let isRunning = false
const mockHandlers = []

export default {
  // 启动Mock服务器
  start() {
    if (isRunning) {
      console.warn('Mock server is already running')
      return
    }
    
    isRunning = true
    
    // 在uni-app中，Mock通常通过拦截uni.request实现
    // 这里提供一个基础的Mock框架
    console.log('Mock server started (intercepting requests)')
  },
  
  // 停止Mock服务器
  stop() {
    if (!isRunning) {
      console.warn('Mock server is not running')
      return
    }
    
    isRunning = false
    mockHandlers.length = 0
    console.log('Mock server stopped')
  },
  
  // 注册Mock处理器
  register(url, method, handler) {
    mockHandlers.push({
      url,
      method: method.toUpperCase(),
      handler
    })
  },
  
  // 查找匹配的Mock处理器
  findHandler(url, method) {
    return mockHandlers.find(handler => {
      const urlMatch = typeof handler.url === 'string' 
        ? url.includes(handler.url)
        : handler.url.test(url)
      return urlMatch && handler.method === method.toUpperCase()
    })
  },
  
  // 执行Mock处理器
  async executeHandler(handler, params, data) {
    try {
      const result = await handler.handler(params, data)
      return {
        code: 200,
        message: 'success',
        data: result
      }
    } catch (error) {
      return {
        code: 500,
        message: error.message || 'Mock handler error',
        data: null
      }
    }
  },
  
  // 检查是否运行中
  isRunning() {
    return isRunning
  }
}

