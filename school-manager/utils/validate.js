// utils/validate.js - 验证工具函数

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean}
 */
export function validatePhone(phone) {
  if (!phone) return false
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone.trim())
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email) return false
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email.trim())
}

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean}
 */
export function validateIdCard(idCard) {
  if (!idCard) return false
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard.trim())
}

/**
 * 验证学号
 * @param {string} studentId - 学号
 * @returns {boolean}
 */
export function validateStudentId(studentId) {
  if (!studentId) return false
  // 学号通常是数字，长度在6-20位之间
  const reg = /^\d{6,20}$/
  return reg.test(studentId.trim())
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {object} { valid: boolean, strength: string, message: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, strength: 'weak', message: '密码不能为空' }
  }
  
  if (password.length < 6) {
    return { valid: false, strength: 'weak', message: '密码长度至少6位' }
  }
  
  if (password.length < 8) {
    return { valid: true, strength: 'weak', message: '密码强度：弱' }
  }
  
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  let strength = 'medium'
  let message = '密码强度：中'
  
  if (hasNumber && hasLetter && hasSpecial) {
    strength = 'strong'
    message = '密码强度：强'
  } else if (hasNumber && hasLetter) {
    strength = 'medium'
    message = '密码强度：中'
  } else {
    strength = 'weak'
    message = '密码强度：弱'
  }
  
  return { valid: true, strength, message }
}

/**
 * 验证URL
 * @param {string} url - URL
 * @returns {boolean}
 */
export function validateUrl(url) {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证是否为空
 * @param {any} value - 值
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

