const { pool } = require('../models/db')
const bcrypt = require('bcryptjs')

// 获取用户列表
exports.getUsers = async ctx => {
    try {
        const [rows] = await pool.query('SELECT * FROM users')
        ctx.body = { code: 200, message: '获取成功', data: rows }
    } catch (error) {
        ctx.status = 500
        ctx.body = { code: 500, message: '获取用户失败', data: null }
    }
}

// 重置用户密码（重置为123456，使用bcrypt加密）
exports.resetPassword = async ctx => {
    const { user_id } = ctx.params
    try {
        const newPwd = await bcrypt.hash('123456', 10)
        await pool.query('UPDATE users SET user_password=? WHERE user_id=?', [newPwd, user_id])
        ctx.body = { code: 200, message: '密码已重置为123456', data: null }
    } catch (error) {
        ctx.status = 500
        ctx.body = { code: 500, message: '重置密码失败', data: null }
    }
} 