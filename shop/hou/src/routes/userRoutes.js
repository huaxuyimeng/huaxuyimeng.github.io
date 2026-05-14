const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const pool = require('../models/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'test_secret'

// 用户登录（查数据库并返回token）
router.post('/user/login', async (ctx) => {
    const { username, password } = ctx.request.body

    if (!username || !password) {
        ctx.body = { code: 400, message: '用户名和密码不能为空', data: null }
        return
    }
    try {
        // 查询用户
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? LIMIT 1',
            [username]
        )
        const user = rows[0]

        if (!user) {
            ctx.body = { code: 401, message: '用户不存在', data: null }
            return
        }

        // 校验密码（假设数据库字段为 user_password，存储bcrypt hash）
        const passwordMatch = await bcrypt.compare(password, user.user_password)
        if (!passwordMatch) {
            ctx.body = { code: 401, message: '密码错误', data: null }
            return
        }

        // 生成token
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
                role: user.role || 'user',
                is_admin: user.is_admin || 0
            },
            SECRET,
            { expiresIn: '24h' }
        )

        // 登录成功，返回用户信息和token
        ctx.body = {
            code: 200,
            data: {
                id: user.user_id,
                username: user.username,
                role: user.role || 'user',
                is_admin: user.is_admin || 0,
                token
            },
            message: '登录成功'
        }
    } catch (error) {
        ctx.status = 500
        ctx.body = { code: 500, message: '服务器内部错误', data: null }
    }
})

// 获取用户信息（示例）
router.get('/user/info', async (ctx) => {
    // 这里只做示例，实际应根据token查用户
    ctx.body = {
        code: 200,
        data: {
            username: 'admin',
            role: 'admin',
            is_admin: 1
        },
        message: '获取用户信息成功（示例）'
    }
})

module.exports = router 