// 用户认证和权限管理工具

// 用户信息存储键名
const USER_INFO_KEY = 'userInfo'
const REMEMBERED_USER_KEY = 'rememberedUser'
const REDIRECT_PATH_KEY = 'redirectPath'
const VISIT_HISTORY_KEY = 'visitHistory'
const USER_PREFERENCES_KEY = 'userPreferences'
const LAST_VISITED_PAGE_KEY = 'lastVisitedPage'

// 用户角色枚举
export const USER_ROLES = {
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    USER: 'user'
}

// 权限级别
export const PERMISSION_LEVELS = {
    NONE: 0,
    USER: 1,
    MERCHANT: 2,
    ADMIN: 3
}

// 页面类型
export const PAGE_TYPES = {
    DASHBOARD: 'dashboard',
    PRODUCT: 'product',
    ORDER: 'order',
    USER_CENTER: 'user-center',
    MERCHANT_MANAGE: 'merchant-manage',
    USER_MANAGE: 'user-manage'
}

// 获取用户信息
export function getUserInfo() {
    try {
        const userInfo = localStorage.getItem(USER_INFO_KEY)
        return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
    }
}

// 设置用户信息
export function setUserInfo(userInfo) {
    try {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
        return true
    } catch (error) {
        console.error('设置用户信息失败:', error)
        return false
    }
}

// 清除用户信息
export function clearUserInfo() {
    try {
        localStorage.removeItem(USER_INFO_KEY)
        return true
    } catch (error) {
        console.error('清除用户信息失败:', error)
        return false
    }
}

// 检查是否已登录
export function isAuthenticated() {
    const userInfo = getUserInfo()
    return !!(userInfo && userInfo.token && userInfo.id)
}

// 检查是否为管理员
export function isAdmin() {
    const userInfo = getUserInfo()
    return userInfo && userInfo.is_admin === 1
}

// 获取用户角色
export function getUserRole() {
    const userInfo = getUserInfo()
    return userInfo ? userInfo.role || USER_ROLES.USER : null
}

// 获取用户权限级别
export function getUserPermissionLevel() {
    const userInfo = getUserInfo()
    if (!userInfo) return PERMISSION_LEVELS.NONE

    if (userInfo.is_admin === 1) return PERMISSION_LEVELS.ADMIN
    if (userInfo.role === USER_ROLES.MERCHANT) return PERMISSION_LEVELS.MERCHANT
    return PERMISSION_LEVELS.USER
}

// 检查是否有指定权限
export function hasPermission(requiredLevel) {
    const userLevel = getUserPermissionLevel()
    return userLevel >= requiredLevel
}

// 检查是否可以访问指定功能
export function canAccess(feature) {
    const userInfo = getUserInfo()
    if (!userInfo) return false

    const featurePermissions = {
        'dashboard': PERMISSION_LEVELS.ADMIN,
        'merchant-manage': PERMISSION_LEVELS.ADMIN,
        'user-manage': PERMISSION_LEVELS.ADMIN,
        'product': PERMISSION_LEVELS.USER,
        'order': PERMISSION_LEVELS.USER,
        'user-center': PERMISSION_LEVELS.USER
    }

    const requiredLevel = featurePermissions[feature] || PERMISSION_LEVELS.USER
    return hasPermission(requiredLevel)
}

// 获取智能重定向路径
export function getSmartRedirectPath() {
    const userInfo = getUserInfo()
    if (!userInfo) return '/login'

    // 1. 检查是否有保存的重定向路径（优先级最高）
    const savedPath = getAndClearRedirectPath()
    if (savedPath && savedPath !== '/login' && canAccessPage(savedPath)) {
        return savedPath
    }

    // 2. 检查用户最后访问的页面（优先级次之）
    const lastVisited = getLastVisitedPage()
    if (lastVisited && canAccessPage(lastVisited) && lastVisited !== '/login') {
        return lastVisited
    }

    // 3. 检查用户设置的默认页面
    const defaultPage = getUserDefaultPage()
    if (defaultPage && canAccessPage(defaultPage)) {
        return defaultPage
    }

    // 4. 根据用户角色智能跳转（兜底方案）
    return getDefaultRedirectPath()
}

// 获取默认重定向路径
export function getDefaultRedirectPath() {
    const userInfo = getUserInfo()
    if (!userInfo) return '/login'

    // 管理员优先跳转到数据大屏
    if (isAdmin()) {
        return '/dashboard'
    }

    // 根据用户角色跳转
    switch (getUserRole()) {
        case USER_ROLES.MERCHANT:
            return '/product'
        case USER_ROLES.USER:
            return '/product'
        default:
            return '/product'
    }
}

// 检查是否可以访问指定页面
export function canAccessPage(path) {
    if (!path || path === '/login') return false

    const pathPermissions = {
        '/dashboard': PERMISSION_LEVELS.ADMIN,
        '/merchant-manage': PERMISSION_LEVELS.ADMIN,
        '/user-manage': PERMISSION_LEVELS.ADMIN,
        '/product': PERMISSION_LEVELS.USER,
        '/order': PERMISSION_LEVELS.USER,
        '/user-center': PERMISSION_LEVELS.USER
    }

    const requiredLevel = pathPermissions[path] || PERMISSION_LEVELS.USER
    return hasPermission(requiredLevel)
}

// 保存重定向路径
export function saveRedirectPath(path) {
    try {
        if (path && path !== '/login') {
            localStorage.setItem(REDIRECT_PATH_KEY, path)
            return true
        }
        return false
    } catch (error) {
        console.error('保存重定向路径失败:', error)
        return false
    }
}

// 获取并清除重定向路径
export function getAndClearRedirectPath() {
    try {
        const path = localStorage.getItem(REDIRECT_PATH_KEY)
        if (path) {
            localStorage.removeItem(REDIRECT_PATH_KEY)
            return path
        }
        return null
    } catch (error) {
        console.error('获取重定向路径失败:', error)
        return null
    }
}

// 保存最后访问的页面
export function saveLastVisitedPage(path) {
    try {
        if (path && path !== '/login') {
            localStorage.setItem(LAST_VISITED_PAGE_KEY, path)
            return true
        }
        return false
    } catch (error) {
        console.error('保存最后访问页面失败:', error)
        return false
    }
}

// 获取最后访问的页面
export function getLastVisitedPage() {
    try {
        return localStorage.getItem(LAST_VISITED_PAGE_KEY) || null
    } catch (error) {
        console.error('获取最后访问页面失败:', error)
        return null
    }
}

// 记住用户登录信息
export function rememberUser(username, password) {
    try {
        const userData = { username, password }
        localStorage.setItem(REMEMBERED_USER_KEY, JSON.stringify(userData))
        return true
    } catch (error) {
        console.error('记住用户信息失败:', error)
        return false
    }
}

// 获取记住的用户信息
export function getRememberedUser() {
    try {
        const userData = localStorage.getItem(REMEMBERED_USER_KEY)
        return userData ? JSON.parse(userData) : null
    } catch (error) {
        console.error('获取记住的用户信息失败:', error)
        return null
    }
}

// 清除记住的用户信息
export function clearRememberedUser() {
    try {
        localStorage.removeItem(REMEMBERED_USER_KEY)
        return true
    } catch (error) {
        console.error('清除记住的用户信息失败:', error)
        return false
    }
}

// 记录访问历史
export function recordVisit(path, title) {
    try {
        const history = getVisitHistory()
        const newVisit = {
            path,
            title,
            timestamp: new Date().toISOString()
        }

        // 避免重复记录
        const existingIndex = history.findIndex(item => item.path === path)
        if (existingIndex !== -1) {
            history.splice(existingIndex, 1)
        }

        history.unshift(newVisit)

        // 保持最近10次访问记录
        if (history.length > 10) {
            history.pop()
        }

        localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history))

        // 同时保存最后访问的页面
        saveLastVisitedPage(path)

        return true
    } catch (error) {
        console.error('记录访问历史失败:', error)
        return false
    }
}

// 获取访问历史
export function getVisitHistory() {
    try {
        const history = localStorage.getItem(VISIT_HISTORY_KEY)
        return history ? JSON.parse(history) : []
    } catch (error) {
        console.error('获取访问历史失败:', error)
        return []
    }
}

// 清除访问历史
export function clearVisitHistory() {
    try {
        localStorage.removeItem(VISIT_HISTORY_KEY)
        localStorage.removeItem(LAST_VISITED_PAGE_KEY)
        return true
    } catch (error) {
        console.error('清除访问历史失败:', error)
        return false
    }
}

// 格式化访问时间
export function formatVisitTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) { // 1分钟内
        return '刚刚'
    } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 604800000) { // 1周内
        return `${Math.floor(diff / 86400000)}天前`
    } else {
        return date.toLocaleDateString()
    }
}

// 验证token有效性（可以扩展为调用后端API）
export async function validateToken(token) {
    if (!token) return false

    try {
        // 这里可以调用后端API验证token
        // 暂时简单检查token是否存在
        return !!token
    } catch (error) {
        console.error('Token验证失败:', error)
        return false
    }
}

// 登出处理
export function logout() {
    try {
        // 清除所有认证相关数据
        clearUserInfo()
        clearRememberedUser()
        clearVisitHistory()
        return true
    } catch (error) {
        console.error('登出失败:', error)
        return false
    }
}

// 获取用户显示名称
export function getUserDisplayName() {
    const userInfo = getUserInfo()
    if (!userInfo) return '未登录'

    return userInfo.username || userInfo.name || '用户'
}

// 获取用户头像
export function getUserAvatar() {
    const userInfo = getUserInfo()
    return userInfo ? userInfo.avatar || '' : ''
}

// 检查用户信息是否完整
export function isUserInfoComplete() {
    const userInfo = getUserInfo()
    return !!(userInfo && userInfo.id && userInfo.username && userInfo.token)
}

// 获取用户权限描述
export function getPermissionDescription() {
    const userInfo = getUserInfo()
    if (!userInfo) return '未登录'

    if (userInfo.is_admin === 1) return '系统管理员'
    if (userInfo.role === USER_ROLES.MERCHANT) return '商家用户'
    return '普通用户'
}

// 获取用户偏好设置
export function getUserPreferences() {
    try {
        const preferences = localStorage.getItem(USER_PREFERENCES_KEY)
        return preferences ? JSON.parse(preferences) : {}
    } catch (error) {
        console.error('获取用户偏好失败:', error)
        return {}
    }
}

// 保存用户偏好设置
export function saveUserPreferences(preferences) {
    try {
        localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences))
        return true
    } catch (error) {
        console.error('保存用户偏好失败:', error)
        return false
    }
}

// 获取用户默认页面
export function getUserDefaultPage() {
    const preferences = getUserPreferences()
    const userInfo = getUserInfo()

    if (preferences.defaultPage && canAccessPage(preferences.defaultPage)) {
        return preferences.defaultPage
    }

    return getDefaultRedirectPath()
}

// 设置用户默认页面
export function setUserDefaultPage(path) {
    if (!canAccessPage(path)) return false

    const preferences = getUserPreferences()
    preferences.defaultPage = path
    return saveUserPreferences(preferences)
} 