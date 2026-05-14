<!--
 * 文件路径: pages/tabbar/function/subpages/calendar/index.vue
 * 功能说明: 课程表页面
 * 主要功能:
 *   1. 显示学生课程表
 *   2. 按周查看课程
 *   3. 课程详情（时间、地点、教师等）
 *   4. 添加、编辑、删除课程
 * 数据来源: 本地存储或API接口
 * 相关页面: pages/tabbar/function/index.vue (功能中心)
 -->
<template>
  <view class="timetable-page">
    <!-- 头部导航 -->
    <view class="timetable-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="back-icon">←</text>
        </view>
        <view class="header-title">课程表</view>
      </view>
      <view class="header-right">
        <view class="semester-badge" @click="showWeekPicker = true">
          <text class="semester-text">第{{ currentWeek }}周</text>
        </view>
      </view>
    </view>

    <!-- 学期信息卡片 -->
    <view class="semester-card">
      <view class="semester-info">
        <view class="semester-main">
          <text class="semester-name">{{ semesterInfo.name }}</text>
          <text class="semester-period">{{ semesterInfo.period }}</text>
        </view>
        <view class="semester-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: semesterProgress + '%' }"></view>
          </view>
          <text class="progress-text">学期进度 {{ semesterProgress }}%</text>
        </view>
      </view>
      <view class="quick-stats">
        <view class="stat-item">
          <text class="stat-value">{{ todayCourseCount }}</text>
          <text class="stat-label">今日课程</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ weekCourseCount }}</text>
          <text class="stat-label">本周课程</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ totalCredits }}</text>
          <text class="stat-label">总学分</text>
        </view>
      </view>
    </view>

    <!-- 周次导航 -->
    <view class="week-navigation">
      <view class="nav-btn" :class="{ disabled: currentWeek <= 1 }" @click="goToPreviousWeek">
        <text class="nav-icon">‹</text>
      </view>
      <view class="current-week" @click="showWeekPicker = true">
        <view class="week-header">
          <text class="week-label">第</text>
          <text class="week-text">{{ currentWeek }}</text>
          <text class="week-label">周</text>
        </view>
        <text class="week-date">{{ getWeekDateRange() }}</text>
      </view>
      <view class="nav-btn" :class="{ disabled: currentWeek >= 20 }" @click="goToNextWeek">
        <text class="nav-icon">›</text>
      </view>
    </view>

    <!-- 课程表内容 -->
    <scroll-view class="timetable-scroll" scroll-y>
      <!-- 星期标题 -->
      <view class="weekdays-header">
        <view class="time-column-header">
          <text class="time-label">时间</text>
        </view>
        <view 
          v-for="(day, index) in weekdays" 
          :key="index"
          class="weekday-item"
          :class="{ today: isToday(index) }"
        >
          <text class="weekday-name">{{ day.short }}</text>
          <text class="weekday-date">{{ getWeekdayDate(index) }}</text>
        </view>
      </view>

      <view class="timetable-grid">
        <!-- 时间段行 -->
        <view 
          v-for="(timeSlot, slotIndex) in timeSlots" 
          :key="slotIndex"
          class="time-row"
          :class="{ 'current-slot': isCurrentTimeSlot(slotIndex) }"
        >
          <!-- 时间列 -->
          <view class="time-cell">
            <text class="period-num">{{ slotIndex + 1 }}</text>
            <text class="time-start">{{ timeSlot.start }}</text>
            <text class="time-end">{{ timeSlot.end }}</text>
          </view>
          
          <!-- 每天的课程 -->
          <view 
            v-for="(day, dayIndex) in 7" 
            :key="dayIndex"
            class="course-cell"
            :class="{ 
              today: isToday(dayIndex), 
              'has-course': getCourse(slotIndex, dayIndex)
            }"
            @click="handleCourseClick(slotIndex, dayIndex)"
          >
            <view 
              v-if="getCourse(slotIndex, dayIndex)"
              class="course-card"
              :style="getCourseStyle(getCourse(slotIndex, dayIndex))"
            >
              <view class="course-header">
                <text class="course-name">{{ getCourse(slotIndex, dayIndex).name }}</text>
              </view>
              <view class="course-info">
                <view class="info-row">
                  <text class="info-text">{{ getCourse(slotIndex, dayIndex).location }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 本学期课程课时汇总 -->
      <view class="summary-section">
        <view class="section-header">
          <text class="section-title">📊 本学期课程统计</text>
        </view>
        
        <!-- 课程列表 -->
        <view class="course-summary-list">
          <view 
            v-for="(course, index) in courseSummary" 
            :key="index"
            class="course-summary-item"
            @click="showCourseInfo(course)"
          >
            <view class="course-color-bar" :style="{ background: course.color }"></view>
            <view class="course-summary-info">
              <view class="summary-row">
                <text class="summary-name">{{ course.name }}</text>
                <view class="summary-type" :class="course.type === '必修' ? 'required' : 'optional'">
                  {{ course.type }}
                </view>
              </view>
              <view class="summary-details">
                <text class="detail-item">👨‍🏫 {{ course.teacher }}</text>
                <text class="detail-item">📍 {{ course.location }}</text>
              </view>
            </view>
            <view class="course-summary-stats">
              <view class="stat-block">
                <text class="stat-num">{{ course.credit }}</text>
                <text class="stat-unit">学分</text>
              </view>
              <view class="stat-block">
                <text class="stat-num">{{ course.totalHours }}</text>
                <text class="stat-unit">课时</text>
              </view>
              <view class="stat-block">
                <text class="stat-num">{{ course.weekCount }}</text>
                <text class="stat-unit">周</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 总计统计 -->
        <view class="total-summary">
          <view class="total-header">
            <text class="total-title">学期总计</text>
          </view>
          <view class="total-grid">
            <view class="total-item">
              <view class="total-icon">📚</view>
              <view class="total-data">
                <text class="total-value">{{ totalCourses }}</text>
                <text class="total-label">门课程</text>
              </view>
            </view>
            <view class="total-item">
              <view class="total-icon">⭐</view>
              <view class="total-data">
                <text class="total-value">{{ totalCredits }}</text>
                <text class="total-label">总学分</text>
              </view>
            </view>
            <view class="total-item">
              <view class="total-icon">⏱️</view>
              <view class="total-data">
                <text class="total-value">{{ totalHours }}</text>
                <text class="total-label">总课时</text>
              </view>
            </view>
            <view class="total-item">
              <view class="total-icon">📖</view>
              <view class="total-data">
                <text class="total-value">{{ requiredCredits }}</text>
                <text class="total-label">必修学分</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 课程类型分布 -->
        <view class="type-distribution">
          <view class="distribution-header">
            <text class="distribution-title">课程类型分布</text>
          </view>
          <view class="distribution-bars">
            <view class="distribution-item">
              <view class="bar-label">必修课</view>
              <view class="bar-container">
                <view class="bar-fill required" :style="{ width: requiredPercent + '%' }"></view>
              </view>
              <view class="bar-value">{{ requiredCourses }}门</view>
            </view>
            <view class="distribution-item">
              <view class="bar-label">选修课</view>
              <view class="bar-container">
                <view class="bar-fill optional" :style="{ width: optionalPercent + '%' }"></view>
              </view>
              <view class="bar-value">{{ optionalCourses }}门</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 周次选择器 -->
    <view v-if="showWeekPicker" class="picker-overlay" @click="showWeekPicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择周次</text>
          <text class="picker-close" @click="showWeekPicker = false">×</text>
        </view>
        <scroll-view class="picker-scroll" scroll-y>
          <view class="week-grid">
            <view 
              v-for="week in 20" 
              :key="week"
              class="week-option"
              :class="{ active: currentWeek === week, current: week === actualCurrentWeek }"
              @click="selectWeek(week)"
            >
              <text class="week-num">{{ week }}</text>
              <text class="week-label">周</text>
              <view v-if="week === actualCurrentWeek" class="current-badge">本周</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 课程详情弹窗 -->
    <view v-if="showCourseDetail" class="detail-overlay" @click="showCourseDetail = false">
      <view class="detail-modal" @click.stop>
        <view class="detail-header" :style="{ background: selectedCourse?.color }">
          <view class="detail-title-section">
            <text class="detail-course-name">{{ selectedCourse?.name }}</text>
            <view class="detail-type" :class="selectedCourse?.type === '必修' ? 'required' : 'optional'">
              {{ selectedCourse?.type }}
            </view>
          </view>
          <view class="detail-close" @click="showCourseDetail = false">×</view>
        </view>
        
        <view class="detail-body">
          <view class="detail-section">
            <view class="detail-row">
              <view class="detail-icon">👨‍🏫</view>
              <view class="detail-content">
                <text class="detail-label">任课教师</text>
                <text class="detail-value">{{ selectedCourse?.teacher }}</text>
              </view>
            </view>
            <view class="detail-row">
              <view class="detail-icon">📍</view>
              <view class="detail-content">
                <text class="detail-label">上课地点</text>
                <text class="detail-value">{{ selectedCourse?.location }}</text>
              </view>
            </view>
            <view class="detail-row">
              <view class="detail-icon">🕐</view>
              <view class="detail-content">
                <text class="detail-label">上课时间</text>
                <text class="detail-value">{{ selectedCourse?.timeText }}</text>
              </view>
            </view>
            <view class="detail-row">
              <view class="detail-icon">📅</view>
              <view class="detail-content">
                <text class="detail-label">上课周次</text>
                <text class="detail-value">第{{ selectedCourse?.weeks?.join('、') }}周</text>
              </view>
            </view>
          </view>
          
          <view class="detail-stats">
            <view class="stat-card">
              <text class="stat-number">{{ selectedCourse?.credit }}</text>
              <text class="stat-text">学分</text>
            </view>
            <view class="stat-card">
              <text class="stat-number">{{ selectedCourse?.totalHours }}</text>
              <text class="stat-text">总课时</text>
            </view>
            <view class="stat-card">
              <text class="stat-number">{{ selectedCourse?.weekCount }}</text>
              <text class="stat-text">上课周数</text>
            </view>
          </view>
        </view>
        
        <view class="detail-footer">
          <view class="footer-btn secondary" @click="showCourseDetail = false">关闭</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 响应式数据
const currentWeek = ref(1)
const actualCurrentWeek = ref(1)
const showWeekPicker = ref(false)
const showCourseDetail = ref(false)
const selectedCourse = ref(null)

// 学期信息
const semesterInfo = ref({
  name: '2024-2025学年 第一学期',
  period: '2024.09.01 - 2025.01.15',
  totalWeeks: 20
})

// 星期配置
const weekdays = [
  { name: '星期一', short: '周一' },
  { name: '星期二', short: '周二' },
  { name: '星期三', short: '周三' },
  { name: '星期四', short: '周四' },
  { name: '星期五', short: '周五' },
  { name: '星期六', short: '周六' },
  { name: '星期日', short: '周日' }
]

// 时间段配置
const timeSlots = [
  { start: '08:00', end: '09:40', period: 1 },
  { start: '10:00', end: '11:40', period: 2 },
  { start: '14:00', end: '15:40', period: 3 },
  { start: '16:00', end: '17:40', period: 4 },
  { start: '19:00', end: '20:40', period: 5 }
]

// 课程颜色配置（渐变色系）
const courseColorSchemes = {
  '高等数学': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea' },
  '大学物理': { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f5576c' },
  '数据结构': { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe' },
  '计算机网络': { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#43e97b' },
  '操作系统': { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fa709a' },
  '人工智能': { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', color: '#a18cd1' },
  '数据库原理': { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#ff9a9e' },
  '软件工程': { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#fcb69f' },
  '机器学习': { bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', color: '#a1c4fd' },
  '编译原理': { bg: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', color: '#96e6a1' }
}

// 固定课程数据
const allCourses = ref([
  {
    id: 1,
    name: '高等数学',
    teacher: '张明教授',
    location: '教学楼A101',
    slotIndex: 0,
    dayIndex: 0,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    type: '必修',
    credit: 4,
    totalHours: 64,
    timeText: '周一 08:00-09:40'
  },
  {
    id: 2,
    name: '大学物理',
    teacher: '李华副教授',
    location: '理学楼B203',
    slotIndex: 1,
    dayIndex: 1,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    type: '必修',
    credit: 3,
    totalHours: 48,
    timeText: '周二 10:00-11:40'
  },
  {
    id: 3,
    name: '数据结构',
    teacher: '王强教授',
    location: '计科楼301',
    slotIndex: 2,
    dayIndex: 2,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    type: '必修',
    credit: 4,
    totalHours: 72,
    timeText: '周三 14:00-15:40'
  },
  {
    id: 4,
    name: '计算机网络',
    teacher: '刘洋教授',
    location: '实验楼401',
    slotIndex: 4,
    dayIndex: 3,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    type: '必修',
    credit: 3,
    totalHours: 56,
    timeText: '周四 19:00-20:40'
  },
  {
    id: 5,
    name: '操作系统',
    teacher: '赵伟教授',
    location: '计科楼201',
    slotIndex: 0,
    dayIndex: 2,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    type: '必修',
    credit: 3,
    totalHours: 48,
    timeText: '周三 08:00-09:40'
  },
  {
    id: 6,
    name: '人工智能',
    teacher: '吴芳教授',
    location: 'AI实验室',
    slotIndex: 1,
    dayIndex: 4,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: '选修',
    credit: 2,
    totalHours: 32,
    timeText: '周五 10:00-11:40'
  },
  {
    id: 7,
    name: '数据库原理',
    teacher: '陈静副教授',
    location: '教学楼C102',
    slotIndex: 3,
    dayIndex: 0,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    type: '必修',
    credit: 3,
    totalHours: 48,
    timeText: '周一 16:00-17:40'
  },
  {
    id: 8,
    name: '软件工程',
    teacher: '孙磊教授',
    location: '软件学院报告厅',
    slotIndex: 2,
    dayIndex: 4,
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    type: '必修',
    credit: 3,
    totalHours: 48,
    timeText: '周五 14:00-15:40'
  },
  {
    id: 9,
    name: '机器学习',
    teacher: '周明博士',
    location: 'AI实验室',
    slotIndex: 3,
    dayIndex: 3,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    type: '选修',
    credit: 2,
    totalHours: 32,
    timeText: '周四 16:00-17:40'
  },
  {
    id: 10,
    name: '编译原理',
    teacher: '郑浩教授',
    location: '计科楼401',
    slotIndex: 1,
    dayIndex: 0,
    weeks: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    type: '选修',
    credit: 2,
    totalHours: 28,
    timeText: '周一 10:00-11:40'
  }
])

// 计算属性
const semesterProgress = computed(() => {
  return Math.min(Math.round((currentWeek.value / 20) * 100), 100)
})

const currentWeekCourses = computed(() => {
  return allCourses.value.filter(course => 
    course.weeks.includes(currentWeek.value)
  )
})

const todayCourseCount = computed(() => {
  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1
  return currentWeekCourses.value.filter(c => c.dayIndex === dayIndex).length
})

const weekCourseCount = computed(() => {
  return currentWeekCourses.value.length
})

const totalCredits = computed(() => {
  return allCourses.value.reduce((sum, course) => sum + course.credit, 0)
})

const totalCourses = computed(() => {
  return allCourses.value.length
})

const totalHours = computed(() => {
  return allCourses.value.reduce((sum, course) => sum + course.totalHours, 0)
})

const requiredCourses = computed(() => {
  return allCourses.value.filter(c => c.type === '必修').length
})

const optionalCourses = computed(() => {
  return allCourses.value.filter(c => c.type === '选修').length
})

const requiredCredits = computed(() => {
  return allCourses.value.filter(c => c.type === '必修').reduce((sum, c) => sum + c.credit, 0)
})

const requiredPercent = computed(() => {
  return Math.round((requiredCourses.value / totalCourses.value) * 100)
})

const optionalPercent = computed(() => {
  return Math.round((optionalCourses.value / totalCourses.value) * 100)
})

const courseSummary = computed(() => {
  return allCourses.value.map(course => ({
    ...course,
    color: courseColorSchemes[course.name]?.color || '#667eea',
    weekCount: course.weeks.length
  }))
})

// 方法
const getCourse = (slotIndex, dayIndex) => {
  return currentWeekCourses.value.find(course => 
    course.slotIndex === slotIndex && course.dayIndex === dayIndex
  )
}

const getCourseStyle = (course) => {
  const scheme = courseColorSchemes[course.name] || { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  return { background: scheme.bg }
}

const getWeekDateRange = () => {
  const today = new Date()
  const year = today.getFullYear()
  const semesterStart = new Date(year, 8, 1)
  const weekStartDate = new Date(semesterStart)
  weekStartDate.setDate(semesterStart.getDate() + (currentWeek.value - 1) * 7)
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekStartDate.getDate() + 6)
  
  const formatDate = (date) => `${date.getMonth() + 1}.${date.getDate()}`
  return `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`
}

const getWeekdayDate = (dayIndex) => {
  const today = new Date()
  const year = today.getFullYear()
  const semesterStart = new Date(year, 8, 1)
  const weekStartDate = new Date(semesterStart)
  weekStartDate.setDate(semesterStart.getDate() + (currentWeek.value - 1) * 7)
  const targetDate = new Date(weekStartDate)
  targetDate.setDate(weekStartDate.getDate() + dayIndex)
  return `${targetDate.getMonth() + 1}/${targetDate.getDate()}`
}

const isToday = (dayIndex) => {
  const today = new Date()
  const year = today.getFullYear()
  const semesterStart = new Date(year, 8, 1)
  const weekStartDate = new Date(semesterStart)
  weekStartDate.setDate(semesterStart.getDate() + (currentWeek.value - 1) * 7)
  const targetDate = new Date(weekStartDate)
  targetDate.setDate(weekStartDate.getDate() + dayIndex)
  
  return targetDate.toDateString() === today.toDateString()
}

const isCurrentTimeSlot = (slotIndex) => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const slot = timeSlots[slotIndex]
  const [startH, startM] = slot.start.split(':').map(Number)
  const [endH, endM] = slot.end.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes
}

const handleBack = () => {
  // 获取页面栈
  const pages = getCurrentPages()
  if (pages.length > 1) {
    // 如果有上一页，则返回
    uni.navigateBack({
      delta: 1
    })
  } else {
    // 如果没有上一页，则跳转到功能页面
    uni.switchTab({
      url: '/pages/tabbar/function/index'
    })
  }
}

const goToPreviousWeek = () => {
  if (currentWeek.value > 1) currentWeek.value--
}

const goToNextWeek = () => {
  if (currentWeek.value < 20) currentWeek.value++
}

const selectWeek = (week) => {
  currentWeek.value = week
  showWeekPicker.value = false
}

const handleCourseClick = (slotIndex, dayIndex) => {
  const course = getCourse(slotIndex, dayIndex)
  if (course) {
    selectedCourse.value = {
      ...course,
      color: courseColorSchemes[course.name]?.bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      weekCount: course.weeks.length
    }
    showCourseDetail.value = true
  }
}

const showCourseInfo = (course) => {
  selectedCourse.value = {
    ...course,
    color: courseColorSchemes[course.name]?.bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    weekCount: course.weeks.length
  }
  showCourseDetail.value = true
}

// 生命周期
onLoad(() => {
  const today = new Date()
  const year = today.getFullYear()
  const semesterStart = new Date(year, 8, 1)
  const daysSinceStart = Math.floor((today - semesterStart) / (1000 * 60 * 60 * 24))
  const week = Math.floor(daysSinceStart / 7) + 1
  
  if (week >= 1 && week <= 20) {
    currentWeek.value = week
    actualCurrentWeek.value = week
  }
})
</script>

<style lang="scss" scoped>
.timetable-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8faff 0%, #f0f4ff 100%);
}

.timetable-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;
      
      &:active {
        background: #e8eaf0;
        transform: scale(0.95);
      }
      
      .back-icon {
        font-size: 32rpx;
        color: #333;
        pointer-events: none;
      }
    }
    
    .header-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #1a1a2e;
    }
  }
  
  .semester-badge {
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 30rpx;
    
    .semester-text {
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;
    }
  }
}

.semester-card {
  margin: 20rpx;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  box-shadow: 0 10rpx 40rpx rgba(102, 126, 234, 0.3);
  
  .semester-info {
    margin-bottom: 24rpx;
    
    .semester-main {
      margin-bottom: 16rpx;
      
      .semester-name {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8rpx;
      }
      
      .semester-period {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .semester-progress {
      .progress-bar {
        height: 8rpx;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4rpx;
        overflow: hidden;
        margin-bottom: 8rpx;
        
        .progress-fill {
          height: 100%;
          background: #fff;
          border-radius: 4rpx;
          transition: width 0.3s ease;
        }
      }
      
      .progress-text {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
  
  .quick-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: 44rpx;
        font-weight: 700;
        color: #fff;
      }
      
      .stat-label {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.week-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 20rpx 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 24rpx rgba(102, 126, 234, 0.25);
  
  .nav-btn {
    width: 70rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    font-size: 40rpx;
    color: #fff;
    font-weight: bold;
    transition: all 0.3s;
    backdrop-filter: blur(10rpx);
    
    .nav-icon {
      line-height: 1;
    }
    
    &:active:not(.disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0.95);
    }
    
    &.disabled {
      color: rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  .current-week {
    flex: 1;
    text-align: center;
    padding: 0 20rpx;
    
    .week-header {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4rpx;
      margin-bottom: 8rpx;
      
      .week-label {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }
      
      .week-text {
        font-size: 48rpx;
        font-weight: 700;
        color: #fff;
        line-height: 1;
      }
    }
    
    .week-date {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.weekdays-header {
  display: flex;
  margin: 0 12rpx;
  background: #fff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .time-column-header {
    width: 70rpx;
    min-width: 70rpx;
    max-width: 70rpx;
    padding: 16rpx 4rpx;
    text-align: center;
    background: #f8faff;
    border-right: 1rpx solid #eef2ff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .time-label {
      font-size: 20rpx;
      color: #888;
    }
  }
  
  .weekday-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12rpx 2rpx;
    border-right: 1rpx solid #eef2ff;
    box-sizing: border-box;
    background: #fff;
    min-width: 0;
    
    &:last-child {
      border-right: none;
    }
    
    &.today {
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      
      .weekday-name, .weekday-date {
        color: #fff;
      }
    }
    
    .weekday-name {
      font-size: 22rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 2rpx;
    }
    
    .weekday-date {
      font-size: 16rpx;
      color: #888;
    }
  }
}

.timetable-scroll {
  flex: 1;
  height: 0;
}

.timetable-grid {
  margin: 0 12rpx;
  background: #fff;
  border-radius: 0 0 16rpx 16rpx;
  overflow: hidden;
  
  .time-row {
    display: flex;
    height: 140rpx;
    border-bottom: 1rpx solid #eef2ff;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.current-slot {
      background: rgba(102, 126, 234, 0.03);
    }
    
    .time-cell {
      width: 70rpx;
      min-width: 70rpx;
      max-width: 70rpx;
      height: 140rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rpx 4rpx;
      background: #f8faff;
      border-right: 1rpx solid #eef2ff;
      box-sizing: border-box;
      
      .period-num {
        width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
        text-align: center;
        background: #667eea;
        color: #fff;
        border-radius: 50%;
        font-size: 20rpx;
        font-weight: 600;
        margin-bottom: 4rpx;
      }
      
      .time-start, .time-end {
        font-size: 16rpx;
        color: #666;
        line-height: 1.1;
      }
    }
    
    .course-cell {
      flex: 1;
      height: 140rpx;
      min-height: 140rpx;
      max-height: 140rpx;
      padding: 4rpx;
      border-right: 1rpx solid #eef2ff;
      box-sizing: border-box;
      overflow: hidden;
      background: #fff;
      min-width: 0;
      
      &:last-child {
        border-right: none;
      }
      
      &.today {
        background: rgba(102, 126, 234, 0.05);
      }
      
      .course-card {
        width: 100%;
        height: 132rpx;
        padding: 8rpx 6rpx;
        border-radius: 8rpx;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        overflow: hidden;
        box-sizing: border-box;
        
        .course-header {
          margin-bottom: 6rpx;
          
          .course-name {
            font-size: 20rpx;
            font-weight: 600;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        
        .course-info {
          .info-row {
            .info-text {
              font-size: 16rpx;
              opacity: 0.9;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.summary-section {
  margin: 30rpx 20rpx;
  
  .section-header {
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a2e;
    }
  }
}

.course-summary-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .course-summary-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #f0f4ff;
    
    &:last-child {
      border-bottom: none;
    }
    
    .course-color-bar {
      width: 8rpx;
      height: 80rpx;
      border-radius: 4rpx;
      margin-right: 20rpx;
    }
    
    .course-summary-info {
      flex: 1;
      
      .summary-row {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 8rpx;
        
        .summary-name {
          font-size: 30rpx;
          font-weight: 600;
          color: #1a1a2e;
        }
        
        .summary-type {
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          font-size: 20rpx;
          
          &.required {
            background: #e8f5e9;
            color: #2e7d32;
          }
          
          &.optional {
            background: #fff3e0;
            color: #ef6c00;
          }
        }
      }
      
      .summary-details {
        display: flex;
        gap: 20rpx;
        
        .detail-item {
          font-size: 24rpx;
          color: #888;
        }
      }
    }
    
    .course-summary-stats {
      display: flex;
      gap: 20rpx;
      
      .stat-block {
        text-align: center;
        padding: 8rpx 16rpx;
        background: #f8faff;
        border-radius: 12rpx;
        
        .stat-num {
          display: block;
          font-size: 32rpx;
          font-weight: 700;
          color: #667eea;
        }
        
        .stat-unit {
          font-size: 20rpx;
          color: #888;
        }
      }
    }
  }
}

.total-summary {
  margin-top: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .total-header {
    margin-bottom: 20rpx;
    
    .total-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1a1a2e;
    }
  }
  
  .total-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
    
    .total-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
      border-radius: 16rpx;
      
      .total-icon {
        font-size: 40rpx;
        margin-bottom: 8rpx;
      }
      
      .total-data {
        text-align: center;
        
        .total-value {
          display: block;
          font-size: 36rpx;
          font-weight: 700;
          color: #667eea;
        }
        
        .total-label {
          font-size: 22rpx;
          color: #888;
        }
      }
    }
  }
}

.type-distribution {
  margin-top: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .distribution-header {
    margin-bottom: 20rpx;
    
    .distribution-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1a1a2e;
    }
  }
  
  .distribution-bars {
    .distribution-item {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .bar-label {
        width: 120rpx;
        font-size: 26rpx;
        color: #666;
      }
      
      .bar-container {
        flex: 1;
        height: 24rpx;
        background: #f0f4ff;
        border-radius: 12rpx;
        overflow: hidden;
        margin: 0 16rpx;
        
        .bar-fill {
          height: 100%;
          border-radius: 12rpx;
          transition: width 0.3s ease;
          
          &.required {
            background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          }
          
          &.optional {
            background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
          }
        }
      }
      
      .bar-value {
        width: 80rpx;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        text-align: right;
      }
    }
  }
}

.safe-area {
  height: 120rpx;
}

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  
  .picker-content {
    background: #fff;
    border-radius: 24rpx;
    width: 600rpx;
    max-height: 70vh;
    overflow: hidden;
    
    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f4ff;
      
      .picker-title {
        font-size: 34rpx;
        font-weight: 600;
        color: #1a1a2e;
      }
      
      .picker-close {
        font-size: 48rpx;
        color: #999;
      }
    }
    
    .picker-scroll {
      max-height: 500rpx;
      padding: 20rpx;
      
      .week-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16rpx;
        
        .week-option {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20rpx 12rpx;
          background: #f8faff;
          border-radius: 16rpx;
          border: 2rpx solid transparent;
          
          &.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            
            .week-num, .week-label {
              color: #fff;
            }
          }
          
          &.current:not(.active) {
            border-color: #667eea;
          }
          
          .week-num {
            font-size: 32rpx;
            font-weight: 700;
            color: #333;
          }
          
          .week-label {
            font-size: 22rpx;
            color: #888;
          }
          
          .current-badge {
            position: absolute;
            top: -8rpx;
            right: -8rpx;
            padding: 4rpx 10rpx;
            background: #ff6b6b;
            color: #fff;
            font-size: 18rpx;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  
  .detail-modal {
    background: #fff;
    border-radius: 24rpx;
    width: 640rpx;
    overflow: hidden;
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 30rpx;
      color: #fff;
      
      .detail-title-section {
        flex: 1;
        
        .detail-course-name {
          display: block;
          font-size: 36rpx;
          font-weight: 600;
          margin-bottom: 12rpx;
        }
        
        .detail-type {
          display: inline-block;
          padding: 6rpx 16rpx;
          border-radius: 10rpx;
          font-size: 22rpx;
          
          &.required {
            background: rgba(255, 255, 255, 0.3);
          }
          
          &.optional {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }
      
      .detail-close {
        font-size: 48rpx;
        opacity: 0.8;
      }
    }
    
    .detail-body {
      padding: 30rpx;
      
      .detail-section {
        margin-bottom: 24rpx;
        
        .detail-row {
          display: flex;
          align-items: flex-start;
          padding: 16rpx 0;
          border-bottom: 1rpx solid #f0f4ff;
          
          &:last-child {
            border-bottom: none;
          }
          
          .detail-icon {
            width: 48rpx;
            font-size: 28rpx;
          }
          
          .detail-content {
            flex: 1;
            
            .detail-label {
              display: block;
              font-size: 24rpx;
              color: #888;
              margin-bottom: 4rpx;
            }
            
            .detail-value {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
            }
          }
        }
      }
      
      .detail-stats {
        display: flex;
        gap: 16rpx;
        
        .stat-card {
          flex: 1;
          text-align: center;
          padding: 20rpx;
          background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
          border-radius: 16rpx;
          
          .stat-number {
            display: block;
            font-size: 40rpx;
            font-weight: 700;
            color: #667eea;
          }
          
          .stat-text {
            font-size: 24rpx;
            color: #888;
          }
        }
      }
    }
    
    .detail-footer {
      padding: 20rpx 30rpx 30rpx;
      
      .footer-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 44rpx;
        font-size: 30rpx;
        font-weight: 500;
        
        &.secondary {
          background: #f0f4ff;
          color: #667eea;
        }
      }
    }
  }
}
</style>
