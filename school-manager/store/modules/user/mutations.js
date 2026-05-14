// store/modules/user/mutations.js
export default {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    uni.setStorageSync('userInfo', userInfo)
  },
  
  SET_TOKEN(state, token) {
    state.token = token
    state.isLogin = !!token
    if (token) {
      uni.setStorageSync('token', token)
    } else {
      uni.removeStorageSync('token')
    }
  },
  
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },
  
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  
  CLEAR_USER(state) {
    state.userInfo = null
    state.token = ''
    state.isLogin = false
    state.permissions = []
    state.roles = []
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
  }
}

