<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { formatRelativeTime } from '@/utils/date'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['image-preview'])

// 计算属性
const getNewsStatusTag = computed(() => {
  const news = props.detail
  if (news.pinned) return '置顶'
  if (news.hot) return '热门'
  if (news.new) return '最新'
  return null
})

const getNewsStatusTagClass = computed(() => {
  const news = props.detail
  if (news.pinned) return 'pinned'
  if (news.hot) return 'hot'
  if (news.new) return 'new'
  return ''
})

const getTagType = (tag) => {
  const tagColors = {
    '科研': 'primary',
    '通知': 'success',
    '活动': 'warning',
    '重要': 'error',
    '招聘': 'royal'
  }
  return tagColors[tag] || 'default'
}

const previewImage = () => {
  emit('image-preview', props.detail.cover)
}
</script>

<template>
  <view class="detail-header">
    <!-- 标题 -->
    <view class="news-title">{{detail.title}}</view>
    
    <!-- 发布信息 -->
    <view class="meta-info">
      <uni-tag 
        v-if="detail.tag" 
        :text="detail.tag" 
        :type="getTagType(detail.tag)" 
        size="small"
        customStyle="margin-right: 10rpx;"
      ></uni-tag>
      <view class="meta-item">
        <uni-icons type="person" size="16" color="#999"></uni-icons>
        <text class="meta-text">{{detail.author || '未知作者'}}</text>
      </view>
      <view class="meta-item">
        <uni-icons type="calendar" size="16" color="#999"></uni-icons>
        <text class="meta-text">{{formatRelativeTime(detail.publishTime)}}</text>
      </view>
      <view class="meta-item">
        <uni-icons type="eye" size="16" color="#999"></uni-icons>
        <text class="meta-text">{{detail.viewCount}}阅</text>
      </view>
    </view>
    
    <!-- 状态标签 -->
    <view v-if="getNewsStatusTag" class="status-badge" :class="getNewsStatusTagClass">
      {{ getNewsStatusTag }}
    </view>
    
    <!-- 封面图 -->
    <view v-if="detail?.cover" class="cover-container">
      <image 
        :src="detail.cover" 
        class="cover-image" 
        mode="aspectFill"
        @click="previewImage"
      />
      <view v-if="detail.imageCount > 1" class="image-count">
        <uni-icons type="image" size="16" color="#fff"></uni-icons>
        <text>{{detail.imageCount}}图</text>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.detail-header {
	padding: 40rpx 30rpx 30rpx;
	
	.news-title {
		font-size: 40rpx;
		font-weight: bold;
		color: $gray-8;
		line-height: 1.4;
		margin-bottom: 30rpx;
		
		.night-mode & {
			color: #e0e0e0;
		}
	}
	
	.meta-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 20rpx;
		
		.meta-item {
			display: flex;
			align-items: center;
			gap: 8rpx;
			
			.meta-text {
				font-size: 24rpx;
				color: $gray-5;
				
				.night-mode & {
					color: #999;
				}
			}
		}
	}
	
	.status-badge {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: #fff;
		margin-right: 10rpx;
		
		&.pinned {
			background: linear-gradient(135deg, #ff3b30, #ff6b6b);
		}
		
		&.hot {
			background: linear-gradient(135deg, #ff9500, #ffb347);
		}
		
		&.new {
			background: linear-gradient(135deg, #007AFF, #5AC8FA);
		}
	}
}

.cover-container {
	position: relative;
	padding: 0 30rpx 30rpx;
	
	.cover-image {
		width: 100%;
		height: 400rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background: $gray-1;
		
		.image-loading {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: $gray-1;
		}
	}
	
	.image-count {
		position: absolute;
		bottom: 40rpx;
		right: 40rpx;
		display: flex;
		align-items: center;
		gap: 4rpx;
		padding: 4rpx 12rpx;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		border-radius: 20rpx;
		font-size: 20rpx;
	}
}
</style>