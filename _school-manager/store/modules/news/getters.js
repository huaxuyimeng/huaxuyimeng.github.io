// store/modules/news/getters.js
export default {
  // 基础数据
  newsList: state => state.newsList,
  currentNews: state => state.currentNews,
  categories: state => state.categories,
  loading: state => state.loading,
  
  // 分类新闻
  hotNews: state => state.hotNews,
  pinnedNews: state => state.pinnedNews,
  todayNews: state => state.todayNews,
  
  // 评论相关
  comments: state => state.comments,
  commentStats: state => state.commentStats,
  currentCommentPage: state => state.currentCommentPage,
  hasMoreComments: state => state.hasMoreComments,
  loadingComments: state => state.loadingComments,
  commentSort: state => state.commentSort,
  
  // 相关新闻
  relatedNews: state => state.relatedNews,
  
  // 搜索相关
  searchKeyword: state => state.searchKeyword,
  searchResults: state => state.searchResults,
  searchHistory: state => state.searchHistory,
  
  // 筛选相关
  filters: state => state.filters,
  currentSort: state => state.currentSort,
  
  // 分页相关
  currentPage: state => state.currentPage,
  hasMore: state => state.hasMore,
  
  // 根据ID获取新闻
  getNewsById: state => id => {
    return state.newsList.find(news => news.id === id) || state.currentNews
  },
  
  // 检查新闻是否已点赞
  isNewsLiked: state => id => {
    const news = state.newsList.find(n => n.id === id) || state.currentNews
    return news?.liked || false
  },
  
  // 检查新闻是否已收藏
  isNewsFavorited: state => id => {
    const news = state.newsList.find(n => n.id === id) || state.currentNews
    return news?.favorited || false
  },
  
  // 获取分页评论
  paginatedComments: state => {
    const pageSize = 10
    const start = (state.currentCommentPage - 1) * pageSize
    return state.comments.slice(0, start + pageSize)
  },
  
  // 获取热门评论
  hotComments: state => {
    return state.comments.filter(c => c.isHot).slice(0, 5)
  },
  
  // 获取作者评论
  authorComments: state => {
    return state.comments.filter(c => c.isAuthor)
  }
}

