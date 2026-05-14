// filters/string.js - 字符串过滤器
import { formatString } from '@/utils/string.js'

/**
 * 截断字符串
 * @param {string} str - 原字符串
 * @param {number} length - 最大长度
 * @param {string} suffix - 后缀
 */
export function truncate(str, length = 20, suffix = '...') {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * 首字母大写
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 驼峰转横线
 */
export function kebabCase(str) {
  if (!str) return ''
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 横线转驼峰
 */
export function camelCase(str) {
  if (!str) return ''
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

/**
 * 手机号脱敏
 */
export function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 邮箱脱敏
 */
export function maskEmail(email) {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const maskedName = name.length > 2 
    ? name.substring(0, 2) + '***' 
    : name[0] + '***'
  return `${maskedName}@${domain}`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

