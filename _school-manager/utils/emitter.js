// utils/emitter.js - 事件总线工具函数

class EventEmitter {
    constructor() {
        this.events = {}
    }

    /**
     * 监听事件
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callback)
    }

    /**
     * 取消监听
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (!this.events[event]) return

        if (callback) {
            this.events[event] = this.events[event].filter(cb => cb !== callback)
        } else {
            delete this.events[event]
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名
     * @param {...any} args - 参数
     */
    emit(event, ...args) {
        if (!this.events[event]) return

        this.events[event].forEach(callback => {
            callback(...args)
        })
    }

    /**
     * 监听一次
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args)
            this.off(event, onceCallback)
        }
        this.on(event, onceCallback)
    }
}

// 创建全局事件总线实例
export const emitter = new EventEmitter()

// 导出类以便创建新实例
export default EventEmitter

