// directives/auth.js - 权限指令
import permissionConfig from '@/config/permission.js'

export default {
  mounted(el, binding) {
    const { value } = binding
    
    if (!value) {
      return
    }
    
    // 获取用户权限
    const userInfo = uni.getStorageSync('userInfo')
    const userPermissions = userInfo?.permissions || []
    const userRoles = userInfo?.roles || []
    
    // 检查权限
    let hasPermission = false
    
    if (typeof value === 'string') {
      // 单个权限
      hasPermission = permissionConfig.hasPermission(userPermissions, value)
    } else if (Array.isArray(value)) {
      // 多个权限（需要全部满足）
      hasPermission = value.every(perm => 
        permissionConfig.hasPermission(userPermissions, perm)
      )
    } else if (value.permission) {
      // 对象形式，包含权限和角色
      hasPermission = permissionConfig.hasPermission(userPermissions, value.permission)
      
      if (value.role) {
        hasPermission = hasPermission && permissionConfig.hasRole(userRoles, value.role)
      }
    }
    
    // 没有权限则隐藏元素
    if (!hasPermission) {
      el.style.display = 'none'
      // 或者移除元素
      // el.parentNode?.removeChild(el)
    }
  }
}

