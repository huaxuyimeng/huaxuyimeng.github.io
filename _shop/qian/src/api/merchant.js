import request from '@/utils/http'

// 获取所有商户
export function getMerchants(params = {}) {
    return request.get('/merchants', { params })
}

/**
 * 获取当前商户信息
 * @returns {Promise}
 */
export function getCurrentMerchant() {
    return request({
        url: '/merchants/current',
        method: 'get'
    })
}

// 商户登录
export function login(data) {
    return request({
        url: '/merchants/login',
        method: 'post',
        data
    })
}

// 用户登录（users表）
export function userLogin(data) {
    return request({
        url: '/merchants/user-login',
        method: 'post',
        data
    })
}

// 获取商家详情
export function getMerchantDetail(id) {
    return request({
        url: `/merchants/${id}`,
        method: 'get'
    })
}

// 更新商家信息
export function updateMerchant(id, data) {
    return request({
        url: `/merchants/${id}`,
        method: 'put',
        data
    })
}

// 创建商家
export function createMerchant(data) {
    return request({
        url: '/merchants',
        method: 'post',
        data
    })
}

// 删除商家
export function deleteMerchant(id) {
    return request({
        url: `/merchants/${id}`,
        method: 'delete'
    })
}

// 获取商家统计信息
export function getMerchantStats() {
    return request({
        url: '/merchants/stats',
        method: 'get'
    })
}

// 批量操作商家
export function batchMerchantOperation(operation, merchantIds, data = {}) {
    return request({
        url: '/merchants/batch-operation',
        method: 'post',
        data: {
            operation,
            merchantIds,
            ...data
        }
    })
}

export default {
    // 获取当前登录的商户信息
    getCurrentMerchant() {
        return request({
            url: '/merchants/current',
            method: 'get'
        })
    },

    // 获取商家详情
    getMerchantDetail(id) {
        return request({
            url: `/merchants/${id}`,
            method: 'get'
        })
    },

    // 更新商家信息
    updateMerchant(id, data) {
        return request({
            url: `/merchants/${id}`,
            method: 'put',
            data
        })
    }
}; 