<!--
 * 文件路径: pages/tabbar/function/subpages/weather/index.vue
 * 功能说明: 天气查询页面
 * 主要功能:
 *   1. 显示当前天气信息
 *   2. 显示未来天气预报
 *   3. 天气详情（温度、湿度、风速等）
 *   4. 天气趋势图表
 * 数据来源: 天气API接口
 * 相关页面: pages/tabbar/function/index.vue (功能中心)
 -->
<template>
  <view class="weather-page">
    <!-- 页面头部 -->
    <view class="weather-header">
      <view class="header-left">
        <view class="back-btn" @click="handleBack">
          <text class="iconfont">←</text>
        </view>
        <view class="header-title">校园天气</view>
      </view>
      <view class="header-right">
        <view class="header-icon" @click="handleRefresh">
          <text class="iconfont">🔄</text>
        </view>
        <view class="header-icon" @click="showSettings = true">
          <text class="iconfont">⚙️</text>
        </view>
        <view class="header-icon" @click="handleLocation">
          <text class="iconfont">📍</text>
        </view>
      </view>
    </view>

    <!-- 当前位置 -->
    <view class="location-info">
      <view class="location-header">
        <view class="current-location">
          <text class="iconfont">📍</text>
          <text>{{ currentLocation.name }}</text>
        </view>
        <view class="update-time">更新于{{ formatUpdateTime(weatherData.updateTime) }}</view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="weather-scroll" scroll-y>
      <!-- 实时天气 -->
      <view class="current-weather">
        <view class="weather-main">
          <view class="weather-icon">
            <text class="iconfont">{{ getWeatherIcon(weatherData.current.weather) }}</text>
          </view>
          <view class="weather-info">
            <view class="temperature">{{ weatherData.current.temp }}°</view>
            <view class="weather-text">{{ weatherData.current.weather }}</view>
            <view class="feels-like">体感温度 {{ weatherData.current.feelsLike }}°</view>
          </view>
        </view>
        
        <view class="weather-details">
          <view class="detail-item">
            <view class="detail-icon">
              <text class="iconfont">💨</text>
            </view>
            <view class="detail-info">
              <view class="detail-label">风力</view>
              <view class="detail-value">{{ weatherData.current.wind }}</view>
            </view>
          </view>
          <view class="detail-item">
            <view class="detail-icon">
              <text class="iconfont">💧</text>
            </view>
            <view class="detail-info">
              <view class="detail-label">湿度</view>
              <view class="detail-value">{{ weatherData.current.humidity }}%</view>
            </view>
          </view>
          <view class="detail-item">
            <view class="detail-icon">
              <text class="iconfont">👁️</text>
            </view>
            <view class="detail-info">
              <view class="detail-label">能见度</view>
              <view class="detail-value">{{ weatherData.current.visibility }}km</view>
            </view>
          </view>
          <view class="detail-item">
            <view class="detail-icon">
              <text class="iconfont">📊</text>
            </view>
            <view class="detail-info">
              <view class="detail-label">气压</view>
              <view class="detail-value">{{ weatherData.current.pressure }}hPa</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空气质量 -->
      <view v-if="weatherData.air" class="air-quality-section">
        <view class="section-header">
          <view class="section-title">空气质量</view>
          <view class="section-status" :style="{ color: getAirQualityColor(weatherData.air.aqi) }">
            {{ getAirQualityText(weatherData.air.aqi) }}
          </view>
        </view>
        
        <view class="air-quality">
          <view class="aqi-circle" :style="{ borderColor: getAirQualityColor(weatherData.air.aqi) }">
            <view class="aqi-value">{{ weatherData.air.aqi }}</view>
            <view class="aqi-label">AQI</view>
          </view>
          
          <view class="air-details">
            <view class="air-item">
              <view class="air-label">PM2.5</view>
              <view class="air-value">{{ weatherData.air.pm25 }}</view>
              <view class="air-unit">μg/m³</view>
            </view>
            <view class="air-item">
              <view class="air-label">PM10</view>
              <view class="air-value">{{ weatherData.air.pm10 }}</view>
              <view class="air-unit">μg/m³</view>
            </view>
            <view class="air-item">
              <view class="air-label">O₃</view>
              <view class="air-value">{{ weatherData.air.o3 }}</view>
              <view class="air-unit">μg/m³</view>
            </view>
            <view class="air-item">
              <view class="air-label">NO₂</view>
              <view class="air-value">{{ weatherData.air.no2 }}</view>
              <view class="air-unit">μg/m³</view>
            </view>
          </view>
        </view>
        
        <view class="air-advice">
          <view class="advice-icon">
            <text class="iconfont">💡</text>
          </view>
          <view class="advice-text">{{ getAirAdvice(weatherData.air.aqi) }}</view>
        </view>
      </view>

      <!-- 逐小时预报 -->
      <view v-if="weatherData.hourly.length > 0" class="hourly-section">
        <view class="section-header">
          <view class="section-title">24小时预报</view>
          <view class="section-more" @click="viewHourlyDetail">
            查看更多
          </view>
        </view>
        
        <scroll-view class="hourly-scroll" scroll-x>
          <view 
            v-for="hour in weatherData.hourly.slice(0, 12)" 
            :key="hour.time"
            class="hourly-item"
          >
            <view class="hourly-time">{{ formatHourTime(hour.time) }}</view>
            <view class="hourly-icon">
              <text class="iconfont">{{ getWeatherIcon(hour.weather) }}</text>
            </view>
            <view class="hourly-temp">{{ hour.temp }}°</view>
            <view class="hourly-precip">
              <text class="iconfont">💧</text>
              <text>{{ hour.precip }}%</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 未来7天预报 -->
      <view v-if="weatherData.daily.length > 0" class="daily-section">
        <view class="section-header">
          <view class="section-title">未来7天</view>
          <view class="section-more" @click="viewDailyDetail">
            查看详情
          </view>
        </view>
        
        <view class="daily-list">
          <view 
            v-for="day in weatherData.daily" 
            :key="day.date"
            class="daily-item"
            :class="{ today: day.isToday }"
          >
            <view class="day-info">
              <view class="day-name">{{ formatDayName(day.date) }}</view>
              <view class="day-date">{{ formatDayDate(day.date) }}</view>
            </view>
            <view class="day-weather">
              <view class="day-icon">
                <text class="iconfont">{{ getWeatherIcon(day.weather) }}</text>
              </view>
              <view class="day-text">{{ day.weather }}</view>
            </view>
            <view class="day-temp">
              <view class="temp-high">{{ day.tempMax }}°</view>
              <view class="temp-low">{{ day.tempMin }}°</view>
            </view>
            <view class="day-precip">
              <text class="precip-icon">💧</text>
              <text class="precip-value">{{ day.precip }}%</text>
            </view>
            <view class="day-wind">
              <text class="wind-icon">💨</text>
              <text class="wind-value">{{ day.wind }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 生活指数 -->
      <view v-if="weatherData.indices.length > 0" class="indices-section">
        <view class="section-header">
          <view class="section-title">生活指数</view>
        </view>
        
        <view class="indices-grid">
          <view 
            v-for="index in weatherData.indices" 
            :key="index.type"
            class="index-item"
            :style="{ background: getIndexColor(index.level) }"
            @click="showIndexDetail(index)"
          >
            <view class="index-icon">
              <text class="iconfont">{{ getIndexIcon(index.type) }}</text>
            </view>
            <view class="index-info">
              <view class="index-name">{{ index.name }}</view>
              <view class="index-level">{{ index.level }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 天气预警 -->
      <view v-if="weatherData.alerts.length > 0" class="alerts-section">
        <view class="section-header">
          <view class="section-title">天气预警</view>
          <view class="alert-count">{{ weatherData.alerts.length }}个</view>
        </view>
        
        <view class="alerts-list">
          <view 
            v-for="alert in weatherData.alerts" 
            :key="alert.id"
            class="alert-item"
            :style="{ borderColor: getAlertColor(alert.level) }"
            @click="showAlertDetail(alert)"
          >
            <view class="alert-header">
              <view class="alert-title">{{ alert.title }}</view>
              <view class="alert-level" :style="{ color: getAlertColor(alert.level) }">
                {{ getAlertLevelText(alert.level) }}
              </view>
            </view>
            <view class="alert-content">{{ alert.content }}</view>
            <view class="alert-time">发布：{{ formatAlertTime(alert.pubTime) }}</view>
          </view>
        </view>
      </view>

      <!-- 天气建议 -->
      <view class="advice-section">
        <view class="section-header">
          <view class="section-title">今日建议</view>
        </view>
        
        <view class="advice-content">
          <view class="advice-item">
            <view class="advice-icon">
              <text class="iconfont">👕</text>
            </view>
            <view class="advice-text">
              <view class="advice-title">穿衣建议</view>
              <view class="advice-desc">{{ getDressingAdvice(weatherData.current.temp) }}</view>
            </view>
          </view>
          <view class="advice-item">
            <view class="advice-icon">
              <text class="iconfont">☂️</text>
            </view>
            <view class="advice-text">
              <view class="advice-title">雨具建议</view>
              <view class="advice-desc">{{ getUmbrellaAdvice(weatherData.hourly) }}</view>
            </view>
          </view>
          <view class="advice-item">
            <view class="advice-icon">
              <text class="iconfont">🏃</text>
            </view>
            <view class="advice-text">
              <view class="advice-title">运动建议</view>
              <view class="advice-desc">{{ getExerciseAdvice(weatherData.air && weatherData.air.aqi) }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 天气小知识 -->
      <view class="knowledge-section">
        <view class="section-header">
          <view class="section-title">天气小知识</view>
          <view class="refresh-btn" @click="refreshKnowledge">
            <text class="iconfont">🔄</text>
          </view>
        </view>
        
        <view class="knowledge-content">
          {{ currentKnowledge.content }}
        </view>
        <view class="knowledge-source">{{ currentKnowledge.source }}</view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area"></view>
    </scroll-view>

    <!-- 天气设置 -->
    <view v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <view class="modal-content settings-modal" @click.stop>
        <view class="modal-header">
          <text>天气设置</text>
          <view class="modal-close" @click="showSettings = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <!-- 单位设置 -->
          <view class="settings-section">
            <view class="section-title">单位设置</view>
            <view class="setting-item">
              <view class="setting-label">温度单位</view>
              <view class="unit-options">
                <view 
                  class="unit-option"
                  :class="{ active: settings.tempUnit === 'c' }"
                  @click="settings.tempUnit = 'c'"
                >
                  摄氏度(°C)
                </view>
                <view 
                  class="unit-option"
                  :class="{ active: settings.tempUnit === 'f' }"
                  @click="settings.tempUnit = 'f'"
                >
                  华氏度(°F)
                </view>
              </view>
            </view>
            <view class="setting-item">
              <view class="setting-label">风速单位</view>
              <view class="unit-options">
                <view 
                  class="unit-option"
                  :class="{ active: settings.windUnit === 'kmh' }"
                  @click="settings.windUnit = 'kmh'"
                >
                  公里/小时
                </view>
                <view 
                  class="unit-option"
                  :class="{ active: settings.windUnit === 'ms' }"
                  @click="settings.windUnit = 'ms'"
                >
                  米/秒
                </view>
                <view 
                  class="unit-option"
                  :class="{ active: settings.windUnit === 'mph' }"
                  @click="settings.windUnit = 'mph'"
                >
                  英里/小时
                </view>
              </view>
            </view>
          </view>
          
          <!-- 通知设置 -->
          <view class="settings-section">
            <view class="section-title">通知设置</view>
            <view class="setting-item">
              <view class="setting-label">天气预警通知</view>
              <switch 
                :checked="settings.alertNotification" 
                @change="toggleAlertNotification"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">降雨提醒</view>
              <switch 
                :checked="settings.rainNotification" 
                @change="toggleRainNotification"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">空气质量提醒</view>
              <switch 
                :checked="settings.airNotification" 
                @change="toggleAirNotification"
                color="#007AFF"
              />
            </view>
          </view>
          
          <!-- 显示设置 -->
          <view class="settings-section">
            <view class="section-title">显示设置</view>
            <view class="setting-item">
              <view class="setting-label">显示空气质量</view>
              <switch 
                :checked="settings.showAirQuality" 
                @change="toggleShowAirQuality"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">显示生活指数</view>
              <switch 
                :checked="settings.showIndices" 
                @change="toggleShowIndices"
                color="#007AFF"
              />
            </view>
            <view class="setting-item">
              <view class="setting-label">显示天气知识</view>
              <switch 
                :checked="settings.showKnowledge" 
                @change="toggleShowKnowledge"
                color="#007AFF"
              />
            </view>
          </view>
          
          <!-- 数据设置 -->
          <view class="settings-section">
            <view class="section-title">数据设置</view>
            <view class="setting-item">
              <view class="setting-label">自动更新频率</view>
              <picker 
                class="setting-picker" 
                mode="selector" 
                :range="updateFrequencyOptions"
                :value="updateFrequencyIndex"
                @change="onUpdateFrequencyChange"
              >
                <view class="picker-value">
                  {{ updateFrequencyOptions[updateFrequencyIndex] }}
                </view>
              </picker>
            </view>
            <view class="setting-item">
              <view class="setting-label">数据源</view>
              <picker 
                class="setting-picker" 
                mode="selector" 
                :range="dataSourceOptions"
                :value="dataSourceIndex"
                @change="onDataSourceChange"
              >
                <view class="picker-value">
                  {{ dataSourceOptions[dataSourceIndex] }}
                </view>
              </picker>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="showSettings = false">取消</view>
          <view class="footer-btn primary" @click="saveSettings">保存设置</view>
        </view>
      </view>
    </view>

    <!-- 指数详情 -->
    <view v-if="showIndexDetailModal" class="modal-overlay" @click="showIndexDetailModal = false">
      <view class="modal-content index-detail" @click.stop>
        <view class="modal-header">
          <view class="index-header">
            <view class="index-icon" :style="{ background: getIndexColor(selectedIndex.level || '') }">
              <text class="iconfont">{{ getIndexIcon(selectedIndex.type || '') }}</text>
            </view>
            <view class="index-title">
              <view class="index-name">{{ selectedIndex.name || '' }}</view>
              <view class="index-level">{{ selectedIndex.level || '' }}</view>
            </view>
          </view>
          <view class="modal-close" @click="showIndexDetailModal = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="detail-content">
            <view class="detail-section">
              <view class="section-title">指数说明</view>
              <view class="section-content">{{ selectedIndex.description || '' }}</view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">建议措施</view>
              <view class="advice-list">
                <view 
                  v-for="advice in (selectedIndex.advice || [])" 
                  :key="advice"
                  class="advice-item"
                >
                  <text class="advice-icon">✓</text>
                  <text class="advice-text">{{ advice }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="showIndexDetailModal = false">关闭</view>
        </view>
      </view>
    </view>

    <!-- 预警详情 -->
    <view v-if="showAlertDetailModal" class="modal-overlay" @click="showAlertDetailModal = false">
      <view class="modal-content alert-detail" @click.stop>
        <view class="modal-header">
          <view class="alert-header">
            <view class="alert-level-icon" :style="{ background: getAlertColor(selectedAlert.level || '') }">
              {{ getAlertLevelText(selectedAlert.level || '') }}
            </view>
            <view class="alert-title">{{ selectedAlert.title || '' }}</view>
          </view>
          <view class="modal-close" @click="showAlertDetailModal = false">×</view>
        </view>
        
        <scroll-view class="modal-body" scroll-y>
          <view class="detail-content">
            <view class="detail-section">
              <view class="section-title">预警详情</view>
              <view class="section-content">{{ selectedAlert.content || '' }}</view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">发布信息</view>
              <view class="info-list">
                <view class="info-item">
                  <text class="label">发布单位：</text>
                  <text class="value">{{ selectedAlert.pubUnit || '' }}</text>
                </view>
                <view class="info-item">
                  <text class="label">发布时间：</text>
                  <text class="value">{{ selectedAlert.pubTime ? formatAlertTime(selectedAlert.pubTime) : '' }}</text>
                </view>
                <view class="info-item">
                  <text class="label">生效时间：</text>
                  <text class="value">{{ selectedAlert.effectiveTime ? formatAlertTime(selectedAlert.effectiveTime) : '' }}</text>
                </view>
                <view class="info-item">
                  <text class="label">解除时间：</text>
                  <text class="value">{{ selectedAlert.expireTime ? formatAlertTime(selectedAlert.expireTime) : '' }}</text>
                </view>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">防御指南</view>
              <view class="guide-list">
                <view 
                  v-for="guide in (selectedAlert.guide || [])" 
                  :key="guide"
                  class="guide-item"
                >
                  <text class="guide-icon">⚠️</text>
                  <text class="guide-text">{{ guide }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <view class="footer-btn" @click="showAlertDetailModal = false">关闭</view>
          <view class="footer-btn primary" @click="shareAlert">分享预警</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'

// 响应式数据
const showSettings = ref(false)
const showIndexDetailModal = ref(false)
const showAlertDetailModal = ref(false)
const refreshing = ref(false)
const loading = ref(false)

// 当前位置
const currentLocation = ref({
  name: '浙江大学',
  latitude: 30.263,
  longitude: 120.105
})

// 天气数据
const weatherData = ref({
  updateTime: '2024-12-20 14:30:00',
  current: {
    temp: 18,
    feelsLike: 19,
    weather: '晴',
    humidity: 65,
    wind: '东南风 2级',
    pressure: 1013,
    visibility: 10
  },
  air: {
    aqi: 45,
    pm25: 25,
    pm10: 40,
    o3: 60,
    no2: 20,
    so2: 5,
    co: 0.8
  },
  hourly: [
    { time: '14:00', temp: 18, weather: '晴', precip: 0 },
    { time: '15:00', temp: 19, weather: '晴', precip: 0 },
    { time: '16:00', temp: 20, weather: '晴', precip: 0 },
    { time: '17:00', temp: 19, weather: '晴', precip: 0 },
    { time: '18:00', temp: 18, weather: '晴', precip: 0 },
    { time: '19:00', temp: 17, weather: '多云', precip: 10 },
    { time: '20:00', temp: 16, weather: '多云', precip: 20 },
    { time: '21:00', temp: 15, weather: '阴', precip: 30 },
    { time: '22:00', temp: 14, weather: '阴', precip: 40 },
    { time: '23:00', temp: 13, weather: '小雨', precip: 60 },
    { time: '00:00', temp: 12, weather: '小雨', precip: 70 },
    { time: '01:00', temp: 12, weather: '小雨', precip: 80 }
  ],
  daily: [
    { date: '2024-12-20', isToday: true, weather: '晴转小雨', tempMax: 20, tempMin: 12, precip: 20, wind: '东南风2级' },
    { date: '2024-12-21', isToday: false, weather: '小雨', tempMax: 15, tempMin: 10, precip: 80, wind: '北风3级' },
    { date: '2024-12-22', isToday: false, weather: '阴', tempMax: 13, tempMin: 8, precip: 30, wind: '北风2级' },
    { date: '2024-12-23', isToday: false, weather: '多云', tempMax: 16, tempMin: 9, precip: 10, wind: '东风1级' },
    { date: '2024-12-24', isToday: false, weather: '晴', tempMax: 18, tempMin: 10, precip: 0, wind: '东南风2级' },
    { date: '2024-12-25', isToday: false, weather: '晴', tempMax: 20, tempMin: 12, precip: 0, wind: '南风2级' },
    { date: '2024-12-26', isToday: false, weather: '多云', tempMax: 19, tempMin: 11, precip: 20, wind: '东风2级' }
  ],
  indices: [
    { type: 'dressing', name: '穿衣指数', level: '舒适', description: '建议着薄外套、牛仔裤等服装', advice: ['白天温度适宜，但早晚会感觉偏凉', '建议携带一件薄外套备用'] },
    { type: 'car_wash', name: '洗车指数', level: '不宜', description: '未来24小时内有雨，不宜洗车', advice: ['雨水会使车上的污渍更难清洗', '建议等天气转晴后再洗车'] },
    { type: 'sport', name: '运动指数', level: '适宜', description: '天气较好，适宜户外运动', advice: ['建议进行散步、慢跑等轻度运动', '注意运动后及时保暖'] },
    { type: 'uv', name: '紫外线指数', level: '中等', description: '紫外线强度中等，需适当防护', advice: ['外出时可涂擦SPF15左右的防晒护肤品', '避免在10点至14点暴露于日光下'] },
    { type: 'allergy', name: '过敏指数', level: '较易发', description: '天气条件较易诱发过敏', advice: ['易感人群应减少外出', '外出需做好防护措施'] },
    { type: 'fishing', name: '钓鱼指数', level: '适宜', description: '适合进行垂钓活动', advice: ['气温适宜，有利于鱼类活动', '建议选择有水草的区域'] }
  ],
  alerts: [
    { 
      id: 1, 
      title: '大风蓝色预警', 
      level: 'blue',
      content: '预计未来24小时内将出现6级以上大风，请注意防范。',
      pubUnit: '杭州市气象台',
      pubTime: '2024-12-20 10:00:00',
      effectiveTime: '2024-12-20 10:00:00',
      expireTime: '2024-12-21 10:00:00',
      guide: [
        '政府及相关部门按照职责做好防大风工作',
        '关好门窗，加固围板、棚架、广告牌等易被风吹动的搭建物',
        '相关水域水上作业和过往船舶采取积极的应对措施',
        '行人注意尽量少骑自行车，刮风时不要在广告牌、临时搭建物等下面逗留'
      ]
    }
  ]
})

// 选中的指数和预警
const selectedIndex = ref({})
const selectedAlert = ref({})

// 天气知识
const currentKnowledge = ref({
  content: '紫外线最强的时间是上午10点到下午2点，这段时间尽量避免长时间在户外活动。',
  source: '气象知识小百科'
})

const knowledgeList = ref([
  { content: '气象学上将日最高气温达到或超过35℃定义为高温天气。', source: '气象知识小百科' },
  { content: '空气质量指数（AQI）是定量描述空气质量状况的指数，数值越大说明空气污染状况越严重。', source: '环保知识' },
  { content: '当相对湿度达到100%时，空气中的水汽就会凝结成小水滴，形成雾或云。', source: '气象知识小百科' }
])

// 设置
const settings = ref({
  tempUnit: 'c',
  windUnit: 'kmh',
  alertNotification: true,
  rainNotification: true,
  airNotification: true,
  showAirQuality: true,
  showIndices: true,
  showKnowledge: true,
  updateFrequency: 30,
  dataSource: 'qweather'
})

// 更新频率选项
const updateFrequencyOptions = ['15分钟', '30分钟', '1小时', '2小时', '4小时']

// 数据源选项
const dataSourceOptions = ['和风天气', 'OpenWeatherMap', 'AccuWeather']

// 计算属性
const updateFrequencyIndex = computed(() => {
  const frequencies = [15, 30, 60, 120, 240]
  return frequencies.indexOf(settings.value.updateFrequency)
})

const dataSourceIndex = computed(() => {
  const sources = ['qweather', 'openweathermap', 'accuweather']
  return sources.indexOf(settings.value.dataSource)
})

// 工具函数
const formatUpdateTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatHourTime = (timeStr) => {
  return timeStr.split(':')[0] + '时'
}

const formatDayName = (dateStr) => {
  const date = new Date(dateStr)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[date.getDay()]
}

const formatDayDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const formatAlertTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getWeatherIcon = (weather) => {
  const iconMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '🌧️',
    '暴雨': '⛈️',
    '雷阵雨': '⛈️',
    '雪': '❄️',
    '雾': '🌫️',
    '霾': '😷'
  }
  return iconMap[weather] || '🌤️'
}

const getAirQualityColor = (aqi) => {
  if (aqi <= 50) return '#00E400'
  if (aqi <= 100) return '#FFFF00'
  if (aqi <= 150) return '#FF7E00'
  if (aqi <= 200) return '#FF0000'
  if (aqi <= 300) return '#99004C'
  return '#7E0023'
}

const getAirQualityText = (aqi) => {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度污染'
  if (aqi <= 200) return '中度污染'
  if (aqi <= 300) return '重度污染'
  return '严重污染'
}

const getAirAdvice = (aqi) => {
  if (aqi <= 50) return '空气质量很好，适宜户外活动'
  if (aqi <= 100) return '空气质量良好，适宜户外活动'
  if (aqi <= 150) return '敏感人群应减少户外活动'
  if (aqi <= 200) return '建议减少户外活动，敏感人群避免外出'
  if (aqi <= 300) return '尽量避免户外活动，外出时佩戴口罩'
  return '避免户外活动，外出时必须佩戴口罩'
}

const getIndexIcon = (type) => {
  const iconMap = {
    'dressing': '👕',
    'car_wash': '🚗',
    'sport': '🏃',
    'uv': '☀️',
    'allergy': '🤧',
    'fishing': '🎣',
    'comfort': '😊',
    'flu': '🤒',
    'umbrella': '☂️',
    'travel': '✈️'
  }
  return iconMap[type] || '📊'
}

const getIndexColor = (level) => {
  const colorMap = {
    '舒适': '#4cd964',
    '适宜': '#4cd964',
    '中等': '#ff9500',
    '较易发': '#ff9500',
    '不宜': '#ff3b30',
    '很强': '#ff3b30',
    '极易发': '#ff3b30'
  }
  return colorMap[level] || '#007AFF'
}

const getAlertColor = (level) => {
  const colorMap = {
    'blue': '#007AFF',
    'yellow': '#ffcc00',
    'orange': '#ff9500',
    'red': '#ff3b30'
  }
  return colorMap[level] || '#666'
}

const getAlertLevelText = (level) => {
  const textMap = {
    'blue': '蓝色',
    'yellow': '黄色',
    'orange': '橙色',
    'red': '红色'
  }
  return textMap[level] || '一般'
}

const getDressingAdvice = (temp) => {
  if (temp >= 28) return '天气炎热，建议着短衫、短裙、短裤等夏季服装'
  if (temp >= 24) return '天气较热，建议着棉麻面料的衬衫、薄长裙等'
  if (temp >= 20) return '天气舒适，建议着薄外套、牛仔裤等服装'
  if (temp >= 15) return '天气较凉，建议着外套、风衣等服装'
  if (temp >= 10) return '天气凉，建议着厚外套、毛衣等服装'
  return '天气冷，建议着棉服、羽绒服等厚实保暖的服装'
}

const getUmbrellaAdvice = (hourly) => {
  if (!hourly || !Array.isArray(hourly)) return '暂无数据'
  const hasRain = hourly.some(hour => hour.precip > 50)
  if (hasRain) return '今天有雨，建议携带雨具'
  return '今天无雨，无需携带雨具'
}

const getExerciseAdvice = (aqi) => {
  if (aqi === undefined || aqi === null) return '暂无数据'
  if (aqi <= 50) return '空气质量很好，适宜户外运动'
  if (aqi <= 100) return '空气质量良好，可进行户外运动'
  if (aqi <= 150) return '空气质量一般，建议减少户外运动时间'
  return '空气质量较差，建议在室内进行运动'
}

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}

const handleRefresh = () => {
  refreshing.value = true
  loadWeatherData(true)
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

const handleLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      currentLocation.value = {
        name: '当前位置',
        latitude: res.latitude,
        longitude: res.longitude
      }
      loadWeatherData(true)
    },
    fail: (err) => {
      console.error('获取位置失败:', err)
      uni.showToast({ title: '获取位置失败', icon: 'none' })
    }
  })
}

const viewHourlyDetail = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/weather/hourly'
  })
}

const viewDailyDetail = () => {
  uni.navigateTo({
    url: '/pages/tabbar/function/subpages/weather/daily'
  })
}

const showIndexDetail = (index) => {
  selectedIndex.value = index
  showIndexDetailModal.value = true
}

const showAlertDetail = (alert) => {
  selectedAlert.value = alert
  showAlertDetailModal.value = true
}

const refreshKnowledge = () => {
  const randomIndex = Math.floor(Math.random() * knowledgeList.value.length)
  currentKnowledge.value = knowledgeList.value[randomIndex]
  uni.showToast({ title: '知识已更新', icon: 'success' })
}

// 设置处理
const toggleAlertNotification = (e) => {
  settings.value.alertNotification = e.detail.value
}

const toggleRainNotification = (e) => {
  settings.value.rainNotification = e.detail.value
}

const toggleAirNotification = (e) => {
  settings.value.airNotification = e.detail.value
}

const toggleShowAirQuality = (e) => {
  settings.value.showAirQuality = e.detail.value
}

const toggleShowIndices = (e) => {
  settings.value.showIndices = e.detail.value
}

const toggleShowKnowledge = (e) => {
  settings.value.showKnowledge = e.detail.value
}

const onUpdateFrequencyChange = (e) => {
  const frequencies = [15, 30, 60, 120, 240]
  settings.value.updateFrequency = frequencies[e.detail.value]
}

const onDataSourceChange = (e) => {
  const sources = ['qweather', 'openweathermap', 'accuweather']
  settings.value.dataSource = sources[e.detail.value]
}

const saveSettings = () => {
  uni.setStorageSync('weatherSettings', settings.value)
  showSettings.value = false
  uni.showToast({ title: '设置已保存', icon: 'success' })
}

const shareAlert = () => {
  const alert = selectedAlert.value
  if (!alert || !alert.title) {
    uni.showToast({ title: '预警信息错误', icon: 'none' })
    return
  }
  const shareInfo = `${alert.title}\n${alert.content || ''}\n发布时间：${formatAlertTime(alert.pubTime)}`
  // #ifdef MP-WEIXIN
  uni.shareAppMessage({
    title: '天气预警提醒',
    path: '/pages/tabbar/function/subpages/weather/index',
    imageUrl: ''
  })
  // #endif
  
  // #ifdef APP-PLUS || H5
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: '天气预警提醒',
    summary: shareInfo,
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '分享失败', icon: 'none' })
    }
  })
  // #endif
  showAlertDetailModal.value = false
}

// 数据加载
const loadWeatherData = (force = false) => {
  if (loading.value && !force) return
  
  loading.value = true
  uni.showLoading({ title: '获取天气中...' })
  
  // 模拟API请求
  setTimeout(() => {
    // 更新数据
    weatherData.value.updateTime = new Date().toISOString()
    
    uni.hideLoading()
    loading.value = false
    uni.showToast({ title: '天气数据已更新', icon: 'success' })
  }, 1500)
}

// 生命周期
onLoad(() => {
  // 加载设置
  const savedSettings = uni.getStorageSync('weatherSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...savedSettings }
  }
  
  // 初始化随机知识
  refreshKnowledge()
  
  // 加载天气数据
  loadWeatherData()
})

onShow(() => {
  // 刷新天气数据
  if (uni.getStorageSync('needRefreshWeather')) {
    uni.removeStorageSync('needRefreshWeather')
    loadWeatherData(true)
  }
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.weather-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.weather-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .back-btn {
      font-size: 40rpx;
      color: #333;
    }
    
    .header-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 30rpx;
    
    .header-icon {
      font-size: 36rpx;
      color: #666;
    }
  }
}

.location-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 30rpx 30rpx 20rpx;
  
  .location-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .current-location {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 28rpx;
    }
    
    .update-time {
      font-size: 20rpx;
      opacity: 0.9;
    }
  }
}

.weather-scroll {
  flex: 1;
  height: 0;
  padding: 20rpx 30rpx 120rpx;
}

.current-weather {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .weather-main {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .weather-icon {
      font-size: 100rpx;
      margin-right: 30rpx;
    }
    
    .weather-info {
      .temperature {
        font-size: 60rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .weather-text {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .feels-like {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
  
  .weather-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .detail-item {
      display: flex;
      align-items: center;
      
      .detail-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #666;
        margin-right: 20rpx;
      }
      
      .detail-info {
        .detail-label {
          font-size: 20rpx;
          color: #999;
          margin-bottom: 4rpx;
        }
        
        .detail-value {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }
}

.air-quality-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-status {
      font-size: 24rpx;
      font-weight: bold;
    }
  }
  
  .air-quality {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .aqi-circle {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 8rpx solid;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 30rpx;
      
      .aqi-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
      }
      
      .aqi-label {
        font-size: 20rpx;
        color: #666;
      }
    }
    
    .air-details {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      
      .air-item {
        .air-label {
          font-size: 20rpx;
          color: #999;
          margin-bottom: 4rpx;
        }
        
        .air-value {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
        
        .air-unit {
          font-size: 20rpx;
          color: #999;
          margin-left: 4rpx;
        }
      }
    }
  }
  
  .air-advice {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    
    .advice-icon {
      font-size: 32rpx;
      margin-right: 20rpx;
    }
    
    .advice-text {
      flex: 1;
      font-size: 24rpx;
      color: #666;
      line-height: 1.4;
    }
  }
}

.hourly-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .hourly-scroll {
    white-space: nowrap;
    
    .hourly-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20rpx;
      
      .hourly-time {
        font-size: 20rpx;
        color: #666;
        margin-bottom: 12rpx;
      }
      
      .hourly-icon {
        font-size: 40rpx;
        margin-bottom: 12rpx;
      }
      
      .hourly-temp {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 12rpx;
      }
      
      .hourly-precip {
        display: flex;
        align-items: center;
        gap: 4rpx;
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

.daily-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #007AFF;
    }
  }
  
  .daily-list {
    .daily-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &.today {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 12rpx;
        margin: 0 -20rpx;
        padding: 20rpx;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .day-info {
        width: 120rpx;
        
        .day-name {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 4rpx;
        }
        
        .day-date {
          font-size: 20rpx;
          color: #999;
        }
      }
      
      .day-weather {
        flex: 1;
        display: flex;
        align-items: center;
        
        .day-icon {
          font-size: 40rpx;
          margin-right: 20rpx;
        }
        
        .day-text {
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .day-temp {
        width: 120rpx;
        display: flex;
        justify-content: space-between;
        
        .temp-high {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
        
        .temp-low {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .day-precip,
      .day-wind {
        width: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4rpx;
        font-size: 20rpx;
        color: #666;
      }
    }
  }
}

.indices-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .indices-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    
    .index-item {
      padding: 20rpx;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .index-icon {
        font-size: 40rpx;
        margin-bottom: 12rpx;
      }
      
      .index-info {
        .index-name {
          font-size: 20rpx;
          color: #fff;
          opacity: 0.9;
          margin-bottom: 4rpx;
        }
        
        .index-level {
          font-size: 24rpx;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}

.alerts-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .alert-count {
      font-size: 24rpx;
      color: #ff3b30;
    }
  }
  
  .alerts-list {
    .alert-item {
      padding: 20rpx;
      border: 2rpx solid;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;
        
        .alert-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }
        
        .alert-level {
          font-size: 20rpx;
          font-weight: bold;
        }
      }
      
      .alert-content {
        font-size: 24rpx;
        color: #666;
        line-height: 1.4;
        margin-bottom: 12rpx;
      }
      
      .alert-time {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

.advice-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .advice-content {
    .advice-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .advice-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #666;
        margin-right: 20rpx;
      }
      
      .advice-text {
        flex: 1;
        
        .advice-title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }
        
        .advice-desc {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.knowledge-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .refresh-btn {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .knowledge-content {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }
  
  .knowledge-source {
    font-size: 20rpx;
    color: #999;
    text-align: right;
  }
}

.safe-area {
  height: 120rpx;
}

.modal-overlay {
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
}

.settings-modal {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .settings-section {
      margin-bottom: 40rpx;
      
      .section-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .setting-item {
        margin-bottom: 20rpx;
        
        .setting-label {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 20rpx;
        }
        
        .unit-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20rpx;
          
          .unit-option {
            padding: 12rpx 24rpx;
            background: #f5f5f5;
            border-radius: 20rpx;
            font-size: 24rpx;
            color: #666;
            
            &.active {
              background: #007AFF;
              color: #fff;
            }
          }
        }
        
        .setting-picker {
          .picker-value {
            padding: 20rpx;
            border: 1rpx solid #e5e5e5;
            border-radius: 8rpx;
            font-size: 28rpx;
            color: #333;
            background: #fafafa;
          }
        }
      }
    }
  }
  
  .modal-footer {
    display: flex;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    gap: 20rpx;
    
    .footer-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      background: #f5f5f5;
      color: #666;
      
      &.primary {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}

.index-detail {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .index-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .index-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #fff;
      }
      
      .index-title {
        .index-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 4rpx;
        }
        
        .index-level {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .detail-content {
      .detail-section {
        margin-bottom: 30rpx;
        
        .section-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
        }
        
        .section-content {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
        
        .advice-list {
          .advice-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12rpx;
            
            .advice-icon {
              color: #4cd964;
              margin-right: 12rpx;
              font-size: 24rpx;
            }
            
            .advice-text {
              flex: 1;
              font-size: 28rpx;
              color: #666;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }
  
  .modal-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .footer-btn {
      width: 100%;
      padding: 20rpx 0;
      text-align: center;
      background: #007AFF;
      color: #fff;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}

.alert-detail {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .alert-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .alert-level-icon {
        padding: 8rpx 16rpx;
        background: #007AFF;
        color: #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
        font-weight: bold;
      }
      
      .alert-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .modal-body {
    flex: 1;
    max-height: 60vh;
    padding: 20rpx 30rpx;
    
    .detail-content {
      .detail-section {
        margin-bottom: 30rpx;
        
        .section-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
        }
        
        .section-content {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
        
        .info-list {
          .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12rpx;
            
            .label {
              width: 120rpx;
              font-size: 24rpx;
              color: #666;
            }
            
            .value {
              flex: 1;
              font-size: 28rpx;
              color: #333;
            }
          }
        }
        
        .guide-list {
          .guide-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12rpx;
            
            .guide-icon {
              margin-right: 12rpx;
              font-size: 24rpx;
            }
            
            .guide-text {
              flex: 1;
              font-size: 28rpx;
              color: #666;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }
  
  .modal-footer {
    display: flex;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    gap: 20rpx;
    
    .footer-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      background: #f5f5f5;
      color: #666;
      
      &.primary {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}
</style>