// store/modules/news/state.js
export default {
  // 新闻列表
  newsList: [],
  currentNews: null,
  categories: [],
  loading: false,
  
  // 分类新闻
  hotNews: [],
  pinnedNews: [],
  todayNews: [],
  
  // 评论相关
  comments: [],
  commentStats: {
    total: 0,
    hot: 0,
    new: 0,
    author: 0
  },
  currentCommentPage: 1,
  hasMoreComments: true,
  loadingComments: false,
  commentSort: 'hot', // 'hot' | 'time' | 'author'
  
  // 相关新闻
  relatedNews: [],
  
  // 搜索相关
  searchKeyword: '',
  searchResults: [],
  searchHistory: [],
  
  // 筛选相关
  filters: {
    time: 'all',
    type: 'all'
  },
  currentSort: 'time', // 'time' | 'hot' | 'like'
  
  // 分页相关
  currentPage: 1,
  pageSize: 10,
  hasMore: true
}

