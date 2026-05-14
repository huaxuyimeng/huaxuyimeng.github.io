// store/modules/activity/mutations.js
export default {
  SET_ACTIVITY_LIST(state, list) {
    state.activityList = list
  },
  
  SET_CURRENT_ACTIVITY(state, activity) {
    state.currentActivity = activity
  },
  
  SET_MY_ACTIVITIES(state, { type, activities }) {
    state.myActivities[type] = activities
  },
  
  SET_STATS(state, stats) {
    state.stats = stats
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  ADD_ACTIVITY(state, activity) {
    state.activityList.unshift(activity)
  },
  
  UPDATE_ACTIVITY(state, activity) {
    const index = state.activityList.findIndex(item => item.id === activity.id)
    if (index !== -1) {
      state.activityList.splice(index, 1, activity)
    }
  },
  
  DELETE_ACTIVITY(state, id) {
    state.activityList = state.activityList.filter(item => item.id !== id)
  }
}
