// plugins/custom/index.js - 自定义插件
import { t } from '@/locales/index.js'
import { formatDate } from '@/utils/date.js'

export default {
  install(app) {
    // 全局方法：国际化
    app.config.globalProperties.$t = t
    
    // 全局方法：格式化日期
    app.config.globalProperties.$formatDate = formatDate
    
    // 全局属性：应用信息
    app.config.globalProperties.$app = {
      name: '校园助手',
      version: '1.0.0'
    }
    
    // 全局事件总线
    app.config.globalProperties.$eventBus = {
      on(event, handler) {
        uni.$on(event, handler)
      },
      off(event, handler) {
        uni.$off(event, handler)
      },
      emit(event, data) {
        uni.$emit(event, data)
      }
    }
  }
}

