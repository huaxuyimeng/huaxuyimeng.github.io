import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import {
    isAuthenticated,
    isAdmin,
    canAccess,
    getDefaultRedirectPath,
    saveRedirectPath,
    getAndClearRedirectPath,
    validateToken,
    recordVisit,
    getSmartRedirectPath,
    saveLastVisitedPage
} from '@/utils/auth'
import ProductList from '@/views/ProductList.vue'
import OrderList from '@/views/OrderList.vue'
import UserCenter from '@/views/UserCenter.vue'
import MerchantManage from '@/views/MerchantManage.vue'
import DataDashboard from '@/views/DataDashboard.vue'
import ProductOrders from '@/views/ProductOrders.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: {
            requiresAuth: false,
            title: '用户登录'
        }
    },
    {
        path: '/',
        redirect: '/product'
    },
    {
        path: '/product',
        name: 'product',
        component: ProductList,
        meta: {
            requiresAuth: true,
            title: '商品管理',
            icon: 'el-icon-goods',
            feature: 'product'
        }
    },
    {
        path: '/order',
        name: 'order',
        component: OrderList,
        meta: {
            requiresAuth: true,
            title: '订单管理',
            icon: 'el-icon-s-order',
            feature: 'order'
        }
    },
    {
        path: '/user',
        name: 'user',
        component: UserCenter,
        meta: {
            requiresAuth: true,
            title: '用户中心',
            icon: 'el-icon-user',
            feature: 'user-center'
        }
    },
    {
        path: '/merchant',
        name: 'merchant',
        component: MerchantManage,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: '商家管理',
            icon: 'el-icon-shop',
            feature: 'merchant-manage'
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DataDashboard,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: '数据大屏',
            icon: 'el-icon-data-analysis',
            feature: 'dashboard'
        }
    },
    {
        path: '/merchant-edit/:id',
        name: 'MerchantEdit',
        component: () => import('../views/MerchantEdit.vue'),
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: '编辑商家',
            icon: 'el-icon-edit',
            feature: 'merchant-manage'
        }
    },
    {
        path: '/user-manage',
        name: 'UserManage',
        component: () => import('../views/UserManage.vue'),
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: '用户管理',
            icon: 'el-icon-user-solid',
            feature: 'user-manage'
        }
    },
    {
        path: '/product-orders',
        name: 'ProductOrders',
        component: ProductOrders,
        meta: {
            requiresAuth: true,
            title: '商品订单',
            icon: 'el-icon-goods',
            feature: 'product-orders'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/product'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局加载状态
let loadingInstance = null

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 显示加载状态
    loadingInstance = ElLoading.service({
        lock: true,
        text: '页面加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
        // 设置页面标题
        if (to.meta.title) {
            document.title = `${to.meta.title} - 商家管理系统`
        }

        const isLogin = isAuthenticated()
        // 保证 /login 页面始终可访问
        if (to.path === '/login') {
            next()
            return
        }
        if (!isLogin && to.meta.requiresAuth !== false) {
            // 未登录，保存当前路径，登录后回跳
            saveRedirectPath(to.fullPath)
            next('/login')
            return
        }

        // 检查功能权限
        if (to.meta.feature && !canAccess(to.meta.feature)) {
            ElMessage.error('权限不足，无法访问该功能')
            saveRedirectPath(to.fullPath)
            next(getSmartRedirectPath())
            return
        }

        // 需要管理员权限但用户不是管理员
        if (to.meta.requiresAdmin && !isAdmin()) {
            ElMessage.error('权限不足，需要管理员权限')
            saveRedirectPath(to.fullPath)
            next(getSmartRedirectPath())
            return
        }

        // 权限验证通过，记录访问
        if (to.path !== from.path) {
            saveLastVisitedPage(to.path)
        }

        next()
    } catch (error) {
        console.error('路由守卫错误:', error)
        ElMessage.error('页面跳转失败，请重新登录')
        localStorage.clear()
        next('/login')
    } finally {
        // 延迟关闭加载状态，确保页面渲染完成
        setTimeout(() => {
            if (loadingInstance) {
                loadingInstance.close()
            }
        }, 300)
    }
})

// 路由后置守卫
router.afterEach((to, from) => {
    // 滚动到顶部
    window.scrollTo(0, 0)

    // 记录访问历史
    if (to.meta.title && to.path !== '/login') {
        recordVisit(to.path, to.meta.title)
    }
})

// 路由错误处理
router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败')
    if (loadingInstance) {
        loadingInstance.close()
    }
})

export default router 