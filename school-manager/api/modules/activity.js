// api/modules/activity.js
export const activityApi = {
  // 活动列表
  getActivityList: {
    url: '/api/activity/list',
    method: 'GET',
    desc: '获取活动列表'
  },

  getHotActivities: {
    url: '/api/activity/hot',
    method: 'GET',
    desc: '热门活动'
  },

  getRecommendedActivities: {
    url: '/api/activity/recommend',
    method: 'GET',
    desc: '推荐活动'
  },

  getNearbyActivities: {
    url: '/api/activity/nearby',
    method: 'GET',
    desc: '附近活动'
  },

  // 活动详情
  getActivityDetail: {
    url: '/api/activity/detail',
    method: 'GET',
    desc: '活动详情'
  },

  // 活动操作
  createActivity: {
    url: '/api/activity/create',
    method: 'POST',
    desc: '创建活动'
  },

  updateActivity: {
    url: '/api/activity/update',
    method: 'POST',
    desc: '更新活动'
  },

  deleteActivity: {
    url: '/api/activity/delete',
    method: 'POST',
    desc: '删除活动'
  },

  // 活动报名
  joinActivity: {
    url: '/api/activity/join',
    method: 'POST',
    desc: '报名活动'
  },

  cancelJoin: {
    url: '/api/activity/join/cancel',
    method: 'POST',
    desc: '取消报名'
  },

  getParticipants: {
    url: '/api/activity/participants',
    method: 'GET',
    desc: '活动参与者'
  },

  // 活动收藏
  favoriteActivity: {
    url: '/api/activity/favorite',
    method: 'POST',
    desc: '收藏活动'
  },

  unfavoriteActivity: {
    url: '/api/activity/unfavorite',
    method: 'POST',
    desc: '取消收藏'
  },

  getFavoriteActivities: {
    url: '/api/activity/favorites',
    method: 'GET',
    desc: '收藏的活动'
  },

  // 活动评论
  getComments: {
    url: '/api/activity/comments',
    method: 'GET',
    desc: '活动评论'
  },

  addComment: {
    url: '/api/activity/comment',
    method: 'POST',
    desc: '添加评论'
  },

  deleteComment: {
    url: '/api/activity/comment/delete',
    method: 'POST',
    desc: '删除评论'
  },

  // 活动分享
  shareActivity: {
    url: '/api/activity/share',
    method: 'POST',
    desc: '分享活动'
  },

  // 活动统计
  getActivityStats: {
    url: '/api/activity/stats',
    method: 'GET',
    desc: '活动统计'
  },

  // 我的活动
  getMyCreatedActivities: {
    url: '/api/activity/my/created',
    method: 'GET',
    desc: '我创建的活动'
  },

  getMyJoinedActivities: {
    url: '/api/activity/my/joined',
    method: 'GET',
    desc: '我参与的活动'
  },

  getMyFavoriteActivities: {
    url: '/api/activity/my/favorites',
    method: 'GET',
    desc: '我收藏的活动'
  },

  getMyActivityStats: {
    url: '/api/activity/my/stats',
    method: 'GET',
    desc: '我的活动统计'
  },

  // 浏览历史
  getViewHistory: {
    url: '/api/activity/history',
    method: 'GET',
    desc: '浏览历史'
  },

  addViewHistory: {
    url: '/api/activity/history/add',
    method: 'POST',
    desc: '添加浏览历史'
  },

  deleteViewHistory: {
    url: '/api/activity/history/delete',
    method: 'POST',
    desc: '删除浏览历史'
  },

  clearViewHistory: {
    url: '/api/activity/history/clear',
    method: 'POST',
    desc: '清空浏览历史'
  },

  // 报名状态检查
  checkJoinStatus: {
    url: '/api/activity/join/status',
    method: 'GET',
    desc: '检查报名状态'
  },

  // 收藏状态检查
  checkFavoriteStatus: {
    url: '/api/activity/favorite/status',
    method: 'GET',
    desc: '检查收藏状态'
  },

  // 取消活动
  cancelActivity: {
    url: '/api/activity/cancel',
    method: 'POST',
    desc: '取消活动'
  }
}

// 默认导出
export default activityApi
