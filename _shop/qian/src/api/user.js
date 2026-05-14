import request from '@/utils/http'

// 用户登录
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

// 更新用户信息
export function updateUserInfo(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

// 修改密码
export function changePassword(data) {
    return request({
        url: '/user/change-password',
        method: 'post',
        data
    })
}

// 重置用户密码（管理员功能）
export function resetUserPassword(userId, newPassword) {
    return request({
        url: `/user/${userId}/reset-password`,
        method: 'post',
        data: { newPassword }
    })
}

// 获取用户列表（管理员功能）
export function getUserList(params) {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

// 创建用户（管理员功能）
export function createUser(data) {
    return request({
        url: '/user/create',
        method: 'post',
        data
    })
}

// 删除用户（管理员功能）
export function deleteUser(userId) {
    return request({
        url: `/user/${userId}`,
        method: 'delete'
    })
}

// 更新用户状态（管理员功能）
export function updateUserStatus(userId, status) {
    return request({
        url: `/user/${userId}/status`,
        method: 'put',
        data: { status }
    })
}

// 获取用户统计信息（管理员功能）
export function getUserStats() {
    return request({
        url: '/user/stats',
        method: 'get'
    })
}

// 用户登出
export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

// 刷新token
export function refreshToken() {
    return request({
        url: '/user/refresh-token',
        method: 'post'
    })
}

// 验证token有效性
export function validateToken(token) {
    return request({
        url: '/user/validate-token',
        method: 'post',
        data: { token }
    })
}

// 获取用户权限列表
export function getUserPermissions() {
    return request({
        url: '/user/permissions',
        method: 'get'
    })
}

// 获取用户操作日志
export function getUserLogs(params) {
    return request({
        url: '/user/logs',
        method: 'get',
        params
    })
}

// 上传用户头像
export function uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)

    return request({
        url: '/user/upload-avatar',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取用户偏好设置
export function getUserPreferences() {
    return request({
        url: '/user/preferences',
        method: 'get'
    })
}

// 保存用户偏好设置
export function saveUserPreferences(preferences) {
    return request({
        url: '/user/preferences',
        method: 'put',
        data: preferences
    })
}

// 获取用户访问历史
export function getUserVisitHistory(params) {
    return request({
        url: '/user/visit-history',
        method: 'get',
        params
    })
}

// 清除用户访问历史
export function clearUserVisitHistory() {
    return request({
        url: '/user/visit-history',
        method: 'delete'
    })
}

// 获取用户默认页面设置
export function getUserDefaultPage() {
    return request({
        url: '/user/default-page',
        method: 'get'
    })
}

// 设置用户默认页面
export function setUserDefaultPage(pagePath) {
    return request({
        url: '/user/default-page',
        method: 'put',
        data: { pagePath }
    })
}

// 获取用户通知设置
export function getUserNotificationSettings() {
    return request({
        url: '/user/notification-settings',
        method: 'get'
    })
}

// 更新用户通知设置
export function updateUserNotificationSettings(settings) {
    return request({
        url: '/user/notification-settings',
        method: 'put',
        data: settings
    })
}

// 获取用户安全设置
export function getUserSecuritySettings() {
    return request({
        url: '/user/security-settings',
        method: 'get'
    })
}

// 更新用户安全设置
export function updateUserSecuritySettings(settings) {
    return request({
        url: '/user/security-settings',
        method: 'put',
        data: settings
    })
}

// 切换两步验证
export function toggleTwoFactorAuth(enabled) {
    return request({
        url: '/user/two-factor-auth',
        method: 'post',
        data: { enabled }
    })
}

// 验证两步验证码
export function verifyTwoFactorCode(code) {
    return request({
        url: '/user/verify-two-factor',
        method: 'post',
        data: { code }
    })
}

// 获取用户活动统计
export function getUserActivityStats(params) {
    return request({
        url: '/user/activity-stats',
        method: 'get',
        params
    })
}

// 获取用户最近活动
export function getUserRecentActivity(params) {
    return request({
        url: '/user/recent-activity',
        method: 'get',
        params
    })
}

// 导出用户数据
export function exportUserData(format = 'json') {
    return request({
        url: '/user/export',
        method: 'get',
        params: { format },
        responseType: 'blob'
    })
}

// 导入用户数据
export function importUserData(file) {
    const formData = new FormData()
    formData.append('file', file)

    return request({
        url: '/user/import',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 批量用户操作
export function batchUserOperation(operation, userIds, data = {}) {
    return request({
        url: '/user/batch-operation',
        method: 'post',
        data: {
            operation,
            userIds,
            ...data
        }
    })
}

// 获取用户角色列表
export function getUserRoles() {
    return request({
        url: '/user/roles',
        method: 'get'
    })
}

// 分配用户角色
export function assignUserRole(userId, roleId) {
    return request({
        url: `/user/${userId}/assign-role`,
        method: 'post',
        data: { roleId }
    })
}

// 获取用户部门列表
export function getUserDepartments() {
    return request({
        url: '/user/departments',
        method: 'get'
    })
}

// 分配用户部门
export function assignUserDepartment(userId, departmentId) {
    return request({
        url: `/user/${userId}/assign-department`,
        method: 'post',
        data: { departmentId }
    })
}

export function getUsers(params = {}) {
    return request.get('/users', { params })
}

export default {
    login,
    getUserInfo,
    updateUserInfo,
    changePassword,
    resetUserPassword,
    getUserList,
    createUser,
    deleteUser,
    updateUserStatus,
    getUserStats,
    logout,
    refreshToken,
    validateToken,
    getUserPermissions,
    getUserLogs,
    uploadAvatar,
    getUserPreferences,
    saveUserPreferences,
    getUserVisitHistory,
    clearUserVisitHistory,
    getUserDefaultPage,
    setUserDefaultPage,
    getUserNotificationSettings,
    updateUserNotificationSettings,
    getUserSecuritySettings,
    updateUserSecuritySettings,
    toggleTwoFactorAuth,
    verifyTwoFactorCode,
    getUserActivityStats,
    getUserRecentActivity,
    exportUserData,
    importUserData,
    batchUserOperation,
    getUserRoles,
    assignUserRole,
    getUserDepartments,
    assignUserDepartment,
    getUsers
} 