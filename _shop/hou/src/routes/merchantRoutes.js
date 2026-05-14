const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

const dashboardController = require('../controllers/dashboardController')
const merchantController = require('../controllers/merchantController')
const userController = require('../controllers/userController')

// 数据统计相关接口
router.get('/dashboard/stats', dashboardController.getStats)
router.get('/dashboard/order-trend', dashboardController.getOrderTrend)
router.get('/dashboard/hot-products', dashboardController.getHotProducts)

// 商家相关接口
router.get('/merchants/:id', merchantController.getMerchantDetail)
router.put('/merchants/:id', merchantController.updateMerchant)

// 用户相关接口
router.get('/users', userController.getUsers)
// 路由参数统一为user_id
router.post('/users/:user_id/reset-password', userController.resetPassword)

module.exports = router 