import request from '@/utils/http'

// 获取统计数据
export function getStats() {
    return request({
        url: '/dashboard/stats',
        method: 'get'
    })
}

// 获取订单趋势
export function getOrderTrend() {
    return request({
        url: '/dashboard/order-trend',
        method: 'get'
    })
}

// 获取热门商品
export function getHotProducts() {
    return request({
        url: '/dashboard/hot-products',
        method: 'get'
    })
}

// 获取销售统计
export function getSalesStats(params = {}) {
    return request({
        url: '/dashboard/sales-stats',
        method: 'get',
        params
    })
}

// 获取用户统计
export function getUserStats(params = {}) {
    return request({
        url: '/dashboard/user-stats',
        method: 'get',
        params
    })
}

// 获取商品统计
export function getProductStats(params = {}) {
    return request({
        url: '/dashboard/product-stats',
        method: 'get',
        params
    })
}

// 获取实时数据
export function getRealTimeData() {
    return request({
        url: '/dashboard/real-time',
        method: 'get'
    })
}

export default {
    getStats,
    getOrderTrend,
    getHotProducts,
    getSalesStats,
    getUserStats,
    getProductStats,
    getRealTimeData
} 