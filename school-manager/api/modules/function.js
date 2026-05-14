// api/modules/function.js
export const functionApi = {
  // 功能列表
  getFunctionList: {
    url: '/api/function/list',
    method: 'GET',
    desc: '获取功能列表'
  },

  // 日历相关
  getCalendarEvents: {
    url: '/api/function/calendar/events',
    method: 'GET',
    desc: '获取日历事件'
  },

  createCalendarEvent: {
    url: '/api/function/calendar/event',
    method: 'POST',
    desc: '创建日历事件'
  },

  updateCalendarEvent: {
    url: '/api/function/calendar/event',
    method: 'PUT',
    desc: '更新日历事件'
  },

  deleteCalendarEvent: {
    url: '/api/function/calendar/event',
    method: 'DELETE',
    desc: '删除日历事件'
  },

  // 食堂相关
  getCanteenList: {
    url: '/api/function/canteen/list',
    method: 'GET',
    desc: '获取食堂列表'
  },

  getCanteenMenu: {
    url: '/api/function/canteen/menu',
    method: 'GET',
    desc: '获取食堂菜单'
  },

  getCanteenQueue: {
    url: '/api/function/canteen/queue',
    method: 'GET',
    desc: '获取排队信息'
  },

  // 图书馆相关
  getLibraryInfo: {
    url: '/api/function/library/info',
    method: 'GET',
    desc: '获取图书馆信息'
  },

  getBorrowingInfo: {
    url: '/api/function/library/borrowing',
    method: 'GET',
    desc: '获取借阅信息'
  },

  reserveSeat: {
    url: '/api/function/library/seat/reserve',
    method: 'POST',
    desc: '预约座位'
  },

  cancelSeatReservation: {
    url: '/api/function/library/seat/cancel',
    method: 'POST',
    desc: '取消座位预约'
  },

  searchBooks: {
    url: '/api/function/library/books/search',
    method: 'GET',
    desc: '搜索图书'
  },

  // 地图相关
  getBuildingList: {
    url: '/api/function/map/buildings',
    method: 'GET',
    desc: '获取建筑列表'
  },

  getBuildingDetail: {
    url: '/api/function/map/building',
    method: 'GET',
    desc: '获取建筑详情'
  },

  searchLocation: {
    url: '/api/function/map/search',
    method: 'GET',
    desc: '搜索地点'
  },

  getNavigation: {
    url: '/api/function/map/navigation',
    method: 'GET',
    desc: '获取导航路线'
  }
}

// 默认导出
export default functionApi
