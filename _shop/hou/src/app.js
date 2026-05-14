const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const jwt = require('jsonwebtoken')
const logger = require('koa-logger')

const app = new Koa()

// Session配置
const CONFIG = {
    key: 'koa.sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}

// 日志中间件（开发环境建议开启）
app.use(logger())

// CORS跨域配置
app.use(cors({
    origin: function (ctx) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
        const origin = ctx.request.header.origin
        if (allowedOrigins.includes(origin)) {
            return origin
        }
        return false
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

// 解析请求体
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}))

// Session中间件
app.use(session(CONFIG, app))

// 错误处理中间件（统一返回结构）
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.error('服务器错误:', err)
        ctx.status = err.status || 500
        ctx.body = {
            code: ctx.status,
            message: err.message || '服务器内部错误',
            data: null
        }
    }
})

// 请求耗时日志
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
})

// 路由引入
const merchantRoutes = require('./routes/merchantRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')

// 路由注册（routes带/api前缀，allowedMethods不带前缀）
app.use(merchantRoutes.routes()).use(merchantRoutes.allowedMethods())
app.use(productRoutes.routes()).use(productRoutes.allowedMethods())
app.use(orderRoutes.routes()).use(orderRoutes.allowedMethods())
app.use(userRoutes.routes()).use(userRoutes.allowedMethods())

// 404处理（统一返回结构）
app.use(async (ctx) => {
    ctx.status = 404
    ctx.body = {
        code: 404,
        message: '接口不存在',
        data: null
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`)
    console.log(`API文档: http://localhost:${PORT}/api-docs`)
})

module.exports = app 