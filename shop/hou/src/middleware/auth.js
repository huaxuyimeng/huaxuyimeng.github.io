'use strict'
const jwt = require('jsonwebtoken')
const pool = require('../models/db')

// 校验环境变量
if (!process.env.JWT_SECRET) {
    throw new Error('缺少 JWT_SECRET 环境变量')
}

// Token验证中间件
async function authMiddleware(ctx, next) {
    const token = ctx.headers.authorization?.split(' ')[1]
    if (!token) {
        ctx.status = 401
        ctx.body = { code: 401, message: '未提供 token', data: null }
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        ctx.state.user = decoded // 将用户信息挂载到 ctx.state
        await next()
    } catch (error) {
        ctx.status = 401
        ctx.body = { code: 401, message: '无效的 token', data: null }
    }
}

// 管理员权限校验
async function requireAdmin(ctx, next) {
    if (!ctx.state.user || ctx.state.user.role !== 'admin') {
        ctx.status = 403
        ctx.body = { code: 403, message: '需要管理员权限', data: null }
        return
    }
    await next()
}

// 支持多个角色
function requireRole(...roles) {
    return async (ctx, next) => {
        if (!ctx.state.user || !roles.includes(ctx.state.user.role)) {
            ctx.status = 403
            ctx.body = { code: 403, message: `需要${roles.join('或')}权限`, data: null }
            return
        }
        await next()
    }
}

// 登录校验（只判断 token，session 可选）
async function requireLogin(ctx, next) {
    if (!ctx.state.user) {
        ctx.status = 401
        ctx.body = { code: 401, message: '未登录', data: null }
        return
    }
    await next()
}

module.exports = {
    requireLogin,
    requireAdmin,
    requireMerchant: requireRole('merchant'),
    authMiddleware,
    requireRole
} 