// mock/modules/user.js - 用户Mock数据
export function getUserInfo() {
  return {
    id: 1,
    name: '张三',
    nickname: '小明',
    avatar: '/static/avatars/user1.jpg',
    phone: '138****8888',
    email: 'zhangsan@example.com',
    gender: 'male',
    birthday: '2000-01-01',
    address: '北京市',
    roles: ['user'],
    permissions: ['activity:view', 'news:view']
  }
}

export function login() {
  return {
    token: 'mock_token_' + Date.now(),
    userInfo: getUserInfo(),
    expiresIn: 7200
  }
}

