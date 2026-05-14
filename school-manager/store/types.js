// store/types.js
// Vuex Action 和 Mutation 类型常量

// User 模块
export const USER_SET_TOKEN = 'user/SET_TOKEN'
export const USER_SET_USER_INFO = 'user/SET_USER_INFO'
export const USER_SET_PROFILE = 'user/SET_PROFILE'
export const USER_CLEAR = 'user/CLEAR'
export const USER_LOGIN = 'user/login'
export const USER_LOGOUT = 'user/logout'
export const USER_GET_PROFILE = 'user/getProfile'
export const USER_UPDATE_PROFILE = 'user/updateProfile'

// Activity 模块
export const ACTIVITY_SET_LIST = 'activity/SET_LIST'
export const ACTIVITY_SET_DETAIL = 'activity/SET_DETAIL'
export const ACTIVITY_SET_FILTER = 'activity/SET_FILTER'
export const ACTIVITY_SET_LOADING = 'activity/SET_LOADING'
export const ACTIVITY_GET_LIST = 'activity/getList'
export const ACTIVITY_GET_DETAIL = 'activity/getDetail'
export const ACTIVITY_CREATE = 'activity/create'
export const ACTIVITY_UPDATE = 'activity/update'
export const ACTIVITY_DELETE = 'activity/delete'
export const ACTIVITY_JOIN = 'activity/join'
export const ACTIVITY_CANCEL = 'activity/cancel'

// News 模块
export const NEWS_SET_LIST = 'news/SET_LIST'
export const NEWS_SET_DETAIL = 'news/SET_DETAIL'
export const NEWS_SET_CATEGORIES = 'news/SET_CATEGORIES'
export const NEWS_SET_LOADING = 'news/SET_LOADING'
export const NEWS_GET_LIST = 'news/getList'
export const NEWS_GET_DETAIL = 'news/getDetail'
export const NEWS_GET_CATEGORIES = 'news/getCategories'
export const NEWS_LIKE = 'news/like'
export const NEWS_COLLECT = 'news/collect'
export const NEWS_COMMENT = 'news/comment'

// Weather 模块
export const WEATHER_SET_CURRENT = 'weather/SET_CURRENT'
export const WEATHER_SET_FORECAST = 'weather/SET_FORECAST'
export const WEATHER_SET_CITY = 'weather/SET_CITY'
export const WEATHER_SET_LOADING = 'weather/SET_LOADING'
export const WEATHER_GET_CURRENT = 'weather/getCurrent'
export const WEATHER_GET_FORECAST = 'weather/getForecast'
export const WEATHER_SET_CITY = 'weather/setCity'

// Function 模块
export const FUNCTION_SET_MENU = 'function/SET_MENU'
export const FUNCTION_SET_LOADING = 'function/SET_LOADING'
export const FUNCTION_GET_MENU = 'function/getMenu'

// Consult 模块
export const CONSULT_SET_HISTORY = 'consult/SET_HISTORY'
export const CONSULT_SET_MESSAGES = 'consult/SET_MESSAGES'
export const CONSULT_SET_LOADING = 'consult/SET_LOADING'
export const CONSULT_GET_HISTORY = 'consult/getHistory'
export const CONSULT_SEND_MESSAGE = 'consult/sendMessage'
export const CONSULT_CLEAR_MESSAGES = 'consult/clearMessages'

// System 模块
export const SYSTEM_SET_SYSTEM_INFO = 'system/SET_SYSTEM_INFO'
export const SYSTEM_SET_CONFIG = 'system/SET_CONFIG'
export const SYSTEM_SET_STATISTICS = 'system/SET_STATISTICS'
export const SYSTEM_SET_LOADING = 'system/SET_LOADING'
export const SYSTEM_GET_SYSTEM_INFO = 'system/getSystemInfo'
export const SYSTEM_GET_STATISTICS = 'system/getStatistics'

