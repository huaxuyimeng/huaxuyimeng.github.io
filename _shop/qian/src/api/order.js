import request from '@/utils/http'

// 获取订单列表
export function getOrders(params = {}) {
    return request({
        url: '/orders',
        method: 'get',
        params
    })
}

// 获取单个订单详情
export function getOrder(id) {
    return request({
        url: `/orders/${id}`,
        method: 'get'
    })
}

// 创建订单
export function createOrder(data) {
    return request({
        url: '/orders',
        method: 'post',
        data
    })
}

// 更新订单
export function updateOrder(id, data) {
    return request({
        url: `/orders/${id}`,
        method: 'put',
        data
    })
}

// 删除订单
export function deleteOrder(id) {
    return request({
        url: `/orders/${id}`,
        method: 'delete'
    })
}

// 批量删除订单
export function batchDeleteOrders(ids) {
    return request({
        url: '/orders/batch-delete',
        method: 'post',
        data: { ids }
    })
}

// 更新订单状态
export function updateOrderStatus(id, status) {
    return request({
        url: `/orders/${id}/status`,
        method: 'put',
        data: { status }
    })
}

// 批量更新订单状态
export function batchUpdateOrderStatus(ids, status) {
    return request({
        url: '/orders/batch-update-status',
        method: 'put',
        data: { ids, status }
    })
}

// 获取订单统计信息
export function getOrderStats(params = {}) {
    return request({
        url: '/orders/stats',
        method: 'get',
        params
    })
}

// 获取订单销售排行
export function getOrderSalesRanking(params = {}) {
    return request({
        url: '/orders/sales-ranking',
        method: 'get',
        params
    })
}

// 导出订单数据
export function exportOrders(format = 'excel', params = {}) {
    return request({
        url: '/orders/export',
        method: 'get',
        params: { format, ...params },
        responseType: 'blob'
    })
}

// 导入订单数据
export function importOrders(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)

    if (options.overwrite) {
        formData.append('overwrite', options.overwrite)
    }

    return request({
        url: '/orders/import',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取订单日志
export function getOrderLogs(id, params = {}) {
    return request({
        url: `/orders/${id}/logs`,
        method: 'get',
        params
    })
}

// 订单搜索
export function searchOrders(query, params = {}) {
    return request({
        url: '/orders/search',
        method: 'get',
        params: { query, ...params }
    })
}

// 高级订单搜索
export function advancedOrderSearch(criteria) {
    return request({
        url: '/orders/advanced-search',
        method: 'post',
        data: criteria
    })
}

// 获取订单分析数据
export function getOrderAnalytics(params = {}) {
    return request({
        url: '/orders/analytics',
        method: 'get',
        params
    })
}

// 获取订单趋势
export function getOrderTrends(params = {}) {
    return request({
        url: '/orders/trends',
        method: 'get',
        params
    })
}

// 批量订单操作
export function batchOrderOperation(operation, orderIds, data = {}) {
    return request({
        url: '/orders/batch-operation',
        method: 'post',
        data: {
            operation,
            orderIds,
            ...data
        }
    })
} 