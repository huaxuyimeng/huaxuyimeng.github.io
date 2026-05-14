// filters/date.js - 日期过滤器
import { formatDate, formatTime, formatDateTime, getRelativeTime } from '@/utils/date.js'

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式
 */
export function formatDateFilter(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  return formatDate(date, format)
}

/**
 * 格式化时间
 */
export function formatTimeFilter(time, format = 'HH:mm:ss') {
  if (!time) return ''
  return formatTime(time, format)
}

/**
 * 格式化日期时间
 */
export function formatDateTimeFilter(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!dateTime) return ''
  return formatDateTime(dateTime, format)
}

/**
 * 相对时间（刚刚、5分钟前等）
 */
export function relativeTime(date) {
  if (!date) return ''
  return getRelativeTime(date)
}

/**
 * 格式化月份
 */
export function formatMonth(date, format = 'YYYY年MM月') {
  if (!date) return ''
  return formatDate(date, format)
}

/**
 * 格式化星期
 */
export function formatWeekday(date) {
  if (!date) return ''
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const d = new Date(date)
  return weekdays[d.getDay()]
}

/**
 * 格式化时间段
 */
export function formatTimeRange(start, end, format = 'HH:mm') {
  if (!start || !end) return ''
  return `${formatTime(start, format)} - ${formatTime(end, format)}`
}

/**
 * 格式化日期范围
 */
export function formatDateRange(start, end) {
  if (!start || !end) return ''
  const startDate = formatDate(start, 'YYYY-MM-DD')
  const endDate = formatDate(end, 'YYYY-MM-DD')
  
  if (startDate === endDate) {
    return startDate
  }
  
  return `${startDate} 至 ${endDate}`
}

