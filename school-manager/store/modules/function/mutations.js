// store/modules/function/mutations.js
export default {
  SET_FUNCTION_LIST(state, list) {
    state.functionList = list
  },
  
  SET_CALENDAR_EVENTS(state, events) {
    state.calendarEvents = events
  },
  
  SET_CANTEEN_LIST(state, list) {
    state.canteenList = list
  },
  
  SET_LIBRARY_INFO(state, info) {
    state.libraryInfo = info
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

