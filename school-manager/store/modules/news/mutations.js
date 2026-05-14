// store/modules/news/mutations.js
export default {
  // 新闻列表相关
  SET_NEWS_LIST(state, list) {
    state.newsList = list
  },
  
  ADD_NEWS_LIST(state, list) {
    state.newsList = [...state.newsList, ...list]
  },
  
  SET_CURRENT_NEWS(state, news) {
    state.currentNews = news
  },
  
  UPDATE_NEWS_LIKE(state, { newsId, liked, likeCount }) {
    // 更新当前新闻
    if (state.currentNews && state.currentNews.id === newsId) {
      state.currentNews.liked = liked
      state.currentNews.likeCount = likeCount
    }
    // 更新列表中的新闻
    const newsInList = state.newsList.find(n => n.id === newsId)
    if (newsInList) {
      newsInList.liked = liked
      newsInList.likeCount = likeCount
    }
  },
  
  UPDATE_NEWS_FAVORITE(state, { newsId, favorited }) {
    // 更新当前新闻
    if (state.currentNews && state.currentNews.id === newsId) {
      state.currentNews.favorited = favorited
    }
    // 更新列表中的新闻
    const newsInList = state.newsList.find(n => n.id === newsId)
    if (newsInList) {
      newsInList.favorited = favorited
    }
  },
  
  UPDATE_NEWS_VIEW_COUNT(state, { newsId, viewCount }) {
    if (state.currentNews && state.currentNews.id === newsId) {
      state.currentNews.viewCount = viewCount
    }
    const newsInList = state.newsList.find(n => n.id === newsId)
    if (newsInList) {
      newsInList.viewCount = viewCount
    }
  },
  
  // 分类相关
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  
  SET_HOT_NEWS(state, news) {
    state.hotNews = news
  },
  
  SET_PINNED_NEWS(state, news) {
    state.pinnedNews = news
  },
  
  SET_TODAY_NEWS(state, news) {
    state.todayNews = news
  },
  
  // 评论相关
  SET_COMMENTS(state, comments) {
    state.comments = comments
  },
  
  ADD_COMMENTS(state, comments) {
    state.comments = [...state.comments, ...comments]
  },
  
  ADD_COMMENT(state, comment) {
    state.comments.unshift(comment)
    if (state.currentNews) {
      state.currentNews.commentCount = (state.currentNews.commentCount || 0) + 1
    }
  },
  
  REMOVE_COMMENT(state, commentId) {
    state.comments = state.comments.filter(c => c.id !== commentId)
    if (state.currentNews) {
      state.currentNews.commentCount = Math.max(0, (state.currentNews.commentCount || 0) - 1)
    }
  },
  
  UPDATE_COMMENT_LIKE(state, { commentId, liked, likeCount }) {
    const comment = state.comments.find(c => c.id === commentId)
    if (comment) {
      comment.liked = liked
      comment.likeCount = likeCount
    }
  },
  
  SET_COMMENT_STATS(state, stats) {
    state.commentStats = { ...state.commentStats, ...stats }
  },
  
  SET_COMMENT_PAGE(state, page) {
    state.currentCommentPage = page
  },
  
  SET_HAS_MORE_COMMENTS(state, hasMore) {
    state.hasMoreComments = hasMore
  },
  
  SET_LOADING_COMMENTS(state, loading) {
    state.loadingComments = loading
  },
  
  SET_COMMENT_SORT(state, sort) {
    state.commentSort = sort
    state.currentCommentPage = 1
    state.comments = []
  },
  
  // 相关新闻
  SET_RELATED_NEWS(state, news) {
    state.relatedNews = news
  },
  
  // 搜索相关
  SET_SEARCH_KEYWORD(state, keyword) {
    state.searchKeyword = keyword
  },
  
  SET_SEARCH_RESULTS(state, results) {
    state.searchResults = results
  },
  
  SET_SEARCH_HISTORY(state, history) {
    state.searchHistory = history
  },
  
  ADD_SEARCH_HISTORY(state, keyword) {
    if (!state.searchHistory.includes(keyword)) {
      state.searchHistory.unshift(keyword)
      // 最多保留10条
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10)
      }
    }
  },
  
  // 筛选相关
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  
  SET_CURRENT_SORT(state, sort) {
    state.currentSort = sort
  },
  
  // 分页相关
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page
  },
  
  SET_HAS_MORE(state, hasMore) {
    state.hasMore = hasMore
  },
  
  // 加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  // 重置状态
  RESET_COMMENTS(state) {
    state.comments = []
    state.currentCommentPage = 1
    state.hasMoreComments = true
    state.commentStats = {
      total: 0,
      hot: 0,
      new: 0,
      author: 0
    }
  }
}

