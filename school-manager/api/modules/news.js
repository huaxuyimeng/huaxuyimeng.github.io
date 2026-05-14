// api/modules/news.js
export const newsApi = {
  // 新闻列表
  getNewsList: {
    url: '/api/news/list',
    method: 'GET',
    desc: '获取新闻列表'
  },

  // 热门新闻
  getHotNews: {
    url: '/api/news/hot',
    method: 'GET',
    desc: '热门新闻'
  },

  // 置顶新闻
  getPinnedNews: {
    url: '/api/news/pinned',
    method: 'GET',
    desc: '置顶新闻'
  },

  // 新闻详情
  getNewsDetail: {
    url: '/api/news/detail',
    method: 'GET',
    desc: '新闻详情'
  },

  // 新闻分类
  getNewsCategories: {
    url: '/api/news/categories',
    method: 'GET',
    desc: '新闻分类'
  },

  // 按分类获取
  getNewsByCategory: {
    url: '/api/news/category',
    method: 'GET',
    desc: '按分类获取新闻'
  },

  // 搜索新闻
  searchNews: {
    url: '/api/news/search',
    method: 'GET',
    desc: '搜索新闻'
  },

  // 点赞
  likeNews: {
    url: '/api/news/like',
    method: 'POST',
    desc: '点赞新闻'
  },

  // 取消点赞
  unlikeNews: {
    url: '/api/news/unlike',
    method: 'POST',
    desc: '取消点赞'
  },

  // 收藏
  favoriteNews: {
    url: '/api/news/favorite',
    method: 'POST',
    desc: '收藏新闻'
  },

  // 取消收藏
  unfavoriteNews: {
    url: '/api/news/unfavorite',
    method: 'POST',
    desc: '取消收藏'
  },

  // 获取评论
  getComments: {
    url: '/api/news/comments',
    method: 'GET',
    desc: '获取评论列表'
  },

  // 添加评论
  addComment: {
    url: '/api/news/comment',
    method: 'POST',
    desc: '添加评论'
  },

  // 删除评论
  deleteComment: {
    url: '/api/news/comment/delete',
    method: 'POST',
    desc: '删除评论'
  },

  // 点赞评论
  likeComment: {
    url: '/api/news/comment/like',
    method: 'POST',
    desc: '点赞评论'
  },

  // 取消点赞评论
  unlikeComment: {
    url: '/api/news/comment/unlike',
    method: 'POST',
    desc: '取消点赞评论'
  },

  // 分享
  shareNews: {
    url: '/api/news/share',
    method: 'POST',
    desc: '分享新闻'
  },

  // 浏览记录
  addViewHistory: {
    url: '/api/news/view',
    method: 'POST',
    desc: '记录浏览'
  },

  getViewHistory: {
    url: '/api/news/view/history',
    method: 'GET',
    desc: '浏览历史'
  },

  // 报名相关（适用于活动类新闻）
  joinNewsActivity: {
    url: '/api/news/join',
    method: 'POST',
    desc: '报名新闻活动'
  },

  // 取消报名
  cancelJoinNewsActivity: {
    url: '/api/news/cancel-join',
    method: 'POST',
    desc: '取消报名'
  },

  // 获取报名状态
  getJoinStatus: {
    url: '/api/news/join-status',
    method: 'GET',
    desc: '获取报名状态'
  },

  // 获取报名列表
  getJoinList: {
    url: '/api/news/join-list',
    method: 'GET',
    desc: '获取报名列表'
  },
  
  // 获取相关新闻
  getRelatedNews: {
    url: '/api/news/related',
    method: 'GET',
    desc: '获取相关新闻'
  }
}

// 默认导出
export default newsApi
