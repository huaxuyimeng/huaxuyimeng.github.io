const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

// 示例：获取订单列表
router.get('/orders', async (ctx) => {
    ctx.body = { code: 200, data: [], message: '订单列表（示例）' }
})

// 示例：获取单个订单详情
router.get('/orders/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, data: { id, product: '示例商品', amount: 1, price: 100 }, message: '订单详情（示例）' }
})

// 示例：创建订单
router.post('/orders', async (ctx) => {
    ctx.body = { code: 201, data: ctx.request.body, message: '订单创建成功（示例）' }
})

// 示例：更新订单
router.put('/orders/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, data: { ...ctx.request.body, id }, message: '订单更新成功（示例）' }
})

// 示例：删除订单
router.delete('/orders/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, message: `订单 ${id} 删除成功（示例）` }
})

module.exports = router 