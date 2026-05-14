const { pool } = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const merchantModel = require('../models/merchantModel');

// 登录错误次数限制（如需分布式部署建议用Redis等持久化存储）
const loginFailMap = new Map();
const MAX_FAIL = 5;
const BLOCK_MINUTES = 10;

// 获取商家详情
exports.getMerchantDetail = async ctx => {
    const { id } = ctx.params;
    try {
        const [rows] = await pool.query('SELECT * FROM merchants WHERE id=?', [id]);
        if (rows[0]) {
            ctx.body = { code: 200, message: '获取成功', data: rows[0] };
        } else {
            ctx.body = { code: 404, message: '未找到商家', data: null };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { code: 500, message: '服务器内部错误', data: null };
    }
}
// 更新商家信息
exports.updateMerchant = async ctx => {
    const { id } = ctx.params;
    const { name, shop_name, description } = ctx.request.body;
    try {
        await pool.query('UPDATE merchants SET name=?, shop_name=?, description=? WHERE id=?', [name, shop_name, description, id]);
        ctx.body = { code: 200, message: '更新成功', data: null };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { code: 500, message: '服务器内部错误', data: null };
    }
}
// 商户登录
exports.login = async ctx => {
    let { name, password } = ctx.request.body;
    if (!name || !password) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '用户名和密码不能为空', data: null };
        return;
    }
    name = name.trim();
    password = password.trim();
    if (name.length < 2 || password.length < 6) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '用户名或密码格式不正确', data: null };
        return;
    }
    const failInfo = loginFailMap.get(name);
    const now = Date.now();
    if (failInfo && failInfo.count >= MAX_FAIL && now - failInfo.lastFail < BLOCK_MINUTES * 60 * 1000) {
        ctx.status = 429;
        ctx.body = { code: 429, message: `该账号因连续登录失败已被锁定，请${BLOCK_MINUTES}分钟后再试`, data: null };
        return;
    }
    try {
        const merchant = await merchantModel.findMerchantByName(name);
        if (!merchant) {
            ctx.status = 401;
            ctx.body = { code: 401, message: '用户不存在，请检查用户名是否正确', data: null };
            loginFailMap.set(name, { count: (failInfo ? failInfo.count + 1 : 1), lastFail: now });
            return;
        }
        // bcrypt密码校验
        const passwordMatch = await bcrypt.compare(password, merchant.password);
        if (passwordMatch) {
            const token = jwt.sign(
                { id: merchant.id, role: merchant.role || 'merchant' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '登录成功',
                data: {
                    id: merchant.id,
                    name: merchant.name,
                    shop_name: merchant.shop_name,
                    token,
                    role: merchant.role || 'merchant',
                    redirect: merchant.role === 'admin' ? '/dashboard' : '/product'
                }
            };
            loginFailMap.delete(name);
        } else {
            ctx.status = 401;
            ctx.body = { code: 401, message: '密码错误，请检查密码是否正确', data: null };
            loginFailMap.set(name, { count: (failInfo ? failInfo.count + 1 : 1), lastFail: now });
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { code: 500, message: '服务器内部错误', data: null };
    }
} 