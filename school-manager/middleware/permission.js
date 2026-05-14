// middleware/permission.js - 权限中间件
import permissionConfig from '@/config/permission.js'

const middlewares = []

export default {
  // 注册中间件
  use(handler) {
    if (typeof handler === 'function') {
      middlewares.push(handler)
    }
  },
  
  // 检查权限
  check(permission, options = {}) {
    const userInfo = uni.getStorageSync('userInfo')
    const userPermissions = userInfo?.permissions || []
    const userRoles = userInfo?.roles || []
    
    // 执行自定义中间件
    for (const middleware of middlewares) {
      const result = middleware(permission, userPermissions, userRoles, options)
      if (result !== undefined) {
        return result
      }
    }
    
    // 默认权限检查
    if (typeof permission === 'string') {
      return permissionConfig.hasPermission(userPermissions, permission)
    } else if (Array.isArray(permission)) {
      // 多个权限，需要全部满足
      return permission.every(perm => 
        permissionConfig.hasPermission(userPermissions, perm)
      )
    } else if (permission && typeof permission === 'object') {
      // 对象形式
      const hasPermission = permission.permission 
        ? permissionConfig.hasPermission(userPermissions, permission.permission)
        : true
      
      const hasRole = permission.role
        ? permissionConfig.hasRole(userRoles, permission.role)
        : true
      
      return hasPermission && hasRole
    }
    
    return false
  },
  
  // 清除所有中间件
  clear() {
    middlewares.length = 0
  }
}

