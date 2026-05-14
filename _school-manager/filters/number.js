// filters/number.js - 数字过滤器
import { formatNumber as formatNum } from '@/utils/number.js'

/**
 * 格式化数字（保留小数位）
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return formatNum(num, decimals)
}

/**
 * 格式化百分比
 */
export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '0%'
  return (num * 100).toFixed(decimals) + '%'
}

/**
 * 格式化金额
 */
export function formatCurrency(num, symbol = '¥', decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return symbol + '0.00'
  return symbol + formatNum(num, decimals)
}

/**
 * 格式化距离
 */
export function formatDistance(meters) {
  if (!meters || meters === 0) return '0m'
  if (meters < 1000) return Math.round(meters) + 'm'
  return (meters / 1000).toFixed(2) + 'km'
}

/**
 * 格式化时间间隔
 */
export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0秒'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  let result = ''
  if (hours > 0) result += hours + '小时'
  if (minutes > 0) result += minutes + '分钟'
  if (secs > 0 || !result) result += secs + '秒'
  
  return result
}

/**
 * 数字转中文
 */
export function numberToChinese(num) {
  if (!num || num === 0) return '零'
  
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chineseUnits = ['', '十', '百', '千', '万']
  
  if (num < 10) return chineseNums[num]
  if (num < 20) return num === 10 ? '十' : '十' + chineseNums[num % 10]
  if (num < 100) {
    const tens = Math.floor(num / 10)
    const ones = num % 10
    return chineseNums[tens] + '十' + (ones > 0 ? chineseNums[ones] : '')
  }
  
  // 简化处理，大于100的可以扩展
  return num.toString()
}

