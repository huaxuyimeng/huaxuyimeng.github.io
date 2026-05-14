import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { setupNetworkListener, showError } from '@/utils/notification'

// 创建应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
    console.error('全局错误:', err, instance, info)
    // 用户可见提示
    showError('页面发生错误，请刷新或联系管理员')
    // 可以在这里添加错误上报逻辑
    // 例如发送到错误监控服务
}

// 全局属性
app.config.globalProperties.$formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN')
}

app.config.globalProperties.$formatDateTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleString('zh-CN')
}

app.config.globalProperties.$formatPrice = (price) => {
    if (!price) return '¥0.00'
    return `¥${parseFloat(price).toFixed(2)}`
}

// 全局指令
app.directive('focus', {
    mounted(el) {
        el.focus()
    }
})

app.directive('click-outside', {
    mounted(el, binding) {
        el._clickOutside = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('click', el._clickOutside)
    },
    unmounted(el) {
        document.removeEventListener('click', el._clickOutside)
    }
})

// 使用插件
app.use(ElementPlus)
app.use(router)

// 设置网络监听
setupNetworkListener()

// 挂载应用
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
    console.log('🚀 商家管理系统已启动')
    console.log('📱 当前环境:', import.meta.env.MODE)
    console.log('🔗 API地址:', import.meta.env.VITE_API_BASE_URL || '/api')
} 