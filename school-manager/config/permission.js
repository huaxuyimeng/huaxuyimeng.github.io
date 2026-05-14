// config/permission.js - 权限配置
export default {
  // 权限列表
  PERMISSIONS: {
    // 活动相关
    ACTIVITY_VIEW: 'activity:view',
    ACTIVITY_CREATE: 'activity:create',
    ACTIVITY_EDIT: 'activity:edit',
    ACTIVITY_DELETE: 'activity:delete',
    ACTIVITY_MANAGE: 'activity:manage',
    
    // 新闻相关
    NEWS_VIEW: 'news:view',
    NEWS_CREATE: 'news:create',
    NEWS_EDIT: 'news:edit',
    NEWS_DELETE: 'news:delete',
    
    // 用户相关
    USER_VIEW: 'user:view',
    USER_EDIT: 'user:edit',
    USER_DELETE: 'user:delete',
    
    // 系统相关
    SYSTEM_CONFIG: 'system:config',
    SYSTEM_MANAGE: 'system:manage'
  },
  
  // 角色权限映射
  ROLE_PERMISSIONS: {
    // 普通用户
    USER: [
      'activity:view',
      'news:view',
      'user:view',
      'user:edit'
    ],
    
    // 管理员
    ADMIN: [
      'activity:view',
      'activity:create',
      'activity:edit',
      'activity:delete',
      'activity:manage',
      'news:view',
      'news:create',
      'news:edit',
      'news:delete',
      'user:view',
      'user:edit',
      'user:delete',
      'system:config',
      'system:manage'
    ],
    
    // 超级管理员
    SUPER_ADMIN: [
      '*'
    ]
  },
  
  // 检查权限
  hasPermission(userPermissions, permission) {
    if (!userPermissions || !permission) return false
    if (userPermissions.includes('*')) return true
    return userPermissions.includes(permission)
  },
  
  // 检查角色
  hasRole(userRoles, role) {
    if (!userRoles || !role) return false
    return userRoles.includes(role)
  }
}

