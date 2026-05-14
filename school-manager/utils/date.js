// utils/date.js - 日期时间工具函数

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期字符串或Date对象
 * @param {string} format - 格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  return formatDateTime(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date) {
  return formatDateTime(date, 'HH:mm:ss')
}

/**
 * 相对时间（如：刚刚、5分钟前、2小时前）
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const now = new Date()
  const diff = now - d
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else if (months < 12) {
    return `${months}个月前`
  } else {
    return `${years}年前`
  }
}

/**
 * 格式化活动时间（今天、明天、具体日期）
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的时间字符串
 */
export function formatActivityTime(date) {
  if (!date) return ''
  
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = targetDate - today
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const timeStr = `${hour}:${minute}`
  
  if (days === 0) {
    return `今天 ${timeStr}`
  } else if (days === 1) {
    return `明天 ${timeStr}`
  } else if (days === -1) {
    return `昨天 ${timeStr}`
  } else {
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${month}月${day}日 ${timeStr}`
  }
}

/**
 * 判断日期是否在今天
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {boolean}
 */
export function isToday(date) {
  if (!date) return false
  
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return false
  
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate()
}

/**
 * 判断日期是否在明天
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {boolean}
 */
export function isTomorrow(date) {
  if (!date) return false
  
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return false
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return d.getFullYear() === tomorrow.getFullYear() &&
         d.getMonth() === tomorrow.getMonth() &&
         d.getDate() === tomorrow.getDate()
}

