// types/component.d.ts
// 组件相关类型定义

import { UserInfo, Activity, News, Weather, WeatherForecast, ConsultMessage, NewsComment } from './api'
import { ImageInfo, VideoInfo, Location, OptionItem } from './global'

// 按钮组件 Props
export interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
}

// 输入框组件 Props
export interface InputProps {
  type?: 'text' | 'number' | 'password' | 'textarea'
  value?: string | number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  clearable?: boolean
  showPassword?: boolean
  prefixIcon?: string
  suffixIcon?: string
  error?: boolean
  errorMessage?: string
}

// 卡片组件 Props
export interface CardProps {
  title?: string
  subtitle?: string
  cover?: string
  shadow?: boolean
  border?: boolean
  padding?: boolean
}

// 列表组件 Props
export interface ListProps {
  data: any[]
  loading?: boolean
  finished?: boolean
  error?: boolean
  emptyText?: string
  loadMore?: () => void
  refresh?: () => void
}

// 模态框组件 Props
export interface ModalProps {
  visible: boolean
  title?: string
  width?: string | number
  showClose?: boolean
  closeOnClickOverlay?: boolean
  closeOnPressEscape?: boolean
}

// 弹出层组件 Props
export interface PopupProps {
  visible: boolean
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  closeOnClickOverlay?: boolean
  safeArea?: boolean
  round?: boolean
}

// Toast 组件 Props
export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top' | 'center' | 'bottom'
  icon?: string
}

// 加载组件 Props
export interface LoadingProps {
  type?: 'spinner' | 'circular'
  size?: string | number
  color?: string
  text?: string
  textSize?: string | number
}

// 空状态组件 Props
export interface EmptyStateProps {
  image?: string
  description?: string
  buttonText?: string
  showButton?: boolean
}

// 图片查看器组件 Props
export interface ImageViewerProps {
  images: string[] | ImageInfo[]
  current?: number
  show?: boolean
  closeable?: boolean
}

// 日期选择器组件 Props
export interface DatePickerProps {
  value?: string | Date
  minDate?: string | Date
  maxDate?: string | Date
  type?: 'date' | 'datetime' | 'time' | 'year-month'
  placeholder?: string
  disabled?: boolean
}

// 选择器组件 Props
export interface SelectProps {
  value?: string | number | (string | number)[]
  options: OptionItem[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  clearable?: boolean
}

// 上传组件 Props
export interface UploadProps {
  value?: string | string[]
  maxCount?: number
  maxSize?: number
  accept?: string
  disabled?: boolean
  preview?: boolean
  multiple?: boolean
}

// 活动卡片组件 Props
export interface ActivityCardProps {
  activity: Activity
  showActions?: boolean
  showStatus?: boolean
}

// 新闻卡片组件 Props
export interface NewsCardProps {
  news: News
  showActions?: boolean
  layout?: 'horizontal' | 'vertical'
}

// 天气卡片组件 Props
export interface WeatherCardProps {
  weather: Weather
  showDetails?: boolean
}

// 聊天气泡组件 Props
export interface ChatBubbleProps {
  message: ConsultMessage
  showAvatar?: boolean
  showTime?: boolean
}

// 用户卡片组件 Props
export interface UserCardProps {
  user: UserInfo
  showActions?: boolean
  showStats?: boolean
}

// 组件事件类型
export interface ComponentEvents {
  click?: (event: Event) => void
  change?: (value: any) => void
  input?: (value: any) => void
  submit?: (data: any) => void
  close?: () => void
  confirm?: (data: any) => void
  cancel?: () => void
  load?: () => void
  refresh?: () => void
  [key: string]: ((...args: any[]) => void) | undefined
}

