import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

// 通知类型
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
}

// 消息类型
export const MESSAGE_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
}

// 显示消息
export function showMessage(message, type = MESSAGE_TYPES.INFO, duration = 3000) {
    ElMessage({
        message,
        type,
        duration,
        showClose: true
    })
}

// 显示成功消息
export function showSuccess(message, duration = 3000) {
    showMessage(message, MESSAGE_TYPES.SUCCESS, duration)
}

// 显示警告消息
export function showWarning(message, duration = 4000) {
    showMessage(message, MESSAGE_TYPES.WARNING, duration)
}

// 显示错误消息
export function showError(message, duration = 5000) {
    showMessage(message, MESSAGE_TYPES.ERROR, duration)
}

// 显示信息消息
export function showInfo(message, duration = 3000) {
    showMessage(message, MESSAGE_TYPES.INFO, duration)
}

// 显示通知
export function showNotification(title, message, type = NOTIFICATION_TYPES.INFO, duration = 4500) {
    ElNotification({
        title,
        message,
        type,
        duration,
        showClose: true,
        position: 'top-right'
    })
}

// 显示成功通知
export function showSuccessNotification(title, message, duration = 4500) {
    showNotification(title, message, NOTIFICATION_TYPES.SUCCESS, duration)
}

// 显示警告通知
export function showWarningNotification(title, message, duration = 6000) {
    showNotification(title, message, NOTIFICATION_TYPES.WARNING, duration)
}

// 显示错误通知
export function showErrorNotification(title, message, duration = 8000) {
    showNotification(title, message, NOTIFICATION_TYPES.ERROR, duration)
}

// 显示信息通知
export function showInfoNotification(title, message, duration = 4500) {
    showNotification(title, message, NOTIFICATION_TYPES.INFO, duration)
}

// 确认对话框
export async function confirm(message, title = '确认', type = 'warning') {
    try {
        await ElMessageBox.confirm(message, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type
        })
        return true
    } catch {
        return false
    }
}

// 删除确认对话框
export async function confirmDelete(itemName = '该项目') {
    return await confirm(
        `确定要删除${itemName}吗？此操作不可撤销。`,
        '确认删除',
        'warning'
    )
}

// 退出确认对话框
export async function confirmLogout() {
    return await confirm(
        '确定要退出登录吗？',
        '确认退出',
        'warning'
    )
}

// 处理API错误
export function handleApiError(error, defaultMessage = '操作失败') {
    console.error('API错误:', error)

    if (error.response) {
        const { status, data } = error.response

        switch (status) {
            case 400:
                showError(data?.message || '请求参数错误')
                break
            case 401:
                showError('登录已过期，请重新登录')
                break
            case 403:
                showError('权限不足，无法执行此操作')
                break
            case 404:
                showError('请求的资源不存在')
                break
            case 422:
                if (data?.errors) {
                    const errorMessages = Object.values(data.errors).flat()
                    showError(errorMessages.join(', '))
                } else {
                    showError(data?.message || '数据验证失败')
                }
                break
            case 429:
                showError('请求过于频繁，请稍后再试')
                break
            case 500:
                showError('服务器内部错误，请稍后重试')
                break
            case 502:
            case 503:
            case 504:
                showError('服务暂时不可用，请稍后重试')
                break
            default:
                showError(data?.message || defaultMessage)
        }
    } else if (error.request) {
        showError('无法连接到服务器，请检查网络连接')
    } else {
        showError(error.message || defaultMessage)
    }
}

// 处理表单验证错误
export function handleValidationError(errors) {
    if (typeof errors === 'string') {
        showError(errors)
        return
    }

    if (Array.isArray(errors)) {
        showError(errors.join(', '))
        return
    }

    if (typeof errors === 'object') {
        const errorMessages = Object.values(errors).flat()
        showError(errorMessages.join(', '))
        return
    }

    showError('表单验证失败')
}

// 显示加载消息
export function showLoading(message = '加载中...') {
    return ElMessage({
        message,
        type: 'info',
        duration: 0,
        showClose: false
    })
}

// 隐藏加载消息
export function hideLoading(loadingInstance) {
    if (loadingInstance) {
        loadingInstance.close()
    }
}

// 显示操作结果
export function showOperationResult(success, successMessage = '操作成功', errorMessage = '操作失败') {
    if (success) {
        showSuccess(successMessage)
    } else {
        showError(errorMessage)
    }
}

// 显示网络状态通知
export function showNetworkStatus(isOnline) {
    if (isOnline) {
        showSuccessNotification('网络连接', '网络连接已恢复')
    } else {
        showWarningNotification('网络连接', '网络连接已断开，请检查网络设置')
    }
}

// 监听网络状态变化
export function setupNetworkListener() {
    window.addEventListener('online', () => showNetworkStatus(true))
    window.addEventListener('offline', () => showNetworkStatus(false))
}

// 显示页面加载进度
export function showPageLoading() {
    return ElMessage({
        message: '页面加载中...',
        type: 'info',
        duration: 0,
        showClose: false
    })
}

// 隐藏页面加载进度
export function hidePageLoading(loadingInstance) {
    if (loadingInstance) {
        loadingInstance.close()
    }
}

// 显示文件上传进度
export function showUploadProgress(percent) {
    return ElMessage({
        message: `上传进度: ${percent}%`,
        type: 'info',
        duration: 0,
        showClose: false
    })
}

// 显示批量操作结果
export function showBatchOperationResult(results) {
    const { success, failed } = results
    const total = success.length + failed.length

    if (failed.length === 0) {
        showSuccess(`批量操作完成，共处理 ${total} 项`)
    } else if (success.length === 0) {
        showError(`批量操作失败，共 ${total} 项`)
    } else {
        showWarning(`批量操作部分完成，成功 ${success.length} 项，失败 ${failed.length} 项`)
    }
} 