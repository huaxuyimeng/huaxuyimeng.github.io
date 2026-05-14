// types/api.d.ts
// API 相关类型定义

import { ApiResponse, PageResponse, PageParams, ListResponse, UploadResponse } from './global'

// 用户相关类型
export interface UserInfo {
  id: string | number
  username: string
  nickname: string
  avatar: string
  phone?: string
  email?: string
  gender?: number
  birthday?: string
  address?: string
  signature?: string
  [key: string]: any
}

export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
  expiresIn?: number
}

// 活动相关类型
export interface Activity {
  id: string | number
  title: string
  description: string
  cover: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  participants: number
  maxParticipants?: number
  status: number
  tags?: string[]
  [key: string]: any
}

export interface ActivityListParams extends PageParams {
  keyword?: string
  status?: number
  category?: string
  startTime?: string
  endTime?: string
}

// 新闻相关类型
export interface News {
  id: string | number
  title: string
  content: string
  cover: string
  author: string
  publishTime: string
  category: string
  views: number
  likes: number
  comments: number
  collects: number
  isLiked?: boolean
  isCollected?: boolean
  [key: string]: any
}

export interface NewsComment {
  id: string | number
  newsId: string | number
  userId: string | number
  username: string
  avatar: string
  content: string
  createTime: string
  replyTo?: string | number
  replies?: NewsComment[]
  [key: string]: any
}

export interface NewsListParams extends PageParams {
  keyword?: string
  category?: string
  author?: string
}

// 天气相关类型
export interface Weather {
  city: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  windDirection: string
  airQuality?: {
    aqi: number
    level: string
    pm25?: number
    pm10?: number
  }
  [key: string]: any
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  icon: string
  windSpeed: number
  windDirection: string
  [key: string]: any
}

// 咨询相关类型
export interface ConsultMessage {
  id: string | number
  type: 'user' | 'system'
  content: string
  timestamp: string
  status?: 'sending' | 'sent' | 'failed'
  [key: string]: any
}

export interface ConsultHistory {
  id: string | number
  title: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  [key: string]: any
}

// 系统相关类型
export interface SystemInfo {
  platform: string
  system: string
  version: string
  screenWidth: number
  screenHeight: number
  statusBarHeight: number
  safeArea?: {
    top: number
    bottom: number
    left: number
    right: number
    width: number
    height: number
  }
  [key: string]: any
}

export interface Statistics {
  totalUsers?: number
  totalActivities?: number
  totalNews?: number
  todayActiveUsers?: number
  [key: string]: any
}

// API 方法类型定义
export interface UserApi {
  login(params: LoginParams): Promise<ApiResponse<LoginResponse>>
  logout(): Promise<ApiResponse<void>>
  getProfile(): Promise<ApiResponse<UserInfo>>
  updateProfile(data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>>
  uploadAvatar(file: File | string): Promise<ApiResponse<UploadResponse>>
}

export interface ActivityApi {
  getList(params: ActivityListParams): Promise<ApiResponse<PageResponse<Activity>>>
  getDetail(id: string | number): Promise<ApiResponse<Activity>>
  create(data: Partial<Activity>): Promise<ApiResponse<Activity>>
  update(id: string | number, data: Partial<Activity>): Promise<ApiResponse<Activity>>
  delete(id: string | number): Promise<ApiResponse<void>>
  join(id: string | number): Promise<ApiResponse<void>>
  cancel(id: string | number): Promise<ApiResponse<void>>
}

export interface NewsApi {
  getList(params: NewsListParams): Promise<ApiResponse<PageResponse<News>>>
  getDetail(id: string | number): Promise<ApiResponse<News>>
  getCategories(): Promise<ApiResponse<string[]>>
  like(id: string | number): Promise<ApiResponse<void>>
  collect(id: string | number): Promise<ApiResponse<void>>
  comment(id: string | number, content: string): Promise<ApiResponse<NewsComment>>
  getComments(id: string | number, params: PageParams): Promise<ApiResponse<PageResponse<NewsComment>>>
}

export interface WeatherApi {
  getCurrent(city?: string): Promise<ApiResponse<Weather>>
  getForecast(city?: string, days?: number): Promise<ApiResponse<WeatherForecast[]>>
}

export interface ConsultApi {
  getHistory(params: PageParams): Promise<ApiResponse<PageResponse<ConsultHistory>>>
  getMessages(historyId: string | number): Promise<ApiResponse<ConsultMessage[]>>
  sendMessage(content: string, historyId?: string | number): Promise<ApiResponse<ConsultMessage>>
}

export interface SystemApi {
  getSystemInfo(): Promise<ApiResponse<SystemInfo>>
  getStatistics(): Promise<ApiResponse<Statistics>>
  getConfig(): Promise<ApiResponse<Record<string, any>>>
}

