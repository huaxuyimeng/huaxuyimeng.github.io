import axios from 'axios'
import { ElLoading } from 'element-plus'
import {
    showError,
    showWarning,
    handleApiError,
    showLoading,
    hideLoading
} from '@/utils/notification'

// 创建axios实例
const instance = axios.create({
    baseURL: '/api', // 只写/api，走Vite代理
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

// 请求重试配置
const retryConfig = {
    retries: 2,
    retryDelay: 1000,
    retryCondition: (error) => {
        return axios.isAxiosError(error) &&
            (error.response?.status >= 500 || !error.response)
    }
}

// 全局加载状态
let globalLoading = null

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 添加token到请求头
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        if (userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`
        }

        // 显示全局加载状态（仅对特定请求）
        if (config.showLoading !== false) {
            globalLoading = ElLoading.service({
                lock: true,
                text: '请求中...',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        }

        // 添加请求时间戳
        config.metadata = { startTime: new Date() }

        return config
    },
    error => {
        console.error('请求错误:', error)
        closeGlobalLoading()
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        closeGlobalLoading()

        // 记录请求耗时
        const endTime = new Date()
        const startTime = response.config.metadata?.startTime
        if (startTime) {
            const duration = endTime - startTime
            console.log(`请求 ${response.config.url} 耗时: ${duration}ms`)
        }

        // 处理成功响应
        const res = response.data
        if (res.code === 200 || res.code === 201) {
            return response
        } else {
            showError(res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }
    },
    async (error) => {
        closeGlobalLoading()

        // 处理重试逻辑
        const config = error.config
        if (config && retryConfig.retryCondition(error) && config.__retryCount < retryConfig.retries) {
            config.__retryCount = config.__retryCount || 0
            config.__retryCount++

            console.log(`请求重试 ${config.__retryCount}/${retryConfig.retries}: ${config.url}`)

            // 延迟重试
            await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * config.__retryCount))

            return instance(config)
        }

        // 处理错误响应
        if (error.response) {
            await handleResponseError(error.response.status, error.response.data, error)
        } else if (error.request) {
            showError('无法连接到服务器，请检查网络连接')
        } else {
            showError('请求配置错误')
        }

        return Promise.reject(error)
    }
)

// 处理响应错误
async function handleResponseError(status, data, error) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

    switch (status) {
        case 401:
            showError('登录已过期，请重新登录')
            localStorage.removeItem('userInfo')

            // 保存当前路径，登录后跳转回来
            const currentPath = window.location.pathname + window.location.search
            if (currentPath !== '/login') {
                localStorage.setItem('redirectPath', currentPath)
            }

            // 智能重定向到登录页
            window.location.href = '/login'
            break

        case 403:
            showError('权限不足，无法访问该资源')
            // 权限不足时，根据用户角色重定向
            const redirectPath = getRedirectPathByRole(userInfo.role, userInfo.is_admin)
            window.location.href = redirectPath
            break

        case 404:
            showError('请求的资源不存在')
            break

        case 422:
            // 表单验证错误
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat()
                showError(errorMessages.join(', '))
            } else {
                showError(data.message || '数据验证失败')
            }
            break

        case 429:
            showWarning('请求过于频繁，请稍后再试')
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
            showError(data?.message || `请求失败，状态码：${status}`)
    }
}

// 根据用户角色获取重定向路径
function getRedirectPathByRole(role, isAdmin) {
    if (isAdmin === 1) {
        return '/dashboard'
    }

    switch (role) {
        case 'merchant':
            return '/product'
        case 'user':
            return '/product'
        default:
            return '/product'
    }
}

// 关闭全局加载状态
function closeGlobalLoading() {
    if (globalLoading) {
        globalLoading.close()
        globalLoading = null
    }
}

// 导出默认请求实例
export default instance

// 创建带重试的请求方法
export const requestWithRetry = async (config, retries = 2) => {
    try {
        return await instance(config)
    } catch (error) {
        if (retries > 0 && retryConfig.retryCondition(error)) {
            console.log(`重试请求: ${config.url}`)
            await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay))
            return requestWithRetry(config, retries - 1)
        }
        throw error
    }
}

// 批量请求
export const batchRequest = async (requests) => {
    try {
        const responses = await Promise.allSettled(requests.map(req => instance(req)))

        const results = responses.map((response, index) => {
            if (response.status === 'fulfilled') {
                return { success: true, data: response.value.data, index }
            } else {
                return { success: false, error: response.reason, index }
            }
        })

        return results
    } catch (error) {
        console.error('批量请求失败:', error)
        throw error
    }
}

// 上传文件带进度
export const uploadWithProgress = (url, file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return instance({
        url,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(percentCompleted)
            }
        }
    })
}

// 带加载状态的请求
export const requestWithLoading = async (config, loadingMessage = '请求中...') => {
    const loading = ElLoading.service({
        lock: true,
        text: loadingMessage,
        background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
        const response = await instance(config)
        return response
    } finally {
        loading.close()
    }
} 