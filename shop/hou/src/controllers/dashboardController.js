'use strict'
// 数据统计大屏相关接口
const pool = require('../models/db')

// 获取总数统计
exports.getStats = async ctx => {
    try {
        const [usersRows] = await pool.query('SELECT COUNT(*) as users FROM users')
        const [merchantsRows] = await pool.query('SELECT COUNT(*) as merchants FROM merchants')
        const [productsRows] = await pool.query('SELECT COUNT(*) as products FROM products')
        const [ordersRows] = await pool.query('SELECT COUNT(*) as orders FROM orders')
        ctx.body = {
            code: 200, message: '获取成功', data: {
                users: usersRows[0]?.users || 0,
                merchants: merchantsRows[0]?.merchants || 0,
                products: productsRows[0]?.products || 0,
                orders: ordersRows[0]?.orders || 0
            }
        }
    } catch (error) {
        console.error(error)
        ctx.status = 500
        ctx.body = { code: 500, message: '获取统计数据失败', data: null }
    }
}

// 获取订单趋势
exports.getOrderTrend = async ctx => {
    try {
        const [rows] = await pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `)
        ctx.body = {
            code: 200, message: '获取成功', data: {
                xAxis: { type: 'category', data: rows.map(r => r.date) },
                yAxis: { type: 'value' },
                series: [{ data: rows.map(r => r.count), type: 'line', name: '订单数' }]
            }
        }
    } catch (error) {
        console.error(error)
        ctx.status = 500
        ctx.body = { code: 500, message: '获取订单趋势失败', data: null }
    }
}

// 获取热销商品
exports.getHotProducts = async ctx => {
    try {
        const [rows] = await pool.query(`
        SELECT p.name, SUM(o.quantity) as sales
        FROM orders o JOIN products p ON o.product_id=p.id
        GROUP BY o.product_id
        ORDER BY sales DESC
        LIMIT 5
      `)
        ctx.body = {
            code: 200, message: '获取成功', data: {
                xAxis: { type: 'category', data: rows.map(r => r.name) },
                yAxis: { type: 'value' },
                series: [{ data: rows.map(r => r.sales), type: 'bar', name: '销量' }]
            }
        }
    } catch (error) {
        console.error(error)
        ctx.status = 500
        ctx.body = { code: 500, message: '获取热销商品失败', data: null }
    }
} 