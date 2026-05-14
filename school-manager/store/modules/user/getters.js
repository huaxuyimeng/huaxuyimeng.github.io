// store/modules/user/getters.js
export default {
  isLogin: state => !!state.token && state.isLogin,
  
  userInfo: state => state.userInfo,
  
  token: state => state.token,
  
  permissions: state => state.permissions,
  
  roles: state => state.roles,
  
  hasPermission: (state) => (permission) => {
    if (!permission) return false
    if (state.permissions.includes('*')) return true
    return state.permissions.includes(permission)
  },
  
  hasRole: (state) => (role) => {
    if (!role) return false
    return state.roles.includes(role)
  }
}

