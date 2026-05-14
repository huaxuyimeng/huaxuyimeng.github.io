// utils/file.js - 文件工具函数

/**
 * 获取文件大小（格式化）
 * @param {number} bytes - 字节数
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string}
 */
export function getFileExtension(filename) {
  if (!filename) return ''
  const lastDot = filename.lastIndexOf('.')
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : ''
}

/**
 * 判断是否为图片文件
 * @param {string} filename - 文件名
 * @returns {boolean}
 */
export function isImageFile(filename) {
  const ext = getFileExtension(filename)
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
  return imageExts.includes(ext)
}

/**
 * 判断是否为视频文件
 * @param {string} filename - 文件名
 * @returns {boolean}
 */
export function isVideoFile(filename) {
  const ext = getFileExtension(filename)
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
  return videoExts.includes(ext)
}

