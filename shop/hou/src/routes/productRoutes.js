const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

// 商品相关路由示例

// 获取商品列表
router.get('/products', async (ctx) => {
    ctx.body = { code: 200, message: '商品列表（示例）', data: [] }
})

// 获取单个商品详情
router.get('/products/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, message: '商品详情（示例）', data: { id, name: '示例商品', price: 100 } }
})

// 创建商品
router.post('/products', async (ctx) => {
    ctx.body = { code: 201, message: '商品创建成功（示例）', data: ctx.request.body }
})

// 更新商品
router.put('/products/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, message: '商品更新成功（示例）', data: { ...ctx.request.body, id } }
})

// 删除商品
router.delete('/products/:id', async (ctx) => {
    const { id } = ctx.params
    ctx.body = { code: 200, message: `商品 ${id} 删除成功（示例）`, data: null }
})

module.exports = router 