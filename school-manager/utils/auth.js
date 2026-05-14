// utils/auth.js - 认证工具函数
import { getStorage, setStorage, removeStorage } from './storage.js'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'

/**
 * 获取token
 * @returns {string|null}
 */
export function getToken() {
  return getStorage(TOKEN_KEY, null, true)
}

/**
 * 设置token
 * @param {string} token - token
 */
export function setToken(token) {
  setStorage(TOKEN_KEY, token, true)
}

/**
 * 删除token
 */
export function removeToken() {
  removeStorage(TOKEN_KEY, true)
}

/**
 * 检查是否已登录
 * @returns {boolean}
 */
export function isLoggedIn() {
  const token = getToken()
  return !!token
}

/**
 * 获取用户信息
 * @returns {object|null}
 */
export function getUserInfo() {
  return getStorage(USER_INFO_KEY, null, true)
}

/**
 * 设置用户信息
 * @param {object} userInfo - 用户信息
 */
export function setUserInfo(userInfo) {
  setStorage(USER_INFO_KEY, userInfo, true)
}

/**
 * 删除用户信息
 */
export function removeUserInfo() {
  removeStorage(USER_INFO_KEY, true)
}

/**
 * 退出登录
 */
export function logout() {
  removeToken()
  removeUserInfo()
}

