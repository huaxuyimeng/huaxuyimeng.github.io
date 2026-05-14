import request from './request.js'
import activityApi from './modules/activity.js'
import userApi from './modules/user.js'
import newsApi from './modules/news.js'
import weatherApi from './modules/weather.js'
import functionApi from './modules/function.js'
import consultApi from './modules/consult.js'
import systemApi from './modules/system.js'
import commonApi from './modules/common.js'

// 活动相关API
export const activity = {
  // 获取活动列表
  getActivityList(params) {
    return request({
      url: activityApi.getActivityList.url,
      method: activityApi.getActivityList.method,
      params
    })
  },
  
  // 获取热门活动
  getHotActivities(params) {
    return request({
      url: activityApi.getHotActivities.url,
      method: activityApi.getHotActivities.method,
      params
    })
  },
  
  // 获取推荐活动
  getRecommendedActivities(params) {
    return request({
      url: activityApi.getRecommendedActivities.url,
      method: activityApi.getRecommendedActivities.method,
      params
    })
  },
  
  // 获取附近活动
  getNearbyActivities(params) {
    return request({
      url: activityApi.getNearbyActivities.url,
      method: activityApi.getNearbyActivities.method,
      params
    })
  },
  
  // 获取活动详情
  getActivityDetail(params) {
    return request({
      url: activityApi.getActivityDetail.url,
      method: activityApi.getActivityDetail.method,
      params
    })
  },
  
  // 创建活动
  createActivity(data) {
    return request({
      url: activityApi.createActivity.url,
      method: activityApi.createActivity.method,
      data
    })
  },
  
  // 更新活动
  updateActivity(data) {
    return request({
      url: activityApi.updateActivity.url,
      method: activityApi.updateActivity.method,
      data
    })
  },
  
  // 删除活动
  deleteActivity(data) {
    return request({
      url: activityApi.deleteActivity.url,
      method: activityApi.deleteActivity.method,
      data
    })
  },
  
  // 报名活动
  joinActivity(data) {
    return request({
      url: activityApi.joinActivity.url,
      method: activityApi.joinActivity.method,
      data
    })
  },
  
  // 取消报名
  cancelJoin(data) {
    return request({
      url: activityApi.cancelJoin.url,
      method: activityApi.cancelJoin.method,
      data
    })
  },
  
  // 获取参与者列表
  getParticipants(params) {
    return request({
      url: activityApi.getParticipants.url,
      method: activityApi.getParticipants.method,
      params
    })
  },
  
  // 收藏活动
  favoriteActivity(data) {
    return request({
      url: activityApi.favoriteActivity.url,
      method: activityApi.favoriteActivity.method,
      data
    })
  },
  
  // 取消收藏
  unfavoriteActivity(data) {
    return request({
      url: activityApi.unfavoriteActivity.url,
      method: activityApi.unfavoriteActivity.method,
      data
    })
  },
  
  // 获取收藏的活动
  getFavoriteActivities(params) {
    return request({
      url: activityApi.getFavoriteActivities.url,
      method: activityApi.getFavoriteActivities.method,
      params
    })
  },
  
  // 获取活动评论
  getComments(params) {
    return request({
      url: activityApi.getComments.url,
      method: activityApi.getComments.method,
      params
    })
  },
  
  // 添加评论
  addComment(data) {
    return request({
      url: activityApi.addComment.url,
      method: activityApi.addComment.method,
      data
    })
  },
  
  // 删除评论
  deleteComment(data) {
    return request({
      url: activityApi.deleteComment.url,
      method: activityApi.deleteComment.method,
      data
    })
  },
  
  // 分享活动
  shareActivity(data) {
    return request({
      url: activityApi.shareActivity.url,
      method: activityApi.shareActivity.method,
      data
    })
  },
  
  // 获取活动统计
  getActivityStats(params) {
    return request({
      url: activityApi.getActivityStats.url,
      method: activityApi.getActivityStats.method,
      params
    })
  },
  
  // 我的活动
  getMyCreatedActivities(params) {
    return request({
      url: activityApi.getMyCreatedActivities.url,
      method: activityApi.getMyCreatedActivities.method,
      params
    })
  },
  
  getMyJoinedActivities(params) {
    return request({
      url: activityApi.getMyJoinedActivities.url,
      method: activityApi.getMyJoinedActivities.method,
      params
    })
  },
  
  getMyFavoriteActivities(params) {
    return request({
      url: activityApi.getMyFavoriteActivities.url,
      method: activityApi.getMyFavoriteActivities.method,
      params
    })
  },
  
  getMyActivityStats(params) {
    return request({
      url: activityApi.getMyActivityStats.url,
      method: activityApi.getMyActivityStats.method,
      params
    })
  },
  
  // 浏览历史
  getViewHistory(params) {
    return request({
      url: activityApi.getViewHistory.url,
      method: activityApi.getViewHistory.method,
      params
    })
  },
  
  addViewHistory(data) {
    return request({
      url: activityApi.addViewHistory.url,
      method: activityApi.addViewHistory.method,
      data
    })
  },
  
  deleteViewHistory(data) {
    return request({
      url: activityApi.deleteViewHistory.url,
      method: activityApi.deleteViewHistory.method,
      data
    })
  },
  
  clearViewHistory() {
    return request({
      url: activityApi.clearViewHistory.url,
      method: activityApi.clearViewHistory.method
    })
  },
  
  // 状态检查
  checkJoinStatus(params) {
    return request({
      url: activityApi.checkJoinStatus.url,
      method: activityApi.checkJoinStatus.method,
      params
    })
  },
  
  checkFavoriteStatus(params) {
    return request({
      url: activityApi.checkFavoriteStatus.url,
      method: activityApi.checkFavoriteStatus.method,
      params
    })
  },
  
  // 取消活动
  cancelActivity(data) {
    return request({
      url: activityApi.cancelActivity.url,
      method: activityApi.cancelActivity.method,
      data
    })
  }
}

// 新闻相关API
export const news = {
  // 获取新闻列表
  getNewsList(params) {
    return request({
      url: newsApi.getNewsList.url,
      method: newsApi.getNewsList.method,
      params
    })
  },

  // 获取热门新闻
  getHotNews(params) {
    return request({
      url: newsApi.getHotNews.url,
      method: newsApi.getHotNews.method,
      params
    })
  },

  // 获取置顶新闻
  getPinnedNews(params) {
    return request({
      url: newsApi.getPinnedNews.url,
      method: newsApi.getPinnedNews.method,
      params
    })
  },

  // 获取新闻详情
  getNewsDetail(params) {
    return request({
      url: newsApi.getNewsDetail.url,
      method: newsApi.getNewsDetail.method,
      params
    })
  },

  // 搜索新闻
  searchNews(params) {
    return request({
      url: newsApi.searchNews.url,
      method: newsApi.searchNews.method,
      params
    })
  },

  // 点赞新闻
  likeNews(data) {
    return request({
      url: newsApi.likeNews.url,
      method: newsApi.likeNews.method,
      data
    })
  },

  // 取消点赞
  unlikeNews(data) {
    return request({
      url: newsApi.unlikeNews.url,
      method: newsApi.unlikeNews.method,
      data
    })
  },

  // 收藏新闻
  favoriteNews(data) {
    return request({
      url: newsApi.favoriteNews.url,
      method: newsApi.favoriteNews.method,
      data
    })
  },

  // 取消收藏
  unfavoriteNews(data) {
    return request({
      url: newsApi.unfavoriteNews.url,
      method: newsApi.unfavoriteNews.method,
      data
    })
  },

  // 获取评论
  getComments(params) {
    return request({
      url: newsApi.getComments.url,
      method: newsApi.getComments.method,
      params
    })
  },

  // 添加评论
  addComment(data) {
    return request({
      url: newsApi.addComment.url,
      method: newsApi.addComment.method,
      data
    })
  },

  // 删除评论
  deleteComment(data) {
    return request({
      url: newsApi.deleteComment.url,
      method: newsApi.deleteComment.method,
      data
    })
  },

  // 点赞评论
  likeComment(data) {
    return request({
      url: newsApi.likeComment.url,
      method: newsApi.likeComment.method,
      data
    })
  },

  // 取消点赞评论
  unlikeComment(data) {
    return request({
      url: newsApi.unlikeComment.url,
      method: newsApi.unlikeComment.method,
      data
    })
  },

  // 记录浏览
  addViewHistory(data) {
    return request({
      url: newsApi.addViewHistory.url,
      method: newsApi.addViewHistory.method,
      data
    })
  },

  // 获取浏览历史
  getViewHistory(params) {
    return request({
      url: newsApi.getViewHistory.url,
      method: newsApi.getViewHistory.method,
      params
    })
  },

  // 报名新闻活动
  joinNewsActivity(data) {
    return request({
      url: newsApi.joinNewsActivity.url,
      method: newsApi.joinNewsActivity.method,
      data
    })
  },

  // 取消报名
  cancelJoinNewsActivity(data) {
    return request({
      url: newsApi.cancelJoinNewsActivity.url,
      method: newsApi.cancelJoinNewsActivity.method,
      data
    })
  },

  // 获取报名状态
  getJoinStatus(params) {
    return request({
      url: newsApi.getJoinStatus.url,
      method: newsApi.getJoinStatus.method,
      params
    })
  },

  // 获取报名列表
  getJoinList(params) {
    return request({
      url: newsApi.getJoinList.url,
      method: newsApi.getJoinList.method,
      params
    })
  },
  
  // 按分类获取新闻
  getNewsByCategory(params) {
    return request({
      url: newsApi.getNewsByCategory.url,
      method: newsApi.getNewsByCategory.method,
      params
    })
  },
  
  // 获取新闻分类
  getNewsCategories(params) {
    return request({
      url: newsApi.getNewsCategories.url,
      method: newsApi.getNewsCategories.method,
      params
    })
  },
  
  // 分享新闻
  shareNews(data) {
    return request({
      url: newsApi.shareNews.url,
      method: newsApi.shareNews.method,
      data
    })
  },
  
  // 获取相关新闻
  getRelatedNews(params) {
    return request({
      url: newsApi.getRelatedNews.url,
      method: newsApi.getRelatedNews.method,
      params
    })
  }
}

// 导出其他API模块
export { userApi, newsApi, weatherApi, functionApi, consultApi, systemApi, commonApi }

