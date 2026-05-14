// middleware/index.js - 中间件统一导出
import requestMiddleware from './request.js'
import permissionMiddleware from './permission.js'
import authMiddleware from './auth.js'

export default {
  request: requestMiddleware,
  permission: permissionMiddleware,
  auth: authMiddleware
}

// 注册中间件
export function useMiddleware(type, handler) {
  switch (type) {
    case 'request':
      return requestMiddleware.use(handler)
    case 'permission':
      return permissionMiddleware.use(handler)
    case 'auth':
      return authMiddleware.use(handler)
    default:
      console.warn(`Unknown middleware type: ${type}`)
  }
}

