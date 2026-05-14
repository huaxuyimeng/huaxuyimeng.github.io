// store/modules/activity/getters.js
export default {
  activityList: state => state.activityList,
  
  currentActivity: state => state.currentActivity,
  
  myActivities: state => state.myActivities,
  
  stats: state => state.stats,
  
  loading: state => state.loading
}
